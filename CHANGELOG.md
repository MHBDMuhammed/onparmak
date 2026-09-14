# Değişiklik günlüğü

Bu dosya Onparmak'ın kullanıcıya ve contributor'a dokunan önemli değişikliklerini izler. Biçim [Keep a Changelog](https://keepachangelog.com/tr-TR/1.1.0/) yaklaşımına dayanır; sürümler [Semantic Versioning](https://semver.org/) izler.

## [Unreleased]

### Eklendi

- Uygulama footer'ına `mhbd.dev` geliştirici imzası
- Türkçe SEO metadata'sı: arama açıklaması, canonical, robots/sitemap, Open Graph, Twitter kartı, yerel sosyal önizleme görseli ve JSON-LD
- Cloudflare `_headers` ile güvenli cache/header politikası ve offline precache'e SEO/icon asset'leri
- Production SEO, cache ve bundle bütçesi için browser regresyon testleri

### Değişti

- Canonical canlı uygulama adresi `https://onparmak.mhbd.dev/` olarak güncellendi
- Semantic heading hiyerarşisi düzeltildi; görsel kart başlıkları paragraf stiline taşındı
- Kullanılmayan Lucide icon import'ları temizlendi

## [1.0.0] - 2026-09-14

### Eklendi

- Türkçe Q için 12 aşama, 60 ders ve üç turlu mastery akışı
- Karakter, geçiş, karışıklık, latency ve aralıklı tekrar verileriyle adaptif çalışma
- Hata geçmişini koruyan yazma motoru; doğruluk, ham/net hız ve ritim ölçümleri
- 1–5 dakikalık kişiselleştirilmiş serbest antrenman
- Yerel ilerleme, doğrulanan JSON yedeği, açık/koyu tema ve offline cache
- Domain, müfredat, browser, güvenlik, responsive ve çevrimdışı davranış testleri
- Pnpm tabanlı deterministik toolchain, lint/typecheck/build kapıları ve GitHub Actions CI
- Katkı, davranış, destek ve güvenlik politikaları

### Güvenlik

- Production Content Security Policy ile ağ bağlantıları same-origin kapsamına alındı
- İçe aktarılan bütün ders, beceri, metrik ve oturum alanlarına sınır doğrulaması eklendi
- Vite geliştirme sunucusu yalnızca localhost üzerinde açılacak şekilde güvenli varsayılan kazandı

[Unreleased]: https://github.com/MHBDMuhammed/onparmak/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/MHBDMuhammed/onparmak/releases/tag/v1.0.0
