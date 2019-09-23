# ASKC Database

## Description

* `structure.mwb` is a MySQL Workbench file with the description of the DB structure (tables, keys, types...)
* `scheme.pdf` is an export of the Workbench file

## Per driver

### Mariadb / Mysql

#### Export a valid SQL file from Workbench

* Open the export window with `CTRL + MAJ + G`
* Options to check :
  * Generate DROP statements
  * Sort tables alphabetically
  * Ommit schema qualifier in Object Names
  * Generate USE statements
* Edit the exported file and remove all `VISIBLE` and `UNVISIBLE` keywords

### SQLite (UNDER DEVELOPMENT...)

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

## Update models file of the Sequelize ORM

In `src/renderer/database/models`, according to the the documentation https://sequelize.org/master/manual/models-definition.html

## Migrations (UNDER DEVELOPMENT...)

Migrations when the software install updates with https://sequelize.org/master/manual/migrations.html