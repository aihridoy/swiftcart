import { afterEach, describe, expect, it } from "vitest";
import { getCallbackUrl } from "./callback-url";
import { escapeRegExp } from "./escape-regexp";

function setSearch(search) {
  globalThis.window = { location: { search } };
}

afterEach(() => {
  delete globalThis.window;
});

describe("getCallbackUrl", () => {
  it("returns the in-app path the visitor was blocked from", () => {
    setSearch("?callbackUrl=%2Fcart");
    expect(getCallbackUrl()).toBe("/cart");
  });

  it("keeps the query string of the blocked page", () => {
    setSearch("?callbackUrl=%2Forders%3Fpage%3D2");
    expect(getCallbackUrl()).toBe("/orders?page=2");
  });

  it("falls back home when there is no callback", () => {
    setSearch("");
    expect(getCallbackUrl()).toBe("/");
  });

  it("refuses absolute and protocol-relative URLs", () => {
    setSearch("?callbackUrl=https%3A%2F%2Fevil.test%2Fphish");
    expect(getCallbackUrl()).toBe("/");
    setSearch("?callbackUrl=%2F%2Fevil.test%2Fphish");
    expect(getCallbackUrl()).toBe("/");
  });
});

describe("escapeRegExp", () => {
  it("makes an unbalanced paren a literal instead of a syntax error", () => {
    expect(() => new RegExp(escapeRegExp("("))).not.toThrow();
  });

  it("stops a wildcard from matching everything", () => {
    expect(new RegExp(escapeRegExp(".*"), "i").test("anything")).toBe(false);
    expect(new RegExp(escapeRegExp(".*"), "i").test("a .* b")).toBe(true);
  });
});
