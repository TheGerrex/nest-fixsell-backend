# Ask for the name or ID of the Docker container and the path to the backup file
$dockerContainer = Read-Host -Prompt 'Enter the name or ID of the Docker container'
$backupFilePath = Read-Host -Prompt 'Enter the path to the backup file'

# Copy the backup file from the host to the Docker container
docker cp "$backupFilePath" "$($dockerContainer):/var/lib/postgresql/data/backup.sql"

# Restore the database from the backup file
docker exec -t $dockerContainer bash -c "psql -U postgres < /var/lib/postgresql/data/backup.sql"

# Remove the backup file from the Docker container
docker exec -t $dockerContainer bash -c "rm /var/lib/postgresql/data/backup.sql"

Write-Output "Database restored from backup file: $backupFilePath"