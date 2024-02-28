# Ask for the path to the .env file and the name or ID of the Docker container
$envFilePath = Read-Host -Prompt 'Enter the path to the development.env file'
$dockerContainer = Read-Host -Prompt 'Enter the name or ID of the Docker container'

# Load environment variables from .env file
$env = Get-Content -Path $envFilePath | ForEach-Object -Begin { $h = @{} } -Process { $k, $v = $_ -split '=', 2; $h[$k] = $v } -End { $h }

# Set the backup file name
$backup_file = "backup_{0}.sql" -f (Get-Date -Format "yyyyMMddHHmmss")

# Create a backup of all databases
docker exec -t $dockerContainer bash -c "pg_dumpall -U postgres > /var/lib/postgresql/data/$backup_file"

# Copy the backup from the Docker container to the host
docker cp "$($dockerContainer):/var/lib/postgresql/data/$backup_file" .

# Remove the backup file from the Docker container
docker exec -t $dockerContainer bash -c "rm /var/lib/postgresql/data/$backup_file"

Write-Output "Backup created: $backup_file"