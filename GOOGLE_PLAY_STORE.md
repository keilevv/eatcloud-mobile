# Publicar EatCloud Mobile en Google Play Store

Esta guía cubre el proceso completo, desde generar una compilación firmada hasta enviar la aplicación a Google Play Console.

---

## Prerrequisitos

- **Cuenta de desarrollador de Google Play** ([tarifa única de $25 USD](https://play.google.com/console/signup))
- **Cuenta de Expo** ([expo.dev](https://expo.dev/signup)) — requerida para EAS Build
- **EAS CLI** instalado globalmente:
  ```bash
  npm install -g eas-cli
  eas login
  ```
- **Android keystore** — EAS lo maneja automáticamente, o puedes proporcionar el tuyo
- Iconos y capturas de pantalla de la app listos (ver [Assets Requeridos](#assets-requeridos) más abajo)

---

## 1. Configurar la Aplicación

### Actualizar `app.json`

```json
{
  "expo": {
    "name": "EatCloud",
    "version": "1.0.0",
    "android": {
      "package": "com.eatcloud.mobile",
      "adaptiveIcon": {
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

- **`version`** — incrementa cada vez que publiques (sigue el versionado semántico)
- **`android.package`** — debe ser único en Google Play; cámbialo si estás haciendo un fork

### Configurar EAS Build

Crea `eas.json` en la raíz del proyecto:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

| Perfil | Salida | Caso de Uso |
|---|---|---|
| `development` | Cliente de desarrollo | Pruebas internas durante el desarrollo |
| `preview` | APK | Compartir con testers (instalación directa) |
| `production` | AAB | Envío a Google Play Store |

---

## 2. Generar una Compilación Firmada

### Opción A: Dejar que EAS administre el keystore (recomendado)

EAS Build crea y administra automáticamente un keystore para tu proyecto. Solo necesitas ejecutar:

```bash
# App Bundle de producción (AAB) — para Play Store
eas build --platform android --profile production
```

### Opción B: Usar tu propio keystore

1. Genera un keystore (si no tienes uno):
   ```bash
   keytool -genkey -v -keystore eatcloud-release.keystore \
     -alias eatcloud-alias \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Súbelo a EAS:
   ```bash
   eas credentials --platform android
   ```
3. Compila:
   ```bash
   eas build --platform android --profile production
   ```

### Qué produce la compilación

- **Archivo AAB** (`app-release.aab`) — el formato requerido por Google Play
- El artefacto de compilación está disponible para descargar desde tu [dashboard de Expo](https://expo.dev) o mediante la URL de salida del CLI

### Compilar un APK (para pruebas antes del envío a Play Store)

```bash
eas build --platform android --profile preview
```

Esto produce un APK firmado que puedes instalar directamente en dispositivos o distribuir mediante un servicio como Firebase App Distribution.

---

## 3. Preparar tu Listado de Google Play Store

### Assets Requeridos

| Asset | Especificaciones |
|---|---|
| **Icono de la app** | 512×512 px PNG, 32 bits con canal alpha |
| **Imagen destacada** | 1024×500 px JPG o PNG |
| **Capturas de pantalla** | Mín. 2, máx. 8 por tipo de dispositivo. Relación 16:9 o 9:16, mín. 320px, máx. 3840px |
| **Capturas de teléfono** | 2–8 capturas de la app en un teléfono |
| **Capturas de tablet** | 2–8 capturas de la app en una tablet (opcional pero recomendado) |
| **Política de privacidad** | URL a una política de privacidad accesible públicamente (requerido si la app maneja datos de usuario) |

### Metadatos de la Tienda

Prepáralos con anticipación (los ingresarás en Play Console):

| Campo | Notas |
|---|---|
| **Nombre de la app** | EatCloud (máx. 50 caracteres) |
| **Descripción corta** | máx. 80 caracteres |
| **Descripción completa** | máx. 4000 caracteres |
| **Categoría** | Comida y Bebidas / Negocios |
| **Etiquetas** | Hasta 5 etiquetas relevantes |
| **Correo de contacto** | Correo de soporte del desarrollador |
| **Sitio web** | https://eatcloud-frontend.vercel.app |

---

## 4. Subir a Google Play Console

1. Ve a [Google Play Console](https://play.google.com/console)
2. Haz clic en **Crear aplicación**
3. Completa los detalles iniciales:
   - Nombre de la aplicación
   - Idioma predeterminado
   - Aplicación o juego
   - Gratuita o de pago
4. Haz clic en **Crear aplicación**
5. Navega por las secciones del panel:

### **Producción** → **Fichas de la tienda**
   - Sube capturas de pantalla, imagen destacada, icono de la app
   - Escribe descripciones corta y completa
   - Categoriza la aplicación
   - Agrega datos de contacto
   - Agrega enlace a la política de privacidad

### **Producción** → **App Bundle de Android**
   - Sube el archivo AAB generado por EAS Build
   - Completa los detalles de la versión (nombre de la versión, notas de la versión/novedades)

### **Pruebas** (opcional pero recomendado)
   - **Pruebas internas** — prueba rápida con hasta 100 direcciones de correo
   - **Pruebas cerradas** — prueba con un grupo más grande antes de producción
   - **Pruebas abiertas** — prueba pública antes del lanzamiento a producción

### **Producción** → **Lanzamiento**
   - Después de las pruebas, promueve la versión a producción

6. Completa las secciones **Ficha de la tienda**, **Contenido de la aplicación** y **Precios y distribución** en la barra lateral

### Requisitos de Contenido de la Aplicación

Google te pedirá completar:

| Sección | Qué proporcionar |
|---|---|
| **Anuncios** | ¿Tu app contiene anuncios? (No para EatCloud) |
| **Clasificación de contenido** | Completa el cuestionario para obtener una clasificación por edad |
| **Público objetivo** | Todos los usuarios / Niños / Mixto |
| **Apps de noticias** | ¿Es una app de noticias? (No) |
| **Rastreo de contactos COVID-19** | No aplica |
| **Apps gubernamentales** | No aplica |
| **Seguridad de los datos** | Declara qué datos recopila tu app y por qué |

---

## 5. Enviar para Revisión

1. En Play Console, navega a **Producción** → **Resumen de la versión**
2. Revisa todos los detalles
3. Haz clic en **Enviar cambios para revisión**
4. La revisión de Google generalmente toma desde unas horas hasta un par de días

Después de la aprobación, la app se publicará en Play Store en unas pocas horas.

---

## 6. Actualizaciones Posteriores

```bash
# 1. Incrementa la versión en app.json (ej. "1.0.0" → "1.0.1")
# 2. Compila un nuevo AAB
eas build --platform android --profile production

# 3. Envía desde CLI (opcional, también puedes subir mediante Play Console)
eas submit --platform android --profile production
```

O sube el AAB manualmente mediante Play Console en **Producción** → **App Bundle de Android**.

---

## Solución de Problemas

| Problema | Solución |
|---|---|
| `eas build` falla con error de credenciales | Ejecuta `eas login` y `eas credentials --platform android` |
| La compilación se completa pero la app falla al iniciar | Revisa el registro de errores en los logs de compilación del dashboard de Expo |
| Google Play rechaza el AAB | Asegúrate de que el AAB esté firmado con un keystore de producción (no debug) |
| Conflicto de nombre `package` | Cambia `android.package` en `app.json` a un valor único |
| Política de privacidad faltante | Aloja una página simple de política de privacidad y agrega la URL en Play Console |
| La app no aparece después de la aprobación | Espera hasta 24 horas para la propagación completa en Play Store |

---

## Enlaces de Referencia

- [Documentación de Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Envío a Google Play con Expo](https://docs.expo.dev/submit/android/)
- [Ayuda de Google Play Console](https://support.google.com/googleplay/android-developer/)
- [Firmado de Apps Android](https://developer.android.com/studio/publish/app-signing)
