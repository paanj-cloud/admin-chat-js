import { PaanjAdmin } from '@paanj/admin';
import { UsersResource } from './users';

/**
 * AdminUserContext - Context for managing a specific user's blocking operations
 * 
 * Used when you want to perform block/unblock operations on behalf of a specific user.
 */
export class AdminUserContext {
    private admin: PaanjAdmin;
    private blockerId: string;
    private usersResource: UsersResource;

    constructor(admin: PaanjAdmin, blockerId: string, usersResource: UsersResource) {
        this.admin = admin;
        this.blockerId = blockerId;
        this.usersResource = usersResource;
    }

    /**
     * Block a user on behalf of the blocker
     * @param blockedId ID of the user to be blocked
     */
    async block(blockedId: string): Promise<void> {
        return this.usersResource.block(this.blockerId, blockedId);
    }

    /**
     * Unblock a user on behalf of the blocker
     * @param blockedId ID of the user to be unblocked
     */
    async unblock(blockedId: string): Promise<void> {
        return this.usersResource.unblock(this.blockerId, blockedId);
    }
}

