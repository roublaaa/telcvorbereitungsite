export async function onRequest(context) {
  const { request, cookies } = context;

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const now = Date.now();

  // 🔐 مفاتيح يدوية (أنت تغيرها وقت ما تريد)
  const TOKENS = {
    "MONTH123": 30 * 24 * 60 * 60 * 1000,   // شهر
    "3MONTHS456": 90 * 24 * 60 * 60 * 1000, // 3 أشهر
    "YEAR789": 365 * 24 * 60 * 60 * 1000    // سنة
  };

  let accessUntil = cookies.get("accessUntil");

  // إذا دخل بكود شراء
  if (token && TOKENS[token]) {
    const expires = now + TOKENS[token];

    cookies.set("accessUntil", expires.toString(), {
      path: "/",
      maxAge: TOKENS[token] / 1000
    });

    return Response.redirect(url.origin, 302);
  }

  // تجربة مجانية أول مرة (5 دقائق)
  if (!accessUntil) {
    const trial = 5 * 60 * 1000; // غيرها لاحقًا إلى 24 ساعة
    const expires = now + trial;

    cookies.set("accessUntil", expires.toString(), {
      path: "/",
      maxAge: trial / 1000
    });

    return context.next();
  }

  // انتهاء الصلاحية
  if (now > Number(accessUntil)) {
    return new Response(`
      <h1>⛔ انتهت صلاحية الدخول</h1>
      <p>للاستمرار، تواصل معنا عبر واتساب</p>
    `, {
      headers: { "Content-Type": "text/html" }
    });
  }

  return context.next();
}
