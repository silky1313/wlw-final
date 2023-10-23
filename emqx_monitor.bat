@echo off
%1 mshta vbscript:CreateObject("WScript.Shell").Run("%~s0 ::",0,FALSE)(window.close)&&exit
 
set EMQX_PATH=D:\app\emqx
set OUTPUT_FILE=%EMQX_PATH%\emqx_monitor.log
 
:loop
cd /d "%EMQX_PATH%"
 
REM 获取当前日期时间，并格式化为时间戳
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
    set year=%%a
    set month=%%b
    set day=%%c
)
for /f "tokens=1-3 delims=: " %%a in ('time /t') do (
    set hour=0%%a
    set minute=%%b
)
set timestamp=%year%-%month%-%day% %hour:~-2%:%minute%
 
cd bin
emqx_ctl status | findstr /C:"Node 'emqx@127.0.0.1'" | findstr /C:"is started" >NUL
IF "%ERRORLEVEL%"=="0" (
    echo [%timestamp%] EMQX is running normally. >> %OUTPUT_FILE%
) ELSE (
    echo [%timestamp%] EMQX is not running. Restarting... >> %OUTPUT_FILE%
 
    REM 结束之前的 EMQX 进程，可以通过 taskkill 命令来实现
    REM taskkill /f /im beam.smp.exe >NUL
 
    start /b cmd /c "%EMQX_PATH%\bin\emqx start"
 
    echo [%timestamp%] EMQX has started. >> %OUTPUT_FILE%
 
)
 
timeout /t 60 > NUL
goto loop