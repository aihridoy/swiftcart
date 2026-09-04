import { NextResponse } from "next/server";
import { DEMO_WRITE_BLOCKED, isDemoSession } from "./demo-account";

/**
 * Single authorisation gate for admin API routes.
 *
 * Before this existed, each route repeated the same
 * `!session || !session.user || session.user.role !== "admin"` expression, so
 * adding the demo rule would have meant editing that expression in every
 * handler and hoping none were missed. Routes now declare intent instead:
 *
 *   const denied = guardAdmin(userSession, { write: true });
 *   if (denied) return denied;
 *
 * Returns a NextResponse to send back, or null when the request may proceed.
 */
export function guardAdmin(userSession, { write = false } = {}) {
  if (!userSession?.user || userSession.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // A demo admin holds a real admin role — it can read every dashboard — but
  // must never mutate. Enforced here rather than only in the UI, so hiding a
  // button is a convenience and not the actual control.
  if (write && isDemoSession(userSession)) {
    return NextResponse.json({ error: DEMO_WRITE_BLOCKED }, { status: 403 });
  }

  return null;
}

/** Block a demo account from a write that any signed-in user could otherwise make. */
export function guardDemoWrite(userSession, message = DEMO_WRITE_BLOCKED) {
  if (isDemoSession(userSession)) {
    return NextResponse.json({ error: message }, { status: 403 });
  }
  return null;
}
