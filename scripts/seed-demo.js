/**
 * Seeds (or repairs) the two public demo accounts.
 *
 *   node --env-file=.env.local scripts/seed-demo.js
 *
 * Idempotent: run it as often as you like. It upserts by email, always resets
 * the password to the published one, and always re-asserts role and isDemo, so
 * a poked-at demo account can be restored without touching anything else.
 *
 * Passwords are intentionally public — these accounts exist so a stranger can
 * look around. Everything that makes that safe is enforced server-side in
 * lib/admin-guard.js and lib/demo-account.js, not by the password being secret.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DEMO_ADMIN_EMAIL = "admin@demo.swiftcart";
const DEMO_USER_EMAIL = "shopper@demo.swiftcart";
const DEMO_PASSWORD = "demo1234";

const accounts = [
  { name: "Demo Admin", email: DEMO_ADMIN_EMAIL, role: "admin" },
  { name: "Demo Shopper", email: DEMO_USER_EMAIL, role: "user" },
];

async function main() {
  const uri = process.env.MONGODB_CONNECTION_STRING;
  if (!uri) {
    console.error("MONGODB_CONNECTION_STRING is not set.");
    console.error("Try: node --env-file=.env.local scripts/seed-demo.js");
    process.exit(1);
  }

  await mongoose.connect(uri, { maxPoolSize: 5 });

  // Loose schema on purpose: this script only needs the handful of fields it
  // writes, and must not fall out of step with the app's model over time.
  const User = mongoose.models.users
    ?? mongoose.model("users", new mongoose.Schema({}, { strict: false, collection: "users" }));

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const account of accounts) {
    const result = await User.updateOne(
      { email: account.email },
      {
        $set: {
          name: account.name,
          email: account.email,
          password: passwordHash,
          role: account.role,
          isDemo: true,
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    const action = result.upsertedCount ? "created" : "updated";
    console.log(`${action.padEnd(7)} ${account.role.padEnd(5)} ${account.email}`);
  }

  console.log(`\nPassword for both: ${DEMO_PASSWORD}`);
  console.log("Demo admin is read-only. Demo shopper can buy but cannot post reviews.");

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
