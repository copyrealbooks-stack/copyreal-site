@echo off
setlocal DisableDelayedExpansion
title Copy Real Toolbox - Audio peak report
pushd "%~dp0" || (echo Could not open this folder. & pause & exit /b 1)
echo.
echo ============================================
echo  COPY REAL TOOLBOX - AUDIO PEAK REPORT
echo ============================================
echo.
echo Read-only volume report for WAV, MP3, FLAC and M4A files.
where ffmpeg.exe >nul 2>&1
if errorlevel 1 (
  echo FFmpeg was not found. Nothing was processed.
  goto :end
)
if not exist "CopyReal_reports" mkdir "CopyReal_reports"
for %%F in (*.wav *.mp3 *.flac *.m4a) do if exist "%%~fF" (
  if exist "CopyReal_reports\%%~nxF_peak.txt" (
    echo SKIP existing report: "%%~nxF"
  ) else (
    echo Measuring: "%%~nxF"
    ffmpeg.exe -hide_banner -nostdin -i "%%~fF" -af volumedetect -f null NUL 2>"CopyReal_reports\%%~nxF_peak.txt"
    if errorlevel 1 echo FAILED: "%%~nxF"
  )
)
echo Look for mean_volume and max_volume in the report files.
echo This is NOT a true-peak, loudness or platform-compliance test.
:end
echo.
echo Finished. Original files have not been changed.
popd
pause
