import React, { useId, useMemo } from "react";
import TagChips from "../TagChips/TagChips";
import styles from "./NotesToolbar.module.css";
import { useNotes } from "../../state/notesStore";

// PUBLIC_INTERFACE
export default function NotesToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  allTags,
  selectedTags,
  onSelectedTagsChange,
  onClear,
  resultsCount,
}) {
  /** Search + filter + sort controls for notes list. */
  const searchId = useId();
  const sortId = useId();
  const { actions } = useNotes();

  const canClear = useMemo(() => Boolean(query) || (selectedTags || []).length > 0, [query, selectedTags]);

  return (
    <section className={styles.toolbar} aria-label="Search and filters">
      <div className={styles.row}>
        <div className={styles.search}>
          <label className="label" htmlFor={searchId}>
            Search
          </label>
          <input
            id={searchId}
            className="input"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search title or content…"
            aria-describedby={`${searchId}-help`}
          />
          <div id={`${searchId}-help`} className="helper">
            {resultsCount} result{resultsCount === 1 ? "" : "s"}
          </div>
        </div>

        <div className={styles.sort}>
          <label className="label" htmlFor={sortId}>
            Sort by
          </label>
          <select
            id={sortId}
            className="select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort notes"
          >
            <option value={actions.sortOptions.updated_desc}>Updated (newest)</option>
            <option value={actions.sortOptions.title_asc}>Title (A–Z)</option>
          </select>

          <div className={styles.clear}>
            <button
              type="button"
              className="btn btnGhost"
              onClick={onClear}
              disabled={!canClear}
              aria-disabled={!canClear}
              title="Clear search and filters"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className={styles.tagsRow}>
        <div className={styles.tagsLabel}>
          <span className="label">Tags</span>
          <span className={styles.tagsHint}>Click chips to filter</span>
        </div>
        <TagChips tags={allTags} selectedTags={selectedTags} onChange={onSelectedTagsChange} />
      </div>
    </section>
  );
}
