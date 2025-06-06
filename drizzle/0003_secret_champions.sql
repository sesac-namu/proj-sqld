ALTER TABLE `quiz_answer` RENAME COLUMN `quizId` TO `quiz_id`;--> statement-breakpoint
ALTER TABLE `test_quiz` RENAME COLUMN `testId` TO `test_id`;--> statement-breakpoint
ALTER TABLE `test_quiz` RENAME COLUMN `quizId` TO `quiz_id`;--> statement-breakpoint
ALTER TABLE `test_quiz` RENAME COLUMN `userChoice` TO `user_choice`;--> statement-breakpoint
ALTER TABLE `test_quiz` RENAME COLUMN `solvedAt` TO `solved_at`;--> statement-breakpoint
ALTER TABLE `test` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `test` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `test` RENAME COLUMN `finishedAt` TO `finished_at`;--> statement-breakpoint
ALTER TABLE `test` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `quiz_answer` DROP FOREIGN KEY `quiz_answer_quizId_quiz_id_fk`;
--> statement-breakpoint
ALTER TABLE `test_quiz` DROP FOREIGN KEY `test_quiz_testId_test_id_fk`;
--> statement-breakpoint
ALTER TABLE `test_quiz` DROP FOREIGN KEY `test_quiz_quizId_quiz_id_fk`;
--> statement-breakpoint
ALTER TABLE `test` DROP FOREIGN KEY `test_userId_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_answer` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `test_quiz` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `quiz_answer` ADD PRIMARY KEY(`quiz_id`);--> statement-breakpoint
ALTER TABLE `test_quiz` ADD PRIMARY KEY(`test_id`);--> statement-breakpoint
ALTER TABLE `test_quiz` ADD PRIMARY KEY(`quiz_id`);--> statement-breakpoint
ALTER TABLE `quiz_answer` ADD CONSTRAINT `quiz_answer_quiz_id_quiz_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_quiz` ADD CONSTRAINT `test_quiz_test_id_test_id_fk` FOREIGN KEY (`test_id`) REFERENCES `test`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_quiz` ADD CONSTRAINT `test_quiz_quiz_id_quiz_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test` ADD CONSTRAINT `test_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;