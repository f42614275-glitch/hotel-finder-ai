# 🚀 Deployment Guide - AI Hotel Finder

Deploy your AI Hotel Finder to the web for free!

## 📋 Deployment Options

### 1. GitHub Pages (Easiest - Free Forever)
### 2. Netlify (Very Easy - Free Forever)
### 3. Vercel (Very Easy - Free Forever)
### 4. Firebase (Google - Free tier available)

---

## 🔧 Pre-Deployment Checklist

Before deploying, make sure:

- ✅ `config.js` has your API keys
- ✅ All files are in the project folder
- ✅ `index.html` opens locally and works
- ✅ Search functionality works locally

---

## Option 1: GitHub Pages (Recommended for Beginners)

### Prerequisites
- GitHub account (free at https://github.com)
- Git installed on your computer

### Steps

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `hotel-finder-ai`
   - Add description: "AI-powered hotel search application"
   - Choose "Public"
   - Click "Create repository"

2. **Initialize Git in Your Project**
   ```bash
   cd /path/to/hotel-finder-ai
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Add Remote & Push**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/hotel-finder-ai.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Main branch
   - Save
   - Wait 1-2 minutes
   - Your site will be at: `https://YOUR_USERNAME.github.io/hotel-finder-ai`

### ⚠️ Security Warning

**IMPORTANT**: Never push `config.js` with real API keys!

**Before pushing to GitHub:**

1. Create `.env.example`:
   ```
   OPENROUTER_KEY=your-openrouter-api-key-here
   SERPAPI_KEY=your-serpapi-key-here
   ```

2. Replace `config.js` with:
   ```javascript
   const API_KEYS = {
       OPENROUTER_KEY: localStorage.getItem('OPENROUTER_KEY') || 'API_KEY_NOT_SET',
       SERPAPI_KEY: localStorage.getItem('SERPAPI_KEY') || 'API_KEY_NOT_SET',
   };
   ```

3. Add to index.html before closing body:
   ```html
   <script>
       // Load API keys from localStorage on startup
       // Users must set them in browser console or create them during setup
   </script>
   ```

4. Create `setup.html` for users to configure keys:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>API Key Setup - Hotel Finder</title>
   </head>
   <body>
       <h1>Configure API Keys</h1>
       <p>Enter your API keys to use the Hotel Finder:</p>
       
       <input type="password" id="openrouter" placeholder="OpenRouter API Key">
       <input type="password" id="serpapi" placeholder="SerpAPI Key">
       <button onclick="saveKeys()">Save Keys</button>
       
       <script>
           function saveKeys() {
               localStorage.setItem('OPENROUTER_KEY', document.getElementById('openrouter').value);
               localStorage.setItem('SERPAPI_KEY', document.getElementById('serpapi').value);
               alert('Keys saved! Visit index.html to start searching.');
               window.location.href = 'index.html';
           }
       </script>
   </body>
   </html>
   ```

---

## Option 2: Netlify (Very Easy)

### Steps

1. **Install Netlify CLI** (Optional, but easier)
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy via Netlify**
   ```bash
   cd /path/to/hotel-finder-ai
   netlify deploy
   ```

3. **Or Drag & Drop**
   - Go to https://app.netlify.com
   - Sign up with GitHub
   - Drag your project folder onto the browser
   - Done!

### Configure Environment Variables

1. Go to your Netlify site settings
2. Build & Deploy → Environment
3. Add variables:
   - Key: `OPENROUTER_KEY` → Value: Your key
   - Key: `SERPAPI_KEY` → Value: Your key

4. Update `config.js` to use environment variables:
   ```javascript
   const API_KEYS = {
       OPENROUTER_KEY: process.env.OPENROUTER_KEY,
       SERPAPI_KEY: process.env.SERPAPI_KEY,
   };
   ```

---

## Option 3: Vercel (Similar to Netlify)

### Steps

1. **Sign Up at Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Push to GitHub** (if not already)
   - Follow GitHub Pages steps above

3. **Import Project**
   - Click "New Project"
   - Select your GitHub repository
   - Select "Import"

4. **Add Environment Variables**
   - Project Settings → Environment Variables
   - Add:
     - Name: `OPENROUTER_KEY` → Value: Your key
     - Name: `SERPAPI_KEY` → Value: Your key

5. **Deploy**
   - Click "Deploy"
   - Your site will be live at: `https://your-project.vercel.app`

---

## Option 4: Firebase Hosting

### Prerequisites
- Google account
- Firebase CLI installed

### Steps

1. **Initialize Firebase**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   ```

2. **Configure**
   - Public directory: `.` (current directory)
   - Single-page app: `No`
   - Overwrite index.html: `No`

3. **Deploy**
   ```bash
   firebase deploy
   ```

4. **Setup Environment Variables**
   - Use Cloud Functions or store in Realtime Database
   - Update JavaScript to fetch from there

---

## 🔐 Secure API Keys (Recommended for Production)

Instead of exposing keys in client-side code:

### Create a Simple Backend

**Example with Node.js/Express:**

```javascript
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// Endpoint to parse query with AI
app.post('/api/parse-query', async (req, res) => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    res.json(data);
});

