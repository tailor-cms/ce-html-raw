# Raw HTML

Content element for authoring and rendering raw HTML content.

**Type:** `HTML_RAW`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | Sanitized HTML source |

## Edit

- CodeMirror HTML editor with syntax highlighting
- Live preview in sandboxed iframe
- Autosaves on change (debounced) and on blur/paste; content is sanitized via `sanitize-html`

## Display

- Renders sanitized HTML content in an iframe
- Auto-adjusts iframe height to content

## Development

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
pnpm test
```

## Run with Docker

```sh
docker compose up
```
