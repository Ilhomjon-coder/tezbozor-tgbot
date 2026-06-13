/* ============ Tezbozor — sahifa kompozitsiyasi ============ */

function App() {
  const scrollToProfile = () => {
    const rows = document.querySelectorAll(".phones-row");
    const ph = rows[rows.length - 1];
    if (ph) ph.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <div className="canvas">
      <div className="canvas-head">
        <img className="logo" src={ASSET + "tezbozor-logo.svg"} alt="Tezbozor" />
      </div>
      <div style={{ fontSize: 14, color: "var(--ink-600)", maxWidth: 620, lineHeight: 1.55, marginBottom: 4 }}>
        Mini dizayn tizimi va <b>Bosh sahifa</b> ekrani. Telegram Mini App formati — 390px, bitta ustun,
        pastda yopishqoq asosiy tugma. Telefondagi <b>+</b> tugmalari ishlaydi: savat va summa jonli yangilanadi.
      </div>

      <div className="layout">
        <div className="canvas-kicker" style={{ textAlign: "center", marginTop: 8 }}>Yangi foydalanuvchi yo‘li — bot → splash → intro</div>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--ink-600)", maxWidth: 660, margin: "0 auto 4px", lineHeight: 1.5 }}>
          Foydalanuvchi botdan ilovani <b>tugma orqali</b> ochadi, “wow” splash belgisi yig‘ilib chiqadi,
          so‘ng 4 ekranli qisqa intro (<b>Keyingi / O‘tkazib yuborish</b> ishlaydi). Splashdagi
          “↻ Qayta ko‘rish” — animatsiyani qayta o‘ynatadi.
        </div>
        <div className="phones-row">
          <div className="phone-col">
            <div className="phone"><TelegramBotScreen /></div>
            <div className="phone-cap">
              <b>1 — Telegram bot.</b> Mini app’ni ishga tushiruvchi <b>ikki tugma</b>:
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", margin: "8px 0 2px" }}>
                <span className="flow-note"><span className="fn-dot orange" /> Chatdagi “Ilovani ochish”</span>
                <span className="flow-note"><span className="fn-dot green" /> Pastdagi doimiy “Ochish” menyu tugmasi</span>
              </div>
            </div>
          </div>
          <div className="phone-col">
            <div className="phone"><SplashScreen /></div>
            <div className="phone-cap">
              <b>2 — Splash.</b> Tezlik chiziqlari uchib keladi, xalta sakrab tushadi, sabzi poyalari
              o‘sib chiqadi — so‘ng so‘z belgisi va shior. “↻ Qayta ko‘rish”ni bosib qayta ko‘ring.
            </div>
          </div>
          <div className="phone-col">
            <div className="phone"><OnboardingScreen /></div>
            <div className="phone-cap">
              <b>3 — Intro (4 ekran).</b> Bozor tezligi · “avtobus” yetkazish · bugungi narx · boshlash.
              <b>Keyingi</b> bilan o‘ting yoki <b>O‘tkazib yuborish</b> bilan to‘g‘ridan-to‘g‘ri yakunga.
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(30,42,50,.12)", margin: "48px 0 0" }} />
        <div className="docs-col">
          <DesignSystem />
        </div>
        <div style={{ borderTop: "1px solid rgba(30,42,50,.12)", margin: "44px 0 0" }} />
        <div className="canvas-kicker" style={{ textAlign: "center", marginTop: 28 }}>Bosh sahifa — kunlik badge tizimining 3 holati</div>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--ink-600)", maxWidth: 640, margin: "0 auto 4px", lineHeight: 1.5 }}>
          Banner va belgilar kunga qarab o‘zgaradi va <b>ertangi yetkazish kunini</b> aks ettiradi.
          Mahsulot <b>+</b> tugmalari uchala holatda ham ishlaydi.
        </div>
        <div className="phones-row">
          <div className="phone-col">
            <div className="phone"><HomeScreen todayIdx={2} dateLabel="6-iyun, seshanba" onOpenProfile={scrollToProfile} /></div>
            <div className="phone-cap">
              <b>1 — Bozor kuni arafasi.</b> Och apelsin teaser “Ertaga bozor kuni”, ostida
              “Bozor narxigacha 1 kun qoldi”.
            </div>
          </div>
          <div className="phone-col">
            <div className="phone"><HomeScreen todayIdx={1} dateLabel="5-iyun, dushanba" onOpenProfile={scrollToProfile} /></div>
            <div className="phone-cap">
              <b>2 — Oddiy kun.</b> Kun mavzusi banneri (“Hafta zaxirasi kuni”) + ⭐ “Kunning mahsuloti”
              kartochkasi “Bugungi narxlar” tepasida.
            </div>
          </div>
          <div className="phone-col">
            <div className="phone"><HomeScreen todayIdx={3} dateLabel="7-iyun, chorshanba" onOpenProfile={scrollToProfile} /></div>
            <div className="phone-cap">
              <b>3 — Bozor kuniga yetkazish.</b> Yashil “Bugun bozor kuni” badge, kartochkalarda
              🥬 / 🔒 “Barqaror narx” / 🌿 “Yangi keldi” belgilari.
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(30,42,50,.12)", margin: "48px 0 0" }} />
        <div className="canvas-kicker" style={{ textAlign: "center", marginTop: 28 }}>Qidiruv — jonli qidiruv va natijalar oynasi (2 sahifa)</div>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--ink-600)", maxWidth: 660, margin: "0 auto 4px", lineHeight: 1.5 }}>
          Bosh sahifadagi qidiruv maydonini bossangiz, <b>jonli qidiruv</b> ochiladi (orqaga tugmasi bilan).
          Yozganda mahsulotlar darhol filtrlanadi; <b>“qidirish”</b> yoki Enter bosilsa <b>natijalar oynasi</b> chiziladi.
          Quyidagi telefonlar ikkala holatni ko‘rsatadi — ikkalasi ham jonli (yozing, qo‘shing, filtrlang).
        </div>
        <div className="phones-row">
          <div className="phone-col">
            <div className="phone"><div className="phone-screen"><SearchScreen isStatic /></div></div>
            <div className="phone-cap">
              <b>1 — Jonli qidiruv (fokus).</b> So‘nggi qidiruvlar + mashhur mahsulotlar darhol chiqadi.
              Maydonga yozing — takliflar real vaqtda filtrlanadi, <b>+</b> bilan savatga qo‘shing.
            </div>
          </div>
          <div className="phone-col">
            <div className="phone"><div className="phone-screen"><SearchScreen isStatic initialView="results" initialQuery="Pomidor" /></div></div>
            <div className="phone-cap">
              <b>2 — Natijalar oynasi.</b> “Pomidor” bo‘yicha natija + <b>filtrlar</b> (arzonlashgan / bozor kuni)
              va “O‘xshash mahsulotlar”. Yuqoridagi maydonni bossangiz qidiruvni tahrirlaysiz.
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(30,42,50,.12)", margin: "48px 0 0" }} />
        <div className="canvas-kicker" style={{ textAlign: "center", marginTop: 28 }}>Savat ekrani — jonli</div>
        <div className="phones-row">
          <div className="phone-col">
            <div className="phone"><CartScreen /></div>
            <div className="phone-cap">
              Har mahsulot ostida <b>“Topilmasa nima qilamiz?”</b> tanlovi. Stepperlarni bosing —
              bepul yetkazish progressi, hisob-kitob va tugma jonli o‘zgaradi.
            </div>
          </div>
          <div className="phone-col">
            <div className="phone"><CartScreen initial={[]} /></div>
            <div className="phone-cap">Bo‘sh savat holati — “Xaridni boshlash” bilan xaridga taklif.</div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(30,42,50,.12)", margin: "48px 0 0" }} />
        <div className="canvas-kicker" style={{ textAlign: "center", marginTop: 28 }}>Rasmiylashtirish → to‘lov → muvaffaqiyat — jonli</div>
        <div className="phones-row">
          <div className="phone-col">
            <div className="phone"><CheckoutFlow /></div>
            <div className="phone-cap">
              <b>“O‘zgartirish”</b> → saqlangan manzillardan tanlang yoki yangi qo‘shing. To‘lovni tanlang,
              vaqtni tanlang — <b>“Buyurtmani tasdiqlash”</b>. Click/Payme tanlasangiz to‘lov oynasiga o‘tadi.
            </div>
          </div>
          <div className="phone-col">
            <div className="phone"><PaymentPendingScreen pay="click" total={83000} /></div>
            <div className="phone-cap">To‘lov kutilmoqda — Click/Payme tanlanganda. Naqd bo‘lsa bu oyna o‘tkazib yuboriladi.</div>
          </div>
          <div className="phone-col">
            <div className="phone"><SuccessScreen /></div>
            <div className="phone-cap">Tasdiqdan keyingi ekran — tanlangan vaqt, buyurtma raqami bilan.</div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(30,42,50,.12)", margin: "48px 0 0" }} />
        <div className="canvas-kicker" style={{ textAlign: "center", marginTop: 28 }}>Buyurtma holati — timeline va go‘sht video tasdig‘i</div>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--ink-600)", maxWidth: 640, margin: "0 auto 4px", lineHeight: 1.5 }}>
          Hozirgi bosqich yashil pulsatsiya bilan ajralib turadi. <b>“Bozorda xarid”</b> bosqichida go‘shtdan
          3 ta video variant — birini <b>“Tanlash”</b> bilan tasdiqlang.
        </div>
        <div className="phones-row">
          <div className="phone-col">
            <div className="phone"><OrderStatusScreen /></div>
            <div className="phone-cap">
              Video kartochkalardan birini tanlang — pastda “shu go‘shtni sotib olamiz” tasdig‘i chiqadi.
              Pastda kuryer bilan qo‘ng‘iroq / Telegram.
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(30,42,50,.12)", margin: "48px 0 0" }} />
        <div className="canvas-kicker" style={{ textAlign: "center", marginTop: 28 }}>Profil — hub va alohida oynalar</div>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--ink-600)", maxWidth: 660, margin: "0 auto 4px", lineHeight: 1.5 }}>
          Bosh sahifa <b>header’idagi “DK” avatar</b> orqali kiriladi. Profil — menyu: har bo‘lim
          (Buyurtmalar / Manzillarim / Doimiy ro‘yxat / Shaxsiy ma’lumot) <b>alohida oyna</b>.
          Manzil qo‘shishda xaritadan joylashuv tanlanadi. Menyu satrlarini bosib o‘ting.
        </div>
        <div className="phones-row">
          <div className="phone-col">
            <div className="phone"><ProfileScreen onOpenStatus={() => {
              const rows = document.querySelectorAll(".phones-row");
              if (rows[3]) rows[3].scrollIntoView({ behavior: "smooth", block: "center" });
            }} /></div>
            <div className="phone-cap">
              Menyudan bo‘lim tanlang — ichki oynaga o‘tadi, orqaga qaytish bilan hub’ga.
              “Manzillarim → Yangi manzil” — xarita + forma.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
