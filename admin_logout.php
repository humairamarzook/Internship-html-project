<?php
declare(strict_types=1);

require_once __DIR__ . '/admin_auth.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: view.php');
    exit;
}

$postedToken = $_POST['csrf_token'] ?? '';
if (!is_string($postedToken) || !hash_equals(admin_csrf_token(), $postedToken)) {
    http_response_code(400);
    exit('Invalid sign-out request. Please return to the entries page and try again.');
}

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $cookie = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 42000,
        'path' => $cookie['path'],
        'domain' => $cookie['domain'],
        'secure' => $cookie['secure'],
        'httponly' => $cookie['httponly'],
        'samesite' => 'Lax',
    ]);
}

session_destroy();
header('Location: admin_login.php?logged_out=1');
exit;
