-- --------------------------------------------------------
-- Hôte :                        127.0.0.1
-- Version du serveur:           10.1.34-MariaDB - Source distribution
-- SE du serveur:                Linux
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Listage de la structure de la table askc. Competition
DROP TABLE IF EXISTS `Competition`;
CREATE TABLE IF NOT EXISTS `Competition` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `choosen_formula_id` int(10) unsigned NOT NULL,
  `date` date NOT NULL,
  `name` varchar(255) NOT NULL,
  `place` varchar(255) DEFAULT NULL,
  `owner` varchar(45) DEFAULT NULL,
  `type` varchar(10) NOT NULL,
  `locked` tinyint(3) unsigned DEFAULT '0',
  `locked_fighter_list` tinyint(3) unsigned DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `choosen_formula_id_idx` (`choosen_formula_id`),
  CONSTRAINT `choosen_formula_id` FOREIGN KEY (`choosen_formula_id`) REFERENCES `Formula` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table askc. CompetitionFighter
DROP TABLE IF EXISTS `CompetitionFighter`;
CREATE TABLE IF NOT EXISTS `CompetitionFighter` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `competition_id` int(10) unsigned NOT NULL,
  `team_id` int(10) unsigned DEFAULT NULL,
  `license` varchar(16) NOT NULL,
  `name` varchar(255) NOT NULL,
  `grade` varchar(15) DEFAULT NULL,
  `club` varchar(255) DEFAULT NULL,
  `birthdate` date NOT NULL,
  `is_present` tinyint(3) unsigned DEFAULT '0',
  `is_favorite` tinyint(3) unsigned DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_UNIQUE` (`competition_id`,`license`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `Competition_id_idx` (`competition_id`),
  KEY `fk_CompetitionFighter_CompetitionTeam1_idx` (`team_id`),
  CONSTRAINT `competition_fighter_id_competition` FOREIGN KEY (`competition_id`) REFERENCES `Competition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_CompetitionFighter_CompetitionTeam1` FOREIGN KEY (`team_id`) REFERENCES `CompetitionTeam` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table askc. CompetitionFormula
DROP TABLE IF EXISTS `CompetitionFormula`;
CREATE TABLE IF NOT EXISTS `CompetitionFormula` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `competition_id` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idCompetitionFormula_UNIQUE` (`id`),
  KEY `idCompetition_idx` (`competition_id`),
  CONSTRAINT `competition_formula_id_competition` FOREIGN KEY (`competition_id`) REFERENCES `Competition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table askc. CompetitionTeam
DROP TABLE IF EXISTS `CompetitionTeam`;
CREATE TABLE IF NOT EXISTS `CompetitionTeam` (
  `id` int(10) unsigned NOT NULL,
  `competition_id` int(10) unsigned NOT NULL,
  `name` varchar(150) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `competition_id_UNIQUE` (`competition_id`),
  KEY `fk_CompetitionTeam_Competition1_idx` (`competition_id`),
  CONSTRAINT `fk_CompetitionTeam_Competition1` FOREIGN KEY (`competition_id`) REFERENCES `Competition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table askc. Formula
DROP TABLE IF EXISTS `Formula`;
CREATE TABLE IF NOT EXISTS `Formula` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `component_list` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table askc. Meta
DROP TABLE IF EXISTS `Meta`;
CREATE TABLE IF NOT EXISTS `Meta` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `metaable_id` int(10) unsigned NOT NULL,
  `metaable` varchar(45) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `meta_UNIQUE` (`metaable_id`,`metaable`,`key`,`value`),
  KEY `idMetaable_idx` (`metaable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table askc. Pool
DROP TABLE IF EXISTS `Pool`;
CREATE TABLE IF NOT EXISTS `Pool` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `competition_formula` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `competition_formula_UNIQUE` (`competition_formula`),
  KEY `fk_Pool_CompetitionFormula1_idx` (`competition_formula`),
  CONSTRAINT `fk_Pool_CompetitionFormula1` FOREIGN KEY (`competition_formula`) REFERENCES `CompetitionFormula` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table askc. PoolEntry
DROP TABLE IF EXISTS `PoolEntry`;
CREATE TABLE IF NOT EXISTS `PoolEntry` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pool_id` int(10) unsigned NOT NULL,
  `entriable_id` int(10) unsigned NOT NULL,
  `entriable` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `pool_id_UNIQUE` (`pool_id`),
  UNIQUE KEY `pool_entry_unique` (`pool_id`,`entriable_id`,`entriable`),
  KEY `fk_PoolEntry_Pool1_idx` (`pool_id`),
  CONSTRAINT `fk_PoolEntry_Pool1` FOREIGN KEY (`pool_id`) REFERENCES `Pool` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
