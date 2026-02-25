============================================
  Где взять Auth Secret для входа в Webstudio
============================================

1) Секрет задаётся в файле .env в этой же папке (apps/builder):
   строка: AUTH_SECRET=...

2) Текущее значение — скопируйте ЦЕЛИКОМ (без пробелов в начале/конце):
   a1b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef01

3) На странице логина: "Login with Secret" → вставьте это значение в поле → Login.

4) Важно: после любого изменения .env перезапустите dev-сервер (Ctrl+C, затем снова pnpm run dev).
   Иначе приложение не подхватит новый AUTH_SECRET.

Как сгенерировать свой секрет (по документации Webstudio):
- Linux/Mac: openssl rand -hex 32
- Или: https://generate-secret.now.sh/64
Потом в .env пропишите: AUTH_SECRET=сгенерированная_строка

См. также: https://github.com/webstudio-is/webstudio (apps/builder/.env)
