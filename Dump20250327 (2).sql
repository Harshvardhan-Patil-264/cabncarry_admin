-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: cabncarry
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin','admin123','Super Admin'),(2,'nik','nik123','Nikhil '),(13,'jaydeep','jay123','jaydeep Patil');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_branch_name` (`name`),
  KEY `idx_branch_contact` (`contact`),
  KEY `idx_branch_admin` (`admin_id`),
  KEY `idx_branch_name` (`name`),
  KEY `idx_branch_location` (`location`),
  CONSTRAINT `branches_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`),
  CONSTRAINT `chk_branch_contact` CHECK ((regexp_like(`contact`,_utf8mb4'^[+]?[6-9][0-9]{9}$') or regexp_like(`contact`,_utf8mb4'^+91[6-9][0-9]{9}$') or (`contact` like _utf8mb4'NA-%')))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (5,'KODOLI 1','kodoli','9096641369',1,'2025-03-27 14:30:25'),(6,'Warananagar ','Warana Collage','9689962994',2,'2025-03-27 14:31:01');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches_backup`
--

DROP TABLE IF EXISTS `branches_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches_backup` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(100) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `admin_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches_backup`
--

LOCK TABLES `branches_backup` WRITE;
/*!40000 ALTER TABLE `branches_backup` DISABLE KEYS */;
INSERT INTO `branches_backup` VALUES (1,'KODOLI','Near Chavata','NA-1',NULL),(2,'KODOLI','Near Chavata','NA-2',2),(3,'KODOLI','Near Chavata','NA-3',2),(4,'KODOLI','Near Chavata','NA-4',2);
/*!40000 ALTER TABLE `branches_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver_applications`
--

DROP TABLE IF EXISTS `driver_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `license_number` varchar(50) NOT NULL,
  `vehicle_number` varchar(50) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `address` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_notes` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`mail`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `license_number` (`license_number`),
  UNIQUE KEY `vehicle_number` (`vehicle_number`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver_applications`
--

