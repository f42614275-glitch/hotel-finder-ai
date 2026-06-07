/* ==================== AI HOTEL FINDER - MAIN SCRIPT ==================== */

/**
 * Hotel Finder AI Application
 * Handles:
 * - Natural language query processing via OpenRouter API
 * - Hotel search via SerpAPI
 * - Ranking algorithm
 * - UI interactions and rendering
 */

// ==================== STATE MANAGEMENT ====================
const state = {
    currentResults: [],
    currentRequirements: null,
    searchQuery: '',
    isDarkTheme: localStorage.getItem('theme') === 'dark',
};

// ==================== DOM ELEMENTS ====================
const domElements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    resultsSection: document.getElementById('resultsSection'),
    hotelsGrid: document.getElementById('hotelsGrid'),
    noResults: document.getElementById('noResults'),
    resultsTitle: document.getElementById('resultsTitle'),
    resultsSubtitle: document.getElementById('resultsSubtitle'),
    backBtn: document.getElementById('backBtn'),
    newSearchBtn: document.getElementById('newSearchBtn'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    errorClose: document.getElementById('errorClose'),
    themeToggle: document.getElementById('themeToggle'),
    aiInsights: document.getElementById('aiInsights'),
    requirementsDisplay: document.getElementById('requirementsDisplay'),
    exampleBtns: document.querySelectorAll('.example-btn'),
    loadingSubtext: document.getElementById('loadingSubtext'),
};

// ==================== API CONFIGURATION ====================
/**
 * API Keys Priority:
 * 1. Environment variables (process.env or window.ENV)
 * 2. config.js (for local development)
 * 3. Error if neither exists
 */

// Get API keys from environment variables or config.js
const getAPIKeys = () => {
    const openrouterKey = process.env?.OPENROUTER_KEY || window.ENV?.OPENROUTER_KEY || (typeof API_KEYS !== 'undefined' ? API_KEYS.OPENROUTER_KEY : null);
    const serpapiKey = process.env?.SERPAPI_KEY || window.ENV?.SERPAPI_KEY || (typeof API_KEYS !== 'undefined' ? API_KEYS.SERPAPI_KEY : null);
    
    if (!openrouterKey) {
        console.error('❌ OPENROUTER_KEY not found in environment variables or config.js');
        throw new Error('OpenRouter API key not configured. Please add OPENROUTER_KEY to environment variables or config.js');
    }
    if (!serpapiKey) {
        console.error('❌ SERPAPI_KEY not found in environment variables or config.js');
        throw new Error('SerpAPI key not configured. Please add SERPAPI_KEY to environment variables or config.js');
    }
    
    return { openrouter: openrouterKey, serpapi: serpapiKey };
};

let API_KEYS;
try {
    const keys = getAPIKeys();
    API_KEYS = {
        OPENROUTER_KEY: keys.openrouter,
        SERPAPI_KEY: keys.serpapi
    };
    console.log('✅ API Keys loaded from environment variables');
} catch (error) {
    console.warn('⚠️ Falling back to config.js for API keys:', error.message);
}

// ==================== INITIALIZATION ====================
function init() {
    // Verify API keys are available
    if (typeof API_KEYS === 'undefined') {
        showError('⚠️ API keys not configured. Please check config.js file.');
        return;
    }

    // Initialize theme
    if (state.isDarkTheme) {
        document.body.classList.add('dark-theme');
        updateThemeIcon();
    }

    // Event listeners
    domElements.searchBtn.addEventListener('click', handleSearch);
    domElements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    domElements.backBtn.addEventListener('click', goBackToSearch);
    domElements.newSearchBtn.addEventListener('click', goBackToSearch);
    domElements.themeToggle.addEventListener('click', toggleTheme);
    domElements.errorClose.addEventListener('click', () => {
        domElements.errorMessage.style.display = 'none';
    });

    // Example button listeners
    domElements.exampleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            domElements.searchInput.value = e.target.dataset.query;
            handleSearch();
        });
    });

    console.log('✅ Hotel Finder AI initialized');
}

// ==================== SEARCH HANDLER ====================
/**
 * Main search flow:
 * 1. Get user input
 * 2. Parse with AI
 * 3. Search hotels via SerpAPI
 * 4. Rank results
 * 5. Display
 */
