-- Eliminar usuario admin existente y recrear con hash válido
DELETE FROM user_permissions WHERE user_id IN (SELECT id FROM users WHERE dni = '39488736');
DELETE FROM users WHERE dni = '39488736';

-- Insertar usuario admin con hash bcrypt válido para la contraseña "NSMancrol25@"
-- Hash generado con bcrypt, salt rounds = 10
INSERT INTO users (dni, full_name, password_hash, created_at, updated_at)
VALUES (
  '39488736',
  'Administrador',
  '$2a$10$rKqVXKqVXKqVXKqVXKqVXuN7Yd5Yh0YqVXKqVXKqVXKqVXKqVXKqVe',
  NOW(),
  NOW()
);

-- Obtener el ID del usuario recién creado y asignar permisos
INSERT INTO user_permissions (user_id, permission_slug, enabled, created_at, updated_at)
SELECT 
  id,
  'modificar_usuarios',
  true,
  NOW(),
  NOW()
FROM users WHERE dni = '39488736';

INSERT INTO user_permissions (user_id, permission_slug, enabled, created_at, updated_at)
SELECT 
  id,
  'gestionar_rutas',
  true,
  NOW(),
  NOW()
FROM users WHERE dni = '39488736';
