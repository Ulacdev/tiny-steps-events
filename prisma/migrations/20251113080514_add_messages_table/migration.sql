/*
  Warnings:

  - You are about to drop the `AccountRegistration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventRegistration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `attendees` on the `ArchivedEvent` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `ArchivedEvent` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `ArchivedEvent` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ArchivedEvent` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ArchivedEvent` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `ArchivedEvent` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ArchivedEvent` table. All the data in the column will be lost.
  - You are about to drop the column `attendees` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Event` table. All the data in the column will be lost.
  - Added the required column `clientName` to the `ArchivedEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventDate` to the `ArchivedEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventStatus` to the `ArchivedEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventTheme` to the `ArchivedEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventTitle` to the `ArchivedEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageType` to the `ArchivedEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `ArchivedEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `ArchivedEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue` to the `ArchivedEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventTheme` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventTitle` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageType` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AccountRegistration_email_key";

-- DropIndex
DROP INDEX "EventRegistration_userId_eventId_key";

-- AlterTable
ALTER TABLE "FinancialRecord" ADD COLUMN "description" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AccountRegistration";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EventRegistration";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Participant";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "systemTitle" TEXT NOT NULL DEFAULT 'Tiny Steps Event MIS',
    "systemEmail" TEXT NOT NULL DEFAULT 'admin@eventmis.com',
    "systemPhone" TEXT NOT NULL DEFAULT '+63 912 345 6789',
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "companyName" TEXT NOT NULL DEFAULT 'Tiny Steps Events',
    "companyAddress" TEXT NOT NULL DEFAULT '123 Event Street, Celebration City, Philippines',
    "businessHours" TEXT NOT NULL DEFAULT 'Mon-Fri: 9AM-6PM, Sat: 9AM-4PM',
    "taxRate" TEXT NOT NULL DEFAULT '12',
    "basePriceBasic" TEXT NOT NULL DEFAULT '15000',
    "basePricePremium" TEXT NOT NULL DEFAULT '25000',
    "basePriceDeluxe" TEXT NOT NULL DEFAULT '35000',
    "additionalGuestFee" TEXT NOT NULL DEFAULT '500',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "reminderDays" TEXT NOT NULL DEFAULT '7',
    "confirmationEmailTemplate" TEXT NOT NULL DEFAULT 'Dear {clientName},

Your event booking for {eventTitle} has been confirmed!

Event Details:
Date: {eventDate}
Time: {eventTime}
Venue: {venue}
Guests: {numberOfGuests}

Total Amount: ₱{totalAmount}

Thank you for choosing Tiny Steps Events!',
    "maxGuestsPerEvent" TEXT NOT NULL DEFAULT '200',
    "minAdvanceBookingDays" TEXT NOT NULL DEFAULT '30',
    "landingPageTitle" TEXT NOT NULL DEFAULT 'Tiny Steps Events',
    "landingPageSubtitle" TEXT NOT NULL DEFAULT 'Creating Magical Moments for Your Special Day',
    "aboutUsTitle" TEXT NOT NULL DEFAULT 'About Tiny Steps Events',
    "aboutUsContent" TEXT NOT NULL DEFAULT 'We specialize in creating unforgettable baby shower experiences with our themed packages designed to celebrate the joy of new beginnings. Our expert team ensures every detail is perfect for your special occasion.',
    "contactEmail" TEXT NOT NULL DEFAULT 'info@tinystepsevents.com',
    "contactPhone" TEXT NOT NULL DEFAULT '+63 912 345 6789',
    "logoUrl" TEXT NOT NULL DEFAULT '/placeholder.svg',
    "titleLogoUrl" TEXT NOT NULL DEFAULT '/placeholder.svg'
);

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "systemTitle" TEXT NOT NULL DEFAULT 'Tiny Steps Event MIS',
    "systemEmail" TEXT NOT NULL DEFAULT 'admin@eventmis.com',
    "systemPhone" TEXT NOT NULL DEFAULT '+63 912 345 6789',
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "companyName" TEXT NOT NULL DEFAULT 'Tiny Steps Events',
    "companyAddress" TEXT NOT NULL DEFAULT '123 Event Street, Celebration City, Philippines',
    "businessHours" TEXT NOT NULL DEFAULT 'Mon-Fri: 9AM-6PM, Sat: 9AM-4PM',
    "taxRate" TEXT NOT NULL DEFAULT '12',
    "basePriceBasic" TEXT NOT NULL DEFAULT '15000',
    "basePricePremium" TEXT NOT NULL DEFAULT '25000',
    "basePriceDeluxe" TEXT NOT NULL DEFAULT '35000',
    "additionalGuestFee" TEXT NOT NULL DEFAULT '500',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "reminderDays" TEXT NOT NULL DEFAULT '7',
    "confirmationEmailTemplate" TEXT NOT NULL DEFAULT 'Dear {clientName},

Your event booking for {eventTitle} has been confirmed!

Event Details:
Date: {eventDate}
Time: {eventTime}
Venue: {venue}
Guests: {numberOfGuests}

Total Amount: ₱{totalAmount}

Thank you for choosing Tiny Steps Events!',
    "maxGuestsPerEvent" TEXT NOT NULL DEFAULT '200',
    "minAdvanceBookingDays" TEXT NOT NULL DEFAULT '30',
    "landingPageTitle" TEXT NOT NULL DEFAULT 'Tiny Steps Events',
    "landingPageSubtitle" TEXT NOT NULL DEFAULT 'Creating Magical Moments for Your Special Day',
    "aboutUsTitle" TEXT NOT NULL DEFAULT 'About Tiny Steps Events',
    "aboutUsContent" TEXT NOT NULL DEFAULT 'We specialize in creating unforgettable baby shower experiences with our themed packages designed to celebrate the joy of new beginnings. Our expert team ensures every detail is perfect for your special occasion.',
    "contactEmail" TEXT NOT NULL DEFAULT 'info@tinystepsevents.com',
    "contactPhone" TEXT NOT NULL DEFAULT '+63 912 345 6789',
    "logoUrl" TEXT NOT NULL DEFAULT '/placeholder.svg',
    "titleLogoUrl" TEXT NOT NULL DEFAULT '/placeholder.svg'
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArchivedEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "contactNumber" TEXT,
    "email" TEXT,
    "eventTitle" TEXT NOT NULL,
    "eventTheme" TEXT NOT NULL,
    "packageType" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "eventTime" TEXT,
    "venue" TEXT NOT NULL,
    "numberOfGuests" INTEGER NOT NULL DEFAULT 50,
    "paymentStatus" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "remarks" TEXT,
    "eventStatus" TEXT NOT NULL,
    "gallery" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "archivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ArchivedEvent" ("archivedAt", "createdAt", "id", "updatedAt") SELECT "archivedAt", "createdAt", "id", "updatedAt" FROM "ArchivedEvent";
DROP TABLE "ArchivedEvent";
ALTER TABLE "new_ArchivedEvent" RENAME TO "ArchivedEvent";
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "contactNumber" TEXT,
    "email" TEXT,
    "eventTitle" TEXT NOT NULL,
    "eventTheme" TEXT NOT NULL,
    "packageType" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "eventTime" TEXT,
    "venue" TEXT NOT NULL,
    "numberOfGuests" INTEGER NOT NULL DEFAULT 50,
    "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
    "totalAmount" REAL NOT NULL DEFAULT 15000,
    "remarks" TEXT,
    "eventStatus" TEXT NOT NULL DEFAULT 'Pending',
    "gallery" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archivedAt" DATETIME
);
INSERT INTO "new_Event" ("archivedAt", "createdAt", "id", "updatedAt") SELECT "archivedAt", "createdAt", "id", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Message" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("body", "createdAt", "id", "read", "recipient", "subject", "type") SELECT "body", "createdAt", "id", "read", "recipient", "subject", "type" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role", "status", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "role", "status", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
