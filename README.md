# SoraPay — 日本向けスマートデジタルウォレット

SoraPayは、**Next.js 16・Tailwind CSS v4・React 19**を使用して開発した、高機能なデジタルウォレットアプリケーションです。
ガラスモーフィズム（Glassmorphism）デザイン、滑らかなアニメーション、多言語対応（ローカライズ）を備え、モダンで使いやすいユーザー体験を提供します。

**ライブデモ:**
https://aakash-codex.github.io/sorapay/

## 主な機能

### ダッシュボード・支出分析

リアルタイムの支出チャートと月ごとの利用状況を確認できます。

<p align="left">
  <img src="https://github.com/user-attachments/assets/e099b0e4-343d-443b-af59-e96ec99e5f1e"
       alt="Dashboard"
       width="250"/>
</p>

---

### 送金・受取 (`/send`・`/receive`)

送金機能に加え、QRコードを表示して簡単に支払いを受け取ることができます。

<p align="left">
  <img src="https://github.com/user-attachments/assets/4033951d-ae9e-472d-8039-206eb120ad28"
       alt="Transfers"
       width="250"/>
</p>

---

### 支払い (`/pay`)

QRコードのスキャン画面、バーコード表示、ポイント支払いなどをシミュレーションできます。

<p align="left">
  <img src="https://github.com/user-attachments/assets/93fb1ece-5f11-4981-b497-c8256aed9f19"
       alt="Pay"
       width="250"/>
</p>

---

### 取引履歴 (`/transactions`)

取引履歴の検索・フィルター機能に加え、CSV形式でエクスポートできます。

<p align="left">
  <img src="https://github.com/user-attachments/assets/064a4a4a-eaaf-409c-bce6-bd0ebfeb2f03"
       alt="Transactions"
       width="250"/>
</p>

---

### リワード (`/rewards`)

会員ランクの進捗確認、クーポンの取得、バーコードを利用した特典の引き換えができます。

<p align="left">
  <img src="https://github.com/user-attachments/assets/e19b4893-0bf9-4b2d-94bd-0726a13a90c9"
       alt="Rewards"
       width="250"/>
</p>

---

### 設定 (`/settings`)

ダークモード・ライトモードの切り替え、言語変更、プロフィール編集をリアルタイムで行えます。

<p align="left">
  <img src="https://github.com/user-attachments/assets/4fae65f6-363e-41ba-82e2-b785e795ee5e"
       alt="Settings"
       width="250"/>
</p>

---

## セットアップ方法

### 1. 依存パッケージをインストール

```bash
npm install
```

### 2. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで **http://localhost:3000** を開いてください。

### 3. 本番環境用にビルド

```bash
npm run build
```
