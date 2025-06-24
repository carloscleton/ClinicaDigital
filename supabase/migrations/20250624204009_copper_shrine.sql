/*
  # Create Medical Records System
  
  1. New Tables
    - `CAD_Historico`: Medical records tracking patient history
  2. Indexes
    - Indexes on patient ID, professional ID, and consultation date
  3. Security
    - Enable RLS and add authenticated access policy
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

-- Create function for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at timestamp
DROP TRIGGER IF EXISTS update_cad_historico_updated_at ON "CAD_Historico";
CREATE TRIGGER update_cad_historico_updated_at
BEFORE UPDATE ON "CAD_Historico"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_historico_paciente ON "CAD_Historico" (id_paciente);
CREATE INDEX IF NOT EXISTS idx_historico_profissional ON "CAD_Historico" (id_profissional);
CREATE INDEX IF NOT EXISTS idx_historico_data ON "CAD_Historico" (data_consulta);

-- Enable Row Level Security
ALTER TABLE "CAD_Historico" ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists to avoid errors on rerun
DROP POLICY IF EXISTS "Authenticated users can manage medical records" ON "CAD_Historico";

-- Create policy for authenticated access
CREATE POLICY "Authenticated users can manage medical records"
  ON "CAD_Historico"
  FOR ALL
  TO authenticated
  USING (true);