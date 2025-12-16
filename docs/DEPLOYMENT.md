# Deployment Guide

This guide covers how to deploy the **Khaas Re NYE Registration** application using two popular methods:
1. **Vercel** (Recommended for speed and ease)
2. **Google Cloud Run** (Recommended for containerized, scalable infrastructure)

---

## Option 1: Vercel (via GitHub)

Vercel is the easiest way to deploy Vite/React applications.

### Prerequisites
- A [GitHub](https://github.com/) account.
- A [Vercel](https://vercel.com/) account.

### Steps

1. **Push your code to GitHub**
   Initialize a repository and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create a new repo on GitHub, then run the commands provided by GitHub, e.g.:
   # git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   # git push -u origin main
   ```

2. **Import Project into Vercel**
   - Log in to your Vercel Dashboard.
   - Click **"Add New..."** -> **"Project"**.
   - Select the GitHub repository you just pushed.

3. **Configure Build Settings**
   Vercel will likely detect the settings automatically, but verify them:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:** None required for the frontend (The Google Script URL is hardcoded in `storageService.ts`, which is fine for this architecture).

4. **Deploy**
   - Click **Deploy**.
   - Vercel will build your application and provide you with a live URL (e.g., `https://your-project.vercel.app`).

---

## Option 2: Google Cloud Run

Cloud Run allows you to run stateless containers. We have included a `Dockerfile` and `nginx.conf` to serve the static React files.

### Prerequisites
- [Google Cloud CLI (gcloud)](https://cloud.google.com/sdk/docs/install) installed and authenticated.
- A Google Cloud Project with billing enabled.

### Files Included
- **Dockerfile**: A multi-stage build file. It installs dependencies, builds the React app, and then moves the built files to a lightweight Nginx container.
- **nginx.conf**: Configures Nginx to listen on port 8080 (Cloud Run default) and handle client-side routing.

### Steps

1. **Initialize Google Cloud Project**
   If you haven't selected your project in the CLI yet:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Enable Services**
   Enable Cloud Build and Cloud Run:
   ```bash
   gcloud services enable cloudbuild.googleapis.com run.googleapis.com
   ```

3. **Build and Submit the Container Image**
   Run the following command in the root directory. Replace `khaas-nye-app` with your preferred image name.
   
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/khaas-nye-app
   ```
   *This uploads your source code to Cloud Build, creates a Docker image, and stores it in the Container Registry.*

4. **Deploy to Cloud Run**
   Deploy the image you just built:

   ```bash
   gcloud run deploy khaas-nye-service \
     --image gcr.io/YOUR_PROJECT_ID/khaas-nye-app \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

   - **khaas-nye-service**: The name of your service on Cloud Run.
   - **--allow-unauthenticated**: Makes the website publicly accessible.

5. **Access the App**
   Once the command finishes, it will output a **Service URL** (e.g., `https://khaas-nye-service-uc.a.run.app`).

---

## Post-Deployment Checks

1. **Google Sheet Connectivity**
   - Test a registration on the deployed URL.
   - Ensure the data appears in your linked Google Sheet.
   - Note: The app uses `mode: 'no-cors'` for the Google Script fetch, which is the correct way to post data from a browser to Apps Script without CORS errors.

2. **Local Storage**
   - Even if the Google Sheet connection fails, data is saved to `localStorage`. You can access the **Admin Sheet** (if you've implemented the secret trigger) or use DevTools to verify `khaas_re_registrations` key in Local Storage.
