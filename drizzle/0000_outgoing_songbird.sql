CREATE TABLE `care_relationships` (
	`id` text PRIMARY KEY NOT NULL,
	`professional_user_id` text NOT NULL,
	`patient_user_id` text NOT NULL,
	`patient_profile_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`professional_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`patient_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "care_relationships_status_check" CHECK("care_relationships"."status" in ('active', 'inactive')),
	CONSTRAINT "care_relationships_distinct_users_check" CHECK("care_relationships"."professional_user_id" <> "care_relationships"."patient_user_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `care_relationships_professional_patient_unique` ON `care_relationships` (`professional_user_id`,`patient_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `care_relationships_patient_profile_unique` ON `care_relationships` (`patient_profile_id`);--> statement-breakpoint
CREATE INDEX `idx_care_relationships_professional` ON `care_relationships` (`professional_user_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_care_relationships_patient` ON `care_relationships` (`patient_user_id`,`status`);--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`relationship_id` text NOT NULL,
	`created_at` text NOT NULL,
	`last_message_at` text,
	FOREIGN KEY (`relationship_id`) REFERENCES `care_relationships`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `conversations_relationship_unique` ON `conversations` (`relationship_id`);--> statement-breakpoint
CREATE TABLE `message_receipts` (
	`message_id` text NOT NULL,
	`recipient_user_id` text NOT NULL,
	`delivered_at` text NOT NULL,
	`read_at` text,
	PRIMARY KEY(`message_id`, `recipient_user_id`),
	FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipient_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_message_receipts_unread` ON `message_receipts` (`recipient_user_id`,`read_at`,`delivered_at`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`sender_user_id` text NOT NULL,
	`recipient_user_id` text NOT NULL,
	`client_message_id` text NOT NULL,
	`context` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`sender_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`recipient_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "messages_context_check" CHECK("messages"."context" in ('care-plan', 'check-in', 'diary', 'general')),
	CONSTRAINT "messages_distinct_users_check" CHECK("messages"."sender_user_id" <> "messages"."recipient_user_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `messages_sender_client_message_unique` ON `messages` (`sender_user_id`,`client_message_id`);--> statement-breakpoint
CREATE INDEX `idx_messages_conversation_history` ON `messages` (`conversation_id`,`created_at`,`id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `idx_sessions_user_id` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`display_name` text NOT NULL,
	`role` text NOT NULL,
	`patient_id` text,
	`password_hash` text NOT NULL,
	`password_salt` text NOT NULL,
	`password_iterations` integer NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "users_role_check" CHECK("users"."role" in ('professional', 'patient')),
	CONSTRAINT "users_status_check" CHECK("users"."status" in ('active', 'blocked')),
	CONSTRAINT "users_patient_scope_check" CHECK(("users"."role" = 'patient' and "users"."patient_id" is not null) or ("users"."role" = 'professional' and "users"."patient_id" is null))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);