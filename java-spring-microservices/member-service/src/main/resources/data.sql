CREATE TABLE IF NOT EXISTS member
(
    id                UUID PRIMARY KEY,
    name              VARCHAR(255)        NOT NULL,
    email             VARCHAR(255) UNIQUE NOT NULL,
    address           VARCHAR(255)        NOT NULL,
    date_of_birth     DATE                NOT NULL,
    joined_date       DATE                NOT NULL,
    membership_plan   VARCHAR(20)         NOT NULL,
    membership_status VARCHAR(20)         NOT NULL
);

INSERT INTO member
    (id, name, email, address, date_of_birth, joined_date,
     membership_plan, membership_status)
SELECT '123e4567-e89b-12d3-a456-426614174000',
       'Alex Rivera',
       'alex.rivera@example.com',
       '123 Main St, Springfield',
       '1988-06-15',
       '2024-01-10',
       'PREMIUM',
       'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM member
                  WHERE id = '123e4567-e89b-12d3-a456-426614174000');

INSERT INTO member
    (id, name, email, address, date_of_birth, joined_date,
     membership_plan, membership_status)
SELECT '123e4567-e89b-12d3-a456-426614174001',
       'Jordan Lee',
       'jordan.lee@example.com',
       '456 Elm St, Shelbyville',
       '1992-09-23',
       '2023-12-01',
       'BASIC',
       'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM member
                  WHERE id = '123e4567-e89b-12d3-a456-426614174001');

INSERT INTO member
    (id, name, email, address, date_of_birth, joined_date,
     membership_plan, membership_status)
SELECT '123e4567-e89b-12d3-a456-426614174002',
       'Taylor Morgan',
       'taylor.morgan@example.com',
       '789 Oak St, Capital City',
       '1985-03-12',
       '2022-06-20',
       'VIP',
       'PAUSED'
WHERE NOT EXISTS (SELECT 1 FROM member
                  WHERE id = '123e4567-e89b-12d3-a456-426614174002');

INSERT INTO member
    (id, name, email, address, date_of_birth, joined_date,
     membership_plan, membership_status)
SELECT '123e4567-e89b-12d3-a456-426614174003',
       'Casey Brown',
       'casey.brown@example.com',
       '321 Pine St, Springfield',
       '1990-11-30',
       '2023-05-14',
       'PREMIUM',
       'CANCELLED'
WHERE NOT EXISTS (SELECT 1 FROM member
                  WHERE id = '123e4567-e89b-12d3-a456-426614174003');

INSERT INTO member
    (id, name, email, address, date_of_birth, joined_date,
     membership_plan, membership_status)
SELECT '123e4567-e89b-12d3-a456-426614174004',
       'Riley Davis',
       'riley.davis@example.com',
       '654 Maple St, Shelbyville',
       '1995-02-05',
       '2024-03-01',
       'VIP',
       'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM member
                  WHERE id = '123e4567-e89b-12d3-a456-426614174004');
