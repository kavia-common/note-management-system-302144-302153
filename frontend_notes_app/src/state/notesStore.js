import React, { createContext, useContext, useMemo, useReducer } from "react";
import { loadNotesState, saveNotesState } from "../utils/storage";
import { normalizeTags } from "../utils/tags";
import { createId, nowIso } from "../utils/ids";
import { seedNotes } from "../utils/seedNotes";

const NotesContext = createContext(null);

const SORT_UPDATED_DESC = "updated_desc";
const SORT_TITLE_ASC = "title_asc";

const initialLoaded = loadNotesState();
const initialNotes = initialLoaded?.notes?.length ? initialLoaded.notes : seedNotes();

const initialState = {
  notes: initialNotes,
  query: "",
  selectedTags: [],
  sort: SORT_UPDATED_DESC,
};

function matchesQuery(note, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (note.title || "").toLowerCase().includes(q) || (note.content || "").toLowerCase().includes(q);
}

function matchesTags(note, selectedTags) {
  if (!selectedTags || selectedTags.length === 0) return true;
  const noteTags = new Set(note.tags || []);
  return selectedTags.every((t) => noteTags.has(t));
}

function compareUpdatedDesc(a, b) {
  const at = new Date(a.updatedAt).getTime();
  const bt = new Date(b.updatedAt).getTime();
  return bt - at;
}

function compareTitleAsc(a, b) {
  return (a.title || "").localeCompare(b.title || "", undefined, { sensitivity: "base" });
}

function reducer(state, action) {
  switch (action.type) {
    case "create": {
      const timestamp = nowIso();
      const tags = normalizeTags(action.payload.tags);
      const note = {
        id: createId(),
        title: action.payload.title.trim(),
        content: action.payload.content,
        tags,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      return { ...state, notes: [note, ...state.notes] };
    }
    case "update": {
      const { id, patch } = action.payload;
      const timestamp = nowIso();
      return {
        ...state,
        notes: state.notes.map((n) => {
          if (n.id !== id) return n;
          const tags = normalizeTags(patch.tags);
          return {
            ...n,
            title: patch.title.trim(),
            content: patch.content,
            tags,
            updatedAt: timestamp,
          };
        }),
      };
    }
    case "delete":
      return { ...state, notes: state.notes.filter((n) => n.id !== action.payload.id) };

    case "setQuery":
      return { ...state, query: action.payload.query };

    case "setSort":
      return { ...state, sort: action.payload.sort };

    case "setSelectedTags":
      return { ...state, selectedTags: action.payload.tags };

    case "clearFilters":
      return { ...state, query: "", selectedTags: [], sort: SORT_UPDATED_DESC };

    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /** Provides notes store with localStorage persistence. */
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist notes only (and schema versioning) to storage
  React.useEffect(() => {
    saveNotesState({ notes: state.notes });
  }, [state.notes]);

  const derived = useMemo(() => {
    const allTags = Array.from(
      state.notes.reduce((acc, n) => {
        (n.tags || []).forEach((t) => acc.add(t));
        return acc;
      }, new Set())
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    const filtered = state.notes.filter((n) => matchesQuery(n, state.query) && matchesTags(n, state.selectedTags));

    const sorted = [...filtered].sort(state.sort === SORT_TITLE_ASC ? compareTitleAsc : compareUpdatedDesc);

    return { allTags, filteredSortedNotes: sorted };
  }, [state.notes, state.query, state.selectedTags, state.sort]);

  const actions = useMemo(() => {
    return {
      createNote: (draft) => dispatch({ type: "create", payload: draft }),
      updateNote: (id, patch) => dispatch({ type: "update", payload: { id, patch } }),
      deleteNote: (id) => dispatch({ type: "delete", payload: { id } }),
      setQuery: (query) => dispatch({ type: "setQuery", payload: { query } }),
      setSort: (sort) => dispatch({ type: "setSort", payload: { sort } }),
      setSelectedTags: (tags) => dispatch({ type: "setSelectedTags", payload: { tags } }),
      clearFilters: () => dispatch({ type: "clearFilters" }),
      sortOptions: {
        updated_desc: SORT_UPDATED_DESC,
        title_asc: SORT_TITLE_ASC,
      },
    };
  }, []);

  const value = useMemo(() => ({ state, derived, actions }), [state, derived, actions]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** Hook to access notes store. */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}
