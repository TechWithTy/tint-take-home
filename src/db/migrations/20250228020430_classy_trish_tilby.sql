ALTER TABLE "policies" DROP CONSTRAINT "policies_user_id_underwriting_details_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "policies" ADD COLUMN "requested_refund" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "underwriting_details_id" uuid;--> statement-breakpoint
ALTER TABLE "policies" ADD CONSTRAINT "policies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_underwriting_details_id_underwriting_details_id_fk" FOREIGN KEY ("underwriting_details_id") REFERENCES "public"."underwriting_details"("id") ON DELETE cascade ON UPDATE no action;