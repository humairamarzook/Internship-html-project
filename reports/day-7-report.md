# Day 7 Report: Firestore Registration, Validation, and Testing

## Objective

Create a Firestore database and connect the React registration form so member details are validated and saved.

## Tasks Completed

- Created the default Cloud Firestore database in the **Smart-Library-App** Firebase project using test mode.
- Connected the registration form to save `name`, `email`, `phone`, and a server-generated `timestamp` in the `users` collection.
- Added validation for names of at least 3 characters, valid email addresses, and phone numbers containing exactly 10 digits.
- Added a saving spinner and success/error messages.
- Submitted three sample registrations and verified that their documents and fields appeared in Firestore.
- Deleted the sample registration documents after verification.
- Confirmed the app builds and passes lint checks.

## Security Note

Test-mode Firestore rules are for development only and allow access without authentication while active. Restrict the rules before using real registration details or deploying the app.
