# Social Media Command Center

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- Collapsible sidebar with 20+ client profile entries, each showing avatar, name, platform icons, and Active/Disconnected status indicator
- Unified Universal Inbox: scrollable list aggregating messages from all connected accounts (Gmail + Outlook style), with sender, subject, preview, timestamp, account tag, and read/unread state
- Global Post Composer popup: draft a post, select multiple accounts to publish to simultaneously, preview per-platform, submit
- Dashboard header with search, notifications, and user menu
- Account detail panel (optional slide-in) when clicking a profile
- Stats/metrics strip: total accounts, active, disconnected, unread messages
- Backend: accounts CRUD (name, platform, status, email), messages store (sender, subject, body, accountId, timestamp, read), posts store (content, targetAccounts, status, createdAt)

### Modify
N/A — new project

### Remove
N/A — new project

## Implementation Plan
1. Generate Motoko backend with Account, Message, Post actors
2. Build React frontend:
   - AppShell with collapsible sidebar
   - Sidebar: account list with search/filter, status badges, platform icons
   - Main area: tab/section navigation (Inbox, Compose, Analytics)
   - UniversalInbox: scrollable message feed, filters by account/platform/status
   - GlobalPostComposer: modal with rich text area, account multi-select checkboxes, publish button
   - TopBar: search, notification bell, user avatar
   - Stats strip at top of main content
3. Wire frontend to backend APIs
4. Seed 20+ sample accounts and messages
