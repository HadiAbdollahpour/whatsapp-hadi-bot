// HadiCuphoria WhatsApp Bot
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

const { Client, LocalAuth } = pkg;

// ربات واتساپ با ذخیره احراز در پوشه session
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox'] }
});

// اگر فایل CSV نیست درستش کن
const csvWriter = createObjectCsvWriter({
  path: 'orders.csv',
  header: [
    { id: 'name', title: 'نام' },
    { id: 'order', title: 'سفارش' },
    { id: 'time', title: 'زمان' }
  ],
  append: true
});

// تولید QR در ترمینال
client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log('📱 واتساپ خود را با این QR اسکن کن');
});

// وقتی احراز هویت شد
client.on('ready', () => console.log('✅ ربات واتساپ فعال شد.'));

// وقتی پیام رسید
client.on('message', async msg => {
  if (msg.body.startsWith('/start')) {
    msg.reply('سلام 👋 به ربات فروشگاه لوازم یکبار مصرف و قنادی هادی خوش آمدید.');
    return;
  }

  // ذخیره پیام به عنوان سفارش
  const orderData = [{
    name: msg._data.notifyName || msg.from,
    order: msg.body,
    time: new Date().toLocaleString('fa-IR')
  }];

  await csvWriter.writeRecords(orderData);
  msg.reply('✅ سفارش شما ذخیره شد، ممنون از خرید شما 🍰');
});

client.initialize();
