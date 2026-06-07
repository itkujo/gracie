# Design — Assistant Module (General AI Chat)

> **Status:** Approved design (brainstorming output). Feeds into the main blueprint
> and `09-build-phases.md`.
> **Purpose:** Replace the team's ChatGPT Business seats (9 × $20 = $180/mo) with a
> general-purpose AI chat built natively into the Gracie portal.

---

## 1. Goal & context

GA pays for 9 ChatGPT Business seats. GA App already integrates an AI provider
(OpenAI first, behind a universal interface) for the pipeline and the per-client
Intelligence tab. Adding a **general-purpose Assistant** lets the team do everyday
AI work (writing, research, file Q&A) inside Gracie — fully replacing those seats.

**Native-to-Gracie principle (explicit):** the Assistant is a first-class module of
the portal, not a bolted-on ChatGPT clone. It reuses the existing sidebar, shared chat
components, design tokens (IBM Plex typography, the color system), the Logto auth/role
model, the AI provider abstraction, the file-extraction code, and the `[VERIFY:]`
convention. Same look, same interactions, one integrated platform, one login.

---

## 2. Confirmed requirements

| Area | Decision |
| --- | --- |
| Use cases | General writing/drafting, research & Q&A, file Q&A |
| Web browsing | **Fast-follow**, NOT in MVP |
| Image generation / coding focus | Out of scope |
| History | Per-user, multiple saved conversations (ChatGPT-style sidebar, auto-titles) |
| Privacy | **Strictly private to each user; admins never read content** |
| Offboarding | Admin can **purge** a user's chats on deactivation (delete-only, no read) |
| File uploads | **Separate & ephemeral, scoped to the chat**; never mixed with client docs/KB |
| Access | All roles (Admin / Standard / Viewer) |
| Model selection | Admin sets default via API Settings; users don't choose |

---

## 3. Approach (chosen: A — thin layer on existing AI stack)

Build on the AI provider interface, streaming, and file-extraction already planned.
Add 3 tables + a module + routes. **No new AI plumbing.** File Q&A is intentionally
simpler than the client pipeline: extract text on upload and inject into the prompt
context directly — **no embeddings / pgvector** for typical small files (chunk+truncate
if oversized). Full RAG is overkill for personal scratch Q&A.

Rejected: (B) standalone chat service — duplicates existing AI work; (C) embed
LibreChat — a second app with its own auth/data, breaks the one-platform/one-login story.

---

## 4. Architecture & data flow

```
User types in Assistant
  → POST /api/assistant/chat { chatId?, message, attachmentIds? }
  → load conversation history (assistant_messages for chatId)
  → if attachments: read extracted text, prepend to context
  → provider.stream() via active model (from API Settings)
  → stream tokens to UI; persist user + assistant messages
  → auto-title chat on first exchange
```

**Isolation:** all Assistant data keyed to `user_id`; RLS allows only the author
(admins excluded from reading). Admin has a delete-only purge path for offboarding.

---

## 5. Data model (3 new tables + 1 users change)

```sql
assistant_chats
  id            uuid pk
  user_id       uuid fk → users          -- owner; private
  title         text                      -- auto-generated from first exchange
  model         text                      -- model used (from API Settings at creation)
  archived      boolean default false
  created_at / updated_at

assistant_messages
  id             uuid pk
  chat_id        uuid fk → assistant_chats
  role           enum('user','assistant')
  content        text
  attachment_ids uuid[]                   -- ephemeral files referenced this turn
  token_usage    jsonb                    -- prompt/completion tokens (cost tracking)
  created_at

assistant_attachments
  id             uuid pk
  chat_id        uuid fk → assistant_chats
  user_id        uuid fk → users
  file_name      text
  extracted_text text                     -- text for Q&A; NO embeddings
  r2_key         text nullable             -- raw file in MinIO (optional retention)
  created_at

-- users: add soft-disable for clean offboarding
users.deactivated_at  timestamptz nullable
```

**RLS:** `assistant_*` readable/writable only where `user_id = auth_uid()` — no admin
read exception. Admin gets delete-only purge on deactivation.

---

## 6. API routes (all auth; all enforce user_id = self)

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/assistant/chats` | List my conversations (sidebar) |
| POST | `/api/assistant/chats` | Start a new conversation |
| GET | `/api/assistant/chats/:id` | Load a conversation's messages |
| PATCH | `/api/assistant/chats/:id` | Rename / archive |
| DELETE | `/api/assistant/chats/:id` | Delete my conversation |
| POST | `/api/assistant/chat` | Send message → **stream** response |
| POST | `/api/assistant/attachments` | Upload (presigned) → extract text |
| DELETE | `/api/settings/users/:id/assistant-data` | **Admin purge** on deactivation (delete-only) |

---

## 7. UI (`/assistant` — new sidebar item, all roles)

ChatGPT-style two-pane, built from the **same chat components as the client
Intelligence tab** for visual/interaction consistency:
- **Left:** conversation list (auto-titled, search, new-chat, archive/delete).
- **Right:** message thread (user bubbles right / assistant left, markdown, streaming),
  input with file-attach, "Enter to send / Shift+Enter newline".
- Design tokens: IBM Plex, the GA color system, shared primitives.
- Loading / error / empty states throughout. No placeholder content.

---

## 8. Error handling & cost

- Provider/key errors → friendly message + retry; bad key surfaces in Admin API Settings.
- File too large / unsupported → clear message + supported-types hint.
- Streaming interruption → partial message saved; retry available.
- **Token usage recorded per message** → feeds cost/billing reporting (Phase 9/10).
- Web search explicitly out of MVP (documented fast-follow).

---

## 9. Testing

- RLS: a user cannot read another user's chats; admin cannot read content (only purge).
- Streaming round-trip persists user + assistant messages and auto-titles.
- File Q&A: upload → extract → answer grounded in the file; attachment stays chat-scoped.
- Offboarding: admin deactivation purge deletes all of a user's assistant data.
- Provider-switch: changing the active model in API Settings is reflected in new chats.

---

## 10. Build sequencing

Pairs naturally with **Phase 6** (Intelligence & KB) since it reuses the AI chat +
streaming work. The `deactivated_at` column lands with the Phase 1 schema. Web-search
fast-follow is a later, optional enhancement.

---

## 11. Out of scope (MVP)

- Web browsing / live search (fast-follow)
- Image generation, voice, custom GPTs, code-execution
- Persistent personal file library (uploads are chat-scoped/ephemeral)
- Sharing conversations between users
