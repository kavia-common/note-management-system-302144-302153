import React, { useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import NotesToolbar from "./components/NotesToolbar/NotesToolbar";
import NotesGrid from "./components/NotesGrid/NotesGrid";
import NoteEditorModal from "./components/NoteEditorModal/NoteEditorModal";
import ConfirmDialog from "./components/ConfirmDialog/ConfirmDialog";
import ToastViewport from "./components/Toast/ToastViewport";
import { NotesProvider, useNotes } from "./state/notesStore";
import { useToasts } from "./state/toastStore";

/**
 * Notes application root.
 * Pure client-side notes CRUD with localStorage persistence.
 */

// PUBLIC_INTERFACE
function App() {
  /** Root wraps app with providers. */
  return (
    <NotesProvider>
      <AppShell />
    </NotesProvider>
  );
}

function AppShell() {
  const {
    state,
    derived,
    actions: { createNote, updateNote, deleteNote, setQuery, setSort, setSelectedTags, clearFilters },
  } = useNotes();

  const { toasts, pushToast, dismissToast } = useToasts();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [confirm, setConfirm] = useState({
    open: false,
    noteId: null,
    noteTitle: "",
  });

  const editingNote = useMemo(() => {
    if (!editingId) return null;
    return state.notes.find((n) => n.id === editingId) ?? null;
  }, [editingId, state.notes]);

  const openCreate = () => {
    setEditingId(null);
    setIsEditorOpen(true);
  };

  const openEdit = (id) => {
    setEditingId(id);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingId(null);
  };

  const requestDelete = (note) => {
    setConfirm({ open: true, noteId: note.id, noteTitle: note.title });
  };

  const cancelDelete = () => {
    setConfirm({ open: false, noteId: null, noteTitle: "" });
  };

  const confirmDelete = () => {
    const id = confirm.noteId;
    if (!id) return;

    deleteNote(id);
    pushToast({ title: "Note deleted", tone: "neutral" });

    cancelDelete();
  };

  const onSubmitEditor = (draft) => {
    if (editingNote) {
      updateNote(editingNote.id, draft);
      pushToast({ title: "Note updated", tone: "success" });
    } else {
      createNote(draft);
      pushToast({ title: "Note created", tone: "success" });
    }
    closeEditor();
  };

  return (
    <div className="app">
      <a className="skipLink" href="#main">
        Skip to content
      </a>

      <Header onAddNote={openCreate} />

      <main id="main" className="main" tabIndex={-1}>
        <div className="container">
          <NotesToolbar
            query={state.query}
            onQueryChange={setQuery}
            sort={state.sort}
            onSortChange={setSort}
            allTags={derived.allTags}
            selectedTags={state.selectedTags}
            onSelectedTagsChange={setSelectedTags}
            onClear={clearFilters}
            resultsCount={derived.filteredSortedNotes.length}
          />

          <NotesGrid
            notes={derived.filteredSortedNotes}
            onEdit={openEdit}
            onDelete={requestDelete}
            emptyState={{
              title: state.notes.length === 0 ? "No notes yet" : "No matching notes",
              description:
                state.notes.length === 0
                  ? "Create your first note to get started. Notes are stored locally in your browser."
                  : "Try a different search term or clear filters.",
              actionLabel: state.notes.length === 0 ? "Add note" : "Clear filters",
              onAction: state.notes.length === 0 ? openCreate : clearFilters,
            }}
          />
        </div>
      </main>

      <NoteEditorModal
        open={isEditorOpen}
        mode={editingNote ? "edit" : "create"}
        initialNote={editingNote}
        onClose={closeEditor}
        onSubmit={onSubmitEditor}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete note?"
        description={
          confirm.noteTitle
            ? `This will permanently delete “${confirm.noteTitle}”.`
            : "This will permanently delete the note."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        tone="danger"
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
