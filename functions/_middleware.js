export async function onRequest(context) {
  try {
    const { request, cookies } = context;
    const url = new URL(request.url);
    const now = Date.now();

    const token = url.searchParams.get("token");

    // 🧠 مدة الصلاحيات
    const TOKENS = {
      "MONTH123": 30 * 24 * 60 * 60 * 1000,
      "3MONTHS456": 90 * 24 * 60 * 60 * 1000,
      "YEAR789": 365 * 24 * 60 * 60 * 1000
    };

    // 🔎 IP الزائر (Cloudflare)
    const ip = request.headers.get("cf-connecting-ip") || "unknown";

    // cookies
    const accessUntil = cookies.get("accessUntil")?.value;
    const usedIP = cookies.get("usedIP")?.value;

    /* =========================
       1️⃣ دخول عبر token
    ========================== */
    if (token && TOKENS[token]) {
      const expires = now + TOKENS[token];

      cookies.set("accessUntil", String(expires), {
        path: "/",
        maxAge: TOKENS[token] / 1000
      });

      cookies.set("usedIP", ip, {
        path: "/",
        maxAge: TOKENS[token] / 1000
      });

      return Response.redirect(url.origin, 302);
    }

    /* =========================
       2️⃣ منع الدخول بدون token
    ========================== */
    if (!accessUntil) {
      return blockedPage();
    }

    /* =========================
       3️⃣ منع تغيير IP للتحايل
    ========================== */
    if (usedIP && usedIP !== ip) {
      return blockedPage("تم اكتشاف تغيير الجهاز أو الشبكة");
    }

    /* =========================
       4️⃣ انتهاء الصلاحية
    ========================== */
    if (now > Number(accessUntil)) {
      return blockedPage("انتهت مدة الاشتراك");
    }

    return context.next();

  } catch (e) {
    return new Response("Access error", { status: 403 });
  }
}

/* =========================
   صفحة المنع
========================== */
function blockedPage(message = "الدخول متاح فقط للمشتركين") {
  return new Response(`
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Access denied</title>
      </head>
      <body style="
        font-family:sans-serif;
        background:#f5f5f5;
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
      ">
        <div style="
          background:#fff;
          padding:30px;
          border-radius:10px;
          text-align:center;
          max-width:400px;
        ">
          <h2>⛔ ${message}</h2>
          <p>للحصول على صلاحية الدخول</p>
          <a href="https://wa.me/21259159044"
             style="
              display:inline-block;
              margin-top:15px;
              padding:12px 20px;
              background:#25D366;
              color:white;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
             ">
            تواصل معنا عبر واتساب
          </a>
        </div>
      </body>
    </html>
  `, { headers: { "Content-Type": "text/html" } });
}
