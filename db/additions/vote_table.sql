-- f1sp.vote definition

CREATE TABLE `vote` (
  `id` int NOT NULL AUTO_INCREMENT,
  `race_id` int NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `driversInCrash` mediumtext,
  `fastestLap` varchar(256) DEFAULT NULL,
  `firstLapCrash` tinyint(1) DEFAULT '0',
  `finishOrder` mediumtext,
  `rain` tinyint(1) DEFAULT '0',
  `blueTires` tinyint(1) DEFAULT '0',
  `greenTires` tinyint(1) DEFAULT '0',
  `reds` int DEFAULT NULL,
  `yellows` int DEFAULT NULL,
  `createdDT` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;