# Smart Library Management System

## Internship Task Report

### Day 1 – Basic PHP Web Development

#### Tasks Completed

- Created a basic web project using HTML and CSS.
- Developed an Index page.
- Created an About page.
- Created a Contact page.
- Created a Registration form.
- Practised basic PHP and web page development.

### Day 2 – PHP Form Submission and MySQL Database

#### Tasks Completed

- Set up the PHP development environment using XAMPP.
- Created a MySQL database using phpMyAdmin.
- Established a database connection using PHP.
- Developed a registration form.
- Implemented PHP form submission.
- Stored submitted form data in the MySQL database.
- Tested database insertion and form functionality.

### Day 3 – Fetch and Display Data Using PHP and MySQL

#### Tasks Completed

- Created a `view.php` page.
- Connected the display page to the MySQL database.
- Retrieved database records using SQL `SELECT` queries.
- Displayed records in an HTML table.
- Designed the table using Bootstrap.
- Implemented search functionality by name and email.
- Added table borders, striped rows, and hover effects.
- Tested database records and search functionality.

### Day 4 – Edit and Delete Records Using PHP and MySQL

#### Tasks Completed

- Added Edit and Delete actions to each registration in the admin entries page.
- Fetched a registration by its ID and displayed its existing name, email, and phone number in the edit form.
- Checked for empty fields and validated the name, email address, and 10-digit phone number.
- Saved edited details with a prepared SQL `UPDATE` query and prevented duplicate email addresses.
- Created `delete.php` to remove a registration by ID with a prepared SQL `DELETE` query, then redirect to the entries page.
- Added a confirmation prompt before deleting a registration.
- Tested fetching, validation, updating, and deleting with a temporary record; verified the saved values and confirmed the temporary record was removed from MySQL.
- Restricted edit and delete actions to the admin session and protected the requests with CSRF tokens.

### Day 5 – Form Validation, Sorting, and Responsive Layout

#### Tasks Completed

- Added real-time name validation and automatically converted names to uppercase in the registration form.
- Enforced uppercase names and name validation in PHP so the checks also apply when browser scripting is unavailable.
- Made the phone field keep digits only and enforced a 10-digit phone number on the server.
- Added ascending and descending sorting for registration name, email, and phone while preserving search results.
- Highlighted table rows on hover and kept the entries table usable on narrow screens with responsive horizontal scrolling.
- Improved the admin entries layout with Bootstrap and added a collapsible, mobile-friendly navigation bar.
- Kept the delete confirmation prompt and registration success message in place.
- Checked live name validation and phone filtering in the browser; confirmed successful registration and tested each sort order with temporary records, then removed the test records.

### Day 6 – React App Development and Firebase Setup

#### Tasks Completed

- Created the `smart-library-app` React project with Vite and confirmed Node.js and npm are available.
- Built the Home screen with the Smart Library welcome content and navigation to the registration screen.
- Built the Registration screen with required name and email fields, and the About screen with application information.
- Installed the Firebase JavaScript SDK and created a Firebase project with a registered web app.
- Added `src/firebase.js` to initialize Firebase using the web app configuration stored in the local `.env.local` file.
- Tested the initialization by confirming that `console.log(app)` displayed a `FirebaseAppImpl` object in the browser console.
- Ran `npm run build` successfully.

### Day 7 – Firestore Registration and Validation

#### Tasks Completed

- Created the default Cloud Firestore database in the Firebase Console using test mode.
- Connected the React registration form to save each registration in the `users` collection with `name`, `email`, `phone`, and a server-generated timestamp.
- Added validation for names of at least 3 characters, valid email addresses, and phone numbers containing exactly 10 digits.
- Added a saving spinner and success/error messages.
- Submitted three sample registrations, confirmed that their documents and fields appeared in Firestore, then deleted the sample documents.
- Ran the build and lint checks successfully.

#### Security Note

- Test-mode Firestore rules are for development only. Restrict database access before using real registration details or deploying the app.

