-- Enable foreign keys (for SQLite)
PRAGMA foreign_keys = ON;


------------------------------------------------------------
-- Images
------------------------------------------------------------
INSERT INTO "Images" ("id", "filepath")
VALUES
  (1, '/images/jesus_profile.png'),
  (2, '/images/peter_profile.png'),
  (3, '/images/john_profile.png'),
  (4, '/images/james_profile.png'),
  (5, '/images/andrew_profile.png'),
  (6, '/images/philip_profile.png'),
  (7, '/images/bartholomew_profile.png'),
  (8, '/images/matthew_profile.png'),
  (9, '/images/thomas_profile.png'),
  (10, '/images/james_son_of_alphaeus_profile.png'),
  (11, '/images/thaddaeus_profile.png'),
  (12, '/images/simon_the_zealot_profile.png'),
  (13, '/images/judas_iscariot_profile.png'),
  (14, '/images/alice_profile.png');


------------------------------------------------------------
-- NotificationPreferences
------------------------------------------------------------
INSERT INTO "NotificationPreferences" ("id", "email", "sms", "pushNotification")
VALUES 
    (1, 1, 1, 1),
    (2, 0, 0, 1),
    (3, 0, 0, 0);    


------------------------------------------------------------
-- Users
------------------------------------------------------------
INSERT INTO "Users" ("id", "username", "passwordHash", "passwordSalt", "email", "profile_image_id", "birthday_month", "birthday_day")
VALUES
    (1, 'jesus_christ', 'HASH_JESUS_123', 'SALT_JESUS_123', 'jesus@nazareth.ps', 1, 12, 25),
    (2, 'party_pal_alice', 'HASH_ALICE_123', 'SALT_ALICE_123', 'alice@wonderland.gb', NULL, NULL, NULL),
    (3, 'bob_minimal', 'HASH_BOB_123', 'SALT_BOB_123', NULL, NULL, NULL, NULL);

------------------------------------------------------------
-- Friends
------------------------------------------------------------
INSERT INTO "Friends" ("id", "name", "birthday_month", "birthday_day", "profile_image_id")
VALUES
    (1, 'Simon Peter', 1, 1, 2),
    (2, 'John Egbert', 1, 2, 3),
    (3, 'James son of Zebedee', 1, 3, 4),
    (4, 'Andrew', 1, 4, 5),
    (5, 'Philip', 1, 5, 6),
    (6, 'Bartholomew', 1, 6, 7),
    (7, 'Matthew', 1, 7, 8),
    (8, 'Thomas', 1, 8, 9),
    (9, 'James son of Alphaeus', 1, 9, 10),
    (10, 'Thaddaeus', 1, 10, 11),
    (11, 'Simon the Zealot', 1, 11, 12),
    (12, 'Judas Iscariot', 1, 12, 13),
    (13, 'Fun Alice Friend', NULL, NULL, 14);


------------------------------------------------------------
-- Relationships
------------------------------------------------------------
INSERT INTO "Relationships" ("id", "user_id", "friend_id", "relationship_tier")
VALUES
  (1, 1, 1, 2), (2, 1, 2, 1), (3, 1, 3, 2), (4, 1, 4, 2),
  (5, 1, 5, 2), (6, 1, 6, 2), (7, 1, 7, 2), (8, 1, 8, 2),
  (9, 1, 9, 2), (10, 1, 10, 2), (11, 1, 11, 2), (12, 1, 12, 2),
  (13, 2, 1, 4), (14, 2, 2, 4), (15, 2, 13, 1);


------------------------------------------------------------
-- Interactions
------------------------------------------------------------
-- Each Interaction belongs to a user, but the attendees are linked via InteractionsAttendees
INSERT INTO "Interactions" ("id", "date", "user_id", "interaction_type", "location", "name")
VALUES
  (1, '2025-12-31', 1, 'message', NULL, 'Message with Peter'),
  (2, '2025-12-31', 1, 'call', NULL, 'Call with John'),
  (3, '2024-01-03', 1, 'meetup', NULL, 'Meetup with James'),
  (4, '2025-12-31', 2, 'message', NULL, 'Message with Peter'),
  (5, '2024-03-01', 1, 'meetup', 'Galilee', 'Lake Hangout'),
  (6, '2024-04-01', 1, 'meetup', 'Jerusalem', 'Passover Dinner'),
  (7, '2024-05-01', 2, 'meetup', 'Downtown', 'Alice Game Night');


------------------------------------------------------------
-- InteractionsAttendees
------------------------------------------------------------
INSERT INTO "InteractionsAttendees" ("id", "interaction_id", "friend_id")
VALUES
  -- 1:1 interactions (direct friend participants)
  (1, 1, 1),  -- Message with Peter
  (2, 2, 2),  -- Call with John
  (3, 3, 3),  -- Meetup with James
  (4, 4, 1),  -- Alice ↔ Peter message

  -- Lake Hangout (interaction_id=5)
  (5, 5, 1), (6, 5, 2), (7, 5, 3),

  -- Passover Dinner (interaction_id=6)
  (8, 6, 4), (9, 6, 5), (10, 6, 6), (11, 6, 7),
  (12, 6, 8), (13, 6, 9), (14, 6, 10), (15, 6, 11), (16, 6, 12),

  -- Alice Game Night (interaction_id=7)
  (17, 7, 1), (18, 7, 13);


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
INSERT INTO "Sessions" ("id", "user_id", "session_token", "expires_at", "is_revoked")
VALUES
  (1, 1, 'SESSION_TOKEN_JESUS_ABC', '2026-01-01', 0),
  (2, 2, 'SESSION_TOKEN_ALICE_DEF', '2026-06-01', 0),
  (3, 3, 'SESSION_TOKEN_BOB_GHI', '2026-03-01', 1);
