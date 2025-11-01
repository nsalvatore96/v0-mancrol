-- ============================================================
--  Script: 009_reset_database.sql
--  Objetivo: Limpiar completamente la base y crear un usuario admin inicial
-- ============================================================

-- 1. Eliminar datos existentes
TRUNCATE TABLE public.audit_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.user_permissions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;

-- 2. Crear usuario administrador inicial
INSERT INTO public.users (full_name, dni, password_hash)
VALUES ('Administrador', '39488736', '1234');

-- 3. Confirmar
SELECT * FROM public.users;
