// Script para adicionar coluna telefone diretamente no Supabase
const https = require('https');

const data = JSON.stringify({
  query: `
    DO $$ 
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'CAD_Profissional' AND column_name = 'telefone'
        ) THEN
            ALTER TABLE "CAD_Profissional" ADD COLUMN telefone VARCHAR(20);
            
            -- Adicionar telefones para profissionais existentes
            UPDATE "CAD_Profissional" SET telefone = '(85) 99408-6263' WHERE Profissional = 'Renata Almeida';
            UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0001' WHERE Profissional = 'Antonio';
            UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0002' WHERE Profissional = 'Maria';
            UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0003' WHERE Profissional = 'Daniel';
            UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0004' WHERE Profissional = 'George';
        END IF;
    END $$;
  `
});

const options = {
  hostname: 'zdqcyemiwglybvpfczya.supabase.co',
  port: 443,
  path: '/sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWN5ZW1pd2dseWJ2cGZjenlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDc4NDMyOSwiZXhwIjoyMDUwMzYwMzI5fQ.TLhHvGD9zBCCIIuRHNO_wpQb-0i6dGWdYFwgvnDbqIA',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWN5ZW1pd2dseWJ2cGZjenlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDc4NDMyOSwiZXhwIjoyMDUwMzYwMzI5fQ.TLhHvGD9zBCCIIuRHNO_wpQb-0i6dGWdYFwgvnDbqIA'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseBody);
    if (res.statusCode === 200) {
      console.log('✓ Coluna telefone adicionada com sucesso!');
    } else {
      console.log('⚠ Execute manualmente no Supabase SQL Editor:');
      console.log('ALTER TABLE "CAD_Profissional" ADD COLUMN telefone VARCHAR(20);');
    }
  });
});

req.on('error', (error) => {
  console.error('Erro:', error);
  console.log('\nPara adicionar manualmente:');
  console.log('1. Acesse https://supabase.com/dashboard/project/zdqcyemiwglybvpfczya/sql');
  console.log('2. Execute: ALTER TABLE "CAD_Profissional" ADD COLUMN telefone VARCHAR(20);');
});

req.write(data);
req.end();