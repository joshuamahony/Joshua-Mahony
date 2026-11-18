# Joshua Mahony — Article Publishing Upgrade

**Current status: Development scaffold only. Not live or connected to Cloudflare.**

The existing `main` branch and current single-file homepage remain untouched. This branch starts the future article editor.

## Publishing experience (after deployment)

- Open `https://joshua-mahony.com/admin/`.
- Sign in with GitHub through a configured OAuth authentication bridge.
- Select **Market Commentary → New Article**.
- Enter the headline, date, category, summary, optional hero image and article body.
- Embed charts or images in the article body using the image toolbar.
- Publish to GitHub; Cloudflare rebuilds the site, which will generate the new article page and update the homepage list.

## Implementation still required

1. Convert the existing single-file HTML into an Astro layout and homepage, preserving its styles, logo and headshot.
2. Create an Astro content collection for `src/content/articles/*.md` and routes for `/commentary/` and `/commentary/[slug]/`. Generate the homepage commentary feed from the collection.
3. Configure the Cloudflare Workers build/deployment for a **separate test site**, connected to this branch.
4. Configure a secure GitHub OAuth bridge for Decap CMS. GitHub OAuth **client secrets must never be committed** to this public repository. Add the bridge URL to `public/admin/config.yml`.
5. Test signing in, adding an image, publishing an article and checking the generated page.
6. Change the CMS backend branch to `main` only when production deployment is ready and approved.

## Folder overview

- `public/admin/index.html`: loads the Decap CMS editor.
- `public/admin/config.yml`: defines GitHub integration and editable article fields.
- `src/content/articles/`: Markdown article files once Astro is added.
- `public/uploads/`: chart and image uploads once Astro is added.

Don't connect this scaffold directly to the existing production Worker: it is not yet a functional CMS-enabled website.
