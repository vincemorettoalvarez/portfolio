# Vince Moretto Álvarez portfolio

Static multi-page portfolio (HTML, CSS, JS, assets). No build step required.

**Live:** [vince.morettoalvarez.com](http://vince.morettoalvarez.com) · [GitHub Pages](https://vincemorettoalvarez.github.io/portfolio/)

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing hero (FCP timeline atmosphere + headshot) |
| `work.html` | Selected projects (courses, Weekly Watch, Talking Shop) |
| `about.html` | Interactive career timeline, credentials, craft |
| `methodology.html` | How Vince designs learning (cinematic walkthrough) |
| `css/site.css` | Shared styles |
| `js/site.js` | Case expand + About timeline interactions |
| `assets/` | Images, résumé PDF, Weekly Watch video, FCP hero background |

## Local preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

## Notes for Vince

- Degree on About: Bachelor’s in Business Management, University of Phoenix (confirmed).
- Landing hero does **not** name employer brands; company proof lives on Work / About.
- Résumé link: `assets/vince-moretto-alvarez-resume-linked.pdf`
- Contact: `mailto:vince.moretto@icloud.com`

## Deploy

Push to the `main` branch of this repo (GitHub Pages). Custom domain uses `CNAME` → `vince.morettoalvarez.com`.
