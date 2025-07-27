/*
  Warnings:

  - The primary key for the `Property` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `propDesc` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `propName` on the `Property` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `property_desc` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `property_name` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `property_id` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Property" DROP CONSTRAINT "Property_pkey",
DROP COLUMN "propDesc",
DROP COLUMN "propName",
ADD COLUMN     "property_desc" TEXT NOT NULL,
ADD COLUMN     "property_name" TEXT NOT NULL,
DROP COLUMN "property_id",
ADD COLUMN     "property_id" UUID NOT NULL,
ADD CONSTRAINT "Property_pkey" PRIMARY KEY ("property_id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "Vendor" (
    "vendor_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("vendor_id")
);

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("vendor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
