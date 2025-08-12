"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Sparkles,
  Save,
  ArrowLeft
} from "lucide-react";

interface Essay {
  id: string;
  title: string;
  content: string;
  profile_id: string;
}

interface RedlineSuggestion {
  text: string;
  suggestion: string;
  reason: string;
}

export default function EssayEditor({ essay }: { essay: Essay }) {
  const [title, setTitle] = useState(essay.title);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [redlineSuggestions, setRedlineSuggestions] = useState<RedlineSuggestion[]>([]);
  const [isRedlining, setIsRedlining] = useState(false);
  const [showRedlinePanel, setShowRedlinePanel] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
    content: essay.content,
    onUpdate: ({ editor }) => {
      // Auto-save will be handled by the debounced save function
    },
  });

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (title: string, content: string) => {
      setIsSaving(true);
      try {
        const response = await fetch(`/dashboard/essays/${essay.id}/save`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
          setLastSaved(new Date());
        } else {
          console.error('Failed to save essay');
        }
      } catch (error) {
        console.error('Error saving essay:', error);
      } finally {
        setIsSaving(false);
      }
    }, 800),
    [essay.id]
  );

  // Auto-save on title or content change
  useEffect(() => {
    if (editor) {
      const content = editor.getHTML();
      debouncedSave(title, content);
    }
  }, [title, editor, debouncedSave]);

  const handleRedline = async () => {
    if (!editor) return;

    const content = editor.getText();
    if (!content.trim()) {
      alert('Please add some content before requesting AI feedback.');
      return;
    }

    setIsRedlining(true);
    setShowRedlinePanel(true);

    try {
      const response = await fetch('/api/redline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
      });

      if (response.ok) {
        const data = await response.json();
        setRedlineSuggestions(data.suggestions || []);
      } else {
        console.error('Failed to get redline suggestions');
        setRedlineSuggestions([]);
      }
    } catch (error) {
      console.error('Error getting redline suggestions:', error);
      setRedlineSuggestions([]);
    } finally {
      setIsRedlining(false);
    }
  };

  const applySuggestion = (suggestion: RedlineSuggestion) => {
    if (!editor) return;
    
    // Simple text replacement - in a real app you'd want more sophisticated diffing
    const currentText = editor.getText();
    const newText = currentText.replace(suggestion.text, suggestion.suggestion);
    editor.commands.setContent(newText);
  };

  if (!editor) {
    return <div className="p-6">Loading editor...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/dashboard/essays"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0"
              placeholder="Essay title..."
            />
          </div>
          <div className="flex items-center gap-3">
            {isSaving && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Save className="h-4 w-4 animate-pulse" />
                Saving...
              </div>
            )}
            {lastSaved && !isSaving && (
              <div className="text-sm text-gray-500">
                Saved {lastSaved.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={handleRedline}
              disabled={isRedlining}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-95 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {isRedlining ? 'Analyzing...' : 'AI Redline'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="border-b bg-gray-50 px-6 py-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
              >
                <Italic className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
              >
                <ListOrdered className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
              >
                <Quote className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <Undo className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <Redo className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 p-6 overflow-auto">
            <EditorContent 
              editor={editor} 
              className="prose prose-sm max-w-none h-full focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-6 py-2">
            <div className="text-sm text-gray-500">
              {editor.storage.characterCount.characters()} characters
            </div>
          </div>
        </div>

        {/* Redline Panel */}
        {showRedlinePanel && (
          <div className="w-80 border-l bg-white overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">AI Suggestions</h3>
                <button
                  onClick={() => setShowRedlinePanel(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4">
              {redlineSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {redlineSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Original:</strong> &quot;{suggestion.text}&quot;
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Suggestion:</strong> &quot;{suggestion.suggestion}&quot;
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        {suggestion.reason}
                      </div>
                      <button
                        onClick={() => applySuggestion(suggestion)}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {isRedlining ? 'Analyzing your essay...' : 'No suggestions available'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 