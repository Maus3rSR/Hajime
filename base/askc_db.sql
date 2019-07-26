BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `Formula` (
	`idformula`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`name`	TEXT,
	`component_list`	TEXT
);
CREATE TABLE IF NOT EXISTS `CompetitionTree` (
	`idcompetitiontree`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`competition_id`	INTEGER,
	`dismiss_favorite`	TEXT,
	`third_place_match`	INTEGER,
	`locked`	INTEGER,
	FOREIGN KEY(`competition_id`) REFERENCES `Competition`(`idcompetition`)
);
CREATE TABLE IF NOT EXISTS `CompetitionPool` (
	`idcompetitionpool`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`competition_id`	INTEGER,
	`number_of_qualified_fighter`	INTEGER,
	`number_of_pool`	INTEGER,
	`number_of_entry_per_pool`	INTEGER,
	`dismiss_favorite`	INTEGER,
	`locked`	INTEGER,
	FOREIGN KEY(`competition_id`) REFERENCES `Competition`(`idcompetition`)
);
CREATE TABLE IF NOT EXISTS `CompetitionFormula` (
	`idcompetitionformula`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`competition_id`	INTEGER,
	`element_id`	TEXT,
	`element_type`	TEXT,
	FOREIGN KEY(`competition_id`) REFERENCES `Competition`(`idcompetition`)
);
CREATE TABLE IF NOT EXISTS `CompetitionFighter` (
	`license`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`birthday`	TEXT,
	`grade`	TEXT,
	`club`	TEXT,
	`team`	TEXT,
	`is_present`	INTEGER,
	`competition_id`	INTEGER,
	FOREIGN KEY(`competition_id`) REFERENCES `Competition`(`idcompetition`)
);
CREATE TABLE IF NOT EXISTS `Competition` (
	`idcompetition`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`name`	TEXT,
	`date`	TEXT,
	`place`	TEXT,
	`owner`	TEXT,
	`type`	TEXT,
	`locked`	INTEGER,
	`locked_fighter_list`	INTEGER,
	`choosen_formula_id`	INTEGER,
	FOREIGN KEY(`choosen_formula_id`) REFERENCES `Formula`(`idformula`)
);
COMMIT;
