--10. 
USE GRBoutique
GO

SELECT C.IdCliente, C.Nombre, C.Apellido, 
       (SELECT SUM(DP.Subtotal - DP.Descuento) 
        FROM PEDIDO P 
        JOIN DetallesPedido DP ON P.IdPedido = DP.IdPedido 
        WHERE P.IdCliente = C.IdCliente) AS TotalGastado
FROM CLIENTE C
WHERE (SELECT SUM(DP.Subtotal - DP.Descuento)
       FROM PEDIDO P 
       JOIN DetallesPedido DP ON P.IdPedido = DP.IdPedido 
       WHERE P.IdCliente = C.IdCliente)
     > (SELECT AVG(Total) 
        FROM (
          SELECT SUM(DP.Subtotal - DP.Descuento) AS Total
          FROM PEDIDO P 
          JOIN DetallesPedido DP ON P.IdPedido = DP.IdPedido 
          GROUP BY P.IdCliente
        ) AS TotalesClientes);