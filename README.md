# Smart Library Management System

## Internship Task Report

### Day 1 — Front-End Development

- Built the Home, About, Contact, and Registration pages for the Smart Library website.
- Used HTML, CSS, and Bootstrap to create a consistent, responsive layout and navigation.
- Added JavaScript validation for required registration fields, email format, a 10-digit phone number, and date of birth.

### Day 2 — PHP and MySQL Registration

- Connected the registration form to a PHP form handler using `POST`.
- Added server-side checks for the submitted registration details.
- Created the `your_project_db.entries` table to store name, email, phone, gender, address, date of birth, and submission time.
- Used a prepared statement to save registrations to MySQL.

### Day 3 — Admin Entries and Duplicate Prevention

- Added an admin sign-in with session protection for the registration entries page.
- Made entries searchable by name, email, gender, phone number, address, and date of birth.
- Prevented repeat registrations for the same email in both PHP and the database.
- Cleaned duplicate registrations in the local database while keeping the earliest entry and retaining a recovery copy.

