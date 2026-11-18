# Editing the Homepage from the CMS

A new **Homepage** collection is configured in Decap CMS (`public/admin/config.yml`), alongside Market Commentary.

1. After GitHub OAuth is configured, open `/admin/` on the test deployment.
2. Select **Homepage → Homepage Content**.
3. Edit the hero, About, professional highlights, videos, services or contact fields.
4. For a new headshot or video thumbnail, upload an image in the editor.
5. Save / publish. The CMS commits changes to `src/data/homepage.json`, and Cloudflare automatically rebuilds the site.

All existing text, credentials and example videos are prefilled in the JSON. Headshot is intentionally blank by default, retaining your existing embedded professional photo.

The stylesheet and core HTML remain in `site-source/index.html` to preserve the original design; `src/lib/homepage.ts` replaces the editable sections at build time. Article listings are still generated automatically from `src/content/articles/`.

**Not live yet:** GitHub OAuth authentication has not been configured and the test deployment must be validated after these changes. The production site remains on the untouched `main` branch.
