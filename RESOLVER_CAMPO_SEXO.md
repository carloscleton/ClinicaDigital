# SOLUÇÃO: Adicionar Campo Sexo no Supabase

## COMANDO SQL PARA EXECUTAR

Acesse https://supabase.com/dashboard → Projeto San Mathews → SQL Editor

Execute este comando:

```sql
ALTER TABLE "CAD_Profissional" ADD COLUMN "sexo" TEXT;
```

## VERIFICAR SE FUNCIONOU

Após executar o comando, execute esta verificação:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'CAD_Profissional' AND column_name = 'sexo';
```

## RESULTADO ESPERADO

Deve retornar:
```
column_name
-----------
sexo
```

## TESTAR O SISTEMA

1. Volte ao Dashboard → Profissionais
2. Edite qualquer profissional
3. Selecione um sexo
4. Clique "Atualizar"
5. O campo sexo deve aparecer na tabela

## STATUS

- ❌ Coluna "sexo" não existe na tabela CAD_Profissional
- ✅ Frontend enviando dados corretamente  
- ✅ Backend processando dados corretamente
- ⏳ Aguardando execução do comando SQL no Supabase