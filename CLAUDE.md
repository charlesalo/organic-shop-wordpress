# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A local WordPress + WooCommerce site ("organic-shop") managed by [WordPress Studio](https://developer.wordpress.com/studio/). It's the WordPress core checkout with a custom block theme and WooCommerce providing the storefront. There is no separate build/frontend project — this directory *is* the WordPress webroot (`wp-config.php`, `wp-admin/`, `wp-includes/` at the top level).

**Read `@STUDIO.md` before running any commands.** It has the full Studio CLI workflow, MCP tools, and constraints; the essentials are summarized below.

## Commands

All `wp` CLI calls must be prefixed with `studio` (a bare `wp` binary is not the entry point):

```bash
studio status                          # site URL, admin credentials, PHP/WP versions
studio start --skip-browser            # start the local server
studio stop                            # stop it
studio wp <command>                    # any WP-CLI command, e.g.:
studio wp plugin list --status=active --format=csv
studio wp theme activate verdant-harvest
studio wp eval 'echo function_exists("my_function") ? "yes" : "no";'
studio wp db query "SELECT ..."        # SQLite-backed, standard SQL works
```

There are no JS/PHP build tooling, linting, or test commands at the project root — the active theme (`verdant-harvest`) is plain HTML/CSS/JS with no compile step. The `wc-smooth-generator` plugin (see below) is a vendored third-party plugin with its own composer/npm/phpunit setup; treat it as read-only unless a task specifically targets it.

## Architecture

**Database:** SQLite, not MySQL, via a must-use plugin (`wp-content/mu-plugins/sqlite-database-integration/`). Standard `$wpdb` calls work unchanged, but there's no MySQL server, no `FULLTEXT` index support, and `DB_NAME`/`DB_HOST`/`DB_USER`/`DB_PASSWORD` are undefined — never reference them. Don't touch `wp-content/db.php` (the drop-in) or the mu-plugin.

**Active theme — `wp-content/themes/verdant-harvest/`:** A custom block theme (FSE, `theme.json` v3, no classic PHP templates). Structure:
- `theme.json` — color palette (`base`, `base-2`, `contrast`, `primary`, `secondary`, `accent`, `accent-2`), fluid typography (Fraunces display / DM Sans body, self-hosted in `assets/fonts/`).
- `templates/` — `front-page.html`, `page.html`, `single.html`, `archive.html`, `index.html`, `404.html`.
- `parts/header.html`, `parts/footer.html` — site chrome, incl. `woocommerce/mini-cart` block in the header nav.
- `functions.php` — just enqueues `style.css`, `assets/motion.js`, and an editor style; no custom blocks, hooks, or PHP logic beyond that.
- `style.css` also carries a load-bearing comment/rule zeroing `.wp-site-blocks` top margin — read it before touching top-level section spacing.
- Content (hero, product grid, testimonials, etc.) lives in block markup inside page content / patterns, not in PHP — edit via the block editor or by editing the page content directly, not by adding template logic.

**Active plugins:** WooCommerce (+ `woocommerce-payments`, `woocommerce-services`) is the commerce engine; Jetpack, Blaze Ads, Gravatar Enhanced, and Gutenberg (canary block editor) are also active. Run `studio wp plugin list --status=active` to get the current list rather than trusting this file as installs change.

**`wp-content/plugins/git-repo/` is the WooCommerce Smooth Generator plugin** (folder name is misleading — it's not a repo pointer). It's vendored third-party code for generating fake products/orders/customers/coupons for dev and demo purposes via `wp wc generate ...` (see its own `README.md`). Don't extend it for site features; it's a data-seeding tool, not part of the storefront.

**Content model (implemented, verify with `studio wp` before assuming stale):**
- WooCommerce product categories: Vegetables, Fruits, Grains, Dairy (`studio wp term list product_cat`).
- Pages: Home (front page), Shop, Our Story, FAQ, Contact, plus WooCommerce-generated Cart/Checkout/My Account (`studio wp post list --post_type=page`).
- `tmp/page-*.html` at the repo root holds scratch/reference block markup for Home, Contact, FAQ, and Our Story — useful as a source of truth for intended page content/structure, not live output.

## Working in this codebase

- Never edit `wp-includes/` or `wp-admin/` (core) — they're overwritten on update. Extend via hooks in the theme's `functions.php` or a new plugin under `wp-content/plugins/`.
- To customize `verdant-harvest` rather than replace it, prefer editing it directly (it's already the project's own theme, not a parent/child pair) — only create a child theme if you need to preserve an upstream theme's updates.
- New themes must be block themes (`theme.json`-based), not classic PHP-template themes — matches the existing site and Studio's own guidance.
- Sanitize input (`sanitize_text_field()`, `absint()`, `wp_kses_post()`) and escape output (`esc_html()`, `esc_attr()`, `esc_url()`) in any new PHP; use `$wpdb->prepare()` for dynamic queries.
- Prefer the Options/meta APIs (`get_option`/`update_option`, post/user/term meta) over raw queries.
