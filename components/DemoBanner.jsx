import { session } from "@/actions/auth-utils";
import { isDemoSession } from "@/lib/demo-account";

/**
 * Explains why the dashboard's controls refuse to do anything.
 *
 * Without this a reviewer clicks Delete, gets a red toast, and reasonably
 * concludes the app is broken. The server-side guard is the actual control;
 * this is so the refusal reads as intentional.
 */
export default async function DemoBanner() {
  const userSession = await session();
  if (!isDemoSession(userSession)) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <div className="mx-auto flex max-w-6xl items-start gap-3">
        <span aria-hidden="true" className="mt-0.5">👀</span>
        <p>
          <span className="font-semibold">Read-only demo.</span>{" "}
          Browse every dashboard freely — creating, editing and deleting are
          disabled, and customer names and email addresses are masked.
        </p>
      </div>
    </div>
  );
}
