// Original, locally bundled practice content. Early lessons filter this vocabulary by learned keys.
export const words = [
  ...new Set(
    `
ada ad af al ak as az ağ aç aş dal sal kal fal kas kaf dağ kaş şal şaka kafa
adak afak aksak askı atkı asıl aday alan adam adım adil akıl akış akşam akran alay alem alım alın alış alçak altın amaç anı anlık anlam anne anıt arı ara arka artı arzu aslan asma asır aşama aşçı ata atak ateş atık avuç ayak ayar ayaz ayça aydın aygıt ayır ayla ayna aynı ayrı azim
baba badem bağ bağır bahar bahçe bakır bakış bal balık balon bant barış basın baskı basit başak başarı batı bayat bayır bayram bazen bebek beceri beden bedel bekle bellek benek benim beri berrak besin beste beş beşik beyaz beyin biçim bilgi bilim bilge bina bir birey biri birlik bitki biz bize bizim blok bol boru boş boya boyut bölge bölüm börek böyle bu bugün bulgu bulut burun bütün büyük bülbül
cadde cam can canlı cevap ceviz ceylan ceza cihaz cilt cisim ciddi cümle cömert
çaba çadır çağ çağrı çağdaş çakıl çam çanta çarşı çatı çay çayır çehre çekim çelik çember çene çeşit çevre çeyrek çiçek çift çilek çizgi çizim çocuk çok çorap çorba çözüm çömlek çünkü çıkış çınar
daha daima daire dakika damla dans dar davet dayanışma değer değişim deneme denge deniz depo dere dergi deri ders derin desen destek devam devir deyiş dışarı dikkat dil dilek dinç dize dizgi dizin dizüstü doğa doğal doğu doğru doksan doku dolap dolu domates dost dosya doya doya döngü dönem dört durak duru durum duygu duyuru düz düzen düzgün düşünce dünya düş
ebe ebru ece eda edep eğer eğim eğitim ek ekim ekip ekmek ekran eksen el ele elek elma elmas emek emin en endişe enerji engel erik erken eser esinti eski esnek et etek etkin ev evet evin evrak evren eylül ezgi ezber
fakat fark farklı farz fasıl fener fidan fikir fil filiz fincan fırça fırın fıstık fizik fotoğraf fırsat
gaye gazete gece gelecek gelenek gelişim gemi genel geniş gerek geri gezi gibi giriş gitgide giysi gıda gizli gölge göl gönül görev görsel görüş gökyüzü göz gözlem gözlük güç güçlü gül gülüş gümüş gün güncel gündem güneş günlük güz güzel güzellik güven güvenli
haber hacim hafif hafta hak haklı halı halk hamur hangi hani hareket harf harita hasat hava hayal hayat hazır hedef hece hediye hem henüz hep hepsi her herkes hesap heves heyecan hız hızlı hikaye his hizmet hoş huzur hüner
ıhlamur ılık ırmak ısınma ısrar ıslak ıslık ışık ışıldamak
iade ibre iç içerik için içten ifade iki iklim ileri ileti iletişim ilgi ilham ilk ilke ilmek imkan imza ince inci insan ip iplik isim istek iş işlem işlev işte iyi iyilik iz izin izlek
jale jeton jilet jöle jüri
kabul kadar kadim kadın kahve kale kalem kalıcı kalp kalın kamera kanal kanat kapak kapı karar kare kardeş karşı kart kasaba kase kasım kat katı katkı kavak kavanoz kayıt kaya kaygı kaynak kazak keçe kedi kek kelime kendi kent kere kesim keşif keyif kır kıraç kırk kırmızı kısa kısım kıyı kızıl ki kim kimi kimse kitap kişi kişisel kitle klavye kolay koltuk konu konuk konuşma kopya kova koku koşu kök köprü köşe köy kömür kural kurgu kurum kutu kuyu kuş küçük kültür küme kürek
lale lazım leblebi leke lezzet lif liman limon lira liste lodos lokma lütfen
masa mavi masal mahalle makas makine mandal manzara mart mektup melek merak mercek merdiven merkez mesafe meslek mesaj meşe mevsim meydan meyve mezun mısra miktar mimar minik misafir model mola mor mutfak mutlu mutluluk müjde mürekkep müzik mümkün
nasıl nane nar neden nefes nehir nem nesil nesne neşe net nice nisan niyet nokta not numara
ocak oda odak odun okul okuma olan olay olmak olta omuz on onarım onay onlar oran orman orta ortak otuz oyun oysa o zaman
öbek ödev öğe öğle öğrenci öğretmen öğrenme öğüt önem önemli önce önder ördek örnek örgü örtü öte öykü özel özen özgü özgün özgür özlem özet
paha paket palet pamuk papatya para parça park parmak pazar pencere perde perşembe peş peşin pınar pilav plan portakal posta pratik proje prova pul pusula püf
raf rahat rakam renk resim rıhtım ritim rica rol rota rüzgar rüya
saat sabah sabır sabit saç sade sağ sağlam sahil sahip sakin saklı salı salon sandal sandalye sanki sarı satır sayfa sayı sebep sebze seçki seçim sekiz sel selam semt sen senin sergi serin ses sessiz sevinç seyir seyreltme sıcak sık sıkı sınıf sınır sıra sıradan sığ simit simge sis sistem siyah siz sizin sokak sol son sonra soru sonuç soğuk soy somut söz sözcük söyleşi su sunum susam süt süre sürekli sürüm
şafak şair şans şarkı şaşkın şeffaf şehir şeker şekil şemsiye şerit şevk şimdi şiir şişe şölen şöyle şube şubat şüphe
tabak tablo tadım tahıl tahmin tahta takım takvim tam tamam tamir tane tanı tanım tanışma tarak tarih tarla tasarım taş taşıt tat tatil tatlı tavan tavır tavsiye taze tebeşir tek tekrar temel tempo ten teneffüs tepe terim temiz terzi teşekkür tohum tok toka toplum toprak toz tören tur turkuaz tutku tuz tüm tünel tüp Türkçe türkü tüy
uç uçak uçurtma ufak ufuk uğur uğraş uygun ulaşım umut un unvan usul usta uzun uzak uyum uyku uygulama
ücret üç ülke ün üniversite ürün üst üstelik ütü üzüm üzere üye
vadi vakit var varlık vazo vedalaşma veri verim verimli ve veya vida vişne vurgu
yaban yabancı yağmur yakın yakut yalın yalnız yan yanıt yankı yapı yaprak yarar yarın yarış yarım yasak yavaş yay yaz yazı yazılım yemek yemyeşil yeni yer yerel yeterli yeşil yetişkin yetki yığın yıl yıldız yine yol yolcu yoldaş yorum yön yöntem yudum yuva yumuşak yüz yüzey yüzük yürek yüksek
zaman zarf zarif zeka zemin zeytin zihin zincir zirve ziyaret zor zorlu zümrüt
algoritma bağlantı başlangıç bağımsız beraber bilgisayar birikim büyümek çalışma çalışkan çevrim çizelge değerlendirme deneyim denizci doğruluk dokunmak dönüşüm duruş düşünmek eğitmen etkileşim farkındalık gelişmek gerçek gözetmek güncelleme hatırlamak hazırlık ilerlemek incelemek işaret kaynakça kazanım klavyede kullanmak kütüphane olasılık ölçmek öğrenmek parmaklar paylaşım pekiştirmek planlamak rehber rehberlik sakinlik sorumluluk sürdürmek tamamlamak tasarlamak tekrarlamak verimlilik yazabilmek yetkinlik yönetmek özgüven
qwerty web wifi xray excel proxy wax quartz workshop piksel tarayıcı sayısal belge dosyalar klasör düzenleme kaydetmek toplantı takvimler notlar bilgiler araştırma inceleme açıkça dönüşmek komşu komşuluk tüccar güçlüce küçücük güleç güler şükran çığlık yağış yoğurt düğün öğleden öğün büyü küçükken çocukluk düşünür yürüyüş göründü
`
      .trim()
      .split(/\s+/),
  ),
];

