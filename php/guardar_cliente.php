<?php
header('Content-Type: application/json');

include 'conexion.php'; // Asegúrate de incluir tu archivo de configuración de base de datos

// Configuración de la base de datos (debes reemplazar con tus credenciales)
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

// Recoger datos del formulario
$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$correo = $_POST['correo'] ?? '';
$direccion = $_POST['direccion'] ?? '';

// Manejar archivo de identificación
$identificacion_archivo = '';
if (isset($_FILES['identificacion']) && $_FILES['identificacion']['error'] === UPLOAD_ERR_OK) {
    // Directorio donde se guardarán los archivos
    $uploadDir = '../assets/images/';

    // Crear directorio si no existe
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Generar nombre único para el archivo
    $fileExtension = pathinfo($_FILES['identificacion']['name'], PATHINFO_EXTENSION);
    $fileName = uniqid('ident_', true) . '.' . $fileExtension;
    $uploadPath = $uploadDir . $fileName;

    // Mover el archivo subido al directorio de destino
    if (move_uploaded_file($_FILES['identificacion']['tmp_name'], $uploadPath)) {
        $identificacion_archivo = $uploadPath;
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al subir el archivo de identificación']);
        exit;
    }
}

// Preparar y ejecutar la consulta SQL
$sql = "INSERT INTO clientes (nombre, apellido, telefono, correo, direccion, identificacion_archivo, fecha_registro) 
        VALUES (?, ?, ?, ?, ?, ?, current_timestamp())";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Error en la preparación: ' . $conn->error]);
    exit;
}

$stmt->bind_param("ssssss", $nombre, $apellido, $telefono, $correo, $direccion, $identificacion_archivo);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cliente registrado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>