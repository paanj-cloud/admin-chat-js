# Chat Admin Examples

Examples demonstrating the `@paanj/chat-admin` package with the new modular SDK architecture.

## Setup

### 1. Install Dependencies

```bash
# Install required packages
npm install axios

# Or if running from monorepo root
cd sdks/javascript/chat-admin/examples
npm install
```

### 2. Create Test Credentials

Run the setup script to create test credentials:

```bash
node setup.js
```

This will:
- Create a test account, organization, and project
- Generate secret and public API keys
- Save credentials to `.env.local` (gitignored)

### 3. Run Examples

```bash
# TypeScript
npx ts-node basic-usage.ts

# JavaScript
node basic-usage.js
```

## Configuration

The examples use environment-based configuration:

**Development** (automatic):
- Reads from `.env.local` (created by `setup.js`)
- Uses `localhost` URLs

**Production**:
- Reads from environment variables:
  - `PAANJ_SECRET_KEY`
  - `PAANJ_PUBLIC_KEY`
  - `API_URL` (defaults to `https://api.paanj.com`)
  - `WS_URL` (defaults to `wss://ws.paanj.com`)

## Running Examples

### TypeScript Example

```bash
npx ts-node examples/basic-usage.ts
```

### JavaScript Example

```bash
node examples/basic-usage.js
```

## Examples

### `basic-usage.ts` / `basic-usage.js`
Demonstrates:
- Initializing `PaanjAdmin` core client
- Creating `AdminChat` instance
- Listening to real-time events (users, messages, conversations)
- Performing CRUD operations
- Graceful shutdown

## Configuration

Update the examples with your credentials:

```typescript
const admin = new PaanjAdmin('sk_live_your_secret_key', {
    apiUrl: 'http://localhost:3000',      // Your API server
    wsUrl: 'ws://localhost:8090',         // Your WebSocket server
});
```

## New API Pattern

The modular architecture uses a composition pattern:

```typescript
// Old (monolithic)
import { AdminClient } from '@paanj/js-admin';
const admin = new AdminClient(secretKey);
admin.on.messageCreate(...);

// New (modular)
import { PaanjAdmin } from '@paanj/admin';
import { AdminChat } from '@paanj/chat-admin';

const admin = new PaanjAdmin(secretKey);
const chat = new AdminChat(admin);
chat.messages.onCreate(...);
```

## Features Demonstrated

✅ Core connection management  
✅ Real-time event monitoring  
✅ User management (CRUD)  
✅ Conversation operations  
✅ Message operations  
✅ Graceful shutdown  

## Support

- 📖 Documentation: https://docs.paanj.com
- 🐛 Issues: https://github.com/paanj-cloud/admin-chat-js/issues
