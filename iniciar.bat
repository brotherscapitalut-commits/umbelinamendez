@echo off
chcp 65001 > nul

title Umbelina Glow - Inicializador do Sistema

cd /d "%~dp0"

echo ===================================================
echo             UMBELINA GLOW - SISTEMA
echo ===================================================
echo.

REM 1. Verificar gerenciador de pacotes (Bun ou NPM)
set "DEV_CMD="
set "INSTALL_CMD="

where bun >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set "INSTALL_CMD=bun install"
    set "DEV_CMD=bun run dev"
    echo [OK] Bun detectado.
    goto :check_modules
)

where npm >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set "INSTALL_CMD=npm install"
    set "DEV_CMD=npm run dev"
    echo [OK] Node.js / NPM detectado.
    goto :check_modules
)

echo [ERRO] Node.js ou Bun nao foram encontrados no sistema!
echo Por favor, instale o Node.js em: https://nodejs.org
echo.
pause
exit /b 1

:check_modules
echo.
if not exist "node_modules\" (
    echo [INFO] Pasta node_modules nao encontrada. Instalando dependencias...
    echo Executando: %INSTALL_CMD%
    echo.
    call %INSTALL_CMD%
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERRO] Falha ao instalar as dependencias.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencias instaladas com sucesso!
) else (
    echo [OK] Dependencias encontradas.
)

echo.
echo ===================================================
echo  Iniciando o servidor da aplicacao...
echo  Para encerrar o sistema, pressione CTRL + C
echo ===================================================
echo.

call %DEV_CMD%

if %ERRORLEVEL% neq 0 (
    echo.
    echo [AVISO] O servidor foi encerrado ou ocorreu um erro.
    pause
)
