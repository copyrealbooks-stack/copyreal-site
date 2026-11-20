@echo off
setlocal DisableDelayedExpansion
title Copy Real Toolbox - Clean text spacing
pushd "%~dp0" || (echo Could not open this folder. & pause & exit /b 1)
echo.
echo ============================================
echo  COPY REAL TOOLBOX - CLEAN TEXT SPACING
echo ============================================
echo.
echo Removes trailing spaces and tabs from UTF-8 TXT and Markdown copies.
echo Makes copies in CopyReal_output_clean_text; never edits source files.
set "CR_TOOL_DIR=%CD%"
powershell.exe -NoProfile -Command "$root=$env:CR_TOOL_DIR; $out=Join-Path $root 'CopyReal_output_clean_text'; [void](New-Item -ItemType Directory -Force -Path $out); $utf8=[Text.UTF8Encoding]::new($false,$true); Get-ChildItem -LiteralPath $root -File | Where-Object { $_.Extension -in '.txt','.md' } | ForEach-Object { $target=Join-Path $out $_.Name; if (Test-Path -LiteralPath $target) { Write-Host ('SKIP existing: ' + $_.Name) } else { try { $content=[IO.File]::ReadAllText($_.FullName,$utf8); $clean=[regex]::Replace($content,'[ \t]+(?=\r?$)','',[Text.RegularExpressions.RegexOptions]::Multiline); [IO.File]::WriteAllText($target,$clean,([Text.UTF8Encoding]::new($false))); Write-Host ('Saved: ' + $_.Name) } catch { Write-Warning ('SKIPPED ' + $_.Name + ': ' + $_.Exception.Message) } } }"
if errorlevel 1 echo ERROR: PowerShell could not finish the operation.
:end
echo.
echo Finished. Original files have not been changed.
popd
pause