LOCK TABLES `driver_applications` WRITE;
/*!40000 ALTER TABLE `driver_applications` DISABLE KEYS */;
INSERT INTO `driver_applications` VALUES (1,'driver1 ','harsh264patil@gmail.com','9096641369','ABCD','MH 14 FP 8081','Mini','Ap-kodoli 416114\nNear chavata gali','approved','2025-03-27 17:25:30','2025-03-27 17:25:51',NULL),(2,'Harshavardhan Vilas Patil','harshpatil@gmail.com','9689962994','ABCDe','222','Van','Ap-kodoli 416114\nNear chavata gali   eeee','rejected','2025-03-27 17:26:49','2025-03-27 17:27:08','FUCK');
/*!40000 ALTER TABLE `driver_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `license_number` varchar(50) NOT NULL,
  `vehicle_number` varchar(50) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `address` varchar(255) NOT NULL,
  `availability_status` enum('avl','onride') NOT NULL DEFAULT 'avl',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`mail`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `license_number` (`license_number`),
  UNIQUE KEY `vehicle_number` (`vehicle_number`),
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES (1,'Rajesh Kumar','rajesh.kumar@example.com','9876543210','DL123456789','MH12AB1234','Sedan',4.50,'2025-03-18 07:38:54','','avl'),(2,'Amit Sharma','amit.sharma@example.com','8765432109','KA987654321','DL10CD5678','SUV',4.80,'2025-03-18 07:38:54','','avl'),(3,'Priya Verma','priya.verma@example.com','7654321098','TN567891234','KA05EF9012','Hatchback',4.20,'2025-03-18 07:38:54','','avl'),(6,'Nikhil Barage','nikhilbarage1@gmail.com','9876500210','DL123456','MP12AB1234','Rickshaw',5.00,'2025-03-18 18:58:59','','onride'),(7,'driver1 ','harsh264patil@gmail.com','9096641369','ABCD','MH 14 FP 8081','Mini',0.00,'2025-03-27 17:25:51','Ap-kodoli 416114\nNear chavata gali','avl');
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verification`
--

DROP TABLE IF EXISTS `otp_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `otp` int NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verification`
--

LOCK TABLES `otp_verification` WRITE;
/*!40000 ALTER TABLE `otp_verification` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp_verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `riderequest`
--

DROP TABLE IF EXISTS `riderequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `riderequest` (
  `rideid` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `acceptidof` int DEFAULT NULL,
  `userphone` varchar(20) DEFAULT NULL,
  `startPlace` varchar(255) DEFAULT NULL,
  `endPlace` varchar(255) DEFAULT NULL,
  `bookeddaytime` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','accepted','completed','cancelled') NOT NULL DEFAULT 'pending',
  `cartype` varchar(50) DEFAULT NULL,
  `totalprice` float DEFAULT NULL,
  `ridecode` int NOT NULL,
  PRIMARY KEY (`rideid`),
  KEY `fk_riderequest_user` (`userid`),
  KEY `fk_riderequest_userride` (`acceptidof`),
  CONSTRAINT `fk_riderequest_user` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_riderequest_userride` FOREIGN KEY (`acceptidof`) REFERENCES `userride` (`rideid`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `riderequest`
--

LOCK TABLES `riderequest` WRITE;
/*!40000 ALTER TABLE `riderequest` DISABLE KEYS */;
INSERT INTO `riderequest` VALUES (4,2,28,'','16.8651, 74.1997','16.9452, 74.4071','2025-03-22 23:10:57','pending','Car 4-Seater',153,0),(5,2,29,'','19.0319, 72.8882','19.055, 72.8692','2025-03-22 23:43:46','pending','Rickshaw',28.5,0),(7,21,31,'','16.5113, 74.076','16.5223, 74.0895','2025-03-23 00:10:45','pending','Rickshaw',8.7,0),(8,21,32,'','16.5113, 74.076','16.5223, 74.0895','2025-03-23 00:11:09','pending','Truck',145,0),(12,2,37,'7020107707','16.875, 74.1901','16.8651, 74.1997','2025-03-25 14:39:07','pending','Rickshaw',5.1,4842);
/*!40000 ALTER TABLE `riderequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userride`
--

DROP TABLE IF EXISTS `userride`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userride` (
  `rideid` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `driverid` int DEFAULT NULL,
  `userphone` varchar(15) NOT NULL,
  `startPlace` varchar(255) NOT NULL,
  `endPlace` varchar(255) NOT NULL,
  `bookeddaytime` datetime NOT NULL,
  `status` enum('pending','accept','ongoing','complete','cancelled') NOT NULL DEFAULT 'pending',
  `cartype` varchar(50) NOT NULL,
  `totalprice` decimal(10,2) NOT NULL,
  `ridecode` int NOT NULL,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`rideid`),
  KEY `userid` (`userid`),
  KEY `driverid` (`driverid`),
  KEY `idx_userride_branch` (`branch_id`),
  KEY `idx_userride_status` (`status`),
  KEY `idx_userride_bookeddaytime` (`bookeddaytime`),
  CONSTRAINT `userride_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `userride_ibfk_2` FOREIGN KEY (`driverid`) REFERENCES `drivers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `userride_ibfk_3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userride`
--

LOCK TABLES `userride` WRITE;
/*!40000 ALTER TABLE `userride` DISABLE KEYS */;
INSERT INTO `userride` VALUES (25,2,6,'Nikhil Barage','16.8651, 74.1997','16.9812, 74.0471','2025-03-21 11:14:06','complete','Rickshaw',85.20,0,NULL),(26,2,6,'Nikhil Barage','16.8651, 74.1997','16.9812, 74.0471','2025-03-21 11:14:09','complete','Rickshaw',284.00,0,NULL),(27,2,6,'Nikhil Barage','16.8651, 74.1997','16.5113, 74.076','2025-03-21 12:34:48','complete','Rickshaw',2765.00,0,NULL),(28,2,NULL,'','16.8651, 74.1997','16.9452, 74.4071','2025-03-22 23:10:57','cancelled','Car 4-Seater',153.00,0,NULL),(29,2,NULL,'','19.0319, 72.8882','19.055, 72.8692','2025-03-22 23:43:46','cancelled','Rickshaw',28.50,0,NULL),(30,21,6,'','16.5113, 74.076','16.3767, 74.2444','2025-03-23 00:10:16','complete','Rickshaw',104.10,0,NULL),(31,21,NULL,'','16.5113, 74.076','16.5223, 74.0895','2025-03-23 00:10:45','cancelled','Rickshaw',8.70,0,NULL),(32,21,NULL,'','16.5113, 74.076','16.5223, 74.0895','2025-03-23 00:11:09','pending','Truck',145.00,0,NULL),(34,2,6,'7020107707','16.5113, 74.076','16.8651, 74.1997','2025-03-24 18:49:30','complete','Rickshaw',165.90,9018,NULL),(35,2,6,'','16.5113, 74.076','16.5575, 74.1324','2025-03-24 19:07:51','complete','Rickshaw',31.50,3492,NULL),(36,2,6,'','16.5113, 74.076','16.43, 74.1372','2025-03-24 19:09:18','accept','Rickshaw',58.50,9108,NULL),(37,2,NULL,'7020107707','16.875, 74.1901','16.8651, 74.1997','2025-03-25 14:39:07','pending','Rickshaw',5.10,4842,NULL);
/*!40000 ALTER TABLE `userride` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testUser','Test Name','test@example.com','password123','Test Address'),(2,'gg. v','7020107707','nikhilbarage1@gmail.com','gb fEv v35','hub bggb vv'),(21,'u j h.','7020107707','brnike01@gmail.com','nikhil@123','hn gvv g'),(22,'jfufu','7020107707','jcufv@gmaul.com','nikhil','h h f vccfgv'),(23,'yvyv','7028187708','nikhilbar@gmail.com','hb g.   b','hbbv gy'),(25,'uuhh','7020107707','br@gmail.com','hjjjyijg','gg'),(26,'hjjj','7020107707','brnikee@gmwil.com','jkhhhjjgg','vgg'),(27,'hhhhhh','7020107707','nikhilbarag@gmail.com','hkhhhgh','ghg'),(28,'hjjj','5999857888','brnike0@gmail.com','nikhill@123','gj. h. bb'),(29,'guj','8658875508','brnik@gmail.com','mukhil4677','f vhhug bhh'),(30,'shdh','5659578484','nikhirag@gmail.com','sueebbst','shs shdd dbe');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-28  0:55:52
