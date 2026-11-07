# Cloudflare Pages Pre-Migration Audit

Status: Read-only source inspection on `chore/cloudflare-pages-migration-plan`. No website source files changed by this audit. No Cloudflare project created. No production DNS changed.

## Confirmed deployment roots

Repository: `oluwajuwonade/oluwajuwonade.github.io`

- Portfolio root: `docs/`; `docs/index.html` exists.
- SkillForge root: `skillforge/`; `skillforge/index.html` exists.
- Both entrypoints are static HTML. Proposed Cloudflare build command: blank. Proposed output directory: `.` relative to each root.

## Migration blockers and checks

### Portfolio SEO host references

The portfolio source currently hard-codes the Vercel production hostname in:
- `docs/index.html`: canonical URL and Open Graph URL.
- `docs/robots.txt`: sitemap URL.
- `docs/sitemap.xml`: every listed canonical location.

This is correct while Vercel remains production. Do not replace these URLs with temporary `pages.dev` addresses during staging. Before any future custom-domain cutover, update and validate canonical, Open Graph, robots and sitemap URLs together for the owner-confirmed domain. Until a domain is acquired, keep Vercel as the declared production canonical.

### SkillForge PWA

- `skillforge/manifest.webmanifest` exists and uses relative `start_url` and `scope` values (`./`), which are suitable for deployment under the SkillForge project root.
- A file at `skillforge/service-worker.js` was not found at the inspected path. This does not prove that no service worker exists; inspect the app source for its actual registration URL and worker filename before accepting offline/PWA validation.
- Confirm service-worker registration scope, asset paths, cache versioning, update flow and offline behavior on the final `pages.dev` origin. Browser storage is origin-specific; existing local progress saved on the Vercel origin will not automatically appear on the Pages origin. Provide a clear export/import path and user notice before any eventual migration of users.

## Required staging controls

1. Deploy both sites to their `pages.dev` addresses only after Cloudflare account access is authorized.
2. Keep the Vercel production URLs as the public canonical URLs while Pages is a test environment.
3. Prevent staging URLs from being indexed; use a staging-specific response/header or temporary staging markup, then remove that restriction only when the production host and domain decision are approved. Do not accidentally ship a permanent noindex rule.
4. Test all relative and absolute asset paths, downloads, forms, outbound links and mobile layouts.
5. Test SkillForge persistence, export/import and PWA behavior in a clean browser profile.
6. Record the commit SHA and successful Pages deployment IDs for both sites.
7. Do not modify production DNS, nameservers, Vercel domains or Vercel deployments without explicit approval.

## Domain decision

No user-owned domain is currently available. Use the temporary Pages-provided `*.pages.dev` hostnames for migration testing. A custom domain is a later, separate purchase and configuration decision.
