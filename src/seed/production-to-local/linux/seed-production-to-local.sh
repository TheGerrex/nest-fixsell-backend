#!/bin/bash
# filepath: /home/jonas/Documents/GitHub/nest-fixsell-backend/src/seed/production-to-local/linux/seed-production-to-local.sh

echo "===== PostgreSQL Production to Local Database Clone ====="

# --- Find the nest-fixsell-backend root directory ---
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Script located at: $SCRIPT_DIR"

# Extract root path by finding nest-fixsell-backend in the path
ROOT_PATH="${SCRIPT_DIR%/nest-fixsell-backend*}/nest-fixsell-backend"
echo "Found project root at: $ROOT_PATH"

# --- Set environment file paths relative to root ---
PRODUCTION_ENV_PATH="$ROOT_PATH/src/config/env/production.env"
DEVELOPMENT_ENV_PATH="$ROOT_PATH/src/config/env/development.env"

echo "Production env path: $PRODUCTION_ENV_PATH"
echo "Development env path: $DEVELOPMENT_ENV_PATH"

# Check for PostgreSQL utilities
if ! command -v pg_dump &> /dev/null; then
  echo "PostgreSQL utilities not found."
  echo "Attempting to install PostgreSQL using pacman..."
  sudo pacman -S postgresql --noconfirm
  if [ $? -ne 0 ]; then
    echo "Failed to install PostgreSQL. Please install manually."
    echo "Run: sudo pacman -S postgresql"
    read -p "Press Enter to exit..."
    exit 1
  fi
fi

echo "PostgreSQL utilities found. Proceeding with dump and restore..."

