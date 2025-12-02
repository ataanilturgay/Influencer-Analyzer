# InfluenceGuard - Influencer Risk & Growth Analyzer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-TikTok%20%7C%20X-black)

## 🎯 Proje Hakkında

**InfluenceGuard**, TikTok ve X (Twitter) influencer'larının güvenilirliğini analiz eden bir araçtır. Bot takipçileri tespit eder, organik büyümeyi değerlendirir ve reklam verenler için risk skoru hesaplar.

### Neyi Analiz Eder?

- 🤖 **Bot Tespit**: Hesabın organik mi bottan mı büyüdüğünü analiz eder 

- 📊 **Gerçek Etkileşim Oranı**: Likes, comments, shares oranlarını değerlendirir
- 📈 **30 Gün Büyüme Grafiği**: Şüpheli büyüme spike'larını tespit eder
- ✅ **Güven Skoru**: "Bu hesap reklam için güvenilir mi?" sorusuna cevap verir

## 💰 Hedef Kitle

| Segment | Kullanım Senaryosu |
|---------|-------------------|
| **Reklam Verenler** | Influencer seçiminde risk değerlendirmesi |
| **Kripto Projeleri** | Proje tanıtımı için güvenilir influencer bulma |
| **NFT Projeleri** | Koleksiyon lansmanı için doğru kitleye ulaşma |
| **Markalar** | Sponsorluk anlaşmaları öncesi due diligence |

## 🚀 Kurulum

### Basit Kurulum (Statik)

1. Dosyaları indirin
2. `index.html` dosyasını tarayıcıda açın
3. Kullanmaya başlayın!

### Geliştirme Sunucusu

```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx serve .

# VS Code Live Server eklentisi ile
# Sağ tık -> "Open with Live Server"
```

Sonra `http://localhost:8000` adresini ziyaret edin.

## 📖 Kullanım

1. **Platform Seçin**: TikTok veya X (Twitter)
2. **Kullanıcı Adı Girin**: @ işareti olmadan username yazın
3. **Analyze'a Tıklayın**: Sonuçları bekleyin

### Demo Hesaplar

Örnek analizler için hazır hesaplar:
- `@crypto_whale` - Güvenilir kripto hesabı (Trust Score: 82)
- `@nft_artist` - Yüksek güvenilirlikli NFT sanatçısı (Trust Score: 91)
- `@fake_influencer` - Bot kullanımı yüksek hesap (Trust Score: 23)

## 📊 Metrikler

### Trust Score (Güven Skoru)
- **85-100**: Excellent - Mükemmel güvenilirlik
- **70-84**: Good - İyi güvenilirlik
- **50-69**: Moderate - Orta seviye risk
- **30-49**: Risky - Yüksek risk
- **0-29**: Dangerous - Tehlikeli, önerilmez

### Risk Faktörleri

| Faktör | Açıklama |
|--------|----------|
| Growth Pattern | Takipçi artış paternlerini analiz eder |
| Engagement Quality | Etkileşim kalitesini değerlendirir |
| Follower Authenticity | Sahte hesap ve bot tespit eder |
| Activity Consistency | Paylaşım sıklığını kontrol eder |

## 🛠️ Teknolojiler

- **HTML5/CSS3**: Modern, responsive tasarım
- **Vanilla JavaScript**: Framework bağımsız, hızlı
- **Chart.js**: İnteraktif grafikler
- **Google Fonts**: Outfit & JetBrains Mono

## 📁 Dosya Yapısı

```
influencer-analyzer/
├── index.html      # Ana HTML dosyası
├── styles.css      # Tüm stiller
├── app.js          # JavaScript mantığı
└── README.md       # Bu dosya
```

## 🔜 Gelecek Özellikler

- [ ] Gerçek API entegrasyonu (TikTok API, Twitter API v2)
- [ ] Kullanıcı hesapları ve geçmiş analizler
- [ ] PDF rapor indirme
- [ ] Bulk analiz (birden fazla hesap)
- [ ] Chrome extension
- [ ] Fiyatlandırma ve abonelik sistemi

## 💼 İş Modeli Önerileri

### Freemium Model
- **Free**: 5 analiz/ay
- **Pro ($29/ay)**: 100 analiz/ay + detaylı raporlar
- **Enterprise ($199/ay)**: Unlimited + API erişimi

### Per-Analysis Model
- Tek seferlik analiz: $2-5
- Bulk paketler: 10 analiz $15, 50 analiz $60

### API Fiyatlandırması
- 1000 API call: $50
- 10000 API call: $300

## 📜 Lisans

MIT License - Ticari kullanıma açık

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilmektedir. Büyük değişiklikler için önce issue açın.

---

**InfluenceGuard** - *Trust Your Influencer Investments* 🛡️