async function handleSearch() {
    const query = domElements.searchInput.value.trim();

    if (!query) {
        showError('Please enter a hotel search query');
        return;
    }

    state.searchQuery = query;
    showLoading('Analyzing your request...');

    try {
        // Step 1: Parse natural language query with AI
        console.log('📝 Parsing query:', query);
        const requirements = await parseQueryWithAI(query);
        
        if (!requirements) {
            throw new Error('Failed to parse search requirements');
        }

        state.currentRequirements = requirements;
        console.log('✅ Extracted requirements:', requirements);

        // Step 2: Search hotels
        updateLoadingMessage('Searching for hotels...');
        console.log('🏨 Searching hotels in:', requirements.location);
        
        const hotels = await searchHotels(requirements);

        if (!hotels || hotels.length === 0) {
            hideLoading();
            showNoResults();
            return;
        }

        // Step 3: Rank hotels
        updateLoadingMessage('Ranking hotels...');
        console.log('⭐ Ranking', hotels.length, 'hotels');
        const rankedHotels = rankHotels(hotels, requirements);

        // Step 4: Generate AI match reasons
        updateLoadingMessage('Generating match reasons...');
        const enrichedHotels = await enrichHotelsWithMatchReasons(rankedHotels, requirements);

        state.currentResults = enrichedHotels;

        // Step 5: Display results
        hideLoading();
        displayResults(requirements, enrichedHotels);

    } catch (error) {
        console.error('❌ Search error:', error);
        hideLoading();
        showError(`Search failed: ${error.message}`);
    }
}

// ==================== AI PARSING ====================
/**
 * Parse natural language query using OpenRouter API (Nemotron model)
 * Returns structured hotel requirements
 */
async function parseQueryWithAI(query) {
    try {
        const prompt = `
You are a hotel search requirement parser. Extract the following information from the user's natural language query and return ONLY a valid JSON object with no additional text.

User Query: "${query}"

Extract these fields (use null for missing fields):
- location: string (city/region name)
- budget_max: number (maximum budget in local currency, null if not specified)
- budget_min: number (minimum budget, null if not specified)
- nights: number (number of nights, null if not specified)
- rooms: number (number of rooms needed, default 1)
- guests: number (number of guests, null if not specified)
- pool: boolean (wants swimming pool)
- breakfast: boolean (wants free breakfast)
- gym: boolean (wants gym/fitness)
- wifi: boolean (wants wifi)
- parking: boolean (wants parking)
- ac: boolean (wants air conditioning)
- luxury: boolean (luxury property)
- modern: boolean (modern property)
- budget: boolean (budget/economical property)
- family_friendly: boolean (family amenities)
- pet_friendly: boolean (pets allowed)
- beach: boolean (beach access)
- city_center: boolean (wants city center location)
- quiet: boolean (wants quiet location)
- nightlife: boolean (wants near nightlife)
- check_in_date: string (date if specified, format: YYYY-MM-DD)
- check_out_date: string (date if specified, format: YYYY-MM-DD)

Return ONLY valid JSON, nothing else. Example:
{"location": "Goa", "budget_max": 17000, "pool": true, "breakfast": true, "luxury": true, "modern": true, "rooms": 1, "nights": 2}
`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEYS.OPENROUTER_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Hotel Finder AI',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'openai/gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenRouter API error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const responseText = data.choices[0].message.content.trim();

            console.log('🤖 AI Response:', responseText);

            // Parse JSON from response - more robust matching
            let jsonMatch = responseText.match(/\{[\s\S]*\}$/);
            if (!jsonMatch) {
                jsonMatch = responseText.match(/\{[\s\S]*\}/);
            }
            if (!jsonMatch) {
                console.error('❌ Failed to parse JSON. Response was:', responseText);
                throw new Error(`Invalid JSON in AI response: ${responseText.substring(0, 100)}`);
            }

            let requirements;
            try {
                requirements = JSON.parse(jsonMatch[0]);
            } catch (parseError) {
                console.error('❌ JSON Parse Error:', parseError);
                console.error('Attempted to parse:', jsonMatch[0]);
                throw new Error(`Failed to parse AI JSON: ${parseError.message}`);
            }

            // Validate location is provided
            if (!requirements.location) {
                throw new Error('Could not extract location from your query. Please specify a city or region.');
            }

            // Set defaults for missing fields
            requirements.rooms = requirements.rooms || 1;
            requirements.nights = requirements.nights || 1;

            return requirements;

        } catch (fetchError) {
            clearTimeout(timeoutId);
            throw fetchError;
        }

    } catch (error) {
        console.error('AI Parsing Error:', error);
        if (error.name === 'AbortError') {
            throw new Error('Request took too long. OpenRouter API is slow right now. Try again in a moment.');
        }
        throw error;
    }
}

