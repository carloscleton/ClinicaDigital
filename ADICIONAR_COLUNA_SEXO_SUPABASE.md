# Instruções para Adicionar Coluna "sexo" no Supabase

## Problema Identificado
A coluna "sexo" não existe na tabela `CAD_Profissional` do Supabase, por isso as atualizações não estão sendo salvas.

## Como Resolver

### Passo 1: Acessar o Supabase
1. Vá para https://supabase.com/dashboard
2. Entre no seu projeto San Mathews
3. Clique na aba "SQL Editor" no menu lateral

### Passo 2: Executar o Comando SQL
Cole e execute este comando no SQL Editor:

```sql
ALTER TABLE "CAD_Profissional" 
ADD COLUMN "sexo" TEXT;
```

### Passo 3: Verificar se Funcionou
Execute este comando para confirmar que a coluna foi criada:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'CAD_Profissional' 
AND column_name = 'sexo';
```

### Passo 4: Testar no Sistema
Após adicionar a coluna, volte ao Dashboard → Profissionais e teste editar um profissional selecionando o sexo. Agora deve funcionar corretamente.

## Resultado Esperado
- Campo "sexo" será salvo no banco de dados
- Tabela mostrará a coluna "Sexo" com os valores corretos
- Sistema funcionará completamente

## Status Atual
❌ Coluna "sexo" não existe na tabela CAD_Profissional  
⏳ Aguardando criação manual da coluna no Supabase  
✅ Frontend já configurado corretamente  
✅ Backend já configurado corretamente  