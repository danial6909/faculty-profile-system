-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PROFESSOR');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('TEXT', 'TEXTAREA', 'DATE', 'IMAGE', 'LINK');

-- CreateEnum
CREATE TYPE "SectionPlacement" AS ENUM ('TOP_MENU', 'SIDEBAR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "academicRank" TEXT,
    "avatarUrl" TEXT,
    "themeColor" TEXT NOT NULL DEFAULT '#1b2a4a',
    "themeFont" TEXT NOT NULL DEFAULT 'vazirmatn',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRepeatable" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "parentSectionId" INTEGER,
    "placement" "SectionPlacement" NOT NULL DEFAULT 'TOP_MENU',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionField" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "labelFa" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "fieldType" "FieldType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SectionField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorSectionData" (
    "id" SERIAL NOT NULL,
    "professorId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "groupIndex" INTEGER NOT NULL DEFAULT 0,
    "fieldKey" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'fa',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessorSectionData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_userId_key" ON "Professor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_slug_key" ON "Professor"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Section_key_key" ON "Section"("key");

-- CreateIndex
CREATE UNIQUE INDEX "SectionField_sectionId_key_key" ON "SectionField"("sectionId", "key");

-- CreateIndex
CREATE INDEX "ProfessorSectionData_professorId_sectionId_idx" ON "ProfessorSectionData"("professorId", "sectionId");

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_parentSectionId_fkey" FOREIGN KEY ("parentSectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionField" ADD CONSTRAINT "SectionField_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorSectionData" ADD CONSTRAINT "ProfessorSectionData_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorSectionData" ADD CONSTRAINT "ProfessorSectionData_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
