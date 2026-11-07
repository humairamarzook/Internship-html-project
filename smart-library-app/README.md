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

The Members screen lists Firestore registrations in a table with name search and name/email sorting. Each row also supports editing and deleting a member, with validation, a delete confirmation, and live table updates.

Firestore test mode makes reads and writes available without authentication. The deployment command replaces those temporary rules with `firestore.rules.template`: anyone can submit a validated registration, while only the configured administrator can view, edit, or delete members. The admin email is read from the ignored `.env.local` file and is not included in the public source.

## Firebase Hosting deployment

Hosting is configured to publish the Vite `dist` folder and route app URLs back to `index.html`.

Before publishing, enable Google as a sign-in provider in **Firebase Console → Authentication → Sign-in method**. Add `FIRESTORE_ADMIN_EMAIL=your-google-email@example.com` to `.env.local`. Keep the existing `VITE_FIREBASE_*` values in the same file.

1. Sign in to the Firebase account used by this project: `npx --yes firebase-tools@15.3.0 login`.
2. Create the Firebase Hosting site if the project does not have one yet: `npx --yes firebase-tools@15.3.0 hosting:sites:create smart-library-app-e6941`.
3. From this folder, run `npm run deploy`. This builds the React app, generates the private admin rules from the email in `.env.local`, and deploys both Hosting and Firestore rules. The first run downloads the Firebase CLI if needed.

Live site: [https://smart-library-app-e6941.web.app](https://smart-library-app-e6941.web.app). The deployed app uses the Firestore database connected to this Firebase project.
