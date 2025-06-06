CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` text,
	`password` text,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` int NOT NULL,
	`tags` text,
	`title` text NOT NULL,
	`content_img` text,
	`content_text` text,
	`choices_1` text NOT NULL,
	`choices_2` text NOT NULL,
	`choices_3` text NOT NULL,
	`choices_4` text NOT NULL,
	`multiple` boolean NOT NULL DEFAULT false,
	`answer_explanation` text NOT NULL DEFAULT (''),
	CONSTRAINT `quiz_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_answer` (
	`quiz_id` int NOT NULL,
	`answer` int NOT NULL,
	CONSTRAINT `quiz_answer_quiz_id` PRIMARY KEY(`quiz_id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `test_quiz` (
	`test_id` int NOT NULL,
	`quiz_id` int NOT NULL,
	`user_choice` int,
	`solved_at` datetime,
	CONSTRAINT `test_quiz_test_id` PRIMARY KEY(`test_id`)
);
--> statement-breakpoint
CREATE TABLE `test` (
	`id` int AUTO_INCREMENT NOT NULL,
	`score` int,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`finished_at` datetime,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `test_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL,
	`image` text,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_answer` ADD CONSTRAINT `quiz_answer_quiz_id_quiz_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_quiz` ADD CONSTRAINT `test_quiz_test_id_test_id_fk` FOREIGN KEY (`test_id`) REFERENCES `test`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_quiz` ADD CONSTRAINT `test_quiz_quiz_id_quiz_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test` ADD CONSTRAINT `test_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;