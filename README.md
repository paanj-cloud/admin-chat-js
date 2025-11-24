# @paanj/chat-admin

> Chat administration features for Paanj platform - manage users, conversations, and messages with real-time monitoring

[![npm version](https://img.shields.io/npm/v/@paanj/chat-admin.svg)](https://www.npmjs.com/package/@paanj/chat-admin)
[![License](https://img.shields.io/badge/license-Custom-blue.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)

## Overview

`@paanj/chat-admin` provides comprehensive chat administration features:
- 👥 **User Management** - CRUD operations and real-time events
- 💬 **Conversation Management** - Create, update, delete conversations
- 📨 **Message Operations** - Send and manage messages
- 🎯 **Real-time Events** - Monitor all chat activity globally or per-resource
- 🔌 **Modular** - Works with `@paanj/admin` core package

## Installation

```bash
npm install @paanj/admin @paanj/chat-admin
```

**Requirements:**
- Node.js 16.0.0 or higher
- `@paanj/admin` ^1.0.0

## Quick Start

```typescript
import { PaanjAdmin } from '@paanj/admin';
import { AdminChat } from '@paanj/chat-admin';

// Initialize core admin
const admin = new PaanjAdmin('sk_live_your_secret_key');
await admin.connect();

// Initialize chat features
const chat = new AdminChat(admin);

// Listen to all user creation events
chat.users.onCreate((data) => {
  console.log('New user created:', data.userId);
});

// Get user information
const user = await chat.users.get('user_123');

// Update user
await chat.users.update('user_123', {
  userData: { status: 'active' }
});
```

## API Reference

### AdminChat

#### Constructor

```typescript
new AdminChat(admin: PaanjAdmin)
```

Creates a new AdminChat instance using an existing PaanjAdmin instance.

### Users Resource

#### CRUD Operations

```typescript
// Get user by ID
const user = await chat.users.get('user_123');

// Update user
await chat.users.update('user_123', {
  userData: { status: 'active', role: 'moderator' }
});

// Delete user
await chat.users.delete('user_123');

// List users with filters
const users = await chat.users.list({ limit: 10 });
```

#### Event Listeners

```typescript
// Listen to user creation events
chat.users.onCreate((data) => {
  console.log('User created:', data);
});

// Listen to user update events
chat.users.onUpdate((data) => {
  console.log('User updated:', data);
});

// Listen to user delete events
chat.users.onDelete((data) => {
  console.log('User deleted:', data);
});
```

### Conversations Resource

#### CRUD Operations

```typescript
// Create conversation
const conversation = await chat.conversations.create({
  name: 'Team Chat',
  memberIds: ['user_1', 'user_2'],
  metadata: { department: 'engineering' }
});

// Get conversation
const conv = await chat.conversations.get('conv_123');

// Update conversation
await chat.conversations.update('conv_123', {
  name: 'Updated Team Chat'
});

// Delete conversation
await chat.conversations.delete('conv_123');

// List conversations
const conversations = await chat.conversations.list({ limit: 10 });
```

#### Event Listeners

```typescript
// Listen to conversation events
chat.conversations.onCreate((data) => console.log('Conversation created:', data));
chat.conversations.onUpdate((data) => console.log('Conversation updated:', data));
chat.conversations.onDelete((data) => console.log('Conversation deleted:', data));
```

#### Conversation-Specific Operations

```typescript
// Get conversation-specific operations
const conv = chat.conversation('conv_123');

// Send message
await conv.sendMessage('Hello from admin!', {
  priority: 'high'
});

// Add participant
await conv.addParticipant('user_456');

// Remove participant
await conv.removeParticipant('user_456');

// Listen to messages in this conversation
conv.onMessage((message) => {
  console.log('New message in conv_123:', message.content);
});
```

### Messages Resource

#### Event Listeners

```typescript
// Listen to all message events globally
chat.messages.onCreate((message) => {
  console.log('Message created:', message);
});

chat.messages.onSend((message) => {
  console.log('Message sent:', message);
});

chat.messages.onUpdate((data) => {
  console.log('Message updated:', data);
});

chat.messages.onDelete((data) => {
  console.log('Message deleted:', data);
});
```

## Complete Example

```typescript
import { PaanjAdmin } from '@paanj/admin';
import { AdminChat } from '@paanj/chat-admin';

async function main() {
  // Initialize
  const admin = new PaanjAdmin('sk_live_key');
  await admin.connect();
  
  const chat = new AdminChat(admin);

  // Monitor all events
  chat.users.onCreate((data) => console.log('👤 User created:', data.userId));
  chat.conversations.onCreate((data) => console.log('💬 Conversation created:', data.id));
  chat.messages.onCreate((data) => console.log('📨 Message created:', data.id));

  // Manage users
  const user = await chat.users.get('user_123');
  await chat.users.update('user_123', {
    userData: { lastActive: new Date().toISOString() }
  });

  // Manage conversations
  const conv = await chat.conversations.create({
    name: 'Support Chat',
    memberIds: [user.userId, 'admin_user'],
    metadata: { type: 'support' }
  });

  // Send message
  await chat.conversation(conv.id).sendMessage(
    'Welcome! How can we help you?'
  );

  // Keep connection alive
  console.log('Monitoring chat events...');
}

main().catch(console.error);
```

## TypeScript Support

Full TypeScript support with complete type definitions:

```typescript
import { AdminChat, User, Conversation, Message } from '@paanj/chat-admin';

const chat = new AdminChat(admin);

const user: User = await chat.users.get('user_123');
const conversation: Conversation = await chat.conversations.get('conv_123');
```

## Examples

Check the [`examples/`](./examples) directory for complete working examples:

- `basic-usage.ts` - Basic SDK initialization and usage
- `event-monitoring.ts` - Real-time event monitoring
- `user-management.ts` - User CRUD operations
- `conversation-management.ts` - Conversation management

### Running Examples

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run examples
npx ts-node examples/basic-usage.ts
```

## Error Handling

```typescript
try {
  const user = await chat.users.get('user_123');
} catch (error) {
  if (error.message.includes('404')) {
    console.error('User not found');
  } else {
    console.error('Error:', error.message);
  }
}
```

## License

This project is licensed under a custom license. See the [LICENSE](./LICENSE) file for details.

## Support

- 📧 Email: support@paanj.com
- 📖 Documentation: https://docs.paanj.com
- 🐛 Issues: https://github.com/paanj/chat-baas/issues

## Related Packages

- [`@paanj/admin`](../admin) - Core admin SDK (required)
- `@paanj/voice-admin` - Voice call management (coming soon)
- `@paanj/video-admin` - Video call management (coming soon)

---

Made with ❤️ by the Paanj team
