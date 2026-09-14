<p align="center">
  <img src="./public/favicon.svg" width="72" height="72" alt="Onparmak logosu">
</p>

<h1 align="center">Onparmak</h1>

<p align="center">
  Türkçe Q klavyede, kendi ritminde on parmak öğren.<br>
  <strong>Hesap yok. Sunucu yok. Takip yok. İlerlemen cihazında.</strong>
</p>

<p align="center">
  <a href="https://github.com/MHBDMuhammed/onparmak/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/MHBDMuhammed/onparmak/actions/workflows/ci.yml/badge.svg"></a>
  <a href="./LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-315844"></a>
</p>

<p align="center">
  <a href="https://mhbdmuhammed.github.io/onparmak/"><strong>Canlı uygulamayı aç</strong></a>
</p>

Onparmak, Türkçe Q klavyede sıfırdan gerçek on parmak yetkinliğine ilerleyen açık kaynak bir öğrenme uygulamasıdır. Yalnızca hız testi sunmaz; doğru motor alışkanlık, doğruluk, ritim, kalıcılık ve gerçek Türkçe metinlere aktarımı birlikte çalıştırır.

Uygulama Vite, React ve TypeScript ile hazırlanmış tamamen statik bir frontend'dir. Backend, kullanıcı hesabı, analitik veya harici içerik servisi kullanmaz. Temel işlevler ilk kurulumdan sonra internet bağlantısı olmadan çalışır.

## Neler var?

- Ana sıradan beş dakikalık bağımsız yazıma uzanan 12 aşama ve 60 ders
- Her beceri için **tanı → pekiştir → hatırla** döngüsü
- `ğ`, `ü`, `ş`, `ı`, `ö`, `ç`, `i/İ` ve `ı/I` ayrımını içeren eksiksiz Türkçe Q düzeni
- Karşı elle Shift, büyük harf, noktalama, sayılar, ritim ve dayanıklılık çalışmaları
- Tuş doğruluğu, gecikme, karıştırılan karakter ve zor geçişlere göre yerel adaptasyon
- 1–5 dakikalık kişiselleştirilmiş serbest antrenman
- Geri silinen hataları geçmişten kaldırmayan tutarlı yazma ölçümleri
- Açık/koyu tema, responsive arayüz, klavye erişilebilirliği ve azaltılmış hareket desteği
- `localStorage` tabanlı ilerleme, doğrulanan JSON yedeği ve çevrimdışı yeniden açılış

## Hızlı başlangıç

Gereksinimler:

- Node.js `>=22.12 <25` — `.nvmrc` ile Node 22 seçilebilir
- Corepack üzerinden repository'de sabitlenen pnpm sürümü

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Uygulama varsayılan olarak yalnızca `http://localhost:5173` üzerinde açılır. Aynı ağdaki başka cihazlardan bilinçli olarak erişmek için `pnpm dev:host` kullanılabilir.

## Komutlar

| Komut               | Amaç                                                 |
| ------------------- | ---------------------------------------------------- |
| `pnpm dev`          | Güvenli localhost geliştirme sunucusu                |
| `pnpm typecheck`    | TypeScript kontrolü                                  |
| `pnpm lint`         | TypeScript ve React statik analizi                   |
| `pnpm format:check` | Biçim kontrolü                                       |
| `pnpm test`         | Domain ve müfredat testleri                          |
| `pnpm build`        | TypeScript kontrolü ve statik production build       |
| `pnpm test:e2e`     | Production build ve Playwright tarayıcı senaryoları  |
| `pnpm check`        | Format, lint, domain testleri ve build kalite kapısı |
| `pnpm preview`      | Build'i yalnızca yerel doğrulama için önizleme       |

Playwright'ın sabit Chromium sürümünü ilk kez kurmak için:

```bash
pnpm exec playwright install chromium
```

Linux CI ortamında sistem bağımlılıklarıyla birlikte `pnpm exec playwright install --with-deps chromium` kullanılır.

## Öğrenme ve ölçüm modeli

