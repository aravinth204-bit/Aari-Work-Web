CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"mobile" varchar(20) NOT NULL,
	"work_type" varchar(80) NOT NULL,
	"function_date" varchar(40),
	"budget" varchar(60),
	"city" varchar(120),
	"message" text,
	"status" varchar(30) DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"category" varchar(80) NOT NULL,
	"image_url" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
