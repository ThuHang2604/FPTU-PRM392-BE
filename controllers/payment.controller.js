const qs = require('qs');
const crypto = require('crypto');
const moment = require('moment');
require('dotenv').config();
const db = require('../models');

exports.createPayment = async (req, res) => {
    console.log('req.user:', req.user);
  try {
    const userId =  req.user.userId;
    const shippingAddress = req.body?.shippingAddress || '';

    const cart = await db.Cart.findOne({
      where: { UserID: userId },
      include: db.CartItem,
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('HHmmss');

    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    const amount = cart.TotalPrice;

    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'Thanh toan don hang',
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    const sortedParams = sortObject(vnpParams);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');
    sortedParams.vnp_SecureHash = signed;
    const paymentUrl = `${vnpUrl}?${qs.stringify(sortedParams, { encode: false })}`;

    // Tạm lưu shippingAddress nếu muốn
    res.json({ paymentUrl });
  } catch (err) {
    console.error('Create payment error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

exports.vnpayReturn = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const secretKey = process.env.VNP_HASH_SECRET;
    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
      return res.status(400).send('Checksum failed');
    }

    // ✔ Nếu hợp lệ → Lưu đơn hàng
    const userId = 1; // (ở đây bạn có thể truyền thêm userId qua vnp_OrderInfo để xác định)
    const cart = await db.Cart.findOne({ where: { UserID: userId }, include: db.CartItem });

    if (!cart) return res.status(400).json({ message: 'Cart not found' });

    const order = await db.Order.create({
      UserID: userId,
      CartID: cart.CartID,
      OrderStatus: 'paid',
    });

    // Lưu từng chi tiết đơn hàng
    for (const item of cart.CartItems) {
      await db.OrderDetail.create({
        OrderID: order.OrderID,
        ProductID: item.ProductID,
        Price: item.Price,
      });
    }

    // Tạo bản ghi Payment
    await db.Payment.create({
      OrderID: order.OrderID,
      Amount: cart.TotalPrice,
      PaymentStatus: 'paid',
    });

    res.send('Thanh toán thành công. Đơn hàng đã được ghi nhận.');
  } catch (err) {
    console.error('VNPay return error:', err);
    res.status(500).json({ message: 'Lỗi xác nhận thanh toán' });
  }
};

exports.getPaymentInfo = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Tìm đơn hàng gần nhất của user
    const latestOrder = await db.Order.findOne({
      where: { UserID: userId },
      order: [['OrderDate', 'DESC']],
      include: [
        {
          model: db.OrderDetail,
          include: {
            model: db.Product,
            attributes: ['ProductName', 'ImageURL', 'Price']
          }
        },
        {
          model: db.Payment,
        }
      ]
    });

    if (!latestOrder) {
      return res.status(404).json({ message: 'No orders found' });
    }

    const items = latestOrder.OrderDetails.map(detail => ({
      productId: detail.ProductID,
      productName: detail.Product.ProductName,
      imageUrl: detail.Product.ImageURL,
      price: detail.Price,
    }));

    res.json({
      orderId: latestOrder.OrderID,
      status: latestOrder.OrderStatus,
      orderDate: latestOrder.OrderDate,
      paymentStatus: latestOrder.Payment?.PaymentStatus || 'unknown',
      amount: latestOrder.Payment?.Amount || 0,
      items
    });

  } catch (err) {
    console.error('getPaymentInfo error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

