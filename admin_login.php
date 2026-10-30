<?php
declare(strict_types=1);

require_once __DIR__ . '/admin_auth.php';

if (!empty($_SESSION['is_admin'])) {
    header('Location: view.php');
    exit;
}

$configPath = __DIR__ . '/admin_config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    exit('Admin login is not configured on this computer.');
}

$adminConfig = require $configPath;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postedToken = $_POST['csrf_token'] ?? '';
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!is_string($postedToken) || !hash_equals(admin_csrf_token(), $postedToken)) {
        $error = 'Your session expired. Please try again.';
    } elseif (
        is_string($username)
        && is_string($password)
        && hash_equals((string) $adminConfig['username'], trim($username))
        && password_verify($password, (string) $adminConfig['password_hash'])
    ) {
        session_regenerate_id(true);
        $_SESSION['is_admin'] = true;
        $_SESSION['admin_username'] = trim($username);
        $_SESSION['admin_last_activity'] = time();
        header('Location: view.php');
        exit;
    } else {
        $error = 'Username or password is incorrect.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Sign In | Smart Library</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<main class="container py-5" style="max-width: 520px">
    <div class="card shadow-sm border-0 p-4">
        <h1 class="h3 mb-2">Admin sign in</h1>
        <p class="text-secondary">Sign in to view library registrations.</p>

        <?php if ($error !== ''): ?>
            <div class="alert alert-danger" role="alert"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
        <?php endif; ?>

        <form method="POST" action="admin_login.php">
            <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars(admin_csrf_token(), ENT_QUOTES, 'UTF-8'); ?>">
            <div class="mb-3">
                <label for="username" class="form-label">Admin username</label>
                <input class="form-control" id="username" name="username" autocomplete="username" required autofocus>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input class="form-control" type="password" id="password" name="password" autocomplete="current-password" required>
            </div>
            <button class="btn btn-primary w-100" type="submit">Sign in</button>
        </form>
        <a class="btn btn-link mt-3" href="index.html">Back to home</a>
    </div>
</main>
</body>
</html>
