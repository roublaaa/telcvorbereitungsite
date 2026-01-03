export function onRequest(context) {
  const url = new URL(context.request.url);
  const token = url.searchParams.get("token");

  if (token === "MONTH123") {
    return context.next();
  }

  return new Response(`
    <h2>⛔ الدخول فقط للمشتركين</h2>
    <a href="https://wa.me/212XXXXXXXXX">واتساب</a>
  `, {
    headers: { "Content-Type": "text/html" }
  });
}
