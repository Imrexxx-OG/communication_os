-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'routine',
    "phases" JSONB NOT NULL,
    "completedCount" INTEGER NOT NULL,
    "skippedCount" INTEGER NOT NULL,
    "durationPlanned" INTEGER NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LadderRung" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LadderRung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExposureLog" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "rungId" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "predictedAnxiety" INTEGER NOT NULL,
    "actualBefore" INTEGER NOT NULL,
    "actualAfter" INTEGER NOT NULL,
    "difference" INTEGER NOT NULL,
    "freezeCount" INTEGER NOT NULL,
    "englishOnly" BOOLEAN NOT NULL,
    "recovered" BOOLEAN NOT NULL,
    "recoveryMethod" TEXT NOT NULL DEFAULT '',
    "evidence" TEXT[],
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExposureLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reflection" (
    "moduleNum" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reflection_pkey" PRIMARY KEY ("moduleNum")
);

-- CreateTable
CREATE TABLE "ModuleCompletion" (
    "moduleNum" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModuleCompletion_pkey" PRIMARY KEY ("moduleNum")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "currentDay" INTEGER NOT NULL DEFAULT 1,
    "currentWeek" INTEGER NOT NULL DEFAULT 1,
    "lastBackupAt" TIMESTAMP(3),

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_date_idx" ON "Session"("date");

-- CreateIndex
CREATE INDEX "LadderRung_order_idx" ON "LadderRung"("order");

-- CreateIndex
CREATE INDEX "ExposureLog_rungId_date_idx" ON "ExposureLog"("rungId", "date");

-- AddForeignKey
ALTER TABLE "ExposureLog" ADD CONSTRAINT "ExposureLog_rungId_fkey" FOREIGN KEY ("rungId") REFERENCES "LadderRung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
