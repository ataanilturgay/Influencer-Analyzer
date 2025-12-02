// ===== TIKTOK API SERVICE =====
// Handles TikTok API authentication and data fetching

class TikTokAPI {
    constructor(config) {
        this.clientKey = config.tiktok.clientKey;
        this.redirectUri = config.tiktok.redirectUri;
        this.scope = config.tiktok.scope;
        this.accessToken = localStorage.getItem('tiktok_access_token') || null;
        this.tokenExpiry = localStorage.getItem('tiktok_token_expiry') || null;
    }

    // ===== AUTHENTICATION =====
    
    /**
     * Generate OAuth URL for TikTok login
     */
    getAuthUrl() {
        const csrfState = this.generateCSRFState();
        sessionStorage.setItem('tiktok_csrf_state', csrfState);

        const params = new URLSearchParams({
            client_key: this.clientKey,
            scope: this.scope,
            response_type: 'code',
            redirect_uri: this.redirectUri,
            state: csrfState
        });

        const authUrl = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
        
        // Log for debugging
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔑 TikTok OAuth Debug Info:');
        console.log('   Client Key:', this.clientKey);
        console.log('   Redirect URI:', this.redirectUri);
        console.log('   Scope:', this.scope);
        console.log('   Full Auth URL:', authUrl);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  Make sure Redirect URI above matches EXACTLY');
        console.log('   what you set in TikTok Developer Console!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        return authUrl;
    }

    /**
     * Generate CSRF state for security
     */
    generateCSRFState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    /**
     * Handle OAuth callback
     */
    async handleCallback(code, state) {
        // Verify CSRF state
        const savedState = sessionStorage.getItem('tiktok_csrf_state');
        if (state !== savedState) {
            throw new Error('CSRF state mismatch - possible security issue');
        }

        // Note: Token exchange should be done on backend for security
        // This is a simplified frontend-only version
        console.log('Authorization code received:', code);
        
        // In production, send this code to your backend:
        // const response = await fetch('/api/tiktok/token', { 
        //     method: 'POST', 
        //     body: JSON.stringify({ code }) 
        // });
        
        return { success: true, code };
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        if (!this.accessToken) return false;
        if (this.tokenExpiry && Date.now() > parseInt(this.tokenExpiry)) {
            this.logout();
            return false;
        }
        return true;
    }

    /**
     * Logout - clear tokens
     */
    logout() {
        this.accessToken = null;
        this.tokenExpiry = null;
        localStorage.removeItem('tiktok_access_token');
        localStorage.removeItem('tiktok_token_expiry');
    }

    // ===== USER DATA =====

    /**
     * Fetch user profile information
     * Requires: user.info.basic scope
     */
    async getUserInfo(username) {
        // TikTok API v2 requires authentication for user data
        // For public profiles, we need to use alternative methods
        
        if (!this.isAuthenticated()) {
            console.log('Not authenticated - using estimated data');
            return this.getEstimatedUserData(username);
        }

        try {
            const response = await fetch('https://open.tiktokapis.com/v2/user/info/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    fields: 'open_id,union_id,avatar_url,display_name,bio_description,follower_count,following_count,likes_count,video_count'
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return this.transformUserData(data);
        } catch (error) {
            console.error('TikTok API Error:', error);
            return this.getEstimatedUserData(username);
        }
    }

    /**
     * Fetch user's video list
     * Requires: video.list scope
     */
    async getVideoList(cursor = 0, maxCount = 20) {
        if (!this.isAuthenticated()) {
            return { videos: [], hasMore: false };
        }

        try {
            const response = await fetch('https://open.tiktokapis.com/v2/video/list/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    max_count: maxCount,
                    cursor: cursor,
                    fields: 'id,title,video_description,duration,cover_image_url,share_url,view_count,like_count,comment_count,share_count,create_time'
                })
            });

            const data = await response.json();
            return {
                videos: data.data?.videos || [],
                hasMore: data.data?.has_more || false,
                cursor: data.data?.cursor || 0
            };
        } catch (error) {
            console.error('Error fetching videos:', error);
            return { videos: [], hasMore: false };
        }
    }

    // ===== DATA TRANSFORMATION =====

    /**
     * Transform TikTok API response to our format
     */
    transformUserData(apiData) {
        const user = apiData.data?.user || {};
        
        return {
            name: user.display_name || 'Unknown',
            username: `@${user.username || 'unknown'}`,
            platform: 'tiktok',
            verified: user.is_verified || false,
            bio: user.bio_description || '',
            avatar: user.avatar_url || this.getDefaultAvatar(),
            followers: user.follower_count || 0,
            following: user.following_count || 0,
            likes: user.likes_count || 0,
            videoCount: user.video_count || 0,
            // These will be calculated from video data
            engagementRate: 0,
            monthlyGrowth: 0,
            botPercentage: 0,
            trustScore: 0
        };
    }

    /**
     * Calculate engagement metrics from video data
     */
    calculateEngagement(videos, followerCount) {
        if (!videos.length || !followerCount) {
            return { rate: 0, breakdown: { likes: 0, comments: 0, shares: 0 } };
        }

        let totalLikes = 0;
        let totalComments = 0;
        let totalShares = 0;
        let totalViews = 0;

        videos.forEach(video => {
            totalLikes += video.like_count || 0;
            totalComments += video.comment_count || 0;
            totalShares += video.share_count || 0;
            totalViews += video.view_count || 0;
        });

        const avgEngagement = (totalLikes + totalComments + totalShares) / videos.length;
        const engagementRate = (avgEngagement / followerCount) * 100;

        const totalEngagement = totalLikes + totalComments + totalShares;
        
        return {
            rate: Math.round(engagementRate * 100) / 100,
            breakdown: {
                likes: Math.round((totalLikes / totalEngagement) * 100),
                comments: Math.round((totalComments / totalEngagement) * 100),
                shares: Math.round((totalShares / totalEngagement) * 100)
            },
            averageViews: Math.round(totalViews / videos.length),
            totalLikes,
            totalComments,
            totalShares
        };
    }

    // ===== ESTIMATION (for non-authenticated requests) =====

    /**
     * Estimate user data based on username patterns
     * Used when API access is not available
     */
    getEstimatedUserData(username) {
        // Generate consistent "random" data based on username
        const seed = this.hashCode(username);
        const rand = this.seededRandom(seed);

        const followers = Math.floor(rand() * 900000) + 10000;
        const engagementRate = (rand() * 8 + 0.5).toFixed(1);
        const botPercentage = Math.floor(rand() * 40) + 5;
        
        // Calculate trust score based on engagement and bot percentage
        const trustScore = Math.min(100, Math.max(0, 
            70 - (botPercentage * 0.8) + (parseFloat(engagementRate) * 5)
        ));

        return {
            name: this.formatUsername(username),
            username: `@${username}`,
            platform: 'tiktok',
            verified: rand() > 0.7,
            bio: 'TikTok Creator 🎬 | Content enthusiast',
            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}&backgroundColor=0a0a0f`,
            followers: followers,
            followerChange: ((rand() * 20) - 5).toFixed(1),
            engagementRate: parseFloat(engagementRate),
            monthlyGrowth: (rand() * 15).toFixed(1),
            botPercentage: botPercentage,
            trustScore: Math.round(trustScore),
            riskScores: {
                growth: Math.round(trustScore + (rand() * 20 - 10)),
                engagement: Math.round(trustScore + (rand() * 20 - 10)),
                followers: Math.round(trustScore + (rand() * 20 - 10)),
                activity: Math.round(trustScore + (rand() * 20 - 10))
            },
            growthData: this.generateGrowthData(followers, rand),
            engagementData: {
                likes: Math.floor(rand() * 30) + 50,
                comments: Math.floor(rand() * 20) + 10,
                shares: Math.floor(rand() * 15) + 5,
                saves: Math.floor(rand() * 10) + 5
            },
            isEstimated: true // Flag to show this is estimated data
        };
    }

    /**
     * Generate growth data for charts
     */
    generateGrowthData(currentFollowers, rand) {
        const labels = [];
        const organic = [];
        const suspicious = [];
        
        const today = new Date();
        const startFollowers = currentFollowers * (0.85 + rand() * 0.1);
        const dailyGrowth = (currentFollowers - startFollowers) / 30;

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            const dayIndex = 29 - i;
            const variation = (rand() - 0.5) * dailyGrowth * 0.5;
            organic.push(Math.round(startFollowers + (dailyGrowth * dayIndex) + variation));
            
            // Random suspicious spikes
            suspicious.push(rand() > 0.9 ? Math.floor(rand() * 20000) + 5000 : 0);
        }

        return { labels, organic, suspicious };
    }

    // ===== UTILITY FUNCTIONS =====

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    seededRandom(seed) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }

    formatUsername(username) {
        return username
            .split(/[_.-]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    getDefaultAvatar() {
        return 'https://api.dicebear.com/7.x/identicon/svg?seed=default&backgroundColor=0a0a0f';
    }
}

// ===== BOT DETECTION ALGORITHMS =====

class BotDetector {
    /**
     * Analyze follower authenticity
     * Returns estimated bot percentage
     */
    static analyzeFollowers(userData, videos) {
        let score = 0;
        let factors = [];

        // Factor 1: Engagement Rate vs Followers
        const expectedEngagement = this.getExpectedEngagement(userData.followers);
        const actualEngagement = userData.engagementRate;
        
        if (actualEngagement < expectedEngagement * 0.3) {
            score += 30;
            factors.push('Very low engagement for follower count');
        } else if (actualEngagement < expectedEngagement * 0.6) {
            score += 15;
            factors.push('Below average engagement');
        }

        // Factor 2: Follower to Following Ratio
        if (userData.following > 0) {
            const ratio = userData.followers / userData.following;
            if (ratio < 0.5) {
                score += 20;
                factors.push('Suspicious follower/following ratio');
            }
        }

        // Factor 3: Growth Spikes (if available)
        if (userData.growthData) {
            const spikes = this.detectGrowthSpikes(userData.growthData.organic);
            if (spikes > 3) {
                score += spikes * 5;
                factors.push(`${spikes} suspicious growth spikes detected`);
            }
        }

        // Factor 4: Video engagement consistency
        if (videos && videos.length > 0) {
            const variance = this.calculateEngagementVariance(videos);
            if (variance > 100) {
                score += 15;
                factors.push('Inconsistent video engagement');
            }
        }

        return {
            botPercentage: Math.min(85, Math.max(5, score)),
            factors,
            riskLevel: score > 50 ? 'high' : score > 25 ? 'medium' : 'low'
        };
    }

    static getExpectedEngagement(followers) {
        // Industry benchmarks for TikTok
        if (followers < 10000) return 8;
        if (followers < 100000) return 5;
        if (followers < 1000000) return 3;
        return 1.5;
    }

    static detectGrowthSpikes(data) {
        let spikes = 0;
        const avgGrowth = data.reduce((a, b, i, arr) => {
            if (i === 0) return 0;
            return a + (b - arr[i-1]);
        }, 0) / (data.length - 1);

        for (let i = 1; i < data.length; i++) {
            const dailyGrowth = data[i] - data[i-1];
            if (dailyGrowth > avgGrowth * 5) {
                spikes++;
            }
        }
        return spikes;
    }

    static calculateEngagementVariance(videos) {
        const engagements = videos.map(v => 
            (v.like_count || 0) + (v.comment_count || 0) + (v.share_count || 0)
        );
        const avg = engagements.reduce((a, b) => a + b, 0) / engagements.length;
        const variance = engagements.reduce((sum, val) => 
            sum + Math.pow(val - avg, 2), 0
        ) / engagements.length;
        return Math.sqrt(variance) / avg * 100; // Coefficient of variation
    }
}

// ===== TRUST SCORE CALCULATOR =====

class TrustScoreCalculator {
    /**
     * Calculate overall trust score
     */
    static calculate(userData, botAnalysis) {
        const weights = {
            engagement: 0.30,
            growth: 0.25,
            followers: 0.25,
            activity: 0.20
        };

        const scores = {
            engagement: this.scoreEngagement(userData.engagementRate),
            growth: this.scoreGrowth(userData.monthlyGrowth, userData.growthData),
            followers: 100 - (botAnalysis?.botPercentage || userData.botPercentage || 20),
            activity: this.scoreActivity(userData)
        };

        const trustScore = Object.keys(weights).reduce((total, key) => {
            return total + (scores[key] * weights[key]);
        }, 0);

        return {
            overall: Math.round(Math.min(100, Math.max(0, trustScore))),
            breakdown: scores,
            verdict: this.getVerdict(trustScore)
        };
    }

    static scoreEngagement(rate) {
        if (rate >= 6) return 95;
        if (rate >= 4) return 85;
        if (rate >= 2) return 70;
        if (rate >= 1) return 50;
        return 30;
    }

    static scoreGrowth(monthlyGrowth, growthData) {
        let score = 70;
        
        // Penalize extreme growth
        if (monthlyGrowth > 30) score -= 20;
        else if (monthlyGrowth > 15) score -= 10;
        
        // Check for organic patterns
        if (growthData?.suspicious) {
            const totalSpikes = growthData.suspicious.filter(v => v > 0).length;
            score -= totalSpikes * 5;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    static scoreActivity(userData) {
        let score = 70;
        
        if (userData.videoCount > 50) score += 15;
        else if (userData.videoCount > 20) score += 10;
        else if (userData.videoCount < 5) score -= 20;
        
        return Math.max(0, Math.min(100, score));
    }

    static getVerdict(score) {
        if (score >= 85) return { text: 'Excellent', class: 'excellent' };
        if (score >= 70) return { text: 'Good', class: 'good' };
        if (score >= 50) return { text: 'Moderate', class: 'moderate' };
        if (score >= 30) return { text: 'Risky', class: 'risky' };
        return { text: 'Dangerous', class: 'dangerous' };
    }
}

// Export classes
window.TikTokAPI = TikTokAPI;
window.BotDetector = BotDetector;
window.TrustScoreCalculator = TrustScoreCalculator;

