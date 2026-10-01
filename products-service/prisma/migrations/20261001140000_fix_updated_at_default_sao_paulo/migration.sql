-- Alterar o DEFAULT da coluna updated_at para usar now_sao_paulo()
ALTER TABLE "products" ALTER COLUMN "updated_at" SET DEFAULT now_sao_paulo();
