# 📚 API Reference - AI Hotel Finder

Complete documentation of the APIs used in the application.

## 🤖 OpenRouter API

### Purpose
Parse natural language hotel requests into structured requirements using the Nemotron AI model.

### Endpoint
```
POST https://openrouter.ai/api/v1/chat/completions
```

### Authentication
```javascript
Authorization: Bearer YOUR_OPENROUTER_KEY
```

### Request Body
```javascript
{
    "model": "nvidia/nemotron-3-ultra-550b-a55b:free",
    "messages": [
        {
            "role": "user",
            "content": "Parse this hotel query into JSON: ..."
        }
    ],
    "max_tokens": 500,
    "temperature": 0.7
}
```

### Response Example
```json
{
    "choices": [
        {
            "message": {
                "content": "{\"location\": \"Goa\", \"budget_max\": 17000, \"pool\": true, \"breakfast\": true, \"luxury\": true, \"modern\": true, \"rooms\": 1, \"nights\": 2}"
            }
        }
    ]
}
```

### Extracted Fields
| Field | Type | Description |
|-------|------|-------------|
| `location` | String | City or region name |
| `budget_max` | Number | Maximum budget in local currency |
| `budget_min` | Number | Minimum budget |
| `nights` | Number | Number of nights needed |
| `rooms` | Number | Number of rooms needed |
| `guests` | Number | Number of guests |
| `pool` | Boolean | Swimming pool required |
| `breakfast` | Boolean | Free breakfast required |
| `gym` | Boolean | Gym/fitness required |
| `wifi` | Boolean | WiFi required |
| `parking` | Boolean | Parking required |
| `ac` | Boolean | Air conditioning required |
| `luxury` | Boolean | Luxury property required |
| `modern` | Boolean | Modern property required |
| `budget` | Boolean | Budget/economical property |
| `family_friendly` | Boolean | Family amenities required |
| `pet_friendly` | Boolean | Pets allowed required |
| `beach` | Boolean | Beach access required |
| `city_center` | Boolean | City center location |
| `quiet` | Boolean | Quiet location required |
| `nightlife` | Boolean | Near nightlife required |
| `check_in_date` | String | Check-in date (YYYY-MM-DD) |
| `check_out_date` | String | Check-out date (YYYY-MM-DD) |

### Model Information
- **Model**: `nvidia/nemotron-3-ultra-550b-a55b:free`
- **Size**: 550B parameters
- **Type**: Large Language Model
- **Cost**: Completely free (no rate limits for free tier)
- **Latency**: 1-3 seconds typical

### Error Handling
```javascript
if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData.error.message);
    // Handle: rate limit, invalid key, model error
}
```

### Rate Limits
- Free tier: Very generous
- Check OpenRouter dashboard for current limits
- Implementation includes automatic retry logic

---

## 🏨 SerpAPI Google Hotels API

### Purpose
Search for available hotels with pricing, ratings, and amenities.

### Endpoint
```
GET https://serpapi.com/search
```

### Authentication
```
api_key=YOUR_SERPAPI_KEY
```

### Request Parameters
```javascript
{
    "api_key": "YOUR_SERPAPI_KEY",
    "engine": "google_hotels",
    "q": "Goa",                           // Location/hotel name
    "check_in_date": "2024-06-15",        // YYYY-MM-DD
    "check_out_date": "2024-06-17",       // YYYY-MM-DD
    "adults": 2,                          // Number of guests
    "currency": "INR"                     // Optional
}
```

### Response Example
```json
{
    "properties": [
        {
            "serpapi_id": "hotel_id_123",
            "title": "5-Star Beachfront Resort",
            "image": "https://...",
            "rating": 4.8,
            "review_count": 245,
            "review_score": 4.8,
            "price": 8500,
            "price_per_night": "₹8,500/night",
            "type": "Hotel",
            "location": "Goa",
            "description": "Luxury beachfront resort...",
            "amenities": ["Pool", "WiFi", "Parking", "Restaurant"],
            "link": "https://..."
        }
    ]
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `serpapi_id` | String | Unique hotel identifier |
| `title` | String | Hotel name |
| `image` | String | Hotel image URL |
| `rating` | Float | Star rating (1-5) |
| `review_count` | Integer | Number of reviews |
| `review_score` | Float | Review score |
| `price` | Number | Price per night |
| `price_per_night` | String | Formatted price |
| `type` | String | Hotel type |
| `location` | String | Hotel location |
| `description` | String | Hotel description |
| `amenities` | Array | Available amenities |
| `link` | String | Booking link |

### Supported Parameters
```javascript
// Essential
engine: "google_hotels",
api_key: string,

// Search
q: string,                    // Location or hotel name
check_in_date: "YYYY-MM-DD",
check_out_date: "YYYY-MM-DD",

// Filtering
adults: number,
children: number,
min_price: number,
max_price: number,
star_rating: number,
sort_by: "rating|price",

