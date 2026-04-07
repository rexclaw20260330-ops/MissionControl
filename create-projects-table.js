const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eocgffkpqorpqiehlquk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2dmZmtwcW9ycHFpZWhscXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjI2MzYsImV4cCI6MjA5MDg5ODYzNn0.TnhbvhT_SYmYsWJrP2ruE_ljcUMKGjYbyVXcwy53SUY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProjectsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS projects (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'done')),
      progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
      deadline DATE,
      user_id TEXT DEFAULT 'yuan',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.log('RPC error, trying direct query:', error.message);
    } else {
      console.log('Table created successfully via RPC');
    }
  } catch (e) {
    console.log('Error:', e.message);
    console.log('Please run the SQL manually in Supabase dashboard');
  }
}

createProjectsTable();
