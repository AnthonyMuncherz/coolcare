# CoolCare - Subscription Penjagaan Air-Cond

CoolCare ni subscription service utk maintenance air-cond yg operate kat Malaysia. Web app ni bagi customer info pasal service kita dan boleh subscribe utk plan maintenance.

## Features

- Landing page yg responsive & modern
- Info pasal service maintenance air-cond
- Plan subscription dgn pricing
- Testimonial dr customer
- Database SQLite3 utk simpan data customer & rekod service

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: SQLite3
- **Icons**: Heroicons

## Getting Started

### Keperluan Basic
- [Node.js](https://nodejs.org/) (version 18.0.0 or lebih tinggi)
- [Git](https://git-scm.com/downloads)
- Code editor (cmth [Visual Studio Code](https://code.visualstudio.com/))

### Cara Install (Windows)

1. **Install semua keperluan basic dulu**:
   - Download & install Node.js dari [https://nodejs.org/](https://nodejs.org/) (pilih je version LTS)
   - Download & install Git dari [https://git-scm.com/download/win](https://git-scm.com/download/win)
   - Install Visual Studio Code dari [https://code.visualstudio.com/](https://code.visualstudio.com/)

2. **Buat folder utk project**:
   - Buka File Explorer
   - Pergi ke lokasi yg ko nak letak project ni (cmth: Documents atau Desktop)
   - Right-click, pilih "New" > "Folder"
   - Bagi nama folder tu (cmth: "FYP-Project")

3. **Clone repository**:
   - Tekan Windows key + R, type "cmd" dan tekan Enter utk buka Command Prompt
   - Pergi ke folder yg ko dah buat tadi:
   ```cmd
   cd C:\Users\YourUsername\Documents\FYP-Project
   ```
   (Tukar path tu ikut mana ko letak folder)
   - Clone repo:
   ```cmd
   git clone https://github.com/username/coolcare.git
   cd coolcare
   ```

4. **Install dependencies**:
   ```cmd
   npm install
   ```
   (Tunggu sampai siap, mmg ambik masa sikit)

5. **Setup database**:
   - Pastikan folder `src/lib/db` dah ada (kalau xde, buat folder tu)
   - Kalau ada file setup utk DB, run command yg disediakan

6. **Run development server**:
   ```cmd
   npm run dev
   ```

7. **Buka app** dgn access [http://localhost:3000](http://localhost:3000) kat browser

### Troubleshooting kat Windows

- **Port 3000 dah digunakan**: Kalau port tu dah guna, boleh try port lain:
  ```cmd
  npm run dev -- -p 3001
  ```

- **Error permission**: Kalau ada error pasal permission, try run Command Prompt sbg Administrator:
  - Tekan Start, cari "Command Prompt"
  - Right-click, pilih "Run as administrator"
  - Lepas tu navigate balik ke folder project ko

- **Masalah version Node.js**: Check version ko dgn:
  ```cmd
  node -v
  ```
  Kalau version xsesuai, boleh guna [nvm-windows](https://github.com/coreybutler/nvm-windows) utk install & manage byk version Node.js.

- **Error "cannot be loaded because running scripts is disabled"**: Buka PowerShell sbg admin dan run:
  ```powershell
  Set-ExecutionPolicy RemoteSigned
  ```

## Development

Structure project follow pattern Next.js App Router:

- `src/app`: Main page components & routes
- `src/components`: UI components yg reusable
- `src/lib/db`: Utilities DB utk SQLite3

## Status Project

Project ni msh dalam development. Landing page dah siap, dan kita tgh keje kat features ni:

- User authentication
- Management subscription
- System request service
- Dashboard admin utk manage schedule maintenance

## License

Project ni di-license bwh MIT License.

## Nak Tau Lebih

Utk tau lbh ttg Next.js, check resources ni:

- [Next.js Documentation](https://nextjs.org/docs) - blajar features & API Next.js
- [Learn Next.js](https://nextjs.org/learn) - tutorial Next.js yg interactive

Boleh check [GitHub repository Next.js](https://github.com/vercel/next.js) - feedback & contributions dialu-alukan!

## Deploy kat Vercel

Cara paling senang utk deploy app Next.js adalah guna [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dr creators Next.js.

Check [dokumentasi deployment Next.js](https://nextjs.org/docs/app/building-your-application/deploying) utk details lbh lanjut.
