const qs = require("qs");
const crypto = require("crypto");
const moment = require("moment");
require("dotenv").config();
const db = require("../models");

exports.createPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await db.Cart.findOne({
      where: { UserID: userId },
      include: db.CartItem,
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const orderId = moment(date).format("HHmmss");
    let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress;
    if (ipAddr === "::1" || ipAddr.includes("::")) ipAddr = "127.0.0.1";

    const amount = Number(cart.TotalPrice);

    const vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: process.env.VNP_TMN_CODE,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan don hang cua userId=${userId}`,
      vnp_OrderType: "other",
      vnp_Amount: Math.round(amount * 100),
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    console.log("🔍 vnp_CurrCode from .env =", process.env.VNP_CURRENCY);
    console.log("📍 Before sortObject vnpParams.vnp_CurrCode =", vnpParams.vnp_CurrCode);

    const sortedParams = sortObject(vnpParams);

    console.log("📍 After sortObject sortedParams.vnp_CurrCode =", sortedParams.vnp_CurrCode);

    const signData = qs.stringify(sortedParams, { encode: false });
    const signed = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    sortedParams.vnp_SecureHashType = "SHA512";
    sortedParams.vnp_SecureHash = signed;

    // Build query string manually to avoid VVND issue
    const buildQueryString = (obj) => {
      return Object.entries(obj)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
    };

    const paymentUrl = `${process.env.VNP_URL.trim()}?${buildQueryString(sortedParams)}`;

    console.log("🔐 [VNPay] signData =▶", signData);
    console.log("🔐 [VNPay] signed    =▶", signed);
    console.log("➡️ [VNPay] Payment URL =", paymentUrl);
    console.log("✅ CurrCode Before Stringify:", sortedParams.vnp_CurrCode);
    console.log("🚨 FINAL PARAMS:", sortedParams);
    console.log("🧪 URL PARAM STRING:", buildQueryString(sortedParams));
    console.log("👉", process.env.VNP_URL, "👈");
    console.log("✅ Length of CurrCode:", vnpParams.vnp_CurrCode.length);
    console.log("📦 Raw vnp_CurrCode =", JSON.stringify(process.env.VNP_CURRENCY));

    res.json({ paymentUrl });
  } catch (err) {
    console.error("❌ createPayment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Callback from VNPay after user payment
exports.vnpayReturn = async (req, res) => {
  try {
    const params = { ...req.query };
    const secureHash = params.vnp_SecureHash;
    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;

    const sorted = sortObject(params);
    const signData = qs.stringify(sorted, { encode: false });
    const signed = crypto
      .createHmac("sha512", process.env.VNP_HASH_SECRET)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    console.log("🧾 [VNPay] Callback signData =", signData);
    console.log("🧾 [VNPay] Callback signed   =", signed);
    console.log("🧾 [VNPay] Received params   =", req.query);

    if (secureHash !== signed) {
      return res.status(400).send("Checksum failed");
    }

    const info = params.vnp_OrderInfo;
    const match = info.match(/userId=(\d+)/);
    const userId = match ? +match[1] : null;

    if (!userId) return res.status(400).json({ message: "Invalid OrderInfo" });

    const cart = await db.Cart.findOne({
      where: { UserID: userId },
      include: db.CartItem,
    });
    if (!cart) return res.status(400).json({ message: "Cart not found" });

    const order = await db.Order.create({
      UserID: userId,
      CartID: cart.CartID,
      OrderStatus: "paid",
    });

    for (const it of cart.CartItems) {
      await db.OrderDetail.create({
        OrderID: order.OrderID,
        ProductID: it.ProductID,
        Price: it.Price,
      });
    }

    await db.Payment.create({
      OrderID: order.OrderID,
      Amount: cart.TotalPrice,
      PaymentStatus: "paid",
      TransactionRef: params.vnp_TxnRef,
      BankCode: params.vnp_BankCode,
      PayDate: moment(params.vnp_PayDate, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss"),
      ResponseCode: params.vnp_ResponseCode,
      RawVnPayData: JSON.stringify(req.query),
    });

    res.send("✅ Thanh toán thành công. Đơn hàng đã được ghi nhận.");
  } catch (err) {
    console.error("❌ vnpayReturn error:", err);
    res.status(500).json({ message: "Payment confirmation error" });
  }
};

// Helper to sort object by keys
function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((k) => (sorted[k] = obj[k]));
  return sorted;
}
