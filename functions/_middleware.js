export function onRequest(context) {
  const { request, cookies } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  // 🔑 token الصحيح
  const VALID_TOKEN = "MONTH123";

  // 🍪 هل لديه صلاحية؟
  const hasAccess = cookies.get("access")?.value === "true";

  // ✅ دخل بالـ token
  if (token === VALID_TOKEN) {
    cookies.set("access", "true", {
      path: "/",
      maxAge: 30 * 24 * 60 * 60 // شهر
    });

    return Response.redirect(url.origin, 302);
  }

  // ✅ لديه Cookie → يدخل كل الأقسام
  if (hasAccess) {
    return context.next();
  }

  // ❌ ممنوع بدون صلاحية
  return new Response(`
    <!DOCTYPE html>
    <html lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>مغلق</title>
    </head>
    <body style="font-family:sans-serif;text-align:center;margin-top:80px">
      <h2>⛔ هذا المحتوى خاص بالمشتركين</h2>
      <p>للحصول على صلاحية الدخول</p>
      <a href="https://wa.me/212659159044">تواصل معنا عبر واتساب</a>
    </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html; charset=UTF-8" }
  });
}
