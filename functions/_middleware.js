export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const VALID_TOKEN = "MONTH123";

  const cookieHeader = request.headers.get("Cookie") || "";
  const hasAccess = cookieHeader.includes("access=true");

  // ✅ دخل بالـ token
  if (token === VALID_TOKEN) {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": url.origin,
        "Set-Cookie": "access=true; Path=/; Max-Age=2592000" // 30 يوم
      }
    });
  }

  // ✅ لديه cookie → يدخل كل الأقسام
  if (hasAccess) {
    return context.next();
  }

  // ❌ ممنوع
  return new Response(
    `<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="UTF-8">
<title>مغلق</title>
</head>
<body style="font-family:sans-serif;text-align:center;margin-top:80px">
<h2>⛔ الدخول متاح فقط للمشتركين</h2>
<p>للحصول على صلاحية الدخول</p>
<a href="https://wa.me/212659159044">تواصل معنا عبر واتساب</a>
</body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=UTF-8" } }
  );
}
