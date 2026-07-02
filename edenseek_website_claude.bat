@echo off
cd /d C:\Projects\AI\Edenseek_Website
title Edenseek Website Claude Engineer

call claude

echo.
set /p SAVE_MEMORY=Save this session to PROJECT_MEMORY.md? (y/n):

if /i "%SAVE_MEMORY%"=="y" (
    if not exist docs mkdir docs
    echo.>> docs\PROJECT_MEMORY.md
    echo ## %date% %time% — Manual Session Closeout>> docs\PROJECT_MEMORY.md
    echo.>> docs\PROJECT_MEMORY.md
    echo Summary: [fill in what happened today]>> docs\PROJECT_MEMORY.md
    echo Files changed: [fill in files touched]>> docs\PROJECT_MEMORY.md
    echo Next step: [fill in next step]>> docs\PROJECT_MEMORY.md
    echo Saved placeholder to docs\PROJECT_MEMORY.md
) else (
    echo Session not saved.
)

pause