@echo off
chcp 65001 >nul
title Webstudio Builder — dev-сервер
echo.
echo ========================================
echo   Запуск Webstudio (dev-сервер)
echo ========================================
echo.
cd /d "%~dp0webstudio-main\webstudio-main\apps\builder"
if errorlevel 1 (
  echo Ошибка: папка не найдена. Проверьте путь.
  pause
  exit /b 1
)
echo Папка: %CD%
echo.
echo Команда: pnpm run dev
echo.
echo Чтобы ОСТАНОВИТЬ сервер: закройте это окно или нажмите Ctrl+C
echo Чтобы ПЕРЕЗАПУСТИТЬ: остановите, затем снова запустите этот файл.
echo.
echo ========================================
pnpm run dev
pause