// Options
currency: "INR" | "USD" | etc,
language: "en",
output: "json" | "html"
```

### Amenities Available
Common amenities returned:
- WiFi
- Pool / Swimming Pool
- Parking
- Fitness Center / Gym
- Air Conditioning
- Restaurant
- Bar
- Business Center
- Spa
- Hot Tub
- Pet Friendly
- Free Breakfast
- Room Service
- Laundry Service

### Rate Limits
- **Free Tier**: 100 searches/month
- **Paid Plans**: From 25/month for $5
- Implement proper error handling for rate limits

### Error Handling
```javascript
if (!response.ok) {
    if (response.status === 429) {
        console.error('Rate limit exceeded');
        // Show user message
    } else if (response.status === 401) {
        console.error('Invalid API key');
    }
}
```

### Best Practices
1. **Combine Queries**: Use broader searches to reduce API calls
2. **Cache Results**: Store results locally when appropriate
3. **Filter Client-Side**: Use hotel amenities filtering on frontend
4. **Handle Delays**: Searches take 1-3 seconds, show loading state
5. **Monitor Usage**: Check quota to avoid overage charges

---

## 🏆 Ranking Algorithm

The app uses a scoring system that combines multiple factors:

### Score Components
```javascript
Total Score = Rating Score + Price Score + Amenities Score + Type Score

Rating Score (0-25 points)
- Based on hotel rating (1-5 stars)
- Formula: (rating / 5) * 25

Price Score (0-25 points)
- Compared against user's budget
- ≤80% of budget: 25 points
- 80-100% of budget: 20 points
- 100-120% of budget: 15 points
- 120-150% of budget: 10 points
- >150% of budget: 5 points

Amenities Score (0-30 points)
- Each matching amenity: 5 points
- Max 6 amenities: 30 points

Type Score (0-20 points)
- Base: 10 points
- Luxury match: +10 points
- Modern match: +10 points
- Budget match: +10 points
```

### Ranking Logic
1. Calculate score for each hotel
2. Apply all filters (budget, amenities)
3. Sort by score (highest first)
4. Generate match reasons
5. Display results

---

## 📊 Data Flow

```
User Input
    ↓
Parse with OpenRouter
    ↓
Extract Requirements (JSON)
    ↓
Search with SerpAPI
    ↓
Get Hotel Results
    ↓
Rank by Algorithm
    ↓
Generate Match Reasons
    ↓
Display Results
```

---

## 🔄 API Integration Code

### Making API Requests

**OpenRouter Request:**
```javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${API_KEYS.OPENROUTER_KEY}`,
        'HTTP-Referer': window.location.origin,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
    }),
});
```

**SerpAPI Request:**
```javascript
const params = new URLSearchParams({
    api_key: API_KEYS.SERPAPI_KEY,
    engine: 'google_hotels',
    q: location,
    check_in_date: checkInDate,
    check_out_date: checkOutDate,
});

const response = await fetch(`https://serpapi.com/search?${params}`);
```

---

## ⚠️ Rate Limits & Quotas

### OpenRouter
- **Free Tier**: Extremely generous (no strict limits)
- **Premium Models**: More limited
- **Nemotron**: Free, no limits

### SerpAPI
- **Free Tier**: 100 searches/month
- **Starter**: $25/month for 500 searches
- **Plus**: $50/month for 1500 searches
- **Business**: Custom plans

### Monitoring
Check remaining quota:
- OpenRouter: Check dashboard
- SerpAPI: Response includes usage info

---

## 🔐 Security Considerations

### API Key Protection
- ⚠️ Never expose keys in client-side code (production)
- Use environment variables on backend
- Use proxy server for production
- Rotate keys regularly
- Monitor for unauthorized usage

### CORS
- OpenRouter allows CORS from browsers
- SerpAPI allows CORS from browsers
- Add HTTP-Referer header for tracking

### Data Privacy
- Don't store user search queries
- Implement rate limiting on backend
- Use HTTPS only (enforced by browsers)

---

## 📖 Additional Resources

### OpenRouter Documentation
- Docs: https://openrouter.ai/docs
- Models: https://openrouter.ai/models
- API Status: https://status.openrouter.ai/

### SerpAPI Documentation
- Docs: https://serpapi.com/docs
- Google Hotels API: https://serpapi.com/docs/google-hotels
- Dashboard: https://serpapi.com/dashboard

### Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid API key | Check key in config.js |
| 429 Too Many Requests | Rate limit exceeded | Wait or upgrade plan |
| 400 Bad Request | Invalid parameters | Check query format |
| Network Error | Connection issue | Check internet connection |
| CORS Error | Browser restriction | Use backend proxy |

---

## 🚀 Future API Integration

Consider adding:
- Trip Advisor API for reviews
- Google Maps for location data
- Payment gateway for bookings
- Weather API for destination info
- Flight API for complete booking

---

Made with ❤️ using powerful APIs
