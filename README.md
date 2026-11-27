# Asistente Baymax Chef – Pastelería Fridolin

Mini app web con asistente animado estilo Clippy (Baymax original con gorro de chef).

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Marcelo-88/fridolin-baymax-assistant)

## Configuración de secretos

En el servidor (Render, Railway, etc.) configura estas variables de entorno:

- `SLACK_TOKEN` → token de bot de Slack (xoxb-...)
- `SLACK_CHANNEL` → ID del canal (C...)

Nunca subas el token al repositorio.

## Despliegue recomendado (1 clic)

1. Haz clic en el botón de arriba o ve a [Render Deploy](https://render.com/deploy?repo=https://github.com/Marcelo-88/fridolin-baymax-assistant)
2. Conecta tu cuenta de GitHub si te lo pide
3. Añade las variables de entorno `SLACK_TOKEN` y `SLACK_CHANNEL`
4. Despliega

El frontend está en `/public`.

## Funcionalidades

- Baymax animado (flota, parpadea, saluda al pasar el cursor o tocar)
- Chat con burbujas
- Dictado por voz (Web Speech API)
- Envío a Slack como `Lynn (tablet): <texto>`
- Consulta periódica de respuestas
- Diseño Fridolin (#9C182F)
