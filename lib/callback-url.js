// Where to send someone after they sign in. Middleware puts the page they were
// blocked from into ?callbackUrl=; anything that is not a plain in-app path is
// ignored so the parameter cannot be used as an open redirect.
export function getCallbackUrl() {
  if (typeof window === "undefined") return "/";

  const target = new URLSearchParams(window.location.search).get("callbackUrl");
  if (!target || !target.startsWith("/") || target.startsWith("//")) return "/";

  return target;
}
