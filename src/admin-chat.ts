import { PaanjAdmin } from '@paanj/admin';
import { MessagesResource } from './resources/messages';
import { UsersResource } from './resources/users';
import { ConversationsResource } from './resources/conversations';

/**
 * AdminChat - Chat administration features for Paanj platform
 * 
 * Provides user management, conversation management, message operations,
 * and real-time event monitoring for chat features.
 * 
 * @example
 * ```typescript
 * import { PaanjAdmin } from '@paanj/admin';
 * import { AdminChat } from '@paanj/chat-admin';
 * 
 * const admin = new PaanjAdmin('sk_live_key');
 * await admin.connect();
 * 
 * const chat = new AdminChat(admin);
 * 
 * // Listen to events
 * chat.messages.onCreate((msg) => console.log('New message:', msg));
 * 
 * // Manage users
 * const user = await chat.users.get('user_123');
 * await chat.users.update('user_123', { userData: { status: 'active' } });
 * ```
 */
export class AdminChat {
    /**
     * Messages resource - manage and monitor messages
     */
    public readonly messages: MessagesResource;

    /**
     * Users resource - manage and monitor users
     */
    public readonly users: UsersResource;

    /**
     * Conversations resource - manage and monitor conversations
     */
    public readonly conversations: ConversationsResource;

    private admin: PaanjAdmin;

    /**
     * Create a new AdminChat instance
     * 
     * @param admin - PaanjAdmin instance (must be connected)
     */
    constructor(admin: PaanjAdmin) {
        this.admin = admin;

        // Initialize resources
        this.messages = new MessagesResource(admin);
        this.users = new UsersResource(admin);
        this.conversations = new ConversationsResource(admin);
    }

    /**
     * Get conversation-specific operations
     * 
     * @param conversationId - The conversation ID
     * @returns Conversation-specific operations
     * 
     * @example
     * ```typescript
     * const conv = chat.conversation('conv_123');
     * await conv.sendMessage('Hello!');
     * conv.onMessage((msg) => console.log(msg));
     * ```
     */
    conversation(conversationId: string) {
        return this.conversations.conversation(conversationId);
    }
}
