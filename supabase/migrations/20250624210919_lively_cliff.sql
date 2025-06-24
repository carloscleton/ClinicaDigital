/*
  # Medical Records Table Creation
  
  1. New Tables
    - `CAD_Historico` - Stores patient medical records
      - `id` (uuid, primary key)
      - `id_paciente` (bigint, foreign key to CAD_Clientes)
      - `id_profissional` (bigint, foreign key to CAD_Profissional)
      - Various medical data fields (symptoms, diagnosis, treatment, etc.)
  
  2. Indexes
    - Added for patient, professional, and date lookups
    
  3. Security
    - Enabled RLS with policy for authenticated users
*/

-- Create table for medical records (if not exists)
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

-- Create or replace function for updating timestamps
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

-- Add index for patient lookups
DROP INDEX IF EXISTS idx_historico_paciente;
CREATE INDEX idx_historico_paciente ON "CAD_Historico" (id_paciente);

-- Add index for professional lookups
DROP INDEX IF EXISTS idx_historico_profissional;
CREATE INDEX idx_historico_profissional ON "CAD_Historico" (id_profissional);

-- Add index for date-based lookups
DROP INDEX IF EXISTS idx_historico_data;
CREATE INDEX idx_historico_data ON "CAD_Historico" (data_consulta);

-- Enable Row Level Security
ALTER TABLE "CAD_Historico" ENABLE ROW LEVEL SECURITY;

-- Create policy for access
DROP POLICY IF EXISTS "Authenticated users can manage medical records" ON "CAD_Historico";
CREATE POLICY "Authenticated users can manage medical records"
  ON "CAD_Historico"
  FOR ALL
  TO authenticated
  USING (true);