-- CreateTable
CREATE TABLE "Metas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "metaable" TEXT NOT NULL,
    "metaable_id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "Lockings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lockable" TEXT NOT NULL,
    "lockable_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Master',
    "scope" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "Formulas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "is_qualification" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "MartialArts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Scores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "martialArtId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Scores_martialArtId_fkey" FOREIGN KEY ("martialArtId") REFERENCES "MartialArts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Competitions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "martialArtId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "place" TEXT,
    "owner" TEXT,
    "start_date" DATETIME,
    "end_date" DATETIME,
    "type" TEXT NOT NULL DEFAULT 'Individual',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    CONSTRAINT "Competitions_martialArtId_fkey" FOREIGN KEY ("martialArtId") REFERENCES "MartialArts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "competition_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    CONSTRAINT "Categories_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competitions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "formula_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "reversed_marking_board" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    CONSTRAINT "Stages_formula_id_fkey" FOREIGN KEY ("formula_id") REFERENCES "Formulas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Stages_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stage_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    CONSTRAINT "Groups_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "Stages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rounds" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stage_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    CONSTRAINT "Rounds_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "Stages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rounds_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Encounters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "round_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "team1_id" INTEGER NOT NULL,
    "team2_id" INTEGER NOT NULL,
    "winner_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    CONSTRAINT "Encounters_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "Rounds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Encounters_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Encounters_team1_id_fkey" FOREIGN KEY ("team1_id") REFERENCES "Teams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Encounters_team2_id_fkey" FOREIGN KEY ("team2_id") REFERENCES "Teams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Encounters_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "Teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fights" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "encounter_id" INTEGER NOT NULL,
    "fighter1_id" INTEGER NOT NULL,
    "fighter2_id" INTEGER NOT NULL,
    "winner_id" INTEGER,
    "sudden_death" BOOLEAN NOT NULL DEFAULT false,
    "added_manually" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    CONSTRAINT "Fights_encounter_id_fkey" FOREIGN KEY ("encounter_id") REFERENCES "Encounters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fights_fighter1_id_fkey" FOREIGN KEY ("fighter1_id") REFERENCES "Fighters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fights_fighter2_id_fkey" FOREIGN KEY ("fighter2_id") REFERENCES "Fighters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fights_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "Teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScoreFights" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fightId" INTEGER NOT NULL,
    "score_type_id" INTEGER NOT NULL,
    "from_fighter_id" INTEGER NOT NULL,
    "on_fighter_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    CONSTRAINT "ScoreFights_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fights" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ScoreFights_score_type_id_fkey" FOREIGN KEY ("score_type_id") REFERENCES "Scores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ScoreFights_from_fighter_id_fkey" FOREIGN KEY ("from_fighter_id") REFERENCES "Fighters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ScoreFights_on_fighter_id_fkey" FOREIGN KEY ("on_fighter_id") REFERENCES "Fighters" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    "competition_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "country_id" INTEGER,
    CONSTRAINT "Teams_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competitions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Teams_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Teams_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fighters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "licence" TEXT,
    "club" TEXT,
    "grade" INTEGER,
    "birthday" DATETIME,
    "is_valid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    "team_id" INTEGER,
    "country_id" INTEGER,
    "competition_id" INTEGER NOT NULL,
    CONSTRAINT "Fighters_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Fighters_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Fighters_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competitions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Countries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "iso" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Metas_metaable_metaable_id_idx" ON "Metas"("metaable", "metaable_id");

-- CreateIndex
CREATE INDEX "Lockings_lockable_lockable_id_idx" ON "Lockings"("lockable", "lockable_id");
