// ===== TIKTOK API CONFIGURATION =====
// IMPORTANT: In production, NEVER expose API keys in frontend code!
// Use a backend server to proxy API requests.

const CONFIG = {
    tiktok: {
        clientKey: 'awbeaztoxg4xorxo', // Your TikTok Client Key
        clientSecret: '', // Keep empty in frontend - use backend for this
        // IMPORTANT: This must match EXACTLY what you set in TikTok Developer Console
        redirectUri: window.location.href.split('?')[0], // Current page URL
        scope: 'user.info.basic' // Start with basic scope only
    },
    twitter: {
        bearerToken: '', // Twitter API Bearer Token (if you have one)
        apiKey: '',
        apiSecret: ''
    },
    // API Endpoints
    endpoints: {
        tiktok: {
            auth: 'https://www.tiktok.com/v2/auth/authorize/',
            token: 'https://open.tiktokapis.com/v2/oauth/token/',
            userInfo: 'https://open.tiktokapis.com/v2/user/info/',
            videoList: 'https://open.tiktokapis.com/v2/video/list/'
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

