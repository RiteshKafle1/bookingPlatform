-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'vendor', 'admin');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL,
    "verification_token" TEXT NOT NULL,
    "verification_token_expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");
