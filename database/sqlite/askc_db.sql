BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `Formula` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`name`	TEXT,
	`component_list`	TEXT
);
CREATE TABLE IF NOT EXISTS `CompetitionTree` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`competition_id`	INTEGER,
	`dismiss_favorite`	TEXT,
	`third_place_match`	INTEGER,
	`locked`	INTEGER,
	FOREIGN KEY(`competition_id`) REFERENCES `Competition`(`id`)
);
CREATE TABLE IF NOT EXISTS `CompetitionPool` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`competition_id`	INTEGER INDEX,
	`number_of_qualified_fighter`	INTEGER,
	`number_of_pool`	INTEGER,
	`number_of_entry_per_pool`	INTEGER,
	`dismiss_favorite`	INTEGER,
	`locked`	INTEGER,
	FOREIGN KEY(`competition_id`) REFERENCES `Competition`(`id`)
);
CREATE TABLE IF NOT EXISTS `CompetitionFormula` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`competition_id`	INTEGER INDEX,
	`element_id`	INTEGER INDEX,
	`element_type`	TEXT INDEX,
	FOREIGN KEY(`competition_id`) REFERENCES `Competition`(`id`)
);
CREATE TABLE IF NOT EXISTS `CompetitionFighter` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`license`	INTEGER NOT NULL UNIQUE INDEX,
	`competition_id`	INTEGER INDEX,
	`birthdate`	TEXT,
	`grade`	TEXT,
	`club`	TEXT,
	`team`	TEXT,
	`is_present`	INTEGER,
	FOREIGN KEY(`competition_id`) REFERENCES `Competition`(`id`)
);
CREATE TABLE IF NOT EXISTS `Competition` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`choosen_formula_id`	INTEGER INDEX,
	`name`	TEXT,
	`date`	TEXT,
	`place`	TEXT,
	`owner`	TEXT,
	`type`	TEXT,
	`locked`	INTEGER,
	`locked_fighter_list`	INTEGER,
	FOREIGN KEY(`choosen_formula_id`) REFERENCES `Formula`(`id`)
);
COMMIT;
