# Mancrol - Sistema de Administración

Sistema de administración con autenticación por DNI, gestión de usuarios y permisos, desarrollado con Next.js, TypeScript, Tailwind CSS y Supabase.

## Características

- **Autenticación por DNI**: Login con DNI y contraseña (sin email)
- **Gestión de Usuarios**: Alta, edición y baja de usuarios
- **Sistema de Permisos**: Permisos configurables por slug con interfaz de toggles
- **Auditoría**: Registro completo de todas las operaciones del sistema
- **Interfaz Moderna**: UI con shadcn/ui, sidebar y navegación intuitiva
- **Branding Mancrol**: Colores corporativos y tipografía Inter

## Tecnologías

- **Framework**: Next.js 16 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth + bcrypt
- **UI Components**: shadcn/ui

## Requisitos Previos

- Node.js 18+ 
- Cuenta de Supabase
- npm o yarn

## Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone <repository-url>
cd mancrol-admin
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno (ver `.env.example`):
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Ejecutar los scripts de base de datos en orden:
   - `scripts/001_create_schema.sql` - Crea las tablas y políticas RLS
   - `scripts/002_seed_admin.sql` - Crea el usuario administrador

5. Iniciar el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

## Estructura del Proyecto

\`\`\`
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # Autenticación
│   │   └── users/        # Gestión de usuarios
│   ├── dashboard/        # Páginas protegidas
│   │   ├── administracion/
│   │   └── auditoria/
│   ├── login/            # Página de login
│   └── layout.tsx
├── components/           # Componentes React
│   ├── ui/              # Componentes shadcn/ui
│   ├── app-sidebar.tsx
│   ├── app-header.tsx
│   └── ...
├── lib/
│   ├── supabase/        # Clientes Supabase
│   └── auth.ts          # Utilidades de autenticación
├── scripts/             # Scripts SQL
│   ├── 001_create_schema.sql
│   └── 002_seed_admin.sql
└── middleware.ts        # Middleware de autenticación
\`\`\`

## Usuario Administrador por Defecto

- **DNI**: 39488736
- **Contraseña**: NSMancrol25@
- **Permisos**: Todos habilitados

## Permisos del Sistema

- `modificar_usuarios`: Permite crear, editar y eliminar usuarios
- `gestionar_rutas`: Permite administrar rutas del sistema

Los nuevos usuarios se crean con todos los permisos desactivados por defecto.

## Recuperación de Contraseña

El sistema no incluye recuperación automática de contraseña. Los usuarios deben solicitar una nueva contraseña a Administración.

## Auditoría

El sistema registra automáticamente:
- Creación de usuarios
- Edición de usuarios
- Eliminación de usuarios
- Cambios en permisos

Todos los eventos incluyen:
- Usuario que realizó la acción
- Fecha y hora
- Detalles de la operación

## Seguridad

- Contraseñas hasheadas con bcrypt (cost factor 10)
- Row Level Security (RLS) habilitado en todas las tablas
- Middleware de autenticación en todas las rutas protegidas
- Validación de permisos en operaciones sensibles

## Scripts Disponibles

\`\`\`bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter
\`\`\`

## Despliegue

El proyecto está optimizado para despliegue en Vercel:

1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno
3. Desplegar

## Soporte

Para soporte o consultas, contactar a Administración.

## Licencia

Propietario - Mancrol
