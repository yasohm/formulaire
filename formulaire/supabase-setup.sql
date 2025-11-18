-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  date_naissance DATE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telephone TEXT NOT NULL,
  cne_massar TEXT NOT NULL,
  niveau TEXT NOT NULL,
  filiere TEXT NOT NULL,
  question TEXT,
  photo_identite TEXT,
  certificat_scolarite TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for registration)
CREATE POLICY "Allow public inserts" ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow selects (for admin - you may want to restrict this)
-- For now, we'll allow public reads, but you should add authentication
CREATE POLICY "Allow public selects" ON registrations
  FOR SELECT
  TO anon
  USING (true);

-- Create policy to allow deletes (for admin - you may want to restrict this)
CREATE POLICY "Allow public deletes" ON registrations
  FOR DELETE
  TO anon
  USING (true);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow uploads
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'uploads');

-- Create storage policy to allow public reads
CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'uploads');

-- Create storage policy to allow deletes
CREATE POLICY "Allow public deletes" ON storage.objects
  FOR DELETE
  TO anon
  USING (bucket_id = 'uploads');

