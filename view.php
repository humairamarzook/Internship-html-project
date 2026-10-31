<?php
require_once __DIR__ . '/admin_auth.php';
require_admin();
require_once __DIR__ . '/config.php';

$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$sortColumns = ['id' => 'id', 'name' => 'name', 'email' => 'email', 'phone' => 'phone'];
$requestedSort = $_GET['sort'] ?? 'id';
$sort = is_string($requestedSort) ? $requestedSort : 'id';
if (!array_key_exists($sort, $sortColumns)) {
    $sort = 'id';
}
$requestedDirection = $_GET['direction'] ?? ($sort === 'id' ? 'desc' : 'asc');
$direction = is_string($requestedDirection) ? strtolower($requestedDirection) : ($sort === 'id' ? 'desc' : 'asc');
if (!in_array($direction, ['asc', 'desc'], true)) {
    $direction = $sort === 'id' ? 'desc' : 'asc';
}
$sqlDirection = strtoupper($direction);
$sortUrl = static function (string $column) use ($search, $sort, $direction): string {
    $nextDirection = $sort === $column && $direction === 'asc' ? 'desc' : 'asc';
    $query = ['sort' => $column, 'direction' => $nextDirection];
    if ($search !== '') {
        $query['search'] = $search;
    }

    return 'view.php?' . http_build_query($query);
};
$sortMarker = static function (string $column) use ($sort, $direction): string {
    return $sort === $column ? ($direction === 'asc' ? ' ↑' : ' ↓') : ' ↕';
};

$sql = "SELECT * FROM entries
        WHERE name LIKE ?
        OR email LIKE ?
        OR gender LIKE ?
        OR phone LIKE ?
        OR address LIKE ?
        OR CAST(dob AS CHAR) LIKE ?
        ORDER BY `" . $sortColumns[$sort] . "` " . $sqlDirection
        . ($sort === 'id' ? '' : ', id DESC');

$stmt = $conn->prepare($sql);

$searchTerm = "%" . $search . "%";
$stmt->bind_param(
    "ssssss",
    $searchTerm,
    $searchTerm,
    $searchTerm,
    $searchTerm,
    $searchTerm,
    $searchTerm
);
$stmt->execute();

