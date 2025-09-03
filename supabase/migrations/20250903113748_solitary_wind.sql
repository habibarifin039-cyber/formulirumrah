/*
  # Create Umroh Registration System

  1. New Tables
    - `umroh_registrations`
      - `id` (uuid, primary key)
      - `registration_id` (text, unique) - Auto-generated registration number
      - `registration_date` (date) - Date of registration
      - `full_name` (text) - Nama sesuai Paspor
      - `gender` (text) - Jenis Kelamin (L/P)
      - `birth_place` (text) - Tempat Lahir
      - `birth_date` (date) - Tanggal Lahir
      - `father_name` (text) - Nama Ayah
      - `mother_name` (text) - Nama Ibu
      - `address` (text) - Alamat Lengkap
      - `city` (text) - Kota
      - `province` (text) - Provinsi
      - `postal_code` (text) - Kode Pos
      - `occupation` (text) - Pekerjaan
      - `has_special_illness` (boolean) - Memiliki penyakit khusus
      - `illness_details` (text) - Detail penyakit khusus
      - `needs_special_care` (boolean) - Membutuhkan penanganan khusus
      - `special_care_details` (text) - Detail penanganan khusus
      - `needs_wheelchair` (boolean) - Membutuhkan kursi roda
      - `nik` (text) - NIK 16 digit
      - `passport_number` (text) - Nomor Paspor
      - `passport_issue_date` (date) - Tanggal Terbit Paspor
      - `passport_expiry_date` (date) - Tanggal Berakhir Paspor
      - `passport_issue_place` (text) - Tempat Terbit Paspor
      - `phone` (text) - Nomor Telepon
      - `whatsapp` (text) - Nomor WhatsApp
      - `email` (text) - Email
      - `has_umrah_experience` (boolean) - Sudah pernah umroh
      - `has_hajj_experience` (boolean) - Sudah pernah haji
      - `emergency_contact_name` (text) - Nama Kontak Darurat
      - `emergency_contact_relation` (text) - Hubungan Kontak Darurat
      - `emergency_contact_phone` (text) - Telepon Kontak Darurat
      - `marital_status` (text) - Status Pernikahan
      - `selected_package` (text) - Paket yang dipilih
      - `payment_method` (text) - Metode Pembayaran
      - `created_at` (timestamp) - Waktu pembuatan record
      - `updated_at` (timestamp) - Waktu update terakhir

  2. Security
    - Enable RLS on `umroh_registrations` table
    - Add policy for public insert (registration form is public)
    - Add policy for authenticated users to read all data (for admin)
*/

CREATE TABLE IF NOT EXISTS umroh_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id text UNIQUE NOT NULL,
  registration_date date NOT NULL DEFAULT CURRENT_DATE,
  full_name text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('L', 'P')),
  birth_place text NOT NULL,
  birth_date date NOT NULL,
  father_name text NOT NULL,
  mother_name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  postal_code text DEFAULT '',
  occupation text NOT NULL,
  has_special_illness boolean DEFAULT false,
  illness_details text DEFAULT '',
  needs_special_care boolean DEFAULT false,
  special_care_details text DEFAULT '',
  needs_wheelchair boolean DEFAULT false,
  nik text NOT NULL,
  passport_number text NOT NULL,
  passport_issue_date date NOT NULL,
  passport_expiry_date date NOT NULL,
  passport_issue_place text NOT NULL,
  phone text NOT NULL,
  whatsapp text NOT NULL,
  email text DEFAULT '',
  has_umrah_experience boolean DEFAULT false,
  has_hajj_experience boolean DEFAULT false,
  emergency_contact_name text NOT NULL,
  emergency_contact_relation text NOT NULL,
  emergency_contact_phone text NOT NULL,
  marital_status text DEFAULT '',
  selected_package text NOT NULL,
  payment_method text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE umroh_registrations ENABLE ROW LEVEL SECURITY;

-- Policy for public registration (anyone can insert)
CREATE POLICY "Anyone can register for umroh"
  ON umroh_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for authenticated users to read all registrations (for admin)
CREATE POLICY "Authenticated users can read all registrations"
  ON umroh_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to update registrations (for admin)
CREATE POLICY "Authenticated users can update registrations"
  ON umroh_registrations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_umroh_registrations_updated_at
  BEFORE UPDATE ON umroh_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_umroh_registrations_registration_id 
  ON umroh_registrations(registration_id);

CREATE INDEX IF NOT EXISTS idx_umroh_registrations_created_at 
  ON umroh_registrations(created_at);