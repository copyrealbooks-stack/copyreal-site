@echo off
setlocal DisableDelayedExpansion
title Copy Real Toolbox - Image dimensions
pushd "%~dp0" || (echo Could not open this folder. & pause & exit /b 1)
echo.
echo ============================================
echo  COPY REAL TOOLBOX - IMAGE DIMENSIONS
echo ============================================
echo.
echo Reports pixel dimensions for JPG, JPEG and PNG files in this folder.
echo Files are read only; no resizing or recompression.
set "CR_TOOL_DIR=%CD%"
powershell.exe -NoProfile -Command "$root=$env:CR_TOOL_DIR; $out=Join-Path $root 'CopyReal_reports'; [void](New-Item -ItemType Directory -Force -Path $out); $target=Join-Path $out 'image_dimensions.csv'; if(Test-Path -LiteralPath $target) { Write-Host 'Report already exists. No overwrite.'; exit 0 }; Add-Type -AssemblyName System.Drawing; $rows=Get-ChildItem -LiteralPath $root -File | Where-Object { $_.Extension -in '.jpg','.jpeg','.png' } | ForEach-Object { $img=$null; try { $img=[System.Drawing.Image]::FromFile($_.FullName); [pscustomobject]@{File=$_.Name;Width=$img.Width;Height=$img.Height;Pixels=([long]$img.Width*[long]$img.Height)} } catch { Write-Warning ('SKIPPED ' + $_.Name) } finally { if($img) { $img.Dispose() } } }; $rows | Export-Csv -LiteralPath $target -NoTypeInformation -Encoding UTF8; Write-Host ('Saved: ' + $target)"
if errorlevel 1 echo ERROR: PowerShell could not finish the operation.
:end
echo.
echo Finished. Original files have not been changed.
popd
pause
