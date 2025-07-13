const paypal = require('@paypal/checkout-server-sdk');

const environment = process.env.PAYPAL_MODE === 'live'
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

console.log("🛠 PAYPAL_CLIENT_ID =", process.env.PAYPAL_CLIENT_ID);
console.log("🛠 PAYPAL_CLIENT_SECRET =", process.env.PAYPAL_CLIENT_SECRET);
console.log("🛠 PAYPAL_MODE =", process.env.PAYPAL_MODE);

module.exports = { paypal, client };
