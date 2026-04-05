// Script to seed database with default data if empty
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (require('fs').existsSync(envPath)) {
  const envContent = require('fs').readFileSync(envPath, 'utf-8');
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

const defaultData = {
  tasks: [
    { title: 'Review Mission Control UI', status: 'completed', priority: 'high' },
    { title: 'Deploy to Vercel', status: 'completed', priority: 'high' },
    { title: 'Add data persistence', status: 'in_progress', priority: 'medium' },
    { title: 'Sync with OpenClaw Gateway', status: 'pending', priority: 'low' }
  ],
  projects: [
    { name: 'Mission Control', status: 'active', progress: 75, color: '#3b82f6' },
    { name: 'Tricera Integration', status: 'on_hold', progress: 30, color: '#f59e0b' },
    { name: 'OpenClaw Automation', status: 'planning', progress: 10, color: '#10b981' }
  ],
  activities: [
    { action: 'Deployed Mission Control', type: 'deployment' },
    { action: 'Updated Office page design', type: 'update' },
    { action: 'Added energy system for dinos', type: 'feature' }
  ],
  stats: {
    tasks_completed: 12,
    in_progress: 5,
    scheduled: 8,
    documents: 24
  }
};

async function seedDatabase() {
  try {
    console.log('🌱 Checking if database needs seeding...\n');

    // Check if tasks exist
    const { data: existingTasks, error: tasksCheckError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);

    if (tasksCheckError) {
      console.error('❌ Error checking tasks:', tasksCheckError.message);
      console.log('\n📋 Make sure to run the schema SQL first:');
      console.log('   npx supabase sql < supabase/dashboard_schema.sql');
      return;
    }

    if (existingTasks && existingTasks.length > 0) {
      console.log('✅ Database already has data, skipping seed.');
      return;
    }

    console.log('📦 Seeding database with default data...\n');

    // Seed projects first
    console.log('🗂️  Creating default projects...');
    for (const project of defaultData.projects) {
      const { error } = await supabase.from('projects').insert([project]);
      if (error) {
        console.error(`  ❌ Failed to create project "${project.name}":`, error.message);
      } else {
        console.log(`  ✅ Created project: ${project.name}`);
      }
    }

    // Seed tasks
    console.log('\n📋 Creating default tasks...');
    for (const task of defaultData.tasks) {
      const { error } = await supabase.from('tasks').insert([task]);
      if (error) {
        console.error(`  ❌ Failed to create task "${task.title}":`, error.message);
      } else {
        console.log(`  ✅ Created task: ${task.title}`);
      }
    }

    // Seed activities
    console.log('\n📊 Creating default activities...');
    for (const activity of defaultData.activities) {
      const { error } = await supabase.from('activities').insert([activity]);
      if (error) {
        console.error(`  ❌ Failed to create activity:`, error.message);
      } else {
        console.log(`  ✅ Created activity: ${activity.action}`);
      }
    }

    // Update stats
    console.log('\n📈 Updating dashboard stats...');
    const { error: statsError } = await supabase
      .from('dashboard_stats')
      .update(defaultData.stats)
      .eq('id', 1);

    if (statsError) {
      console.error('  ❌ Failed to update stats:', statsError.message);
    } else {
      console.log('  ✅ Updated dashboard stats');
    }

    console.log('\n✨ Database seeding complete!');
    console.log('\n🚀 Your Mission Control dashboard is ready with default data!');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
