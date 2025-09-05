# 🚀 Render Deployment Guide - SAS Policy Value Hub

## ✅ Pre-deployment Checklist - COMPLETED

Your project is now ready for Render deployment with:
- ✅ MongoDB Atlas connection configured
- ✅ Production environment variables set
- ✅ Smart API URL detection (localhost vs production)
- ✅ Render configuration file created
- ✅ Both frontend and backend tested locally

## 🎯 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment with MongoDB Atlas"
git push origin main
```

### Step 2: Deploy Backend (Node.js Service)

1. **Go to [render.com](https://render.com)** and sign up/login
2. **Connect GitHub Repository**
3. **Create New Web Service**
   - **Repository:** Select your SAS-Policy-Website repo
   - **Root Directory:** `BackEnd`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://sparkforge2025_db_user:u4xk51rUuFAW34yp@cluster0.0ilx8q0.mongodb.net/sas_policy_hub?retryWrites=true&w=majority&appName=Cluster0
   EMAIL_USER=ramanuzkashyap@gmail.com
   EMAIL_PASS=@Ramanuz4@4@4@4@
   NOTIFICATION_EMAIL=ramanuzkashyap4@gmail.com
   JWT_SECRET=your_secure_jwt_secret_here
   SESSION_SECRET=your_secure_session_secret_here
   ```

5. **Deploy** - Wait for backend to deploy successfully

### Step 3: Deploy Frontend (Static Site)

1. **Create New Static Site**
   - **Repository:** Same SAS-Policy-Website repo
   - **Root Directory:** `.` (leave empty for root)
   - **Build Command:** Leave empty
   - **Publish Directory:** `.`

2. **Configure Environment Variables for Frontend:**
   ```
   BACKEND_URL=https://your-backend-service.onrender.com
   ```

3. **Deploy** - Wait for frontend to deploy

### Step 4: Update CORS Settings

After both services are deployed:

1. **Get your frontend URL** (e.g., `https://sas-policy-frontend.onrender.com`)
2. **Update backend environment variable:**
   ```
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

## 🔧 Alternative: Using render.yaml (Blueprint)

You can also use the included `render.yaml` file for automatic deployment:

1. **Push the render.yaml file to your repo**
2. **Go to Render Dashboard** → **Blueprints**
3. **Create New Blueprint** from your GitHub repo
4. **Set Environment Variables** as listed above

## 🌐 Expected URLs After Deployment

- **Frontend:** `https://sas-policy-frontend.onrender.com`
- **Backend API:** `https://sas-policy-backend.onrender.com/api`
- **Health Check:** `https://sas-policy-backend.onrender.com/api/health`

## 🔍 Testing After Deployment

1. **Test Backend Health:**
   ```
   https://your-backend-url.onrender.com/api/health
   ```
   Should return: `{"success":true,"message":"Server is running","database":"Connected"}`

2. **Test Frontend:**
   - Visit your frontend URL
   - Try submitting a contact form
   - Request a quote
   - Verify forms submit to backend successfully

## 🗄️ Database Connection

Your MongoDB Atlas is already configured and will work automatically:
- ✅ Connection string ready
- ✅ Database name: `sas_policy_hub`
- ✅ Collections: `contacts`, `quotes`

## 🚨 Important Notes

1. **Free Tier Limitations:**
   - Services sleep after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds to wake up
   - 750 hours/month free tier (shared across services)

2. **Custom Domain (Optional):**
   - Upgrade to paid plan for custom domain
   - Point your domain to Render's servers

3. **Environment Variables Security:**
   - Never commit `.env` file to Git
   - Set sensitive variables through Render dashboard

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Backend health endpoint returns success
- ✅ Frontend loads without console errors
- ✅ Forms submit successfully
- ✅ Email notifications work
- ✅ MongoDB Atlas shows new entries

## 🆘 Troubleshooting

**Common Issues:**
1. **CORS Errors:** Update `FRONTEND_URL` in backend environment
2. **Database Connection:** Verify MongoDB Atlas connection string
3. **Email Issues:** Check Gmail app password setup
4. **Build Failures:** Ensure all dependencies in package.json

Your SAS Policy Value Hub is now ready for production deployment on Render! 🚀