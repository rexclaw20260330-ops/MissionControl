const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://eocgffkpqorpqiehlquk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2dmZmtwcW9ycHFpZWhscXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjI2MzYsImV4cCI6MjA5MDg5ODYzNn0.TnhbvhT_SYmYsWJrP2ruE_ljcUMKGjYbyVXcwy53SUY'
);

async function checkAgentSchedules() {
  const { data, error } = await supabase
    .from('agent_schedules')
    .select('*')
    .order('day_of_week')
    .order('start_hour');
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Agent schedules:', data.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

checkAgentSchedules();
