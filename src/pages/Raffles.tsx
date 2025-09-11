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
  winner_description?: string;
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
      // First, update any expired raffles
      await updateExpiredRaffles();

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

  const updateExpiredRaffles = async () => {
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('raffles')
        .update({ status: 'completed' })
        .eq('status', 'active')
        .lt('end_date', now);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating expired raffles:', error);
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
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-teal-800 via-amber-400 to-coral-500 opacity-80" />
      {/* Particles or animated shapes */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <svg className="absolute top-10 left-10 animate-float" width="120" height="120"><circle cx="60" cy="60" r="50" fill="#A7D9D3" opacity="0.25" /></svg>
        <svg className="absolute bottom-20 right-20 animate-float2" width="80" height="80"><rect width="80" height="80" rx="24" fill="#FCA311" opacity="0.18" /></svg>
      </div>
      <div className="space-y-8 px-4 pt-10 pb-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-teal-800 drop-shadow-lg font-[Poppins] tracking-tight animate-fadein">Raffles</h1>
            <p className="text-lg text-amber-500 mt-2 font-semibold animate-fadein2">Enter exciting raffles and win amazing prizes!</p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-amber-400 text-teal-900 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-amber-500 transition-all text-lg animate-bounce"
            >
              <Plus className="w-6 h-6" />
              Create Raffle
            </Button>
          )}
        </div>

        {raffles.length === 0 ? (
          <Card className="bg-white/80 rounded-2xl shadow-xl border-2 border-teal-800 animate-fadein3">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Gift className="w-20 h-20 text-amber-400 mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold text-teal-800 mb-2">No Raffles Available</h3>
              <p className="text-lg text-gray-600 text-center">
                There are no active raffles at the moment. Check back soon for exciting prizes!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {raffles.map((raffle, idx) => (
              <Card key={raffle.id} className={`overflow-hidden rounded-3xl shadow-2xl border-4 border-amber-400 bg-white/90 transition-transform duration-300 hover:scale-105 hover:shadow-amber-400 animate-cardin`} style={{ animationDelay: `${idx * 80}ms` }}>
                {raffle.image_url && (
                  <div className="aspect-video bg-gradient-to-br from-amber-100 via-teal-50 to-white animate-fadein2">
                    <img
                      src={raffle.image_url}
                      alt={raffle.title}
                      className="w-full h-full object-cover rounded-t-2xl border-b-2 border-amber-400"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold text-teal-800 line-clamp-2 font-[Poppins]">
                      {raffle.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(raffle.status) + ' text-base font-bold px-3 py-1 rounded-full shadow'}>
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
                            className="hover:bg-aqua-200"
                          >
                            <Edit className="w-5 h-5 text-teal-800" />
                          </Button>
                          {raffle.status === 'active' && raffle.entry_count && raffle.entry_count > 0 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openWinnerSelection(raffle)}
                              title="Select Winner"
                              className="text-yellow-600 hover:text-yellow-700"
                            >
                              <Crown className="w-5 h-5" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {raffle.description && (
                    <p className="text-base text-gray-700 line-clamp-3 font-[Nunito Sans]">{raffle.description}</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-base text-coral-500 font-semibold">
                      <Gift className="w-5 h-5" />
                      <span>Prize: <span className="text-amber-500 font-bold">{raffle.prize}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-base text-teal-800">
                      <Users className="w-5 h-5" />
                      <span>{raffle.entry_count || 0} entries</span>
                    </div>
                    <div className="flex items-center gap-2 text-base text-teal-800">
                      <Calendar className="w-5 h-5" />
                      <span>Ends: <span className="font-bold text-coral-500">{formatDate(raffle.end_date)}</span></span>
                    </div>
                    {raffle.status === 'completed' && raffle.winner_username && (
                      <div className="flex items-center gap-2 text-base text-teal-800">
                        <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
                        <div className="flex items-center gap-2">
                          <span>Winner: <span className="font-bold text-amber-500">{raffle.winner_username}</span></span>
                          {raffle.winner_image_url && (
                            <img
                              src={raffle.winner_image_url}
                              alt={raffle.winner_username}
                              className="w-7 h-7 rounded-full object-cover border-2 border-amber-400"
                            />
                          )}
                        </div>
                        {raffle.winner_description && (
                          <p className="text-xs text-gray-500 mt-1 italic">"{raffle.winner_description}"</p>
                        )}
                      </div>
                    )}
                  </div>
                  {raffle.status === 'active' && (
                    <Button 
                      className={`w-full font-bold text-lg py-3 rounded-xl shadow-lg transition-all duration-200 ${raffle.user_entered ? 'bg-aqua-200 text-teal-800 border-2 border-teal-800' : 'bg-amber-400 text-teal-900 hover:bg-amber-500'} animate-fadein2`}
                      variant={raffle.user_entered ? 'outline' : 'default'}
                      disabled={entryLoading === raffle.id}
                      onClick={() => handleRaffleEntry(raffle.id, !raffle.user_entered)}
                    >
                      {entryLoading === raffle.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
        {/* Animations CSS */}
        <style>{`
          @keyframes gradient {
            0% {background-position:0% 50%}
            50% {background-position:100% 50%}
            100% {background-position:0% 50%}
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 8s ease-in-out infinite;
          }
          @keyframes float {
            0% {transform:translateY(0)}
            50% {transform:translateY(-16px)}
            100% {transform:translateY(0)}
          }
          .animate-float { animation: float 5s ease-in-out infinite; }
          .animate-float2 { animation: float 7s ease-in-out infinite; }
          @keyframes fadein {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadein { animation: fadein 0.7s cubic-bezier(.4,0,.2,1) both; }
          .animate-fadein2 { animation: fadein 1.2s cubic-bezier(.4,0,.2,1) both; }
          .animate-fadein3 { animation: fadein 1.7s cubic-bezier(.4,0,.2,1) both; }
          @keyframes cardin {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-cardin { animation: cardin 0.7s cubic-bezier(.4,0,.2,1) both; }
        `}</style>
      </div>

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
          raffle={selectedRaffleForWinner!}
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