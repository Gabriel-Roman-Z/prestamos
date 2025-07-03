<?php
header('Content-Type: application/json');

include 'conexion.php'; // Asegúrate de incluir tu archivo de configuración de base de datos

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "prestamos_personales";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Error de conexión: ' . $conn->connect_error]));
}

// Obtener parámetros de paginación y búsqueda
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$perPage = 10;
$offset = ($page - 1) * $perPage;
$search = isset($_GET['search']) ? $_GET['search'] : '';

// Consulta SQL para obtener clientes con conteo de préstamos
$sql = "SELECT 
            c.id_cliente,
            CONCAT('CL-', LPAD(c.id_cliente, 3, '0')) AS codigo_cliente,
            c.nombre,
            c.apellido,
            c.correo,
            c.telefono,
            c.direccion,
            DATE_FORMAT(c.fecha_registro, '%d/%m/%Y') AS fecha_registro_format,
            c.identificacion_archivo,
            COUNT(p.id_prestamo) AS total_prestamos,
            SUM(CASE WHEN p.estado = 'activo' THEN 1 ELSE 0 END) AS prestamos_activos,
            SUM(CASE WHEN p.estado = 'en mora' THEN 1 ELSE 0 END) AS prestamos_mora
        FROM clientes c
        LEFT JOIN prestamos p ON c.id_cliente = p.id_cliente
        WHERE c.nombre LIKE ? OR c.apellido LIKE ? OR c.correo LIKE ? OR c.telefono LIKE ?
        GROUP BY c.id_cliente
        ORDER BY c.id_cliente DESC
        LIMIT ? OFFSET ?";

$searchTerm = "%$search%";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssii", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $perPage, $offset);
$stmt->execute();
$result = $stmt->get_result();

$clientes = [];
while ($row = $result->fetch_assoc()) {
    $clientes[] = $row;
}

// Obtener total de clientes para paginación
$totalSql = "SELECT COUNT(*) AS total 
             FROM clientes
             WHERE nombre LIKE ? OR apellido LIKE ? OR correo LIKE ? OR telefono LIKE ?";
$totalStmt = $conn->prepare($totalSql);
$totalStmt->bind_param("ssss", $searchTerm, $searchTerm, $searchTerm, $searchTerm);
$totalStmt->execute();
$totalResult = $totalStmt->get_result();
$totalRow = $totalResult->fetch_assoc();
$totalClientes = $totalRow['total'];

$totalPages = ceil($totalClientes / $perPage);

echo json_encode([
    'clientes' => $clientes,
    'total' => $totalClientes,
    'totalPages' => $totalPages,
    'currentPage' => $page
]);

$stmt->close();
$totalStmt->close();
$conn->close();
?>