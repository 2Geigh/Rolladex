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
INSERT INTO "Users" ("id", "username", "passwordHash", "passwordSalt", "email", "profile_image_id", "birthday")
VALUES
    (1, 'jesus_christ', 'HASH_JESUS_123', 'SALT_JESUS_123', 'jesus@nazareth.ps', 1, '0000-12-25'),
    (2, 'party_pal_alice', 'HASH_ALICE_123', 'SALT_ALICE_123', 'alice@wonderland.gb', NULL, NULL),
    (3, 'bob_minimal', 'HASH_BOB_123', 'SALT_BOB_123', NULL, NULL, NULL);


------------------------------------------------------------
-- Friends
------------------------------------------------------------
INSERT INTO "Friends" ("id", "name", "birthday", "profile_image_id")
VALUES
    (1, 'Simon Peter', '0000-01-01', 2),
    (2, 'John Egbert', '0000-01-02', 3),
    (3, 'James son of Zebedee', '0000-01-03', 4),
    (4, 'Andrew', '0000-01-04', 5),
    (5, 'Philip', '0000-01-05', 6),
    (6, 'Bartholomew', '0000-01-06', 7),
    (7, 'Matthew', '0000-01-07', 8),
    (8, 'Thomas', '0000-01-08', 9),
    (9, 'James son of Alphaeus', '0000-01-09', 10),
    (10, 'Thaddaeus', '0000-01-10', 11),
    (11, 'Simon the Zealot', '0000-01-11', 12),
    (12, 'Judas Iscariot', '0000-01-12', 13),
    (13, 'Fun Alice Friend', NULL, 14);


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




-- WITH FriendsInteractions AS (
--     SELECT 
--         Friends.id AS friend_id,
--         Friends.birthday AS friend_birthday,
--         Friends.created_at,
--         Friends.name AS friend_name,
--         Relationships.relationship_tier,
--         Images.filepath AS profile_image_path,
--         Interactions.id AS interaction_id,
--         Interactions.interaction_type,
--         Interactions.date AS interaction_date
--     FROM Friends
--     LEFT JOIN Images ON Images.id = Friends.profile_image_id
--     LEFT JOIN Relationships ON Relationships.friend_id = Friends.id
--     LEFT JOIN Interactions ON Relationships.user_id = Interactions.user_id
--     WHERE Relationships.user_id = 2
-- ),
-- RecentInteractions AS (
--     SELECT 
--         friend_id,
--         interaction_id,
--         interaction_type,
--         interaction_date,
--         ROW_NUMBER() OVER(PARTITION BY friend_id ORDER BY interaction_date DESC) AS rn
--     FROM FriendsInteractions
-- ),
-- RecentMeetups AS (
--     SELECT 
--         friend_id,
--         interaction_id AS meetup_id,
--         interaction_date AS meetup_date,
--         ROW_NUMBER() OVER(PARTITION BY friend_id ORDER BY interaction_date DESC) AS rn
--     FROM FriendsInteractions
--     WHERE interaction_type = 'meetup'
-- )

-- SELECT 
--     fi.friend_id,
--     fi.friend_birthday,
--     fi.created_at,
--     fi.friend_name,
--     fi.relationship_tier,
--     fi.profile_image_path,
--     ri.interaction_id,
--     ri.interaction_type,
--     ri.interaction_date,
--     rm.meetup_id,
--     rm.meetup_date
-- FROM 
--     FriendsInteractions fi
-- LEFT JOIN RecentInteractions ri ON fi.friend_id = ri.friend_id AND ri.rn = 1
-- LEFT JOIN RecentMeetups rm ON fi.friend_id = rm.friend_id AND rm.rn = 1
-- GROUP BY 
--     fi.friend_id, fi.friend_birthday, fi.created_at, fi.friend_name, fi.relationship_tier, fi.profile_image_path
-- ORDER BY 
--     fi.friend_name ASC;