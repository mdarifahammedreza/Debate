'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Argument from '../../components/core/Argument';
import JoinDebate from '../../components/core/JoinDebate';
import NewArgumentForm from '../../components/core/NewArgumentForm';

export default function DebateDetailPage({ params }) {
  const { id } = params;
  const { data: session } = useSession();
  const router = useRouter();

  const [debate, setDebate] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [argumentsList, setArgumentsList] = useState([]);
  const [joinedSide, setJoinedSide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debateEnded, setDebateEnded] = useState(false);
  const [error, setError] = useState('');

  // Fetch debate details, participants and arguments
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch debate by id
        const res = await fetch(`/api/debates?id=${id}`);
        const data = await res.json();
        if (!data || data.length === 0) {
          setError('Debate not found');
          setLoading(false);
          return;
        }
        const debateData = Array.isArray(data) ? data[0] : data;
        setDebate(debateData);

        // Check if debate ended
        setDebateEnded(new Date(debateData.endTime) < new Date());

        // Fetch participants
        // (Assuming debateData.participants included or fetch separately if needed)
        setParticipants(debateData.participants || []);

        // Find if current user joined and side
        if (session) {
          const participant = debateData.participants?.find(p => p.userId === session.user.id);
          setJoinedSide(participant?.side || null);
        }

        // Fetch arguments
        const argRes = await fetch(`/api/arguments?debateId=${id}`);
        const argsData = await argRes.json();

        // Add votesCount & author info to each argument if not present
        setArgumentsList(
          argsData.map(arg => ({
            ...arg,
            votesCount: arg.votes?.length || 0,
            author: arg.author || { id: arg.authorId, name: "Unknown" },
          }))
        );
      } catch (err) {
        setError(err.message || "Failed to load debate");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, session]);

  // Join debate handler
  const handleJoin = async (side) => {
    if (!session) {
      alert("Please sign in to join the debate");
      return;
    }
    const res = await fetch(`/api/debates/${id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ side }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to join debate');
    }
    setJoinedSide(side);
    // Reload participants
    setParticipants((p) => [...p, { userId: session.user.id, side }]);
  };

  // Post argument handler
  const handlePostArgument = async (content) => {
    if (!session) {
      alert("Please sign in to post an argument");
      return;
    }
    // Check banned words example (can be improved)
    const bannedWords = ["stupid", "idiot", "dumb"];
    for (const word of bannedWords) {
      if (content.toLowerCase().includes(word)) {
        throw new Error(`Your argument contains banned word: ${word}`);
      }
    }
    const res = await fetch('/api/arguments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        side: joinedSide,
        debateId: id,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to post argument');
    }
    // Reload arguments
    const newArg = await res.json();
    setArgumentsList((args) => [...args, {
      ...newArg,
      votesCount: 0,
      author: { id: session.user.id, name: session.user.name || session.user.email },
    }]);
  };

  // Vote handler
  const handleVote = async (argumentId, action) => {
    if (!session) {
      alert("Please sign in to vote");
      return;
    }
    if (action === 'add') {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ argumentId }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Failed to vote');
        return;
      }
    } else {
      const res = await fetch(`/api/votes?argumentId=${argumentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Failed to remove vote');
        return;
      }
    }
  };

  // Edit argument handler
  const handleEdit = async (argumentId, content) => {
    if (!session) {
      alert("Please sign in to edit");
      return;
    }
    const res = await fetch('/api/arguments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: argumentId, content }),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.message || 'Failed to update argument');
      return;
    }
    setArgumentsList((args) =>
      args.map((arg) => (arg.id === argumentId ? { ...arg, content } : arg))
    );
  };

  // Delete argument handler
  const handleDelete = async (argumentId) => {
    if (!session) {
      alert("Please sign in to delete");
      return;
    }
    const confirmed = confirm("Are you sure you want to delete this argument?");
    if (!confirmed) return;

    const res = await fetch(`/api/arguments?id=${argumentId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.message || 'Failed to delete argument');
      return;
    }
    setArgumentsList((args) => args.filter((arg) => arg.id !== argumentId));
  };

  if (loading) return <p className="p-6 text-center">Loading debate...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!debate) return <p className="p-6 text-center">Debate not found</p>;

  const supportArguments = argumentsList.filter(arg => arg.side === 'SUPPORT');
  const opposeArguments = argumentsList.filter(arg => arg.side === 'OPPOSE');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{debate.title}</h1>
      <img
        src={debate.bannerUrl}
        alt={debate.title}
        className="w-full h-60 object-cover rounded mb-4"
      />
      <p className="mb-2">{debate.description}</p>
      <p className="mb-4">
        <strong>Category:</strong> {debate.category} | <strong>Tags:</strong> {debate.tags.join(", ")}
      </p>
      <p className="mb-6 text-red-600 dark:text-red-400">
        Debate ends: {new Date(debate.endTime).toLocaleString()}
      </p>

      {!joinedSide && !debateEnded && (
        <JoinDebate debateId={id} onJoin={handleJoin} />
      )}

      {joinedSide && !debateEnded && (
        <NewArgumentForm onSubmit={handlePostArgument} />
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Support</h2>
          {supportArguments.length === 0 && <p>No arguments yet.</p>}
          {supportArguments.map((arg) => (
            <Argument
              key={arg.id}
              argument={arg}
              currentUserId={session?.user?.id}
              onVote={handleVote}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-3">Oppose</h2>
          {opposeArguments.length === 0 && <p>No arguments yet.</p>}
          {opposeArguments.map((arg) => (
            <Argument
              key={arg.id}
              argument={arg}
              currentUserId={session?.user?.id}
              onVote={handleVote}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
