/*
  # Medical Records Table Creation
  
  1. New Tables
    - `CAD_Historico` - Stores patient medical records
      - `id` (uuid, primary key)
      - `id_paciente` (bigint, foreign key to CAD_Clientes)
      - `id_profissional` (bigint, foreign key to CAD_Profissional)
      - `data_consulta` (timestamp with time zone)
      - Various medical data fields (symptoms, diagnosis, treatment, etc.)
  
  2. Functions and Triggers
    - Creates update_updated_at_column() function if not exists
    - Creates trigger for automatic timestamp updates
  
  3. Security
    - Enables RLS on CAD_Historico
    - Adds policy for authenticated users
*/

-- Create table for medical records
CREATE TABLE IF NOT EXISTS "CAD_Historico" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_paciente bigint NOT NULL,
  id_profissional bigint NOT NULL,
  data_consulta timestamp with time zone NOT NULL DEFAULT now(),
  queixa_principal text,
  historia_doenca text,
  sinais_vitais jsonb,
  exame_fisico text,
  diagnostico text,
  plano_tratamento text,
  medicamentos jsonb[],
  exames_solicitados text[],
  retorno date,
  observacoes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT fk_paciente FOREIGN KEY (id_paciente) REFERENCES "CAD_Clientes" (id) ON DELETE CASCADE,
  CONSTRAINT fk_profissional FOREIGN KEY (id_profissional) REFERENCES "CAD_Profissional" (id) ON DELETE CASCADE
);

-- Create function for updating the updated_at timestamp if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END
$$;

-- Create trigger for updated_at timestamp only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cad_historico_updated_at') THEN
    CREATE TRIGGER update_cad_historico_updated_at
    BEFORE UPDATE ON "CAD_Historico"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

-- Add indexes for performance (IF NOT EXISTS is not supported for indexes in PostgreSQL)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_historico_paciente') THEN
    CREATE INDEX idx_historico_paciente ON "CAD_Historico" (id_paciente);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_historico_profissional') THEN
    CREATE INDEX idx_historico_profissional ON "CAD_Historico" (id_profissional);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_historico_data') THEN
    CREATE INDEX idx_historico_data ON "CAD_Historico" (data_consulta);
  END IF;
END
$$;

-- Enable Row Level Security
ALTER TABLE "CAD_Historico" ENABLE ROW LEVEL SECURITY;

-- Create policy for access (dropping first if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'CAD_Historico' 
    AND policyname = 'Authenticated users can manage medical records'
  ) THEN
    DROP POLICY "Authenticated users can manage medical records" ON "CAD_Historico";
  END IF;
END
$$;

CREATE POLICY "Authenticated users can manage medical records"
  ON "CAD_Historico"
  FOR ALL
  TO authenticated
  USING (true);