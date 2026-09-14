import { LETTERS } from "../domain/keyboard";

export type LessonKind =
  | "keys"
  | "words"
  | "transfer"
  | "rhythm"
  | "speed"
  | "endurance"
  | "checkpoint";
export interface Lesson {
  id: string;
  stage: number;
  number: number;
  title: string;
  focus: string;
  newKeys: string;
  keys: string;
  instruction: string;
  kind: LessonKind;
  accuracy: number;
  seconds: number;
  minWpm: number;
  consistency: number;
}
export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}
type Spec = [
  title: string,
  focus: string,
  instruction: string,
  kind?: LessonKind,
  seconds?: number,
];
const stageSpecs: {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  add: string;
  lessons: Spec[];
}[] = [
  {
    title: "Ellerin evini bulsun",
    subtitle: "Ana sıra",
    description:
      "F ve J üzerindeki çıkıntılardan başla. Sekiz parmağın için güvenli bir dönüş noktası kur.",
    icon: "home",
    add: "fjdk slaş",
    lessons: [
      [
        "İlk dokunuş",
        "fj",
        "İşaret parmaklarını F ve J çıkıntılarına koy. Diğer parmakların rahatça kıvrılsın. Boşluğa bir başparmağınla bas.",
      ],
      [
        "Ortayı bul",
        "dk",
        "D için sol, K için sağ orta parmağını kullan. İşaret parmakların F ve J üzerinde kalsın.",
      ],
      [
        "Bir halka daha",
        "sl",
        "Sol yüzük S, sağ yüzük L tuşunda. Bileğini yana çevirmeden tuşa uzan.",
      ],
      [
        "Serçelerin sırası",
        "aş",
        "A sol serçeye, Ş sağ serçeye ait. Küçük bir hareket yap; tuşu sertçe itme.",
      ],
      [
        "Ana sıra bir bütün",
        "asdfjklş",
        "Parmaklarını sırayla ana sıraya yerleştir. Tuş aramak yerine çıkıntıları hissederek konumunu bul.",
        "checkpoint",
      ],
    ],
  },
  {
    title: "İlk kelimelerin",
    subtitle: "Merkez ve üst sıra",
    description:
      "Ellerin merkezden ayrılsın, yine eve dönsün. İlk anlamlı Türkçe kelimelerini yaz.",
    icon: "sprout",
    add: "ghei",
    lessons: [
      [
        "Merkeze uzan",
        "gh",
        "G sol işaret, H sağ işaret parmağında. Uzanıp bastıktan sonra F ve J konumuna dön.",
      ],
      [
        "E ile açılan kapı",
        "e",
        "Sol orta parmağın D üzerinden E tuşuna yükselir. Bütün elini taşımadan geri dön.",
      ],
      [
        "Noktalı i",
        "i",
        "Küçük i, sağ serçe parmağınla yazılır. Bu tuş Ş harfinin sağındadır; ı ile karıştırma.",
      ],
      [
        "Harflerden kelimelere",
        "de el il iş aş",
        "Her kelimeyi küçük bir hareket grubu gibi yaz. Boşlukta kısa bir nefes al.",
        "words",
      ],
      [
        "İlk akış",
        "ge le di şi",
        "Gözlerin metinde kalsın. Son turda görsel tuş yardımı kapanacak; konumları hatırlamayı dene.",
        "checkpoint",
      ],
    ],
  },
  {
    title: "Yukarıya doğru",
    subtitle: "Üst sıra · sol ve merkez",
    description:
      "Sık kullanılan harflerle kelime dağarcığını genişlet. Her uzanış kontrollü olsun.",
    icon: "arrow",
    add: "rtuıy",
    lessons: [
      [
        "R ve T komşuluğu",
        "rt",
        "R ve T için sol işaret parmağını kullan. T biraz daha uzaktadır; bileğini bükme.",
      ],
      [
        "U hareketi",
        "u",
        "U için sağ işaret parmağın J üzerinden yukarı uzanır. Bastıktan sonra ana sıraya dön.",
      ],
      [
        "Noktasız ı",
        "ı",
        "I konumundaki küçük harf ı olarak yazılır. Sağ orta parmakla bas; i sağ serçe parmağındadır.",
      ],
      [
        "Y ile merkez geçişi",
        "y",
        "Y sağ işaret parmağındadır. J ile Y arasındaki çapraz hareketi yavaşça öğren.",
      ],
      [
        "İki i, iki ayrı hareket",
        "iı ıi ir ır",
        "i ve ı farklı tuşlar, farklı parmaklar. Metni dikkatle oku ve her birinin hareketini hatırla.",
        "checkpoint",
      ],
    ],
  },
  {
    title: "Alt sıraya in",
    subtitle: "Alt sıra · merkez",
    description:
      "Elini sürüklemeden aşağı uzan. Artık gerçek kelimeler çalışmanın merkezinde.",
    icon: "layers",
    add: "cmnvb",
    lessons: [
      [
        "C hareketi",
        "c",
        "C için sol orta parmağını aşağı uzat. Elinin tamamını aşağı kaydırma.",
      ],
      [
        "N ve M",
        "nm",
        "N ve M sağ işaret parmağındadır. Her iki tuştan sonra J konumunu yeniden bul.",
      ],
      [
        "V ve B",
        "vb",
        "V ve B sol işaret parmağındadır. B için kontrollü biçimde merkeze uzan.",
      ],
      [
        "Eklerin ritmi",
        "lar ler dan den",
        "Ekleri bir bütün olarak gör. Harf aralarında durmak yerine aynı rahat tempoyu koru.",
        "words",
      ],
      [
        "Kelime köprüsü",
        "bir benim neden",
        "Bir kelimeyi yazarken gözün bir sonraki kelimeye hazırlansın. Doğruluğu hızın önüne koy.",
        "checkpoint",
      ],
    ],
  },
  {
    title: "Türkçenin bütün renkleri",
    subtitle: "Türkçe karakterler",
    description:
      "Ğ, Ü, Ö ve Ç için ayrı motor izleri oluştur. Sağ elini zorlamadan uzanmayı öğren.",
    icon: "flower",
    add: "opğüöç",
    lessons: [
      [
        "O ve P",
        "op",
        "O sağ yüzük, P sağ serçe parmağına ait. Parmaklarını kaldırırken omzunu rahat bırak.",
      ],
      [
        "Yumuşak ğ",
        "ğ",
        "Ğ tuşuna sağ serçe parmağınla uzan. Elini hafifçe aç ve sonra ana sıraya dön.",
      ],
      [
        "Üst sıranın ü harfi",
        "ü",
        "Ü sağ serçe parmağında, Ğ harfinin sağındadır. U ile Ü farklı parmaklarda.",
      ],
      [
        "Ö ve Ç",
        "öç",
        "Ö sağ orta, Ç sağ yüzük parmağında. O ve Ö ile C ve Ç arasındaki farkı hisset.",
      ],
      [
        "Türkçe geçişler",
        "ğı gü şi ıç öç üş",
        "Öğrenilen Türkçe harfleri karışık kelimelerde kullan. Karıştırdığın çiftler tekrar planına girecek.",
        "checkpoint",
      ],
    ],
  },
  {
    title: "Harf haritasını tamamla",
    subtitle: "Dış bölgeler",
    description:
      "Z ve dış harfler dahil bütün harf alanına hakim ol. Uzun kelimelere güvenle geç.",
    icon: "map",
    add: "zqxw",
    lessons: [
      [
        "Z ile aşağı uzan",
        "z",
        "Z için sol serçe parmağını A üzerinden aşağı indir. Küçük ve sakin hareketler yap.",
      ],
      [
        "Q ve W",
        "qw",
        "Q sol serçe, W sol yüzük parmağındadır. Web ve dosya adlarında bu tuşlara ihtiyaç duyarsın.",
      ],
      [
        "X ile son bölge",
        "x",
        "X sol yüzük parmağının altında. Bu nadir tuşu da bakmadan bulmayı öğren.",
      ],
      [
        "Uzun kelimeler",
        "öğrenmek geliştirmek",
        "Uzun kelimeleri hece veya ek gruplarıyla oku. Acele edip kelimenin sonunu tahmin etme.",
        "words",
      ],
      [
        "Harf yetkinliği",
        "tüm harfler",
        "Bütün harfleri karışık metinde hatırla. Bu kontrol geçişinde klavye yardımı olmayacak.",
        "checkpoint",
      ],
    ],
  },
  {
    title: "Büyük harf, küçük hareket",
    subtitle: "Shift ve Türkçe yazım",
    description:
      "Karşı elin Shift kullanımıyla harfleri büyüt. İ ve I ayrımını doğru yerleştir.",
    icon: "shift",
    add: "",
    lessons: [
      [
        "Sol el yazar, sağ el Shift",
        "ASDFGERTCVBZQWX",
        "Sol elinle harf yazarken sağ Shift tuşunu sağ serçenle tut. Harften sonra Shift tuşunu bırak.",
        "words",
      ],
      [
        "Sağ el yazar, sol el Shift",
        "HJKLŞİYUOPĞÜNMÖÇ",
        "Sağ elinle harf yazarken sol Shift tuşunu sol serçenle tut. Caps Lock kullanmadan çalış.",
        "words",
      ],
      [
        "İpek ve Irmak",
        "iİ ıI",
        "Noktalı i büyüyünce İ olur; noktasız ı büyüyünce I olur. Sağ el harfleri için sol Shift kullan.",
        "words",
      ],
      [
        "Özel isimler",
        "Ankara İzmir Isparta",
        "Kelime başında Shift, sonra küçük harfler. Basma ve bırakma hareketini kelimenin akışına kat.",
        "words",
      ],
      [
        "Büyük harf kontrolü",
        "İIŞĞÜÖÇ",
        "Karşı elinle Shift kullan ve her büyük harfin ardından ana sıraya dön. Tuşlara bakmadan dene.",
        "checkpoint",
      ],
    ],
  },
  {
    title: "Cümleye nefes ver",
    subtitle: "Noktalama",
    description:
      "Duraklar, sorular ve doğrudan anlatım. Düşüncelerini tam cümlelerle yaz.",
    icon: "quote",
    add: ".,;:?!'\"()-",
    lessons: [
      [
        "Nokta ve virgül",
        ".,",
        "Nokta ve virgül sağ serçe parmağınla yazılır. İşaretten sonra bir boşluk bırak.",
        "transfer",
      ],
      [
        "İki nokta, noktalı virgül",
        ":;",
        "Nokta ile Shift iki nokta, virgül ile Shift noktalı virgül üretir. Sol Shift kullan.",
        "transfer",
      ],
      [
        "Soru ve vurgu",
        "?!",
        "Soru işareti için üst sıradaki yıldız tuşu ve sol Shift; ünlem için 1 ve sağ Shift kullan.",
        "transfer",
      ],
      [
        "Alıntı ve parantez",
        "'\"()-",
        "Parantezler Shift ile 8 ve 9 üzerindedir. Çift tırnak sol üstte, kesme işareti Shift ile 2 üzerindedir.",
        "transfer",
      ],
      [
        "Tam bir cümle",
        "noktalama",
        "Büyük harf, kelime ve noktalama hareketlerini birleştir. İlerideki kelimeyi gözünle takip et.",
        "checkpoint",
      ],
    ],
  },
  {
    title: "Sayılar da dilin parçası",
    subtitle: "Sayılar ve günlük belgeler",
    description:
      "Tarihler, saatler ve tutarlar. Sayı satırını ellerini kaldırmadan kullan.",
    icon: "numbers",
    add: "1234567890/%+=_*&<>",
    lessons: [
      [
        "Sol elin sayıları",
        "12345",
        "1 serçe, 2 yüzük, 3 orta; 4 ve 5 işaret parmağı. Her vuruştan sonra ana sırayı bul.",
        "words",
      ],
      [
        "Sağ elin sayıları",
        "67890",
        "6 ve 7 işaret, 8 orta, 9 yüzük, 0 serçe parmağı. Sayısal blok yerine üst sırayı kullan.",
        "words",
      ],
      [
        "Tarih ve saat",
        "12.09.2026 09:30",
        "Tarihlerin noktalarını ve saatin iki noktasını ritmin içine al. Rakamları atlamadan oku.",
        "transfer",
      ],
      [
        "Tutarlar ve simgeler",
        "%/+*=_&<>",
        "Yüzde Shift ile 5, bölü Shift ile 7, eşittir Shift ile 0. Simgelerde doğruluğu önceliklendir.",
        "transfer",
      ],
      [
        "Günlük belge kontrolü",
        "sayı ve metin",
        "Bir belgede sayılar ile harfler arasında geçiş yap. Hız aramadan doğru ve rahat yaz.",
        "checkpoint",
      ],
    ],
  },
  {
    title: "Kendi ritmini bul",
    subtitle: "Akıcılık ve zor geçişler",
    description:
      "Duraksamalarını azalt, güçlü ve zayıf hareketlerini dengele. Hızın temeli rahatlık.",
    icon: "wave",
    add: "",
    lessons: [
      [
        "Karışan komşular",
        "iı uü oö cç sş gğ",
        "Benzer harflerin farklı hareketlerini hatırla. Kişisel zayıflıkların bu alıştırmaya daha çok girecek.",
        "words",
      ],
      [
        "Aynı parmak, yeni konum",
        "de ed ki ik lo ol",
        "Aynı parmağın yaptığı geçişleri zorlamadan çalış. Parmak hareketi küçük, tempo sakin olsun.",
        "rhythm",
        60,
      ],
      [
        "Eklerden akıcılığa",
        "lar ler lik lık cı ci",
        "Ekleri ayrı harfler olarak değil, tanıdık hareket dizileri olarak yaz. Boşluklarda gereğinden fazla bekleme.",
        "rhythm",
        90,
      ],
      [
        "Dengeli tempo",
        "ritim",
        "Kendi rahat hızını koru. Ritmi bozarsan hızlanmaya çalışma; birkaç kelime boyunca yavaş ve eşit yaz.",
        "rhythm",
        90,
      ],
      [
        "Ritim kontrolü",
        "akıcılık",
        "En az %97 doğruluk ve %55 ritim dengesiyle yaz. Metin boyunca benzer bir tempoyu korumayı dene.",
        "checkpoint",
        120,
      ],
    ],
  },
  {
    title: "Kontrollü biçimde hızlan",
    subtitle: "Hız ve gerçek hayata transfer",
    description:
      "Yerleşmiş hareketlere biraz ivme ver. Doğruluk bozulursa koçun tempoyu düşürür.",
    icon: "wind",
    add: "",
    lessons: [
      [
        "Rahat hızın",
        "doğal tempo",
        "İlk turda doğal hızını bul. Sonraki turlarda yalnızca doğruluğunu koruyabiliyorsan biraz hızlan.",
        "speed",
        60,
      ],
      [
        "Biraz daha ileri",
        "kontrollü hız",
        "Hedefin kişisel rahat hızına göre ayarlanır. Hatalar artarsa hız hedefi kaldırılır ve doğruluk çalışılır.",
        "speed",
        90,
      ],
      [
        "Bir e-posta yaz",
        "yazışma",
        "Selamlama, açıklama ve kapanış içeren gerçek bir yazışmayı yaz. Noktalama ve büyük harfler akışın parçası.",
        "transfer",
        120,
      ],
      [
        "Notlardan belgelere",
        "belge",
        "Saat, tarih ve görevlerin karıştığı bir metni çalış. Günlük işlerindeki yazım davranışına hazırlan.",
        "transfer",
        120,
      ],
      [
        "Akıcılık kontrolü",
        "gerçek metin",
        "En az %97 doğruluk, %55 ritim ve 25 kelime/dk ile doğal bir metni tamamla.",
        "checkpoint",
        150,
      ],
    ],
  },
  {
    title: "Artık düşüncelerinin hızında",
    subtitle: "Dayanıklılık ve mezuniyet",
    description:
      "Uzun metinde rahatlığı koru. Son kontrolün ardından kişisel tekrar planın devam etsin.",
    icon: "flag",
    add: "",
    lessons: [
      [
        "İki dakika, tek akış",
        "dayanıklılık",
        "İki dakika boyunca omuzlarını ve nefesini gözlemle. Yorulursan duraklat; ağrıya rağmen devam etme.",
        "endurance",
        120,
      ],
      [
        "Üç dakikalık anlatı",
        "uzun metin",
        "Paragraflar değişse de rahat temponu sürdür. Oturuşunu bozmadan gözlerini ileride tut.",
        "endurance",
        180,
      ],
      [
        "Dört dakika odak",
        "sürdürülebilirlik",
        "Başlangıç ve bitiş hızın arasındaki farkı gözlemle. Hızlanmak yerine aynı rahat akışı koru.",
        "endurance",
        240,
      ],
      [
        "Beş dakika gerçek hayat",
        "belgeler ve anlatı",
        "Metin, sayı ve noktalama bir arada. Beş dakika boyunca konforunu ve doğruluğunu koru.",
        "endurance",
        300,
      ],
      [
        "Yetkinlik değerlendirmesi",
        "bağımsız yazım",
        "Beş dakika, görsel yardım olmadan. %98 doğruluk, %60 ritim ve 35 kelime/dk hedefle. Bugün öğrendiklerini yarınki tekrarla kalıcılaştır.",
        "checkpoint",
        300,
      ],
    ],
  },
];
let learned = " ";
export const stages: Stage[] = stageSpecs.map((stage, si) => {
  return {
    id: si,
    title: stage.title,
    subtitle: stage.subtitle,
    description: stage.description,
    icon: stage.icon,
    lessons: stage.lessons.map((spec, li) => {
      const newKeys = si < 6 && !spec[3] ? spec[1].replaceAll(" ", "") : "";
      // Each introductory lesson adds only its own keys; the stage check includes its complete region.
      if (si === 0 || (si < 6 && li < 4 && !spec[3]))
        learned += spec[1].replaceAll(" ", "");
      if (si < 6 && li === 4) learned += stage.add;
      if (si === 6) learned += LETTERS + LETTERS.toLocaleUpperCase("tr-TR");
      if (si === 7) learned += spec[1].match(/[.,;:?!'"()\-]/g)?.join("") ?? "";
      if (si === 7 && li === 4) learned += stage.add;
      if (si === 8)
        learned += li === 0 ? "12345" : li === 1 ? "67890" : stage.add;
      return {
        id: `s${si + 1}l${li + 1}`,
        stage: si,
        number: si * 5 + li + 1,
        title: spec[0],
        focus: spec[1],
        newKeys,
        keys: [...new Set(learned)].join(""),
        instruction: spec[2],
        kind: spec[3] ?? "keys",
        accuracy: si === 11 && li === 4 ? 98 : si > 8 ? 97 : 95,
        seconds: spec[4] ?? (si < 2 ? 45 : 60),
        minWpm: si === 11 && li === 4 ? 35 : si === 10 && li === 4 ? 25 : 0,
        consistency:
          si === 11 && li === 4
            ? 60
            : si >= 9 && (li === 4 || spec[3] === "rhythm")
              ? 55
              : 0,
      };
    }),
  };
});
export const lessons = stages.flatMap((s) => s.lessons);
export const getLesson = (id: string) => lessons.find((l) => l.id === id);
