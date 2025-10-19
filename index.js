// index.js
import pkg from 'whatsapp-web.js';
import fs from 'fs';
import qrcode from 'qrcode';
import csvWriter from 'csv-writer';

const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth(), // keeps session even after restart
});

client.on('qr', async (qr) => {
  const dataUrl = await qrcode.toDataURL(qr);
  console.log('📱 واتساپ خود را با این QR اسکن کن (کپی کن داخل مرورگر تا تصویر کامل ببینی):');
  console.log(dataUrl);
});

client.on('ready', () => {
  console.log('✅ Client is ready! ربات واتساپ فعال شد.');
});

client.on('message', async (message) => {
  const content = message.body;
  const from = message.from;

  // ذخیره در CSV
  const path = 'orders.csv';
  const line = `${new Date().toISOString()},${from},${JSON.stringify(content)}\n`;
  fs.appendFileSync(path, line);
  console.log('سفارش ذخیره شد:', content);

  // پاسخ خودکار ساده
  await message.reply('سفارش دریافت شد ✅');
});

client.initialize();