export const passages = [
  "Sabahın ilk ışığı pencereye vurdu. Masamı düzenledim, omuzlarımı serbest bıraktım ve yeni güne sakin bir başlangıç yaptım. Bugün acele etmek yerine her işe biraz daha özen göstereceğim.",
  "Mahalle kütüphanesinin kapısı her sabah dokuzda açılır. Pencerenin önünde küçük bir masa, masanın üzerinde birkaç kitap vardır. İçeri giren herkes, şehrin sesini bir süreliğine geride bırakır.",
  "Bir beceriyi öğrenmek, her gün aynı noktaya dönmek gibi görünür. Oysa her dikkatli tekrar küçük bir değişim yaratır. Dün zor gelen hareket, bugün biraz daha doğal hissettirir. Gelişim bazen yalnızca bu farkı görebilmektir.",
  "Yağmur durunca sahile doğru yürüdük. Ağaçların yapraklarında küçük damlalar parlıyordu. Bir çocuk su birikintisinin üzerinden atladı, annesine dönüp gülümsedi. Şehir, kısa bir yağmurdan sonra bambaşka görünüyordu.",
  "İyi bir çalışma alanı kurmak için büyük bir odaya gerek yok. Ayakların yere bassın, ekranın rahatça görebileceğin yükseklikte olsun. Bileklerini masaya bastırmadan, omuzlarını kaldırmadan yaz. Kısa aralar vermek de çalışmanın bir parçasıdır.",
  "Toplantı notlarını üç başlık altında topladım: tamamlanan işler, açık sorular ve sonraki adımlar. Her görevin yanına bir sorumlu ve tarih ekledim. Açık bir not, uzun bir konuşmanın değerini korur.",
  "Anadolu mutfağında mevsimler sofranın dilini değiştirir. Yazın domates, biber ve patlıcan öne çıkar. Kışın ise sıcak bir çorba, kuru baklagiller ve fırından yeni çıkmış ekmek sofrayı tamamlar.",
  "Bir fikri anlatırken önce ne söylemek istediğini düşün. Sonra en yalın cümleyi kur. Gereksiz sözcükleri çıkardığında düşüncen küçülmez; okuyana daha rahat ulaşır. İyi yazmak biraz da iyi dinlemektir.",
  "Gönüllüler, köy okulunun bahçesine yirmi yeni fidan dikti. Öğrenciler her fidana bir isim verdi ve haftalık sulama çizelgesi hazırladı. İlk yapraklar göründüğünde herkes kendi emeğinin izini gördü.",
  "Tren, öğleden sonra istasyondan yavaşça ayrıldı. Yol boyunca tarlalar, küçük evler ve uzak tepeler geçti. Yan koltuktaki yolcu kitabını kapatıp pencereye baktı. Bazen bir yolculuğun en güzel kısmı, hiçbir şey yetiştirmemektir.",
  "Sevgili Deniz, gönderdiğin taslağı inceledim. Özellikle giriş bölümündeki örnek çok açıklayıcı olmuş. İkinci sayfadaki tarihi güncelleyebilir misin? Son sürümü perşembe günü birlikte değerlendirelim. Emeğine sağlık.",
  "Atölye programı: 09:30 karşılama, 10:00 ilk oturum, 11:15 kısa ara ve 11:30 uygulama. Öğle yemeği 12:30 olarak planlandı. Katılımcıların 15 dakika önce gelmesi ve yanlarında bir defter bulundurması yeterli.",
  "Alışveriş listesinde 2 litre süt, 6 yumurta, 3 elma ve 500 gram yoğurt vardı. Kasada toplam 285,50 lira ödedim. Fişi kontrol ettikten sonra kalan 14,50 lirayı cüzdanıma koydum.",
  "İstanbul ile Isparta aynı harfle başlıyor gibi görünebilir. Türkçe yazımda ise i harfinin büyüğü İ, ı harfinin büyüğü I olur. İpek ve Irmak isimlerini yazarken bu küçük ayrıntıya dikkat etmek gerekir.",
  "Küçük bir tohumun ağaca dönüşmesi zaman alır. Önce kökler gelişir, sonra gövde güçlenir. Dışarıdan görünmeyen bu hazırlık, ileride taşıyacağı dallar için gereklidir. Öğrenirken de temele ayrılan zaman boşa gitmez.",
  "Ekranda gördüğüm sayılardan çok, yazarken hissettiğim rahatlığa dikkat ediyorum. Daha az duruyor, daha az geri dönüyorum. Ellerim tanıdık bir yolu izlerken düşüncelerime daha fazla yer açılıyor.",
  "Yeni bisiklet yolunun uzunluğu 4,8 kilometre. Yol boyunca 12 dinlenme noktası ve 3 su çeşmesi bulunuyor. Belediye, ilk ayda 2.450 kişinin bu güzergahı kullandığını açıkladı.",
  "Birlikte üretmenin en güzel yanı farklı bakışların aynı masada buluşmasıdır. Biri ayrıntıyı fark eder, diğeri bütünü görür. Sorular açıkça sorulduğunda ve herkes dinlendiğinde ortak bir çözüm ortaya çıkar.",
  "Pazar sabahı telefonumu sessize aldım. Çay demlenirken balkondaki çiçekleri suladım. Sokaktan simitçinin sesi geldi. Günün geri kalanı için büyük bir planım yoktu; bu sakinlik bana iyi geldi.",
  "Müzede gördüğümüz eski mektuplar, gündelik hayatın ayrıntılarını taşıyordu. Bir yolculuk haberi, beklenen bir cevap, küçük bir teşekkür... Yıllar geçse de insanların birbirine anlatmak istediği şeyler tanıdıktı.",
  "Doğruluğu koruyarak hızlanmak için her kelimeyi bir bütün olarak görmeye çalış. Bir sonraki harfi düşünmek yerine gözlerini birkaç karakter ileri taşı. Zorlandığında yavaşla, omuzlarını gevşet ve doğal ritmine dön.",
  "Bugünkü hedefim bir metni tek seferde kusursuz yazmak değil. Nerede duraksadığımı fark etmek ve o geçişi sabırla çalışmak istiyorum. Küçük ama düzenli bir çalışma, büyük ve dağınık bir çabadan daha kalıcı olabilir.",
  "Kamp için gerekli eşyaları akşamdan hazırladık: çadır, uyku tulumu, el feneri ve su şişesi. Hava raporunda sıcaklık 18 derece görünüyordu. Yola çıkmadan önce kapıları kontrol edip komşumuza haber verdik.",
  "Tasarıma gelen geri bildirimleri dikkatle okuduk. Renkleri sadeleştirdik, başlıkları kısalttık ve gezinmeyi kolaylaştırdık. Bazen iyi bir ürün yapmak, yeni bir şey eklemek kadar gereksiz olanı çıkarmayı da gerektirir.",
];

export const practiceTips = [
  "Hızın değil, alışkanlığın kalıcı olsun. Gözlerin metinde, parmakların ana sırada.",
  "Bileklerini havada zorla tutma; doğal ve rahat bir konum bul. Ağrı hissedersen ara ver.",
  "Her tuşa bastıktan sonra parmağını ana sıraya geri getir.",
  "Bir hatadan sonra acele etme. Geri sil, doğru parmakla yeniden dene.",
  "İki kısa ve dikkatli çalışma, yorgunken yapılan uzun bir çalışmadan daha yararlıdır.",
  "Shift tuşunu, harfe basan elinin karşısındaki serçe parmağınla kullan.",
];
