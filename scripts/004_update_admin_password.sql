-- Este script actualiza la contraseña del administrador
-- Primero ejecuta generate-admin-hash.ts para obtener el hash correcto
-- Luego reemplaza el hash a continuación con el generado

-- IMPORTANTE: Reemplaza el hash a continuación con el generado por generate-admin-hash.ts
UPDATE users 
SET password_hash = '$2a$10$REPLACE_WITH_GENERATED_HASH'
WHERE dni = '39488736';

-- Verificar que se actualizó correctamente
SELECT dni, full_name, password_hash 
FROM users 
WHERE dni = '39488736';
