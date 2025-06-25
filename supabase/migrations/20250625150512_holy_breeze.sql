-- Migração para conectar CAD_Especialidade com CAD_Profissional
/*
  # Conexão entre Especialidades e Profissionais

  1. Novas Relações
    - Verifica e garante a relação entre CAD_Profissional e CAD_Especialidade
    - Adiciona chave estrangeira se não existir
  
  2. Índices
    - Cria índice para melhorar performance de consultas por especialidade
*/

-- Verificar se a coluna id_Especialidade existe em CAD_Profissional
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'CAD_Profissional' AND column_name = 'id_Especialidade'
    ) THEN
        -- Adicionar coluna id_Especialidade se não existir
        ALTER TABLE "CAD_Profissional" ADD COLUMN "id_Especialidade" BIGINT;
        
        -- Adicionar chave estrangeira
        ALTER TABLE "CAD_Profissional" 
        ADD CONSTRAINT "CAD_Profissional_id_Especialidade_fkey" 
        FOREIGN KEY ("id_Especialidade") 
        REFERENCES "CAD_Especialidade"(id);
    END IF;
END $$;

-- Verificar se o índice existe e criar se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'CAD_Profissional' AND indexname = 'idx_profissional_especialidade'
    ) THEN
        -- Criar índice para melhorar performance
        CREATE INDEX "idx_profissional_especialidade" ON "CAD_Profissional" ("id_Especialidade");
    END IF;
END $$;

-- Atualizar profissionais existentes com especialidades correspondentes
-- Isso é feito apenas se a coluna id_Especialidade estiver vazia para a maioria dos registros
DO $$ 
DECLARE
    total_count INTEGER;
    null_count INTEGER;
BEGIN
    -- Contar total de registros e registros com id_Especialidade NULL
    SELECT COUNT(*) INTO total_count FROM "CAD_Profissional";
    SELECT COUNT(*) INTO null_count FROM "CAD_Profissional" WHERE "id_Especialidade" IS NULL;
    
    -- Se mais de 50% dos registros tiverem id_Especialidade NULL, tente atualizar
    IF null_count > total_count * 0.5 THEN
        -- Atualizar baseado na correspondência de Profissão com Especialidade.Especialidade
        UPDATE "CAD_Profissional" AS p
        SET "id_Especialidade" = e.id
        FROM "CAD_Especialidade" AS e
        WHERE p."Profissão" = e."Especialidade"
        AND p."id_Especialidade" IS NULL;
    END IF;
END $$;