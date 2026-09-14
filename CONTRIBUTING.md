# Onparmak'a katkı

Onparmak'a gösterdiğiniz ilgi için teşekkürler. Projenin önceliği gerçek öğrenme, doğru motor alışkanlık ve kullanıcı verisinin cihazda kalmasıdır. Katkılar bu üç ilkeyi korumalıdır.

## Başlamadan önce

- Mevcut issue'ları ve pull request'leri kontrol edin.
- Büyük bir özellik veya eğitim yaklaşımı değişikliği için önce feature request açın.
- Küçük hata, erişilebilirlik ve dokümantasyon düzeltmeleri doğrudan pull request olabilir.
- Güvenlik açıklarını public issue ile paylaşmayın; [SECURITY.md](./SECURITY.md) içindeki özel bildirim yolunu kullanın.

Onparmak statik ve local-first kalır. Backend, kullanıcı hesabı, telemetri, analitik, tracking veya zorunlu harici servis ekleyen değişiklikler proje kapsamı dışındadır.

## Yerel geliştirme

```bash
git clone https://github.com/MHBDMuhammed/onparmak.git
cd onparmak
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Node ve pnpm sürümleri `.nvmrc`, `engines` ve `packageManager` alanlarında sabittir. Başka bir package manager kullanmayın ve `pnpm-lock.yaml` değiştiyse commit'e dahil edin.

## Değişiklik yaparken

1. `main` üzerinden kısa ömürlü bir branch açın.
2. Değişikliği en küçük doğru kapsamda uygulayın.
3. Görsel kişiliği, Türkçe içeriği ve mevcut kullanıcı ilerlemesini koruyun.
4. Davranış değişikliği için onu bozulsaydı yakalayacak tek, anlamlı testi ekleyin.
5. Commit'leri mantıksal ve okunabilir tutun.

Müfredat veya adaptasyon değişikliklerinde şunları özellikle kontrol edin:

- Ders yalnızca o ana kadar öğretilen tuşları kullanıyor mu?
- `i/İ` ve `ı/I` eşleşmeleri Türkçe locale ile doğru mu?
- Doğruluk yerleşmeden hız baskısı oluşuyor mu?
- Backspace geçmiş hatayı ölçümden kaldırıyor mu?
- Değişiklik mevcut localStorage yedeğiyle uyumlu mu?

Arayüz değişikliklerinde klavye odağını, renk kontrastını, `prefers-reduced-motion` davranışını ve 320 px genişliğe kadar yatay taşmayı kontrol edin.

## Kalite kontrolleri

Pull request açmadan önce:

```bash
pnpm check
pnpm exec playwright install chromium # yalnızca ilk kurulumda
pnpm test:e2e
```

`pnpm check`; format, lint, domain testleri, TypeScript ve production build kontrollerini çalıştırır. Testleri devre dışı bırakarak veya beklentileri davranıştan kopararak yeşile çevirmeyin.

## Pull request

PR template'ini doldurun. Özellikle kullanıcı davranışını, eğitim etkisini, privacy/network etkisini ve yaptığınız doğrulamayı belirtin. Görsel değişikliklerde önce/sonra ekran görüntüsü ekleyin.

Conventional Commit biçimi tercih edilir:

```text
fix: preserve Turkish casing during backup restore
test: cover timed practice focus loss
docs: clarify offline deployment
```

Bir pull request'in kabul edilmesi garanti değildir. Bakım yükü, ürün sadeliği ve pedagojik sonuç teknik doğruluk kadar önemlidir.

## Dil

Uygulama metni ve ana dokümantasyon Türkçedir. Kod isimleri ve commit mesajları İngilizcedir. Türkçe konuşmayan contributors İngilizce issue ve pull request açabilir.

---

**English summary:** Use the pinned Node/pnpm toolchain, keep the app static and local-first, open an issue before large product or curriculum changes, run `pnpm check` and `pnpm test:e2e`, and explain learning/privacy impact in your pull request.
