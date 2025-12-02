// ===== TIKTOK API INSTANCE =====
let tiktokAPI = null;

// Initialize TikTok API if config exists
if (typeof CONFIG !== 'undefined') {
    tiktokAPI = new TikTokAPI(CONFIG);
    console.log('TikTok API initialized with client key:', CONFIG.tiktok.clientKey.substring(0, 8) + '...');
}

// ===== SAMPLE INFLUENCER DATA =====
const sampleInfluencers = {
    crypto_whale: {
        name: "Crypto Whale 🐋",
        username: "@crypto_whale",
        platform: "twitter",
        verified: true,
        bio: "DeFi enthusiast | 10x returns | NFA | Follow for alpha 🚀",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=cryptowhale&backgroundColor=0a0a0f",
        followers: 892500,
        followerChange: 12.5,
        engagementRate: 4.8,
        monthlyGrowth: 8.2,
        botPercentage: 8,
        trustScore: 82,
        riskScores: {
            growth: 85,
            engagement: 78,
            followers: 88,
            activity: 79
        },
        growthData: {
            labels: generateLast30Days(),
            organic: generateOrganicGrowth(850000, 892500, 30),
            suspicious: generateSuspiciousSpikes(30, 3)
        },
        engagementData: {
            likes: 65,
            comments: 20,
            shares: 10,
            saves: 5
        }
    },
    nft_artist: {
        name: "NFT Artist Pro",
        username: "@nft_artist",
        platform: "tiktok",
        verified: true,
        bio: "Creating digital art that speaks 🎨 | 50+ collections | OpenSea verified",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=nftartist&backgroundColor=0a0a0f",
        followers: 1250000,
        followerChange: 5.3,
        engagementRate: 7.2,
        monthlyGrowth: 4.1,
        botPercentage: 5,
        trustScore: 91,
        riskScores: {
            growth: 92,
            engagement: 95,
            followers: 89,
            activity: 88
        },
        growthData: {
            labels: generateLast30Days(),
            organic: generateOrganicGrowth(1200000, 1250000, 30),
            suspicious: generateSuspiciousSpikes(30, 1)
        },
        engagementData: {
            likes: 55,
            comments: 25,
            shares: 15,
            saves: 5
        }
    },
    fake_influencer: {
        name: "Make Money Fast 💰",
        username: "@fake_influencer",
        platform: "twitter",
        verified: false,
        bio: "Get rich quick! DM for secrets 💎 | 1000% gains guaranteed | Link in bio",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=fakeinfluencer&backgroundColor=0a0a0f",
        followers: 524000,
        followerChange: -2.1,
        engagementRate: 0.8,
        monthlyGrowth: 45.0,
        botPercentage: 68,
        trustScore: 23,
        riskScores: {
            growth: 15,
            engagement: 22,
            followers: 28,
            activity: 35
        },
        growthData: {
            labels: generateLast30Days(),
            organic: generateSuspiciousGrowth(200000, 524000, 30),
            suspicious: generateSuspiciousSpikes(30, 12)
        },
        engagementData: {
            likes: 85,
            comments: 5,
            shares: 8,
            saves: 2
        }
    }
};

// ===== HELPER FUNCTIONS =====
function generateLast30Days() {
    const labels = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
}

function generateOrganicGrowth(start, end, days) {
    const data = [];
    const dailyGrowth = (end - start) / days;
    let current = start;
    
    for (let i = 0; i < days; i++) {
        // Add some natural variation
        const variation = (Math.random() - 0.5) * dailyGrowth * 0.5;
        current += dailyGrowth + variation;
        data.push(Math.round(current));
    }
    return data;
}

function generateSuspiciousGrowth(start, end, days) {
    const data = [];
    let current = start;
    
    for (let i = 0; i < days; i++) {
        // Add random spikes
        if (Math.random() > 0.7) {
            current += Math.random() * 50000 + 10000;
        } else {
            current += (end - start) / days * 0.3;
        }
        data.push(Math.round(Math.min(current, end)));
    }
    return data;
}

