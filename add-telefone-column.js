import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zdqcyemiwglybvpfczya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWN5ZW1pd2dseWJ2cGZjenlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3ODQzMjksImV4cCI6MjA1MDM2MDMyOX0.2kZqYjr7fQhMKbKi5kn6rDkYFdRr98gA0OcOwQf3L8g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTelefoneColumn() {
  try {
    console.log('Tentando adicionar coluna telefone...');
    
    // Primeiro, verificar se a coluna já existe
    const { data: checkData, error: checkError } = await supabase
      .from('CAD_Profissional')
      .select('telefone')
      .limit(1);

    if (checkError && checkError.code === '42703') {
      console.log('Coluna telefone não existe, tentando adicionar...');
      
      // Tentar usar RPC para executar SQL
      const { data, error } = await supabase
        .rpc('exec_sql', { 
          sql: 'ALTER TABLE "CAD_Profissional" ADD COLUMN telefone VARCHAR(20);' 
        });

      if (error) {
        console.error('Erro ao adicionar coluna via RPC:', error);
        console.log('\nPara adicionar manualmente:');
        console.log('1. Acesse https://supabase.com/dashboard');
        console.log('2. Vá para Table Editor > CAD_Profissional');
        console.log('3. Clique em "Add Column"');
        console.log('4. Nome: telefone');
        console.log('5. Tipo: varchar');
        console.log('6. Tamanho: 20');
        console.log('7. Nullable: true');
      } else {
        console.log('Coluna telefone adicionada com sucesso!');
      }
    } else if (checkError) {
      console.error('Erro ao verificar coluna:', checkError);
    } else {
      console.log('Coluna telefone já existe!');
    }
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

addTelefoneColumn();