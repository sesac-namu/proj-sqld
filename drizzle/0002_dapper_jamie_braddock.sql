CREATE TABLE `quiz_answer` (
	`quizId` int NOT NULL,
	`answer` int NOT NULL,
	CONSTRAINT `quiz_answer_quizId` PRIMARY KEY(`quizId`)
);
--> statement-breakpoint
ALTER TABLE `quiz` RENAME COLUMN `answer` TO `answer_explanation`;--> statement-breakpoint
ALTER TABLE `quiz` MODIFY COLUMN `answer_explanation` text NOT NULL DEFAULT ('');--> statement-breakpoint
ALTER TABLE `quiz` ADD `multiple` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_answer` ADD CONSTRAINT `quiz_answer_quizId_quiz_id_fk` FOREIGN KEY (`quizId`) REFERENCES `quiz`(`id`) ON DELETE no action ON UPDATE no action;