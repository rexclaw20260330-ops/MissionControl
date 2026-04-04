const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://eocgffkpqorpqiehlquk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2dmZmtwcW9ycHFpZWhscXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjI2MzYsImV4cCI6MjA5MDg5ODYzNn0.TnhbvhT_SYmYsWJrP2ruE_ljcUMKGjYbyVXcwy53SUY'
);

async function addEvent() {
  const { data, error } = await supabase
    .from('events')
    .insert([{
      title: '去古坑拜拜',
      description: '早上拜拜行程',
      start_time: '2026-04-06T01:00:00Z',
      end_time: '2026-04-06T04:00:00Z',
      category: '個人',
      color: '#f59e0b'
    }]);
  if (error) {
    console.error('Error:', JSON.stringify(error, null, 2));
    process.exit(1);
  } else {
    console.log('Success! Event created:', JSON.stringify(data, null, 2));
  }
}

addEvent();
