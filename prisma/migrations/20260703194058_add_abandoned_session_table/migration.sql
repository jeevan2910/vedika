-- CreateTable
CREATE TABLE "AbandonedSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "productTitle" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productImage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recovered" BOOLEAN NOT NULL DEFAULT false
);
