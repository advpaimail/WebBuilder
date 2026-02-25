# Остановка dev-сервера Webstudio (порт 5173)
# Запуск: правый клик -> "Выполнить в PowerShell" или: powershell -File stop-webstudio-dev.ps1

$port = 5173
$conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $conn) {
    Write-Host "На порту $port ничего не запущено." -ForegroundColor Yellow
    exit 0
}
$pid = $conn.OwningProcess
if ($pid -eq 0) {
    Write-Host "Системный процесс на порту $port — не останавливаем." -ForegroundColor Red
    exit 1
}
$proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
Write-Host "Останавливаю процесс: $($proc.ProcessName) (PID $pid)..." -ForegroundColor Cyan
Stop-Process -Id $pid -Force -ErrorAction Stop
Write-Host "Готово. Порт $port свободен." -ForegroundColor Green
