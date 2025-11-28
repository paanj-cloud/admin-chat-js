import { PaanjAdmin } from '@paanj/admin';
import { MessagesResource } from './resources/messages';
import { UsersResource } from './resources/users';
import { ConversationsResource } from './resources/conversations';
import { AdminUserContext } from './resources/admin-user-context';

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
 * 
 * // Block users (fluent API)
 * await chat.users('user_123').block('user_456');
 * ```
 */
export class AdminChat {
    /**
     * Messages resource - manage and monitor messages
     */
    public readonly messages: MessagesResource;

    /**
     * Users resource - manage and monitor users
     * 
     * Can be used as:
     * - Direct resource methods: chat.users.create(), chat.users.get(), etc.
     * - Fluent API for blocking: chat.users('blockerId').block('blockedId')
     */
    public users: UsersResource & ((blockerId: string) => AdminUserContext);

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
        const usersResource = new UsersResource(admin);
        this.conversations = new ConversationsResource(admin);

        // Create fluent API for users (similar to client SDK)
        this.users = Object.assign(
            (blockerId: string) => {
                return new AdminUserContext(admin, blockerId, usersResource);
            },
            usersResource
        ) as UsersResource & ((blockerId: string) => AdminUserContext);
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
     * await conv.send('Hello!');
     * conv.onMessage((msg) => console.log(msg));
     * ```
     */
    conversation(conversationId: string) {
        return this.conversations.conversation(conversationId);
    }
}
