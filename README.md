# Cash Count

Static app, no build step.

1. Create a GitHub repo and upload everything in this folder to the root.
2. Settings > Pages > Deploy from a branch > main / (root).
3. Open the Pages URL on iPhone Safari > Share > Add to Home Screen.

## ☁️ Cloud login + sync (Firebase project `krrivats-apps`)

- Log in with a username (e.g. `admin` → `admin@krrivats.app`) or a full email. Users are created by the owner in Firebase console → Authentication → Users.
- "Continue as Guest" = try the app without an ID. Data stays only on that device.
- Data path: `apps/cashcount/users/{uid}` (profile card), `/entries`, `/bundles`, `/meta/settings`.
- The admin (`admin@krrivats.app`) gets a Users tab and can view any user's data read-only. Rules block admin edits.
- Security rules are in `firestore.rules`. Paste them in Firebase console → Firestore Database → Rules → Publish.
- The app still saves on the device first, so it works offline and syncs when online.
