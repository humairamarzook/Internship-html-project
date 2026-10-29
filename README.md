# Internship-html-project
My first internship project

## Run locally with XAMPP

1. Place this project folder under XAMPP's `htdocs` directory.
2. Start Apache and MySQL in the XAMPP Control Panel.
3. For a fresh database, import `database.sql` in phpMyAdmin. It creates the `your_project_db` database and the `entries` table.
4. If your MySQL username or password differs, update the connection values in `config.php`.
5. Open `http://localhost/Internship-projects/registration.html` and submit the registration form.

The registration handler stores name, email, phone, gender, address, and date of birth in `your_project_db.entries`.
