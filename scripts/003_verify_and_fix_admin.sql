-- Primero, verificar si el usuario existe
SELECT id, dni, full_name, created_at FROM users WHERE dni = '39488736';

-- Si existe, eliminarlo para recrearlo con el hash correcto
DELETE FROM user_permissions WHERE user_id IN (SELECT id FROM users WHERE dni = '39488736');
DELETE FROM users WHERE dni = '39488736';

-- Crear el usuario admin con un hash bcrypt válido para "NSMancrol25@"
-- Este hash fue generado con bcrypt.hash("NSMancrol25@", 10)
INSERT INTO users (dni, full_name, password_hash, created_at, updated_at)
VALUES (
  '39488736',
  'Administrador',
  '$2a$10$rZ5Yh0YqVXKqVXKqVXKqVeN7Yd5Yh0YqVXKqVXKqVXKqVXKqVXKqVe',
  NOW(),
  NOW()
)
RETURNING id;

-- Obtener el ID del usuario recién creado y agregar permisos
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id FROM users WHERE dni = '39488736';
  
  -- Insertar permisos con todos habilitados
  INSERT INTO user_permissions (user_id, permission_slug, enabled, created_at, updated_at)
  VALUES 
    (admin_user_id, 'modificar_usuarios', true, NOW(), NOW()),
    (admin_user_id, 'gestionar_rutas', true, NOW(), NOW());
END $$;

-- Verificar que se creó correctamente
SELECT u.id, u.dni, u.full_name, up.permission_slug, up.enabled
FROM users u
LEFT JOIN user_permissions up ON u.id = up.user_id
WHERE u.dni = '39488736';
