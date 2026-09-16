@echo off
REM ============================================================
REM Start Laragon PostgreSQL instance on port 5433
REM (Native PostgreSQL 18 service already occupies port 5432)
REM ============================================================

set LARAGON_PG_BIN=D:\laragon\bin\postgresql\pgsql\bin
set LARAGON_PG_DATA=D:\laragon\data\postgresql

echo [1/2] Checking if port 5433 is already in use...
netstat -ano | findstr ":5433" | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo PostgreSQL already running on port 5433. Nothing to do.
    goto :done
)

echo [2/2] Starting PostgreSQL on port 5433...
"%LARAGON_PG_BIN%\pg_ctl.exe" -D "%LARAGON_PG_DATA%" -o "-p 5433" -l "%LARAGON_PG_DATA%\pg_start.log" start
if %errorlevel%==0 (
    echo.
    echo PostgreSQL started successfully on port 5433 (trust auth, no password).
    echo Connect via: psql -U postgres -h localhost -p 5433 -d lpm_db
    echo Application expects: postgresql://lpm_user:lpm_password@localhost:5433/lpm_db
) else (
    echo.
    echo FAILED to start PostgreSQL. Check %LARAGON_PG_DATA%\pg_start.log
)

:done
echo.
echo Done.
pause