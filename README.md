# Personal Resume Website

A personal resume website built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com).

## Project Overview

This website showcases my professional background, skills, and project experience, providing a platform for potential employers or clients to learn about my professional capabilities.

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Deployment**: [Vercel](https://vercel.com)

## Local Development

### Requirements

- Node.js 22 or newer
- npm 10 or newer
- A local Chromium-based browser for PDF export in development

Supported local browser paths are configured in [`src/lib/pdfBrowser.ts`](/Users/cuinspace/2025-intern-resume/src/lib/pdfBrowser.ts). If your browser is installed elsewhere, set `CHROMIUM_PATH` before starting the app.

Example:

```bash
export CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

This project uses port `3005` in development. Open [http://localhost:3005](http://localhost:3005).

### Start the production server locally

Build first:

```bash
npm run build
```

Then start the app:

```bash
npm start
```

By default, `next start` uses port `3000`. To run on another port:

```bash
npm start -- --hostname 127.0.0.1 --port 3010
```

### PDF export

The `Export PDF` button now uses a server-side route at `/api/resume-pdf`.

- In local development, the route launches your local Chromium/Chrome executable.
- In Vercel, the route uses `@sparticuz/chromium`.
- The exported PDF preserves selectable text and clickable links.
- The exported PDF is generated in light theme and follows the current locale (`/en` or `/zh`).

## Project Structure

- `src/app/` - App Router pages and API routes
- `src/components/` - Reusable UI components
- `src/lib/` - Shared runtime helpers such as PDF browser launch
- `public/` - Static assets

## Customization

You can modify the homepage content by editing [`src/app/[locale]/page.tsx`](/Users/cuinspace/2025-intern-resume/src/app/[locale]/page.tsx). The website auto-updates as you edit the file.

## Deployment

This project is configured to be deployed on Vercel. Each push to the main branch will automatically deploy the latest version.

Visit [https://your-resume-website.vercel.app](https://your-resume-website.vercel.app) to view the live version.

## License

[MIT](LICENSE)
