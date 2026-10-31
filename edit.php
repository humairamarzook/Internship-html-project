<?php
declare(strict_types=1);

require_once __DIR__ . '/admin_auth.php';
require_admin();
require_once __DIR__ . '/config.php';

function redirect_to_view(string $message, string $type = 'success', string $search = ''): never
{
    $_SESSION['admin_flash'] = ['message' => $message, 'type' => $type];
    $query = $search === '' ? '' : '?search=' . rawurlencode($search);
    header('Location: view.php' . $query, true, 303);
    exit;
}

function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$id = filter_var($_GET['id'] ?? $_POST['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($id === false || $id === null) {
    redirect_to_view('The entry ID is invalid.', 'danger');
}

$search = trim((string) ($_POST['search'] ?? $_GET['search'] ?? ''));
$errors = [];
$entry = null;

try {
    $load = $conn->prepare('SELECT id, name, email, phone FROM entries WHERE id = ?');
    $load->bind_param('i', $id);
    $load->execute();
    $entry = $load->get_result()->fetch_assoc();
    $load->close();

    if (!$entry) {
        redirect_to_view('That registration was not found.', 'warning', $search);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $postedToken = (string) ($_POST['csrf_token'] ?? '');
        if ($postedToken === '' || !hash_equals(admin_csrf_token(), $postedToken)) {
            http_response_code(403);
            exit('Invalid security token. Return to the entries page and try again.');
        }

        $name = trim((string) ($_POST['name'] ?? ''));
        $name = function_exists('mb_strtoupper') ? mb_strtoupper($name, 'UTF-8') : strtoupper($name);
        $email = strtolower(trim((string) ($_POST['email'] ?? '')));
        $phone = trim((string) ($_POST['phone'] ?? ''));

        if ($name === '') {
            $errors['name'] = 'Enter a name.';
        } elseif (preg_match("/^[\\p{L}\\p{M}][\\p{L}\\p{M} .'-]*$/u", $name) !== 1) {
            $errors['name'] = 'Use letters, spaces, apostrophes, periods, or hyphens in the name.';
        } elseif ((function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') : strlen($name)) > 100) {
            $errors['name'] = 'Name must be 100 characters or fewer.';
        }

        if ($email === '') {
            $errors['email'] = 'Enter an email address.';
        } elseif (strlen($email) > 100 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $errors['email'] = 'Enter a valid email address (100 characters or fewer).';
        }

        if ($phone === '') {
            $errors['phone'] = 'Enter a phone number.';
        } elseif (preg_match('/^[0-9]{10}$/', $phone) !== 1) {
            $errors['phone'] = 'Enter a 10-digit phone number.';
        }

        if ($errors === []) {
            $update = $conn->prepare('UPDATE entries SET name = ?, email = ?, phone = ? WHERE id = ?');
            $update->bind_param('sssi', $name, $email, $phone, $id);

            try {
                $update->execute();
                $update->close();
                $conn->close();
                redirect_to_view('Registration #' . $id . ' was updated.', 'success', $search);
            } catch (mysqli_sql_exception $error) {
                $update->close();
                if ((int) $error->getCode() === 1062) {
                    $errors['email'] = 'That email address is already used by another registration.';
                } else {
                    throw $error;
                }
            }
        }

        $entry['name'] = $name;
        $entry['email'] = $email;
        $entry['phone'] = $phone;
    } elseif ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        header('Allow: GET, POST');
        exit('Method not allowed.');
    }
} catch (Throwable $error) {
    error_log('Entry update failed: ' . $error->getMessage());
    http_response_code(500);
    exit('The registration could not be loaded or updated. Please return to the entries page and try again.');
}

$backUrl = 'view.php' . ($search === '' ? '' : '?search=' . rawurlencode($search));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Edit Registration | Smart Library</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<nav class="navbar navbar-dark" style="background:#12345a">
    <div class="container">
        <a class="navbar-brand fw-bold" href="view.php">📚 Smart Library — Admin</a>
        <a class="btn btn-sm btn-outline-light" href="<?php echo escape($backUrl); ?>">Back to entries</a>
    </div>
</nav>

<main class="container py-5" style="max-width:720px">
    <h1 class="h2 mb-1">Edit registration</h1>
    <p class="text-muted mb-4">Update the name, email, and phone number for entry #<?php echo (int) $id; ?>.</p>

    <form method="POST" action="edit.php" class="card card-body shadow-sm" novalidate>
        <input type="hidden" name="id" value="<?php echo (int) $id; ?>">
        <input type="hidden" name="search" value="<?php echo escape($search); ?>">
        <input type="hidden" name="csrf_token" value="<?php echo escape(admin_csrf_token()); ?>">

        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input id="name" name="name" type="text" maxlength="100" required aria-describedby="nameFeedback"
                   class="form-control<?php echo isset($errors['name']) ? ' is-invalid' : ''; ?>"
                   value="<?php echo escape((string) $entry['name']); ?>">
            <?php if (isset($errors['name'])): ?><div class="invalid-feedback"><?php echo escape($errors['name']); ?></div><?php endif; ?>
            <div id="nameFeedback" class="form-text" aria-live="polite">Names are converted to uppercase.</div>
        </div>

        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input id="email" name="email" type="email" maxlength="100" required
                   class="form-control<?php echo isset($errors['email']) ? ' is-invalid' : ''; ?>"
                   value="<?php echo escape((string) $entry['email']); ?>">
            <?php if (isset($errors['email'])): ?><div class="invalid-feedback"><?php echo escape($errors['email']); ?></div><?php endif; ?>
        </div>

        <div class="mb-4">
            <label for="phone" class="form-label">Phone</label>
            <input id="phone" name="phone" type="tel" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" required aria-describedby="phoneFeedback"
                   class="form-control<?php echo isset($errors['phone']) ? ' is-invalid' : ''; ?>"
                   value="<?php echo escape((string) $entry['phone']); ?>">
            <?php if (isset($errors['phone'])): ?><div class="invalid-feedback"><?php echo escape($errors['phone']); ?></div><?php endif; ?>
            <div id="phoneFeedback" class="form-text" aria-live="polite">Only digits are kept.</div>
        </div>

        <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">Save changes</button>
            <a class="btn btn-outline-secondary" href="<?php echo escape($backUrl); ?>">Cancel</a>
        </div>
    </form>
</main>
<script>
(() => {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const nameFeedback = document.getElementById('nameFeedback');
    const phoneFeedback = document.getElementById('phoneFeedback');
    const namePattern = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

    nameInput.addEventListener('input', () => {
        const cursor = nameInput.selectionStart;
        const upper = nameInput.value.toLocaleUpperCase();
        if (nameInput.value !== upper) {
            nameInput.value = upper;
            if (cursor !== null) {
                const position = Math.min(cursor, nameInput.value.length);
                nameInput.setSelectionRange(position, position);
            }
        }

        const value = nameInput.value.trim();
        const error = !value
            ? 'Enter a name.'
            : (!namePattern.test(value) ? 'Use letters, spaces, apostrophes, periods, or hyphens only.' : '');
        nameInput.setCustomValidity(error);
        nameInput.classList.toggle('is-invalid', Boolean(error));
        nameInput.classList.toggle('is-valid', !error);
        nameFeedback.className = error ? 'form-text text-danger' : 'form-text text-success';
        nameFeedback.textContent = error || 'Name looks good and is uppercase.';
    });

    phoneInput.addEventListener('input', () => {
        const digits = phoneInput.value.replace(/[^0-9]/g, '').slice(0, 10);
        phoneInput.value = digits;
        const error = digits.length === 10 ? '' : 'Enter exactly 10 digits.';
        phoneInput.setCustomValidity(error);
        phoneInput.classList.toggle('is-invalid', Boolean(error));
        phoneInput.classList.toggle('is-valid', !error);
        phoneFeedback.className = error ? 'form-text text-danger' : 'form-text text-success';
        phoneFeedback.textContent = error || 'Phone number contains digits only.';
    });
})();
</script>
</body>
</html>
