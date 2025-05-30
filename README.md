# Tus datos 👥

## 1. Resumen 📘

Tus datos es un proyecto de código abierto que proporciona una plataforma para la gestión y organizacion de eventos.

Publico objetivo:

-   👩‍💻 Emprendedores
-   🚀 Comunidades
-   🏢 Empresa

## 3. Funcionalidades ✨

-   **Registro de usuario**: Permite a los usuarios registrarse y crear un perfil.
-   **Creación de eventos**: Los usuarios pueden crear y gestionar eventos, incluyendo la carga de imágenes y la configuración de detalles del evento.
-   **Exploración de eventos**: Los usuarios pueden explorar eventos creados por otros, con opciones de filtrado y búsqueda.

## 4. Tech Stack 🛠️

**Frontend:** Vite, ReactJS, TailwindCSS, Typescript
**Formularios**: react-hook-form, zod
**Data fetching:** React Query

## 4.1 Diseño ui 🎨

Responsiva, basada en Tailwind, con soporte para temas claros y oscuros.

## 5. Resumen de la estructura del proyecto 📂

La aplicación está construida con Vite y React, utilizando TailwindCSS para el diseño. La estructura del proyecto sigue las mejores prácticas de modularidad y reutilización de componentes.

a continuación una pequeña descripción de la estructura del proyecto:

```
src/
├── app/                 # Rutas de la aplicación y configuración de React Router
├── components/          # Componentes de UI reutilizables
├── modules/             # Codigo modularizado por funcionalidades y paginas
├── scss/                # Global styles and themes
├── shared/              # Codigo compartido entre modulos
├── static/              # Datos estáticos como configuraciones y constantes
├── types/               # Definiciones de tipos e interfaces de TypeScript
└── main.tsx             # Punto de entrada de la aplicación
```

## 6. Setup e instalación ⚙️

```bash
# Clone the repository
git clone https://github.com/pizza-and-juice/eventosf
cd eventosf

# Install dependencies
# node v20.11.0
npm install

# Start development server
npm run dev
```

### 7 .env 🔐

Create a `.env` file in the root directory of the project, using .env.example as a template.

| Variable Name              | Description                                                    |
| -------------------------- | -------------------------------------------------------------- |
| `VITE_APP_FONTAWESOME_KEY` | FontAwesome API llave                                          |
| `VITE_APP_API`             | URL de la api                                                  |
| `VITE_APP_ENV`             | Ambiente de la aplicación, puede ser `DEV`, `STAGING` o `PROD` |

## 8. Ramas Git 🌿

1. main -> producción
2. staging -> Se emula la api
