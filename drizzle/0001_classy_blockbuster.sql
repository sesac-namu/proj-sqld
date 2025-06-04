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
	`answer` text NOT NULL,
	CONSTRAINT `quiz_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `test_quiz` (
	`testId` int NOT NULL,
	`quizId` int NOT NULL,
	`userChoice` int,
	`solvedAt` datetime,
	CONSTRAINT `test_quiz_testId` PRIMARY KEY(`testId`)
);
--> statement-breakpoint
CREATE TABLE `test` (
	`id` int AUTO_INCREMENT NOT NULL,
	`score` int,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`finishedAt` datetime,
	`userId` varchar(36) NOT NULL,
	CONSTRAINT `test_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `test_quiz` ADD CONSTRAINT `test_quiz_testId_test_id_fk` FOREIGN KEY (`testId`) REFERENCES `test`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_quiz` ADD CONSTRAINT `test_quiz_quizId_quiz_id_fk` FOREIGN KEY (`quizId`) REFERENCES `quiz`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test` ADD CONSTRAINT `test_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;