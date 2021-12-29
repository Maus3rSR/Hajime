-- DropIndex
DROP INDEX "Lockings_lockable_lockable_id_idx";

-- DropIndex
DROP INDEX "Metas_metaable_metaable_id_idx";

-- CreateIndex
CREATE INDEX "Lockings_lockable_lockable_id_idx" ON "Lockings"("lockable", "lockable_id");

-- CreateIndex
CREATE INDEX "Metas_metaable_metaable_id_idx" ON "Metas"("metaable", "metaable_id");
