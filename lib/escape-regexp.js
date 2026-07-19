// User input (search terms, category slugs) is interpolated into RegExp objects
// that reach Mongo. Unescaped, "(" throws and ".*" matches the whole collection.
export function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
