import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '../../auth/store/authStore';

// Same base URL used by the axios client
const API_BASE_URL = 'https://almostashar.runasp.net';
const HUB_URL = `${API_BASE_URL}/hubs/almostashar`;

let connection = null;

/**
 * Returns the existing HubConnection (or creates a new one).
 * Does NOT start the connection — call startChatHub() for that.
 */
export const getChatHubConnection = () => {
    if (connection) return connection;

    connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, {
            accessTokenFactory: () => {
                const token = useAuthStore.getState().accessToken;
                return token || '';
            },
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

    connection.onclose((error) => {
        console.warn('[ChatHub] Connection closed', error);
    });

    connection.onreconnecting((error) => {
        console.warn('[ChatHub] Reconnecting...', error);
    });

    connection.onreconnected((connectionId) => {
        console.log('[ChatHub] Reconnected:', connectionId);
    });

    return connection;
};

/**
 * Starts the hub connection if not already Connected or Connecting.
 * Returns the connection instance.
 */
export const startChatHub = async () => {
    const hub = getChatHubConnection();

    if (
        hub.state === signalR.HubConnectionState.Connected ||
        hub.state === signalR.HubConnectionState.Connecting ||
        hub.state === signalR.HubConnectionState.Reconnecting
    ) {
        return hub;
    }

    const token = useAuthStore.getState().accessToken;
    if (!token) {
        console.warn('[ChatHub] No access token — skipping connection');
        return hub;
    }

    try {
        await hub.start();
        console.log('[ChatHub] Connected');
    } catch (error) {
        console.error('[ChatHub] Failed to start:', error);
    }

    return hub;
};

/**
 * Gracefully stops the SignalR connection and clears the singleton.
 */
export const stopChatHub = async () => {
    if (connection) {
        try {
            await connection.stop();
            console.log('[ChatHub] Stopped');
        } catch (error) {
            console.error('[ChatHub] Error stopping:', error);
        }
        connection = null;
    }
};
