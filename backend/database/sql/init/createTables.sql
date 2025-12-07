CREATE TABLE IF NOT EXISTS "Friends" (
	"id" INTEGER NOT NULL UNIQUE,
	"name" TEXT NOT NULL,
	"last_meetup_date" TEXT,
	"last_interaction_date" TEXT,
	"birthday" TEXT,
	"profile_image_id" INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY ("profile_image_id") REFERENCES "Images"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "UsersFriends" (
	"id" INTEGER NOT NULL UNIQUE,
	"user_id" INTEGER NOT NULL,
	"friend_id" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("friend_id") REFERENCES "Friends"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("user_id") REFERENCES "Users"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "Users" (
	"id" INTEGER NOT NULL UNIQUE,
	"username" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	"email" TEXT,
	"profile_image_id" INTEGER,
	"birthday" TEXT,
	"usersettings_id" INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY ("profile_image_id") REFERENCES "Images"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("usersettings_id") REFERENCES "UserSettings"("user_id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "Images" (
	"id" INTEGER NOT NULL UNIQUE,
	"filepath" TEXT,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "Interactions" (
	"id" INTEGER NOT NULL UNIQUE,
	"date" TEXT NOT NULL,
	"user_id" INTEGER NOT NULL,
	"friend_id" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("user_id") REFERENCES "Users"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("friend_id") REFERENCES "Friends"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "Meetups" (
	"id" INTEGER NOT NULL UNIQUE,
	"date" TEXT,
	"organizer_id" INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY ("organizer_id") REFERENCES "Users"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "MeetupsAttendees" (
	"id" INTEGER NOT NULL UNIQUE,
	"meetup_id" INTEGER,
	"friend_id" INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY ("meetup_id") REFERENCES "Meetups"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("friend_id") REFERENCES "Friends"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "Settings" (
	"id" INTEGER NOT NULL UNIQUE,
	"recievesNotifications_id" INTEGER,
	"ui_theme" INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY ("recievesNotifications_id") REFERENCES "recievesNotifications"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "UserSettings" (
	"id" INTEGER NOT NULL UNIQUE,
	"user_id" INTEGER,
	"settings_id" INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY ("settings_id") REFERENCES "Settings"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "recievesNotifications" (
	"id" INTEGER NOT NULL UNIQUE,
	"email" INTEGER,
	"push_notifications" INTEGER,
	"sms" INTEGER,
	PRIMARY KEY("id")
);
