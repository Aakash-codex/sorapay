# SoraPay — Smart Digital Wallet for Japan

SoraPay is a premium, fully featured digital wallet application built with Next.js 16, Tailwind CSS v4, and React 19. It offers a gorgeous glassmorphic design, smooth animations, and full localization (English and Japanese).

## Features
- **Dashboard & Spent Analytics**: Real-time spending charts and monthly tracking.
- **Transfers (`/send` & `/receive`)**: Send funds or present a scanner-friendly QR code to receive payments.
- **Pay (`/pay`)**: Simulated QR scanning viewfinder, barcode presenter, and points payment options.
- **Transactions (`/transactions`)**: Searchable, filterable log with CSV export capability.
- **Rewards (`/rewards`)**: Progress bar to higher member tiers, coupon claims, and cashier redemption barcode modals.
- **Settings (`/settings`)**: Real-time theme toggles (Dark/Light mode), language switches, and profile editing.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## How to Upload to GitHub

Follow these steps to upload your project to GitHub:

1. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new).
   - Enter `sorapay` as the repository name.
   - Do **NOT** select "Initialize this repository with a README" (as we already have one).
   - Click **Create repository**.

2. **Link and push your local commits:**
   Open your terminal in this project folder and run the following commands (replace `<your-username>` with your actual GitHub username):
   ```bash
   # Add the remote origin
   git remote add origin https://github.com/<your-username>/sorapay.git

   # Rename branch to main (if not already main)
   git branch -M main

   # Push code to GitHub
   git push -u origin main
   ```

---

## How to Deploy Live (Show It Online)

The easiest and recommended way to host this Next.js project live for free is using **Vercel** or **Netlify**.

### Deploying on Vercel (Recommended)
1. Sign up/login to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New** -> **Project**.
3. In the list of imported repositories, click **Import** next to your `sorapay` repository.
4. Keep the default settings and click **Deploy**.
5. Within 1–2 minutes, Vercel will give you a live shareable URL (e.g., `sorapay.vercel.app`).

### Deploying on Netlify
1. Sign up/login to [Netlify](https://netlify.com) using your GitHub account.
2. Click **Add new site** -> **Import an existing project**.
3. Choose **GitHub** and select your `sorapay` repository.
4. Click **Deploy sorapay**.
