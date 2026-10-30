<?php
declare(strict_types=1);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name('smart_library_admin');
    $scriptDirectory = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
    $cookiePath = $scriptDirectory === '/' ? '/' : rtrim($scriptDirectory, '/') . '/';

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => $cookiePath,
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function admin_csrf_token(): string
{
    if (empty($_SESSION['admin_csrf_token'])) {
        $_SESSION['admin_csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['admin_csrf_token'];
}

function require_admin(): void
{
    $lastActivity = (int) ($_SESSION['admin_last_activity'] ?? 0);
    $sessionExpired = $lastActivity > 0 && (time() - $lastActivity) > 1800;

    if (empty($_SESSION['is_admin']) || $sessionExpired) {
        $_SESSION = [];
        session_destroy();
        header('Location: admin_login.php');
        exit;
    }

    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    $_SESSION['admin_last_activity'] = time();
}
