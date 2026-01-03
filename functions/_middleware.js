export async function onRequest(context) {
  try {
    const { request, cookies } = context;
    const url = new URL(request.url);
    const now = Date.now();

    const token = url.searchParams.get("token");

    const TOKENS = {
      "MONTH123": 30 * 24 * 60 * 60 * 1000,
      "3MONTHS456": 90 * 24 * 60 * 60 * 1000,
      "YEAR789": 365 * 24 * 60 * 60 * 1000
    };

    const accessUntil = cookies.get("accessUntil")?.value;

    // ✅ دخول عبر token
    if (token && TOKENS[token]) {
      const expires = now + TOKENS[token];

      cookies.set("accessUntil", String(expires), {
        path: "/",
        maxAge: TOKENS[token] / 1000
      });

      return Response.redirect(url.origin, 302);
    }

    // ❌ ممنوع بدون token
    if (!accessUntil) {
      return blockedPage("الدخول متاح فقط للمشتركين");
    }

    // ⛔ انتهاء الصلاحية
    if (now > Number(accessUntil)) {
      return blockedPage("انتهت مدة الاشتراك");
    }

    return context.next();

  } catch (e) {
    return new Response("Middleware error", { status: 500 });
  }
}

function blockedPage(message) {
  return new Response(`
    <html>
      <body style="font-family:sans-serif;text-align:center;margin-top:80px">
        <h2>⛔ ${message}</h2>
        <p>للحصول على صلاحية الدخول</p>
        <a href="https://wa.me/212XXXXXXXXX">تواصل معنا عبر واتساب</a>
      </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html" }
  });
}
