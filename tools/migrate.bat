@rem migrate.bat "K:\Ghubs\test\b" "K:\Ghubs\test\a"

@echo off
if exist %1 if exist %2 (
	@RD /S /Q %2
	xcopy %1 %2 /e /i
	@RD /S /Q %1
) else (
	echo --------------------------------------------
	echo --Directories do not exist, cannot migrate--
	echo ----- Please try reinstalling the app ------
	echo --------------------------------------------
)

