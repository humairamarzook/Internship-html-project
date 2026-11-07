# Day 6 Report: React App Development and Firebase Setup

## Objective

Create a React app with Home, Registration, and About screens, then initialize Firebase for the app.

## Tasks Completed

- Confirmed Node.js (`v24.15.0`) and npm (`11.12.1`) are available.
- Created the `smart-library-app` React project with Vite.
- Built `home.js` with the Smart Library welcome page and a registration button.
- Built `registration.js` with name and email fields, and `about.js` with application information.
- Installed the Firebase JavaScript SDK.
- Created the **Smart-Library-App** Firebase project and registered the `smart-library-app` web app.
- Added `src/firebase.js` to initialize Firebase from the web configuration in the local `.env.local` file.
- Verified initialization in the browser console: `console.log(app)` displayed a `FirebaseAppImpl` object.
- Confirmed the app builds with `npm run build`.

## Outcome

The three-screen React app runs locally and initializes Firebase. The Firebase web configuration remains in `.env.local`, which is excluded from GitHub.
