@echo off
echo Stopping Prelegal services...

taskkill /FI "WINDOWTITLE eq Prelegal - Backend" /T /F >nul 2>&1
if %errorlevel%==0 ( echo   Backend stopped. ) else ( echo   Backend was not running. )

taskkill /FI "WINDOWTITLE eq Prelegal - Frontend" /T /F >nul 2>&1
if %errorlevel%==0 ( echo   Frontend stopped. ) else ( echo   Frontend was not running. )
