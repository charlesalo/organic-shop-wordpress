# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A local WordPress + WooCommerce site ("organic-shop") served by **MAMP** (Apache + PHP 8.3.30) out of `/Applications/MAMP/htdocs/organic-shop`. It's the WordPress core checkout with a custom block theme and WooCommerce providing the storefront. There is no separate build/frontend project — this directory *is* the WordPress webroot (`wp-config.php`, `wp-admin/`, `wp-includes/` at the top level).

- Site: **http://localhost:8888/organic-shop/** — admin at `/wp-admin/`, users `admin` and `charlesmsjalo`.
- Start/stop Apache from the MAMP app; it serves `htdocs` on port 8888.

The project was originally created in [WordPress Studio](https://developer.wordpress.com/studio/) and copied here. `@STUDIO.md` documents that original workflow and **no longer applies to this copy** — the `studio` CLI targets the Studio-managed site, not this directory. Read it only for background on how the site was built.

## Commands

`wp` is WP-CLI 2.12.0, installed at `~/.local/bin/wp` (a wrapper around `~/.local/bin/wp-cli.phar` pinned to MAMP's PHP 8.3.30, so the CLI matches the version Apache runs). Run it from anywhere inside the project — it finds `wp-config.php` by walking up from the cwd:

```bash
wp option get home                     # site URL
wp plugin list --status=active --format=csv
wp theme activate verdant-harvest
wp eval 'echo function_exists("my_function") ? "yes" : "no";'
wp search-replace OLD NEW --dry-run --skip-columns=guid   # see caveats below
```

Two caveats for `wp search-replace` on this site:
- **Always pass `--skip-columns=guid`.** Post GUIDs are permanent identifiers, not serving URLs; rewriting them breaks feed-reader dedupe and is never what you want. A URL migration here shows ~183 `guid` hits that should all be left alone.
- **Its replacement count is meaningless under SQLite.** It reports affected rows, and SQLite counts every row an `UPDATE` touches while MySQL counts only rows whose value actually changed — so a 4-row change can report thousands. The replacements themselves are correct (`REPLACE()` on a non-matching string is a no-op); only the tally lies. Trust `--dry-run`'s per-column breakdown, and verify with a `sqlite3` count afterwards rather than believing the summary.

Override the PHP binary with `MAMP_PHP=/path/to/php wp ...` if MAMP's PHP version changes.

**`wp db <subcommand>` does not work here** — `wp db query`, `db export`, and `db cli` shell out to the `mysql` client, and this site has no MySQL (see Architecture). The placeholder `DB_*` constants in `wp-config.php` exist only to satisfy plugins that read them; they point at nothing. To query the database, use one of:

```bash
wp eval 'global $wpdb; print_r( $wpdb->get_results( "SELECT ..." ) );'
sqlite3 wp-content/database/.ht.sqlite "SELECT ..."   # direct, read-only sanity checks
```

Prefer `wp eval`/`$wpdb` for anything that writes — the SQLite driver rewrites MySQL syntax, and hand-written SQLite DDL can desync the emulated information schema.

There are no JS/PHP build tooling, linting, or test commands at the project root — the active theme (`verdant-harvest`) is plain HTML/CSS/JS with no compile step. The `wc-smooth-generator` plugin (see below) is a vendored third-party plugin with its own composer/npm/phpunit setup; treat it as read-only unless a task specifically targets it.

## Architecture

**Database:** SQLite, not MySQL, via a must-use plugin (`wp-content/mu-plugins/sqlite-database-integration/`) plus the `wp-content/db.php` drop-in. The data lives in a single file, `wp-content/database/.ht.sqlite` — back that up before any destructive operation. Standard `$wpdb` calls work unchanged, but there's no MySQL server and no `FULLTEXT` index support. `DB_NAME`/`DB_HOST`/`DB_USER`/`DB_PASSWORD` are defined in `wp-config.php` but are **placeholders that connect to nothing** — never use them to open a connection, and don't trust code that does. Don't touch `wp-content/db.php` or the mu-plugin.

**Serving / URLs:** The site lives in a *subdirectory* of the MAMP docroot, so `siteurl` and `home` are `http://localhost:8888/organic-shop` and `.htaccess` at the project root carries `RewriteBase /organic-shop/`. Permalinks are `/%postname%/` and depend on that `.htaccess` — without it every URL except the homepage 404s. If the site is ever moved or the port changes, update both options *and* `.htaccess`; use `wp search-replace` (serialization-safe) rather than raw SQL for any URL rewrite.

**Never write root-relative URLs in block markup.** Because the site is in a subdirectory, `src="/wp-content/uploads/x.jpg"` and `href="/shop/"` resolve to `localhost:8888/...` — outside the site — and silently 404. Hand-authored markup here originally used that form (it worked under Studio, which served from the docroot) and it broke on the move. Two conventions now apply, and new markup must follow them:
- **Database content** (pages, templates, template parts): absolute URLs, e.g. `http://localhost:8888/organic-shop/shop/`. This matches what WordPress stores for its own URLs and means `wp search-replace` catches them on a future move.
- **Theme files** (`parts/*.html`, `templates/*.html`): root-relative *with* the subdirectory prefix, e.g. `/organic-shop/shop/`. These are version-controlled, so the host and port stay out of git — but `wp search-replace` does not touch files, so a move needs a manual `sed` over `wp-content/themes/verdant-harvest/`.

Watch for the two different spellings when grepping: plain attributes (`href="/shop/"`) and navigation-link block JSON (`"url":"/shop/"`). A grep for one will miss the other.

`wp-content/mu-plugins/99-studio-loader.php` is a leftover from Studio. It points at a temp directory that no longer exists, so its loader loop is a no-op, but it still sets `WP_ENVIRONMENT_TYPE` to `local` and defines the placeholder `DB_*` constants as a fallback. Harmless; leave it unless you're deliberately cleaning up.

**Active theme — `wp-content/themes/verdant-harvest/`:** A custom block theme (FSE, `theme.json` v3, no classic PHP templates). Structure:
- `theme.json` — color palette (`base`, `base-2`, `contrast`, `primary`, `secondary`, `accent`, `accent-2`), fluid typography (Fraunces display / DM Sans body, self-hosted in `assets/fonts/`).
- `templates/` — `front-page.html`, `page.html`, `single.html`, `archive.html`, `index.html`, `404.html`.
- `parts/header.html`, `parts/footer.html` — site chrome, incl. `woocommerce/mini-cart` block in the header nav.
- `functions.php` — just enqueues `style.css`, `assets/motion.js`, and an editor style; no custom blocks, hooks, or PHP logic beyond that.
- `style.css` also carries a load-bearing comment/rule zeroing `.wp-site-blocks` top margin — read it before touching top-level section spacing.
- Content (hero, product grid, testimonials, etc.) lives in block markup inside page content / patterns, not in PHP — edit via the block editor or by editing the page content directly, not by adding template logic.

**Active plugins:** WooCommerce (+ `woocommerce-gateway-stripe`, `woocommerce-payments`, `woocommerce-services`) is the commerce engine; Jetpack, Blaze Ads, Gravatar Enhanced, Gutenberg (canary block editor), and the mail pair `wp-mail-smtp`/`wp-mail-logging` are also active. Run `wp plugin list --status=active` to get the current list rather than trusting this file as installs change.

**`wp-content/plugins/git-repo/` is the WooCommerce Smooth Generator plugin** (folder name is misleading — it's not a repo pointer). It's vendored third-party code for generating fake products/orders/customers/coupons for dev and demo purposes via `wp wc generate ...` (see its own `README.md`). Don't extend it for site features; it's a data-seeding tool, not part of the storefront.

**Content model (implemented, verify with `wp` before assuming stale):**
- WooCommerce product categories: Vegetables, Fruits, Grains, Dairy (`wp term list product_cat`).
- Pages: Home (front page), Shop, Our Story, FAQ, Contact, plus WooCommerce-generated Cart/Checkout/My Account (`wp post list --post_type=page`).
- `tmp/page-*.html` at the repo root holds scratch/reference block markup for Home, Contact, FAQ, and Our Story — useful as a source of truth for intended page content/structure, not live output.

## Working in this codebase

- Never edit `wp-includes/` or `wp-admin/` (core) — they're overwritten on update. Extend via hooks in the theme's `functions.php` or a new plugin under `wp-content/plugins/`.
- To customize `verdant-harvest` rather than replace it, prefer editing it directly (it's already the project's own theme, not a parent/child pair) — only create a child theme if you need to preserve an upstream theme's updates.
- New themes must be block themes (`theme.json`-based), not classic PHP-template themes — matches the existing site.
- Sanitize input (`sanitize_text_field()`, `absint()`, `wp_kses_post()`) and escape output (`esc_html()`, `esc_attr()`, `esc_url()`) in any new PHP; use `$wpdb->prepare()` for dynamic queries.
- Prefer the Options/meta APIs (`get_option`/`update_option`, post/user/term meta) over raw queries.
