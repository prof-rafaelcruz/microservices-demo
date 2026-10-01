-- Criar função para atualizar timestamp em São Paulo
CREATE OR REPLACE FUNCTION public.update_timestamp_sao_paulo()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now_sao_paulo();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar o timestamp automaticamente
DROP TRIGGER IF EXISTS update_products_timestamp ON public.products;

CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp_sao_paulo();
