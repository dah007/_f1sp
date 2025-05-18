-- f1sp.vote definition

CREATE TABLE `vote` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `fastestLap` varchar(100) DEFAULT NULL,
  `firstLapCrash` tinyint(1) DEFAULT '0',
  `finishOrder` varchar(100) DEFAULT NULL,
  `rain` tinyint(1) DEFAULT '0',
  `blueTires` tinyint(1) DEFAULT '0',
  `greenTires` tinyint(1) DEFAULT '0',
  `reds` int DEFAULT NULL,
  `yellows` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;