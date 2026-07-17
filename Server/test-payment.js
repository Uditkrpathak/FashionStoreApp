import crypto from 'crypto';

// Load credentials
const RAZORPAY_KEY_SECRET = 'WobROJEs1lw9IfMvUUlTEAM0';
const GATEWAY_URL = 'http://localhost:5000/api/v1';

// Replace this with a real razorpayOrderId from an order created in your app
const razorpay_order_id = process.argv[2];
const razorpay_payment_id = 'pay_' + Math.random().toString(36).substring(2, 11).toUpperCase();

if (!razorpay_order_id) {
  console.log('\n❌ Error: Please provide a razorpay_order_id.');
  console.log('Usage: node test-payment.js <razorpay_order_id>\n');
  process.exit(1);
}

// Generate valid cryptographic signature using HMAC-SHA256
const shasum = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
const razorpay_signature = shasum.digest('hex');

console.log(`\nGenerating Mock Payment:`);
console.log(`- Order ID:      ${razorpay_order_id}`);
console.log(`- Payment ID:    ${razorpay_payment_id}`);
console.log(`- Signature:     ${razorpay_signature}`);

// Verify payment on local Gateway
async function testVerification() {
  try {
    const response = await fetch(`${GATEWAY_URL}/orders/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      })
    });
    
    const data = await response.json();
    if (response.ok && data.success) {
      console.log('\n✅ Success! Payment verified and order updated on backend.');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('\n❌ Failed verification:', data);
    }
  } catch (error) {
    console.error('\n❌ Request error:', error.message);
  }
}

testVerification();
