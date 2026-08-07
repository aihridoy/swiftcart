# Local Integrity Fixes Implementation Plan

**Goal:** Correct checkout consistency, reset-token storage, rate-limiter memory behavior, newsletter tests, and build font reliability using local code only.

**Architecture:** Extract checkout and reset-token behavior into testable helpers while keeping route contracts stable. Use Mongoose sessions for transaction boundaries and conditional stock updates for concurrency safety.

**Tech Stack:** Next.js 14 route handlers, Mongoose 8, MongoDB, Vitest, `next/font/local`.

## Tasks

1. Add checkout route tests proving current catalog prices are used and all writes share one transaction; implement transactional checkout with conditional inventory decrements.
2. Add reset-token helper tests proving raw tokens never enter queries; hash tokens during issuance and reset lookup.
3. Add limiter tests for fixed-window behavior and expired-bucket cleanup; implement bounded cleanup without external storage.
4. Update newsletter DELETE tests to send a valid token and mock token lookup/deletion.
5. Replace Poppins/Roboto Google font imports with the existing local Geist fonts and preserve CSS variables.
6. Run `npm test` and `npm run build`; report exact results and the skipped payment-processing issue.
