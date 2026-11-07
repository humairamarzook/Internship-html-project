# Smart Library App

A React application with Home, Registration, and About screens, built with Vite and set up to write registrations to Firebase Firestore.

## Run locally

```sh
npm install
npm run dev
```

## Firebase and Firestore setup

1. Open the [Firebase Console](https://console.firebase.google.com/) and open the **Smart-Library-App** project.
2. Add a **Web app** from the project overview and register it as `smart-library-app`.
3. Copy the Firebase web app configuration values.
4. Create `.env.local` in this folder by copying `.env.example`, then replace each placeholder with the corresponding Firebase value.
5. Restart the Vite server. Open the browser developer console and confirm that `src/firebase.js` prints the Firebase app object.
6. In **Build → Firestore Database**, create the database. The first successful registration creates the `users` collection automatically.

The registration form validates a name of at least 3 characters, a valid email address, and a 10-digit phone number. It writes `name`, `email`, `phone`, and a server timestamp to the `users` collection and displays a success message after Firestore confirms the write. A short spinner appears while the write is in progress.

Test mode makes Firestore reads and writes available without authentication while its rules are active. Use only fake test registrations in test mode, and replace the test rules before using real personal data or deploying the app.
