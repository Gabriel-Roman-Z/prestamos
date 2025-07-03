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

// Obtener ID del cliente
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    echo json_encode(['error' => 'ID de cliente inválido']);
    exit;
}

// Consulta SQL para obtener el cliente
$sql = "SELECT * FROM clientes WHERE id_cliente = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $cliente = $result->fetch_assoc();
    echo json_encode($cliente);
} else {
    echo json_encode(['error' => 'Cliente no encontrado']);
}

$stmt->close();
$conn->close();
?>