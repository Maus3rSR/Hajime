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

## Update models file (in `src/renderer/database/models`) of the Sequelize ORM

Install & use the package https://github.com/sequelize/sequelize-auto

**IMPORTANT**
- Use `--skip-tables` options to skip `Formula` definition which won't change and contain manual updates. If you must update, do it manually according to the Sequelize documentation about model definition
- You should remove all `created_at`, `updated_at`, `deleted_at` fields from the definition, because it's manually handled by Sequelize, and it'll provide an notNull violation when you create an instance of the model

## Migrations (UNDER DEVELOPMENT...)

Migrations when the software install updates with https://sequelize.org/master/manual/migrations.html