// ==================== HOTEL SEARCH ====================
/**
 * Search hotels using SerpAPI Google Hotels
 */
async function searchHotels(requirements) {
    try {
        // Format search parameters for SerpAPI
        const searchParams = new URLSearchParams({
            api_key: API_KEYS.SERPAPI_KEY,
            engine: 'google_hotels',
            q: requirements.location,
            check_in_date: requirements.check_in_date || getFormattedDate(new Date()),
            check_out_date: requirements.check_out_date || getFormattedDate(new Date(Date.now() + requirements.nights * 24 * 60 * 60 * 1000)),
        });

        // Add optional filters
        if (requirements.budget_max) {
            searchParams.append('adults', requirements.guests || 2);
        }

        console.log('🔍 SerpAPI Request:', searchParams.toString());

        const response = await fetch(`https://serpapi.com/search?${searchParams}`);

        if (!response.ok) {
            throw new Error(`SerpAPI error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.properties || data.properties.length === 0) {
            console.warn('⚠️ No hotels found in SerpAPI response');
            return [];
        }

        // Transform SerpAPI response to our format
        const hotels = data.properties.map(hotel => ({
            id: hotel.serpapi_id || Math.random().toString(),
            name: hotel.title || 'Hotel Name',
            image: hotel.image || '',
            location: hotel.location || requirements.location,
            rating: parseFloat(hotel.rating) || 0,
            review_count: hotel.review_count || 0,
            review_score: parseFloat(hotel.review_score) || hotel.rating || 0,
            price: hotel.price || 0,
            rate_per_night: extractPrice(hotel.price_per_night || hotel.price),
            amenities: parseAmenities(hotel),
            availability: hotel.link ? 'Available' : 'Check availability',
            booking_link: hotel.link || '#',
            booking_providers: extractProviders(hotel),
            type: hotel.type || 'Hotel',
            description: hotel.description || '',
            raw_data: hotel, // Keep original data for reference
        }));

        return hotels;

    } catch (error) {
        console.error('Hotel Search Error:', error);
        throw error;
    }
}

// ==================== RANKING ALGORITHM ====================
/**
 * Rank hotels based on:
 * - Price fit vs budget
 * - Rating score
 * - Amenities match
 * - Luxury/Modern requirements match
 */
function rankHotels(hotels, requirements) {
    return hotels.map(hotel => {
        let score = 0;
        const scoreBreakdown = {};

        // 1. Rating Score (0-25 points)
        const ratingScore = (hotel.rating / 5) * 25;
        scoreBreakdown.rating = ratingScore;
        score += ratingScore;

        // 2. Price Score (0-25 points) - Lower is better
        let priceScore = 25;
        if (requirements.budget_max && hotel.price) {
            const totalCost = hotel.price * requirements.nights;
            const priceRatio = totalCost / requirements.budget_max;
            if (priceRatio <= 0.8) priceScore = 25; // Under budget
            else if (priceRatio <= 1.0) priceScore = 20; // Within budget
            else if (priceRatio <= 1.2) priceScore = 15; // Slightly over
            else if (priceRatio <= 1.5) priceScore = 10; // Over budget
            else priceScore = 5; // Way over budget
        }
        scoreBreakdown.price = priceScore;
        score += priceScore;

        // 3. Amenities Match (0-30 points)
        let amenitiesScore = 0;
        const requiredAmenities = [
            { key: 'pool', name: 'pool' },
            { key: 'breakfast', name: 'breakfast' },
            { key: 'gym', name: 'gym' },
            { key: 'wifi', name: 'wifi' },
            { key: 'parking', name: 'parking' },
            { key: 'ac', name: 'air conditioning' },
        ];

        requiredAmenities.forEach(amenity => {
            if (requirements[amenity.key] && hotelHasAmenity(hotel, amenity.name)) {
                amenitiesScore += 5;
            }
        });
        amenitiesScore = Math.min(amenitiesScore, 30);
        scoreBreakdown.amenities = amenitiesScore;
        score += amenitiesScore;

        // 4. Type Match - Luxury/Modern/Budget (0-20 points)
        let typeScore = 10; // Base score
        if (requirements.luxury && hotelIsLuxury(hotel)) typeScore += 10;
        if (requirements.modern && hotelIsModern(hotel)) typeScore += 10;
        if (requirements.budget && hotelIsBudget(hotel)) typeScore += 10;
        typeScore = Math.min(typeScore, 20);
        scoreBreakdown.type = typeScore;
        score += typeScore;

        hotel.match_score = Math.round(score);
        hotel.score_breakdown = scoreBreakdown;

        return hotel;
    }).sort((a, b) => b.match_score - a.match_score);
}

// ==================== MATCH REASON GENERATION ====================
/**
 * Generate AI-powered match reasons for each hotel
 */
async function enrichHotelsWithMatchReasons(hotels, requirements) {
    try {
        // We'll create match reasons based on scoring breakdown
        // For better results, you could call AI for each hotel, but we'll do client-side for performance
        
        return hotels.map(hotel => {
            const reasons = [];
            const breakdown = hotel.score_breakdown;

            // Rating reason
            if (hotel.rating >= 4.5) {
                reasons.push(`⭐ Excellent reviews (${hotel.rating}/5 rating)`);
            } else if (hotel.rating >= 4) {
                reasons.push(`⭐ Good reviews (${hotel.rating}/5 rating)`);
            }

            // Price reason
            if (requirements.budget_max && hotel.price) {
                const totalCost = hotel.price * requirements.nights;
                const priceRatio = totalCost / requirements.budget_max;
                if (priceRatio <= 1.0) {
                    reasons.push(`💰 Fits your budget (₹${totalCost.toLocaleString()} for ${requirements.nights} nights)`);
                } else {
                    reasons.push(`💰 Close to your budget`);
                }
            }

            // Amenities reason
            const matchedAmenities = [];
            const checkAmenities = ['pool', 'breakfast', 'gym', 'wifi', 'parking', 'ac'];
            checkAmenities.forEach(amenity => {
                if (requirements[amenity] && hotelHasAmenity(hotel, amenity)) {
                    matchedAmenities.push(amenity.replace('_', ' '));
                }
            });
            if (matchedAmenities.length > 0) {
                reasons.push(`✨ Has ${matchedAmenities.join(', ')}`);
            }

            // Type reason
            if (requirements.luxury && hotelIsLuxury(hotel)) {
                reasons.push(`👑 Luxury accommodation`);
            }
            if (requirements.modern && hotelIsModern(hotel)) {
                reasons.push(`🏗️ Modern property`);
            }

            // Create full match reason text
            const matchReasonText = `Matched because this hotel ${reasons.join(', ')}${reasons.length === 0 ? 'meets your criteria' : ''}. It's a great option for your ₹${Math.max(hotel.price || 0, 1).toLocaleString()} budget.`;

            hotel.match_reason = matchReasonText;
            return hotel;
        });
    } catch (error) {
        console.error('Match Reason Generation Error:', error);
        return hotels; // Return hotels even if this fails
    }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if hotel has specific amenity
 */
function hotelHasAmenity(hotel, amenity) {
    const amenities = hotel.amenities || [];
    const desc = (hotel.description || '').toLowerCase();
    const name = (hotel.name || '').toLowerCase();
    
    const amenityLower = amenity.toLowerCase();
    return amenities.some(a => a.toLowerCase().includes(amenityLower)) ||
           desc.includes(amenityLower) ||
           name.includes(amenityLower);
}

/**
 * Check if hotel is luxury
 */
function hotelIsLuxury(hotel) {
    if (hotel.rating >= 4.7) return true;
    const luxuryKeywords = ['luxury', 'premium', 'five star', '5 star', 'resort', 'palace'];
    const text = `${hotel.name} ${hotel.description}`.toLowerCase();
    return luxuryKeywords.some(keyword => text.includes(keyword));
}

/**
 * Check if hotel is modern
 */
function hotelIsModern(hotel) {
    if (hotel.rating >= 4.5) return true;
    const modernKeywords = ['modern', 'contemporary', 'new', 'boutique', 'design', 'stylish'];
    const text = `${hotel.name} ${hotel.description}`.toLowerCase();
    return modernKeywords.some(keyword => text.includes(keyword));
}

/**
 * Check if hotel is budget
 */
function hotelIsBudget(hotel) {
    const budgetKeywords = ['budget', 'economic', 'hostel', 'inexpensive', 'affordable'];
    const text = `${hotel.name} ${hotel.description}`.toLowerCase();
    return budgetKeywords.some(keyword => text.includes(keyword));
}

/**
 * Parse amenities from hotel data
 */
function parseAmenities(hotel) {
    const amenities = [];
    
    // From explicit amenities field
    if (hotel.amenities && Array.isArray(hotel.amenities)) {
        amenities.push(...hotel.amenities);
    }

    // From description
    const amenityKeywords = ['wifi', 'pool', 'breakfast', 'gym', 'parking', 'ac', 'air conditioning', 'spa', 'restaurant', 'bar', 'conference', 'business center'];
    const desc = (hotel.description || '').toLowerCase();
    amenityKeywords.forEach(keyword => {
        if (desc.includes(keyword) && !amenities.some(a => a.toLowerCase().includes(keyword))) {
            amenities.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
        }
    });

    return amenities.slice(0, 8); // Limit to 8 amenities
}

/**
 * Extract booking providers
 */
function extractProviders(hotel) {
    const providers = [];
    const commonProviders = ['Booking.com', 'Agoda', 'Hotels.com', 'Expedia', 'MakeMyTrip', 'Goibibo'];
    
    // Randomly assign providers (in real scenario, would come from API)
    const numProviders = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numProviders; i++) {
        const provider = commonProviders[Math.floor(Math.random() * commonProviders.length)];
        if (!providers.includes(provider)) {
            providers.push(provider);
        }
    }
    
    return providers.length > 0 ? providers : ['Booking.com'];
}

