---
name: EMD - Environmental Weather Dashboard
description: Real-time environmental monitoring dashboard for hyper-local sensor data.
colors:
  primary: "#4e73df"
  brand-accent: "#284aa1"
  temperature-alert: "#d39e00"
  chart-success: "#1cc88a"
  chart-info: "#36b9cc"
  neutral-bg: "#f8f9fc"
  neutral-surface: "#ffffff"
  neutral-border: "#eaecf4"
  neutral-border-dark: "#cccccc"
  neutral-text: "#333333"
  neutral-text-muted: "#888888"
typography:
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "14px"
  xs: "12px"
  sm: "13px"
  md: "14px"
  lg: "16px"
  xl: "18px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "20px"
  pill: "50px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  floating-header:
    backgroundColor: "{colors.brand-accent}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  station-dropdown:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "6px 35px 6px 16px"
---

# Design System: EMD - Environmental Weather Dashboard

## Overview

**Creative North Star: "The Command Center"**

Tegas, fungsional, dan berorientasi pada data murni. Aplikasi ini bertindak sebagai pusat kendali untuk memantau data cuaca sensor lokal tanpa ornamen atau hiasan visual yang berlebihan. Desain memprioritaskan efisiensi ruang layar, dengan hirarki visual yang dibangun agar angka-angka real-time dapat diidentifikasi secara instan.

**Key Characteristics:**
- **Segar & Modern:** Memanfaatkan kontras tinggi antara latar belakang terang dan aksen biru yang memberikan kesan bersih.
- **Tegas dan Membulat Halus:** Menggunakan siluet kapsul (pill) yang modern pada elemen pengontrol navigasi tanpa menghilangkan sifat fungsional aplikasi.
- **Utilitarian:** Semua bentuk bayangan (*shadow*) atau batas difungsikan khusus sebagai pemisah data, bukan sekadar dekorasi.

## Colors

Palet didominasi oleh latar belakang putih/abu-abu terang yang dipadukan dengan aksen biru cerah agar data tampil secara prima.

### Primary
- **Dashboard Blue** (#4e73df): Aksen utama pada teks interaktif, *hover states*, atau elemen *highlight* sekunder.
- **Header Deep Blue** (#284aa1): Warna latar belakang utama pada *Floating Header* yang menciptakan fokus kuat di tengah layar.

### Secondary
- **Temperature Mustard** (#d39e00): Digunakan secara eksklusif sebagai indikator khusus metrik suhu, membedakannya secara instan dari metrik lainnya.

### Neutral
- **Background Wash** (#f8f9fc): Warna dominan pada area konten (*body background*) untuk melembutkan ketegangan visual pada layar putih.
- **Card Surface** (#ffffff): Latar belakang bersih untuk tabel, dropdown, dan metrik cuaca utama.
- **Divider Gray** (#eaecf4): Garis pemisah antar statistik tanpa mengganggu keterbacaan data utama.
- **Primary Text** (#333333): Teks pada kontrol dropdown dan informasi padat.
- **Muted Text** (#888888): Untuk navigasi pasif atau informasi sekunder seperti tanggal.

## Typography

**Body Font:** system-ui, -apple-system, sans-serif

**Character:** Standard, cepat di-render, dan sangat mudah terbaca di lingkungan dashboard yang padat angka.

### Hierarchy
- **Title** (18px, bold): Identitas *brand* EMD.
- **Body** (14px): Informasi teks standar, navigasi footer, dan label dropdown.
- **Label** (13px, bold, 600): Digunakan pada *time display* dan detail stasiun untuk menegaskan entitas data singkat.

## Layout

Aplikasi menggunakan pendekatan `max-width: 1400px` untuk membingkai ruang pusat yang aman. Pada desktop (>= 1200px), kartu metrik disejajarkan dalam porsi ketiga (`33.333%`), sedangkan pada mobile (< 768px), elemen navigasi berpindah ke *off-canvas sidebar* dan kontainer memanfaatkan hampir seluruh lebar layar dengan kompensasi *padding* tambahan di bagian atas untuk ruang *Floating Header*.

## Elevation & Depth

Desain menggunakan kombinasi lapisan bayangan (shadow) halus untuk memisahkan lapisan kontrol global dari lapisan konten data.

### Shadow Vocabulary
- **Floating Controls** (`box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2)`): Efek mengambang tebal eksklusif untuk *Floating Header*, memberikan kesan "di atas dari segalanya".
- **Table Sticky Header** (`box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1)`): Bayangan sangat tipis untuk menegaskan batas tabel ketika baris di-scroll ke bawah.
- **Mobile Sidebar** (`box-shadow: 4px 0 10px rgba(0,0,0,0.5)`): Efek bayangan berat untuk laci *off-canvas*.

## Shapes

Bentuk didominasi oleh perpaduan kapsul lengkung penuh untuk elemen kendali, serta bentuk kotak fungsional bersudut lembut untuk penyajian data.

- **Pill (50px / 20px):** Diterapkan pada *Floating Header* dan *Dropdown* stasiun untuk memberi kesan ramah dan modern.
- **Soft Border (4px):** Latar belakang *wrapper* logo untuk struktur yang rapi.

## Components

### Floating Header
- **Shape:** Pill radius (50px).
- **Background:** Header Deep Blue (#284aa1) dengan border tipis (#333333).
- **Shadow:** Tampil menonjol dengan bayangan tegas.
- **Behavior:** Tersemat (fixed) melayang 20px dari bagian atas browser.

### Station Dropdown
- **Shape:** Pill radius menengah (20px).
- **Background:** Putih bersih (#ffffff) dengan batas (#cccccc).
- **Behavior:** Memiliki panah murni dari *CSS border* dan menghapus efek panah OS bawaan (*appearance: none*).

### Metric Cards
- **Border:** Pemisah antar metrik (*Divider Gray*) di sebelah kanan pada desktop, atau di sebelah bawah pada versi mobile.

## Do's and Don'ts

### Do:
- **Do** pertahankan *border-radius* 50px pada *Floating Header* baik di versi desktop maupun mobile untuk konsistensi bahasa bentuk ("Tegas dan Membulat Halus").
- **Do** sajikan angka sensor secara instan tanpa animasi dekoratif panjang yang memperlambat akses ke data *real-time*.

### Don't:
- **Don't** hilangkan batas kontras pada *Floating Header* agar elemen tersebut tidak menyatu (hilang) ketika bergesekan dengan konten.
- **Don't** tambahkan terlalu banyak warna primer lain. Biru tua khusus untuk kerangka navigasi, biru standar untuk aksi, dan mustard untuk indikator suhu.

