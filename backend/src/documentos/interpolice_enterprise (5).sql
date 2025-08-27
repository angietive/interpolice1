-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-08-2025 a las 18:01:10
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
-- Base de datos: `interpolice_enterprise`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amonestaciones`
--

CREATE TABLE `amonestaciones` (
  `id_amonestacion` int(11) NOT NULL,
  `id_ciudadano` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudadanos`
--

CREATE TABLE `ciudadanos` (
  `id_ciudadano` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `apodo` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `planeta_origen` int(11) DEFAULT NULL,
  `planeta_residencia` int(11) DEFAULT NULL,
  `foto` varchar(300) DEFAULT NULL,
  `codigo_universal` varchar(50) NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ciudadanos`
--

INSERT INTO `ciudadanos` (`id_ciudadano`, `nombre`, `apellido`, `apodo`, `fecha_nacimiento`, `planeta_origen`, `planeta_residencia`, `foto`, `codigo_universal`, `estado`) VALUES
(1, 'angie', 'porras', 'angitive', '2017-08-17', 1, 1, 'USER-1756223676214-DiseÃ±o sin tÃ­tulo (1).png', '1234', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consultas_antecedentes`
--

CREATE TABLE `consultas_antecedentes` (
  `id_consulta` int(11) NOT NULL,
  `id_ciudadano` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `delitos`
--

CREATE TABLE `delitos` (
  `id_delito` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `lugar` varchar(150) NOT NULL,
  `registrado_por` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `delitos`
--

INSERT INTO `delitos` (`id_delito`, `descripcion`, `fecha`, `lugar`, `registrado_por`) VALUES
(1, 'Robo a mano armada', '2025-08-15', 'Zona Central', 2),
(2, 'Fraude electrónico', '2025-08-18', 'Sector Norte', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evidencias`
--

CREATE TABLE `evidencias` (
  `id_evidencia` int(11) NOT NULL,
  `id_delito` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_sistema`
--

CREATE TABLE `logs_sistema` (
  `id_log` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `accion` varchar(255) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `logs_sistema`
--

INSERT INTO `logs_sistema` (`id_log`, `id_usuario`, `accion`, `fecha`) VALUES
(1, 1, 'Creó un nuevo reporte', '2025-08-23 03:57:34'),
(2, 2, 'Registró un delito', '2025-08-23 03:57:34'),
(3, 3, 'Editó información de usuario', '2025-08-23 03:57:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas_involucradas`
--

CREATE TABLE `personas_involucradas` (
  `id_involucrado` int(11) NOT NULL,
  `id_delito` int(11) NOT NULL,
  `id_ciudadano` int(11) NOT NULL,
  `rol` enum('víctima','sospechoso','testigo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planetas`
--

CREATE TABLE `planetas` (
  `id_planeta` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `planetas`
--

INSERT INTO `planetas` (`id_planeta`, `nombre`) VALUES
(2, 'marte'),
(1, 'tierra');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes_generados`
--

CREATE TABLE `reportes_generados` (
  `id_reporte` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `contenido` text NOT NULL,
  `generado_por` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reportes_generados`
--

INSERT INTO `reportes_generados` (`id_reporte`, `titulo`, `contenido`, `generado_por`, `fecha`) VALUES
(1, 'Reporte mensual de seguridad', 'Análisis de delitos registrados en el mes', 1, '2025-08-23 03:57:34'),
(2, 'Informe de fraude', 'Detalles sobre fraudes electrónicos detectados', 3, '2025-08-23 03:57:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'administrador'),
(4, 'general'),
(2, 'policia'),
(3, 'secretaria');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sanciones`
--

CREATE TABLE `sanciones` (
  `id_sancion` int(11) NOT NULL,
  `id_ciudadano` int(11) NOT NULL,
  `id_delito` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `password_hash`, `id_rol`, `activo`, `ultimo_acceso`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Capitán Smith', 'admin@interpolice.galaxy', 'hash_admin', 1, 1, NULL, '2025-08-23 03:57:34', '2025-08-23 03:57:34'),
(2, 'Oficial John', 'john@interpolice.galaxy', 'hash_john', 2, 1, NULL, '2025-08-23 03:57:34', '2025-08-23 03:57:34'),
(3, 'Maria Lopez', 'maria@email.com', 'hash_maria', 3, 1, NULL, '2025-08-23 03:57:34', '2025-08-23 03:57:34'),
(4, 'Juan Pérez', 'juanperez@email.com', '123456', 1, 1, '2025-08-23 04:49:20', '2025-08-12 05:00:00', '2025-08-23 04:49:20'),
(5, 'Juan Pérez', 'juanpere2z@email.com', '$2b$12$L4iTQIEh5AQ.edTYResHFO3GAMFcSWWFbJ15pl3rubMTAeprri4ne', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(6, 'Angie', 'asporras6@misena.edu.co', '$2b$12$Erm9VYs1SHPHW1dsBWtp/eGcgaebPHq0v2Em6F4M0X4229IfMgUA2', 4, 1, '2025-08-26 04:08:37', '2025-08-23 05:04:50', '2025-08-26 04:08:37'),
(7, 'angie Pérez', 'angie@email.com', '$2b$12$QiMOG2VBEnWrwfsCaja8nOBAR2uc28bqKLZ2B0YuiZoBwlKvSqEg.', 1, 1, '2025-08-26 02:39:57', '2025-08-12 05:00:00', '2025-08-26 02:39:57'),
(8, 'angie Pérez', 'angiangie@email.com', '$2b$12$TsiNC4YdtaK7z9UMFrtKc.dNU6YHhM57zv0DmEjcxMnPRhL3MA7Sq', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(9, 'angie Pérez', 'angiangisse@email.com', '$2b$12$4Sx2c/BM2rNBMrvH6OVBIetoM9xjn9cZPAwiUFPFKrUTSnDy.PgpG', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(10, 'angie Pérez', 'angiangidssse@email.com', '$2b$12$QPxy/RjQZyrjr.cuHx6Cz.UxPISM.48jq2XQwm.Gdp7TKw46RFn8G', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(11, 'angie Pérez', 'angiangidssssdsse@email.com', '$2b$12$wdE0hbraAFtnsP.h.fTxte0T92Le3RMWfd.tymZJcPZmgSCaejt2i', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(12, 'angie Pérez', 'angiangisasdssssdsse@email.com', '$2b$12$Gre8O7vM8UDXRkWphEn5eO/4X94VvKQnQNmnx73E1N23uGUr5odTK', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(13, 'angie Pérez', 'angiangisasdssssSASdsse@email.com', '$2b$12$LU3YY729oXZvzIFGu9p6o.oaWwhEfDDihXvyWoRqJUMD0gyng44Re', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(14, 'angie Pérez', 'angiangiE5EsasdssssSASdsse@email.com', '$2b$12$Ccn9Wsem.U8DqY6BlEK0Ke2SD6qa39Gy4Kim4oBayzylcu6jTlR7q', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(15, 'angie Pérez', 'angiangiSdsse@email.com', '$2b$12$44J.KHaCTIZ9aXflE5nCKu5IZ4b6.xpCiunlt7/PZDvHITM5Pihri', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(16, 'angie Pérez', 'angiSangiSdsse@email.com', '$2b$12$2g1q0XvR32usCBwn/Z.ShuVLj649myorHf35KfZv5m9C.wM5vIlD6', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(17, 'angie Pérez', 'angiSangiSdsseD@email.com', '$2b$12$M4tqEdZlJe0xK0bODrfR2.ycuGWOWTu.b07jsanuedNSCZXkjE.py', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(18, 'angie Pérez', 'angiSangiSdSsseD@email.com', '$2b$12$XuvVe/Nnk1xPbs2ICzGDA.se5hrksm6hVvdeLi3zpC35fQ8kE3fE6', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00'),
(19, 'angie Pérez', 'angingiSdSsseD@email.com', '$2b$12$k7oU9Lf71YYZ5sCLPul.Ke9nRpyZXBPBKDxkorI1.aAbt.gz3Qp9S', 1, 1, NULL, '2025-08-12 05:00:00', '2025-08-12 05:00:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amonestaciones`
--
ALTER TABLE `amonestaciones`
  ADD PRIMARY KEY (`id_amonestacion`),
  ADD KEY `fk_amonestacion_ciudadano` (`id_ciudadano`);

--
-- Indices de la tabla `ciudadanos`
--
ALTER TABLE `ciudadanos`
  ADD PRIMARY KEY (`id_ciudadano`),
  ADD UNIQUE KEY `identificacion` (`codigo_universal`),
  ADD KEY `fk_origen` (`planeta_origen`),
  ADD KEY `fk_residencia` (`planeta_residencia`);

--
-- Indices de la tabla `consultas_antecedentes`
--
ALTER TABLE `consultas_antecedentes`
  ADD PRIMARY KEY (`id_consulta`),
  ADD KEY `fk_consulta_ciudadano` (`id_ciudadano`),
  ADD KEY `fk_consulta_usuario` (`id_usuario`);

--
-- Indices de la tabla `delitos`
--
ALTER TABLE `delitos`
  ADD PRIMARY KEY (`id_delito`),
  ADD KEY `fk_delitos_usuario` (`registrado_por`);

--
-- Indices de la tabla `evidencias`
--
ALTER TABLE `evidencias`
  ADD PRIMARY KEY (`id_evidencia`),
  ADD KEY `fk_evidencia_delito` (`id_delito`);

--
-- Indices de la tabla `logs_sistema`
--
ALTER TABLE `logs_sistema`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `fk_logs_usuario` (`id_usuario`);

--
-- Indices de la tabla `personas_involucradas`
--
ALTER TABLE `personas_involucradas`
  ADD PRIMARY KEY (`id_involucrado`),
  ADD KEY `fk_involucrado_delito` (`id_delito`),
  ADD KEY `fk_involucrado_ciudadano` (`id_ciudadano`);

--
-- Indices de la tabla `planetas`
--
ALTER TABLE `planetas`
  ADD PRIMARY KEY (`id_planeta`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `reportes_generados`
--
ALTER TABLE `reportes_generados`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `fk_reportes_usuario` (`generado_por`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `sanciones`
--
ALTER TABLE `sanciones`
  ADD PRIMARY KEY (`id_sancion`),
  ADD KEY `fk_sancion_ciudadano` (`id_ciudadano`),
  ADD KEY `fk_sancion_delito` (`id_delito`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_usuarios_roles` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `amonestaciones`
--
ALTER TABLE `amonestaciones`
  MODIFY `id_amonestacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ciudadanos`
--
ALTER TABLE `ciudadanos`
  MODIFY `id_ciudadano` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `consultas_antecedentes`
--
ALTER TABLE `consultas_antecedentes`
  MODIFY `id_consulta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `delitos`
--
ALTER TABLE `delitos`
  MODIFY `id_delito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `evidencias`
--
ALTER TABLE `evidencias`
  MODIFY `id_evidencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `logs_sistema`
--
ALTER TABLE `logs_sistema`
  MODIFY `id_log` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `personas_involucradas`
--
ALTER TABLE `personas_involucradas`
  MODIFY `id_involucrado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `planetas`
--
ALTER TABLE `planetas`
  MODIFY `id_planeta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `reportes_generados`
--
ALTER TABLE `reportes_generados`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `sanciones`
--
ALTER TABLE `sanciones`
  MODIFY `id_sancion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amonestaciones`
--
ALTER TABLE `amonestaciones`
  ADD CONSTRAINT `fk_amonestacion_ciudadano` FOREIGN KEY (`id_ciudadano`) REFERENCES `ciudadanos` (`id_ciudadano`);

--
-- Filtros para la tabla `ciudadanos`
--
ALTER TABLE `ciudadanos`
  ADD CONSTRAINT `fk_origen` FOREIGN KEY (`planeta_origen`) REFERENCES `planetas` (`id_planeta`),
  ADD CONSTRAINT `fk_residencia` FOREIGN KEY (`planeta_residencia`) REFERENCES `planetas` (`id_planeta`);

--
-- Filtros para la tabla `consultas_antecedentes`
--
ALTER TABLE `consultas_antecedentes`
  ADD CONSTRAINT `fk_consulta_ciudadano` FOREIGN KEY (`id_ciudadano`) REFERENCES `ciudadanos` (`id_ciudadano`),
  ADD CONSTRAINT `fk_consulta_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `delitos`
--
ALTER TABLE `delitos`
  ADD CONSTRAINT `fk_delitos_usuario` FOREIGN KEY (`registrado_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `evidencias`
--
ALTER TABLE `evidencias`
  ADD CONSTRAINT `fk_evidencia_delito` FOREIGN KEY (`id_delito`) REFERENCES `delitos` (`id_delito`);

--
-- Filtros para la tabla `logs_sistema`
--
ALTER TABLE `logs_sistema`
  ADD CONSTRAINT `fk_logs_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `personas_involucradas`
--
ALTER TABLE `personas_involucradas`
  ADD CONSTRAINT `fk_involucrado_ciudadano` FOREIGN KEY (`id_ciudadano`) REFERENCES `ciudadanos` (`id_ciudadano`),
  ADD CONSTRAINT `fk_involucrado_delito` FOREIGN KEY (`id_delito`) REFERENCES `delitos` (`id_delito`);

--
-- Filtros para la tabla `reportes_generados`
--
ALTER TABLE `reportes_generados`
  ADD CONSTRAINT `fk_reportes_usuario` FOREIGN KEY (`generado_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `sanciones`
--
ALTER TABLE `sanciones`
  ADD CONSTRAINT `fk_sancion_ciudadano` FOREIGN KEY (`id_ciudadano`) REFERENCES `ciudadanos` (`id_ciudadano`),
  ADD CONSTRAINT `fk_sancion_delito` FOREIGN KEY (`id_delito`) REFERENCES `delitos` (`id_delito`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
