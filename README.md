# Organic Shop — WordPress + WooCommerce

**Live Demo:** [organic-shop.wordpress.com](https://organic-shop.wordpress.com)

A modern e-commerce store rebuilt from a legacy CodeIgniter 3 application to WordPress + WooCommerce using AI-accelerated development practices.

---

## Project Overview

### Original Project
This is a portfolio rebuild of my [Organic Shop CodeIgniter app](https://github.com/charlesalo/organic-shop) — originally built as a full-stack bootcamp capstone with vanilla PHP, MySQL, and CodeIgniter 3.

### Why Rebuild to WordPress?
1. **Modern platform** — WordPress + WooCommerce is industry standard for e-commerce
2. **Learn WordPress architecture** — Understanding theme hierarchy, hooks, block themes
3. **AI-accelerated workflow** — Demonstrate modern development: AI → review → iterate
4. **Portfolio strength** — Shows ability to migrate legacy apps to modern stacks

### Development Approach
Built using **WordPress Studio** + **Studio Code** (AI-assisted theme generation):
- Described requirements in natural language
- Studio Code generated custom block theme + WooCommerce integration
- Validated block markup with `validate_blocks`
- Deployed to wordpress.com free tier

This demonstrates the **future of WordPress development**: humans for strategy/review, AI for code generation.

---

## Tech Stack

**Core:**
- WordPress (latest)
- WooCommerce (online store)
- Custom block theme: "Verdant Harvest"

**Design:**
- Display serif: Fraunces (headings)
- Body serif: DM Sans (typography)
- Color palette: Parchment, forest green, terracotta, sage
- Animations: Scroll-reveal, sticky glassy header, marquee
- Accessibility: Respects `prefers-reduced-motion`

**Extensions:**
- Jetpack (forms, newsletter, contact)
- Yoast SEO (optional)

**Deployment:**
- WordPress.com (free tier)
- Local development: WordPress Studio

---

## Project Structure

```
organic-shop/
├── wp-content/
│   ├── themes/
│   │   └── verdant-harvest/        # Custom block theme
│   │       ├── theme.json          # Block theme settings
│   │       ├── templates/          # Block templates
│   │       ├── parts/              # Block template parts
│   │       └── styles/             # Custom CSS
│   └── plugins/
│       └── (WooCommerce, Jetpack, etc.)
├── CLAUDE.md                        # AI dev workflow & requirements
├── README.md                        # This file
└── .gitignore                       # Git version control rules
```

---

## Features

### Homepage
- Full-width hero section with CTA
- Featured products grid (6 items, 3 columns)
- Product categories section (Vegetables, Fruits, Grains, Dairy)
- Trust marquee (scrolling certifications)
- Customer testimonials carousel
- Newsletter signup (Jetpack Forms)
- Farm story with stats

### Product Catalog
- **8 products** with real imagery:
  - Vegetables: Curly Kale, Rainbow Carrots
  - Fruits: Honeycrisp Apples, Garden Strawberries
  - Grains: White Quinoa, Steel-Cut Oats
  - Dairy: Grass-Fed Milk, Farmhouse Cheddar

- **Product attributes:**
  - Organic Certified (yes/no)
  - Source Region (dropdown)
  - Harvest Date (for produce)

- **Product pages:**
  - Hero image + thumbnail gallery
  - Price, description, stock status
  - Customer reviews & ratings
  - Related products (3-4 items by category)
  - Add-to-cart with quantity selector

### Shop Experience
- Product grid with filters (category, sorting)
- Shopping cart (persistent)
- Checkout flow (WooCommerce default, customizable)
- Order history (My Account page)
- Email notifications

### Additional Pages
- **Our Story** — About the farm
- **Contact** — Jetpack contact form
- **FAQ** — Common questions
- All pages styled with Verdant Harvest theme

---

## Local Development Setup

### Prerequisites
- macOS, Windows, or Linux
- [WordPress Studio](https://developer.wordpress.com/studio/download/) installed

### Steps

1. **Launch WordPress Studio**
   ```bash
   # Open WordPress Studio app
   # Click "Add Site" → Name: "Organic Shop"
   # Studio creates full WordPress installation in seconds
   ```

2. **Open in VS Code**
   ```bash
   # Find where Studio saved the site (usually ~/wp-studio-sites/organic-shop/)
   code ~/wp-studio-sites/organic-shop
   ```

3. **Access WordPress Admin**
   - In Studio app: Click "WP Admin"
   - Auto-login (no credentials needed for local sites)

4. **Preview Site**
   - In Studio app: Click "Open local site"
   - Or visit provided local URL (e.g., https://organic-shop.local/)

5. **Make Changes**
   - Edit theme files in `wp-content/themes/verdant-harvest/`
   - Or use WordPress block editor for content
   - Use Studio Code (in Studio app) for AI-assisted theme updates

---

## Theme Customization

The Verdant Harvest theme uses WordPress block theme architecture (theme.json + block templates):

### Key Files

**`wp-content/themes/verdant-harvest/theme.json`**
- Design tokens (colors, typography, spacing)
- Block editor settings
- Global styles

**`wp-content/themes/verdant-harvest/templates/`**
- `index.html` — Main template
- `home.html` — Homepage
- `single-product.html` — Product detail page
- `archive-product.html` — Shop listing
- `page.html` — Standard pages

**`wp-content/themes/verdant-harvest/parts/`**
- `header.html` — Sticky header
- `footer.html` — Footer with links
- `product-grid.html` — Reusable product loop

### Modify Colors
Edit `theme.json`:
```json
"color": {
  "palette": [
    {
      "slug": "parchment",
      "color": "#f5f3ef",
      "name": "Parchment"
    }
  ]
}
```

### Add Custom CSS
Create `wp-content/themes/verdant-harvest/style.css` or add to theme.json `customCSS` field.

### Use Studio Code for Updates
In WordPress Studio, click "Studio Code" tab and describe what you want:
> "Change the hero button color from terracotta to forest green"

Studio Code regenerates the affected blocks.

---

## Deployment to WordPress.com

### Option A: Free Tier (Current)
1. In WordPress Studio: Click **Publish site**
2. Select WordPress.com
3. Get live URL: `organic-shop.wordpress.com`
4. Share with employers / interviewers

**Pros:**
- Free
- Transparent tech stack
- No setup needed
- Shows WordPress.com expertise

**Cons:**
- Shows WordPress.com branding
- Ads displayed to visitors (acceptable for demo)

### Option B: Custom Domain
1. Own `chavbuilds.com` ✅
2. Upgrade to WordPress.com Personal plan ($4/month)
3. Point DNS: `organic-shop.chavbuilds.com` → WordPress.com
4. Deploy via Studio Sync

**Cost:** ~$48/year  
**Benefit:** Professional branding

---

## Version Control (Git)

### Initialize Repository
```bash
cd ~/wp-studio-sites/organic-shop
git init
git add CLAUDE.md .gitignore wp-content/themes/verdant-harvest/
git commit -m "Initial Organic Shop WordPress setup: Verdant Harvest theme, WooCommerce catalog"
git remote add origin https://github.com/charlesalo/organic-shop-wordpress.git
git push -u origin main
```

### What's Tracked
✅ Custom theme code (`wp-content/themes/verdant-harvest/`)  
✅ Documentation (CLAUDE.md, README.md)  
❌ WordPress core (auto-updates)  
❌ Third-party plugins (installed via WordPress admin)  
❌ Media files (on CDN)  
❌ Database (WordPress.com managed)

See `.gitignore` for full rules.

### Workflow
```bash
# After theme changes:
git add wp-content/themes/verdant-harvest/
git commit -m "feat: add product attribute filters to shop page"
git push

# Before deploying to WordPress.com:
git tag -a v1.0.0 -m "Production deployment"
git push origin v1.0.0
```

---

## Key Learnings & Documentation

See **[CLAUDE.md](./CLAUDE.md)** for:
- Original project context & requirements
- AI-assisted development workflow
- Product structure & catalog details
- Build order & approach
- Outstanding issues (mobile optimization)

This file documents:
- **What was built** — Features, design, WooCommerce setup
- **How it was built** — Studio Code workflow
- **Why choices were made** — WordPress platform, theme architecture
- **Next iterations** — Mobile fixes, attribute enhancements

---

## Known Issues & Next Steps

### Outstanding
- [ ] Mobile responsiveness needs refinement (product grid stacking, button sizing)
- [ ] Add WooCommerce Stripe integration for payment processing
- [ ] Implement product reviews moderation
- [ ] Add email marketing automation (Mailchimp/Klaviyo)

### Future Enhancements
- [ ] Implement seasonal collections (limited editions)
- [ ] Add sustainability report generator
- [ ] Customer loyalty program
- [ ] Subscription box option
- [ ] Analytics dashboard (sales, traffic, trending products)

### Performance Optimization
- [ ] Image CDN integration (Cloudflare R2)
- [ ] Lazy loading for product galleries
- [ ] Cache strategy (page + object caching)
- [ ] Core Web Vitals optimization

---

## How to Contribute (if forked)

1. **Fork the repo**
   ```bash
   git clone https://github.com/charlesalo/organic-shop-wordpress.git
   cd organic-shop-wordpress
   ```

2. **Set up locally**
   - Download WordPress Studio
   - Import theme files from `wp-content/themes/verdant-harvest/`
   - Install WooCommerce plugin

3. **Make changes**
   - Edit theme files
   - Test in local WordPress admin
   - Use Studio Code for complex updates

4. **Test & validate**
   ```bash
   # Validate block markup
   wp eval-file wp-content/themes/verdant-harvest/validate-blocks.php
   ```

5. **Submit pull request**
   - Reference issue number
   - Describe changes in detail
   - Include before/after screenshots if design changes

---

## Deployment Checklist

Before going live:

- [ ] Test all product pages (add to cart, checkout flow)
- [ ] Verify mobile responsiveness (375px, 768px, 1200px)
- [ ] Check WooCommerce settings (shipping, tax, payment)
- [ ] Review product images (alt text, file sizes)
- [ ] Test email notifications (order confirmation, admin alerts)
- [ ] Set up SSL/HTTPS
- [ ] Configure email delivery (Jetpack or SMTP)
- [ ] Test contact forms (Jetpack)
- [ ] Review footer links & policies
- [ ] SEO audit (Yoast)

---

## Stack Decisions: Why WordPress?

**Chosen over:**
- **Next.js/Shopify** — WordPress is industry standard for small-medium e-commerce
- **Staying with CodeIgniter** — No built-in e-commerce, poor plugin ecosystem
- **Headless CMS** — Overkill for this scope; WordPress.com provides instant hosting

**Why WordPress.com for deployment:**
- Zero infrastructure management
- Built-in security, backups, SSL
- Automatic WordPress core updates
- Jetpack included (forms, email, analytics)
- Transparent about tech stack (good for portfolio)

---

## Resources

- **WordPress Block Theme Docs:** https://developer.wordpress.org/block-editor/getting-started/create-block-theme/
- **WooCommerce Developer:** https://developer.woocommerce.com/
- **WordPress Studio Guide:** https://developer.wordpress.com/docs/developer-tools/studio/
- **Jetpack Docs:** https://jetpack.com/support/

---

## Contact & Questions

- **Portfolio:** [chavbuilds.com](https://chavbuilds.com)
- **GitHub:** [@charlesalo](https://github.com/charlesalo)
- **Email:** [charlesmsjalo@chavbuilds.com]

---

**Built with WordPress Studio + Claude Code**  
*AI-accelerated development for modern WordPress*

Last updated: July 11, 2026