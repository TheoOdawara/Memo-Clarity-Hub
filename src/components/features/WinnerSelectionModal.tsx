import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { X, Trophy, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface Raffle {
  id: string;
  title: string;
  status: string;
}

interface WinnerSelectionModalProps {
  raffle: Raffle;
  onClose: () => void;
  onWinnerSelected: () => void;
}

export function WinnerSelectionModal({ raffle, onClose, onWinnerSelected }: WinnerSelectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    winner_name: '',
    winner_image_url: '',
    winner_description: ''
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Clear URL input when file is selected
      setFormData(prev => ({ ...prev, winner_image_url: '' }));
    }
  };

  const uploadWinnerImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `winner-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('raffle-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('raffle-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const selectWinner = async () => {
    if (!formData.winner_name.trim()) {
      toast.error('Please enter winner name');
      return;
    }

    setLoading(true);
    try {
      let winnerImageUrl = formData.winner_image_url;
      
      // Upload file if selected
      if (selectedFile) {
        setUploadingImage(true);
        winnerImageUrl = await uploadWinnerImage(selectedFile);
        setUploadingImage(false);
      }

      const { error } = await supabase
        .from('raffles')
        .update({
          status: 'completed',
          winner_username: formData.winner_name.trim(),
          winner_image_url: winnerImageUrl || null,
          winner_description: formData.winner_description.trim() || null
        })
        .eq('id', raffle.id);

      if (error) throw error;

      toast.success(`Winner selected: ${formData.winner_name}`);
      onWinnerSelected();
    } catch (error) {
      console.error('Error selecting winner:', error);
      toast.error('Failed to select winner');
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Select Winner - {raffle.title}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Winner Name *
            </label>
            <input
              type="text"
              required
              value={formData.winner_name}
              onChange={(e) => setFormData(prev => ({ ...prev, winner_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter winner's name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Winner Image (Optional)
            </label>
            <div className="space-y-4">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="winner-image-upload" className="cursor-pointer">
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Upload winner image
                      </span>
                      <input
                        id="winner-image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </div>

              {/* OR divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* URL Input */}
              <input
                type="url"
                value={formData.winner_image_url}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, winner_image_url: e.target.value }));
                  setPreviewUrl(e.target.value);
                  setSelectedFile(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Or enter image URL"
              />

              {/* Image Preview */}
              {previewUrl && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={previewUrl}
                    alt="Winner preview"
                    className="max-w-full h-32 object-cover rounded-md border"
                    onError={() => {
                      setPreviewUrl('');
                      toast.error('Failed to load image');
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Winner Description (Optional)
            </label>
            <textarea
              value={formData.winner_description}
              onChange={(e) => setFormData(prev => ({ ...prev, winner_description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add any additional information about the winner..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={selectWinner}
              disabled={loading || uploadingImage || !formData.winner_name.trim()}
              className="flex-1"
            >
              {loading ? 'Selecting Winner...' : uploadingImage ? 'Uploading Image...' : 'Confirm Winner'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}