USE `your_project_db`;

-- Save extra rows so they can be recovered if needed.
CREATE TABLE IF NOT EXISTS `entries_duplicate_backup` AS
SELECT * FROM `entries` WHERE 1 = 0;

INSERT INTO `entries_duplicate_backup`
SELECT extra.*
FROM `entries` AS extra
WHERE EXISTS (
    SELECT 1
    FROM `entries` AS original
    WHERE LOWER(TRIM(original.email)) = LOWER(TRIM(extra.email))
      AND original.id < extra.id
);

-- Keep the earliest row (lowest id) for each email and remove later repeats.
DELETE extra
FROM `entries` AS extra
JOIN `entries` AS original
  ON LOWER(TRIM(original.email)) = LOWER(TRIM(extra.email))
 AND original.id < extra.id;

-- Add the safeguard unless this migration has already created it.
SET @email_index_exists = (
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'entries'
      AND index_name = 'uq_entries_email'
);
SET @add_email_index_sql = IF(
    @email_index_exists = 0,
    'ALTER TABLE `entries` ADD UNIQUE KEY `uq_entries_email` (`email`)',
    'SELECT ''Unique email index already exists'' AS status'
);
PREPARE add_email_index FROM @add_email_index_sql;
EXECUTE add_email_index;
DEALLOCATE PREPARE add_email_index;
