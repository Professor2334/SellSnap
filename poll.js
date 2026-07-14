const { loadEnvConfig } = require('@next/env');
loadEnvConfig('./');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function run() {
  const order = await db.order.findFirst({ orderBy: { createdAt: 'desc' } });
  if (!order) return console.log('No orders');
  
  const tx_ref = order.transactionReference;
  console.log('Found order tx_ref:', tx_ref);
  
  const res = await fetch('https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=' + tx_ref, {
    headers: { Authorization: 'Bearer ' + process.env.FLW_SECRET_KEY }
  });
  const data = await res.json();
  
  if (data.status !== 'success') {
    return console.log('Init verify failed:', data);
  }
  
  const id = data.data.id;
  console.log('transaction_id:', id);
  
  let attempts = 0;
  console.log('Polling every 5 seconds for 2 minutes...');
  const interval = setInterval(async () => {
    attempts++;
    try {
      const pollRes = await fetch('https://api.flutterwave.com/v3/transactions/' + id + '/verify', {
        headers: { Authorization: 'Bearer ' + process.env.FLW_SECRET_KEY }
      });
      const pollData = await pollRes.json();
      
      if (pollData.data) {
        const d = pollData.data;
        console.log(`[Attempt ${attempts}] status: ${d.status}, processor_response: '${d.processor_response}', payment_type: ${d.payment_type}, amount: ${d.amount}, tx_ref: ${d.tx_ref}`);
      } else {
        console.log(`[Attempt ${attempts}] No data returned`, pollData);
      }
    } catch (e) {
      console.log(`[Attempt ${attempts}] Error:`, e.message);
    }
    
    if (attempts >= 24) {
      clearInterval(interval);
      process.exit(0);
    }
  }, 5000);
}

run();
