import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Gift, Calendar, Trophy, Plus, Edit } from 'lucide-react';
import { RaffleForm } from '@/components/features/RaffleForm';
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
  created_at: string;
}

const ADMIN_USER_IDS = [
  'e125efb8-857b-41b5-943b-745f11fd5808',
  'fed35ccf-2bd5-4d64-a50c-e8bb951c632c'
];

export default function Raffles() {
  const { user } = useAuth();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRaffle, setEditingRaffle] = useState<Raffle | null>(null);
  
  const isAdmin = user && ADMIN_USER_IDS.includes(user.id);

  useEffect(() => {
    fetchRaffles();
  }, []);

  const fetchRaffles = async () => {
    try {
      const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRaffles(data || []);
    } catch (error) {
      console.error('Error fetching raffles:', error);
      toast.error('Failed to load raffles');
    } finally {
      setLoading(false);
    }
  };

  const handleRaffleSubmit = async () => {
    await fetchRaffles();
    setShowForm(false);
    setEditingRaffle(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Raffles</h1>
          <p className="text-gray-600 mt-2">Enter exciting raffles and win amazing prizes!</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Raffle
          </Button>
        )}
      </div>

      {raffles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gift className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Raffles Available</h3>
            <p className="text-gray-600 text-center">
              There are no active raffles at the moment. Check back soon for exciting prizes!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {raffles.map((raffle) => (
            <Card key={raffle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {raffle.image_url && (
                <div className="aspect-video bg-gray-100">
                  <img
                    src={raffle.image_url}
                    alt={raffle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {raffle.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(raffle.status)}>
                      {raffle.status}
                    </Badge>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingRaffle(raffle);
                          setShowForm(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {raffle.description && (
                  <p className="text-gray-600 line-clamp-3">{raffle.description}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Gift className="w-4 h-4" />
                    <span className="font-medium">Prize: {raffle.prize}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Ends: {formatDate(raffle.end_date)}</span>
                  </div>
                  
                  {raffle.status === 'completed' && raffle.winner_username && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>Winner: {raffle.winner_username}</span>
                    </div>
                  )}
                </div>

                {raffle.status === 'active' && (
                  <Button className="w-full" disabled>
                    Enter Raffle (Coming Soon)
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <RaffleForm
          raffle={editingRaffle}
          onClose={() => {
            setShowForm(false);
            setEditingRaffle(null);
          }}
          onSubmit={handleRaffleSubmit}
        />
      )}
    </div>
  );
}