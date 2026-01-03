export function onRequest() {
  return new Response("MIDDLEWARE OK", {
    headers: { "Content-Type": "text/plain" }
  });
}
