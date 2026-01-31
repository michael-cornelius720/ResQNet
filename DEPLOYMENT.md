# Deployment Guide for ResQNet

This app is built with **Next.js** and uses **Supabase** for the backend. The easiest way to deploy it is with **Vercel** (the creators of Next.js).

## Prerequisites

Ensure you have your **GitHub** repository updated with the latest code:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Option 1: Deploying to Vercel (Recommended)

1. **Sign up/Login to Vercel**: Go to [vercel.com](https://vercel.com) and login with your GitHub account.
2. **Add New Project**:
   - Click **"Add New..."** -> **"Project"**.
   - Import your `ResQNet` repository from GitHub.
3. **Configure Building**:
   - Framework Preset: **Next.js** (detected automatically).
   - Root Directory: `./` (default).
   - **IMPORTANT**: Build Command should automatically be detected as `npm run build` or `next build`. We updated `package.json` to use `next build --webpack` which is correct.
4. **Environment Variables**:
   - Expand the **"Environment Variables"** section.
   - You MUST add the following keys from your local `.env.local` file:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
5. **Deploy**:
   - Click **"Deploy"**.
   - Vercel will build your project. Wait for it to finish (it might take a minute).

## Option 2: Supabase Configuration

Ensure your Supabase project is ready for production:

1. **Database**: Your tables (`appointments`, `hospitals`, `sos_emergencies`) are already created.
2. **Auth**: Ensure Email/Password auth provider is enabled in Supabase Dashboard.
3. **URL Permissions** (Important):
   - Go to Supabase Dashboard -> **Authentication** -> **URL Configuration**.
   - Add your Vercel production URL (e.g., `https://resqnet.vercel.app`) to the **Redirect URLs**.

## Verifying Deployment

Once deployed:
1. Open the URL provided by Vercel.
2. Check if the **PWA** is working:
   - On Desktop: Look for an install icon in the address bar.
   - On Mobile: Try "Add to Home Screen".
3. **Test Features**:
   - Log in as a hospital admin.
   - Make an appointment request from the user homepage.
   - Check the dashboard for the request.

## Troubleshooting

- **Build Failures**: If the build fails on Vercel, check the "Building" logs. Ensure `npm run build` is running `next build --webpack`.
- **Database Connection**: If you get errors fetching data, verify you pasted the Environment Variables correctly in Vercel settings.
