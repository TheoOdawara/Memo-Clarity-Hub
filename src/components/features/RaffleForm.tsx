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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const raffleData = {
        title: formData.title,
        description: formData.description || null,
        prize: formData.prize,
        image_url: formData.image_url || null,
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
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter image URL"
              />
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
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : (raffle ? 'Update Raffle' : 'Create Raffle')}
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