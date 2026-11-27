# Asistente Baymax Chef – Pastelería Fridolin

Mini app web con asistente animado estilo Clippy (Baymax original con gorro de chef).

## Configuración de secretos

En el servidor (Render, Railway, etc.) configura estas variables de entorno:

- `SLACK_TOKEN` → token de bot de Slack (xoxb-...)
- `SLACK_CHANNEL` → ID del canal (C...)

Nunca subas el token al repositorio.

## Despliegue recomendado

1. Conecta este repositorio en [Render](https://render.com)
2. Web Service → Node
3. Build: `npm install`
4. Start: `npm start`
5. Añade las dos variables de entorno
6. Despliega

El frontend está en `/public`.

## Funcionalidades

- Baymax animado (flota, parpadea, saluda al pasar el cursor o tocar)
- Chat con burbujas
- Dictado por voz (Web Speech API)
- Envío a Slack como `Lynn (tablet): <texto>`
- Consulta periódica de respuestas
- Diseño Fridolin (#9C182F)
