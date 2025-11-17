# 🔐 CLEAN & SECURE DEPLOYMENT

## ✅ NO TOKENS IN THESE FILES!

All files are clean - GitHub won't complain!

---

## 🚀 DEPLOY NOW (10 MIN):

### **1. CREATE GITHUB REPOSITORY** (2 min)

1. Go to **github.com**
2. Click **"+"** → **"New repository"**
3. Name: `realschool-portfolios`
4. **✅ Public** (required for free Netlify)
5. **✅ Check "Add README"**
6. Click **"Create repository"**

---

### **2. UPLOAD ALL FILES** (2 min)

1. In your repository: **"Add file" → "Upload files"**
2. **Drag ALL files from this folder**
3. **Important:** Include the `netlify` folder!
4. Commit message: "Initial deployment"
5. Click **"Commit changes"**

**GitHub will NOT complain** - no tokens in files! ✅

---

### **3. CONNECT TO NETLIFY** (2 min)

1. In Netlify welcome screen: Click **"GitHub"**
2. **Authorize Netlify**
3. **Select repository:** `realschool-portfolios`
4. Click **"Deploy site"**
5. **Wait 1-2 minutes**

---

### **4. ADD TOKEN SECURELY** (3 min)

**This is where you add your token - safely!**

1. After deploy, click **"Site settings"**
2. Click **"Environment variables"** (left sidebar)
3. Click **"Add a variable"**

**Variable 1:**
- Key: `AIRTABLE_TOKEN`
- Value: `patCVVFYjnM4H06MD.dfe13217ff8d...` (your full token)
- Click "Create variable"

**Variable 2:**
- Key: `AIRTABLE_BASE_ID`
- Value: `appDxcv3BlLT1jkCL`
- Click "Create variable"

4. **Go to "Deploys" tab**
5. **Click "Trigger deploy" → "Deploy site"**
6. **Wait 1 minute**

---

### **5. TEST!** (1 min)

1. Open your Netlify URL
2. Click on any portfolio
3. Should load experiences! ✨

**Verify security:**
- Right-click → View Source
- Search for "pat"
- **Should find NOTHING!** 🔐

---

## ✅ WHAT'S INCLUDED:

- ✅ `index.html` - Landing page
- ✅ `fiona.html` - Fiona's portfolio (**NO TOKEN!**)
- ✅ `hope.html` - Hope's portfolio (**NO TOKEN!**)
- ✅ `olivia.html` - Olivia's portfolio (**NO TOKEN!**)
- ✅ `netlify/functions/get-experiences.js` - Secure function
- ✅ `realschool-portfolio-loader-secure.js` - Clean loader
- ✅ `netlify.toml` - Configuration
- ✅ `package.json` - Dependencies

---

## 🔐 HOW IT WORKS:

```
HTML files (NO TOKEN)
    ↓
Calls Netlify Function
    ↓
Function uses environment variable (SECURE!)
    ↓
Gets data from Airtable
    ↓
Returns to browser
```

**Token stored on server - never in browser!** ✨

---

## 🆘 NEED HELP?

Tell me which step you're on!

---

**TOTAL TIME: 10 minutes**
**RESULT: Secure portfolio with hidden token!** 🔐✨
