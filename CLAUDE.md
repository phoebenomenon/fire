# Claude Rules — FIRE project

## Next.js specifics

- `favicon.ico` takes priority over `icon.svg` in browsers. If replacing the favicon with an SVG, delete `favicon.ico` first.
- Favicon file precedence in Next.js App Router: `favicon.ico` > `icon.png` > `icon.svg`
- SVG favicons are not reliably supported in Chrome. Always generate a `favicon.ico` from the SVG using `sharp` and commit that instead.
