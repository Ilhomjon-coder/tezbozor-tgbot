/* ============ Tezbozor — Prezentatsiya: ekranlarni mount qilish ============
   Statik <section> slaydlardagi .phone[data-screen] nuqtalariga jonli
   React ekranlarini joylashtiradi. Sarlavhalar HTMLda — tahrirlanadigan. */
(function () {
  const { createRoot } = ReactDOM;

  function screenFor(name) {
    switch (name) {
      case "telegram":   return <TelegramBotScreen />;
      case "splash":     return <SplashScreen />;
      case "onboarding": return <OnboardingScreen />;
      case "home":       return <HomeScreen todayIdx={3} dateLabel="6-iyun, chorshanba" />;
      case "search":     return <div className="phone-screen"><SearchScreen isStatic /></div>;
      case "results":    return <div className="phone-screen"><SearchScreen isStatic initialView="results" initialQuery="Pomidor" /></div>;
      case "cart":       return <CartScreen />;
      case "checkout":   return <CheckoutFlow />;
      case "pending":    return <PaymentPendingScreen pay="click" total={83000} />;
      case "success":    return <SuccessScreen />;
      case "status":     return <OrderStatusScreen />;
      case "profile":    return <ProfileScreen />;
      default:           return null;
    }
  }

  document.querySelectorAll(".phone[data-screen]").forEach((el) => {
    const s = screenFor(el.dataset.screen);
    if (s) createRoot(el).render(s);
  });

  document.querySelectorAll("[data-mark]").forEach((el) => {
    const bag = el.dataset.mark === "dark" ? "#FAF7F2" : "#1FA055";
    createRoot(el).render(<MarkParts bag={bag} />);
  });
})();
