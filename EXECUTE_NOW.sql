-- Execute este comando no Supabase SQL Editor
-- Acesse: https://supabase.com/dashboard/project/zdqcyemiwglybvpfczya/sql

-- 1. Adicionar coluna telefone na tabela CAD_Profissional
ALTER TABLE "CAD_Profissional" ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);

-- 2. Adicionar telefones para profissionais existentes
UPDATE "CAD_Profissional" SET telefone = '(85) 99408-6263' WHERE id = 14 AND Profissional = 'Renata Almeida';
UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0001' WHERE id = 1 AND Profissional = 'Antonio';
UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0002' WHERE id = 12 AND Profissional = 'Maria';
UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0003' WHERE id = 13 AND Profissional = 'Daniel';
UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0004' WHERE id = 11 AND Profissional = 'George';

-- 3. Verificar se funcionou
SELECT id, Profissional, telefone, email FROM "CAD_Profissional" ORDER BY id;