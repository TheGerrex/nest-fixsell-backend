#!/bin/bash
# filepath: /Users/user/Documents/GitHub/nest-fixsell-backend/src/seed/production-to-local/mac/seed-production-to-local.sh
# This script works on both Mac and Linux

echo "===== PostgreSQL Production to Local Database Clone ====="

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for PostgreSQL utilities and install if needed
if ! command_exists pg_dump; then
  echo "PostgreSQL utilities not found."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Attempting to install PostgreSQL using Homebrew..."
    if ! command_exists brew; then
      echo "Homebrew not found. Please install Homebrew first or install PostgreSQL manually."
      echo "Visit https://brew.sh/ for Homebrew installation instructions."
      read -p "Press Enter to exit..."
      exit 1
    fi
    brew install postgresql
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Attempting to install PostgreSQL using apt..."
    sudo apt-get update
    sudo apt-get install -y postgresql-client
  else
    echo "Unsupported operating system. Please install PostgreSQL manually."
    read -p "Press Enter to exit..."
    exit 1
  fi
  
  # Check if installation was successful
  if ! command_exists pg_dump; then
    echo "PostgreSQL utilities still not found. Please install PostgreSQL manually."
    read -p "Press Enter to exit..."
    exit 1
  fi
fi

echo "PostgreSQL utilities found. Proceeding with dump and restore..."

# --- Get passwords from environment files ---
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
PRODUCTION_ENV_PATH="$PROJECT_ROOT/src/config/env/production.env"
DEVELOPMENT_ENV_PATH="$PROJECT_ROOT/src/config/env/development.env"

if [ ! -f "$PRODUCTION_ENV_PATH" ]; then
  echo "Production environment file not found at: $PRODUCTION_ENV_PATH"
  read -p "Press Enter to exit..."
  exit 1
fi

if [ ! -f "$DEVELOPMENT_ENV_PATH" ]; then
  echo "Development environment file not found at: $DEVELOPMENT_ENV_PATH"
  read -p "Press Enter to exit..."
  exit 1
fi

PG_PROD_PASS=$(grep -E "^POSTGRES_PASSWORD=" "$PRODUCTION_ENV_PATH" | cut -d'=' -f2)
if [ -z "$PG_PROD_PASS" ]; then
  echo "Failed to read POSTGRES_PASSWORD from $PRODUCTION_ENV_PATH."
  read -p "Press Enter to exit..."
  exit 1
fi

PG_LOCAL_PASS=$(grep -E "^POSTGRES_PASSWORD=" "$DEVELOPMENT_ENV_PATH" | cut -d'=' -f2)
if [ -z "$PG_LOCAL_PASS" ]; then
  echo "Failed to read POSTGRES_PASSWORD from $DEVELOPMENT_ENV_PATH."
  read -p "Press Enter to exit..."
  exit 1
fi

echo
echo "=== STEP 1: Checking PostgreSQL versions ==="

# --- Check production PostgreSQL version ---
echo "Checking production PostgreSQL version..."
PGPASSWORD="$PG_PROD_PASS" psql --host=fixsell-erp.cdov37xwge2e.us-east-1.rds.amazonaws.com --port=5432 --username=postgres --dbname=fixsell_erp --command "select version();"
if [ $? -ne 0 ]; then
  echo "Failed to connect to production database. Check credentials and network."
  read -p "Press Enter to exit..."
  exit 1
fi

# --- Check local PostgreSQL version ---
echo
echo "Checking local PostgreSQL version..."
PGPASSWORD="$PG_LOCAL_PASS" psql --host=localhost --port=5432 --username=postgres --command "select version();"
if [ $? -ne 0 ]; then
  echo "Failed to connect to local PostgreSQL server."
  read -p "Press Enter to exit..."
  exit 1
fi
echo

echo "=== STEP 2: Dumping production database ==="
echo "Creating dump file from production..."
PGPASSWORD="$PG_PROD_PASS" pg_dump --host=fixsell-erp.cdov37xwge2e.us-east-1.rds.amazonaws.com \
        --port=5432 \
        --username=postgres \
        --dbname=fixsell_erp \
        --format=c \
        --file=production.dump
if [ $? -ne 0 ]; then
  echo "Error during pg_dump"
  read -p "Press Enter to exit..."
  exit 1
fi
echo "Production database dump completed successfully."

echo
echo "=== STEP 3: Preparing local database ==="

echo "Dropping and recreating local database..."
PGPASSWORD="$PG_LOCAL_PASS" psql --host=localhost --port=5432 --username=postgres --command "DROP DATABASE IF EXISTS \"FixsellDB\" WITH (FORCE);"
if [ $? -ne 0 ]; then
  echo "Could not drop database. It might be in use by another process."
  echo "Close all connections to the database and try again."
  read -p "Press Enter to exit..."
  exit 1
fi

PGPASSWORD="$PG_LOCAL_PASS" psql --host=localhost --port=5432 --username=postgres --command "CREATE DATABASE \"FixsellDB\";"
if [ $? -ne 0 ]; then
  echo "Could not create database."
  read -p "Press Enter to exit..."
  exit 1
fi
echo "Local database prepared successfully."

echo
echo "=== STEP 4: Restoring production data to local database ==="
echo "Restoring from dump file - this may take several minutes..."
PGPASSWORD="$PG_LOCAL_PASS" pg_restore --host=localhost \
           --port=5432 \
           --username=postgres \
           --dbname=FixsellDB \
           --no-owner \
           --no-acl \
           production.dump
RESTORE_EXIT_CODE=$?

echo
echo "Restore process completed with exit code: $RESTORE_EXIT_CODE"
echo
echo "NOTE: Some non-fatal errors are expected if PostgreSQL versions differ"
echo "between production and local environments. The database should still be usable."
echo

# Verify restore by counting tables
echo "Verifying database restore by counting tables..."
PGPASSWORD="$PG_LOCAL_PASS" psql --host=localhost --port=5432 --username=postgres --dbname=FixsellDB --tuples-only --command "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"
echo

echo "=== Database clone process completed ==="
echo "You can now use your local database with a copy of production data."
read -p "Press Enter to continue..."