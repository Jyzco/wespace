# WeSpace 🌸✨
> **Intimate Shared Virtual Sanctuary for Couples**  
> Built with **React Native (Expo SDK 58)**, **TypeScript**, **Expo Router**, and **Gemini 3.8 Flash**.

---

## 📖 Tentang WeSpace

**WeSpace** adalah aplikasi mobile ruang privat bersama untuk pasangan kekasih/suami-istri. Menggabungkan romantisme sehari-hari, merawat hewan virtual bersama, transparansi finansial 50/50, scrapbook kenangan polaroid berbalut AI diary, dan ruang santai interaktif:

1. **Dashboard & Live Locket 📸**:
   - Penghitung hari bersama (*Journey Day Counter*).
   - Indikator status kehadiran & mood real-time kedua pasangan.
   - Live 24-Hour Locket Snap dengan reaksi emoji langsung.
   - *Daily Deep Talk Question* dari Gemini 3.8 Flash.

2. **Nest Treasury (Keuangan Bersama) 💳**:
   - Pencatatan pengeluaran (*ledger*) bersama.
   - Kalkulator bagi rata (*50/50 Debt Settlement*) otomatis dengan fitur pelunasan 1-klik.
   - Grafik distribusi kategori pengeluaran (*Food, Dates, Living, Travel, Gifts*).
   - Target tabungan kolaboratif (*Savings Goals*) dengan progress bar.
   - *Financial Co-pilot AI* yang memberikan rekomendasi kencan hemat nan romantis.

3. **Virtual Pet Companion (Tamagotchi/Pou) 🐾**:
   - Karakter Pou/Kentang interaktif berbasis SVG murni (4 spesies: Kucing, Anjing, Burung, Kelinci).
   - Lemari pakaian & aksesoris (*Crown, Witch Hat, Ribbon, Glasses, Scarf, Flowers*).
   - Mesin vitalitas 5 parameter (*Hunger, Happiness, Energy, Cleanliness, Health*).
   - Fitur *Belly Rub* / usap layar interaktif untuk bikin pet senang.
   - Sistem Level & XP dari aktivitas merawat bersama.

4. **Scrapbook & AI Diary 📖**:
   - Dinding polaroid bergaya *washi-tape* dengan kemiringan fisik acak (*physics tilts*).
   - AI Romantic Digest generator menggunakan model modern **Gemini 3.8 Flash**.
   - Koleksi Antologi Diary tersimpan rapi.

5. **Cozy Living Room & Panggilan Suara 🛋️**:
   - Lobby panggilan suara bergaya WhatsApp dengan durasi panggilan real-time.
   - Api unggun dinamis (*animated dual-layer canvas fireplace*) dengan kontrol kehangatan.
   - Ambient Soundscape Mixer 4-channel (*Rain on Window, Crackling Hearth, Coffee Shop, Forest Night*).
   - Sticky Notes pesan cinta di dinding ruang tamu.

6. **Fitur Romantis Ekstra 💕**:
   - **Surat Cinta Bersegel Lilin (Wax-Sealed Love Letters)** dengan AI Love Letter Writer.
   - **Kupon Cinta (Love Coupons)** yang bisa diklaim (*Breakfast in Bed, Free Back Massage, Date Night Pass, No Arguing Token*).
   - **Toples Kencan (Date Night Jar)** kocok toples untuk ide kencan acak + Couple Bucket List.
   - **Full-Screen Heart Hug** dengan sinkronisasi haptic feedback.

---

## 🚀 Cara Menjalankan di PC

### Prasyarat:
- [Node.js](https://nodejs.org/) (versi LTS v18+)
- [Git](https://git-scm.com/)
- Aplikasi **Expo Go** di HP (Android/iOS) atau Emulator Android/iOS.

### 1. Clone Repository:
```bash
git clone https://github.com/Jyzco/wespace.git
cd wespace
```

### 2. Install Dependensi:
```bash
npm install
```

### 3. Jalankan Aplikasi:
```bash
npx expo start
```

### 4. Buka di Perangkat:
- **Di HP (Paling Direkomendasikan)**: Buka aplikasi **Expo Go**, lalu scan QR code yang muncul di terminal/browser.
- **Di Web**: Tekan tombol `w` di terminal untuk menjalankan versi web.
- **Di Android Emulator**: Tekan tombol `a` di terminal.
- **Di iOS Simulator (Mac)**: Tekan tombol `i` di terminal.

---

## 🛠️ Tech Stack & Arsitektur

- **Framework**: [Expo SDK 58](https://expo.dev/) (React Native 0.83+)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation di `src/app/`)
- **Bahasa**: TypeScript (Strict type checking)
- **State Management**: React Context (`WeSpaceContext`) + `@react-native-async-storage/async-storage`
- **Animasi & Grafis**: `react-native-svg` (Procedural canvas, Pou Pet, Fireplace, Polaroid frames)
- **AI Engine**: Google Gemini API (**Gemini 3.8 Flash** via modern Interactions API schema)
- **Icons**: `lucide-react-native`
- **Desain & Tema**: Warm Romantic Aesthetic (Soft Cream, Rose Gold, Warm Amber, Sage Green)

---

## 🔒 Konfigurasi Gemini AI (Opsional)

Secara bawaan, aplikasi sudah dilengkapi *procedural engine* lokal sehingga **semua fitur tetap berjalan 100% tanpa API Key**.

Jika ingin mengaktifkan generasi teks asli dari Gemini 3.8 Flash:
1. Buka icon **Settings (⚙️)** di pojok kanan atas Header aplikasi.
2. Masukkan **Google Gemini API Key** Anda.
3. Klik **Save Settings**. Kunci disimpan secara privat dan aman di penyimpanan lokal perangkat (*AsyncStorage*).

---

Dibuat dengan ❤️ untuk pasangan yang ingin selalu terhubung di mana pun berada.
