# 🚀 Vercel + Supabase Setup Guide

## 🎯 **What This Gives You:**
- ✅ **Free hosting** on Vercel
- ✅ **Real database** with Supabase (PostgreSQL)
- ✅ **File storage** with Supabase Storage
- ✅ **Automatic deployments** from GitHub
- ✅ **Professional grade** hosting

## 📋 **Step 1: Create Supabase Database**

### 1.1 Sign Up for Supabase
1. Go to https://supabase.com/
2. Click **"Start your project"**
3. Sign up with GitHub (recommended)
4. Create a new project

### 1.2 Create Database Table
1. In your Supabase dashboard, go to **"SQL Editor"**
2. Click **"New query"**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **"Run"** to execute the SQL

Alternatively, you can create the table manually:
1. Go to **"Table Editor"**
2. Click **"Create a new table"**
3. Name it: `registrations`
4. Add these columns:

| Column Name | Type | Default Value | Nullable | Primary Key |
|-------------|------|---------------|----------|-------------|
| id | int8 | auto-increment | No | Yes |
| nom | text | - | No | No |
| prenom | text | - | No | No |
| date_naissance | date | - | No | No |
| email | text | - | No | No |
| telephone | text | - | No | No |
| cne_massar | text | - | No | No |
| niveau | text | - | No | No |
| filiere | text | - | No | No |
| question | text | - | Yes | No |
| photo_identite | text | - | Yes | No |
| certificat_scolarite | text | - | Yes | No |
| created_at | timestamptz | now() | No | No |

5. **Important:** Make sure to set `email` as **UNIQUE** to prevent duplicate registrations
6. Click **"Save"**

### 1.3 Create Storage Bucket
1. Go to **"Storage"** in Supabase dashboard
2. Click **"Create a new bucket"**
3. Name it: `uploads`
4. Make it **Public** (checked)
5. Click **"Create bucket"**

### 1.4 Get API Keys
1. Go to **"Settings"** → **"API"**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## 📋 **Step 2: Setup GitHub Repository**

### 2.1 Initialize Git Repository
```bash
cd /home/yassin/formulaire
git init
git add .
git commit -m "Initial commit"
```

### 2.2 Create GitHub Repository
1. Go to https://github.com/
2. Click **"New repository"**
3. Name it: `formulaire` (or your preferred name)
4. Don't initialize with README (you already have one)
5. Click **"Create repository"**

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/formulaire.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 📋 **Step 3: Setup Vercel**

### 3.1 Create Vercel Account
1. Go to https://vercel.com/
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)

### 3.2 Deploy from GitHub
1. In Vercel dashboard, click **"New Project"**
2. Import your GitHub repository (`formulaire`)
3. Vercel will automatically detect it's a Node.js project
4. Click **"Deploy"** (don't worry about settings yet)

### 3.3 Add Environment Variables
1. In your Vercel project, go to **"Settings"** → **"Environment Variables"**
2. Add these variables:

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = your-anon-key-here
```

3. Click **"Save"** for each variable
4. Make sure to add them for **Production**, **Preview**, and **Development** environments

### 3.4 Redeploy
1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. This will apply the environment variables

## 📋 **Step 4: Test Your System**

1. **Registration Form**: `https://your-project.vercel.app/`
2. Fill out the form and submit
3. Check Supabase dashboard to verify the data was saved
4. Check Supabase Storage to verify files were uploaded

## 🔧 **Step 5: Automatic Deployments**

Every time you push to GitHub:
```bash
git add .
git commit -m "Your commit message"
git push
```

Vercel will automatically:
- ✅ Detect the push
- ✅ Build your project
- ✅ Deploy to production
- ✅ Update your live site

## 🎯 **Benefits:**

### ✅ **Free Forever**
- Vercel: Free tier (perfect for this project)
- Supabase: Free tier (500MB database, 1GB storage)

### ✅ **Automatic Deployments**
- Push to GitHub → Auto deploy
- No manual uploads needed

### ✅ **Professional Grade**
- Global CDN
- Automatic HTTPS
- Serverless functions
- Real-time database

## 🔧 **Troubleshooting:**

### **Database Connection Error:**
- Check environment variables in Vercel
- Verify Supabase URL and key
- Make sure table exists

### **File Upload Not Working:**
- Verify storage bucket `uploads` exists in Supabase
- Check bucket is set to public
- Verify storage policies are set correctly

### **Deployment Fails:**
- Check `package.json` is correct
- Verify all files are in repository
- Check Vercel build logs
- Make sure `vercel.json` is correct

### **API Not Working:**
- Check function logs in Vercel dashboard
- Verify CORS settings
- Test API endpoints directly
- Check Supabase connection

## 📊 **File Structure:**
```
formulaire/
├── index.html              # Main registration form
├── api/
│   ├── register.js         # Registration API
│   ├── registrations.js    # Get/Delete registrations
│   ├── stats.js           # Statistics API
│   └── export-excel.js    # Excel export
├── package.json           # Dependencies
├── vercel.json            # Vercel configuration
├── supabase-setup.sql     # Database setup SQL
└── VERCEL_SETUP.md        # This guide
```

## 🎉 **You're Done!**

Your registration form is now:
- ✅ **Hosted for free** on Vercel
- ✅ **Connected to real database** (Supabase)
- ✅ **File storage** configured (Supabase Storage)
- ✅ **Automatically deployed** from GitHub
- ✅ **Professional grade** hosting

**Your URLs:**
- Registration: `https://your-project.vercel.app/`

## 🚀 **Next Steps:**
1. Test everything works
2. Share the registration link
3. Monitor registrations in Supabase dashboard
4. Enjoy automatic deployments from GitHub!

