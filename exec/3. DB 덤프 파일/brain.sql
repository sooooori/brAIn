-- MySQL dump 10.13  Distrib 8.0.37, for Win64 (x86_64)
--
-- Host: localhost    Database: brain
-- ------------------------------------------------------
-- Server version	11.4.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `ready` bit(1) DEFAULT NULL,
  `member_id` int(11) DEFAULT NULL,
  `postit_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmrrrpi513ssu63i2783jyiv9m` (`member_id`),
  KEY `FKfywoj5o53pveuj18gdjm9k0es` (`postit_id`),
  CONSTRAINT `FKfywoj5o53pveuj18gdjm9k0es` FOREIGN KEY (`postit_id`) REFERENCES `round_post_it` (`id`),
  CONSTRAINT `FKmrrrpi513ssu63i2783jyiv9m` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,'카페라떼는 맛있어',_binary '',1,34),(2,'카페 라떼는 좀 그래',_binary '',3,34),(3,'모카 모카',_binary '',3,35),(4,'모카 좋아',_binary '',1,35),(5,'돌체',_binary '',1,36),(6,'ㅊㅊㅊㅊㅊ',_binary '',3,36),(7,'아아아아',_binary '',3,37),(8,'아메',_binary '',1,37);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conference_room`
--

DROP TABLE IF EXISTS `conference_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conference_room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assistant_id` varchar(255) DEFAULT NULL,
  `conclusion` varchar(255) DEFAULT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `invite_code` varchar(255) DEFAULT NULL,
  `is_end` bit(1) DEFAULT NULL,
  `participate_url` varchar(255) DEFAULT NULL,
  `round` int(11) DEFAULT NULL,
  `secure_id` varchar(255) DEFAULT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `step` enum('STEP_0','STEP_1','STEP_2','STEP_3','STEP_4','STEP_5','WAIT') NOT NULL,
  `subject` varchar(255) NOT NULL,
  `thread_id` varchar(255) DEFAULT NULL,
  `timer` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conference_room`
--

