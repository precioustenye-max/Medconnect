# Google OAuth 2.0 Setup Guide for MedConnect

Google login is already fully implemented in MedConnect! Follow these steps to enable it:

## 1. Create Google OAuth 2.0 Credentials

### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project (or select an existing one)
   - Click "Select a Project" at the top
   - Click "New Project"
   - Enter "MedConnect" as the project name
   - Click "Create"

### Step 2: Enable Google+ API
1. In the left sidebar, click **APIs & Services**
2. Click **Enabled APIs & Services**
3. Click **+ Enable APIs and Services**
4. Search for **"Google+ API"**
5. Click on it and press **Enable**

### Step 3: Create OAuth 2.0 Credentials
1. Go to **APIs & Services → Credentials** (left sidebar)
2. Click **+ Create Credentials** → **OAuth 2.0 Client IDs**
3. If prompted to create an OAuth consent screen first:
   - Click **Create OAuth consent screen**
   - Choose **External** user type
   - Click **Create**
   - Fill in the required fields:
     - **App name**: MedConnect
     - **User support email**: your-email@example.com
     - **Developer contact**: your-email@example.com
   - Click **Save and Continue**
   - Skip scope configuration (optional for now)
   - Click **Save and Continue**
   - Add test users if needed
   - Click **Save and Continue**

4. Now create the Client ID:
   - Application type: **Web application**
   - Name: `MedConnect Web Client`
   - **Authorized JavaScript origins**: Add these:
     ```
     http://localhost:5173
     http://localhost:5174
     http://localhost:3000
     https://yourdomain.com  (replace with your actual domain)
     ```
   - **Authorized redirect URIs**: Add these (if needed):
     ```
     http://localhost:5173
     http://localhost:5174
     http://localhost:3000
     ```
   - Click **Create**

5. Copy the **Client ID** (it will look like: `xxxxx-xxxxxxxxxxxxx.apps.googleusercontent.com`)

## 2. Configure Environment Variables

### Frontend (.env file)
Update `Frontend/.env`:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_COPIED_CLIENT_ID
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (.env file)
Update `backend/.env`:
```env
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=medconnect
DB_PORT=3306
JWT_SECRET=supersecretkey
GOOGLE_CLIENT_ID=YOUR_COPIED_CLIENT_ID
```

## 3. Test Google Login

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd Frontend
   npm run dev
   ```

3. Go to http://localhost:5173/login
4. You should see a "Sign in with Google" button
5. Click it and authenticate with your Google account
6. You'll be automatically logged in as a patient

## How It Works

### Frontend Flow
1. Google Sign-In script is loaded from `https://accounts.google.com/gsi/client`
2. User clicks the "Sign in with Google" button
3. Google returns a **credential** (JWT token)
4. Frontend sends credential to `/api/auth/google`

### Backend Flow
1. Backend receives the credential
2. Verifies the token with Google's API at `https://oauth2.googleapis.com/tokeninfo`
3. Extracts user info (email, name, etc.)
4. Checks if user exists in database
5. If new user: creates account with role "patient"
6. If existing user: logs them in
7. Issues JWT token and sets cookie

## Troubleshooting

### "Google login is not configured"
- Check that `VITE_GOOGLE_CLIENT_ID` is set in `Frontend/.env`
- Restart the frontend server after changing .env

### "Google authentication failed"
- Verify the Client ID is correct in both frontend and backend
- Check that `GOOGLE_CLIENT_ID` is set in `backend/.env`
- Ensure your domain is in "Authorized JavaScript origins"
- Check browser console for errors

### Google button not showing
- Ensure Google API script loaded (check Network tab in DevTools)
- Verify `VITE_GOOGLE_CLIENT_ID` is valid
- Check browser console for JavaScript errors

## Production Deployment

When deploying to production:

1. Update **Authorized JavaScript origins** in Google Cloud Console:
   - Add your production domain (e.g., `https://medconnect.example.com`)

2. Update environment variables:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
   VITE_API_BASE_URL=https://api.medconnect.example.com
   GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
   ```

3. Ensure backend is accessible from frontend

## Features Implemented

✅ **First-time Google login**: Automatically creates a patient account
✅ **Existing user login**: Links Google account to existing email
✅ **JWT token issuance**: Secure cookie-based authentication
✅ **Email verification**: Only verified Google accounts can login
✅ **Automatic user creation**: No pre-registration needed
