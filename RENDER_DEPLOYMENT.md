# Production Deployment & APK Build Guide

This step-by-step guide walks you through deploying your backend microservices to **Render**, deploying/configuring your **Admin Dashboard**, and building a production **Android APK** for your Mobile App.

---

## 🏗️ Architecture Overview

- **`fashion-gateway`** (`type: web`): **1 Public Web Service**. Serves as the sole public API entrypoint (`https://<your-gateway-name>.onrender.com/api/v1`).
- **`fashion-auth-service`** (`type: pserv`): **Private Service**. Isolated within Render's internal network.
- **`fashion-catalog-service`** (`type: pserv`): **Private Service**. Isolated within Render's internal network.
- **`fashion-cart-service`** (`type: pserv`): **Private Service**. Isolated within Render's internal network.
- **`fashion-order-service`** (`type: pserv`): **Private Service**. Isolated within Render's internal network.

---

## Step 1: Set Up MongoDB Atlas Database 🍃

Before deploying to Render, set up a cloud database:

1. Sign up/log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (e.g., `admin_user`) and password.
4. Under **Network Access**, click **Add IP Address** -> Select **Allow Access from Anywhere** (`0.0.0.0/0`) so Render servers can connect securely.
5. Click **Connect** -> **Drivers** -> Copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/fashion_store?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend to Render via Blueprint 🚀

1. Ensure your latest project code is pushed to your **GitHub** repository.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** (top right) -> Select **Blueprint**.
4. Connect your GitHub repository (`FashionStoreApp`).
5. Render will automatically detect the `render.yaml` file in the root directory.
6. Render will list the 5 services to create:
   - `fashion-gateway` (Web Service)
   - `fashion-auth-service` (Private Service)
   - `fashion-catalog-service` (Private Service)
   - `fashion-cart-service` (Private Service)
   - `fashion-order-service` (Private Service)
7. Fill in the required environment variable prompts:
   - **`MONGO_URI`**: Paste your MongoDB Atlas connection string.
   - **`RAZORPAY_KEY_ID`**: Your Razorpay key ID (e.g. `rzp_test_...`).
   - **`RAZORPAY_KEY_SECRET`**: Your Razorpay key secret.
8. Click **Apply Blueprint**.
9. Wait for Render to build and deploy all services.
10. Once deployed, click on **`fashion-gateway`** and copy its **Public HTTPS URL** (e.g., `https://fashion-gateway.onrender.com`).

---

## Step 3: Deploy & Configure Admin Dashboard 📊

### Option A: Deploy on Render as a Static Site (Recommended)
1. On [Render Dashboard](https://dashboard.render.com), click **New +** -> **Static Site**.
2. Connect your repository (`FashionStoreApp`).
3. Set the configuration settings:
   - **Name**: `fashion-store-admin`
   - **Root Directory**: `Admin`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://<your-gateway-name>.onrender.com/api/v1`
5. Click **Create Static Site**.

### Option B: Local Production Build & Testing
1. Navigate to the `Admin` directory:
   ```bash
   cd Admin
   ```
2. Create a `.env.production` file:
   ```env
   VITE_API_URL=https://<your-gateway-name>.onrender.com/api/v1
   ```
3. Run build and preview:
   ```bash
   npm run build
   npm run preview
   ```

---

## Step 4: Build the Android APK (React Native / Expo) 📱

Build a standalone `.apk` file that connects to your live Render backend for testing on real physical Android devices.

1. Ensure **EAS CLI** is installed globally:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   npx eas-cli login
   ```
3. Navigate to the `Client` directory:
   ```bash
   cd Client
   ```
4. Create or update `Client/.env` with your live Render Gateway URL:
   ```env
   EXPO_PUBLIC_API_URL=https://<your-gateway-name>.onrender.com/api/v1
   EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_TDcSlPdmpjHqXj
   ```
5. Trigger the APK build using Expo EAS:
   ```bash
   npx eas-cli build -p android --profile preview
   ```
6. EAS will queue and execute the build in the cloud. Once complete:
   - EAS will output a **downloadable direct link to your `.apk` file**.
   - EAS will display a **QR code** on your terminal that you can scan with your Android phone to download and install the APK directly!

---

## 🔍 Verification & Health Checks

- **Gateway Health Check**: Navigate to `https://<your-gateway-name>.onrender.com/health` in your browser. It should return:
  ```json
  { "status": "Gateway is running" }
  ```
- **Public API Route Test**: Navigate to `https://<your-gateway-name>.onrender.com/api/v1/products`. It should return your product catalog array.
