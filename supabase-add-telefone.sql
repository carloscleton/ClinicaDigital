-- SQL para adicionar coluna telefone na tabela CAD_Profissional
-- Execute este comando no SQL Editor do Supabase Dashboard

ALTER TABLE "CAD_Profissional" 
ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'CAD_Profissional' 
ORDER BY ordinal_position;