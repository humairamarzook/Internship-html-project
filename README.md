# Internship-html-project
My first internship project

## Front-end report

The first task built the Smart Library website interface for visitors and prospective members.

### Pages and interface work

- **Home:** introduces the Smart Library.
- **About:** presents information about the library.
- **Contact:** provides the contact form interface.
- **Member Registration:** collects name, email, phone, gender, address, and date of birth.
- Shared responsive navigation connects the pages. The layout uses HTML, custom CSS, and Bootstrap 5.

### Form validation

JavaScript checks the registration form before it is submitted. It checks required fields, email format, a 10-digit phone number, and that the date of birth is not in the future. Invalid fields receive browser validation messages. The PHP handler repeats the validation on the server before saving the registration.

## Run locally with XAMPP

1. Place this project folder under XAMPP's `htdocs` directory.
2. Start Apache and MySQL in the XAMPP Control Panel.
3. For a fresh database, import `database.sql` in phpMyAdmin. It creates the `your_project_db` database and the `entries` table.
4. If your MySQL username or password differs, update the connection values in `config.php`.
5. Open `http://localhost/Internship-projects/registration.html` and submit the registration form.

The registration handler stores name, email, phone, gender, address, and date of birth in `your_project_db.entries`.