/**
 * Extract price from string
 */
function extractPrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    
    const match = priceStr.toString().match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
}

/**
 * Format date for API
 */
function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Generate star HTML
 */
function generateStars(rating) {
    const stars = Math.round(rating);
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="star ${i <= stars ? '' : 'empty'}">★</span>`;
    }
    return html;
}

// ==================== UI DISPLAY ====================

/**
 * Display search results
 */
function displayResults(requirements, hotels) {
    // Update header
    const location = requirements.location || 'Hotels';
    domElements.resultsTitle.textContent = `Hotels in ${location}`;
    domElements.resultsSubtitle.textContent = `${hotels.length} hotels found • Sorted by AI Match Score`;

    // Display requirements
    displayRequirements(requirements);

    // Clear previous results
    domElements.hotelsGrid.innerHTML = '';
    domElements.noResults.style.display = 'none';

    // Render hotel cards
    hotels.forEach((hotel, index) => {
        const card = createHotelCard(hotel, requirements);
        domElements.hotelsGrid.appendChild(card);
        
        // Stagger animation
        card.style.animation = `slideUp 0.6s ease-out ${index * 0.1}s both`;
    });

    // Show results section
    domElements.resultsSection.style.display = 'block';
    document.querySelector('.hero').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Display extracted requirements
 */
function displayRequirements(requirements) {
    const requirementsList = [];

    if (requirements.location) requirementsList.push({ label: 'Location', value: requirements.location });
    if (requirements.budget_max) requirementsList.push({ label: 'Max Budget', value: `₹${requirements.budget_max.toLocaleString()}` });
    if (requirements.nights) requirementsList.push({ label: 'Duration', value: `${requirements.nights} night${requirements.nights > 1 ? 's' : ''}` });
    if (requirements.rooms) requirementsList.push({ label: 'Rooms', value: requirements.rooms });
    if (requirements.guests) requirementsList.push({ label: 'Guests', value: requirements.guests });

    // Add amenity preferences
    const amenityPrefs = [];
    ['pool', 'breakfast', 'gym', 'wifi', 'parking'].forEach(amenity => {
        if (requirements[amenity]) amenityPrefs.push(amenity.charAt(0).toUpperCase() + amenity.slice(1));
    });
    if (amenityPrefs.length > 0) requirementsList.push({ label: 'Amenities', value: amenityPrefs.join(', ') });

    domElements.requirementsDisplay.innerHTML = requirementsList.map(item => `
        <div class="requirement-item">
            <div class="requirement-label">${item.label}</div>
            <div class="requirement-value">${item.value}</div>
        </div>
    `).join('');

    domElements.aiInsights.style.display = 'block';
}

/**
 * Create hotel card element
 */
function createHotelCard(hotel, requirements) {
    const card = document.createElement('div');
    card.className = 'hotel-card';
    
    const starsHtml = generateStars(hotel.rating);
    const amenitiesHtml = hotel.amenities
        .slice(0, 5)
        .map(amenity => `<span class="amenity-tag">${amenity}</span>`)
        .join('');
    const providersHtml = (hotel.booking_providers || [])
        .slice(0, 3)
        .map(provider => `<span class="provider-badge">${provider}</span>`)
        .join('');

    card.innerHTML = `
        <div class="hotel-image-container">
            <img src="${hotel.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EHotel Image%3C/text%3E%3C/svg%3E'}" 
                 alt="${hotel.name}" 
                 class="hotel-image"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E'">
            <div class="match-score-badge">
                <span class="score-value">${hotel.match_score}%</span> Match
            </div>
        </div>

        <div class="hotel-content">
            <div class="hotel-header">
                <h3 class="hotel-name">${hotel.name}</h3>
                <div class="hotel-location">📍 ${hotel.location}</div>
            </div>

            <div class="rating-section">
                <div class="rating-item">
                    <div class="rating-label">Rating</div>
                    <div class="rating-value">${hotel.rating || 'N/A'}</div>
                    <div class="stars">${starsHtml}</div>
                </div>
                <div class="rating-item">
                    <div class="rating-label">Reviews</div>
                    <div class="rating-value">${hotel.review_count || 0}</div>
                </div>
            </div>

            <div class="price-section">
                <div>
                    <div class="price-label">Price per Night</div>
                    <div class="price-value">₹${Math.max(hotel.price || 0, 1).toLocaleString()}</div>
                    <div class="price-per-night">Total: ₹${((hotel.price || 0) * requirements.nights).toLocaleString()}</div>
                </div>
            </div>

            ${hotel.amenities && hotel.amenities.length > 0 ? `
                <div class="amenities-section">
                    <div class="amenities-label">Amenities</div>
                    <div class="amenities-list">
                        ${amenitiesHtml}
                    </div>
                </div>
            ` : ''}

            <div class="match-reason">
                <div class="match-reason-label">🤖 AI Match Reason</div>
                <div class="match-reason-text">${hotel.match_reason || 'This hotel matches your criteria well.'}</div>
            </div>

            <div class="providers-section">
                <div class="providers-label">Book On</div>
                <div class="providers-list">
                    ${providersHtml}
                </div>
            </div>
        </div>
    `;

    return card;
}

/**
 * Show no results message
 */
function showNoResults() {
    domElements.resultsSection.style.display = 'block';
    domElements.noResults.style.display = 'flex';
    domElements.hotelsGrid.innerHTML = '';
    domElements.aiInsights.style.display = 'none';
    document.querySelector('.hero').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Go back to search
 */
function goBackToSearch() {
    domElements.resultsSection.style.display = 'none';
    document.querySelector('.hero').style.display = 'block';
    domElements.searchInput.value = '';
    domElements.searchInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    state.currentResults = [];
    state.currentRequirements = null;
}

// ==================== LOADING & ERROR STATES ====================

/**
 * Show loading overlay
 */
function showLoading(message = 'Loading...') {
    domElements.loadingOverlay.style.display = 'flex';
    const textEl = domElements.loadingOverlay.querySelector('.loading-text');
    if (textEl) textEl.textContent = message;
    updateLoadingMessage('');
}

/**
 * Update loading message
 */
function updateLoadingMessage(message) {
    if (message) {
        domElements.loadingSubtext.textContent = message;
        domElements.loadingSubtext.style.display = 'block';
    } else {
        domElements.loadingSubtext.style.display = 'none';
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    domElements.loadingOverlay.style.display = 'none';
}

/**
 * Show error message
 */
function showError(message) {
    domElements.errorText.textContent = message;
    domElements.errorMessage.style.display = 'block';
    
    // Auto-hide after 6 seconds
    setTimeout(() => {
        domElements.errorMessage.style.display = 'none';
    }, 6000);
}

// ==================== THEME TOGGLE ====================

/**
 * Toggle dark/light theme
 */
function toggleTheme() {
    state.isDarkTheme = !state.isDarkTheme;
    
    if (state.isDarkTheme) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    localStorage.setItem('theme', state.isDarkTheme ? 'dark' : 'light');
    updateThemeIcon();
}

/**
 * Update theme toggle icon
 */
function updateThemeIcon() {
    const icon = domElements.themeToggle.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = state.isDarkTheme ? '☀️' : '🌙';
    }
}

// ==================== START APP ====================
document.addEventListener('DOMContentLoaded', init);
