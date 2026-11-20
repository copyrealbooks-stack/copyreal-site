@echo off
setlocal DisableDelayedExpansion
title Copy Real Toolbox - Mono 48k WAV
pushd "%~dp0" || (echo Could not open this folder. & pause & exit /b 1)
echo.
echo ============================================
echo  COPY REAL TOOLBOX - MONO 48K WAV
echo ============================================
echo.
echo Create 48 kHz 16-bit mono PCM WAV copies for spoken audio workflows.
echo Requires FFmpeg installed and available in PATH.
where ffmpeg.exe >nul 2>&1
if errorlevel 1 (
  echo FFmpeg was not found. Nothing was processed.
  echo Install FFmpeg from its official website and add it to PATH.
  goto :end
)
if not exist "CopyReal_output_mono_48k" mkdir "CopyReal_output_mono_48k"
for %%F in (*.wav) do if exist "%%~fF" (
  if exist "CopyReal_output_mono_48k\%%~nF.wav" (
    echo SKIP existing: "%%~nxF"
  ) else (
    echo Processing: "%%~nxF"
    ffmpeg.exe -hide_banner -loglevel error -nostdin -n -i "%%~fF" -vn -ac 1 -ar 48000 -codec:a pcm_s16le "CopyReal_output_mono_48k\%%~nF.wav"
    if errorlevel 1 echo FAILED: "%%~nxF"
  )
)
:end
echo.
echo Finished. Original files have not been changed.
popd
pause
