# MTN Therapy Practice Portal - Deployment Guide

This guide provides instructions for deploying the MTN Therapy Practice Portal using Google Cloud Run for the web application and Firebase for authentication, database, and hosting (if desired).

## Prerequisites

1.  A Google Cloud Platform (GCP) project.
2.  The `gcloud` CLI installed and authenticated (`gcloud auth login`).
3.  The Firebase CLI installed (`npm install -g firebase-tools`).
4.  Docker installed locally (if building containers manually, though Cloud Build is recommended).

## 1. Firebase Setup

1.  **Initialize Firebase:**
    Run `firebase login` and `firebase init` in the root of the project.
    *   Select **Firestore**, **Authentication**, and **Hosting** (if using Firebase Hosting for the frontend instead of Cloud Run).
    *   Choose your existing GCP project.

2.  **Enable Services in Firebase Console:**
    *   **Firestore:** Create the database. Choose "Start in production mode" or "test mode" depending on your immediate need (ensure strict security rules are applied before real use).
    *   **Authentication:** Enable the "Email/Password" provider (for Magic Links) and the "Google" provider.

3.  **Environment Variables:**
    Copy `.env.example` to `.env` (and `.env.production` for deployment).
    You will need the following Firebase credentials from your Project Settings > Service Accounts (generate a new private key):
    *   `FIREBASE_PROJECT_ID`
    *   `FIREBASE_CLIENT_EMAIL`
    *   `FIREBASE_PRIVATE_KEY`

## 2. Deploying to Cloud Run

We recommend using Google Cloud Build to build and deploy the Next.js application to Cloud Run.

### Step 2.1: Prepare `Dockerfile` (Optional, if not using Cloud Build directly with buildpacks)

A standard Next.js `Dockerfile` is recommended. Ensure it uses a multi-stage build for a smaller final image.

### Step 2.2: Build and Deploy using `gcloud`

```bash
# Set your project ID
export PROJECT_ID="your-gcp-project-id"
export REGION="europe-west2" # e.g., London

# Submit the build to Cloud Build
gcloud builds submit --tag gcr.io/$PROJECT_ID/mtn-therapy-portal

# Deploy to Cloud Run
gcloud run deploy mtn-therapy-portal \
  --image gcr.io/$PROJECT_ID/mtn-therapy-portal \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="FIREBASE_PROJECT_ID=...,FIREBASE_CLIENT_EMAIL=..." \
  --set-secrets="FIREBASE_PRIVATE_KEY=your-secret-name:latest" # Recommended to use Secret Manager
```

### Step 2.3: Set up Secret Manager (Recommended)

Do not pass the `FIREBASE_PRIVATE_KEY` as a plain environment variable. Use Google Cloud Secret Manager.

1.  Create a secret in Secret Manager.
2.  Grant the Cloud Run service account the "Secret Manager Secret Accessor" role.
3.  Reference the secret in your deploy command as shown above.

## 3. Post-Deployment

1.  **Update Authorized Domains:**
    In the Firebase Console (Authentication > Settings > Authorized domains), add the URL provided by Cloud Run.

2.  **Firestore Security Rules:**
    Deploy your Firestore security rules:
    ```bash
    firebase deploy --only firestore:rules
    ```

3.  **Initial Admin Setup:**
    Navigate to the `/setup` route on your deployed URL to complete the Practice Setup and create the first admin account.

## Continuous Deployment

For continuous deployment, we recommend connecting your GitHub repository to Google Cloud Build. You can configure a trigger to automatically build and deploy a new revision to Cloud Run whenever you push to the `main` branch.
