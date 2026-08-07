# Local Integrity Fixes Design

## Scope

Fix the locally addressable review findings without Vercel, deployment, infrastructure, or external-service changes. Real payment authorization is excluded because the application cannot prove that funds were authorized without a payment processor.

## Design

- Checkout will use a MongoDB transaction. It will reload each product inside the transaction, use the current product price, conditionally decrement stock, create the order, and clear the cart as one unit. A failed stock decrement aborts everything.
- Password-reset tokens will be random values sent to users, while only SHA-256 digests are stored and queried.
- The local rate limiter will cap memory growth and periodically discard expired buckets. It remains per-process by design; global enforcement requires shared infrastructure.
- Newsletter DELETE tests will supply and verify unsubscribe tokens.
- The root layout will use the repository's local Geist font files so builds do not fetch Google Fonts.

## Testing

Add focused Vitest coverage for checkout pricing/transactions, reset-token hashing, limiter cleanup, and token-based unsubscribe. Finish with the complete test suite and production build.
