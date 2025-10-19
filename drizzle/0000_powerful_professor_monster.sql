CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`channel_at_uri` text,
	`author_did` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `messages_channel_idx` ON `messages` (`channel_at_uri`,`created_at`);--> statement-breakpoint
CREATE INDEX `messages_author_idx` ON `messages` (`author_did`);