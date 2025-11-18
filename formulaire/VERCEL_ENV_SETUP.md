# 🔑 Vercel Environment Variables Setup

## Your Supabase Credentials

Use these values when setting up environment variables in Vercel:

### Environment Variable 1:
- **Name**: `SUPABASE_URL`
- **Value**: `https://iaumommxiwgwutrdtpd.supabase.co`

### Environment Variable 2:
- **Name**: `SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdW1vbW14aXdndXd0cmR0cGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzAwNzAsImV4cCI6MjA3OTAwNjA3MH0.dWDk0j_6OTqSlJIdl5jQzgG9sn0MSlvlbaL3heNCPbI`

## How to Add in Vercel:

1. Go to your Vercel project dashboard
2. Click on **"Settings"** → **"Environment Variables"**
3. Click **"Add"** button
4. Add the first variable:
   - **Key**: `SUPABASE_URL`
   - **Value**: `https://iaumommxiwgwutrdtpd.supabase.co`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**
5. Click **"Add"** again for the second variable:
   - **Key**: `SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdW1vbW14aXdndXd0cmR0cGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzAwNzAsImV4cCI6MjA3OTAwNjA3MH0.dWDk0j_6OTqSlJIdl5jQzgG9sn0MSlvlbaL3heNCPbI`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**
6. **Redeploy** your project for changes to take effect

## ⚠️ Important Notes:

- The `.env` file is already in `.gitignore` - it won't be committed to GitHub
- Never commit your API keys to GitHub
- The `anon` key is safe to use in frontend code
- The `service_role` key should be kept secret (only use in backend/admin operations)

