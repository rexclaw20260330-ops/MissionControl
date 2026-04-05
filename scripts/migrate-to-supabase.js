// Script to migrate data from db.json to Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs/promises');
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

async function migrateData() {
  try {
    // Read db.json
    const dbPath = path.join(__dirname, '..', 'data', 'db.json');
    const rawData = await fs.readFile(dbPath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log('📦 Migrating data from db.json to Supabase...\n');

    // Migrate projects first (tasks may reference them)
    console.log('🗂️  Migrating projects...');
    for (const project of data.projects || []) {
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert([{
          name: project.name,
          description: null,
          status: project.status,
          progress: project.progress,
          color: '#3b82f6',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error(`  ❌ Failed to migrate project "${project.name}":`, error.message);
      } else {
        console.log(`  ✅ Migrated project: ${project.name}`);
      }
    }

    // Migrate tasks
    console.log('\n📋 Migrating tasks...');
    for (const task of data.tasks || []) {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          title: task.title,
          description: null,
          status: task.status,
          priority: task.priority,
          due_date: null,
          created_at: task.createdAt
        }]);

      if (error) {
        console.error(`  ❌ Failed to migrate task "${task.title}":`, error.message);
      } else {
        console.log(`  ✅ Migrated task: ${task.title}`);
      }
    }

    // Migrate activities
    console.log('\n📊 Migrating activities...');
    for (const activity of data.activities || []) {
      const { error } = await supabase
        .from('activities')
        .insert([{
          action: activity.action,
          type: activity.type,
          metadata: {},
          created_at: activity.timestamp
        }]);

      if (error) {
        console.error(`  ❌ Failed to migrate activity:`, error.message);
      } else {
        console.log(`  ✅ Migrated activity: ${activity.action}`);
      }
    }

    // Migrate stats
    console.log('\n📈 Migrating dashboard stats...');
    const { error: statsError } = await supabase
      .from('dashboard_stats')
      .update({
        tasks_completed: data.stats?.tasksCompleted || 0,
        in_progress: data.stats?.inProgress || 0,
        scheduled: data.stats?.scheduled || 0,
        documents: data.stats?.documents || 0,
        updated_at: data.lastUpdated || new Date().toISOString()
      })
      .eq('id', 1);

    if (statsError) {
      console.error('  ❌ Failed to migrate stats:', statsError.message);
    } else {
      console.log('  ✅ Migrated dashboard stats');
    }

    console.log('\n✨ Migration complete!');
    console.log('\nNext steps:');
    console.log('  1. Run the dashboard_schema.sql in your Supabase SQL editor');
    console.log('  2. Start the dev server: npm run dev');
    console.log('  3. Open http://localhost:3000 to see the dashboard');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateData();
