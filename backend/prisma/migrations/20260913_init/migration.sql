-- CreateEnum
CREATE TYPE "DietaryTag" AS ENUM ('VEG', 'NON_VEG', 'EGG_LESS');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER');

-- CreateTable
CREATE TABLE "MessPlan" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sheetName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuDay" (
    "id" TEXT NOT NULL,
    "messPlanId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealSlot" (
    "id" TEXT NOT NULL,
    "menuDayId" TEXT NOT NULL,
    "mealType" "MealType" NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "mealSlotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dietaryTag" "DietaryTag",
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessPlan_code_key" ON "MessPlan"("code");

-- CreateIndex
CREATE INDEX "MenuDay_date_idx" ON "MenuDay"("date");

-- CreateIndex
CREATE UNIQUE INDEX "MenuDay_messPlanId_date_key" ON "MenuDay"("messPlanId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MealSlot_menuDayId_mealType_key" ON "MealSlot"("menuDayId", "mealType");

-- CreateIndex
CREATE INDEX "MenuItem_mealSlotId_idx" ON "MenuItem"("mealSlotId");

-- AddForeignKey
ALTER TABLE "MenuDay" ADD CONSTRAINT "MenuDay_messPlanId_fkey" FOREIGN KEY ("messPlanId") REFERENCES "MessPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealSlot" ADD CONSTRAINT "MealSlot_menuDayId_fkey" FOREIGN KEY ("menuDayId") REFERENCES "MenuDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_mealSlotId_fkey" FOREIGN KEY ("mealSlotId") REFERENCES "MealSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
