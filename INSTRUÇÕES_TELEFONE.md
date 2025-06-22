# Adicionar Campo Telefone na Tabela CAD_Profissional

## Passo 1: Executar no Supabase SQL Editor

1. Acesse: https://supabase.com/dashboard/project/zdqcyemiwglybvpfczya
2. Vá para "SQL Editor"
3. Execute o comando:

```sql
ALTER TABLE "CAD_Profissional" ADD COLUMN telefone VARCHAR(20);
```

## Passo 2: Verificar se foi adicionada

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'CAD_Profissional' 
ORDER BY ordinal_position;
```

## Status

- ✅ Código atualizado para suportar campo telefone
- ✅ API endpoints preparados
- ✅ Formulário frontend preparado
- ⏳ Coluna precisa ser adicionada no Supabase Dashboard

Após executar o SQL acima, o campo telefone estará totalmente funcional no sistema.