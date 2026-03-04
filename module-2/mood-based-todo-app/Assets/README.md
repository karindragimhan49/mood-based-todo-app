# Assets

Place your icon files and screenshot images here.

## Recommended assets

- `screenshot-dashboard.png` — dashboard preview (reference in README.md)
- `favicon.svg` — SVG favicon (link from `<head>` in all HTML files)
- `icon-check.svg` — standalone check icon if needed

## Favicon example

Add to each HTML `<head>`:

```html
<link rel="icon" type="image/svg+xml" href="../Assets/favicon.svg" />
```

SVG favicon source (paste into `favicon.svg`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#161c27"/>
  <circle cx="16" cy="16" r="12" fill="none" stroke="#a3ff12" stroke-width="2.5"/>
  <path d="M10 17l3.5 3.5L22 12" stroke="#a3ff12" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
```