# --- Improved method to get connection parameters from environment files ---
function get_env_value() {
  local file="$1"
  local key="$2"
  
  # Check if file exists
  if [ ! -f "$file" ]; then
    echo ""
    return
  fi
  
  # Skip comment lines and extract the value for the given key
  local value=$(grep -v "^//" "$file" | grep "^$key=" | cut -d'=' -f2-)
  
  # Remove quotes and whitespace
  value=$(echo "$value" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
  
  echo "$value"
}

# Display file contents for debugging
echo "=== Checking environment files ==="
echo "Production ENV first 3 lines:"
head -n 3 "$PRODUCTION_ENV_PATH"
echo "Development ENV first 3 lines:"
head -n 3 "$DEVELOPMENT_ENV_PATH"

# --- Production database parameters ---
PG_PROD_PASS=$(get_env_value "$PRODUCTION_ENV_PATH" "POSTGRES_PASSWORD")
PG_PROD_HOST=$(get_env_value "$PRODUCTION_ENV_PATH" "POSTGRES_DB_HOST")
PG_PROD_PORT=$(get_env_value "$PRODUCTION_ENV_PATH" "POSTGRES_DB_PORT")
PG_PROD_USER=$(get_env_value "$PRODUCTION_ENV_PATH" "POSTGRES_DB_USERNAME")
PG_PROD_DB=$(get_env_value "$PRODUCTION_ENV_PATH" "POSTGRES_DB_NAME")

# --- Local database parameters ---
PG_LOCAL_PASS=$(get_env_value "$DEVELOPMENT_ENV_PATH" "POSTGRES_PASSWORD")
PG_LOCAL_HOST=$(get_env_value "$DEVELOPMENT_ENV_PATH" "POSTGRES_DB_HOST")
PG_LOCAL_PORT=$(get_env_value "$DEVELOPMENT_ENV_PATH" "POSTGRES_DB_PORT")
PG_LOCAL_USER=$(get_env_value "$DEVELOPMENT_ENV_PATH" "POSTGRES_DB_USERNAME")
PG_LOCAL_DB=$(get_env_value "$DEVELOPMENT_ENV_PATH" "POSTGRES_DB_NAME")

# --- Debug values ---
echo "DEBUG: Production Host = '$PG_PROD_HOST'"
echo "DEBUG: Production Port = '$PG_PROD_PORT'"
echo "DEBUG: Production User = '$PG_PROD_USER'"
echo "DEBUG: Production DB = '$PG_PROD_DB'"

echo "DEBUG: Local Host = '$PG_LOCAL_HOST'"
echo "DEBUG: Local Port = '$PG_LOCAL_PORT'"
echo "DEBUG: Local User = '$PG_LOCAL_USER'"
echo "DEBUG: Local DB = '$PG_LOCAL_DB'"

# --- Validate parameters ---
if [ -z "$PG_PROD_PASS" ]; then echo "WARNING: Production password not found" && PG_PROD_PASS="postgres"; fi
if [ -z "$PG_PROD_HOST" ]; then echo "WARNING: Production host not found" && PG_PROD_HOST="localhost"; fi
if [ -z "$PG_PROD_PORT" ]; then echo "WARNING: Production port not found" && PG_PROD_PORT="5432"; fi
if [ -z "$PG_PROD_USER" ]; then echo "WARNING: Production username not found" && PG_PROD_USER="postgres"; fi
if [ -z "$PG_PROD_DB" ]; then echo "WARNING: Production database name not found" && PG_PROD_DB="postgres"; fi

if [ -z "$PG_LOCAL_PASS" ]; then echo "WARNING: Local password not found" && PG_LOCAL_PASS="postgres"; fi
if [ -z "$PG_LOCAL_HOST" ]; then echo "WARNING: Local host not found" && PG_LOCAL_HOST="localhost"; fi
if [ -z "$PG_LOCAL_PORT" ]; then echo "WARNING: Local port not found" && PG_LOCAL_PORT="5432"; fi
if [ -z "$PG_LOCAL_USER" ]; then echo "WARNING: Local username not found" && PG_LOCAL_USER="postgres"; fi
if [ -z "$PG_LOCAL_DB" ]; then echo "WARNING: Local database name not found" && PG_LOCAL_DB="FixsellDB"; fi

echo
echo "=== Database Connection Details ==="
echo "Production: $PG_PROD_USER@$PG_PROD_HOST:$PG_PROD_PORT/$PG_PROD_DB"
echo "Local: $PG_LOCAL_USER@$PG_LOCAL_HOST:$PG_LOCAL_PORT/$PG_LOCAL_DB"
echo

echo "=== STEP 1: Checking PostgreSQL versions ==="

# Ping the production host to verify connectivity
echo "Pinging production host: $PG_PROD_HOST"
ping -c 1 "$PG_PROD_HOST" >/dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Warning: Cannot ping the production host. This might indicate network connectivity issues."
  echo "However, we'll still try to connect to the database."
  echo
fi

# --- Check production PostgreSQL version ---
echo "Checking production PostgreSQL version..."
export PGPASSWORD="$PG_PROD_PASS"
psql --host="$PG_PROD_HOST" --port="$PG_PROD_PORT" --username="$PG_PROD_USER" --dbname="$PG_PROD_DB" --command "select version();"
if [ $? -ne 0 ]; then
  echo "Failed to connect to production database. Check credentials and network."
  echo "Common issues:"
  echo "1. VPN connection might be required"
  echo "2. Host name could be incorrect in the environment file"
  echo "3. Firewall might be blocking the connection"
  echo
  echo "Connection details used:"
  echo "Host: $PG_PROD_HOST"
  echo "Port: $PG_PROD_PORT"
  echo "User: $PG_PROD_USER"
  echo "Database: $PG_PROD_DB"
  echo
  echo "Try manual connection with:"
  echo "PGPASSWORD='your_password' psql -h $PG_PROD_HOST -p $PG_PROD_PORT -U $PG_PROD_USER -d $PG_PROD_DB"
  unset PGPASSWORD
  read -p "Press Enter to exit..."
  exit 1
fi

# --- Check local PostgreSQL version ---
echo
echo "Checking local PostgreSQL version..."
export PGPASSWORD="$PG_LOCAL_PASS"
psql --host="$PG_LOCAL_HOST" --port="$PG_LOCAL_PORT" --username="$PG_LOCAL_USER" --command "select version();"
if [ $? -ne 0 ]; then
  echo "Failed to connect to local PostgreSQL server."
  unset PGPASSWORD
  read -p "Press Enter to exit..."
  exit 1
fi
echo

echo "=== STEP 2: Dumping production database ==="
export PGPASSWORD="$PG_PROD_PASS"
echo "Creating dump file from production..."
pg_dump --host="$PG_PROD_HOST" \
        --port="$PG_PROD_PORT" \
        --username="$PG_PROD_USER" \
        --dbname="$PG_PROD_DB" \
        --format=c \
        --file=production.dump
if [ $? -ne 0 ]; then
  echo "Error during pg_dump"
  unset PGPASSWORD
  read -p "Press Enter to exit..."
  exit $?
fi
echo "Production database dump completed successfully."
unset PGPASSWORD

echo
echo "=== STEP 3: Preparing local database ==="
export PGPASSWORD="$PG_LOCAL_PASS"

echo "Dropping and recreating local database..."
psql --host="$PG_LOCAL_HOST" --port="$PG_LOCAL_PORT" --username="$PG_LOCAL_USER" --command="DROP DATABASE IF EXISTS \"$PG_LOCAL_DB\" WITH (FORCE);"
if [ $? -ne 0 ]; then
  echo "Could not drop database. It might be in use by another process."
  echo "Close all connections to the database and try again."
  unset PGPASSWORD
  read -p "Press Enter to exit..."
  exit $?
fi

psql --host="$PG_LOCAL_HOST" --port="$PG_LOCAL_PORT" --username="$PG_LOCAL_USER" --command="CREATE DATABASE \"$PG_LOCAL_DB\";"
if [ $? -ne 0 ]; then
  echo "Could not create database."
  unset PGPASSWORD
  read -p "Press Enter to exit..."
  exit $?
fi
echo "Local database prepared successfully."

echo
echo "=== STEP 4: Restoring production data to local database ==="
echo "Restoring from dump file - this may take several minutes..."
pg_restore --host="$PG_LOCAL_HOST" \
           --port="$PG_LOCAL_PORT" \
           --username="$PG_LOCAL_USER" \
           --dbname="$PG_LOCAL_DB" \
           --no-owner \
           --no-acl \
           production.dump
RESTORE_RESULT=$?
echo
echo "Restore process completed with exit code: $RESTORE_RESULT"
echo
echo "NOTE: Some non-fatal errors are expected if PostgreSQL versions differ"
echo "between production and local environments. The database should still be usable."
echo

# Verify restore by counting tables
echo "Verifying database restore by counting tables..."
psql --host="$PG_LOCAL_HOST" --port="$PG_LOCAL_PORT" --username="$PG_LOCAL_USER" --dbname="$PG_LOCAL_DB" --tuples-only --command="SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"
echo

unset PGPASSWORD
echo "=== Database clone process completed ==="
echo "You can now use your local database with a copy of production data."
read -p "Press Enter to exit..."