$result = $stmt->get_result();
$flash = $_SESSION['admin_flash'] ?? null;
unset($_SESSION['admin_flash']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>View Entries</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet">
    <style>
        .entries-table { min-width: 980px; }
        .entries-table th a { color: inherit; text-decoration: none; white-space: nowrap; }
        .entries-table th a:hover, .entries-table th a:focus { text-decoration: underline; }
        .table-hover > tbody > tr:hover > * {
            --bs-table-bg-state: #e4efff;
            --bs-table-color-state: #12345a;
        }
        @media (max-width: 575.98px) {
            .page-content { padding-top: 1.25rem !important; }
            .search-controls .btn { min-height: 44px; }
        }
    </style>
</head>

<body class="bg-light">

<nav class="navbar navbar-expand-lg navbar-dark" style="background:#12345a">
    <div class="container">
        <a class="navbar-brand fw-bold" href="index.html">📚 Smart Library</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#adminNavbar" aria-controls="adminNavbar"
                aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="adminNavbar">
            <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="registration.html">Registration</a></li>
                <li class="nav-item"><a class="nav-link active" aria-current="page" href="view.php">View Entries</a></li>
            </ul>
            <div class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 mt-3 mt-lg-0 ms-lg-3">
                <span class="navbar-text text-white"><?php echo htmlspecialchars((string) $_SESSION['admin_username'], ENT_QUOTES, 'UTF-8'); ?></span>
                <form method="POST" action="admin_logout.php" class="d-flex">
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars(admin_csrf_token(), ENT_QUOTES, 'UTF-8'); ?>">
                    <button class="btn btn-sm btn-outline-light" type="submit">Sign out</button>
                </form>
            </div>
        </div>
    </div>
</nav>

<main class="container page-content py-4 py-lg-5">

    <h2 class="mb-4">All Entries</h2>

    <?php if (is_array($flash) && isset($flash['message'])): ?>
        <?php $flashType = in_array($flash['type'] ?? '', ['success', 'warning', 'danger'], true) ? $flash['type'] : 'success'; ?>
        <div class="alert alert-<?php echo htmlspecialchars($flashType, ENT_QUOTES, 'UTF-8'); ?> alert-dismissible fade show" role="status">
            <?php echo htmlspecialchars((string) $flash['message'], ENT_QUOTES, 'UTF-8'); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    <?php endif; ?>

    <form method="GET" class="mb-3">
        <input type="hidden" name="sort" value="<?php echo htmlspecialchars($sort, ENT_QUOTES, 'UTF-8'); ?>">
        <input type="hidden" name="direction" value="<?php echo htmlspecialchars($direction, ENT_QUOTES, 'UTF-8'); ?>">
        <div class="input-group search-controls">
            <input
                type="text"
                name="search"
                class="form-control"
                placeholder="Search name, email, gender, phone, address, or DOB (YYYY-MM-DD)"
                value="<?php echo htmlspecialchars($search); ?>"
            >
            <button type="submit" class="btn btn-primary">
                Search
            </button>
            <a href="view.php" class="btn btn-secondary">Reset</a>
        </div>
    </form>

    <div class="table-responsive">
        <table class="table table-bordered table-striped table-hover align-middle entries-table" aria-label="Registration entries">
            <thead class="table-dark">
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col" aria-sort="<?php echo $sort === 'name' ? ($direction === 'asc' ? 'ascending' : 'descending') : 'none'; ?>">
                        <a href="<?php echo htmlspecialchars($sortUrl('name'), ENT_QUOTES, 'UTF-8'); ?>" aria-label="Sort by name">
                            Name<span aria-hidden="true"><?php echo $sortMarker('name'); ?></span>
                        </a>
                    </th>
                    <th scope="col" aria-sort="<?php echo $sort === 'email' ? ($direction === 'asc' ? 'ascending' : 'descending') : 'none'; ?>">
                        <a href="<?php echo htmlspecialchars($sortUrl('email'), ENT_QUOTES, 'UTF-8'); ?>" aria-label="Sort by email">
                            Email<span aria-hidden="true"><?php echo $sortMarker('email'); ?></span>
                        </a>
                    </th>
                    <th scope="col" aria-sort="<?php echo $sort === 'phone' ? ($direction === 'asc' ? 'ascending' : 'descending') : 'none'; ?>">
                        <a href="<?php echo htmlspecialchars($sortUrl('phone'), ENT_QUOTES, 'UTF-8'); ?>" aria-label="Sort by phone">
                            Phone<span aria-hidden="true"><?php echo $sortMarker('phone'); ?></span>
                        </a>
                    </th>
                    <th>Gender</th>
                    <th>Address</th>
                    <th>Date of Birth</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                <?php if ($result->num_rows > 0): ?>

                    <?php while ($row = $result->fetch_assoc()): ?>
                        <tr>
                            <td><?php echo htmlspecialchars((string)$row['id']); ?></td>
                            <td><?php echo htmlspecialchars($row['name']); ?></td>
                            <td><?php echo htmlspecialchars($row['email']); ?></td>
                            <td><?php echo htmlspecialchars($row['phone']); ?></td>
                            <td><?php echo htmlspecialchars($row['gender']); ?></td>
                            <td><?php echo htmlspecialchars($row['address']); ?></td>
                            <td><?php echo htmlspecialchars($row['dob']); ?></td>
                            <td><?php echo htmlspecialchars($row['created_at']); ?></td>
                            <td class="text-nowrap">
                                <a class="btn btn-sm btn-primary mb-1"
                                   href="edit.php?id=<?php echo (int) $row['id']; ?><?php echo $search === '' ? '' : '&amp;search=' . rawurlencode($search); ?>">
                                    Edit
                                </a>
                                <form method="POST" action="delete.php" class="d-inline"
                                      onsubmit="return confirm('Delete registration #<?php echo (int) $row['id']; ?>? This cannot be undone.');">
                                    <input type="hidden" name="id" value="<?php echo (int) $row['id']; ?>">
                                    <input type="hidden" name="search" value="<?php echo htmlspecialchars($search, ENT_QUOTES, 'UTF-8'); ?>">
                                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars(admin_csrf_token(), ENT_QUOTES, 'UTF-8'); ?>">
                                    <button type="submit" class="btn btn-sm btn-danger mb-1">Delete</button>
                                </form>
                            </td>
                        </tr>
                    <?php endwhile; ?>

                <?php else: ?>
                    <tr>
                        <td colspan="9" class="text-center">
                            No entries found
                        </td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <p class="text-muted">
        Total matching entries: <?php echo $result->num_rows; ?>
    </p>

</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

<?php
$stmt->close();
$conn->close();
?>
