-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "mrp" REAL,
    "discount" INTEGER,
    "fabric" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 5,
    "color" TEXT NOT NULL,
    "occasion" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 4.8,
    "reviewsCount" INTEGER NOT NULL DEFAULT 12,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT,
    "design" TEXT,
    "borderType" TEXT,
    "blouseType" TEXT,
    "zari" TEXT,
    "colorFamily" TEXT,
    "sizes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("category", "color", "createdAt", "description", "fabric", "featured", "id", "images", "occasion", "price", "rating", "reviewsCount", "stock", "title", "updatedAt") SELECT "category", "color", "createdAt", "description", "fabric", "featured", "id", "images", "occasion", "price", "rating", "reviewsCount", "stock", "title", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
