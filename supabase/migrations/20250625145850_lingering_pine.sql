/*
  # Add Telefone Column to CAD_Profissional Table
  
  1. New Columns
    - `Telefone` (varchar(20)) - Phone number for professionals
  
  2. Changes
    - Adds phone number field to existing professionals table
    
  3. Security
    - No changes to RLS policies
*/

-- Check if column exists before adding
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'CAD_Profissional' AND column_name = 'Telefone'
    ) THEN
        -- Add the Telefone column
        ALTER TABLE "CAD_Profissional" ADD COLUMN "Telefone" VARCHAR(20);
        
        -- Add sample data for existing professionals
        UPDATE "CAD_Profissional" SET "Telefone" = '(85) 99408-6263' WHERE id = 14 AND "Profissional" = 'Renata Almeida';
        UPDATE "CAD_Profissional" SET "Telefone" = '(85) 99999-0001' WHERE id = 1 AND "Profissional" = 'Antonio';
        UPDATE "CAD_Profissional" SET "Telefone" = '(85) 99999-0002' WHERE id = 12 AND "Profissional" = 'Maria';
        UPDATE "CAD_Profissional" SET "Telefone" = '(85) 99999-0003' WHERE id = 13 AND "Profissional" = 'Daniel';
        UPDATE "CAD_Profissional" SET "Telefone" = '(85) 99999-0004' WHERE id = 11 AND "Profissional" = 'George';
    END IF;
END $$;