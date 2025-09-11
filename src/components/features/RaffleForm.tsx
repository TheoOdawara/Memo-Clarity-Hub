import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  image_url?: string;
  start_date: string;
  end_date: string;
  winner_user_id?: string;
  winner_username?: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface RaffleFormProps {
  raffle?: Raffle | null;
  onClose: () => void;
  onSubmit: () => void;
}

export function RaffleForm({ raffle, onClose, onSubmit }: RaffleFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize: '',
    image_url: '',
    start_date: '',
    end_date: '',
    winner_username: '',
    status: 'active' as 'active' | 'completed' | 'cancelled'
  });

  useEffect(() => {
    if (raffle) {
      setFormData({
        title: raffle.title,
        description: raffle.description || '',
        prize: raffle.prize,
        image_url: raffle.image_url || '',
        start_date: new Date(raffle.start_date).toISOString().slice(0, 16),
        end_date: new Date(raffle.end_date).toISOString().slice(0, 16),
        winner_username: raffle.winner_username || '',
        status: raffle.status
      });
    } else {
      // Default start date to now, end date to one week from now
      const now = new Date();
      const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      setFormData(prev => ({
        ...prev,
        start_date: now.toISOString().slice(0, 16),
        end_date: oneWeekLater.toISOString().slice(0, 16)
      }));
    }
  }, [raffle]);

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('raffle-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from('raffle-images')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, image_url: '' })); // Clear URL when file is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let imageUrl = formData.image_url;
      
      // Upload file if selected
      if (selectedFile) {
        setUploading(true);
        imageUrl = await uploadFile(selectedFile);
        setUploading(false);
      }

      const raffleData = {
        title: formData.title,
        description: formData.description || null,
        prize: formData.prize,
        image_url: imageUrl || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        winner_username: formData.winner_username || null,
        status: formData.status,
        created_by: user.id
      };

      if (raffle) {
        // Update existing raffle
        const { error } = await supabase
          .from('raffles')
          .update(raffleData)
          .eq('id', raffle.id);

        if (error) throw error;
        toast.success('Raffle updated successfully!');
      } else {
        // Create new raffle
        const { error } = await supabase
          .from('raffles')
          .insert([raffleData]);

        if (error) throw error;
        toast.success('Raffle created successfully!');
      }

      onSubmit();
    } catch (error) {
      console.error('Error saving raffle:', error);
      toast.error('Failed to save raffle');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{raffle ? 'Edit Raffle' : 'Create New Raffle'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter raffle title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Enter raffle description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prize *
              </label>
              <input
                type="text"
                required
                value={formData.prize}
                onChange={(e) => setFormData(prev => ({ ...prev, prize: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter prize description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              
              {/* File Upload */}
              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">Upload file</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                {selectedFile && (
                  <p className="text-xs text-green-600 mt-1">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
              
              {/* URL Input */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Or enter URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, image_url: e.target.value }));
                    setSelectedFile(null); // Clear file when URL is entered
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter image URL"
                  disabled={!!selectedFile}
                />
              </div>
              
              {/* Preview */}
              {(formData.image_url || selectedFile) && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 mb-1">Preview</label>
                  <div className="w-full max-w-xs">
                    {selectedFile ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md border"
                      />
                    ) : formData.image_url ? (
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Winner Username
                </label>
                <input
                  type="text"
                  value={formData.winner_username}
                  onChange={(e) => setFormData(prev => ({ ...prev, winner_username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter winner username"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading || uploading} className="flex-1">
                {uploading ? 'Uploading...' : loading ? 'Saving...' : (raffle ? 'Update Raffle' : 'Create Raffle')}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}