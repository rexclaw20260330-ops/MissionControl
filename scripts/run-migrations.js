const SUPABASE_URL = 'https://eocgffkpqorpqiehlquk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2dmZmtwcW9ycHFpZWhscXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTMyMjYzNiwiZXhwIjoyMDkwODk4NjM2fQ.ZK9SFfsom3BUQCaPwGycv0BOsO0Bx86_s_Gfbwdvskc';

const sqlFiles = [
  '001_create_missions.sql',
  '002_create_agent_schedules.sql', 
  '003_create_user_goals.sql',
  '004_create_user_skills.sql'
];

async function runMigration(filename) {
  const fs = require('fs');
  const path = require('path');
  
  const sql = fs.readFileSync(
    path.join(__dirname, '../src/lib/migrations', filename),
    'utf8'
  );
  
  console.log(`Running ${filename}...`);
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY
    },
    body: JSON.stringify({ query: sql })
  });
  
  if (response.ok) {
    console.log(`✅ ${filename} completed`);
  } else {
    const error = await response.text();
    console.error(`❌ ${filename} failed:`, error);
  }
}

async function main() {
  for (const file of sqlFiles) {
    await runMigration(file);
  }
  console.log('All migrations completed!');
}

main().catch(console.error);
