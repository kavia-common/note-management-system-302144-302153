# Ocean Notes (React)

A clean, modern notes app UI built with React (no backend required). Create, edit, search, filter by tags, sort, and delete notes.

## Features

- Notes displayed as cards in a responsive grid
- Add/Edit via accessible modal dialog (keyboard navigation + Escape-to-close)
- Delete confirmation dialog
- Search by title/content
- Tag chips for filtering
- Sort by **Updated (newest)** or **Title (A–Z)**
- Toast/snackbar notifications for create/update/delete
- Persisted locally via `localStorage`

## Running locally

From `frontend_notes_app/`:

```bash
npm install
npm start
```

Open http://localhost:3000

## Persistence

Notes are stored in the browser using `localStorage` under the key:

- `ocean_notes_app_v1`

If the key is missing (first run), the app seeds a couple of sample notes.

## Styling

The UI follows the **Ocean Professional** theme:
- Primary: `#2563EB`
- Secondary: `#F59E0B`
- Background: `#f9fafb`
- Surface: `#ffffff`
- Text: `#111827`
- Rounded corners, subtle gradients, and soft shadows
