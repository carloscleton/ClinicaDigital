-- Adicionar coluna 'sexo' à tabela CAD_Profissional
-- Execute este comando no Supabase SQL Editor

-- Verificar se a coluna já existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'CAD_Profissional' 
        AND column_name = 'sexo'
    ) THEN
        ALTER TABLE "CAD_Profissional" ADD COLUMN "sexo" TEXT;
        RAISE NOTICE 'Coluna sexo adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna sexo já existe.';
    END IF;
END $$;

-- Verificar o resultado
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'CAD_Profissional' 
AND column_name = 'sexo';

-- Opcional: Atualizar alguns registros existentes para teste
UPDATE "CAD_Profissional" 
SET "sexo" = CASE 
    WHEN "nome" ILIKE '%maria%' OR "nome" ILIKE '%ana%' OR "nome" ILIKE '%renata%' THEN 'Feminino'
    WHEN "nome" ILIKE '%antonio%' OR "nome" ILIKE '%daniel%' OR "nome" ILIKE '%george%' THEN 'Masculino'
    ELSE NULL
END
WHERE "sexo" IS NULL;

-- Verificar dados atualizados
SELECT id, nome, especialidade, sexo 
FROM "CAD_Profissional" 
ORDER BY id;