<?php
require_once __DIR__ . '/config.php';

function showMessage($title, $message, $statusCode = 200)
{
    http_response_code($statusCode);

    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $alertType = $statusCode >= 400 ? 'danger' : 'success';

    echo '<!doctype html>';
    echo '<html lang="en"><head><meta charset="UTF-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
    echo '<title>' . $safeTitle . ' | Smart Library</title>';
    echo '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">';
    echo '</head><body class="bg-light">';
    echo '<main class="container py-5"><div class="alert alert-' . $alertType . '" role="alert">';
    echo '<h1 class="h4">' . $safeTitle . '</h1><p class="mb-0">' . $safeMessage . '</p></div>';
    echo '<a class="btn btn-primary" href="registration.html">Back to registration</a></main>';
    echo '</body></html>';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    showMessage('Registration required', 'Please submit the registration form first.', 405);
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$gender = trim($_POST['gender'] ?? '');
$address = trim($_POST['address'] ?? '');
$dob = trim($_POST['dob'] ?? '');

if ($name === '' || $email === '' || $phone === '' || $gender === '' || $address === '' || $dob === '') {
    showMessage('Missing information', 'Please complete every field in the registration form.', 400);
}

if (strlen($name) > 100 || strlen($email) > 100 || strlen($address) > 1000) {
    showMessage('Input is too long', 'Please shorten your name, email, or address and try again.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    showMessage('Invalid email', 'Enter a valid email address and try again.', 400);
}

if (!preg_match('/^[0-9]{10}$/', $phone)) {
    showMessage('Invalid phone number', 'Enter a 10-digit phone number.', 400);
}

$allowedGenders = ['male', 'female', 'other', 'prefer-not-to-say'];
if (!in_array($gender, $allowedGenders, true)) {
    showMessage('Invalid gender selection', 'Select one of the available gender options.', 400);
}

$dobDate = DateTimeImmutable::createFromFormat('!Y-m-d', $dob);
$dateErrors = DateTimeImmutable::getLastErrors();
$hasDateErrors = $dateErrors !== false
    && ($dateErrors['warning_count'] > 0 || $dateErrors['error_count'] > 0);

if ($dobDate === false || $hasDateErrors || $dobDate->format('Y-m-d') !== $dob) {
    showMessage('Invalid date of birth', 'Enter a valid date of birth.', 400);
}

if ($dobDate > new DateTimeImmutable('today')) {
    showMessage('Invalid date of birth', 'Date of birth cannot be in the future.', 400);
}

try {
    $stmt = $conn->prepare(
        'INSERT INTO entries (name, email, phone, gender, address, dob)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->bind_param('ssssss', $name, $email, $phone, $gender, $address, $dob);
    $stmt->execute();
    $stmt->close();
    $conn->close();
} catch (Throwable $error) {
    error_log('Registration save failed: ' . $error->getMessage());
    showMessage('Registration not saved', 'We could not save your registration. Please try again.', 500);
}

showMessage('Registration successful', 'Your details have been saved to the Smart Library database.');
?>
