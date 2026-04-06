-- ============================================
-- Fix: Update system events to use proper user_id
-- ============================================

-- Update Pteroda Daily Crypto Analysis to use pteroda user_id
UPDATE calendar_events
SET user_id = 'pteroda'
WHERE title ILIKE '%Pteroda%';

-- Update Session Cleanup to use system user_id
UPDATE calendar_events
SET user_id = 'system'
WHERE title = 'Session Cleanup';

-- Verify the changes
SELECT title, user_id FROM calendar_events ORDER BY created_at DESC LIMIT 10;