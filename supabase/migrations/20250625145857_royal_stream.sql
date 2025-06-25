/*
  # Add Sexo Column to CAD_Profissional Table
  
  1. New Columns
    - `sexo` (text) - Gender field for professionals
  
  2. Changes
    - Adds gender field to existing professionals table
    
  3. Security
    - No changes to RLS policies
*/

-- Check if column exists before adding
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'CAD_Profissional' AND column_name = 'sexo'
    ) THEN
        -- Add the sexo column
        ALTER TABLE "CAD_Profissional" ADD COLUMN "sexo" TEXT;
        
        -- Add sample data for existing professionals based on names
        UPDATE "CAD_Profissional" 
        SET "sexo" = CASE 
            WHEN "Profissional" ILIKE '%maria%' OR "Profissional" ILIKE '%renata%' THEN 'Feminino'
            WHEN "Profissional" ILIKE '%antonio%' OR "Profissional" ILIKE '%daniel%' OR "Profissional" ILIKE '%george%' THEN 'Masculino'
            ELSE NULL
        END
        WHERE "sexo" IS NULL;
    END IF;
END $$;