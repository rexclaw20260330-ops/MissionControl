# Supabase Migration Runner
# This script runs SQL migrations using Supabase REST API

$SupabaseUrl = "https://eocgffkpqorpqiehlquk.supabase.co"
$ServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2dmZmtwcW9ycHFpZWhscXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTMyMjYzNiwiZXhwIjoyMDkwODk4NjM2fQ.ZK9SFfsom3BUQCaPwGycv0BOsO0Bx86_s_Gfbwdvskc"

$SqlFiles = @(
    "001_create_missions.sql",
    "002_create_agent_schedules.sql",
    "003_create_user_goals.sql",
    "004_create_user_skills.sql"
)

foreach ($file in $SqlFiles) {
    Write-Host "Running $file..."
    
    $Sql = Get-Content -Path "src/lib/migrations/$file" -Raw
    
    # Note: Supabase doesn't expose direct SQL execution via REST for security
    # You'll need to manually run these in Supabase SQL Editor
    Write-Host "SQL Content for $file:"
    Write-Host "---"
    Write-Host $Sql
    Write-Host "---"
    Write-Host "Please copy this SQL and run in Supabase SQL Editor"
    Write-Host ""
}

Write-Host "All migration SQL displayed. Please execute manually in Supabase Dashboard."