// Endpoint to search hotels
app.post('/api/search-hotels', async (req, res) => {
    const params = new URLSearchParams({
        api_key: process.env.SERPAPI_KEY,
        ...req.body
    });
    
    const response = await fetch(`https://serpapi.com/search?${params}`);
    const data = await response.json();
    res.json(data);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

**Update frontend script.js:**

```javascript
// Instead of direct API calls:
async function parseQueryWithAI(query) {
    const response = await fetch('/api/parse-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    return response.json();
}
```

### Deploy Backend

- **Heroku**: Free tier available (requires credit card)
- **Railway**: Simple hosting
- **Fly.io**: Simple hosting
- **Google Cloud Run**: Free tier

---

## 📊 Deployment Comparison

| Platform | Ease | Cost | Speed | Setup Time |
|----------|------|------|-------|-----------|
| GitHub Pages | ⭐⭐⭐ | Free | Fast | 5 min |
| Netlify | ⭐⭐⭐⭐ | Free | Fast | 2 min |
| Vercel | ⭐⭐⭐⭐ | Free | Fast | 2 min |
| Firebase | ⭐⭐ | Free tier | Fast | 10 min |

---

## ✅ Post-Deployment Checklist

After deploying:

- [ ] Site loads without errors
- [ ] Search functionality works
- [ ] Try example searches
- [ ] Check on mobile
- [ ] Test dark mode
- [ ] Verify results display correctly
- [ ] Share with others!

---

## 🔗 Domain Names (Optional)

Connect a custom domain:

**GitHub Pages:**
- Settings → Pages → Custom domain

**Netlify:**
- Site Settings → Domain management

**Vercel:**
- Settings → Domains

---

## 📈 Monitoring & Analytics

### Add Google Analytics (Free)

Add to `index.html` before closing `</body>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

### Track Searches:

In `script.js`:

```javascript
function handleSearch() {
    // ... existing code ...
    gtag('event', 'search', {
        'search_query': query,
        'location': requirements.location
    });
}
```

---

## 🚨 Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| Site shows blank | Check browser console for errors |
| API keys not working | Verify environment variables are set |
| CORS errors | Use backend proxy or configure CORS headers |
| 404 errors | Ensure all files are uploaded |
| Slow loading | Optimize images or use CDN |

---

## 🎯 Next Steps

1. Choose a deployment platform
2. Follow the steps above
3. Share your site with friends
4. Add custom domain (optional)
5. Monitor usage and improve

---

## 📚 Resources

- [GitHub Pages Docs](https://pages.github.com/)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)

---

Happy deploying! 🚀
