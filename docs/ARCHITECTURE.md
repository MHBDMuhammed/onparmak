# Mimari notları

Bu belge Onparmak'ta davranış değiştirirken korunması gereken sınırları açıklar. Ürün tek bir statik React uygulamasıdır; bütün içerik ve karar mantığı build içine girer.

## Veri akışı

```text
curriculum + Turkish content
          ↓
practice generator ← local skill profile
          ↓
typing engine → strokes + metrics
          ↓
mastery/adaptation → next lesson or review
          ↓
localStorage + progress screens
```

`App` profili bir kez yükler ve ekranlar arasındaki ürün akışını yönetir. `Workspace`, düşük gecikmeli tuş işleme için bir `TypingEngine` örneğini çalışma boyunca korur. Engine görünümden bağımsızdır; React yalnızca kullanıcıya gösterilecek snapshot'ı render eder.

## Sınırlar

### `src/content`

`curriculum.ts` 12 aşamayı, 60 dersi, geçme eşiklerini ve o ana kadar öğrenilmiş karakter kümesini tanımlar. `turkish.ts` yerel kelime ve paragraf havuzudur. Component içinde ders metni üretilmez.

Yeni bir ders veya karakter sırası eklerken, önceki derslerde henüz öğretilmemiş karakter sızmadığını domain testiyle doğrulayın. Büyük harf aşamasından önce kelime havuzu Türkçe locale ile küçük harfe çevrilir.

### `src/domain/keyboard.ts`

Türkçe Q fiziksel düzeninin tek kaynağıdır. Her karakter fiziksel `KeyboardEvent.code`, parmak ve gerekiyorsa karşı elin Shift tuşuyla eşleşir. `i → İ` ve `ı → I` dönüşümleri yalnızca `tr-TR` locale ile yapılır.

### `src/domain/engine.ts`

Typing engine beklenen metni, aktif konumu, bütün karakter vuruşlarını ve silinen karakterlerin geçmişini tutar. Şu invariants korunur:

- Süre ilk geçerli karakter vuruşunda başlar.
- Pause sırasında geçen süre ölçüme girmez.
- Backspace görünür metni düzeltir fakat eski stroke'u kaldırmaz.
- Süre dolduktan sonra stroke veya backspace sonucu değiştiremez.
- Net hız, metinde kalan doğru karakterlere; ham hız bütün denemelere dayanır.
- NFC normalizasyonu birleştirilmiş Türkçe karakterleri tek karakter olarak işler.

Engine kasıtlı olarak mutable bir domain nesnesidir. Bu, her hızlı tuş vuruşunda büyük immutable React state kopyaları oluşturmadan geçmişi tek yerde tutar. Değişiklikler engine testlerinde doğrudan, browser testlerinde gerçek keyboard event'leriyle doğrulanır.

### `src/domain/progress.ts`

Profil, mastery, aralıklı tekrar ve persistence kurallarını içerir. `recordSession` aynı session ID'sini ikinci kez kaydetmez. Karakter ve geçiş becerileri kümülatif gözlem, yakın dönem doğruluğu, latency ve tekrar zamanı taşır.

`parseProfile` bir trust boundary'dir. İçe aktarılan JSON doğrudan uygulama state'i olmaz; dosya boyutu, anahtar biçimi, ders kimlikleri, sayaç ilişkileri, metrik sınırları ve liste uzunlukları doğrulanır. Storage şeması değişirse `version` artırılmalı ve eski yedek için açık bir migration eklenmelidir.

### `src/domain/practice.ts`

Pratik üretimi öğrenilmiş karakter kümesini aşmadan yerel Türkçe kelimeler seçer. Hedeflerin bir bölümü ders odağından, bir bölümü zayıf karakter/geçiş, karıştırılan çift ve tekrar zamanından gelir. Serbest antrenman aynı modeli besler fakat ders kilidini açmaz.

### `src/components` ve `src/pages`

`Workspace` kritik yazma etkileşimini, `KeyboardGuide` fiziksel düzeni gösterir. Sayfalar ürün alanlarını oluşturur; mastery veya metrik hesabını kendileri yapmaz. Erişilebilir dialog odağı ve ortak görsel parçalar `shared.tsx` içinde tutulur.

## Yerel persistence

Ana kayıt anahtarı `onparmak.progress.v1` değeridir. Son 500 session saklanır; kümülatif beceri kayıtları ayrıca tutulduğu için eski session'ların düşmesi mastery'yi silmez. Kazanımlar da session geçmişinden bağımsız kalır.

Başlangıçta kayıt bozuksa uygulama yeni profille açılır fakat eski değer otomatik olarak ezilmez. Kullanıcı Ayarlar'dan geçerli bir yedeği içe aktarınca veya açıkça sıfırlayınca yazma yeniden etkinleşir.

## Build ve offline davranışı

Vite production plugin'i gerçek hashed asset içeriklerinden cache revision üretir. Service worker yalnızca kendi origin ve scope'u içindeki GET isteklerini ele alır, yeni asset'leri install sırasında eksiksiz cache'ler ve yalnızca eski `onparmak-*` cache'lerini temizler.

Root build herhangi bir statik HTTPS hosting içindir. `pnpm build:pages`, asset ve worker yollarını `/onparmak/` scope'una taşır. `scripts/check-build.mjs` bu yolları, CSP'yi ve precache manifestini deployment öncesinde doğrular.

## Değişiklik kontrolü

- Saf domain davranışı: `tests/domain.test.ts`
- Klavye, focus, storage ve kullanıcı yolculuğu: `tests/browser`
- Production güvenlik ve offline yeniden açılış: `offline.spec.ts`
- Subpath deploy artifact'i: `pnpm check:pages`

Yeni abstraction ancak aynı kuralın birden fazla gerçek sahibi oluştuğunda eklenmelidir. Onparmak'ın basitliği; backend, senkronizasyon veya genel amaçlı plugin mimarisi olmadan domain sınırlarının açık kalmasına dayanır.
