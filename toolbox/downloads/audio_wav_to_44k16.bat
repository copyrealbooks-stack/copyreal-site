@echo off
setlocal DisableDelayedExpansion
title Copy Real Toolbox - 44k 16bit WAV
pushd "%~dp0" || (echo Could not open this folder. & pause & exit /b 1)
echo.
echo ============================================
echo  COPY REAL TOOLBOX - 44K 16BIT WAV
echo ============================================
echo.
echo Create 44.1 kHz 16-bit PCM WAV copies; originals are preserved.
echo Requires FFmpeg installed and available in PATH.
where ffmpeg.exe >nul 2>&1
if errorlevel 1 (
  echo FFmpeg was not found. Nothing was processed.
  echo Install FFmpeg from its official website and add it to PATH.
  goto :end
)
if not exist "CopyReal_output_44k16" mkdir "CopyReal_output_44k16"
for %%F in (*.wav) do if exist "%%~fF" (
  if exist "CopyReal_output_44k16\%%~nF.wav" (
    echo SKIP existing: "%%~nxF"
  ) else (
    echo Processing: "%%~nxF"
    ffmpeg.exe -hide_banner -loglevel error -nostdin -n -i "%%~fF" -vn -ar 44100 -codec:a pcm_s16le "CopyReal_output_44k16\%%~nF.wav"
    if errorlevel 1 echo FAILED: "%%~nxF"
  )
)
:end
echo.
echo Finished. Original files have not been changed.
popd
pause
