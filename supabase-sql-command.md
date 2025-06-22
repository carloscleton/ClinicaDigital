# Comando SQL para adicionar coluna telefone

Execute este comando no SQL Editor do Supabase Dashboard:

```sql
ALTER TABLE "CAD_Profissional" ADD COLUMN telefone VARCHAR(20);
```

Para verificar se foi adicionada:

```sql
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'CAD_Profissional' 
ORDER BY ordinal_position;
```

Depois de executar este comando, a coluna telefone estará disponível na tabela CAD_Profissional.