# Onparmak

Türkçe Q klavyede on parmak öğrenmek için yerel çalışan bir eğitim uygulaması. Vite, React ve TypeScript; sunucu, hesap veya harici içerik servisi yoktur.

```sh
pnpm install
pnpm dev
```

Uygulama `http://localhost:5173` adresinde açılır. Yazma dersleri fiziksel Türkçe Q klavye içindir. Küçük ekranlarda bütün ekranlar kullanılabilir; yazmak için yine fiziksel klavye gerekir.

## Öğrenme yolu

12 aşama, 60 ders ve her derste üç tur: tanı, pekiştir, hatırla. Ana sıradan Türkçe karakterlere, karşı elle Shift kullanımından sayılara, ritimden beş dakikalık bağımsız değerlendirmeye ilerler. Dersler önceki becerinin tamamlanmasıyla açılır. Yeni harfler önceden öğretilmemiş karakterler içermeyen metinlerle tanıtılır.

Doğruluk, tuş gecikmeleri, zor geçişler, karıştırılan karakterler ve tekrar zamanı sonraki alıştırmaya katılır. Son tur rehbersizdir. Uygulama parmakları veya bakışı ölçmez; doğru parmak, klavyeye bakmama ve rahatlık için açık öz değerlendirme kullanır.

Serbest antrenmanda 1–5 dakika ve dört içerik türü bulunur. Yerel kelime havuzu ve özgün Türkçe metinler yazdıkça devam eder. Serbest çalışma ders kilitlerini açmaz, beceri ve tekrar modelini günceller.

## Ölçüm ve yerel kayıt

- Doğruluk: doğru karakter vuruşları / tüm karakter vuruşları. Geri silinen hatalar geçmişte kalır.
- Net hız: metinde kalan doğru karakterler / 5 / aktif dakika. Ham hız tüm karakter vuruşlarını sayar.
- Ritim: en az sekiz doğru, silinmemiş vuruş aralığında `100 / (1 + standart sapma / ortalama)`.
- İlk vuruş süreyi başlatır. Escape, pencere odağı veya sekme görünürlüğü kaybı çalışmayı duraklatır. Süre sonrasındaki vuruşlar sayılmaz.
- Son 500 oturum, kümülatif beceri verileri, dersler, kazanımlar ve tercihler `localStorage` içinde tutulur. Ayarlardan JSON yedeği indirilebilir ve doğrulanarak geri yüklenebilir. Geçersiz mevcut kaydın üzerine otomatik yazılmaz.

## Doğrulama

```sh
pnpm test             # Motor, Türkçe düzeni, 60 ders, adaptasyon, kayıt
pnpm build            # TypeScript ve üretim paketi
pnpm test:e2e         # Chrome üzerinde gerçek kullanıcı akışları
pnpm preview          # Üretim paketini yerelde aç
```

Tarayıcı testleri kurulu Google Chrome kullanır. Kaynak kodu biçimlendirmek için `pnpm format` çalıştırılabilir.

Üretim sürümü, ilk başarılı açılışın ardından kendi dosyalarını service worker ile önbelleğe alır ve internet olmadan yeniden açılabilir. `dist/` herhangi bir statik sunucuda HTTPS ile yayınlanabilir. Yerel geliştirme de internet bağlantısı istemez; ilk bağımlılık kurulumu internet gerektirebilir.

## Kaynak düzeni

- `src/content`: özgün Türkçe içerik ve tam müfredat
- `src/domain`: klavye modeli, yazma motoru, pratik üretimi, beceri ve yerel kayıt kuralları
- `src/components`: yazma alanı, klavye rehberi ve ortak bileşenler
- `src/pages`: çalışma alanı, kurs, antrenman, gelişim, rehber ve ayarlar
- `tests`: alan mantığı ve tarayıcı akışları
