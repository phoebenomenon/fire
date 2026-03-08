# Claude Rules

## Before making changes

- Always `ls` the target directory before adding files to it. Identify existing files that might conflict with or override the new one.

## Next.js specifics

- `favicon.ico` takes priority over `icon.svg` in browsers. If replacing the favicon with an SVG, delete `favicon.ico` first.
- Favicon file precedence in Next.js App Router: `favicon.ico` > `icon.png` > `icon.svg`

## Git / deployment

- After any file change, verify it landed on the right branch (`git status`) before assuming the deployment will pick it up.
- A PR merge only includes what was in the PR — local commits not pushed before the PR was opened are not included.
