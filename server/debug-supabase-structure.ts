import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://zdqcyemiwglybvpfczya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWN5ZW1pd2dseWJ2cGZjenlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MzIwMjksImV4cCI6MjA2NjEwODAyOX0.eRUuO0H3nuJwHMljwxAhlaZpOFRcc2LN4puAfbZvvrI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugTableStructure() {
  console.log('=== Debugando estrutura da tabela CAD_Profissional ===');
  
  try {
    const { data, error } = await supabase
      .from('CAD_Profissional')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Erro ao buscar dados:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('Colunas disponíveis:', Object.keys(data[0]));
      console.log('Primeiro registro completo:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('Nenhum dado encontrado na tabela');
    }
  } catch (error) {
    console.error('Erro na conexão:', error);
  }
}

debugTableStructure();