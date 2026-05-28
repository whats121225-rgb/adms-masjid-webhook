const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

// Ambil URL Google Apps Script dari pengaturan awan (Environment Variable)
const GAS_WEBHOOK_URL = process.env.GAS_WEBHOOK_URL;

app.use(bodyParser.text({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));

// 1. JALUR REKONSILIASI: Sinyal perkenalan saat mesin ZKTeco pertama kali terhubung ke WiFi
app.get('/iclock/cdata', (req, res) => {
  console.log(`[ADMS] Mesin terhubung. SN: ${req.query.SN}`);
  // Membalas pesan wajib khas ADMS agar mesin tahu server ini aktif
  res.send("OK\n");
});

// 2. JALUR TRANSAKSI: Sinyal yang dikirim mesin SETIAP KALI ada jamaah tap jari
app.post('/iclock/cdata', async (req, res) => {
  const rawData = req.body.toString();
  console.log("[ADMS] Menerima data mentah dari mesin:\n", rawData);

  // Cari baris yang berisi data absensi (Khas mesin ZKTeco memakai pemisah TAB atau spasi)
  // Contoh format mentah ADMS: 101   2026-05-28 04:45:00   0   0
  const barisData = rawData.split('\n');
  
  for (let baris of barisData) {
    if (baris.trim() && !baris.startsWith('-')) {
      const kolom = baris.split(/\s+/); // Pecah berdasarkan spasi/TAB
      
      // Validasi struktur data minimal berisi ID dan Waktu
      if (kolom.length >= 2) {
        const idJamaah = kolom[0];
        const timestamp = kolom[1] + " " + kolom[2]; // Gabungkan Tanggal + Jam

        console.log(`[ADMS TRANSLATOR] Mengirim ke GAS -> ID: ${idJamaah}, Waktu: ${timestamp}`);

        // Tembakkan langsung ke Web App Google Apps Script Anda!
        if (GAS_WEBHOOK_URL) {
          try {
            await axios.post(GAS_WEBHOOK_URL, {
              rawId: idJamaah,
              rawTimestamp: timestamp
            });
            console.log(`[GAS SUCCESS] Data ID ${idJamaah} berhasil diteruskan ke Google Sheets.`);
          } catch (error) {
            console.error("[GAS ERROR] Gagal mengirim ke Google Apps Script:", error.message);
          }
        } else {
          console.warn("[WARNING] URL GAS belum diisi di Environment Variables Render!");
        }
      }
    }
  }

  // Berikan respon balik ke mesin bahwa data sudah aman diterima server
  res.send("OK\n");
});

// Jalankan server internet
app.listen(PORT, () => {
  console.log(`ADMS Server Online di Port ${PORT}`);
});
