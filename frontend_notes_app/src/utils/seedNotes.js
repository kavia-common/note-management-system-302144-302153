import { createId, nowIso } from "./ids";

function makeNote({ title, content, tags }) {
  const t = nowIso();
  return {
    id: createId(),
    title,
    content,
    tags,
    createdAt: t,
    updatedAt: t,
  };
}

// PUBLIC_INTERFACE
export function seedNotes() {
  /** Initial seed notes shown on first run when storage is empty. */
  return [
    makeNote({
      title: "Welcome to Ocean Notes",
      content: "Create, edit, tag, and search your notes. Everything is stored locally in your browser.",
      tags: ["getting started", "local"],
    }),
    makeNote({
      title: "Tip: Use tags",
      content: "Add tags like: work, ideas, personal. Click chips to filter.",
      tags: ["tips", "tags"],
    }),
  ];
}
