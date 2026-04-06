const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://eocgffkpqorpqiehlquk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2dmZmtwcW9ycHFpZWhscXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjI2MzYsImV4cCI6MjA5MDg5ODYzNn0.TnhbvhT_SYmYsWJrP2ruE_ljcUMKGjYbyVXcwy53SUY'
);

async function checkTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error:', JSON.stringify(error, null, 2));
  } else {
    console.log('Tasks found:', data.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

checkTasks();
