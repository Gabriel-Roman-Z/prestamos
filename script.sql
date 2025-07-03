-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-07-2025 a las 21:11:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `prestamos_personales`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `identificacion_archivo` varchar(255) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `telefono`, `correo`, `direccion`, `identificacion_archivo`, `fecha_registro`) VALUES
(20, 'Gabriel', 'Roman', '6675142646', 'zazuetazazueta3119@gmail.com', '5 de febrero', '../assets/images/ident_68654d1c7321c1.00210072.png', '2025-07-02 08:14:03'),
(21, 'asd', 'asda', '13241251', 'qdasd@asda', 'asdasd', '../assets/images/ident_68654d52e73247.24460165.jpg', '2025-07-02 08:16:34'),
(22, 'asdas', 'sada', '6498196', 'asd@asda', 'asda', '../assets/images/ident_68654d86490103.88373247.jpg', '2025-07-02 08:17:26'),
(23, 'flds', 'asdas', '98794984', 'asda@asda', '31 sada', '../assets/images/ident_68654dda87cde2.18177568.jpg', '2025-07-02 08:18:50'),
(24, 'pedro', 'picapiedra', '1231231', 'pedro@gmail.com', 'asdlkjas', '../assets/images/ident_68654ecf860d63.72841537.png', '2025-07-02 08:22:55'),
(25, 'prueba', 'prueba', '1312312', 'prueba@gmail.com', 'a1sad', '../assets/images/ident_68654f0be6e327.16807061.png', '2025-07-02 08:23:55'),
(26, 'Lucía', 'Fernández', '6675123456', 'lucia.fernandez@example.com', 'Col. Las Quintas', '../assets/images/ident_68654a1babc123.12345678.png', '2025-07-02 08:30:00'),
(27, 'Miguel', 'Zamora', '6675987456', 'miguelzamora@example.com', 'Col. Centro', '../assets/images/ident_68654b2cded456.23456789.jpg', '2025-07-02 08:32:10'),
(28, 'Andrea', 'López', '6675231987', 'andrealopez@example.com', 'Col. Guadalupe', '../assets/images/ident_68654c3efff789.34567890.jpg', '2025-07-02 08:34:22'),
(29, 'Juan', 'Pérez', '6675112345', 'juanperez@example.com', 'Col. 21 de Marzo', '../assets/images/ident_68654d4eaaa321.45678901.png', '2025-07-02 08:36:35'),
(30, 'María', 'González', '6675345678', 'mariagonzalez@example.com', 'Col. Tierra Blanca', '../assets/images/ident_68654e5cbbb654.56789012.jpg', '2025-07-02 08:38:47'),
(31, 'Luis', 'Martínez', '6675456789', 'luismartinez@example.com', 'Col. Loma Linda', '../assets/images/ident_68654f6dccc987.67890123.png', '2025-07-02 08:40:52'),
(32, 'Ana', 'Reyes', '6675567890', 'anareyes@example.com', 'Col. La Campiña', '../assets/images/ident_6865507eedda10.78901234.jpg', '2025-07-02 08:42:10'),
(33, 'Jorge', 'Soto', '6675678901', 'jorgesoto@example.com', 'Col. Humaya', '../assets/images/ident_6865518fffab43.89012345.jpg', '2025-07-02 08:44:25'),
(34, 'Carmen', 'Velázquez', '6675789012', 'carmenvelazquez@example.com', 'Col. Benito Juárez', '../assets/images/ident_686552a112bc76.90123456.jpg', '2025-07-02 08:46:38'),
(35, 'Carlos', 'Navarro', '6675890123', 'carlosnavarro@example.com', 'Col. Emiliano Zapata', '../assets/images/ident_686553b233cd98.01234567.png', '2025-07-02 08:48:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `frecuenciaspago`
--

CREATE TABLE `frecuenciaspago` (
  `id_frecuencia` int(11) NOT NULL,
  `tipo_periodo` enum('dias','semanas','quincenas','meses') NOT NULL,
  `cada_cuantos` int(11) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `frecuenciaspago`
--

INSERT INTO `frecuenciaspago` (`id_frecuencia`, `tipo_periodo`, `cada_cuantos`, `descripcion`) VALUES
(1, 'dias', 1, 'Diario'),
(2, 'dias', 2, 'Cada dos días'),
(3, 'semanas', 1, 'Semanal'),
(4, 'semanas', 2, 'Cada dos semanas'),
(5, 'quincenas', 1, 'Quincenal'),
(6, 'meses', 1, 'Mensual'),
(7, 'meses', 2, 'Bimestral'),
(8, 'meses', 3, 'Trimestral'),
(9, 'meses', 6, 'Semestral'),
(10, '', 1, 'Anual');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `garantias`
--

CREATE TABLE `garantias` (
  `id_garantia` int(11) NOT NULL,
  `id_prestamo` int(11) NOT NULL,
  `tipo_garantia` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `valor_estimado` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_prestamo` int(11) NOT NULL,
  `fecha_pago` date NOT NULL,
  `monto_pagado` decimal(15,2) NOT NULL,
  `comprobante` varchar(255) DEFAULT NULL,
  `saldo_restante` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamos`
--

CREATE TABLE `prestamos` (
  `id_prestamo` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_frecuencia` int(11) NOT NULL,
  `monto_total` decimal(15,2) NOT NULL,
  `tasa_interes` decimal(5,2) NOT NULL,
  `numero_de_pagos` int(11) NOT NULL,
  `fecha_solicitud` date NOT NULL,
  `fecha_aprobacion` date DEFAULT NULL,
  `metodo_pago` enum('efectivo','transferencia') NOT NULL,
  `estado` enum('activo','cerrado','en mora') DEFAULT 'activo',
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prestamos`
--

INSERT INTO `prestamos` (`id_prestamo`, `id_cliente`, `id_frecuencia`, `monto_total`, `tasa_interes`, `numero_de_pagos`, `fecha_solicitud`, `fecha_aprobacion`, `metodo_pago`, `estado`, `observaciones`) VALUES
(1, 20, 1, 15000.00, 10.00, 5, '0000-00-00', NULL, 'transferencia', 'activo', 'de momento no');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `frecuenciaspago`
--
ALTER TABLE `frecuenciaspago`
  ADD PRIMARY KEY (`id_frecuencia`),
  ADD UNIQUE KEY `tipo_periodo` (`tipo_periodo`,`cada_cuantos`);

--
-- Indices de la tabla `garantias`
--
ALTER TABLE `garantias`
  ADD PRIMARY KEY (`id_garantia`),
  ADD KEY `id_prestamo` (`id_prestamo`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `id_prestamo` (`id_prestamo`);

--
-- Indices de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`id_prestamo`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_frecuencia` (`id_frecuencia`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `frecuenciaspago`
--
ALTER TABLE `frecuenciaspago`
  MODIFY `id_frecuencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `garantias`
--
ALTER TABLE `garantias`
  MODIFY `id_garantia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  MODIFY `id_prestamo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `garantias`
--
ALTER TABLE `garantias`
  ADD CONSTRAINT `garantias_ibfk_1` FOREIGN KEY (`id_prestamo`) REFERENCES `prestamos` (`id_prestamo`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_prestamo`) REFERENCES `prestamos` (`id_prestamo`);

--
-- Filtros para la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD CONSTRAINT `prestamos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `prestamos_ibfk_2` FOREIGN KEY (`id_frecuencia`) REFERENCES `frecuenciaspago` (`id_frecuencia`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
