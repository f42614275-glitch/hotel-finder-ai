# 🏨 AI Hotel Finder - Modern Web Application

A beautiful, modern AI-powered hotel search application that uses natural language processing to find the perfect hotel for your needs.

## ✨ Features

### 🤖 AI-Powered Natural Language Search
- Type hotel requests in natural language instead of using complex filters
- Example: *"I want a luxury modern hotel in Goa for 2 nights under ₹17000 with swimming pool and free breakfast"*
- AI extracts structured requirements automatically using OpenRouter's Nemotron model

### 🏨 Smart Hotel Search
- Search hotels via SerpAPI Google Hotels integration
- Gets real hotel data with ratings, prices, and amenities
- Hundreds of hotels available worldwide

### ⭐ Intelligent Ranking System
- Hotels ranked by AI Match Score based on:
  - **Rating Score**: Quality of the hotel (0-25 points)
  - **Price Score**: How well it fits your budget (0-25 points)
  - **Amenities Match**: How many requested amenities it has (0-30 points)
  - **Type Match**: Luxury/Modern/Budget requirements (0-20 points)
- Total score: 0-100% match

### 💬 AI Match Reasons
- Each hotel gets an AI-generated explanation of why it matches your requirements
- Example: *"Matched because this hotel has a swimming pool, includes breakfast, has excellent reviews and fits your budget"*

### 🎨 Premium UI Design
- Modern design inspired by Airbnb, Agoda, and Booking.com
- Beautiful gradient hero section with animations
- Responsive grid layout for hotel cards
- Smooth animations and transitions
- Dark/Light theme toggle
- Mobile-friendly responsive design

### 📱 Responsive Design
- Works perfectly on desktop, tablet, and mobile
- Optimized touch interactions for mobile
- Adaptive grid layouts

### 🌙 Dark/Light Mode
- Toggle between dark and light themes
- Theme preference saved in browser

## 📦 Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with variables, gradients, animations
- **JavaScript (Vanilla)**: No frameworks or dependencies
- **APIs**: 
  - OpenRouter (Nemotron AI model)
  - SerpAPI (Google Hotels)

## 🚀 Getting Started

### Prerequisites
1. Modern web browser (Chrome, Firefox, Safari, Edge)
2. OpenRouter API key (free)
3. SerpAPI key (free)

### Step 1: Get API Keys

#### OpenRouter (Free AI Model)
1. Visit https://openrouter.ai/
2. Click "Sign in" → "Create account"
3. Go to Settings → API Keys
4. Copy your API key

#### SerpAPI (Free Hotel Search)
1. Visit https://serpapi.com/
2. Click "Register" or "Sign in"
3. Your API key is automatically generated
4. Copy it from the dashboard

### Step 2: Configure API Keys
1. Open `config.js` in your text editor
2. Replace `'your-openrouter-api-key-here'` with your actual OpenRouter key
3. Replace `'your-serpapi-key-here'` with your actual SerpAPI key
4. Save the file

### Step 3: Run the Application
1. Open `index.html` in your web browser
2. That's it! The app is ready to use

## 📖 How to Use

### Basic Search
1. Type your hotel request in natural language
2. Be specific about: location, budget, dates, and amenities
3. Click "Search" or press Enter
4. Wait for AI to analyze and search

### Example Queries
- "Luxury resort in Maldives with beach access and spa"
- "Budget hotel in Delhi for 3 days under ₹5000"
- "Family-friendly hotel in Goa with kids pool and activities"
- "Business hotel in Mumbai near airport with gym and wifi"

### Understanding Results

**Match Score**: 0-100% indicating how well the hotel matches your requirements
- 85-100%: Excellent match
- 70-84%: Very good match
- 55-69%: Good match
- Below 55%: Acceptable option

**AI Match Reason**: Why the hotel was selected for you based on:
- ⭐ Rating and reviews
- 💰 Price fit
- ✨ Available amenities
- 👑 Luxury rating
- 🏗️ Modern features

## 🎯 Features Explained

### Natural Language Processing
The app uses OpenRouter's Nemotron model to understand your query and extract:
- Location (city/region)
- Budget (minimum and maximum)
- Duration (number of nights)
- Room requirements
- Guest count
- Specific amenities (pool, breakfast, gym, wifi, parking, A/C)
- Property type preferences (luxury, modern, budget)
- Special requirements (family-friendly, pet-friendly, beach access, etc.)

### Search & Ranking
1. Query is parsed by AI into structured requirements
2. SerpAPI searches Google Hotels for available properties
3. Hotels are ranked based on multiple factors
4. Results sorted by AI Match Score (highest first)
5. Match reasons generated for each hotel

### Hotel Card Information
- **Hotel Image**: Visual representation
- **Match Score**: AI ranking percentage
- **Rating & Stars**: User reviews and star rating
- **Price**: Per night cost and total for your dates
- **Amenities**: Tags showing available features
- **Match Reason**: AI explanation
- **Booking Providers**: Where you can book

