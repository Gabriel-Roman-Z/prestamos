<?php
header('Content-Type: application/json');
require_once 'conexion.php';

try {
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }

    $sql = "SELECT 
                c.id_cliente,
                CONCAT('CL-', LPAD(c.id_cliente, 3, '0')) AS codigo_cliente,
                c.nombre,
                c.apellido,
                SUM(CASE WHEN p.estado = 'activo' THEN 1 ELSE 0 END) AS prestamos_activos,
                SUM(CASE WHEN p.estado = 'en mora' THEN 1 ELSE 0 END) AS prestamos_mora
            FROM clientes c
            LEFT JOIN prestamos p ON c.id_cliente = p.id_cliente
            GROUP BY c.id_cliente
            ORDER BY c.nombre ASC";

    $resultado = $conn->query($sql);

    if (!$resultado) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $clientes = [];
    while ($fila = $resultado->fetch_assoc()) {
        $estado = '';
        if ($fila['prestamos_mora'] > 0) {
            $estado = ' ⚠️ [En mora]';
        } elseif ($fila['prestamos_activos'] > 0) {
            $estado = ' ✓ [Préstamo activo]';
        }

        $clientes[] = [
            'id_cliente' => $fila['id_cliente'],
            'texto' => $fila['nombre'] . ' ' .
                $fila['apellido'] .
                $estado
        ];
    }

    if (empty($clientes)) {
        echo json_encode(['error' => 'No se encontraron clientes']);
        exit;
    }

    echo json_encode($clientes);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>