-- 009_reset_database.sql (versión completa)

-- 1) Limpiar tablas
TRUNCATE TABLE public.audit_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.user_permissions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;

-- 2) Crear admin
-- OJO: usá acá el hash real de "1234"
INSERT INTO public.users (dni, password_hash, full_name)
VALUES ('39488736', '1234', 'NS')
ON CONFLICT (dni) DO UPDATE SET password_hash = '1234', full_name = 'NS';


-- 3) Asignar permisos al admin
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM public.users WHERE dni = '39488736';

  IF admin_id IS NOT NULL THEN
    INSERT INTO public.user_permissions (user_id, permission_slug, enabled)
    VALUES 
      (admin_id, 'modificar_usuarios', TRUE),
      (admin_id, 'gestionar_rutas', TRUE)
    ON CONFLICT (user_id, permission_slug) DO UPDATE
    SET enabled = TRUE;
  END IF;
END $$;
