// Quick test to verify Stripe integration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testSetup() {
  console.log('🔍 Testing Stripe Setup...\n');

  try {
    // 1. Check products
    const products = await stripe.products.list({ limit: 5 });
    console.log('✅ Products found:', products.data.length);
    
    // 2. Check prices
    const prices = await stripe.prices.list({ limit: 10 });
    console.log('✅ Prices found:');
    prices.data.forEach(price => {
      console.log(`   ${price.id}: $${price.unit_amount/100} ${price.currency} (${price.recurring?.interval || 'one-time'})`);
    });

    // 3. Test webhook endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'ping' })
    });
    
    console.log(`\n🔗 Webhook endpoint status: ${response.status}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSetup();