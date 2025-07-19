'use client';

import { useEffect, useState } from 'react';

export default function Argument({
  argument,
  currentUserId,
  onVote,
  onEdit,
  onDelete,
}) {
  const [canEdit, setCanEdit] = useState(false);
  const [editContent, setEditContent] = useState(argument.content);
  const [isEditing, setIsEditing] = useState(false);
  const [votesCount, setVotesCount] = useState(argument.votesCount || 0);
  const [userVoted, setUserVoted] = useState(false);

  useEffect(() => {
    // Check if current user can edit (within 5 minutes)
    const createdAt = new Date(argument.createdAt);
    const now = new Date();
    const diffMinutes = (now - createdAt) / 1000 / 60;
    setCanEdit(currentUserId === argument.author.id && diffMinutes <= 5);
  }, [argument.createdAt, argument.author.id, currentUserId]);

  // Vote handler
  const handleVote = () => {
    if (userVoted) {
      onVote(argument.id, 'remove');
      setVotesCount((v) => v - 1);
      setUserVoted(false);
    } else {
      onVote(argument.id, 'add');
      setVotesCount((v) => v + 1);
      setUserVoted(true);
    }
  };

  // Edit handlers
  const startEdit = () => setIsEditing(true);
  const cancelEdit = () => {
    setEditContent(argument.content);
    setIsEditing(false);
  };
  const saveEdit = () => {
    onEdit(argument.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="border rounded p-3 mb-3 bg-white dark:bg-zinc-800">
      <div className="flex justify-between items-center mb-1">
        <div className="font-semibold">{argument.author.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(argument.createdAt).toLocaleString()}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
        />
      ) : (
        <p className="mb-2 whitespace-pre-wrap">{argument.content}</p>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={handleVote}
          className={`px-3 py-1 rounded ${
            userVoted ? 'bg-green-600 text-white' : 'bg-gray-300 dark:bg-zinc-600'
          }`}
        >
          {userVoted ? 'Voted' : 'Vote'} ({votesCount})
        </button>

        <div className="space-x-2">
          {canEdit && !isEditing && (
            <>
              <button
                onClick={startEdit}
                className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(argument.id)}
                className="px-2 py-1 text-sm bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </>
          )}
          {isEditing && (
            <>
              <button
                onClick={saveEdit}
                className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-2 py-1 text-sm bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
