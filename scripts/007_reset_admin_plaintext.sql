-- Eliminar usuario existente y crear uno nuevo con contraseña en texto plano
DELETE FROM user_permissions WHERE user_id IN (SELECT id FROM users WHERE dni = '39488736');
DELETE FROM users WHERE dni = '39488736';

-- Insertar usuario admin con contraseña en texto plano
INSERT INTO users (dni, full_name, password_hash, created_at, updated_at)
VALUES (
  '39488736',
  'Administrador',
  'NSMancrol25@',  -- Contraseña en texto plano
  NOW(),
  NOW()
);

-- Obtener el ID del usuario recién creado y agregar permisos
INSERT INTO user_permissions (user_id, permission_slug, enabled, created_at, updated_at)
SELECT 
  id,
  unnest(ARRAY['modificar_usuarios', 'gestionar_rutas']),
  true,
  NOW(),
  NOW()
FROM users WHERE dni = '39488736';
