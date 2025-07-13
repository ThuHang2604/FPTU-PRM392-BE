const { client, paypal } = require('../utils/paypal.helper');
const db = require('../models');

exports.createPaypalOrder = async (req, res) => {
  try {
    const userId = req.user.userId; // Xác thực token vẫn cần

    const cart = await db.Cart.findOne({ where: { UserID: userId }, include: db.CartItem });
    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = Number(cart.TotalPrice || 0).toFixed(2); // USD format

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: process.env.PAYPAL_CURRENCY || 'USD',
          value: total
        },
        description: `Thanh toán đơn hàng của userId=${userId}`
      }],
      application_context: {
        return_url: `${process.env.SERVER_URL}/api/payment/paypal-success?userId=${userId}`,
        cancel_url: `${process.env.SERVER_URL}/api/payment/paypal-cancel`
      }
    });

    const order = await client.execute(request);
    res.json({ id: order.result.id, links: order.result.links });

  } catch (error) {
    console.error("❌ PayPal create order error:", error);
    res.status(500).json({ message: "Error creating PayPal order" });
  }
};

exports.capturePaypalOrder = async (req, res) => {
  try {
    const { token, userId } = req.query;

    if (!token || !userId) {
      return res.status(400).json({ message: "Missing token or userId" });
    }

    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    captureRequest.requestBody({});

    const capture = await client.execute(captureRequest);

    const cart = await db.Cart.findOne({ where: { UserID: userId }, include: db.CartItem });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const order = await db.Order.create({
      UserID: userId,
      CartID: cart.CartID,
      OrderStatus: "paid",
    });

    for (const item of cart.CartItems) {
      await db.OrderDetail.create({
        OrderID: order.OrderID,
        ProductID: item.ProductID,
        Price: item.Price,
      });
    }

    await db.Payment.create({
      OrderID: order.OrderID,
      Amount: cart.TotalPrice,
      PaymentStatus: "paid",
      TransactionRef: capture.result.id,
      RawPaypalData: JSON.stringify(capture.result),
    });

    res.send("✅ Thanh toán PayPal thành công. Đơn hàng đã được ghi nhận.");
  } catch (error) {
    console.error("❌ PayPal capture error:", error);
    res.status(500).json({ message: "Error capturing PayPal payment" });
  }
};
