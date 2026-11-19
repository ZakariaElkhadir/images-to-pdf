# Images to PDF

A browser tool that combines JPG, PNG, and WebP images into a PDF. Arrange the images before downloading. Each image fits on one A4 page, and all processing happens on your device.

## Why I built it

I needed to turn some private images into a PDF, and I wanted to keep them on my device without sending them to an online converter or an AI tool. I built Images to PDF for that job and decided to share it with students who need to turn photos of notes, scans, or assignments into a PDF while keeping their files private.

## Run locally

Open `dist/index.html` in a modern browser. Keep the `assets/`, `css/`, and `js/` folders next to it. The app works offline without dependencies or a build step.

To preview the same files over HTTP from the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Then open `http://localhost:8000`.

## Edit the app

| File | What to edit |
| --- | --- |
| `dist/index.html` | Page structure, controls, and dialogs |
| `dist/assets/logo.svg` | Header logo and browser icon |
| `dist/css/styles.css` | Colors, components, and animations |
| `dist/css/responsive.css` | Phone layout and reduced motion |
| `dist/js/app.js` | File selection, image order, and conversion flow |
| `dist/js/pdf.js` | Image encoding, A4 placement, and PDF output |
| `dist/js/i18n.js` | English, French, and Arabic strings and number formatting |
| `dist/js/language-menu.js` | Language selection, keyboard controls, and focus |
| `dist/js/preferences.js` | Saved preferences and theme setup before the page renders |
| `dist/js/feedback.js` | Sound, vibration, and interaction animations |

Use the same keys and placeholders in all three language dictionaries. Arabic uses a right-to-left layout. Sound and haptics depend on browser and device support.

## GitHub Pages

Set **Settings → Pages → Source** to **GitHub Actions**. The included workflow publishes `dist/` when site files change on `main`. You can also run it from the Actions tab. All site assets use relative paths, so the app works under a repository URL.

## License

Released under the [MIT License](LICENSE).