function generateSuspiciousSpikes(days, spikeCount) {
    const data = new Array(days).fill(0);
    for (let i = 0; i < spikeCount; i++) {
        const index = Math.floor(Math.random() * days);
        data[index] = Math.random() * 30000 + 5000;
    }
    return data;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function getScoreClass(score) {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'moderate';
    if (score >= 30) return 'risky';
    return 'dangerous';
}

function getScoreVerdict(score) {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Moderate';
    if (score >= 30) return 'Risky';
    return 'Dangerous';
}

function getBotWarningClass(percentage) {
    if (percentage <= 10) return 'low';
    if (percentage <= 30) return 'medium';
    return 'high';
}

function getBotWarningText(percentage) {
    if (percentage <= 10) return 'Low Risk';
    if (percentage <= 30) return 'Medium Risk';
    return 'High Risk';
}

function getEngagementBadge(rate) {
    if (rate >= 6) return { class: 'high', text: 'Excellent' };
    if (rate >= 3) return { class: '', text: 'Good' };
    if (rate >= 1) return { class: '', text: 'Average' };
    return { class: 'low', text: 'Poor' };
}

function getOverallRisk(trustScore) {
    if (trustScore >= 70) return { class: 'low', text: 'Low Risk' };
    if (trustScore >= 40) return { class: 'medium', text: 'Medium Risk' };
    return { class: 'high', text: 'High Risk' };
}

function getRecommendation(trustScore, botPercentage, engagementRate) {
    if (trustScore >= 80 && botPercentage <= 10 && engagementRate >= 3) {
        return {
            type: 'safe',
            text: 'This influencer shows strong signs of authenticity. Their engagement appears organic, growth patterns are consistent, and bot activity is minimal. Recommended for brand partnerships and sponsored content.'
        };
    }
    if (trustScore >= 50) {
        return {
            type: 'caution',
            text: 'This account shows mixed signals. While some metrics look healthy, there are areas of concern. Consider requesting detailed analytics before proceeding with partnerships. Start with smaller campaigns to test actual conversion rates.'
        };
    }
    return {
        type: 'danger',
        text: 'WARNING: This account shows significant red flags including suspicious growth patterns, low engagement quality, and high bot activity. Advertising with this influencer carries substantial risk. Not recommended for brand partnerships.'
    };
}

// ===== CHART INSTANCES =====
let growthChart = null;
let engagementChart = null;

// ===== DOM ELEMENTS =====
const analyzeBtn = document.getElementById('analyzeBtn');
const usernameInput = document.getElementById('usernameInput');
const resultsSection = document.getElementById('resultsSection');
const platformTabs = document.querySelectorAll('.platform-tab');
const exampleBtns = document.querySelectorAll('.example-btn');

let selectedPlatform = 'tiktok';

// ===== EVENT LISTENERS =====
platformTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        platformTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        selectedPlatform = tab.dataset.platform;
    });
});

exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        usernameInput.value = btn.dataset.username;
        analyzeInfluencer(btn.dataset.username);
    });
});

analyzeBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim().replace('@', '');
    if (username) {
        analyzeInfluencer(username);
    }
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const username = usernameInput.value.trim().replace('@', '');
        if (username) {
            analyzeInfluencer(username);
        }
    }
});

// ===== MAIN ANALYSIS FUNCTION =====
async function analyzeInfluencer(username) {
    // Show loading state
    analyzeBtn.classList.add('loading');
    
    let data = null;

    // Try TikTok API first if platform is TikTok
    if (selectedPlatform === 'tiktok' && tiktokAPI) {
        console.log('🔍 Analyzing with TikTok API...');
        data = await analyzeWithTikTokAPI(username);
        
        if (data && data.isEstimated) {
            console.log('⚠️ Using estimated data (TikTok API requires authentication for full access)');
        }
    }

    // Fallback to sample data or random generation
    if (!data) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        data = sampleInfluencers[username] || generateRandomInfluencer(username);
    }
    
    // Update UI
    updateProfileHeader(data);
    updateStats(data);
    updateCharts(data);
    updateRiskAnalysis(data);
    updateRecommendation(data);
    
    // Show data source indicator
    if (data.isEstimated) {
        showDataSourceIndicator('estimated');
    } else if (sampleInfluencers[username]) {
        showDataSourceIndicator('demo');
    } else {
        showDataSourceIndicator('generated');
    }
    
    // Show results
    resultsSection.classList.remove('hidden');
    analyzeBtn.classList.remove('loading');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Show indicator for data source
