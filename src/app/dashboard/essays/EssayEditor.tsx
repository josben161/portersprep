'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import { useState } from 'react';
import { RoomProvider, useRoom, useSelf } from '@liveblocks/react';
import { ClientSideSuspense } from '@liveblocks/react';
import { getRoomId } from '@/lib/liveblocks';
import { Wand2, Users } from 'lucide-react';

interface RedlineSuggestion {
  text: string;
  suggestion: string;
  reason: string;
}

interface EssayEditorProps {
  userId: string;
}

function EssayEditorInner({ userId }: EssayEditorProps) {
  const [redlineSuggestions, setRedlineSuggestions] = useState<RedlineSuggestion[]>([]);
  const [isLoadingRedline, setIsLoadingRedline] = useState(false);

  const room = useRoom();
  const self = useSelf();

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
    content: '<p>Start writing your essay here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  const handleRedline = async () => {
    if (!editor) return;

    const text = editor.getText();
    if (!text.trim()) return;

    setIsLoadingRedline(true);
    try {
      const response = await fetch('/api/redline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setRedlineSuggestions(data.suggestions || []);
      } else {
        console.error('Redline request failed');
      }
    } catch (error) {
      console.error('Error calling redline API:', error);
    } finally {
      setIsLoadingRedline(false);
    }
  };

  const wordCount = editor ? editor.storage.characterCount.words() : 0;
  const charCount = editor ? editor.storage.characterCount.characters() : 0;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Essays</h1>
          <div className="flex items-center gap-4">
            {/* Collaborators */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>Collaborators: you</span>
            </div>
            
            {/* Word Count */}
            <div className="text-sm text-gray-600">
              {wordCount} words • {charCount} characters
            </div>
            
            {/* AI Redline Button */}
            <button
              onClick={handleRedline}
              disabled={isLoadingRedline || !editor?.getText().trim()}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Wand2 className="h-4 w-4" />
              {isLoadingRedline ? 'Analyzing...' : 'AI Redline'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1 bg-white">
          <EditorContent editor={editor} />
        </div>

        {/* Redline Suggestions */}
        {redlineSuggestions.length > 0 && (
          <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4 text-gray-900">AI Suggestions</h3>
            <div className="space-y-4">
              {redlineSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-white rounded-lg border p-3">
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Original:</span> &quot;{suggestion.text}&quot;
                  </div>
                  <div className="text-sm text-gray-900 mb-2">
                    <span className="font-medium">Suggestion:</span> &quot;{suggestion.suggestion}&quot;
                  </div>
                  <div className="text-xs text-gray-500">
                    {suggestion.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EssayEditor({ userId }: EssayEditorProps) {
  const roomId = getRoomId(userId);

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{}}
    >
      <ClientSideSuspense fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="text-gray-600">Loading editor...</div>
        </div>
      }>
        {() => (
          <EssayEditorInner userId={userId} />
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
} 