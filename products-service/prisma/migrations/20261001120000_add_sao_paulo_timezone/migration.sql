-- Criar função que retorna a hora atual em São Paulo
CREATE OR REPLACE FUNCTION public.now_sao_paulo()
RETURNS timestamptz AS $$
BEGIN
    RETURN NOW() AT TIME ZONE 'America/Sao_Paulo';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Configurar o timezone padrão do banco
ALTER DATABASE postgres SET timezone = 'America/Sao_Paulo';
