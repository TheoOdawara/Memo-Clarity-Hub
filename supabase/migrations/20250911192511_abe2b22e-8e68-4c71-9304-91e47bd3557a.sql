-- Create storage bucket for raffle images
INSERT INTO storage.buckets (id, name, public) VALUES ('raffle-images', 'raffle-images', true);

-- Create policies for raffle image uploads
CREATE POLICY "Allow public access to raffle images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'raffle-images');

-- Only admin users can upload raffle images
CREATE POLICY "Admin users can upload raffle images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'raffle-images' AND 
  auth.uid() IN (
    'e125efb8-857b-41b5-943b-745f11fd5808'::uuid,
    'fed35ccf-2bd5-4d64-a50c-e8bb951c632c'::uuid
  )
);

-- Admin users can update raffle images
CREATE POLICY "Admin users can update raffle images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'raffle-images' AND 
  auth.uid() IN (
    'e125efb8-857b-41b5-943b-745f11fd5808'::uuid,
    'fed35ccf-2bd5-4d64-a50c-e8bb951c632c'::uuid
  )
);

-- Admin users can delete raffle images
CREATE POLICY "Admin users can delete raffle images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'raffle-images' AND 
  auth.uid() IN (
    'e125efb8-857b-41b5-943b-745f11fd5808'::uuid,
    'fed35ccf-2bd5-4d64-a50c-e8bb951c632c'::uuid
  )
);