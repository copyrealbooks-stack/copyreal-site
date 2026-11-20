@echo off
setlocal DisableDelayedExpansion
title Copy Real Toolbox - Duplicate files
pushd "%~dp0" || (echo Could not open this folder. & pause & exit /b 1)
echo.
echo ============================================
echo  COPY REAL TOOLBOX - DUPLICATE FILES
echo ============================================
echo.
echo Searches this folder and subfolders for byte-for-byte duplicates.
echo No files are deleted. LARGE FOLDERS MAY TAKE SOME TIME.
set "CR_TOOL_DIR=%CD%"
powershell.exe -NoProfile -Command "$root=$env:CR_TOOL_DIR; $out=Join-Path $root 'CopyReal_reports'; [void](New-Item -ItemType Directory -Force -Path $out); $target=Join-Path $out 'duplicate_hashes.csv'; if(Test-Path -LiteralPath $target) { Write-Host 'Report already exists. No overwrite.'; exit 0 }; $files=Get-ChildItem -LiteralPath $root -Recurse -File -ErrorAction SilentlyContinue | Where-Object { -not $_.FullName.StartsWith(($out + [IO.Path]::DirectorySeparatorChar),[StringComparison]::OrdinalIgnoreCase) }; $candidates=$files | Group-Object Length | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Group }; $hashed=@(foreach($file in $candidates) { try { $hash=(Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256 -ErrorAction Stop).Hash; [pscustomobject]@{SHA256=$hash;Bytes=$file.Length;File=$file.FullName} } catch { Write-Warning ('Could not read: ' + $file.FullName) } }); $dupes=@($hashed | Group-Object SHA256 | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Group }); if($dupes.Count) { $dupes | Export-Csv -LiteralPath $target -NoTypeInformation -Encoding UTF8; Write-Host ('Duplicate entries: ' + $dupes.Count) } else { 'SHA256,Bytes,File' | Set-Content -LiteralPath $target -Encoding ASCII; Write-Host 'No exact duplicates found' }; Write-Host ('Saved: ' + $target)"
if errorlevel 1 echo ERROR: PowerShell could not finish the operation.
:end
echo.
echo Finished. Original files have not been changed.
popd
pause