function showDataSourceIndicator(type) {
    // Remove existing indicator
    const existing = document.querySelector('.data-source-indicator');
    if (existing) existing.remove();

    const messages = {
        estimated: '⚠️ Estimated data - Connect TikTok for real analytics',
        demo: '📊 Demo data - Try with a real username',
        generated: '🎲 Simulated data - API integration available',
        live: '✅ Live data from TikTok API'
    };

    const colors = {
        estimated: 'var(--accent-yellow)',
        demo: 'var(--accent-cyan)',
        generated: 'var(--accent-orange)',
        live: 'var(--accent-green)'
    };

    const indicator = document.createElement('div');
    indicator.className = 'data-source-indicator';
    indicator.style.cssText = `
        text-align: center;
        padding: 12px 20px;
        margin-bottom: 20px;
        background: rgba(255,255,255,0.05);
        border: 1px solid ${colors[type]};
        border-radius: 10px;
        color: ${colors[type]};
        font-size: 0.9rem;
    `;
    indicator.textContent = messages[type];

    resultsSection.insertBefore(indicator, resultsSection.firstChild);
}

function generateRandomInfluencer(username) {
    const trustScore = Math.floor(Math.random() * 60) + 30; // 30-90
    const botPercentage = Math.max(5, 100 - trustScore + Math.floor(Math.random() * 20));
    const followers = Math.floor(Math.random() * 900000) + 100000;
    
    return {
        name: username.charAt(0).toUpperCase() + username.slice(1).replace(/_/g, ' '),
        username: `@${username}`,
        platform: selectedPlatform,
        verified: Math.random() > 0.6,
        bio: "Digital creator | Content enthusiast | Let's connect!",
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}&backgroundColor=0a0a0f`,
        followers: followers,
        followerChange: (Math.random() * 20 - 5).toFixed(1),
        engagementRate: (Math.random() * 8 + 0.5).toFixed(1),
        monthlyGrowth: (Math.random() * 15).toFixed(1),
        botPercentage: Math.min(botPercentage, 85),
        trustScore: trustScore,
        riskScores: {
            growth: Math.floor(Math.random() * 40) + trustScore * 0.6,
            engagement: Math.floor(Math.random() * 40) + trustScore * 0.6,
            followers: Math.floor(Math.random() * 40) + trustScore * 0.6,
            activity: Math.floor(Math.random() * 40) + trustScore * 0.6
        },
        growthData: {
            labels: generateLast30Days(),
            organic: generateOrganicGrowth(followers * 0.9, followers, 30),
            suspicious: generateSuspiciousSpikes(30, trustScore < 50 ? 8 : 2)
        },
        engagementData: {
            likes: Math.floor(Math.random() * 40) + 40,
            comments: Math.floor(Math.random() * 25) + 5,
            shares: Math.floor(Math.random() * 20) + 5,
            saves: Math.floor(Math.random() * 10) + 2
        }
    };
}

function updateProfileHeader(data) {
    document.getElementById('profileImage').src = data.avatar;
    document.getElementById('profileName').textContent = data.name;
    document.getElementById('profileUsername').textContent = data.username;
    document.getElementById('profileBio').textContent = data.bio;
    
    // Verified badge
    const verifiedBadge = document.getElementById('verifiedBadge');
    if (data.verified) {
        verifiedBadge.classList.remove('hidden');
    } else {
        verifiedBadge.classList.add('hidden');
    }
    
    // Platform badge
    const platformBadge = document.getElementById('platformBadge');
    platformBadge.className = `platform-badge ${data.platform}`;
    platformBadge.innerHTML = data.platform === 'tiktok' 
        ? `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
    
    // Trust score
    const trustScore = document.getElementById('trustScore');
    const trustVerdict = document.getElementById('trustVerdict');
    const trustRingProgress = document.getElementById('trustRingProgress');
    
    trustScore.textContent = data.trustScore;
    trustVerdict.textContent = getScoreVerdict(data.trustScore);
    trustVerdict.className = `trust-verdict ${getScoreClass(data.trustScore)}`;
    
    // Animate ring
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (data.trustScore / 100) * circumference;
    
    // Add gradient definition if not exists
    if (!document.getElementById('trustGradient')) {
        const svg = trustRingProgress.closest('svg');
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00f5d4"/>
                <stop offset="100%" stop-color="#7b2ff7"/>
            </linearGradient>
        `;
        svg.insertBefore(defs, svg.firstChild);
    }
    
    setTimeout(() => {
        trustRingProgress.style.strokeDashoffset = offset;
    }, 100);
}

function updateStats(data) {
    // Followers
    document.getElementById('followerCount').textContent = formatNumber(data.followers);
    const followerChange = document.getElementById('followerChange');
    const changeValue = parseFloat(data.followerChange);
    followerChange.textContent = (changeValue >= 0 ? '+' : '') + changeValue + '%';
    followerChange.className = `stat-change ${changeValue >= 0 ? 'positive' : 'negative'}`;
    
    // Engagement
    document.getElementById('engagementRate').textContent = data.engagementRate + '%';
    const engagementBadge = document.getElementById('engagementBadge');
    const badge = getEngagementBadge(parseFloat(data.engagementRate));
    engagementBadge.textContent = badge.text;
    engagementBadge.className = `stat-badge ${badge.class}`;
    
    // Monthly Growth
    document.getElementById('monthlyGrowth').textContent = '+' + data.monthlyGrowth + '%';
    
    // Bot Percentage
    document.getElementById('botPercentage').textContent = data.botPercentage + '%';
    const botWarning = document.getElementById('botWarning');
    botWarning.textContent = getBotWarningText(data.botPercentage);
    botWarning.className = `stat-warning ${getBotWarningClass(data.botPercentage)}`;
}

function updateCharts(data) {
    // Destroy existing charts
    if (growthChart) growthChart.destroy();
    if (engagementChart) engagementChart.destroy();
    
    // Growth Chart
    const growthCtx = document.getElementById('growthChart').getContext('2d');
    growthChart = new Chart(growthCtx, {
        type: 'line',
        data: {
            labels: data.growthData.labels,
            datasets: [
                {
                    label: 'Followers',
                    data: data.growthData.organic,
                    borderColor: '#00f5d4',
                    backgroundColor: 'rgba(0, 245, 212, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#00f5d4'
                },
                {
                    label: 'Suspicious Activity',
                    data: data.growthData.suspicious,
                    borderColor: '#ff4757',
                    backgroundColor: 'rgba(255, 71, 87, 0.3)',
                    fill: true,
                    tension: 0,
                    borderWidth: 0,
                    pointRadius: (context) => {
                        return context.raw > 0 ? 6 : 0;
                    },
                    pointBackgroundColor: '#ff4757'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 30, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#a0a0b0',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return 'Followers: ' + formatNumber(context.raw);
                            }
                            return context.raw > 0 ? 'Suspicious spike: +' + formatNumber(context.raw) : '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b6b80',
                        maxRotation: 0,
                        maxTicksLimit: 7
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b6b80',
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });
    
    // Engagement Chart (Doughnut)
    const engagementCtx = document.getElementById('engagementChart').getContext('2d');
    engagementChart = new Chart(engagementCtx, {
        type: 'doughnut',
        data: {
            labels: ['Likes', 'Comments', 'Shares', 'Saves'],
            datasets: [{
                data: [
                    data.engagementData.likes,
                    data.engagementData.comments,
                    data.engagementData.shares,
                    data.engagementData.saves
                ],
                backgroundColor: [
                    '#f72585',
                    '#7b2ff7',
                    '#00f5d4',
                    '#ffd93d'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a0a0b0',
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 30, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#a0a0b0',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

function updateRiskAnalysis(data) {
    const factors = ['growth', 'engagement', 'followers', 'activity'];
    const factorElements = {
        growth: document.getElementById('riskGrowth'),
        engagement: document.getElementById('riskEngagement'),
        followers: document.getElementById('riskFollowers'),
        activity: document.getElementById('riskActivity')
    };
    
    factors.forEach(factor => {
        const score = Math.min(100, Math.max(0, data.riskScores[factor]));
        const element = factorElements[factor];
        const scoreClass = getScoreClass(score);
        
        element.className = `risk-factor ${scoreClass}`;
        element.querySelector('.factor-score').textContent = `${Math.round(score)}/100`;
        element.querySelector('.factor-fill').style.width = `${score}%`;
    });
    
    // Overall risk badge
    const overallRisk = document.getElementById('overallRisk');
    const risk = getOverallRisk(data.trustScore);
    overallRisk.textContent = risk.text;
    overallRisk.className = `risk-badge ${risk.class}`;
}

function updateRecommendation(data) {
    const recommendation = getRecommendation(data.trustScore, data.botPercentage, parseFloat(data.engagementRate));
    const card = document.getElementById('recommendationCard');
    const text = document.getElementById('recommendationText');
    
    card.className = `recommendation-card ${recommendation.type}`;
    text.textContent = recommendation.text;
    
    // Update icon based on type
    const iconContainer = card.querySelector('.recommendation-icon');
    if (recommendation.type === 'safe') {
        iconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        `;
    } else if (recommendation.type === 'caution') {
        iconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        `;
    } else {
        iconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
        `;
    }
}

