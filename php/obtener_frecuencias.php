<?php
header('Content-Type: application/json');
require_once 'conexion.php';

try {
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }

    $sql = "SELECT id_frecuencia, descripcion FROM frecuenciaspago ORDER BY descripcion ASC";
    $resultado = $conn->query($sql);

    if (!$resultado) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $frecuencias = [];
    while ($fila = $resultado->fetch_assoc()) {
        $frecuencias[] = [
            'id_frecuencia' => $fila['id_frecuencia'],
            'descripcion' => $fila['descripcion']
        ];
    }
    if (empty($frecuencias)) {
        echo json_encode(['error' => 'No se encontraron frecuencias']);
        exit;
    }
    echo json_encode($frecuencias);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>