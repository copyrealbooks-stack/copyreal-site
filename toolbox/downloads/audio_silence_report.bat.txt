@echo off
setlocal DisableDelayedExpansion
title Copy Real Toolbox - Audio silence report
pushd "%~dp0" || (echo Could not open this folder. & pause & exit /b 1)
echo.
echo ============================================
echo  COPY REAL TOOLBOX - AUDIO SILENCE REPORT
echo ============================================
echo.
echo Read-only report of silence at or below -45 dBFS lasting 1 second.
where ffmpeg.exe >nul 2>&1
if errorlevel 1 (
  echo FFmpeg was not found. Nothing was processed.
  goto :end
)
if not exist "CopyReal_reports" mkdir "CopyReal_reports"
for %%F in (*.wav *.mp3 *.flac *.m4a) do if exist "%%~fF" (
  if exist "CopyReal_reports\%%~nxF_silence.txt" (
    echo SKIP existing report: "%%~nxF"
  ) else (
    echo Scanning: "%%~nxF"
    ffmpeg.exe -hide_banner -nostdin -i "%%~fF" -af "silencedetect=noise=-45dB:d=1" -f null NUL 2>"CopyReal_reports\%%~nxF_silence.txt"
    if errorlevel 1 echo FAILED: "%%~nxF"
  )
)
echo This tool identifies candidate silences; it does not edit audio.
:end
echo.
echo Finished. Original files have not been changed.
popd
pause
