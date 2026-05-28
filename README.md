# 🕌 ADMS Webhook - Sistem Absensi Masjid

Repositori ini adalah aplikasi jembatan (webhook) berbasis **Node.js** yang berfungsi untuk menghubungkan mesin fingerprint **ZKTeco (ADMS)** dengan **Google Apps Script (GAS)**. 

Aplikasi ini didesain 100% *stand-alone* tanpa memerlukan laptop/komputer yang menyala 24 jam di masjid.

## ⚙️ Fitur Utama
* Menangkap sinyal HTTP dari protokol ADMS (Mesin ZKTeco UAB860 dll).
* Menerjemahkan data *raw* ADMS menjadi JSON.
* Meneruskan (*forward*) data ID Jamaah dan Waktu (Timestamp) ke Web App URL Google Apps Script.
* Memicu sistem *Streak* (Beruntun) dan pengiriman notifikasi WhatsApp ke jamaah.

## 🚀 Cara Penggunaan (Deploy)
Aplikasi ini dioptimalkan untuk berjalan di platform cloud gratis seperti **Render.com**.
1. Hubungkan repositori ini ke akun Render Anda sebagai **Web Service**.
2. Pada bagian *Environment Variables* di Render, tambahkan variabel berikut:
   * **Key:** `GAS_WEBHOOK_URL`
   * **Value:** `https://script.google.com/macros/s/xxxx/exec` (Ganti dengan URL Google Apps Script Anda)
3. Deploy!

## 📡 Pengaturan di Mesin ZKTeco
Setelah server aktif di Render, atur mesin fingerprint melalui menu:
**COMM -> Cloud Server Setting (ADMS)**
* **Server Address:** `[nama-aplikasi-anda].onrender.com` (Tanpa https://)
* **Server Port:** `80` atau `443`
* **Enable Proxy:** Off

---
*Dibuat untuk mendukung keistiqomahan jamaah menjaga shalat subuh berjamaah.* ✨
