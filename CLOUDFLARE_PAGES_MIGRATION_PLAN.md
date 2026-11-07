# Cloudflare Pages Migration Plan

Status: Preparation only. No Cloudflare projects created, no production DNS changed, and no Vercel project/domain removed.

Repository: `oluwajuwonade/oluwajuwonade.github.io`
Production branch: `main`
Hosting target: Two independent Cloudflare Pages projects connected to the same GitHub repository.

## 1. Project topology

| Site | Cloudflare Pages project name (proposed) | Repository root | Build command | Build output directory |
|---|---|---|---|---|
| Portfolio | `oluwajuwonade-portfolio` | `docs` | Leave blank (static HTML) | `.` |
| SkillForge | `skillforge-learning` | `skillforge` | Leave blank (static HTML) | `.` |

Both directories contain a top-level `index.html`. These are static HTML/CSS/JavaScript applications; no framework compilation step is currently required. Confirm any future asset-generation/build requirement before changing the blank build command.

Configure each Pages project separately:
- Connect GitHub repository `oluwajuwonade/oluwajuwonade.github.io`.
- Production branch: `main`.
- Set the root directory to the exact path in the table.
- Set output directory to `.` relative to that root.
- Do not share environment variables between the projects unless a documented requirement emerges.
- Configure build watch paths so portfolio changes trigger only the portfolio build and SkillForge changes trigger only the SkillForge build. Include shared root-level files only if the relevant site actually consumes them.
- Enable preview deployments for non-production branches; use a separate migration branch for initial validation.

## 2. Domain preservation and DNS constraints

Current public Vercel hostnames recorded for the sites:
- Portfolio: `oluwajuwonade.vercel.app`
- SkillForge: `skillforge-learning-oluwajuwonade.vercel.app` (a separate Vercel deployment/domain alias has also appeared in account records).

These are Vercel-managed `vercel.app` subdomains, not user-owned custom domains. They cannot be transferred or pointed to Cloudflare Pages as custom domains. Cloudflare will issue new `*.pages.dev` hostnames for staging.

To preserve branded production URLs after migration, the owner must provide or register two custom domains/subdomains under a domain they control (for example, a portfolio domain and a SkillForge subdomain). Do not assume that any previously discussed candidate domain is registered or owned. Verify ownership and DNS control before scheduling cutover.

DNS change gate:
1. Create and validate both Pages projects on their `pages.dev` URLs.
2. Add custom domains to Pages and complete domain verification.
3. Review the exact DNS record changes shown by Cloudflare.
4. Obtain explicit owner approval for each production DNS change.
5. Only then change DNS. Do not change nameservers as part of this plan unless separately approved; prefer the narrowest required CNAME/flattening change supported by the current DNS provider.
6. Keep Vercel projects and deployments intact during a monitoring period.

No DNS operation is authorized by this document.

## 3. Migration and validation sequence

1. Confirm Cloudflare account access, GitHub repository authorization, and the two target domains.
2. Create the two Pages projects with the independent roots above.
3. Deploy from a dedicated migration branch first; do not use `main` for first-time configuration.
4. Validate the portfolio Pages preview: homepage, navigation, project pages, CV/download links, contact/enquiry path, metadata, canonical URLs, robots/sitemap, mobile layout and console/network errors.
5. Validate SkillForge Pages preview: onboarding, programme/course navigation, assessments, local storage persistence, export/import, PWA manifest, icon paths, service-worker scope, offline launch and cache refresh.
6. Confirm each site's assets resolve relative to its root. Pay special attention to absolute paths and service-worker scope on SkillForge.
7. Test form links and response collection. Do not submit fabricated prospect or tester data.
8. Compare both Pages previews against current Vercel production sites.
9. Record deployment IDs, commit SHAs, test results and any defects.
10. Obtain explicit approval for each production domain/DNS cutover.
11. After cutover, verify HTTPS, redirects, canonical URLs, analytics, forms and availability from multiple networks.
12. Keep Vercel as the rollback destination until the observation period is complete.

## 4. Rollback plan

Before cutover:
- Vercel remains the production host and source of truth.
- No DNS changes are made.
- If a Pages preview fails, fix the Pages configuration or abandon the preview; users remain on Vercel.

After an approved cutover:
- Keep the last known-good Vercel production deployment and project configuration untouched.
- If Cloudflare Pages is unhealthy, restore the prior DNS record values at the existing DNS provider (or remove the Pages CNAME and restore the Vercel target, as appropriate to the domain's prior configuration).
- Verify DNS resolution, HTTPS certificate, redirects and site content after restoration.
- Cloudflare Pages production deployments also support rollback to a previous successful production deployment; preview deployments are not rollback targets.
- Do not delete Vercel projects, domains or deployments until both sites have passed the agreed observation period and the owner explicitly authorizes retirement.

## 5. Operational safeguards

- Do not migrate SkillForge to a server-rendered or account-based architecture as part of hosting migration.
- Preserve local-first storage and existing PWA/offline behavior.
- Do not add Supabase, authentication, email services or server-side dependencies as a migration prerequisite.
- Do not place secrets in client-side environment variables or repository files.
- Track analytics separately per site and validate consent/privacy requirements before enabling additional tracking.
- Keep production branch protected through review and use preview deployments for changes.

## 6. Explicit approvals still required

- Cloudflare account authorization and creation of the two Pages projects.
- Confirmation of two owner-controlled custom domains or subdomains.
- Approval of exact production DNS record changes for the portfolio.
- Approval of exact production DNS record changes for SkillForge.
- Approval to retire Vercel only after the migration has been stable.

## Official Cloudflare references

- Monorepos: https://developers.cloudflare.com/pages/configuration/monorepos/
- Build configuration: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Git integration: https://developers.cloudflare.com/pages/configuration/git-integration/
- Custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Rollbacks: https://developers.cloudflare.com/pages/configuration/rollbacks/
- Vercel migration guide: https://developers.cloudflare.com/pages/migrations/migrating-from-vercel/
