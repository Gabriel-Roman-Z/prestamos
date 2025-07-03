<?php
header('Content-Type: application/json');
include 'conexion.php'; // Asegúrate de incluir tu archivo de configuración de base de datos

// Recoger datos del formulario
$id_cliente = $_POST['id_cliente'] ?? 0;
$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$correo = $_POST['correo'] ?? '';
$direccion = $_POST['direccion'] ?? '';

if ($id_cliente <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID de cliente inválido']);
    exit;
}

// Manejar archivo de identificación
$identificacion_archivo = null;
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

// Preparar la consulta SQL de actualización
if ($identificacion_archivo) {
    $sql = "UPDATE clientes 
            SET nombre = ?, apellido = ?, telefono = ?, correo = ?, direccion = ?, identificacion_archivo = ?
            WHERE id_cliente = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssi", $nombre, $apellido, $telefono, $correo, $direccion, $identificacion_archivo, $id_cliente);
} else {
    $sql = "UPDATE clientes 
            SET nombre = ?, apellido = ?, telefono = ?, correo = ?, direccion = ?
            WHERE id_cliente = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssi", $nombre, $apellido, $telefono, $correo, $direccion, $id_cliente);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cliente actualizado correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>