Dersler yeni hareketi görünür klavye rehberiyle tanıtır, bilinen tuşlarla karıştırarak pekiştirir ve son turda rehbersiz hatırlatır. Yeni ders, önceki becerinin üç turu tamamlanmadan açılmaz. Doğruluk bozulduğunda hız hedefi geri çekilir; unutulma zamanı gelen beceriler ve tekrar eden hatalar sonraki içeriğe döner.

- **Doğruluk:** doğru karakter vuruşları / tüm karakter vuruşları. Backspace eski hatayı silmez.
- **Net hız:** metinde kalan doğru karakterler / 5 / aktif dakika. Ham hız tüm vuruşları sayar.
- **Ritim dengesi:** doğru ve silinmemiş vuruş aralıklarının değişkenliği. En az sekiz aralık gerekir.
- **Yerleşen tuş:** en az 30 vuruş, üç ayrı tur ve yakın dönem doğruluğunun ortak sonucu.

Uygulama hangi parmağın kullanıldığını veya kullanıcının klavyeye bakıp bakmadığını teknik olarak izlemez. Bu iki sinyal ile fiziksel rahatlık, tur sonundaki açık öz değerlendirmeyle öğrenme planına katılır.

## Gizlilik ve güvenlik

Onparmak çalışma sırasında ilerleme verisini yalnızca tarayıcıdaki `localStorage` alanına yazar. Telemetri, analitik, reklam, hesap veya bulut eşitleme yoktur. Production Content Security Policy bağlantıları aynı origin ile sınırlar; tarayıcı testi de temel işlevlerin harici istekte bulunmadığını korur.

Yedek içe aktarma, dosya boyutunu ve tüm ders, beceri, oturum ve metrik sınırlarını doğrular. Geçersiz yerel kayıt otomatik olarak ezilmez. Tarayıcı verilerini temizlemek ilerlemeyi kaldıracağı için Ayarlar bölümünden düzenli JSON yedeği alınabilir.

Bir güvenlik problemi bulursanız public issue açmadan önce [güvenlik politikasını](./SECURITY.md) izleyin.

## Mimari

```text
src/
├── content/      Türkçe içerik ve tam müfredat
├── domain/       Klavye, yazma motoru, adaptasyon ve persistence
├── components/   Yazma alanı, klavye rehberi ve ortak parçalar
└── pages/        Kurs, antrenman, gelişim, rehber ve ayarlar
tests/
├── domain.test.ts
└── browser/      Kritik kullanıcı, güvenlik ve offline akışları
```

Domain mantığı React görünümünden ayrıdır. Eğitim içeriği component'lere gömülmez. Projede bilerek backend veya hesap katmanı bulunmaz; yerel ve statik mimari ürünün gizlilik modelidir.

State akışı, engine invariants, storage şeması ve offline build ayrıntıları için [mimari bakım notlarına](./docs/ARCHITECTURE.md) bakın.

## Production ve yayın

`pnpm build` çıktısı `dist/` altında oluşur ve herhangi bir statik HTTPS hosting'e yüklenebilir. `vite dev` ve `vite preview` production sunucusu değildir.

`main` branch'indeki CI başarıyla tamamlandığında GitHub Pages workflow'u uygulamayı `/onparmak/` alt yolu için build eder ve yayınlar. Service worker aynı deployment scope'unda sürümlenir, eski Onparmak cache'lerini temizler ve bağlantı yokken uygulama kabuğunu geri yükler.

## Katkı

Küçük hata düzeltmeleri ve iyi tanımlanmış iyileştirmeler memnuniyetle karşılanır. Eğitim davranışını değiştiren önerilerde yalnızca arayüzü değil, motor beceri ve ölçüm sonuçlarını da açıklayın.

Başlamadan önce [katkı rehberini](./CONTRIBUTING.md) ve [davranış kurallarını](./CODE_OF_CONDUCT.md) okuyun. Genel kullanım soruları için [support rehberine](./SUPPORT.md) bakın.

## English

Onparmak is a privacy-first, offline-capable touch-typing course built specifically for the Turkish Q keyboard. The primary project documentation and learning content are in Turkish; contribution essentials are summarized in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Lisans

Kod ve repository içeriği [MIT Lisansı](./LICENSE) ile yayımlanır. © 2026 Muhammed Bodruk.
