import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [playerTag, setPlayerTag] = useState('Attacking');

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    const { data } = await supabase.from('teams').select('*');
    setTeams(data || []);
  }

  async function fetchPlayers(teamId) {
    const { data } = await supabase.from('players').select('*').eq('team_id', teamId);
    setPlayers(data || []);
  }

  async function addTeam(e) {
    e.preventDefault();
    if (!teamName.trim()) return;
    await supabase.from('teams').insert([{ team_name: teamName, sport: 'soccer' }]);
    setTeamName('');
    fetchTeams();
  }

  async function addPlayer(e) {
    e.preventDefault();
    if (!playerName.trim()) return;
    await supabase.from('players').insert([{ name: playerName, tag: playerTag, team_id: selectedTeam.id }]);
    setPlayerName('');
    fetchPlayers(selectedTeam.id);
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>PitchTime</h1>
      <form onSubmit={addTeam}>
        <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team name" />
        <button type="submit">Add Team</button>
      </form>
      <div>
        {teams.map(team => (
          <button key={team.id} onClick={() => { setSelectedTeam(team); fetchPlayers(team.id); }}>
            {team.team_name}
          </button>
        ))}
      </div>
      {selectedTeam && (
        <>
          <h2>{selectedTeam.team_name} Roster</h2>
          <form onSubmit={addPlayer}>
            <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Player name" />
            <select value={playerTag} onChange={(e) => setPlayerTag(e.target.value)}>
              <option>Attacking</option>
              <option>Defensive</option>
              <option>Neutral</option>
            </select>
            <button type="submit">Add Player</button>
          </form>
          <div>
            {players.map(player => (
              <div key={player.id}>
                <strong>{player.name}</strong> - {player.tag}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
