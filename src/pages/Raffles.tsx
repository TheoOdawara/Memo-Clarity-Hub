import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Gift, Calendar, Trophy, Plus, Edit, Users, Crown } from 'lucide-react';
import { RaffleForm } from '@/components/features/RaffleForm';
import { WinnerSelectionModal } from '@/components/features/WinnerSelectionModal';
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
  winner_image_url?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  entry_count?: number;
  user_entered?: boolean;
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
  const [entryLoading, setEntryLoading] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectedRaffleForWinner, setSelectedRaffleForWinner] = useState<Raffle | null>(null);
  
  const isAdmin = user && ADMIN_USER_IDS.includes(user.id);

  useEffect(() => {
    fetchRaffles();
  }, []);

  const fetchRaffles = async () => {
    try {
      const { data: rafflesData, error } = await supabase
        .from('raffles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get entry counts and user entries for each raffle
      const rafflesWithExtras = await Promise.all(
        (rafflesData || []).map(async (raffle) => {
          // Get entry count
          const { count, error: entriesError } = await supabase
            .from('raffle_entries')
            .select('*', { count: 'exact', head: true })
            .eq('raffle_id', raffle.id);

          let entry_count = 0;
          if (!entriesError) {
            entry_count = count || 0;
          }

          // Check if current user entered this raffle
          let user_entered = false;
          if (user) {
            const { data: userEntryData, error: userEntryError } = await supabase
              .from('raffle_entries')
              .select('id')
              .eq('raffle_id', raffle.id)
              .eq('user_id', user.id)
              .maybeSingle();

            if (!userEntryError && userEntryData) {
              user_entered = true;
            }
          }

          return {
            ...raffle,
            entry_count,
            user_entered
          };
        })
      );

      setRaffles(rafflesWithExtras);
    } catch (error) {
      console.error('Error fetching raffles:', error);
      toast.error('Failed to load raffles');
    } finally {
      setLoading(false);
    }
  };

  const handleWinnerSelected = async () => {
    await fetchRaffles();
    setShowWinnerModal(false);
    setSelectedRaffleForWinner(null);
  };

  const openWinnerSelection = (raffle: Raffle) => {
    setSelectedRaffleForWinner(raffle);
    setShowWinnerModal(true);
  };

  const handleRaffleEntry = async (raffleId: string, isEntering: boolean) => {
    if (!user) {
      toast.error('Please sign in to enter raffles');
      return;
    }

    setEntryLoading(raffleId);
    
    try {
      if (isEntering) {
        const { error } = await supabase
          .from('raffle_entries')
          .insert([{
            raffle_id: raffleId,
            user_id: user.id
          }]);

        if (error) {
          if (error.code === '23505') { // Unique constraint violation
            toast.error('You are already entered in this raffle');
          } else {
            throw error;
          }
        } else {
          toast.success('Successfully entered the raffle!');
        }
      } else {
        const { error } = await supabase
          .from('raffle_entries')
          .delete()
          .eq('raffle_id', raffleId)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Successfully left the raffle');
      }
      
      fetchRaffles(); // Refresh to update entry count and status
    } catch (error) {
      console.error('Error with raffle entry:', error);
      toast.error(isEntering ? 'Failed to enter raffle' : 'Failed to leave raffle');
    } finally {
      setEntryLoading(null);
    }
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
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingRaffle(raffle);
                            setShowForm(true);
                          }}
                          title="Edit Raffle"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {raffle.status === 'active' && raffle.entry_count && raffle.entry_count > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openWinnerSelection(raffle)}
                            title="Select Winner"
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            <Crown className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
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
                    <Users className="w-4 h-4" />
                    <span>{raffle.entry_count || 0} entries</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Ends: {formatDate(raffle.end_date)}</span>
                  </div>
                  
                  {raffle.status === 'completed' && raffle.winner_username && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <div className="flex items-center gap-2">
                        <span>Winner: {raffle.winner_username}</span>
                        {raffle.winner_image_url && (
                          <img
                            src={raffle.winner_image_url}
                            alt={raffle.winner_username}
                            className="w-6 h-6 rounded-full object-cover border border-yellow-300"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {raffle.status === 'active' && (
                  <Button 
                    className="w-full" 
                    variant={raffle.user_entered ? 'outline' : 'default'}
                    disabled={entryLoading === raffle.id}
                    onClick={() => handleRaffleEntry(raffle.id, !raffle.user_entered)}
                  >
                    {entryLoading === raffle.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : raffle.user_entered ? (
                      'Leave Raffle'
                    ) : (
                      'Enter Raffle'
                    )}
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
          onSubmit={() => {
            fetchRaffles();
            setShowForm(false);
            setEditingRaffle(null);
          }}
        />
      )}

      {showWinnerModal && selectedRaffleForWinner && (
        <WinnerSelectionModal
          raffle={selectedRaffleForWinner}
          onClose={() => {
            setShowWinnerModal(false);
            setSelectedRaffleForWinner(null);
          }}
          onWinnerSelected={handleWinnerSelected}
        />
      )}
    </div>
  );
}