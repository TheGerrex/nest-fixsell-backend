# Ask for the path to the .env file, the name or ID of the Docker container, and the path to the backup file
$envFilePath = Read-Host -Prompt 'Enter the path to the development.env file'
$dockerContainer = Read-Host -Prompt 'Enter the name or ID of the Docker container'
$backupFilePath = Read-Host -Prompt 'Enter the path to the backup file'

# Load environment variables from .env file
$env = ConvertFrom-StringData (Get-Content $envFilePath -raw)
$dbName = $env.POSTGRES_DB_NAME

# Print the database name to the console
Write-Output "Database name: $dbName"

# Drop the existing database and create a new one
docker exec -t $dockerContainer bash -c "dropdb -U postgres $dbName --if-exists; createdb -U postgres $dbName;"

# Copy the backup file from the host to the Docker container
docker cp "$backupFilePath" "$($dockerContainer):/var/lib/postgresql/data/backup.sql"

# Restore the database from the backup file
docker exec -t $dockerContainer bash -c "psql -U postgres -d $dbName < /var/lib/postgresql/data/backup.sql"

# Remove the backup file from the Docker container
docker exec -t $dockerContainer bash -c "rm /var/lib/postgresql/data/backup.sql"

Write-Output "Database restored from backup file: $backupFilePath"