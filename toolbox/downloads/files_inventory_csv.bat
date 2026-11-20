@echo off
setlocal DisableDelayedExpansion
title Copy Real Toolbox - Folder inventory
pushd "%~dp0" || (echo Could not open this folder. & pause & exit /b 1)
echo.
echo ============================================
echo  COPY REAL TOOLBOX - FOLDER INVENTORY
echo ============================================
echo.
echo Lists files and sizes in this folder and all its subfolders.
echo Read-only except for creating the CSV report.
set "CR_TOOL_DIR=%CD%"
powershell.exe -NoProfile -Command "$root=$env:CR_TOOL_DIR; $out=Join-Path $root 'CopyReal_reports'; [void](New-Item -ItemType Directory -Force -Path $out); $target=Join-Path $out 'file_inventory.csv'; if(Test-Path -LiteralPath $target) { Write-Host 'Report already exists. No overwrite.'; exit 0 }; Get-ChildItem -LiteralPath $root -Recurse -File -ErrorAction SilentlyContinue | Where-Object { -not $_.FullName.StartsWith(($out + [IO.Path]::DirectorySeparatorChar),[StringComparison]::OrdinalIgnoreCase) } | Select-Object FullName,Extension,Length,LastWriteTime | Export-Csv -LiteralPath $target -NoTypeInformation -Encoding UTF8; Write-Host ('Saved report: ' + $target)"
if errorlevel 1 echo ERROR: PowerShell could not finish the operation.
:end
echo.
echo Finished. Original files have not been changed.
popd
pause
