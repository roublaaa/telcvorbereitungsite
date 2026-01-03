export async function onRequest(context) {
  const url = new URL(context.request.url);
  const token = url.searchParams.get("token");

  // token المسموح
  const VALID_TOKEN = "MONTH123";

  // السماح فقط إذا كان token موجود
  if (token === VALID_TOKEN) {
    return context.next();
  }

  // منع أي شخص بدون token
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
    {
      headers: {
        "Content-Type": "text/html; charset=UTF-8"
      }
    }
  );
}
