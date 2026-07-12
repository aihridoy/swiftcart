const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/user-dashboard/", "/cart", "/profile/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
