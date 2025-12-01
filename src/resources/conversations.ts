import { PaanjAdmin, Unsubscribe } from '@paanj/admin';
import { Conversation, CreateConversationData, ConversationFilters, Message } from '../types/chat-types';

/**
 * Conversations resource - manage and monitor conversations
 */
export class ConversationsResource {
    private admin: PaanjAdmin;

    constructor(admin: PaanjAdmin) {
        this.admin = admin;
    }

    // CRUD Operations

    /**
     * Create a new conversation
     */
    async create(data: CreateConversationData): Promise<Conversation> {
        const httpClient = this.admin.getHttpClient();
        return httpClient.request<Conversation>('POST', '/admin/conversations', data);
    }

    /**
     * Get conversation by ID
     */
    async get(conversationId: string): Promise<Conversation> {
        const httpClient = this.admin.getHttpClient();
        return httpClient.request<Conversation>('GET', `/admin/conversations/${conversationId}`);
    }

    /**
     * Update conversation
     */
    async update(conversationId: string, updates: Partial<Conversation>): Promise<Conversation> {
        const httpClient = this.admin.getHttpClient();
        return httpClient.request<Conversation>('PATCH', `/admin/conversations/${conversationId}`, updates);
    }

    /**
     * Delete conversation
     */
    async delete(conversationId: string): Promise<void> {
        const httpClient = this.admin.getHttpClient();
        await httpClient.request<void>('DELETE', `/admin/conversations/${conversationId}`);
    }

    /**
     * List conversations with optional filters
     */
    /**
     * List conversations with optional filters
     */
    list(filters?: ConversationFilters) {
        const execute = async (finalFilters: ConversationFilters) => {
            const httpClient = this.admin.getHttpClient();
            const params = new URLSearchParams();
            if (finalFilters?.userId) params.append('userId', finalFilters.userId);
            if (finalFilters?.limit) params.append('limit', finalFilters.limit.toString());
            if (finalFilters?.offset) params.append('offset', finalFilters.offset.toString());

            const query = params.toString();
            return httpClient.request<Conversation[]>('GET', `/admin/conversations${query ? `?${query}` : ''}`);
        };

        const currentFilters = { ...filters };

        const chain = {
            then: (resolve: (value: Conversation[]) => void, reject: (reason: any) => void) => {
                return execute(currentFilters).then(resolve, reject);
            },
            userId: (userId: string) => {
                currentFilters.userId = userId;
                return chain;
            },
            limit: (limit: number) => {
                currentFilters.limit = limit;
                return chain;
            },
            page: (page: number) => {
                const limit = currentFilters.limit || 50;
                currentFilters.offset = (page - 1) * limit;
                return chain;
            },
            offset: (offset: number) => {
                currentFilters.offset = offset;
                return chain;
            }
        };

        return chain;
    }

    // Event Listeners

    /**
     * Listen to all conversation creation events globally
     */
    onCreate(callback: (conversation: any) => void): Unsubscribe {
        this.admin.subscribe({
            type: 'admin.subscribe',
            resource: 'global',
            events: ['conversation.create'],
        });
        return this.admin.on('conversation.create', callback);
    }

    /**
     * Listen to all conversation update events globally
     */
    onUpdate(callback: (data: any) => void): Unsubscribe {
        this.admin.subscribe({
            type: 'admin.subscribe',
            resource: 'global',
            events: ['conversation.update'],
        });
        return this.admin.on('conversation.update', callback);
    }

    /**
     * Listen to all conversation delete events globally
     */
    onDelete(callback: (data: any) => void): Unsubscribe {
        this.admin.subscribe({
            type: 'admin.subscribe',
            resource: 'global',
            events: ['conversation.delete'],
        });
        return this.admin.on('conversation.delete', callback);
    }

    /**
     * Get conversation-specific operations
     */
    conversation(conversationId: string) {
        return {
            /**
             * Send a message in this conversation
             */
            /**
             * Send a message in this conversation
             */
            send: async (content: string, metadata?: Record<string, any>): Promise<Message> => {
                const httpClient = this.admin.getHttpClient();
                return httpClient.request<Message>('POST', `/admin/conversations/${conversationId}/messages`, {
                    content,
                    metadata,
                });
            },

            /**
             * Add a participant to this conversation
             */
            addParticipant: async (userId: string): Promise<void> => {
                const httpClient = this.admin.getHttpClient();
                await httpClient.request<void>('POST', `/admin/conversations/${conversationId}/participants`, {
                    userId,
                });
            },

            /**
             * Remove a participant from this conversation
             */
            removeParticipant: async (userId: string): Promise<void> => {
                const httpClient = this.admin.getHttpClient();
                await httpClient.request<void>('DELETE', `/admin/conversations/${conversationId}/participants/${userId}`);
            },

            /**
             * Listen to messages in this specific conversation
             */
            onMessage: (callback: (message: Message) => void): Unsubscribe => {
                this.admin.subscribe({
                    type: 'admin.subscribe',
                    resource: 'conversation',
                    id: conversationId,
                    events: ['message.create'],
                });
                return this.admin.on(`conversation:${conversationId}:message.create`, callback);
            },
        };
    }
}
