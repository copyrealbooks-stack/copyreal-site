@echo off
setlocal DisableDelayedExpansion
title Copy Real Toolbox - Word count CSV
pushd "%~dp0" || (echo Could not open this folder. & pause & exit /b 1)
echo.
echo ============================================
echo  COPY REAL TOOLBOX - WORD COUNT CSV
echo ============================================
echo.
echo Writes a word count report for UTF-8 TXT and Markdown files.
echo Approximate English/space-delimited word counts; not a Thai word segmenter.
set "CR_TOOL_DIR=%CD%"
powershell.exe -NoProfile -Command "$root=$env:CR_TOOL_DIR; $out=Join-Path $root 'CopyReal_reports'; [void](New-Item -ItemType Directory -Force -Path $out); $target=Join-Path $out 'word_count.csv'; if(Test-Path -LiteralPath $target) { Write-Host 'Report already exists. No overwrite.'; exit 0 }; $utf8=[Text.UTF8Encoding]::new($false,$true); $rows=Get-ChildItem -LiteralPath $root -File | Where-Object { $_.Extension -in '.txt','.md' } | ForEach-Object { try { $s=[IO.File]::ReadAllText($_.FullName,$utf8); $n=@($s -split '\s+' | Where-Object { $_ -ne '' }).Count; [pscustomobject]@{File=$_.Name;ApproximateWords=$n;Characters=$s.Length} } catch { Write-Warning ('SKIPPED ' + $_.Name) } }; $rows | Export-Csv -LiteralPath $target -NoTypeInformation -Encoding UTF8; Write-Host ('Saved report: ' + $target)"
if errorlevel 1 echo ERROR: PowerShell could not finish the operation.
:end
echo.
echo Finished. Original files have not been changed.
popd
pause
