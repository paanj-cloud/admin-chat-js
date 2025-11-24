import { PaanjAdmin, Unsubscribe } from '@paanj/admin';

/**
 * Messages resource - manage and monitor messages
 */
export class MessagesResource {
    private admin: PaanjAdmin;

    constructor(admin: PaanjAdmin) {
        this.admin = admin;
    }

    /**
     * Listen to all message creation events globally
     */
    onCreate(callback: (message: any) => void): Unsubscribe {
        this.admin.subscribe({
            type: 'admin.subscribe',
            resource: 'global',
            events: ['message.create'],
        });
        return this.admin.on('message.create', callback);
    }

    /**
     * Listen to all message send events globally
     */
    onSend(callback: (message: any) => void): Unsubscribe {
        this.admin.subscribe({
            type: 'admin.subscribe',
            resource: 'global',
            events: ['message.send'],
        });
        return this.admin.on('message.send', callback);
    }

    /**
     * Listen to all message update events globally
     */
    onUpdate(callback: (data: any) => void): Unsubscribe {
        this.admin.subscribe({
            type: 'admin.subscribe',
            resource: 'global',
            events: ['message.update'],
        });
        return this.admin.on('message.update', callback);
    }

    /**
     * Listen to all message delete events globally
     */
    onDelete(callback: (data: any) => void): Unsubscribe {
        this.admin.subscribe({
            type: 'admin.subscribe',
            resource: 'global',
            events: ['message.delete'],
        });
        return this.admin.on('message.delete', callback);
    }
}
