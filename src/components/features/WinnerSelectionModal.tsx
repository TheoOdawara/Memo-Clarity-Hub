import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { X, Trophy, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface RaffleEntry {
  id: string;
  user_id: string;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
  } | null;
}

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
  const [entries, setEntries] = useState<RaffleEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [selectedWinner, setSelectedWinner] = useState<RaffleEntry | null>(null);

  useEffect(() => {
    fetchEntries();
  }, [raffle.id]);

  const fetchEntries = async () => {
    try {
      // First, get all raffle entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('raffle_entries')
        .select('id, user_id, created_at')
        .eq('raffle_id', raffle.id)
        .order('created_at', { ascending: true });

      if (entriesError) throw entriesError;

      if (!entriesData || entriesData.length === 0) {
        setEntries([]);
        return;
      }

      // Get user profiles for the user_ids
      const userIds = entriesData.map(entry => entry.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username, full_name')
        .in('user_id', userIds);

      if (profilesError) {
        console.warn('Error fetching profiles:', profilesError);
        // Continue without profiles data
      }

      // Combine entries with profile data
      const entriesWithProfiles = entriesData.map(entry => {
        const profile = profilesData?.find(p => p.user_id === entry.user_id);
        return {
          ...entry,
          profiles: profile || null
        };
      });

      setEntries(entriesWithProfiles);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to load raffle entries');
    } finally {
      setLoadingEntries(false);
    }
  };

  const selectWinner = async () => {
    if (!selectedWinner) {
      toast.error('Please select a winner first');
      return;
    }

    setLoading(true);
    try {
      const winnerUsername = selectedWinner.profiles?.username || 
                           selectedWinner.profiles?.full_name || 
                           'Unknown User';

      const { error } = await supabase
        .from('raffles')
        .update({
          status: 'completed',
          winner_user_id: selectedWinner.user_id,
          winner_username: winnerUsername
        })
        .eq('id', raffle.id);

      if (error) throw error;

      toast.success(`Winner selected: ${winnerUsername}`);
      onWinnerSelected();
    } catch (error) {
      console.error('Error selecting winner:', error);
      toast.error('Failed to select winner');
    } finally {
      setLoading(false);
    }
  };

  const selectRandomWinner = () => {
    if (entries.length === 0) {
      toast.error('No entries available for random selection');
      return;
    }

    const randomIndex = Math.floor(Math.random() * entries.length);
    const randomWinner = entries[randomIndex];
    setSelectedWinner(randomWinner);
    
    const winnerName = randomWinner.profiles?.username || 
                      randomWinner.profiles?.full_name || 
                      'Unknown User';
    toast.success(`Randomly selected: ${winnerName}`);
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
          {loadingEntries ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Entries</h3>
              <p className="text-gray-600">No one has entered this raffle yet.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Participants ({entries.length})
                </h3>
                <Button
                  variant="outline"
                  onClick={selectRandomWinner}
                  className="flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  Random Pick
                </Button>
              </div>

              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {entries.map((entry) => {
                  const displayName = entry.profiles?.username || 
                                    entry.profiles?.full_name || 
                                    `User ${entry.user_id.substring(0, 8)}`;
                  
                  return (
                    <div
                      key={entry.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedWinner?.id === entry.id
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedWinner(entry)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedWinner?.id === entry.id
                              ? 'border-yellow-500 bg-yellow-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedWinner?.id === entry.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{displayName}</p>
                            <p className="text-sm text-gray-500">
                              Entered: {new Date(entry.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {selectedWinner?.id === entry.id && (
                          <Trophy className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedWinner && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Selected Winner:</h4>
                  <p className="text-yellow-700">
                    {selectedWinner.profiles?.username || 
                     selectedWinner.profiles?.full_name || 
                     'Unknown User'}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={selectWinner}
                  disabled={loading || !selectedWinner}
                  className="flex-1"
                >
                  {loading ? 'Selecting Winner...' : 'Confirm Winner'}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}