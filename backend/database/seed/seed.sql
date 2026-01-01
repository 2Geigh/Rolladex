-- Enable foreign keys (for SQLite)
PRAGMA foreign_keys = ON;


------------------------------------------------------------
-- Images
------------------------------------------------------------
INSERT INTO "Images" ("filepath")
VALUES
  ('/images/jesus_profile.png'),
  ('/images/peter_profile.png'),
  ('/images/john_profile.png'),
  ('/images/james_profile.png'),
  ('/images/andrew_profile.png'),
  ('/images/philip_profile.png'),
  ('/images/bartholomew_profile.png'),
  ('/images/matthew_profile.png'),
  ('/images/thomas_profile.png'),
  ('/images/james_son_of_alphaeus_profile.png'),
  ('/images/thaddaeus_profile.png'),
  ('/images/simon_the_zealot_profile.png'),
  ('/images/judas_iscariot_profile.png'),
  ('/images/alice_profile.png');


------------------------------------------------------------
-- NotificationPreferences
------------------------------------------------------------
INSERT INTO "NotificationPreferences" ("email", "sms", "pushNotification")
VALUES 
    -- Jesus: email + sms + push
    (1, 1, 1),
    -- Alice: push
    (0, 0, 1),
    -- Bob: nothing
    (0, 0, 0);    


------------------------------------------------------------
-- Users
------------------------------------------------------------
INSERT INTO "Users" ("username", "passwordHash", "passwordSalt", "email", "profile_image_id", "birthday")
VALUES
    -- User 1: Jesus, full info
    ('jesus_christ', 'HASH_JESUS_123', 'SALT_JESUS_123', 'jesus@example.com', 1, '0000-12-25'),
    -- User 2: some optional info
    ('party_pal_alice', 'HASH_ALICE_123', 'SALT_ALICE_123', 'alice@example.com', NULL, NULL),
    -- User 3: bare minimum
    ('bob_minimal', 'HASH_BOB_123', 'SALT_BOB_123', NULL, NULL, NULL);


------------------------------------------------------------
-- Friends (12 for Jesus, 3 shared with Alice)
------------------------------------------------------------
INSERT INTO "Friends" ("name", "birthday", "profile_image_id")
VALUES
    ('Simon Peter', '0000-01-01', 2),
    ('John', '0000-01-02', 3),
    ('James son of Zebedee', '0000-01-03', 4),
    ('Andrew', '0000-01-04', 5),
    ('Philip', '0000-01-05', 6),
    ('Bartholomew', '0000-01-06', 7),
    ('Matthew', '0000-01-07', 8),
    ('Thomas', '0000-01-08', 9),
    ('James son of Alphaeus', '0000-01-09', 10),
    ('Thaddaeus', '0000-01-10', 11),
    ('Simon the Zealot', '0000-01-11', 12),
    ('Judas Iscariot', '0000-01-12', 13),
    -- Extra friend mainly for Alice tests
    ('Fun Alice Friend', NULL, 14);

------------------------------------------------------------
-- UsersFriends
------------------------------------------------------------
-- Jesus (user 1) with 12 friends
INSERT INTO "UsersFriends" ("id", "user_id", "friend_id", "relationship_status")
VALUES
  (1, 1, 1, 'close'),
  (2, 1, 2, 'close'),
  (3, 1, 3, 'close'),
  (4, 1, 4, 'close'),
  (5, 1, 5, 'close'),
  (6, 1, 6, 'close'),
  (7, 1, 7, 'close'),
  (8, 1, 8, 'close'),
  (9, 1, 9, 'close'),
  (10, 1, 10, 'close'),
  (11, 1, 11, 'close'),
  (12, 1, 12, 'close');

-- Alice (user 2) with 3 friends (re-using some Friends rows)
INSERT INTO "UsersFriends" ("id", "user_id", "friend_id", "relationship_status")
VALUES
  (13, 2, 1, 'acquaintance'),
  (14, 2, 2, 'acquaintance'),
  (15, 2, 13, 'bestie');

-- Bob (user 3) intentionally has no entries in UsersFriends

------------------------------------------------------------
-- Interactions
------------------------------------------------------------
-- A few interactions between Jesus and his friends
INSERT INTO "Interactions" ("id", "date", "user_id", "friend_id", "interaction_type")
VALUES
  (1, '2024-01-01', 1, 1, 'message'),
  (2, '2024-01-02', 1, 2, 'call'),
  (3, '2024-01-03', 1, 3, 'meetup'),
  (4, '2024-02-01', 2, 1, 'message');

------------------------------------------------------------
-- Meetups
------------------------------------------------------------
INSERT INTO "Meetups" ("id", "date", "location", "name", "organizer_id")
VALUES
  (1, '2024-03-01', 'Galilee', 'Lake Hangout', 1),
  (2, '2024-04-01', 'Jerusalem', 'Passover Dinner', 1),
  (3, '2024-05-01', 'Downtown', 'Alice Game Night', 2);

------------------------------------------------------------
-- MeetupsAttendees
------------------------------------------------------------
INSERT INTO "MeetupsAttendees" ("id", "meetup_id", "friend_id")
VALUES
  -- Lake Hangout
  (1, 1, 1),
  (2, 1, 2),
  (3, 1, 3),
  -- Passover Dinner
  (4, 2, 4),
  (5, 2, 5),
  (6, 2, 6),
  (7, 2, 7),
  (8, 2, 8),
  (9, 2, 9),
  (10, 2, 10),
  (11, 2, 11),
  (12, 2, 12),
  -- Alice Game Night
  (13, 3, 1),
  (14, 3, 13);

------------------------------------------------------------
-- UserSettings
------------------------------------------------------------
INSERT INTO "UserSettings" ("id", "user_id", "NotificationPreferences_id", "ui_theme")
VALUES
  (1, 1, 1, 'light'),
  (2, 2, 2, 'dark'),
  (3, 3, 3, NULL);

------------------------------------------------------------
-- Sessions
------------------------------------------------------------
-- INSERT INTO "Sessions" ("id", "user_id", "session_token", "expires_at", "is_revoked")
-- VALUES
--   (1, 1, 'SESSION_TOKEN_JESUS_1', '2099-12-31 23:59:59', 0),
--   (2, 2, 'SESSION_TOKEN_ALICE_1', '2099-12-31 23:59:59', 0),
--   (3, 3, 'SESSION_TOKEN_BOB_1', '2099-12-31 23:59:59', 1);
