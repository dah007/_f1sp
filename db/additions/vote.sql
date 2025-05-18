-- f1sp.vote definition

CREATE TABLE `vote` (
  `id` int NOT NULL AUTO_INCREMENT,
  `race_id` int NOT NULL,
  `email` int DEFAULT NULL,
  -- `drivers` MEDIUMTEXT DEFAULT NULL,
  `driversInCrash` MEDIUMTEXT DEFAULT NULL,
  `fastestLap` varchar(256) DEFAULT NULL,
  `firstLapCrash` tinyint(1) DEFAULT '0',
  `finishOrder` MEDIUMTEXT DEFAULT NULL,
  `rain` tinyint(1) DEFAULT '0',
  `blueTires` tinyint(1) DEFAULT '0',
  `greenTires` tinyint(1) DEFAULT '0',
  `reds` int DEFAULT NULL,
  `yellows` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;