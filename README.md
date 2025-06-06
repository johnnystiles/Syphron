# Syphron

Syphron is a prototype DeFi web application demonstrating an AI assisted yield optimizer. The project contains a static website written in HTML, CSS and JavaScript with simple Web3 integration for minting the SYPH token and connecting a wallet.

## Running locally

Serve the site with any static web server. One quick option is using `http-server`:

```bash
npx http-server
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

## Deployment

This repository uses GitHub Pages for deployment. A GitHub Actions workflow located in `.github/workflows/pages.yml` publishes the content of the repository whenever changes are pushed to the `main` branch. The deployed site will be available via GitHub Pages or the custom domain specified in the `CNAME` file.


