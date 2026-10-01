# Solução para Problema de Timezone no Supabase

## Problema
As datas de criação (`createdAt`) e atualização (`updatedAt`) estão 3 horas a frente (UTC em vez de America/Sao_Paulo).

## Causa
O PostgreSQL no Supabase está configurado com timezone UTC por padrão. As datas são salvas em UTC, mas você precisa delas em São Paulo (UTC-3).

## Solução

### Opção 1: Configurar via SQL no Supabase (Recomendado)

Execute os seguintes comandos SQL no Editor SQL do Supabase:

```sql
-- 1. Configurar timezone da sessão
SET TIME ZONE 'America/Sao_Paulo';

-- 2. Criar uma função que converte datas automaticamente
CREATE OR REPLACE FUNCTION public.now_sao_paulo()
RETURNS timestamptz AS $$
BEGIN
    RETURN NOW() AT TIME ZONE 'America/Sao_Paulo';
END;
$$ LANGUAGE plpgsql;

-- 3. Atualizar a tabela products para usar a função (opcional, para novos registros)
ALTER TABLE public.products ALTER COLUMN created_at SET DEFAULT now_sao_paulo();
```

### Opção 2: Converter datas no código Node.js

Edite `src/services/product.service.js` para converter as datas:

```javascript
function adjustTimezone(product) {
    if (!product) return product;
    
    const adjusted = { ...product };
    
    // Converter Decimal para number
    if (adjusted.price && adjusted.price.toNumber) {
        adjusted.price = adjusted.price.toNumber();
    }
    
    // Ajustar timezone das datas (subtrair 3 horas porque estão em UTC)
    if (adjusted.createdAt) {
        const date = new Date(adjusted.createdAt);
        adjusted.createdAt = new Date(date.getTime() - 3 * 60 * 60 * 1000);
    }
    
    if (adjusted.updatedAt) {
        const date = new Date(adjusted.updatedAt);
        adjusted.updatedAt = new Date(date.getTime() - 3 * 60 * 60 * 1000);
    }
    
    return adjusted;
}
```

### Opção 3: Usar AT TIME ZONE nas queries do Prisma

Modifique as queries para converter automaticamente:

```javascript
// Em repositories/product.repository.js
const findAll = async () => {
    const products = await prisma.$queryRaw`
        SELECT 
            id,
            name,
            price,
            created_at AT TIME ZONE 'America/Sao_Paulo' as created_at,
            updated_at AT TIME ZONE 'America/Sao_Paulo' as updated_at
        FROM products
    `;
    return products;
};
```

## Teste após aplicar a solução

```bash
# 1. Criar um novo produto
curl -X POST http://localhost:3002/products \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{"name":"Produto Teste","price":99.99}'

# 2. Verificar se a data está correta
curl http://localhost:3002/products
```

## Verificação no Supabase

1. Abra o Supabase Dashboard
2. Vá para `SQL Editor`
3. Execute:

```sql
SELECT 
    id,
    name,
    price,
    created_at,
    created_at AT TIME ZONE 'America/Sao_Paulo' as created_at_sp
FROM products
ORDER BY id DESC
LIMIT 5;
```

Você verá duas colunas com a mesma data, mas uma em UTC e outra em São Paulo.
