import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zdqcyemiwglybvpfczya.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWN5ZW1pd2dseWJ2cGZjenlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDc4NDMyOSwiZXhwIjoyMDUwMzYwMzI5fQ.TLhHvGD9zBCCIIuRHNO_wpQb-0i6dGWdYFwgvnDbqIA';

// Use service role key for DDL operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function addTelefoneColumn() {
  try {
    console.log('Adicionando coluna telefone na tabela CAD_Profissional...');
    
    const { data, error } = await supabaseAdmin.rpc('exec_sql', {
      sql: 'ALTER TABLE "CAD_Profissional" ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);'
    });

    if (error) {
      console.error('Erro ao adicionar coluna:', error);
      
      // Try direct SQL execution through connection string
      const { data: sqlData, error: sqlError } = await supabaseAdmin
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'CAD_Profissional')
        .eq('column_name', 'telefone');

      if (sqlError || !sqlData || sqlData.length === 0) {
        console.log('Coluna telefone não existe. Execute manualmente no Supabase SQL Editor:');
        console.log('ALTER TABLE "CAD_Profissional" ADD COLUMN telefone VARCHAR(20);');
        return false;
      } else {
        console.log('Coluna telefone já existe!');
        return true;
      }
    } else {
      console.log('Coluna telefone adicionada com sucesso!');
      return true;
    }
  } catch (error) {
    console.error('Erro geral:', error);
    return false;
  }
}

addTelefoneColumn().then(success => {
  if (success) {
    console.log('✓ Coluna telefone está disponível na tabela CAD_Profissional');
  } else {
    console.log('⚠ Execute manualmente no Supabase Dashboard SQL Editor:');
    console.log('ALTER TABLE "CAD_Profissional" ADD COLUMN telefone VARCHAR(20);');
  }
  process.exit(0);
});