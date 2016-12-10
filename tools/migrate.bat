@rem migrate.bat "K:\Ghubs\test\b" "K:\Ghubs\test\a"

@echo off
if exist %1 if exist %2 (
	timeout /nobreak /t 5
	
	@RD /S /Q %2
	timeout /nobreak /t 5
	
	xcopy %1 %2 /e /i
	
	timeout /nobreak /t 5
	@rem @RD /S /Q %1
	
	start /d %2 Kindred.exe
) else (
	echo --------------------------------------------
	echo --Directories do not exist, cannot migrate--
	echo ----- Please try reinstalling the app ------
	echo --------------------------------------------
)

