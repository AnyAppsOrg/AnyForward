<h1 align="center">
  <img src="img/favicon.svg" alt="AnyForward Logo" width="120" />
  <br/>
  AnyForward Website
</h1>

<p align="center">
  <strong>The official showcase website for the AnyForward Android application.</strong>
</p>

## Overview

This repository contains the source code for the AnyForward website. It serves as the landing page to showcase features, provide download links, and offer support for the AnyForward SMS & Call forwarding Android app.

**Live Website:** [https://anyappsorg.github.io/AnyForward](https://anyappsorg.github.io/AnyForward)

## Features

- **Single Page Application (SPA):** Fast, JavaScript-driven tab navigation without page reloads.
- **Internationalization (i18n):** Fully translated into English and French.
- **Dark Mode:** Clean, modern dark theme enabled by default with a light mode toggle.
- **Responsive Design:** Mobile-first layout with smooth transitions and optimized typography.
- **AJAX Contact Form:** Built-in contact form powered by FormSubmit with toast notifications.

## Tech Stack

- Semantic HTML5
- Vanilla CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript (No frameworks or external dependencies)

## Project Structure

```text
├── css/              # Stylesheets
├── img/              # Images and icons
├── js/               # JavaScript (main.js, i18n.js)
└── index.html        # Main entry point
```

## Local Development

Since this project uses plain HTML, CSS, and JS without a build step, you can run it locally with any simple HTTP server:

1. Clone the repository.
2. Serve the directory (e.g., using `npx serve`, Python's `http.server`, or VS Code Live Server).
3. Open `http://localhost:<port>` in your browser.

## License

© 2026 AnyForward.
