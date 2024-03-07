#!/bin/bash

# Ask for the path to the .env file and the name or ID of the Docker container
read -p 'Enter the path to the development.env file: ' envFilePath
read -p 'Enter the name or ID of the Docker container: ' dockerContainer

# Load environment variables from .env file
export $(grep -v '^#' $envFilePath | xargs)

# Set the backup file name
backup_file="backup_$(date +%Y%m%d%H%M%S).sql"

# Create a backup of all databases
docker exec -t $dockerContainer bash -c "pg_dumpall -U postgres > /var/lib/postgresql/data/$backup_file"

# Copy the backup from the Docker container to the host
docker cp "$dockerContainer:/var/lib/postgresql/data/$backup_file" .

# Remove the backup file from the Docker container
docker exec -t $dockerContainer bash -c "rm /var/lib/postgresql/data/$backup_file"

echo "Backup created: $backup_file"