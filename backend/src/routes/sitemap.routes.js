// src/routes/sitemap.routes.js
import { Router } from "express";
import sanityClient from "../lib/sanityClient.js";

const router = Router();

router.get("/", async (_, res) => {
  const posts = await sanityClient.fetch(`
    *[_type=="post"]{ slug, _updatedAt }
  `);

  const urls = posts
    .map(
      (p) => `
    <url>
      <loc>${process.env.FRONTEND_URL}/blog/${p.slug.current}</loc>
      <lastmod>${p._updatedAt}</lastmod>
    </url>
  `
    )
    .join("");

  res.type("application/xml");
  res.send(`
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>
  `);
});

export default router;
