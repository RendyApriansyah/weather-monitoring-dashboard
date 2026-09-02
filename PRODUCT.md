# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Peneliti / Akademisi yang membutuhkan data historis cuaca lokal.
- Admin / Teknisi yang mengelola perangkat IoT (sensor).
- Masyarakat umum di sekitar Palembang yang memantau kondisi cuaca.

## Product Purpose
Menyediakan pemantauan kondisi lingkungan (suhu, kelembapan, tekanan udara, dan intensitas cahaya) secara real-time langsung dari perangkat sensor IoT, serta memfasilitasi analisis tren historis.

## Positioning
Mengandalkan data langsung dari perangkat IoT lokal yang memberikan tingkat akurasi dan relevansi hiper-lokal (Palembang) dibandingkan perkiraan dari aplikasi cuaca global atau publik.

## Operating Context
Diakses melalui peramban (desktop maupun mobile) untuk mengevaluasi data cuaca saat ini dan menarik kesimpulan dari riwayat data yang direkam selama beberapa periode waktu.

## Capabilities and Constraints
- Wajib menggunakan Supabase sebagai backend.
- Harus kompatibel dan mendemonstrasikan metrik dari sensor BME280 (Stasiun 1) serta DHT & BH1750 (Stasiun 2).
- Struktur tabel database telah tetap (`sensor_data` dan `station_2_data`).

## Brand Commitments
- Nama Produk: EMD (Enviromental Weather Dashboard).
- Logo: Menggunakan `/websitelogo.svg`.

## Evidence on Hand
- Integrasi *real-time* Supabase (insert events).
- Implementasi grafik garis (Recharts) yang menangani rentang interval waktu.
- Teks footer yang mencantumkan "Palembang, Sumatera Selatan" dan hak cipta.

## Product Principles
- **Akurasi & Transparansi:** Tampilkan data sensor secara mentah dan cepat tanpa manipulasi.
- **Keterbacaan Instan:** Nilai *real-time* harus menonjol dan dapat dibaca dalam sekali lihat.
- **Analisis Mendalam:** Sediakan visualisasi tren historis yang jelas bagi peneliti atau teknisi untuk diagnosis.

