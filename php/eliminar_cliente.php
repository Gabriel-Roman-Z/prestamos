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
    die(json_encode(['success' => false, 'message' => 'Error de conexión: ' . $conn->connect_error]));
}

// Obtener ID del cliente a eliminar
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID de cliente inválido']);
    exit;
}

// Verificar si el cliente tiene préstamos activos
$sqlCheck = "SELECT COUNT(*) AS total_prestamos 
             FROM prestamos 
             WHERE id_cliente = ? AND estado IN ('activo', 'en mora')";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("i", $id);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();
$rowCheck = $resultCheck->fetch_assoc();

if ($rowCheck['total_prestamos'] > 0) {
    echo json_encode(['success' => false, 'message' => 'No se puede eliminar el cliente porque tiene préstamos activos o en mora']);
    exit;
}

// Eliminar el cliente
$sqlDelete = "DELETE FROM clientes WHERE id_cliente = ?";
$stmtDelete = $conn->prepare($sqlDelete);
$stmtDelete->bind_param("i", $id);

if ($stmtDelete->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cliente eliminado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar el cliente: ' . $conn->error]);
}

$stmtCheck->close();
$stmtDelete->close();
$conn->close();
?>