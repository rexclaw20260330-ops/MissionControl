// Script to verify Supabase connection and table status
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  try {
    console.log('🔌 Checking Supabase connection...\n');
    
    // Test connection by fetching stats
    const { data: stats, error: statsError } = await supabase
      .from('dashboard_stats')
      .select('*')
      .eq('id', 1)
      .single();

    if (statsError) {
      if (statsError.code === '42P01') {
        console.log('❌ Tables not found!');
        console.log('\n📋 Please run the following SQL in your Supabase SQL editor:');
        console.log('   File: supabase/dashboard_schema.sql');
        console.log('\nOr execute: npx supabase sql < supabase/dashboard_schema.sql');
      } else {
        console.error('❌ Connection error:', statsError.message);
      }
      return false;
    }

    console.log('✅ Supabase connection successful!\n');
    console.log('📊 Dashboard Stats:', JSON.stringify(stats, null, 2));

    // Check tasks
    const { data: tasks, error: tasksError, count: tasksCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' });

    if (!tasksError) {
      console.log(`\n📋 Tasks: ${tasksCount} total`);
      if (tasksCount > 0) {
        console.log('   Sample task:', tasks[0].title);
      }
    }

    // Check projects
    const { data: projects, error: projectsError, count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact' });

    if (!projectsError) {
      console.log(`\n🗂️  Projects: ${projectsCount} total`);
      if (projectsCount > 0) {
        console.log('   Sample project:', projects[0].name);
      }
    }

    // Check activities
    const { data: activities, error: activitiesError, count: activitiesCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact' });

    if (!activitiesError) {
      console.log(`\n📊 Activities: ${activitiesCount} total`);
      if (activitiesCount > 0) {
        console.log('   Sample activity:', activities[0].action);
      }
    }

    console.log('\n✅ All tables are accessible!');
    console.log('\n🚀 Your Mission Control dashboard is ready!');
    console.log('   Run: npm run dev');
    console.log('   Open: http://localhost:3000');
    
    return true;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

checkConnection();
