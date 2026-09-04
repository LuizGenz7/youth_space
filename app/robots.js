export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/profile/",
        "/settings/",
        "/dashboard/",
    ],
    },

    sitemap:
      "https://youthspace.vercel.app/sitemap.xml",
  };
}