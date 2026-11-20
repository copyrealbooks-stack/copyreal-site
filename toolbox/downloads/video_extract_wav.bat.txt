@echo off
setlocal DisableDelayedExpansion
title Copy Real Toolbox - Video to WAV
pushd "%~dp0" || (echo Could not open this folder. & pause & exit /b 1)
echo.
echo ============================================
echo  COPY REAL TOOLBOX - VIDEO TO WAV
echo ============================================
echo.
echo Extract 48 kHz stereo PCM WAV audio from MP4, MOV or MKV files.
where ffmpeg.exe >nul 2>&1
if errorlevel 1 (
  echo FFmpeg was not found. Nothing was processed.
  goto :end
)
if not exist "CopyReal_output_extracted_audio" mkdir "CopyReal_output_extracted_audio"
for %%F in (*.mp4 *.mov *.mkv) do if exist "%%~fF" (
  if exist "CopyReal_output_extracted_audio\%%~nxF.wav" (
    echo SKIP existing: "%%~nxF"
  ) else (
    echo Extracting: "%%~nxF"
    ffmpeg.exe -hide_banner -loglevel error -nostdin -n -i "%%~fF" -vn -ac 2 -ar 48000 -codec:a pcm_s16le "CopyReal_output_extracted_audio\%%~nxF.wav"
    if errorlevel 1 echo FAILED: "%%~nxF"
  )
)
echo Output filename keeps the original video extension before .wav.
:end
echo.
echo Finished. Original files have not been changed.
popd
pause
