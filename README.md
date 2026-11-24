# My 30-Day Lifestyle Tracker & Journal (PWA)

An offline-first Progressive Web App (PWA) for tracking daily habits, mandatory reading streaks, physical fitness progress photos, digital scrapbook memories, and 30-day analytics—stored 100% privately on your device.

## Included Files
- `index.html` — Complete 30-Day Lifestyle Journal & Habit Tracker application with the **My Fitness Journey** section and live local save-status indicator.
- `manifest.json` — PWA manifest enabling home-screen installation on Android, iOS, and desktop browsers.
- `service-worker.js` — Offline caching worker so the app loads and works without internet access.
- `offline-engine.js` — Built-in offline fallback renderer for charts and CSV/spreadsheet exports when offline.
- `icons/icon-192.png` & `icons/icon-512.png` — App icons for home-screen installation.

## How to Run & Install as an App
1. **Extract** this ZIP folder to a directory on your computer or phone.
2. **Serve over HTTP/HTTPS** (required by browsers for Service Workers & PWA install):
   - **VS Code:** Right-click `index.html` → **Open with Live Server**.
   - **Python:** Run `python3 -m http.server 8080` inside the extracted folder, then open `http://localhost:8080`.
   - **Free Static Hosting:** Drag and drop the extracted folder onto Netlify Drop, GitHub Pages, or Vercel to access and install it on your phone.
3. **Install on Mobile / Desktop:**
   - **Android (Chrome):** Tap the **+ Install App** badge in the top bar or browser menu → **Install app**.
   - **iPhone / iPad (Safari):** Tap **Share** → **Add to Home Screen**.
   - **Desktop (Chrome / Edge):** Click the install icon in the address bar.

## Data Privacy & Backups
All habit logs, journal entries, scrapbook photos, and **My Fitness Journey** progress check-ins are stored locally inside your browser's `localStorage` and `IndexedDB`. Use **Settings → Export JSON Backup** anytime to save a complete portable backup (including all photos).
