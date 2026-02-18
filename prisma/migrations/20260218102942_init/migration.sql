-- CreateEnum
CREATE TYPE "TestimonialStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "post_slug" TEXT NOT NULL,
    "parent_id" TEXT,
    "author_name" TEXT NOT NULL,
    "author_email" TEXT,
    "content" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,
    "author_title" TEXT,
    "author_company" TEXT,
    "author_email" TEXT,
    "author_url" TEXT,
    "content" TEXT NOT NULL,
    "relationship" TEXT,
    "status" "TestimonialStatus" NOT NULL DEFAULT 'PENDING',
    "display_order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "user_agent" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_sessions" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "messages" JSONB NOT NULL DEFAULT '[]',
    "user_agent" TEXT,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "content_slug" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_views_slug_idx" ON "page_views"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "page_views_slug_fingerprint_key" ON "page_views"("slug", "fingerprint");

-- CreateIndex
CREATE INDEX "comments_post_slug_idx" ON "comments"("post_slug");

-- CreateIndex
CREATE INDEX "comments_parent_id_idx" ON "comments"("parent_id");

-- CreateIndex
CREATE INDEX "testimonials_status_idx" ON "testimonials"("status");

-- CreateIndex
CREATE INDEX "contacts_status_idx" ON "contacts"("status");

-- CreateIndex
CREATE INDEX "contacts_email_idx" ON "contacts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "agent_sessions_session_id_key" ON "agent_sessions"("session_id");

-- CreateIndex
CREATE INDEX "agent_sessions_created_at_idx" ON "agent_sessions"("created_at");

-- CreateIndex
CREATE INDEX "reactions_content_type_content_slug_idx" ON "reactions"("content_type", "content_slug");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_content_type_content_slug_fingerprint_key" ON "reactions"("content_type", "content_slug", "fingerprint");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
