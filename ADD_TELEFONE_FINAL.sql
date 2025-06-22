-- Execute este comando no Supabase SQL Editor
-- Acesse: https://supabase.com/dashboard/project/zdqcyemiwglybvpfczya/sql

-- Adicionar coluna telefone na tabela CAD_Profissional
ALTER TABLE "CAD_Profissional" ADD COLUMN telefone VARCHAR(20);

-- Adicionar telefones para os profissionais existentes (opcional)
UPDATE "CAD_Profissional" SET telefone = '(85) 99408-6263' WHERE Profissional = 'Renata Almeida';
UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0001' WHERE Profissional = 'Antonio';
UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0002' WHERE Profissional = 'Maria';
UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0003' WHERE Profissional = 'Daniel';
UPDATE "CAD_Profissional" SET telefone = '(85) 99999-0004' WHERE Profissional = 'George';

-- Verificar se a coluna foi adicionada corretamente
SELECT id, Profissional, telefone, email FROM "CAD_Profissional" ORDER BY id;