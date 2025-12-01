import { PaanjAdmin, Unsubscribe } from '@paanj/admin';
import { User, CreateUserData, UserFilters } from '../types/chat-types';

/**
 * Users resource - manage and monitor users
 */
export class UsersResource {
    private admin: PaanjAdmin;

    constructor(admin: PaanjAdmin) {
        this.admin = admin;
    }

    // CRUD Operations

    /**
     * Create a new user
     */
    async create(data: CreateUserData): Promise<User> {
        const httpClient = this.admin.getHttpClient();
        return httpClient.request<User>('POST', '/admin/users', data);
    }

    /**
     * Get user by ID
     */
    async get(userId: string): Promise<User> {
        const httpClient = this.admin.getHttpClient();
        return httpClient.request<User>('GET', `/admin/users/${userId}`);
    }

    /**
     * Update user
     */
    async update(userId: string, updates: Partial<User>): Promise<User> {
        const httpClient = this.admin.getHttpClient();
        return httpClient.request<User>('PATCH', `/admin/users/${userId}`, updates);
    }

    /**
     * Delete user
     */
    async delete(userId: string): Promise<void> {
        const httpClient = this.admin.getHttpClient();
        await httpClient.request<void>('DELETE', `/admin/users/${userId}`);
    }

    /**
     * List users with optional filters
     */
    /**
     * List users with optional filters
     */
    /*
    list(filters?: UserFilters) {
        const execute = async (finalFilters: UserFilters) => {
            const httpClient = this.admin.getHttpClient();
            const params = new URLSearchParams();
            if (finalFilters?.email) params.append('email', finalFilters.email);
            if (finalFilters?.limit) params.append('limit', finalFilters.limit.toString());
            if (finalFilters?.offset) params.append('offset', finalFilters.offset.toString());

            const query = params.toString();
            return httpClient.request<User[]>('GET', `/api/v1/users${query ? `?${query}` : ''}`);
        };

        const currentFilters = { ...filters };

        const chain = {
            then: (resolve: (value: User[]) => void, reject: (reason: any) => void) => {
                return execute(currentFilters).then(resolve, reject);
            },
            email: (email: string) => {
                currentFilters.email = email;
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
    */

    /**
     * Block a user on behalf of another user
     * @internal Used by AdminUserContext
     * @param blockerId ID of the user who is blocking
     * @param blockedId ID of the user to be blocked
     */
    async block(blockerId: string, blockedId: string): Promise<void> {
        const httpClient = this.admin.getHttpClient();
        await httpClient.request<void>('POST', `/admin/users/${blockerId}/block`, {
            blockedUserId: parseInt(blockedId)
        });
    }

    /**
     * Unblock a user on behalf of another user
     * @internal Used by AdminUserContext
     * @param blockerId ID of the user who is unblocking
     * @param blockedId ID of the user to be unblocked
     */
    async unblock(blockerId: string, blockedId: string): Promise<void> {
        const httpClient = this.admin.getHttpClient();
        await httpClient.request<void>('POST', `/admin/users/${blockerId}/unblock`, {
            blockedUserId: parseInt(blockedId)
        });
    }

    // Event Listeners

    /**
     * Listen to all user creation events globally
     */
    onCreate(callback: (data: User) => void): Unsubscribe {
        this.admin.subscribe({
            type: 'admin.subscribe',
            resource: 'global',
            events: ['user.create'],
        });
        return this.admin.on('user.create', callback);
    }

    /**
     * Listen to all user update events globally
     */
    onUpdate(callback: (data: any) => void): Unsubscribe {
        this.admin.subscribe({
            type: 'admin.subscribe',
            resource: 'global',
            events: ['user.update'],
        });
        return this.admin.on('user.update', callback);
    }

    /**
     * Listen to all user delete events globally
     */
    onDelete(callback: (data: any) => void): Unsubscribe {
        this.admin.subscribe({
            type: 'admin.subscribe',
            resource: 'global',
            events: ['user.delete'],
        });
        return this.admin.on('user.delete', callback);
    }
}
