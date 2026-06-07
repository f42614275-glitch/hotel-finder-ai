# ⚡ Quick Start Guide - AI Hotel Finder

Get the AI Hotel Finder running in **5 minutes**!

## 🎯 5-Minute Setup

### 1️⃣ Get API Keys (2 minutes)

**OpenRouter API Key** (Free AI Model)
- Go to: https://openrouter.ai/
- Sign up → Create account
- Go to Settings → API Keys
- Copy your key

**SerpAPI Key** (Free Hotel Search)
- Go to: https://serpapi.com/
- Sign up → Auto-generated API key
- Copy your key from dashboard

### 2️⃣ Add Keys to config.js (1 minute)

Open `config.js` and replace:
```javascript
OPENROUTER_KEY: 'your-openrouter-api-key-here',  // ← Paste your OpenRouter key
SERPAPI_KEY: 'your-serpapi-key-here',            // ← Paste your SerpAPI key
```

Save the file.

### 3️⃣ Open & Use (1 minute)

1. Open `index.html` in your web browser
2. Type a hotel query (see examples below)
3. Click "Search" or press Enter
4. View AI-ranked results!

## 💬 Try These Search Examples

Copy & paste into the search box:

```
Luxury modern hotel in Goa for 2 nights under ₹17000 with pool and breakfast
```

```
Budget friendly hotel in Mumbai for 3 nights under ₹5000
```

```
Family hotel in Jaipur with kids amenities and good reviews
```

```
Business hotel in Delhi near airport with gym and wifi
```

```
Beachfront resort in Maldives with spa
```

## ✨ Key Features

| Feature | What It Does |
|---------|-------------|
| 🤖 Natural Language | Type requirements in plain English |
| ⭐ AI Match Score | Hotels ranked 0-100% match |
| 💬 Match Reasons | Why each hotel is recommended |
| 🌙 Dark Mode | Click moon icon for dark theme |
| 📱 Mobile Friendly | Works on phone, tablet, desktop |
| 🎨 Beautiful UI | Modern design like Airbnb |

## 🚀 File Overview

```
index.html   ← Open this in browser
styles.css   ← Beautiful styling
script.js    ← Main app logic
config.js    ← Add your API keys HERE
README.md    ← Full documentation
```

## ❓ Common Questions

**Q: Do I need Node.js or Python?**
A: No! Just a web browser.

**Q: Are the API keys free?**
A: Yes! Both OpenRouter and SerpAPI have generous free tiers.

**Q: What if I see "API keys not configured"?**
A: Check that config.js has your real API keys (not the placeholder text).

**Q: Does it work offline?**
A: No, it needs internet to access APIs.

**Q: Can I modify the design?**
A: Yes! Edit styles.css to change colors, fonts, layouts.

## 🎨 Quick Customization

### Change Primary Color
Edit `styles.css`:
```css
:root {
    --primary-color: #YOUR_COLOR_HERE;
}
```

### Change Hero Title
Edit `index.html`:
```html
<h1 class="hero-title">Your New Title Here</h1>
```

## 📊 Understanding Results

Each hotel shows:
- **Match Score**: How well it fits (85%+ = excellent)
- **Star Rating**: Guest reviews (1-5 stars)
- **Price**: Cost per night + total
- **Amenities**: Pool, breakfast, wifi, etc.
- **Match Reason**: Why AI picked it
- **Booking Sites**: Where to book

## 🔒 Security Reminder

⚠️ **Important**: Never push `config.js` with real API keys to GitHub!

Add to `.gitignore`:
```
config.js
.env
```

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "API keys not configured" | Add real keys to config.js |
| No hotels found | Try different location or amenities |
| Slow search | Normal (1-3 sec), check internet |
| Dark mode not saved | Browser needs localStorage enabled |

## 📚 Next Steps

1. ✅ Add API keys to config.js
2. ✅ Open index.html in browser
3. ✅ Try example searches
4. ✅ Customize styling if desired
5. ✅ Deploy to web hosting (optional)

## 🌐 Deployment (Optional)

Want to share with others?

**Free Hosting Options:**
- GitHub Pages: Push repo → Free hosting
- Netlify: Connect GitHub → Auto-deployed
- Vercel: Similar to Netlify
- Firebase: Google's free hosting

**Important**: Use environment variables for API keys when deploying!

## ⭐ Tips for Best Results

1. **Be Specific**: "₹15000 budget" not "around 15000"
2. **Include Location**: Always mention city/region
3. **List Amenities**: Pool, breakfast, gym, etc.
4. **Check Match Reasons**: Understand why hotels were picked

## 🎉 You're Ready!

```
1. Add API keys to config.js
2. Open index.html
3. Search and enjoy! 🏨
```

---

Need help? Check README.md for full documentation!
