# Güvenlik politikası

## Desteklenen sürüm

Onparmak tek bir statik web uygulaması olarak yayımlanır. Yalnızca `main` branch'indeki ve [canlı production sürümündeki](https://onparmak.mhbd.dev/) güncel kod güvenlik düzeltmeleri alır.

| Sürüm                       | Destek |
| --------------------------- | ------ |
| Güncel `main` / canlı sürüm | ✅     |
| Eski commit veya fork'lar   | ❌     |

## Açık bildirme

Bir güvenlik açığını public issue, discussion veya pull request ile paylaşmayın. Repository'nin **Security → Report a vulnerability** bağlantısını kullanarak GitHub Private Vulnerability Reporting üzerinden özel rapor gönderin:

https://github.com/MHBDMuhammed/onparmak/security/advisories/new

Rapora mümkünse şunları ekleyin:

- Etkilenen commit veya canlı URL
- Tekrarlama adımları ve beklenen etki
- İlgili tarayıcı ve işletim sistemi
- Proof of concept; gerçek kullanıcı verisi veya credential içermeden
- Önerilen düzeltme varsa kısa açıklaması

Raporun alındığı üç iş günü içinde doğrulanmaya çalışılır. Etki ve düzeltme planı netleşmeden ayrıntıları public paylaşmamanızı rica ederiz.

## Kapsam

Özellikle şu alanlardaki gerçek güvenlik etkileri kapsam içindedir:

- Zararlı yedek dosyasıyla kod çalıştırma veya veri sızdırma
- Content Security Policy ya da same-origin ağ sınırını aşma
- Service worker cache zehirleme veya yanlış scope kontrolü
- Dependency supply-chain problemi
- Kullanıcı ilerlemesinin izinsiz dışarı gönderilmesi

Genel hata raporları, kendi tarayıcı verisini değiştirme, desteklenmeyen eski browser davranışları ve sosyal mühendislik güvenlik bildirimi değildir; bunlar için uygun issue formunu kullanın.

## Güvenlik ve gizlilik modeli

Onparmak backend, hesap, telemetri veya analitik kullanmaz. İlerleme `localStorage` içinde kalır; indirilen yedek ancak kullanıcı açıkça seçerse dosya olur. Bu model cihazın veya browser profilinin güvenliğini devralmaz. Aynı işletim sistemi hesabına ya da browser profiline erişebilen biri yerel ilerleme verisini görebilir veya değiştirebilir.

Repository'ye token, API anahtarı, özel endpoint, kullanıcı yedeği veya kişisel veri içeren örnek yüklemeyin.
