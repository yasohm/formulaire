# 📋 Step-by-Step Configuration Guide

This guide will walk you through setting up your registration form from scratch.

## 🎯 Prerequisites
- A GitHub account (free)
- A Supabase account (free)
- A Vercel account (free)

---

## 📝 Step 1: Set Up Supabase Database

### 1.1 Create Supabase Account
1. Go to **https://supabase.com/**
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

### 1.2 Create a New Project
1. Click **"New Project"** in your Supabase dashboard
2. Fill in the details:
   - **Name**: `formulaire` (or any name you prefer)
   - **Database Password**: Create a strong password (save it somewhere safe)
   - **Region**: Choose the closest region to you
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

### 1.3 Create the Database Table
1. In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase-setup.sql` from this project
4. Copy **ALL** the contents of that file
5. Paste it into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see a success message: "Success. No rows returned"

### 1.4 Create Storage Bucket
1. In your Supabase dashboard, click on **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Fill in:
   - **Name**: `uploads`
   - **Public bucket**: ✅ **Check this box** (important!)
4. Click **"Create bucket"**

### 1.5 Get Your API Keys
1. In your Supabase dashboard, click on **"Settings"** (gear icon) in the left sidebar
2. Click on **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
4. **Copy both values** and save them in a text file (you'll need them later)

---

## 📦 Step 2: Set Up GitHub Repository

### 2.1 Initialize Git (if not already done)
Open your terminal in the project folder and run:

```bash
cd /home/yassin/formulaire
git init
```

### 2.2 Create GitHub Repository
1. Go to **https://github.com/**
2. Click the **"+"** icon in the top right
3. Click **"New repository"**
4. Fill in:
   - **Repository name**: `formulaire` (or your preferred name)
   - **Description**: "Registration form system"
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize with README" (we already have files)
5. Click **"Create repository"**

### 2.3 Push Code to GitHub
In your terminal, run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Registration form"

# Add GitHub remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/formulaire.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: If you're asked for credentials:
- Use a **Personal Access Token** instead of password
- Create one at: https://github.com/settings/tokens
- Select scope: `repo`

---

## 🚀 Step 3: Deploy to Vercel

### 3.1 Create Vercel Account
1. Go to **https://vercel.com/**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account

### 3.2 Import Your Project
1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find and click **"Import"** next to your `formulaire` repository
4. Vercel will detect it's a Node.js project automatically

### 3.3 Configure Project Settings
1. **Project Name**: Keep default or change it
2. **Framework Preset**: Should be "Other" (auto-detected)
3. **Root Directory**: Leave as `./` (default)
4. **Build Command**: Leave empty (not needed)
5. **Output Directory**: Leave empty (not needed)
6. **Install Command**: `npm install` (should be auto-filled)

### 3.4 Add Environment Variables
**BEFORE clicking Deploy**, click **"Environment Variables"** section:

1. Click **"Add"** to add a new variable
2. Add the first variable:
   - **Name**: `SUPABASE_URL`
   - **Value**: Paste your Supabase Project URL (from Step 1.5)
   - **Environments**: Check all three (Production, Preview, Development)
   - Click **"Save"**

3. Click **"Add"** again for the second variable:
   - **Name**: `SUPABASE_ANON_KEY`
   - **Value**: Paste your Supabase anon public key (from Step 1.5)
   - **Environments**: Check all three (Production, Preview, Development)
   - Click **"Save"**

### 3.5 Deploy
1. Click **"Deploy"** button at the bottom
2. Wait 1-2 minutes for deployment to complete
3. You'll see a success message with your live URL!

---

## ✅ Step 4: Test Your Form

### 4.1 Access Your Form
1. After deployment, Vercel will show you a URL like: `https://formulaire-xxxxx.vercel.app`
2. Click on it or copy it
3. You should see your registration form!

### 4.2 Test Registration
1. Fill out the form with test data:
   - Nom: Test
   - Prénom: User
   - Date de Naissance: 2000-01-01
   - Email: test@example.com
   - Téléphone: +212612345678
   - CNE / Massar: TEST123
   - Niveau: Select "Première année" or "Deuxième année"
   - Filière: Select any option
   - Upload a test photo (any image file)
   - Upload a test certificate (any PDF or DOC file)
2. Click **"إرسال"** (Submit)
3. You should see a success message!

### 4.3 Verify Data in Supabase
1. Go back to your Supabase dashboard
2. Click **"Table Editor"** in the left sidebar
3. Click on the **"registrations"** table
4. You should see your test registration!
5. Click **"Storage"** → **"uploads"** to see uploaded files

---

## 🔄 Step 5: Automatic Deployments (Optional)

Now that everything is set up, any time you make changes:

1. Make your changes to the code
2. In terminal, run:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Vercel will **automatically** detect the push and deploy your changes!
4. Check Vercel dashboard to see the deployment progress

---

## 🛠️ Troubleshooting

### Problem: "Database connection error"
**Solution:**
- Double-check your environment variables in Vercel
- Make sure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Verify the table exists in Supabase (Table Editor)

### Problem: "File upload not working"
**Solution:**
- Check that the `uploads` bucket exists in Supabase Storage
- Verify the bucket is set to **Public**
- Check Vercel function logs for errors

### Problem: "Deployment fails"
**Solution:**
- Check Vercel build logs for specific errors
- Verify `package.json` has all dependencies
- Make sure all files are pushed to GitHub

### Problem: "Form shows but submission fails"
**Solution:**
- Open browser Developer Tools (F12)
- Check Console tab for JavaScript errors
- Check Network tab to see API request/response
- Verify environment variables are set in Vercel

### Problem: "Can't push to GitHub"
**Solution:**
- Make sure you've initialized git: `git init`
- Check you've added the remote: `git remote -v`
- Use Personal Access Token instead of password

---

## 📊 Your Live URLs

After deployment, you'll have:
- **Form URL**: `https://your-project.vercel.app/`
- **Admin/Dashboard**: You can create one later if needed

---

## 🎉 You're Done!

Your registration form is now:
- ✅ Live on the internet
- ✅ Connected to a real database
- ✅ Storing files in cloud storage
- ✅ Automatically deploying from GitHub

**Next Steps:**
1. Share your form URL with users
2. Monitor registrations in Supabase dashboard
3. Make changes and push to GitHub for auto-deployment

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Docs**: https://docs.github.com

---

## 🔐 Security Notes

- The `SUPABASE_ANON_KEY` is safe to use in frontend code
- For production, consider adding authentication for admin features
- Regularly backup your Supabase database
- Monitor your Supabase usage to stay within free tier limits

