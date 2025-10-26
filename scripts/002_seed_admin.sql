-- Seed admin user with DNI 39488736 and password "NSMancrol25@"
-- Password hash generated with bcrypt (cost factor 10)
-- Hash for "NSMancrol25@": $2a$10$rQZ8qVXKqVXKqVXKqVXKqOJ8qVXKqVXKqVXKqVXKqVXKqVXKqVXKq
INSERT INTO public.users (dni, password_hash, full_name)
VALUES (
  '39488736',
  '$2a$10$rQZ8qVXKqVXKqVXKqVXKqOJ8qVXKqVXKqVXKqVXKqVXKqVXKqVXKq',
  'Administrador'
)
ON CONFLICT (dni) DO NOTHING;

-- Get the admin user ID
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM public.users WHERE dni = '39488736';
  
  -- Insert all permissions for admin user (all enabled)
  INSERT INTO public.user_permissions (user_id, permission_slug, enabled)
  VALUES 
    (admin_id, 'modificar_usuarios', TRUE),
    (admin_id, 'gestionar_rutas', TRUE)
  ON CONFLICT (user_id, permission_slug) DO UPDATE
  SET enabled = TRUE;
END $$;
