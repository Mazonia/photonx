@echo off
title PhotonX Auto-Push Daemon
echo ========================================================
echo        PhotonX Automatic Git Sync ^& Push Watcher
echo ========================================================
echo.
echo Launching PowerShell watcher daemon...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0autopush.ps1" %*
pause
