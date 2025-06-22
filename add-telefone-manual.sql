-- Execute este comando no SQL Editor do Supabase Dashboard
-- URL: https://supabase.com/dashboard/project/zdqcyemiwglybvpfczya/sql

ALTER TABLE "CAD_Profissional" ADD COLUMN telefone VARCHAR(20);

-- Verificar se a coluna foi adicionada
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'CAD_Profissional' 
  AND column_name = 'telefone';

-- Adicionar alguns telefones de exemplo para teste
UPDATE "CAD_Profissional" 
SET telefone = '(85) 99408-6263' 
WHERE id = 14 AND Profissional = 'Renata Almeida';

UPDATE "CAD_Profissional" 
SET telefone = '(85) 99999-0001' 
WHERE id = 1 AND Profissional = 'Antonio';

UPDATE "CAD_Profissional" 
SET telefone = '(85) 99999-0002' 
WHERE id = 12 AND Profissional = 'Maria';