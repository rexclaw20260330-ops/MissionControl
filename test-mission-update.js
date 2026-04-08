// Test script to verify mission update functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eocgffkpqorpqiehlquk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2dmZmtwcW9ycHFpZWhscXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjI2MzYsImV4cCI6MjA5MDg5ODYzNn0.TnhbvhT_SYmYsWJrP2ruE_ljcUMKGjYbyVXcwy53SUY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMissionUpdate() {
  console.log('Testing mission update...');
  
  // Get a mission
  const { data: missions, error: fetchError } = await supabase
    .from('missions')
    .select('*')
    .limit(1);
  
  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return;
  }
  
  if (!missions || missions.length === 0) {
    console.log('No missions found');
    return;
  }
  
  const mission = missions[0];
  console.log('Found mission:', mission.id, mission.name);
  console.log('Current status:', mission.status);
  console.log('Current priority:', mission.priority);
  
  // Try to update status
  const newStatus = mission.status === 'planning' ? 'active' : 'planning';
  console.log('Attempting to update status to:', newStatus);
  
  const { data: updated, error: updateError } = await supabase
    .from('missions')
    .update({ status: newStatus })
    .eq('id', mission.id)
    .select()
    .single();
  
  if (updateError) {
    console.error('Update error:', updateError);
    return;
  }
  
  console.log('Update result:', updated);
  console.log('Status after update:', updated.status);
  
  // Revert back
  console.log('Reverting status back...');
  await supabase
    .from('missions')
    .update({ status: mission.status })
    .eq('id', mission.id);
  
  console.log('Test complete!');
}

testMissionUpdate();
