-- COMANDO PARA EXECUTAR NO SUPABASE SQL EDITOR
-- Este comando adiciona a coluna 'sexo' na tabela CAD_Profissional

-- 1. Adicionar a coluna 'sexo'
ALTER TABLE "CAD_Profissional" ADD COLUMN IF NOT EXISTS "sexo" TEXT;

-- 2. Verificar se a coluna foi criada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'CAD_Profissional' 
AND column_name = 'sexo';

-- 3. Opcional: Atualizar registros existentes baseado no nome
UPDATE "CAD_Profissional" 
SET "sexo" = CASE 
    WHEN "nome" ILIKE '%maria%' OR "nome" ILIKE '%renata%' THEN 'Feminino'
    WHEN "nome" ILIKE '%antonio%' OR "nome" ILIKE '%daniel%' OR "nome" ILIKE '%george%' THEN 'Masculino'
    ELSE NULL
END
WHERE "sexo" IS NULL;

-- 4. Verificar dados atualizados
SELECT id, nome, especialidade, sexo 
FROM "CAD_Profissional" 
ORDER BY id;