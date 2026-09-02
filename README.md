# EMD - Environmental Monitoring Dashboard

EMD (Environmental Monitoring Dashboard) adalah sebuah platform pemantauan cuaca dan lingkungan secara *real-time* untuk kawasan hiper-lokal (fokus area Palembang, Sumatera Selatan). 

Sistem ini menampilkan dan menganalisis data metrik lingkungan yang dikirimkan langsung oleh perangkat sensor IoT (seperti sensor **BME280**, **DHT**, dan **BH1750**). Aplikasi web ini dirancang dengan prinsip *"The Command Center"* — menitikberatkan pada penyajian data sensor secara mentah, cepat, tanpa manipulasi, dan visualisasi tren historis yang jelas bagi peneliti, akademisi, hingga teknisi perangkat IoT.

---

## 🌟 Fitur Utama

- **Pemantauan Real-Time**: Integrasi *live* dengan Supabase WebSockets untuk mendengarkan *insert events* (data sensor baru) secara instan.
- **Multistasiun Sensor**:
  - **Stasiun 1**: Menampilkan data Suhu, Kelembapan, dan Tekanan Udara (BME280).
  - **Stasiun 2**: Menampilkan data Suhu, Kelembapan, dan Intensitas Cahaya (DHT & BH1750).
- **Analisis Tren Historis**: Visualisasi grafik interaktif menggunakan **Recharts** untuk mendiagnosis tren cuaca dalam rentang waktu tertentu.
- **Responsif & Aksesibel**: Layout 3-kolom untuk Desktop yang luas, dan navigasi *Off-Canvas Sidebar* yang efisien untuk perangkat *Mobile*. Menggunakan desain antarmuka yang bersih dengan *Floating Header*.
- **Sistem Desain Kokoh**: Dikelola dengan aturan token desain yang ketat (menggunakan *CSS Variables* terpusat) agar UI konsisten dan mendukung perombakan *theme* dengan mudah di masa depan.

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Backend / Database:** [Supabase](https://supabase.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Styling:** CSS Variables murni dengan utilitas khusus.
- **Desain & Standar UI:** Dikelola menggunakan pedoman `DESIGN.md` & `PRODUCT.md`.

## 🚀 Panduan Instalasi (Development)

### 1. Prasyarat
- Node.js (versi 16+ disarankan)
- NPM atau Yarn
- Akun Supabase dan proyek database yang sudah dikonfigurasi.

### 2. Kloning Repositori
```bash
git clone https://github.com/username/weather-monitoring-dashboard.git
cd weather-monitoring-dashboard
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Buat file `.env` di *root* proyek (atau `.env.local`) dan tambahkan kredensial Supabase Anda. 
```env
VITE_SUPABASE_URL=https://<PROJECT_ID>.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
```

### 5. Menjalankan Development Server
```bash
npm run dev
```
Buka peramban dan akses `http://localhost:5173` (atau *port* yang diberikan oleh Vite) untuk melihat dashboard.

## 🗄️ Struktur Database (Supabase)

Aplikasi ini bergantung pada dua tabel utama untuk beroperasi:
1. `sensor_data` (Tabel untuk Stasiun 1 - BME280)
2. `station_2_data` (Tabel untuk Stasiun 2 - DHT & BH1750)

Keduanya diwajibkan memiliki kolom pembacaan data yang sesuai (*temperature*, *humidity*, *parameter3*) dan atribut *timestamp* untuk dipetakan ke dalam bagan.

## 🎨 Pedoman Desain (Design System)

Proyek ini menggunakan panduan desain terpusat. Apabila Anda ingin menambahkan fitur atau memodifikasi komponen UI, harap merujuk ke:
- `DESIGN.md`: Untuk aturan aksesibilitas, palet warna, tipografi, kelengkungan *border-radius*, dan tata letak UI.
- `PRODUCT.md`: Untuk memahami visi produk dan prinsip-prinsip pengembangan (*"The Command Center"*).

## 📄 Lisensi

Hak Cipta &copy; EMD - Environmental Monitoring Dashboard. Palembang, Sumatera Selatan.