// ===== TIKTOK LOGIN =====
const tiktokLoginBtn = document.getElementById('tiktokLoginBtn');

if (tiktokLoginBtn && tiktokAPI) {
    // Check if already connected
    if (tiktokAPI.isAuthenticated()) {
        tiktokLoginBtn.classList.add('connected');
        tiktokLoginBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            TikTok Connected
        `;
    }

    tiktokLoginBtn.addEventListener('click', () => {
        if (tiktokAPI.isAuthenticated()) {
            // Logout
            tiktokAPI.logout();
            tiktokLoginBtn.classList.remove('connected');
            tiktokLoginBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                Connect TikTok
            `;
        } else {
            // Login - redirect to TikTok OAuth
            const authUrl = tiktokAPI.getAuthUrl();
            window.open(authUrl, '_blank', 'width=600,height=700');
        }
    });
}

// Handle OAuth callback (if returning from TikTok)
if (window.location.search.includes('code=')) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && tiktokAPI) {
        tiktokAPI.handleCallback(code, state)
            .then(result => {
                console.log('OAuth callback handled:', result);
                // Clear URL params
                window.history.replaceState({}, document.title, window.location.pathname);
            })
            .catch(err => {
                console.error('OAuth error:', err);
            });
    }
}

// ===== ENHANCED ANALYSIS WITH TIKTOK API =====
async function analyzeWithTikTokAPI(username) {
    if (!tiktokAPI) {
        return null;
    }

    try {
        // Get user data from TikTok API
        const userData = await tiktokAPI.getUserInfo(username);
        
        // If we have video access, get engagement data
        let videos = [];
        if (tiktokAPI.isAuthenticated()) {
            const videoData = await tiktokAPI.getVideoList();
            videos = videoData.videos;
            
            // Calculate real engagement
            const engagement = tiktokAPI.calculateEngagement(videos, userData.followers);
            userData.engagementRate = engagement.rate;
            userData.engagementData = engagement.breakdown;
        }

        // Run bot detection
        const botAnalysis = BotDetector.analyzeFollowers(userData, videos);
        userData.botPercentage = botAnalysis.botPercentage;
        userData.botFactors = botAnalysis.factors;

        // Calculate trust score
        const trustResult = TrustScoreCalculator.calculate(userData, botAnalysis);
        userData.trustScore = trustResult.overall;
        userData.riskScores = trustResult.breakdown;

        return userData;
    } catch (error) {
        console.error('TikTok API analysis error:', error);
        return null;
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Add subtle parallax effect to glows
    document.addEventListener('mousemove', (e) => {
        const glows = document.querySelectorAll('.bg-glow');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        glows.forEach((glow, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            glow.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    // Log API status
    if (tiktokAPI) {
        console.log('🎵 TikTok API Ready');
        console.log('   Client Key: ' + CONFIG.tiktok.clientKey);
        console.log('   Authenticated: ' + tiktokAPI.isAuthenticated());
    }
});

