/**
 * Public demo accounts.
 *
 * SwiftCart's dashboards are the most interesting part of the product and they
 * sit behind a signup, so nobody reviewing the project ever sees them. Two
 * seeded accounts fix that, with the constraint that neither may damage real
 * data and neither may leak anyone's personal information.
 *
 * The rules, in one place so the API routes and the UI cannot drift apart:
 *
 *   demo admin  read-only everywhere. Every non-GET admin endpoint refuses it.
 *   demo user   may use the shop as a customer (cart, wishlist, checkout),
 *               because walking the buying flow is the point. It may not post
 *               reviews, which are public content on product pages.
 *
 * Identification is a flag on the user document rather than a hardcoded email,
 * so the accounts can be renamed without touching authorisation logic.
 */

export const DEMO_ADMIN_EMAIL = "admin@demo.swiftcart";
export const DEMO_USER_EMAIL = "shopper@demo.swiftcart";

// Deliberately public — the accounts exist to be used by strangers. What makes
// that safe is the server-side rules below, not this being secret. Keep in step
// with scripts/seed-demo.js.
export const DEMO_PASSWORD = "demo1234";

export const DEMO_WRITE_BLOCKED =
  "This is a read-only demo account. Create your own account to make changes.";

export const DEMO_REVIEW_BLOCKED =
  "Reviews are disabled for the demo account because they appear publicly on product pages.";

/** True when the signed-in session belongs to one of the seeded demo accounts. */
export function isDemoSession(userSession) {
  return userSession?.user?.isDemo === true;
}

/**
 * Mask an email for display: keeps the first character and the top-level
 * domain, so a reviewer can see the column is populated and correctly shaped
 * without learning who anyone is.
 *
 *   alice@gmail.com -> a••••@•••••.com
 */
export function maskEmail(email) {
  const value = String(email ?? "");
  const at = value.indexOf("@");
  if (at < 1) return "•••••";

  const first = value[0];
  const local = "•".repeat(Math.max(value.slice(0, at).length - 1, 1));
  const domain = value.slice(at + 1);
  const dot = domain.lastIndexOf(".");
  const tld = dot > -1 ? domain.slice(dot) : "";
  const host = "•".repeat(Math.max((dot > -1 ? domain.slice(0, dot) : domain).length, 1));

  return `${first}${local}@${host}${tld}`;
}

/** Mask a personal name down to initials: "Ada Lovelace" -> "A. L." */
export function maskName(name) {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Demo user";
  return parts.map((p) => `${p[0].toUpperCase()}.`).join(" ");
}

/**
 * Redact the customer list for a demo viewer.
 *
 * The demo admin needs to see that the users table renders, paginates and
 * searches. It does not need anyone's real address. Documents are plain
 * objects by the time they reach here (`.lean()` or `.toObject()`).
 */
export function redactUserForDemo(user) {
  return {
    ...user,
    name: maskName(user?.name),
    email: maskEmail(user?.email),
  };
}

export function redactUsersForDemo(users, userSession) {
  if (!isDemoSession(userSession)) return users;
  return (users ?? []).map(redactUserForDemo);
}
