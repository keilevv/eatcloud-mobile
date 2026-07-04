# EatCloud Mobile

Aplicación móvil en React Native para EatCloud, construida con Expo. Proporciona una pantalla de inicio de sesión y un dashboard basado en WebView que envuelve el frontend web de EatCloud.

## Stack Tecnológico y Librerías

| Librería | Versión | Propósito |
|---|---|---|
| **expo** | ~54.0.0 | Framework y herramientas de compilación |
| **react-native** | 0.81.5 | Framework de UI principal |
| **react** | 19.1.0 | Librería de UI |
| **typescript** | ^5.3.0 | Seguridad de tipos |
| **@react-navigation/native** | ^7.1.6 | Contenedor de navegación |
| **@react-navigation/native-stack** | ^7.3.10 | Navegador de pila |
| **react-native-screens** | ~4.16.0 | Contenedores nativos de pantallas |
| **react-native-safe-area-context** | ~5.6.0 | Manejo de área segura |
| **axios** | ^1.8.4 | Cliente HTTP |
| **@react-native-async-storage/async-storage** | 2.2.0 | Almacenamiento local persistente |
| **react-native-webview** | 13.15.0 | WebView para el dashboard |
| **expo-status-bar** | ~3.0.9 | Componente de barra de estado |
| **expo-asset** | ~12.0.13 | Gestión de assets |
| **expo-font** | ~14.0.12 | Carga de fuentes |

## Estructura del Proyecto

```
src/
├── components/
│   └── LoadingScreen.tsx        # Pantalla de carga / spinner
├── config/
│   └── env.ts                   # URLs de API y configuración de entorno
├── context/
│   └── AuthContext.tsx           # Proveedor de estado de autenticación
├── navigation/
│   └── AppNavigator.tsx          # Navegador raíz (restringido por auth)
├── screens/
│   ├── LoginScreen.tsx           # Formulario de inicio de sesión
│   └── DashboardScreen.tsx       # Dashboard vía WebView
├── services/
│   ├── api.ts                    # Cliente Axios y normalizador de errores
│   └── auth.service.ts           # Llamadas a la API de autenticación
└── storage/
    └── auth.storage.ts           # Persistencia de token y usuario
```

## Pantallas y Flujos

### Flujo de Autenticación

1. **Inicio de la app** → `AuthProvider` verifica si hay un token almacenado vía `AsyncStorage`
2. **Sin token** → `AppNavigator` muestra `LoginScreen`
3. **Token válido** → `AppNavigator` muestra `DashboardScreen`
4. **Inicio de sesión exitoso** → Token y usuario guardados en almacenamiento, el navegador cambia a Dashboard
5. **Error de inicio de sesión** → Mensaje de error mostrado en el formulario (desde el backend vía `normalizeApiError`)
6. **Sesión expirada** → Token eliminado, el navegador regresa a Login

### Pantallas

| Pantalla | Ruta | Descripción |
|---|---|---|
| **LoadingScreen** | — | Se muestra mientras se verifica la autenticación almacenada al inicio |
| **LoginScreen** | `Login` | Formulario de correo/contraseña con validación y visualización de errores. Al tener éxito, muestra una alerta y navega al Dashboard |
| **DashboardScreen** | `Dashboard` | `WebView` a pantalla completa que carga la URL del frontend de EatCloud. Inyecta el token de autenticación en `localStorage` del lado web. Maneja el cierre de sesión mediante el puente `postMessage` |

### Endpoints de API Consumidos

| Endpoint | Método | Servicio |
|---|---|---|
| `/auth/login` | POST | `auth.service.ts` — inicio de sesión, retorna `{ token, user }` |
| `/auth/me` | GET | `auth.service.ts` — obtiene el usuario actual desde el token almacenado |

## Primeros Pasos

### Prerrequisitos

- Node.js >= 18
- npm o yarn
- Expo CLI (`npm install -g expo-cli` o usa `npx expo`)
- Android Studio (para el emulador de Android) o un dispositivo físico con la app Expo Go
- Simulador de iOS (solo macOS, requiere Xcode)

### Instalación

```bash
cd eatcloud-mobile
npm install
```

### Entorno

Las URLs de la API se configuran en `src/config/env.ts`:

```ts
API_URL: 'https://eatcloud-backend.vercel.app/api'
FRONTEND_URL: 'https://eatcloud-frontend.vercel.app'
```

Actualiza estos valores para apuntar a tus servidores locales o de staging según sea necesario.

### Ejecutar en Modo de Desarrollo

```bash
# Inicia el servidor de desarrollo de Expo
npx expo start

# O usa el script de npm
npm start
```

Escanea el código QR con Expo Go (Android/iOS) o presiona:

- `a` — Abrir en emulador de Android
- `i` — Abrir en simulador de iOS
- `w` — Abrir en navegador web

Atajos específicos por plataforma:

```bash
# Android
npm run android

# iOS
npm run ios
```

### Generar APK / App Bundle (Build de Desarrollo)

```bash
# Instalar EAS CLI (si aún no está instalado)
npm install -g eas-cli

# Iniciar sesión en tu cuenta de Expo
eas login

# Generar APK para Android
eas build --platform android --profile preview

# Generar App Bundle (AAB) para Play Store
eas build --platform android --profile production
```

> **Nota**: Para builds de producción necesitas una cuenta de Expo y el proyecto debe estar configurado en el dashboard de Expo. Consulta `GOOGLE_PLAY_STORE.md` para la guía completa de publicación.

### Lint / Verificación de Tipos

```bash
npx tsc --noEmit
```
