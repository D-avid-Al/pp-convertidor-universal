# 📡 Sistema de Monitoreo ESP32 - ET28 PP AG-COMPANY

Sistema de monitoreo industrial en tiempo real para sensores ESP32 con interfaz web moderna y visualizaciones interactivas.

## 🚀 Características

- **Monitoreo en tiempo real** de sensores ESP32
- **Gráficos interactivos** con Chart.js
- **Medidores circulares** dinámicos
- **Visualizaciones de tendencias** temporales
- **Interfaz responsive** para móviles y desktop
- **Integración con Firebase** Realtime Database
- **Diseño industrial** moderno y profesional

## 🔧 Sensores Soportados

- **Potenciómetro** (GPIO32) - ADC 0-4095
- **Temperatura DS18B20** (GPIO4) - -55°C a +125°C
- **Entradas Digitales** (GPIO 34,35,36,39)
- **Salidas Digitales** (GPIO 25,26,27,33)

## 🌐 Despliegue en Netlify

### Opción 1: Despliegue automático desde GitHub

1. Sube el código a un repositorio de GitHub
2. Ve a [Netlify](https://netlify.com)
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. ¡Despliega!

### Opción 2: Despliegue manual

1. Ejecuta `npm run build`
2. Sube la carpeta `dist` a Netlify
3. ¡Listo!

## ⚙️ Configuración Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita Realtime Database
3. Actualiza las credenciales en `src/firebase/config.js`
4. Configura las reglas de seguridad

## 🔌 Configuración ESP32

El ESP32 debe enviar datos cada 5 segundos a:

```
https://tu-proyecto.firebaseio.com/sensores.json
```

Formato JSON:

```json
{
  "potenciometro": 2048,
  "temperatura": 25.5
}
```

## 📱 Tecnologías

- **React 19** - Framework frontend
- **Vite** - Build tool
- **Chart.js** - Gráficos interactivos
- **Firebase** - Base de datos en tiempo real
- **CSS3** - Animaciones y efectos visuales

## 🎨 Características Visuales

- Gradientes dinámicos
- Animaciones suaves
- Efectos de partículas
- Medidores circulares
- Gráficos de líneas en tiempo real
- Diseño responsive

## 📄 Licencia

ET28 PP AG-COMPANY - Sistema de Monitoreo Industrial
