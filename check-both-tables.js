const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://eocgffkpqorpqiehlquk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2dmZmtwcW9ycHFpZWhscXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjI2MzYsImV4cCI6MjA5MDg5ODYzNn0.TnhbvhT_SYmYsWJrP2ruE_ljcUMKGjYbyVXcwy53SUY'
);

async function checkBothTables() {
  console.log("=== Checking calendar_events ===");
  const { data: calendarEvents, error: err1 } = await supabase
    .from('calendar_events')
    .select('*');
  
  if (err1) {
    console.error('Error:', err1);
  } else {
    console.log(`Found ${calendarEvents.length} events:`);
    calendarEvents.forEach(e => console.log(`  - ${e.title} (${e.user_id})`));
  }

  console.log("\n=== Checking agent_schedules ===");
  const { data: agentSchedules, error: err2 } = await supabase
    .from('agent_schedules')
    .select('*');
  
  if (err2) {
    console.error('Error:', err2);
  } else {
    console.log(`Found ${agentSchedules.length} schedules:`);
    agentSchedules.forEach(s => console.log(`  - ${s.title} (${s.agent_id})`));
  }
}

checkBothTables();
