# ASKC Database

## Description

* `structure.mwb` is a MySQL Workbench file with the description of the DB structure (tables, keys, types...)
* `scheme.pdf` is an export of the Workbench file

## Gestion par driver

### Mariadb / Mysql

#### Exporter un fichier SQL valide depuis Workbench

* Open the export window with `CTRL + MAJ + G`
* Options to check :
  * Generate DROP statements
  * Sort tables alphabetically
  * Ommit schema qualifier in Object Names
  * Generate USE statements
* Edit the exported file and remove all `VISIBLE` and `UNVISIBLE` keywords

### SQLite (UNDER DEVELOPEMENT...)

In folder `sqlite`

**Prerequisite** : sqlite3 (the askc_db.sql script is not compliant with sqlite)

* `askc_db` is the sqlite3 database
* `askc_db.sql` is the sql file enabling the tables creations

**In order to create the ASKC database :**

```
~$ cd ~/PathToMyAskcRepo/base
~/PathToMyAskcRepo/base$ sqlite3 askc_db
SQLite version 3.22.0 2018-01-22 18:45:57
Enter ".help" for usage hints.
sqlite> .read askc_db.sql
sqlite> .table
Competition         CompetitionFormula  CompetitionTree   
CompetitionFighter  CompetitionPool     Formula           


.read command execute the askc_db.sql script in order to populate the askc_db database with tables.
.table command checks if the job as been done correctly.
```

## Mise à jour des modèles de l'ORM

Installer et utiliser https://github.com/sequelize/sequelize-auto

## Migrations

Gestion des migrations lors des mises à jour avec https://sequelize.org/master/manual/migrations.html