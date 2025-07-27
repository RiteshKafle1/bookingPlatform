-- CreateTable
CREATE TABLE "Property" (
    "property_id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "propName" TEXT NOT NULL,
    "propDesc" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "amenities" TEXT[],
    "images" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("property_id")
);
