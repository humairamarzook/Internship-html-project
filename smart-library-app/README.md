# Smart Library App

A React application with Home, Registration, and About screens, scaffolded with Vite and prepared for Firebase.

## Run locally

```sh
npm install
npm run dev
```

## Firebase setup

1. Open the [Firebase Console](https://console.firebase.google.com/) and create a project named **Smart Library App**.
2. Add a **Web app** from the project overview and register it as `smart-library-app`.
3. Copy the Firebase web app configuration values.
4. Create `.env.local` in this folder by copying `.env.example`, then replace each placeholder with the corresponding Firebase value.
5. Restart the Vite server. Open the browser developer console and confirm that `src/firebase.js` prints the Firebase app object.

The registration form currently demonstrates client-side handling. To store registrations in Firebase, enable a service such as Cloud Firestore and connect the form to it.