## 🔧 Customization

### Styling
Edit `styles.css` to customize:
- Colors (modify CSS variables in `:root`)
- Fonts and typography
- Animations and transitions
- Layout and spacing

Key CSS variables:
```css
--primary-color: #6366f1;
--secondary-color: #ec4899;
--accent-color: #f59e0b;
```

### Features to Extend
1. **Save Favorites**: Add localStorage to save favorite hotels
2. **Price Comparison**: Show prices across different booking platforms
3. **Map Integration**: Show hotel locations on interactive map
4. **Reviews Display**: Show actual user reviews from SerpAPI
5. **Booking Links**: Direct links to booking platforms
6. **Price Alerts**: Notify when prices drop
7. **Multiple Dates**: Search for multiple date ranges

## ⚙️ Configuration Options

### API Models
The app uses:
- **AI Model**: `nvidia/nemotron-3-ultra-550b-a55b:free` (Completely free)
- **Search Engine**: `google_hotels` via SerpAPI

You can change these in the code if you have other API keys.

### Rate Limits
- OpenRouter: Generous free tier (check their docs)
- SerpAPI: 100 searches/month free

Monitor your usage to avoid exceeding limits.

## 🌐 Deployment

### Local Testing
Simply open `index.html` in your browser - no server needed!

### Web Hosting (Netlify, Vercel, GitHub Pages)
1. Push files to GitHub repository
2. Connect repository to hosting service
3. Set environment variables for API keys (recommended)

### With Backend Proxy (More Secure)
Create a Node.js/Python backend to:
1. Accept hotel queries
2. Call OpenRouter and SerpAPI securely
3. Return results to frontend

This prevents exposing API keys in client-side code.

## ⚠️ Security Notes

### Important
- ⚠️ **Never commit API keys** to GitHub or public repositories
- 🔒 For production, use environment variables
- 🛡️ Consider using a backend proxy for API calls
- 📊 Monitor API usage to avoid unexpected charges

### Best Practices
1. Add `config.js` to `.gitignore`
2. Use different keys for development and production
3. Rotate keys periodically
4. Use backend proxy for sensitive operations
5. Implement rate limiting on your backend

## 🐛 Troubleshooting

### "API keys not configured"
- Check that `config.js` exists in the same folder
- Verify you've added real API keys (not the placeholder text)
- Check browser console for detailed error messages

### No hotels found
- Try a different location name
- Check your SerpAPI quota isn't exceeded
- Verify the location exists
- Try with less specific amenities

### Slow searches
- Network latency is normal (1-3 seconds)
- OpenRouter API might be slow sometimes
- Check your internet connection
- Try a simpler query

### Dark theme not working
- Check browser allows localStorage
- Try clearing browser cache
- Ensure CSS is loading properly

## 📋 File Structure

```
hotel-finder-ai/
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── script.js           # Main application logic
├── config.js           # API keys configuration
└── README.md           # This file
```

## 🎨 Design Features

### Animations
- Smooth fade-in animations on load
- Hover effects on interactive elements
- Loading spinner during search
- Card elevation on hover
- Floating background elements

### Color Scheme (Light Mode)
- Primary: Indigo (#6366f1)
- Secondary: Pink (#ec4899)
- Accent: Amber (#f59e0b)
- Background: White
- Text: Dark Gray

### Typography
- System fonts for optimal performance
- Clear hierarchy for readability
- Responsive font sizes

## 📚 Additional Resources

### API Documentation
- [OpenRouter Docs](https://openrouter.ai/docs)
- [SerpAPI Docs](https://serpapi.com/docs)
- [Nemotron Model Info](https://openrouter.ai/models/nvidia/nemotron-3-ultra-550b-a55b)

### Hotels Database
- Real-time data from Google Hotels
- Covers hotels worldwide
- Includes ratings, prices, and amenities

## 💡 Tips for Best Results

1. **Be Specific**: Include location, budget, dates, and key amenities
2. **Use Exact Amounts**: "₹15000" instead of "around 15000"
3. **List Priorities**: Mention most important amenities first
4. **Check Results**: AI Match Score helps identify best options
5. **Read Match Reasons**: Understand why hotels were selected

## 🚀 Future Enhancements

Possible features to add:
- ✅ Saved searches and favorites
- ✅ Price history and alerts
- ✅ Map view of hotels
- ✅ Multiple location search
- ✅ Filter and sort options
- ✅ User reviews and photos
- ✅ Booking integration
- ✅ Itinerary planning

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Support

For issues or questions:
1. Check this README
2. Review browser console for error messages
3. Verify API keys are correctly configured
4. Check API provider status pages

## ✨ Enjoy!

Happy hotel hunting with AI Hotel Finder! 🏨✈️

---

Made with ❤️ using AI and APIs
