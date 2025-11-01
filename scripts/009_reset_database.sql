-- Script para restablecer completamente la base de datos
-- Elimina todos los datos y crea solo el usuario administrador inicial

-- Eliminar todos los datos existentes
DELETE FROM public.audit_logs;
DELETE FROM public.user_permissions;
DELETE FROM public.users;

-- Insertar usuario administrador con contraseña "1234"
INSERT INTO public.users (full_name, dni, password_hash)
VALUES ('Administrador', '39488736', '1234');

-- Obtener el ID del usuario administrador
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM public.users WHERE dni = '39488736';
  
  -- Asignar todos los permisos al administrador
  INSERT INTO public.user_permissions (user_id, permission_slug, enabled)
  VALUES 
    (admin_id, 'modificar_usuarios', true),
    (admin_id, 'gestionar_rutas', true);
    
  -- Registrar en auditoría
  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
  VALUES (admin_id, 'reset_database', 'system', admin_id, 'Base de datos restablecida con usuario administrador inicial');
END $$;
