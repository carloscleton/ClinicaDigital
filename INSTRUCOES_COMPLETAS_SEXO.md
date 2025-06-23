# SOLUÇÃO: Campo Sexo não Salva no Banco

## PROBLEMA
A coluna "sexo" não existe na tabela CAD_Profissional do Supabase.

## SOLUÇÃO RÁPIDA
Execute este comando no Supabase SQL Editor:

```sql
ALTER TABLE "CAD_Profissional" ADD COLUMN "sexo" TEXT;
```

## PASSOS DETALHADOS

### 1. Acesse o Supabase
- Vá para: https://supabase.com/dashboard
- Entre no projeto San Mathews

### 2. Abra o SQL Editor
- Clique em "SQL Editor" no menu lateral

### 3. Execute o Comando
Cole e execute:
```sql
ALTER TABLE "CAD_Profissional" ADD COLUMN "sexo" TEXT;
```

### 4. Verificar (Opcional)
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'CAD_Profissional' AND column_name = 'sexo';
```

## RESULTADO
Após executar o comando SQL:
- O campo sexo será salvo corretamente
- A tabela mostrará valores na coluna "Sexo"
- O sistema funcionará completamente

## STATUS
- Frontend: ✅ Funcionando
- Backend: ✅ Funcionando  
- Database: ⏳ Aguardando comando SQL