import { useState } from "react";
import { KeyboardGuide } from "../components/KeyboardGuide";
import { Icon, PageHeading } from "../components/shared";

export function Guide() {
  const [target, setTarget] = useState("f");
  return (
    <>
      <PageHeading
        eyebrow="ELLERİN İÇİN KÜÇÜK BİR REHBER"
        title="İyi alışkanlıklarla başla."
        description="Doğru duruş, doğru parmak ve küçük tekrarlar. Hızdan önce rahatlık gelir."
      />
      <div className="guide-principles">
        {[
          {
            icon: "hand",
            title: "Önce yerini bul",
            body: "Sol el A S D F, sağ el J K L Ş üzerinde. F ve J çıkıntıları konumunu bakmadan bulmanı sağlar. Başparmakların boşluk tuşunda.",
          },
          {
            icon: "eye",
            title: "Gözlerin metinde",
            body: "Fiziksel klavyeye bakmamayı dene. Bir tuşu unuttuğunda ekrandaki rehberi kullan, sonra tekrar kapat. Hatırlama turu yardım olmadan yapılır.",
          },
          {
            icon: "coffee",
            title: "Rahatlığını koru",
            body: "Ayakların yere bassın, dirseklerin rahat olsun. Bileklerini sert bir kenara bastırma. Gerginlik veya ağrı hissedersen dur ve dinlen.",
          },
        ].map((p) => (
          <section className="card" key={p.title}>
            <span className="guide-principle-icon">
              <Icon name={p.icon} size={25} />
            </span>
            <p className="guide-principle-title">{p.title}</p>
            <p>{p.body}</p>
          </section>
        ))}
      </div>
      <section className="card interactive-guide">
        <div className="card-heading">
          <div>
            <h2>Türkçe Q, parmak parmak.</h2>
            <p>Bir tuş seç; hareketini ve karşı elin Shift kullanımını gör.</p>
          </div>
          <label className="field-label">
            Hedef tuş
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              {[
                "f",
                "j",
                "a",
                "ş",
                "e",
                "i",
                "ı",
                "ğ",
                "ü",
                "ö",
                "ç",
                "İ",
                "I",
                "?",
                "!",
                ";",
                ":",
                "1",
                "6",
                "0",
                " ",
              ].map((k) => (
                <option value={k} key={k}>
                  {k === " " ? "Boşluk" : k}
                </option>
              ))}
            </select>
          </label>
        </div>
        <KeyboardGuide target={target} />
        <p className="fine-print">
          Türkçe Q ISO düzeni gösterilir. Fiziksel klavyenin Enter ve Shift
          boyutları farklı olabilir; harf konumları aynıdır.
        </p>
      </section>
      <div className="guide-details">
        <section className="card">
          <h2>Üç tur, tek bir beceri.</h2>
          <ol className="learning-steps">
            <li>
              <span>01</span>
              <div>
                <p className="step-title">Tanı</p>
                <p>
                  Yeni hareketi görsel rehberle, yavaş ve doğru öğren.
                  Parmakların her vuruştan sonra ana sıraya dönsün.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <p className="step-title">Pekiştir</p>
                <p>
                  Yeni tuşu bildiğin tuşlarla karıştır. Gerçek kelimelerle
                  farklı geçişlerde tekrar kullan.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <p className="step-title">Hatırla</p>
                <p>
                  Görsel yardım olmadan aynı beceriyi yeni içerikte uygula.
                  Doğruluk hedefi ve öz değerlendirmen uygunsa sıradaki ders
                  açılır.
                </p>
              </div>
            </li>
          </ol>
        </section>
        <section className="card">
          <h2>Ölçümleri doğru oku.</h2>
          <dl className="metric-explanations">
            <dt>Doğruluk</dt>
            <dd>
              Doğru vuruşlar / tüm karakter vuruşları. Geri silmek eski hatayı
              geçmişten kaldırmaz.
            </dd>
            <dt>Net hız</dt>
            <dd>
              Metinde kalan doğru karakter sayısı / 5 / aktif dakika. Boşluklar
              da bir karakterdir. Ham hız tüm vuruşları sayar.
            </dd>
            <dt>Ritim dengesi</dt>
            <dd>
              Doğru ve silinmemiş vuruşların zaman aralıkları ne kadar benzer?
              Değişkenlik arttıkça skor düşer. En az sekiz aralık gerekir.
            </dd>
            <dt>Yerleşen tuşlar</dt>
            <dd>
              En az 30 vuruş ve üç turdaki yakın dönem doğruluğu birlikte
              ölçülür. Unutmayı azaltmak için tekrar aralığı başarıyla 1, 2, 4
              gün şeklinde büyür.
            </dd>
          </dl>
        </section>
      </div>
      <section className="card turkish-note">
        <span className="turkish-glyphs">
          i <Icon name="right" size={20} /> İ <i /> ı{" "}
          <Icon name="right" size={20} /> I
        </span>
        <div>
          <p className="turkish-note-title">
            Türkçenin küçük ama önemli farkı.
          </p>
          <p>
            i ve ı farklı tuşlardır. Büyük harfleri de İ ve I olarak ayrılır.
            Büyük harf için harfi yazan elinin karşısındaki Shift tuşunu kullan.
            Caps Lock ile bu hareketi atlama.
          </p>
        </div>
      </section>
      <div className="notice">
        <Icon name="shield" />
        <span>
          Bu uygulama elini veya bakışını izlemez. Doğru parmak kullanımı ve
          rahatlık, tur sonundaki dürüst öz değerlendirmenle öğrenme planına
          katılır.
        </span>
      </div>
    </>
  );
}
