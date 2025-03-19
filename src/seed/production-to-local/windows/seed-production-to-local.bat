@echo off

echo ===== PostgreSQL Production to Local Database Clone =====

REM --- Find the nest-fixsell-backend root directory ---
set "SCRIPT_DIR=%~dp0"
echo Script located at: %SCRIPT_DIR%

REM Extract root path by finding nest-fixsell-backend in the path
set "TEMP_PATH=%SCRIPT_DIR%"
for /f "tokens=*" %%a in ("%TEMP_PATH:\nest-fixsell-backend=|%") do (
    for /f "tokens=1 delims=|" %%b in ("%%a") do set "PREFIX=%%b"
)
set "ROOT_PATH=%PREFIX%nest-fixsell-backend\"
echo Found project root at: %ROOT_PATH%

REM --- Set environment file paths relative to root ---
set "PRODUCTION_ENV_PATH=%ROOT_PATH%src\config\env\production.env"
set "DEVELOPMENT_ENV_PATH=%ROOT_PATH%src\config\env\development.env"

echo Production env path: %PRODUCTION_ENV_PATH%
echo Development env path: %DEVELOPMENT_ENV_PATH%

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

REM --- Get connection parameters from environment files ---
REM --- Production database parameters ---
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_PASSWORD=" "%PRODUCTION_ENV_PATH%"`) do (
  set "PG_PROD_PASS=%%B"
)
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_DB_HOST=" "%PRODUCTION_ENV_PATH%"`) do (
  set "PG_PROD_HOST=%%B"
)
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_DB_PORT=" "%PRODUCTION_ENV_PATH%"`) do (
  set "PG_PROD_PORT=%%B"
)
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_DB_USERNAME=" "%PRODUCTION_ENV_PATH%"`) do (
  set "PG_PROD_USER=%%B"
)
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_DB_NAME=" "%PRODUCTION_ENV_PATH%"`) do (
  set "PG_PROD_DB=%%B"
)

REM --- Local database parameters ---
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_PASSWORD=" "%DEVELOPMENT_ENV_PATH%"`) do (
  set "PG_LOCAL_PASS=%%B"
)
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_DB_HOST=" "%DEVELOPMENT_ENV_PATH%"`) do (
  set "PG_LOCAL_HOST=%%B"
)
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_DB_PORT=" "%DEVELOPMENT_ENV_PATH%"`) do (
  set "PG_LOCAL_PORT=%%B"
)
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_DB_USERNAME=" "%DEVELOPMENT_ENV_PATH%"`) do (
  set "PG_LOCAL_USER=%%B"
)
for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_DB_NAME=" "%DEVELOPMENT_ENV_PATH%"`) do (
  set "PG_LOCAL_DB=%%B"
)

REM --- Validate parameters ---
if "%PG_PROD_PASS%"=="" echo WARNING: Production password not found & set "PG_PROD_PASS=postgres"
if "%PG_PROD_HOST%"=="" echo WARNING: Production host not found & set "PG_PROD_HOST=localhost"
if "%PG_PROD_PORT%"=="" echo WARNING: Production port not found & set "PG_PROD_PORT=5432"
if "%PG_PROD_USER%"=="" echo WARNING: Production username not found & set "PG_PROD_USER=postgres" 
if "%PG_PROD_DB%"=="" echo WARNING: Production database name not found & set "PG_PROD_DB=postgres"

if "%PG_LOCAL_PASS%"=="" echo WARNING: Local password not found & set "PG_LOCAL_PASS=postgres"
if "%PG_LOCAL_HOST%"=="" echo WARNING: Local host not found & set "PG_LOCAL_HOST=localhost"
if "%PG_LOCAL_PORT%"=="" echo WARNING: Local port not found & set "PG_LOCAL_PORT=5432"
if "%PG_LOCAL_USER%"=="" echo WARNING: Local username not found & set "PG_LOCAL_USER=postgres"
if "%PG_LOCAL_DB%"=="" echo WARNING: Local database name not found & set "PG_LOCAL_DB=FixsellDB"

echo.
echo === Database Connection Details ===
echo Production: %PG_PROD_USER%@%PG_PROD_HOST%:%PG_PROD_PORT%/%PG_PROD_DB%
echo Local: %PG_LOCAL_USER%@%PG_LOCAL_HOST%:%PG_LOCAL_PORT%/%PG_LOCAL_DB%
echo.

echo === STEP 1: Checking PostgreSQL versions ===

REM --- Check production PostgreSQL version ---
echo Checking production PostgreSQL version...
set PGPASSWORD=%PG_PROD_PASS%
psql --host=%PG_PROD_HOST% --port=%PG_PROD_PORT% --username=%PG_PROD_USER% --dbname=%PG_PROD_DB% --command "select version();" 
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
psql --host=%PG_LOCAL_HOST% --port=%PG_LOCAL_PORT% --username=%PG_LOCAL_USER% --command "select version();" 
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
pg_dump --host=%PG_PROD_HOST% ^
        --port=%PG_PROD_PORT% ^
        --username=%PG_PROD_USER% ^
        --dbname=%PG_PROD_DB% ^
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
psql --host=%PG_LOCAL_HOST% --port=%PG_LOCAL_PORT% --username=%PG_LOCAL_USER% --command="DROP DATABASE IF EXISTS \"%PG_LOCAL_DB%\" WITH (FORCE);"
if %ERRORLEVEL% neq 0 (
  echo Could not drop database. It might be in use by another process.
  echo Close all connections to the database and try again.
  set PGPASSWORD=
  pause
  exit /b %ERRORLEVEL%
)

psql --host=%PG_LOCAL_HOST% --port=%PG_LOCAL_PORT% --username=%PG_LOCAL_USER% --command="CREATE DATABASE \"%PG_LOCAL_DB%\";"
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
pg_restore --host=%PG_LOCAL_HOST% ^
           --port=%PG_LOCAL_PORT% ^
           --username=%PG_LOCAL_USER% ^
           --dbname=%PG_LOCAL_DB% ^
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
psql --host=%PG_LOCAL_HOST% --port=%PG_LOCAL_PORT% --username=%PG_LOCAL_USER% --dbname=%PG_LOCAL_DB% --tuples-only --command="SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"
echo.

set PGPASSWORD=
echo === Database clone process completed ===
echo You can now use your local database with a copy of production data.
pause