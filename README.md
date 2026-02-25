# WebBuilder

Локальная сборка [Webstudio](https://github.com/webstudio-is/webstudio) с настройкой для разработки на Windows.

## Быстрый старт

1. **Зависимости:** в корне `webstudio-main\webstudio-main` выполнить `pnpm install`
2. **База и PostgREST:** см. `БАЗА-И-ВХОД.txt`
3. **Запуск:** `ЗАПУСК-WEBSTUDIO.bat` или в `apps\builder`: `pnpm run dev`
4. **Вход:** Login with Secret (секрет в `.env.development`) или GitHub — см. `ВХОД-ЧЕРЕЗ-GITHUB.txt`

## Структура

- `webstudio-main\webstudio-main` — исходный код Webstudio
- `webstudio-main\webstudio-main\apps\builder` — приложение редактора, здесь `.env`, `docker-compose.dev.yaml`
- Файлы `*.txt`, `*.bat` — инструкции и скрипты для локального запуска

## Требования

- Node.js 22+
- pnpm
- Docker (для PostgreSQL и PostgREST)
