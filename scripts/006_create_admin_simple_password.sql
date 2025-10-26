-- Eliminar usuario admin existente
DELETE FROM user_permissions WHERE user_id IN (SELECT id FROM users WHERE dni = '39488736');
DELETE FROM users WHERE dni = '39488736';

-- Crear usuario admin con contraseña simple "admin123"
-- Hash bcrypt válido para "admin123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (dni, full_name, password_hash, created_at, updated_at)
VALUES (
  '39488736',
  'Administrador',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  NOW(),
  NOW()
);

-- Asignar todos los permisos al admin
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
