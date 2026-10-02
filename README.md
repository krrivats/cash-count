# Cash Count

Mobile-first cash denomination calculator and daily cash collection tracker.

## GitHub Pages

This project is configured for a repository named `cash-count`.

- Vite base path: `/cash-count/`
- Deployment: `.github/workflows/deploy.yml`
- Storage: browser localStorage only
- No backend/database required

After pushing to the `main` branch:
1. GitHub → Settings → Pages
2. Set Source to **GitHub Actions**
3. Check the **Actions** tab for the deployment
4. Open `https://YOUR-USERNAME.github.io/cash-count/`

If the repository name is changed, update `base` in `vite.config.ts` and the favicon path in `index.html`.
