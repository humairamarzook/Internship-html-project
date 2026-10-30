<?php
declare(strict_types=1);

require_once __DIR__ . '/admin_auth.php';
require_admin();
require_once __DIR__ . '/config.php';

function redirect_to_entries(string $message, string $type = 'success', string $search = ''): never
{
    $_SESSION['admin_flash'] = ['message' => $message, 'type' => $type];
    $query = $search === '' ? '' : '?search=' . rawurlencode($search);
    header('Location: view.php' . $query, true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect_to_entries('Use the Delete button on an entry to remove it.', 'warning');
}

$postedToken = (string) ($_POST['csrf_token'] ?? '');
if ($postedToken === '' || !hash_equals(admin_csrf_token(), $postedToken)) {
    http_response_code(403);
    exit('Invalid security token. Return to the entries page and try again.');
}

$id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($id === false || $id === null) {
    redirect_to_entries('The entry ID is invalid.', 'danger');
}

$search = trim((string) ($_POST['search'] ?? ''));

try {
    $stmt = $conn->prepare('DELETE FROM entries WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $deleted = $stmt->affected_rows;
    $stmt->close();
    $conn->close();

    if ($deleted === 1) {
        redirect_to_entries('Registration #' . $id . ' was deleted.', 'success', $search);
    }

    redirect_to_entries('That registration was not found; no record was deleted.', 'warning', $search);
} catch (Throwable $error) {
    error_log('Entry deletion failed: ' . $error->getMessage());
    redirect_to_entries('The registration could not be deleted. Please try again.', 'danger', $search);
}
