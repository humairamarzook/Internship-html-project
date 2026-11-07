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

### Day 6 – React App and Firebase Setup

#### Tasks Completed

- Created the Smart Library React app using Vite and installed the Firebase SDK.
- Built the Home, Registration, and About screens and added navigation between them.
- Set up the Firebase project and registered the Smart Library web app.
- Initialized Firebase in `src/firebase.js` and verified the connection by logging the Firebase app object in the browser console.

### Day 7 – Firestore Registration and Form Validation

#### Tasks Completed

- Created the Cloud Firestore database and the `users` collection.
- Connected the registration form to Firestore to save each member's name, email, phone number, and server timestamp.
- Added form validation for names of at least 3 characters, valid email addresses, and phone numbers containing exactly 10 digits.
- Added a loading spinner while saving and a success message after a registration is saved; the form clears after success.
- Submitted multiple sample registrations and confirmed they appeared as separate documents in the `users` collection, then cleared the sample records.

### Day 8 – Firestore User List, Search, and Sorting

#### Tasks Completed

- Reviewed the Firebase setup and confirmed the Firebase SDK was already installed in the React app.
- Created `userlist.js` to fetch registered users from the Firestore `users` collection in real time.
- Displayed each registered user's name, email address, and phone number in a table.
- Added name search and clickable alphabetical sorting for the name and email columns.
- Added loading, empty-list, and Firestore error messages, and linked the member list from the app navigation and home screen.
- Built the React app successfully with Vite.

