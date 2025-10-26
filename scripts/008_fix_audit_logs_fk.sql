-- Fix foreign key constraint on audit_logs to allow user deletion
-- This preserves audit history while allowing users to be deleted

-- Drop the existing foreign key constraint
ALTER TABLE public.audit_logs 
  DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;

-- Recreate the foreign key with ON DELETE SET NULL
-- This allows users to be deleted while preserving audit logs
ALTER TABLE public.audit_logs 
  ADD CONSTRAINT audit_logs_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.users(id) 
  ON DELETE SET NULL;

-- Add a comment to explain the behavior
COMMENT ON CONSTRAINT audit_logs_user_id_fkey ON public.audit_logs IS 
  'When a user is deleted, their audit logs are preserved with user_id set to NULL';
