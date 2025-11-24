/**
 * Basic Usage Example (JavaScript)
 * 
 * Demonstrates the new modular SDK architecture with:
 * - PaanjAdmin (core package)
 * - AdminChat (chat features)
 */

const { PaanjAdmin } = require('@paanj/admin');
const { AdminChat } = require('@paanj/chat-admin');
const { loadConfig } = require('./config');

async function main() {
    // Load configuration (dev: .env.local, prod: environment variables)
    const config = loadConfig();

    if (!config.secretKey) {
        console.error('❌ No secret key found!');
        console.error('Run: node examples/setup.js');
        process.exit(1);
    }

    console.log(`🔧 Environment: ${config.isDev ? 'Development' : 'Production'}`);
    console.log(`🔗 API URL: ${config.apiUrl}\n`);

    // Initialize core admin client
    const admin = new PaanjAdmin(config.secretKey, {
        apiUrl: config.apiUrl,
        wsUrl: config.wsUrl,
    });

    try {
        // Connect to WebSocket
        await admin.connect();
        console.log('✅ Connected to Paanj Admin');

        // Initialize chat features
        const chat = new AdminChat(admin);
        console.log('✅ Chat features initialized');

        // Listen to real-time events
        chat.users.onCreate((data) => {
            console.log('👤 New user created:', data.userId);
        });

        chat.messages.onCreate((data) => {
            console.log('📨 New message:', data.content);
        });

        chat.conversations.onCreate((data) => {
            console.log('💬 New conversation:', data.id);
        });

        // Example: Get user information
        try {
            const user = await chat.users.get('user_123');
            console.log('User info:', user);
        } catch (error) {
            console.log('User not found (expected in demo)');
        }

        // Example: Update user
        try {
            await chat.users.update('user_123', {
                userData: { status: 'active' }
            });
            console.log('✅ User updated');
        } catch (error) {
            console.log('Update failed (expected in demo)');
        }

        // Example: Send message to a conversation
        try {
            const conv = chat.conversation('conv_123');
            await conv.sendMessage('Hello from admin!', {
                priority: 'high'
            });
            console.log('✅ Message sent');
        } catch (error) {
            console.log('Send message failed (expected in demo)');
        }

        // Keep connection alive for monitoring
        console.log('\n👀 Monitoring events... (Press Ctrl+C to exit)');

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n\n🛑 Shutting down...');
            admin.disconnect();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        admin.disconnect();
        process.exit(1);
    }
}

main();