LOCK TABLES `conference_room` WRITE;
/*!40000 ALTER TABLE `conference_room` DISABLE KEYS */;
INSERT INTO `conference_room` VALUES (1,'asst_N0EmDmYCBtYVvpW2lXNf4hwm',NULL,NULL,'623806',_binary '\0','https://bardisue.store/v1/conferences/42852832a73b05c766352eeba50bd2cd9fcef85b5cdef9e49fb0443210221642',0,'42852832a73b05c766352eeba50bd2cd9fcef85b5cdef9e49fb0443210221642','2024-08-05 11:45:14.861000','WAIT','저메추','thread_AS7GwbJL38jVeIXf4kMAWFFj',NULL),(2,'asst_yYmf42fVOscJ3ytItI2OHVVC',NULL,NULL,'809268',_binary '\0','https://bardisue.store/v1/conferences/36977ddfc7bf6cf79fce3d13311c36524de402cfda49eefa005972358a837bd5',0,'36977ddfc7bf6cf79fce3d13311c36524de402cfda49eefa005972358a837bd5','2024-08-05 13:02:35.875000','STEP_2','sssss','thread_wYX8YFoHMCTiMieCmmWPrN5U',NULL),(3,'asst_yUAsyzY4zENEkVjymRY0mN4L',NULL,NULL,'427924',_binary '','https://bardisue.store/v1/conferences/ac95b7cf4cd7bfe6050d7a9b80b78b7107ab9366938785609e96f9dba4a20fd8',0,'ac95b7cf4cd7bfe6050d7a9b80b78b7107ab9366938785609e96f9dba4a20fd8','2024-08-11 13:53:44.990000','WAIT','ghldmltlwkr','thread_CN3jiIRZJKHSA9Vts96ygt7K',NULL),(4,'asst_KLtNBgabyEYdpKWDSY4mX1LC',NULL,NULL,'755046',_binary '','https://bardisue.store/v1/conferences/3a5dd56dc589469397f636f4da56c7386c764213e9aba4ccc52196526c98da07',0,'3a5dd56dc589469397f636f4da56c7386c764213e9aba4ccc52196526c98da07','2024-08-11 13:54:50.771000','WAIT','회의 주제 1','thread_zmle4eTBPJ6R4fkI6TJlMtdI',NULL),(5,'asst_RKqmHoNvG95XZX5d3hrA9PFv',NULL,NULL,'645121',_binary '','https://bardisue.store/v1/conferences/cbbaa7c0c524dd346f73055a30f7e61e30da6fef6f82c2f8310dd0f75f1a4040',0,'cbbaa7c0c524dd346f73055a30f7e61e30da6fef6f82c2f8310dd0f75f1a4040','2024-08-11 13:55:48.486000','WAIT','회의 다시 시작','thread_TQzttmdwCoKvuHIPb80IJv7P',NULL),(6,'asst_rfSx8I5Va3b0C8HIdBMtFh0b',NULL,NULL,'758094',_binary '','https://bardisue.store/v1/conferences/fdee0bdc97ac8d4ed7881c685b449eb89c79fd1a1382661a57f8ba49c04235d4',0,'fdee0bdc97ac8d4ed7881c685b449eb89c79fd1a1382661a57f8ba49c04235d4','2024-08-11 13:56:31.329000','WAIT','god bj','thread_bXDKNMub39V2PAPMsJE4HaUw',NULL),(7,'asst_cytT245uYTHvLF0TIO6S5WgT',NULL,NULL,'136197',_binary '','https://bardisue.store/v1/conferences/8dfe3576857826610813e99419c9e1f953db6bf828f39ca65596de0f5b8f79bd',0,'8dfe3576857826610813e99419c9e1f953db6bf828f39ca65596de0f5b8f79bd','2024-08-11 14:00:36.621000','WAIT','wh저메추','thread_GXzJNpkqYczbhSYHILY6hcks',NULL),(8,'asst_aKfH9r9AxRHCX4c5Xo9OdFcv',NULL,NULL,'641208',_binary '','https://bardisue.store/v1/conferences/83fb58e3e7c0dbd67c1b640e5b69b0975d0be74b3dfd6c5c7162c6c42e74f74d',0,'83fb58e3e7c0dbd67c1b640e5b69b0975d0be74b3dfd6c5c7162c6c42e74f74d','2024-08-11 14:07:01.694000','STEP_3','저메추','thread_MnkmHDPpRbRTXsm6Gu9bNTqU',NULL),(9,'asst_SDlQEBDn0keqWxu0ndNCfoaY',NULL,NULL,'350652',_binary '','https://bardisue.store/v1/conferences/357fa2e383a2cddf668c58091b83e19e3df8d9f4eb220dbe23e43ea644502be3',0,'357fa2e383a2cddf668c58091b83e19e3df8d9f4eb220dbe23e43ea644502be3','2024-08-11 14:14:18.214000','STEP_2','회의','thread_4neSADMvRHxg7I5gpUtY3CZl',NULL),(10,'asst_c4Abkv3EKVvMZtAWUdi2KYYV',NULL,NULL,'615611',_binary '','https://bardisue.store/v1/conferences/2f1ccd7c7240e591189798a407ca9a21ebdaef13cf72773843adeab6c5251ce8',0,'2f1ccd7c7240e591189798a407ca9a21ebdaef13cf72773843adeab6c5251ce8','2024-08-11 14:18:44.234000','STEP_2','회의 주제 1','thread_VaPn2MKBa6Jzp4I5mpOIfdYZ',NULL),(11,'asst_g1a6rVqpWLbZ1NUzZld5I4WK',NULL,NULL,'902177',_binary '','https://bardisue.store/v1/conferences/5cbb9f3df42f23866f0aa543f7741c50a323336ff4e0258715b48420a5a3c0af',0,'5cbb9f3df42f23866f0aa543f7741c50a323336ff4e0258715b48420a5a3c0af','2024-08-11 14:19:50.057000','STEP_3','호이','thread_I5vriGm60T814baf9Rj2Vfda',NULL),(12,'asst_iCe6qa31QjJTeaMfykaLfFJA',NULL,NULL,'713499',_binary '','https://bardisue.store/v1/conferences/e2095efaa4906030ea1b133f9229be035416861f5d288cf2f7050bfcffb594a7',0,'e2095efaa4906030ea1b133f9229be035416861f5d288cf2f7050bfcffb594a7','2024-08-11 14:39:39.736000','STEP_1','회의 시작합니다','thread_ClhwSjyhFSdB0DrcfPTRNFug',NULL),(13,'asst_N47inJvX0qadKnNGtpgvUrLj',NULL,NULL,'106215',_binary '','https://bardisue.store/v1/conferences/674c6e809b1abc93a5a51ffbb8efe638f3c082ff04c847fc93d916c9cf1d605c',0,'674c6e809b1abc93a5a51ffbb8efe638f3c082ff04c847fc93d916c9cf1d605c','2024-08-11 14:42:02.776000','STEP_3','커피 종류','thread_olV0gXN2RtOeeaSeWv6pojcH',NULL),(14,'asst_dP0601yHmxBJ5O1Bk8V7uYNj',NULL,NULL,'121636',_binary '','https://bardisue.store/v1/conferences/7455d74f9eef3c647f83aaba175556f740be9e8c7081f21df4d72d76d1183f0e',0,'7455d74f9eef3c647f83aaba175556f740be9e8c7081f21df4d72d76d1183f0e','2024-08-11 15:31:43.475000','STEP_2','2323','thread_0JFntiGFUJeSeJupQkBqpBBp',NULL),(15,'asst_rXlZqjBSvhfA8QS7e5DZJJMV',NULL,NULL,'638008',_binary '','https://bardisue.store/v1/conferences/62ad4056ad0cb609709790c070405fcea1a3d3ba7efb0a36de401bff59716c57',0,'62ad4056ad0cb609709790c070405fcea1a3d3ba7efb0a36de401bff59716c57','2024-08-11 15:32:40.123000','WAIT','2212','thread_pjKHfhjBuWPOryHr477NXWnt',NULL),(16,'asst_lqgg2Eu4RmZdyCIJjmve3WRH',NULL,NULL,'264276',_binary '','https://bardisue.store/v1/conferences/dd9877d2ba844c550c6109c9f2a48cc43a12390e1a69c344d4526b8c71ec1b5a',0,'dd9877d2ba844c550c6109c9f2a48cc43a12390e1a69c344d4526b8c71ec1b5a','2024-08-11 15:32:55.085000','STEP_3','4444','thread_XtI5eShZWbl9ELeC6o6mmYzm',NULL),(17,'asst_sgs8SIvg61D47RHGEz4L0UnP',NULL,NULL,'307651',_binary '','https://bardisue.store/v1/conferences/3ce57b7b58fb1087a81b6ad9ee8dfcc0c86b1288b9ba0aba6d461ba3f61ff473',0,'3ce57b7b58fb1087a81b6ad9ee8dfcc0c86b1288b9ba0aba6d461ba3f61ff473','2024-08-11 15:49:46.366000','WAIT','2','thread_TyjMtzFqdTO4f6pKCiFkFndq',NULL),(18,'asst_SiBh1HzQaqqXAWA6hZMiSWf3',NULL,NULL,'584970',_binary '','https://bardisue.store/v1/conferences/7a26b1545a73666f2d2a833bc126f2c08d514db53e3aa0ebe85a9920b7572d4a',0,'7a26b1545a73666f2d2a833bc126f2c08d514db53e3aa0ebe85a9920b7572d4a','2024-08-12 09:48:40.347000','STEP_1','zzzzz','thread_GbwJkt6qGCvpULrAI8lrdABb',NULL),(19,'asst_aXc0aDLazT1kge9q4ngwemK7',NULL,NULL,'136680',_binary '','https://bardisue.store/v1/conferences/ba59c5ed42d54330c3c28d717ab7c9623587567df44362041cdcf5624d44412d',0,'ba59c5ed42d54330c3c28d717ab7c9623587567df44362041cdcf5624d44412d','2024-08-12 09:52:35.733000','WAIT','비상대책회의','thread_xL2hIg1N4L9ABh90q8XTcgAj',NULL),(20,'asst_ShFboWwVzWhxqnNbCZIks6m7',NULL,NULL,'614642',_binary '\0','https://bardisue.store/v1/conferences/c87a8095f88e4b6ed95bbe68134de982340c6cb2fb004520f557d4183180f4f7',0,'c87a8095f88e4b6ed95bbe68134de982340c6cb2fb004520f557d4183180f4f7','2024-08-12 09:53:07.421000','WAIT','회의 다시 시작','thread_6j9KH1zTzyDsxvXdHm0ap0yl',NULL),(21,'asst_JiYY108kEeWFK9fGdDb8A5yD',NULL,NULL,'822228',_binary '','https://bardisue.store/v1/conferences/c84f0df8ca1b123b5cb73e3f8641fe3be53fe0a1ed25f4eaedf770fe9bbdfe65',0,'c84f0df8ca1b123b5cb73e3f8641fe3be53fe0a1ed25f4eaedf770fe9bbdfe65','2024-08-12 09:53:44.141000','WAIT','회의 주제 1','thread_kvob0TxVfq6WLnB2PVv091Qv',NULL),(22,'asst_iAjaSHNLOXprMlik31WLMBgb',NULL,NULL,'558382',_binary '','https://bardisue.store/v1/conferences/b68c54f111e4dc6732dce4a96c8217a6d5704442ffd1b53731443cc76f590deb',0,'b68c54f111e4dc6732dce4a96c8217a6d5704442ffd1b53731443cc76f590deb','2024-08-12 10:21:40.458000','WAIT','회의 시작','thread_FBJZkULd1RHAqnjjo63WGP6d',NULL),(23,'asst_aquxX5vjJii8JdUKNMyBKgmH',NULL,NULL,'394961',_binary '','https://bardisue.store/v1/conferences/5c00b7c144908fb9f0bc20ea8576528796b8544e27d21e087bc23fab57ffa812',0,'5c00b7c144908fb9f0bc20ea8576528796b8544e27d21e087bc23fab57ffa812','2024-08-12 10:23:35.681000','WAIT','회의22222','thread_tvcQ3EX1QDTuOO07wnJ7E6SH',NULL),(24,'asst_ZG9NFiiPVEIpCwk87V6M3yAj',NULL,NULL,'063982',_binary '','https://bardisue.store/v1/conferences/4411281e5c5e7161d987b17453ac2e522d0adfcf7d4a8b5633fa7127110b258f',0,'4411281e5c5e7161d987b17453ac2e522d0adfcf7d4a8b5633fa7127110b258f','2024-08-12 10:24:13.583000','WAIT','23123231','thread_b6Jy4bBS3shsI5UpjP20uBvI',NULL),(25,'asst_D2mKNoeWrlUrYlMf4upZ1fO4',NULL,NULL,'077162',_binary '','https://bardisue.store/v1/conferences/651eab224b2f24bacf2eccd61924033f344425075e2c8f225064160b9df958f4',0,'651eab224b2f24bacf2eccd61924033f344425075e2c8f225064160b9df958f4','2024-08-12 10:25:29.622000','WAIT','123213','thread_jvtwXImUufPv5vKygQ61mQYK',NULL),(26,'asst_fXv0DTrN8LrkHrZNjy4O7GII',NULL,NULL,'673616',_binary '','https://bardisue.store/v1/conferences/aff532fd8b46e0f3816e9440f66c1bdd4ec90f8f8dbab2c374e29794c24044ab',0,'aff532fd8b46e0f3816e9440f66c1bdd4ec90f8f8dbab2c374e29794c24044ab','2024-08-12 16:18:32.669000','WAIT','1','thread_W4NxiZf1IUlx9zpnpwNHzKEA',NULL),(27,'asst_kmO537sVdvhjf2L2dBmDx5FP',NULL,NULL,'022004',_binary '','https://bardisue.store/v1/conferences/0a7f3cc89b64804e5a6318f6792a0bbe218851bf68c1daebe3d9fc86e2d611e1',0,'0a7f3cc89b64804e5a6318f6792a0bbe218851bf68c1daebe3d9fc86e2d611e1','2024-08-12 20:58:55.456000','WAIT','1','thread_cWSJ2EdH3guBUH8AW3mB7bas',NULL),(28,'asst_CL72uPN3Jgnprlx9VcoNXhYd',NULL,NULL,'787627',_binary '','https://bardisue.store/v1/conferences/c18a0728b6b3b6a51b6ef7aa947d9359b6f2c407f5fa9af1ccd38fea2590f99c',0,'c18a0728b6b3b6a51b6ef7aa947d9359b6f2c407f5fa9af1ccd38fea2590f99c','2024-08-12 21:24:49.102000','STEP_3','1','thread_9NJf0jzrLrqHHnwVY1MPyzq6',NULL),(29,'asst_grYEG7aok2AogExkWSrnL68N',NULL,NULL,'974437',_binary '','https://bardisue.store/v1/conferences/d86ad4e71002ba91b4061424f0175ca778b8db24a991b197a067376c16f651fd',0,'d86ad4e71002ba91b4061424f0175ca778b8db24a991b197a067376c16f651fd','2024-08-13 12:41:54.280000','STEP_2','1','thread_uOVLTK7X6VmRFuMPwkrfWMsa',NULL),(30,'asst_BEKTjPVzw7hon6eymnuA49g7',NULL,NULL,'723466',_binary '','https://bardisue.store/v1/conferences/932cf7e40047d7a374d4e68f61b070fb5bc58bf06fa5478811ee2132da112935',0,'932cf7e40047d7a374d4e68f61b070fb5bc58bf06fa5478811ee2132da112935','2024-08-13 16:12:35.792000','STEP_2','1','thread_ooLevkwShVn7u1FVe4sHcSVq',NULL);
/*!40000 ALTER TABLE `conference_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `locked` bit(1) DEFAULT NULL,
  `login_fail_count` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') DEFAULT NULL,
  `social` enum('Google','Kakao','None') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKmbmcqelty0fbrvxp1q58dn57t` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'foryou0084@gmail.com',_binary '',0,'정경원','$2a$10$olfqiwtsnCLXCnB2Th8.8.BrdIobJsC/TW27PrD2dDQDIsAY28omC','null','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImZvcnlvdTAwODRAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJzb2NpYWwiOiJOb25lIiwiaWF0IjoxNzIzNDI1OTE2LCJleHAiOjE3MjQ2MzU1MTZ9.0tt2-DTGC3SZYHtZ3Uwsl8-8-g3Nr0hWGzIOuIq5kbE','USER','None'),(2,'qwert1234@naver.com',_binary '',0,'가나다','$2a$10$JFy3Ic00fxcYhMpVnX.lG.cZADeUKdu.LNFBfjvyJ4loOIntnUPrW','https://brain-content-profile.s3.ap-northeast-2.amazonaws.com/profile-image/qwert1234@naver.com.png','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InF3ZXJ0MTIzNEBuYXZlci5jb20iLCJyb2xlIjoiVVNFUiIsInNvY2lhbCI6Ik5vbmUiLCJpYXQiOjE3MjM1MjA1MDksImV4cCI6MTcyNDczMDEwOX0.pJ1MINxV_6EjnOR6w1zN71b9KUAv8JlS_aH-4MJ2OAQ','USER','None'),(3,'gkgkgk@naver.com',_binary '',0,'정원경','$2a$10$lhA2WbUoT.y4e2SuQaL24eYvloG0Uvtnd5NfVG3BdO99aiZuIrxtu','null','eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImdrZ2tna0BuYXZlci5jb20iLCJyb2xlIjoiVVNFUiIsInNvY2lhbCI6Ik5vbmUiLCJpYXQiOjE3MjMzNTI1ODgsImV4cCI6MTcyNDU2MjE4OH0.zA9s9taI7XA6Zh1FnBnaVAIX9pfEVcBIqvfoXTEDmPs','USER','None');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_history`
--

DROP TABLE IF EXISTS `member_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_history` (
  `nickname` varchar(255) DEFAULT NULL,
  `orders` int(11) DEFAULT NULL,
  `role` enum('CHIEF','MEMBER') DEFAULT NULL,
  `status` enum('COME','OUT') DEFAULT NULL,
  `room_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  PRIMARY KEY (`member_id`,`room_id`),
  KEY `FKqqjd3ynbb5k72b1iyrxkuh5rx` (`room_id`),
  CONSTRAINT `FK6r1xictt2o0lflrxh9fs4mrtd` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`),
  CONSTRAINT `FKqqjd3ynbb5k72b1iyrxkuh5rx` FOREIGN KEY (`room_id`) REFERENCES `conference_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_history`
--

LOCK TABLES `member_history` WRITE;
/*!40000 ALTER TABLE `member_history` DISABLE KEYS */;
INSERT INTO `member_history` VALUES ('밥먹는 고양이',0,'CHIEF','OUT',2,1),('장난치는 시바견',0,'CHIEF','OUT',6,1),('시끄러운 시바견',1,'MEMBER','OUT',8,1),('자상한 기린',2,'MEMBER','OUT',9,1),('울먹이는 시바견',2,'MEMBER','OUT',11,1),('느린 돌고래',1,'MEMBER','OUT',12,1),('빠른 코끼리',2,'MEMBER','OUT',13,1),('배고픈 기린',0,'CHIEF','OUT',14,1),('당황한 사자',0,'CHIEF','OUT',15,1),('의심스러운 호랑이',0,'CHIEF','OUT',16,1),('무서운 코끼리',0,'CHIEF','OUT',17,1),('부끄러운 돌고래',0,'CHIEF','OUT',18,1),('사랑스러운 사자',0,'CHIEF','OUT',19,1),('외로운 돌고래',0,'CHIEF','OUT',21,1),('겁많은 호랑이',0,'CHIEF','OUT',22,1),('경계하는 시바견',0,'CHIEF','OUT',23,1),('활기찬 호랑이',0,'CHIEF','OUT',24,1),('안락한 사자',2,'CHIEF','OUT',25,1),('부끄러운 시바견',0,'CHIEF','OUT',26,1),('굶주린 호랑이',0,'CHIEF','OUT',27,1),('지루한 돌고래',0,'CHIEF','OUT',28,1),('조용한 코끼리',0,'CHIEF','OUT',29,1),('활기찬 시바견',0,'CHIEF','OUT',30,1),('화난 강아지',0,'MEMBER','OUT',1,2),('당황한 돌고래',0,'CHIEF','OUT',3,2),('집중하는 원숭이',0,'CHIEF','OUT',4,2),('냉정한 사자',0,'CHIEF','OUT',5,2),('냉정한 사자',0,'CHIEF','OUT',7,2),('온순한 호랑이',1,'MEMBER','OUT',18,2),('우울한 호랑이',0,'MEMBER','OUT',22,2),('지루한 사자',0,'MEMBER','OUT',25,2),('행복한 사자',1,'MEMBER','OUT',29,2),('신나는 시바견',0,'MEMBER','OUT',6,3),('호기심 많은 돌고래',0,'CHIEF','OUT',8,3),('외로운 코끼리',0,'CHIEF','OUT',9,3),('활기찬 호랑이',0,'CHIEF','OUT',10,3),('빠른 코끼리',0,'CHIEF','OUT',11,3),('조용한 시바견',0,'CHIEF','OUT',12,3),('기운없는 사자',0,'CHIEF','OUT',13,3);
/*!40000 ALTER TABLE `member_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_it`
--

DROP TABLE IF EXISTS `post_it`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_it` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `member_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtppjufdxxr4tmo2i63utgtpps` (`member_id`),
  KEY `FKla803dqet6ncw8uscfljsrctb` (`room_id`),
  CONSTRAINT `FKla803dqet6ncw8uscfljsrctb` FOREIGN KEY (`room_id`) REFERENCES `conference_room` (`id`),
  CONSTRAINT `FKtppjufdxxr4tmo2i63utgtpps` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_it`
--

LOCK TABLES `post_it` WRITE;
/*!40000 ALTER TABLE `post_it` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_it` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `round_board`
--

DROP TABLE IF EXISTS `round_board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `round_board` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `current_round` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqxuiuq2arnprgv3sj08le7fbf` (`room_id`),
  CONSTRAINT `FKqxuiuq2arnprgv3sj08le7fbf` FOREIGN KEY (`room_id`) REFERENCES `conference_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `round_board`
--

LOCK TABLES `round_board` WRITE;
/*!40000 ALTER TABLE `round_board` DISABLE KEYS */;
/*!40000 ALTER TABLE `round_board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `round_post_it`
--

DROP TABLE IF EXISTS `round_post_it`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `round_post_it` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `isai` bit(1) NOT NULL,
  `last3` bit(1) NOT NULL,
  `last9` bit(1) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `member_id` int(11) DEFAULT NULL,
  `persona` text DEFAULT NULL,
  `swot` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7tcug78hdu62eqnfuj4fxmail` (`room_id`),
  KEY `FKh8tqyrvwtkhce9gt7odqacol9` (`member_id`),
  CONSTRAINT `FK7tcug78hdu62eqnfuj4fxmail` FOREIGN KEY (`room_id`) REFERENCES `conference_room` (`id`),
  CONSTRAINT `FKh8tqyrvwtkhce9gt7odqacol9` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `round_post_it`
--

LOCK TABLES `round_post_it` WRITE;
/*!40000 ALTER TABLE `round_post_it` DISABLE KEYS */;
INSERT INTO `round_post_it` VALUES (19,'bbb',_binary '\0',_binary '',_binary '',2,NULL,NULL,NULL),(20,'beta',_binary '\0',_binary '\0',_binary '',2,NULL,NULL,NULL),(21,'eee',_binary '\0',_binary '\0',_binary '',2,NULL,NULL,NULL),(22,'aaa',_binary '\0',_binary '',_binary '',2,NULL,NULL,NULL),(23,'alpha',_binary '\0',_binary '\0',_binary '',2,NULL,NULL,NULL),(24,'ddd',_binary '\0',_binary '\0',_binary '',2,NULL,NULL,NULL),(25,'ccc',_binary '\0',_binary '',_binary '',2,NULL,NULL,NULL),(26,'fff',_binary '\0',_binary '\0',_binary '',2,NULL,NULL,NULL),(27,'gamma',_binary '\0',_binary '\0',_binary '',2,NULL,NULL,NULL),(28,'ㄱㅎㅈㅎㄷㄱ',_binary '\0',_binary '\0',_binary '',10,NULL,NULL,NULL),(29,'저희 주제 1에 대한 추가 아이디어는 \"효율적인 시간 관리를 위한 도구와 기술에 대해 논의해보는 것\"입니다.',_binary '\0',_binary '\0',_binary '',10,NULL,NULL,NULL),(30,'둘리\n',_binary '\0',_binary '\0',_binary '',11,NULL,NULL,NULL),(31,'크랙',_binary '\0',_binary '\0',_binary '',11,NULL,NULL,NULL),(32,'포티\n',_binary '\0',_binary '\0',_binary '',11,NULL,NULL,NULL),(33,'포르쉐\n',_binary '\0',_binary '\0',_binary '',11,NULL,NULL,NULL),(34,'카페 라떼',_binary '\0',_binary '',_binary '',13,NULL,NULL,NULL),(35,'카페모카',_binary '\0',_binary '',_binary '',13,NULL,NULL,NULL),(36,'돌체 라떼',_binary '\0',_binary '',_binary '',13,NULL,NULL,NULL),(37,'아메리카노',_binary '\0',_binary '\0',_binary '',13,NULL,NULL,NULL);
/*!40000 ALTER TABLE `round_post_it` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vote` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `score` int(11) DEFAULT NULL,
  `vote_type` enum('FINAL','MIDDLE') DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `postit_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8abau3408e3aqanevk60dx92w` (`room_id`),
  KEY `FK6qodrxyku5l8wutk72ysr8olb` (`postit_id`),
  CONSTRAINT `FK6qodrxyku5l8wutk72ysr8olb` FOREIGN KEY (`postit_id`) REFERENCES `round_post_it` (`id`),
  CONSTRAINT `FK8abau3408e3aqanevk60dx92w` FOREIGN KEY (`room_id`) REFERENCES `conference_room` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vote`
--

LOCK TABLES `vote` WRITE;
/*!40000 ALTER TABLE `vote` DISABLE KEYS */;
INSERT INTO `vote` VALUES (19,1,'FINAL',2,19),(20,5,'MIDDLE',2,20),(21,5,'MIDDLE',2,21),(22,1,'FINAL',2,22),(23,3,'MIDDLE',2,23),(24,3,'MIDDLE',2,24),(25,1,'FINAL',2,25),(26,1,'MIDDLE',2,26),(27,1,'MIDDLE',2,27),(28,5,'MIDDLE',10,28),(29,3,'MIDDLE',10,29),(30,15,'MIDDLE',11,30),(31,9,'MIDDLE',11,31),(32,2,'MIDDLE',11,32),(33,1,'MIDDLE',11,33),(34,13,'FINAL',13,34),(35,7,'FINAL',13,35),(36,6,'FINAL',13,36),(37,1,'MIDDLE',13,37);
/*!40000 ALTER TABLE `vote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'brain'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-16  1:26:00
