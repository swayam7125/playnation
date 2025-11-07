ALTER TABLE public.credit_transactions
ADD COLUMN created_at TIMESTAMPTZ DEFAULT now() NOT NULL;