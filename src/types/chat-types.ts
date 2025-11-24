// Core types for Admin SDK

export interface AdminClientOptions {
    apiUrl?: string;
    wsUrl?: string;
    autoReconnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}

export interface User {
    userId: string;
    email: string;
    name: string;
    userData?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface Conversation {
    id: string;
    name?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    members: Participant[];
}

export interface Participant {
    userId: string;
    conversationId: string;
    role?: string;
    joinedAt: Date;
}

export interface Message {
    id: string;
    conversationId: string;
    sender: string;
    content: string;
    metadata?: Record<string, any>;
    timestamp: number;
    createdAt: Date;
}

export interface CreateUserData {
    email: string;
    name: string;
    userData?: Record<string, any>;
}

export interface CreateConversationData {
    name?: string;
    metadata?: Record<string, any>;
    memberIds: string[];
}

export interface UserFilters {
    email?: string;
    limit?: number;
    offset?: number;
}

export interface ConversationFilters {
    userId?: string;
    limit?: number;
    offset?: number;
}

export type Unsubscribe = () => void;

// Admin event types
export interface AdminEvent {
    type: 'admin.event';
    event: string;
    resource: string;
    resourceId: string;
    data: any;
}

export interface AdminSubscription {
    type: 'admin.subscribe' | 'admin.unsubscribe';
    resource: 'global' | 'conversation' | 'user';
    id?: string;
    events: string[];
}

export interface AdminSubscribed {
    type: 'admin.subscribed';
    resource: string;
    id?: string;
    events: string[];
}
