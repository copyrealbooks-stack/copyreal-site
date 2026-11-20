@echo off
setlocal DisableDelayedExpansion
title Copy Real Toolbox - WAV to MP3
pushd "%~dp0" || (echo Could not open this folder. & pause & exit /b 1)
echo.
echo ============================================
echo  COPY REAL TOOLBOX - WAV TO MP3
echo ============================================
echo.
echo Convert WAV files to 192 kbps MP3 copies; source WAVs stay untouched.
echo Requires FFmpeg installed and available in PATH.
where ffmpeg.exe >nul 2>&1
if errorlevel 1 (
  echo FFmpeg was not found. Nothing was processed.
  echo Install FFmpeg from its official website and add it to PATH.
  goto :end
)
if not exist "CopyReal_output_MP3_192" mkdir "CopyReal_output_MP3_192"
for %%F in (*.wav) do if exist "%%~fF" (
  if exist "CopyReal_output_MP3_192\%%~nF.mp3" (
    echo SKIP existing: "%%~nxF"
  ) else (
    echo Processing: "%%~nxF"
    ffmpeg.exe -hide_banner -loglevel error -nostdin -n -i "%%~fF" -vn -codec:a libmp3lame -b:a 192k "CopyReal_output_MP3_192\%%~nF.mp3"
    if errorlevel 1 echo FAILED: "%%~nxF"
  )
)
:end
echo.
echo Finished. Original files have not been changed.
popd
pause
