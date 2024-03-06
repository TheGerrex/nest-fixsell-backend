#!/bin/bash

# Ask for the path to the .env file, the name or ID of the Docker container, and the path to the backup file
read -p 'Enter the path to the development.env file: ' envFilePath
read -p 'Enter the name or ID of the Docker container: ' dockerContainer
read -p 'Enter the path to the backup file: ' backupFilePath

# Load environment variables from .env file
export $(grep -v '^#' $envFilePath | xargs)
dbName=$POSTGRES_DB_NAME

# Print the database name to the console
Write-Output "Database name: $dbName"

# Drop the existing database and create a new one
docker exec -t $dockerContainer bash -c "dropdb -U postgres $dbName --if-exists; createdb -U postgres $dbName;"

# Copy the backup file from the host to the Docker container
docker cp "$backupFilePath" "${dockerContainer}:/var/lib/postgresql/data/backup.sql"

# Restore the database from the backup file
docker exec -t $dockerContainer bash -c "psql -U postgres -d $dbName < /var/lib/postgresql/data/backup.sql"

# Remove the backup file from the Docker container
docker exec -t $dockerContainer bash -c "rm /var/lib/postgresql/data/backup.sql"

Write-Output "Database restored from backup file: $backupFilePath"