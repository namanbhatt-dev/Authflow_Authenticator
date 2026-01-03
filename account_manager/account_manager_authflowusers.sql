-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: account_manager
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `authflowusers`
--

DROP TABLE IF EXISTS `authflowusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authflowusers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` char(64) NOT NULL,
  `pin` char(8) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_logged_in` tinyint(1) NOT NULL DEFAULT '0',
  `is_enrolled` tinyint(1) NOT NULL DEFAULT '0',
  `idp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authflowusers`
--

LOCK TABLES `authflowusers` WRITE;
/*!40000 ALTER TABLE `authflowusers` DISABLE KEYS */;
INSERT INTO `authflowusers` VALUES (1,'bhattnaman141@gmail.com','6af797057cc4c611e9789001452e1dcfc6326b17c5b47f90399f5452e686180a','84089746','2024-03-16 22:26:14',0,1,NULL),(2,'authflowauthenticator@gmail.com','76897d2c8bb907de044b8f5c55bd74b52f8a0428dfdb0606bdd92b24dcaad6ca','96130194','2024-03-17 02:20:23',0,1,NULL),(14,'donec.moriatur@gmail.com','98c8b4f3e25b485a077bb8c11e60ac531307ccf2901e44c7edd0c1f41c1d0a6e','58388418','2024-03-24 20:18:26',0,1,NULL),(18,'nmb5908@psu.edu','713ab6ce9306e30f40f8a8bc65372c0d1cc56ff0023610820d96490ded45ac1c','60819836','2024-03-26 22:48:03',0,1,'google-oauth2');
/*!40000 ALTER TABLE `authflowusers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-26 20:12:15
