@echo off
REM filepath: c:\Users\user\Documents\GitHub\nest-fixsell-backend\src\seed\production-to-local\windows\seed-production-to-local.bat

echo ===== PostgreSQL Production to Local Database Clone =====

REM Function to check for PostgreSQL utilities in PATH
where pg_dump.exe >nul 2>&1
if errorlevel 1 (
  echo PostgreSQL utilities not found.
  echo Attempting to install PostgreSQL using Chocolatey...
  choco install postgresql -y
  if errorlevel 1 (
    echo Failed to install PostgreSQL. Please install manually.
    pause
    exit /b 1
  )
  REM Wait a few seconds for installation to complete
  timeout /t 10
  
  REM Try checking again
  where pg_dump.exe >nul 2>&1
  if errorlevel 1 (
    echo PostgreSQL utilities still not found in PATH.
    echo Attempting to add a common PostgreSQL bin folder to PATH...
    REM Adjust these paths if necessary
    if exist "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" (
      set "PATH=%PATH%;C:\Program Files\PostgreSQL\17\bin"
      echo Added PostgreSQL 17 bin folder to PATH.
    ) else if exist "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" (
      set "PATH=%PATH%;C:\Program Files\PostgreSQL\15\bin"
      echo Added PostgreSQL 15 bin folder to PATH.
    ) else if exist "C:\Program Files\PostgreSQL\14\bin\pg_dump.exe" (
      set "PATH=%PATH%;C:\Program Files\PostgreSQL\14\bin"
      echo Added PostgreSQL 14 bin folder to PATH.
    ) else (
      echo PostgreSQL utilities not found in common paths. Please update the script with your correct bin folder.
      pause
      exit /b 1
    )
    
    REM Check one last time
    where pg_dump.exe >nul 2>&1
    if errorlevel 1 (
      echo PostgreSQL utilities still not found. Check installation.
      pause
      exit /b 1
    )
  )
)

echo PostgreSQL utilities found. Proceeding with dump and restore...

REM --- Get passwords from environment files ---
set "PRODUCTION_ENV_PATH=c:\Users\user\Documents\GitHub\nest-fixsell-backend\src\config\env\production.env"
set "DEVELOPMENT_ENV_PATH=c:\Users\user\Documents\GitHub\nest-fixsell-backend\src\config\env\development.env"

for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_PASSWORD=" "%PRODUCTION_ENV_PATH%"`) do (
  set "PG_PROD_PASS=%%B"
)
if "%PG_PROD_PASS%"=="" (
  echo Failed to read POSTGRES_PASSWORD from %PRODUCTION_ENV_PATH%.
  pause
  exit /b 1
)

for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_PASSWORD=" "%DEVELOPMENT_ENV_PATH%"`) do (
  set "PG_LOCAL_PASS=%%B"
)
if "%PG_LOCAL_PASS%"=="" (
  echo Failed to read POSTGRES_PASSWORD from %DEVELOPMENT_ENV_PATH%.
  pause
  exit /b 1
)

echo.
echo === STEP 1: Checking PostgreSQL versions ===

REM --- Check production PostgreSQL version ---
echo Checking production PostgreSQL version...
set PGPASSWORD=%PG_PROD_PASS%
psql --host=fixsell-erp.cdov37xwge2e.us-east-1.rds.amazonaws.com --port=5432 --username=postgres --dbname=fixsell_erp --command "select version();" 
if errorlevel 1 (
  echo Failed to connect to production database. Check credentials and network.
  set PGPASSWORD=
  pause
  exit /b 1
)

REM --- Check local PostgreSQL version ---
echo.
echo Checking local PostgreSQL version...
set PGPASSWORD=%PG_LOCAL_PASS%
psql --host=localhost --port=5432 --username=postgres --command "select version();" 
if errorlevel 1 (
  echo Failed to connect to local PostgreSQL server.
  set PGPASSWORD=
  pause
  exit /b 1
)
echo.

echo === STEP 2: Dumping production database ===
set PGPASSWORD=%PG_PROD_PASS%
echo Creating dump file from production...
pg_dump --host=fixsell-erp.cdov37xwge2e.us-east-1.rds.amazonaws.com ^
        --port=5432 ^
        --username=postgres ^
        --dbname=fixsell_erp ^
        --format=c ^
        --file=production.dump
if %ERRORLEVEL% neq 0 (
  echo Error during pg_dump
  set PGPASSWORD=
  pause
  exit /b %ERRORLEVEL%
)
echo Production database dump completed successfully.
set PGPASSWORD=

echo.
echo === STEP 3: Preparing local database ===
set PGPASSWORD=%PG_LOCAL_PASS%

echo Dropping and recreating local database...
psql --host=localhost --port=5432 --username=postgres --command="DROP DATABASE IF EXISTS \"FixsellDB\" WITH (FORCE);"
if %ERRORLEVEL% neq 0 (
  echo Could not drop database. It might be in use by another process.
  echo Close all connections to the database and try again.
  set PGPASSWORD=
  pause
  exit /b %ERRORLEVEL%
)

psql --host=localhost --port=5432 --username=postgres --command="CREATE DATABASE \"FixsellDB\";"
if %ERRORLEVEL% neq 0 (
  echo Could not create database.
  set PGPASSWORD=
  pause
  exit /b %ERRORLEVEL%
)
echo Local database prepared successfully.

echo.
echo === STEP 4: Restoring production data to local database ===
echo Restoring from dump file - this may take several minutes...
pg_restore --host=localhost ^
           --port=5432 ^
           --username=postgres ^
           --dbname=FixsellDB ^
           --no-owner ^
           --no-acl ^
           production.dump
echo.
echo Restore process completed with exit code: %ERRORLEVEL%
echo.
echo NOTE: Some non-fatal errors are expected if PostgreSQL versions differ 
echo between production and local environments. The database should still be usable.
echo.

REM Verify restore by counting tables
echo Verifying database restore by counting tables...
psql --host=localhost --port=5432 --username=postgres --dbname=FixsellDB --tuples-only --command="SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"
echo.

set PGPASSWORD=
echo === Database clone process completed ===
echo You can now use your local database with a copy of production data.
pause