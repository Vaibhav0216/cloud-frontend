'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  isConnected: boolean;
  socket: WebSocket | null;
  lastMessage: any;
  sendMessage: (event: string, data: any) => void;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const { user } = useAuth();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    if (!user) {
      console.log('No user available for WebSocket connection');
      return;
    }

    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No JWT token found for WebSocket connection');
      return;
    }

    // Validate token format (basic check)
    if (!token.includes('.')) {
      console.error('❌ Invalid JWT token format');
      return;
    }

    // Decode JWT token to check expiration (basic check)
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          console.error('❌ JWT token has expired');
          console.error('Token expiration:', new Date(payload.exp * 1000));
          console.error('Current time:', new Date(currentTime * 1000));
          return;
        }
        console.log('✅ JWT token validation passed');
        console.log('Token payload:', {
          userId: payload.user_id,
          customerId: payload.customer_id,
          exp: new Date(payload.exp * 1000),
        });
      }
    } catch (error) {
      console.error('❌ Error decoding JWT token:', error);
      return;
    }
         // Connect to AWS WebSocket API
     const wsUrl = `wss://f73mo9hcv9.execute-api.ap-south-1.amazonaws.com/dev?token=${encodeURIComponent(token)}`;
     console.log('🔌 Attempting WebSocket connection to:', wsUrl.replace(token, '[TOKEN_HIDDEN]'));
     console.log('🔌 Full URL length:', wsUrl.length);
     console.log('🔌 Token length:', token.length);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Add connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.error('❌ WebSocket connection timeout after 10 seconds');
          ws.close();
        }
      }, 10000);

      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully to AWS API');
        clearTimeout(connectionTimeout);
        setIsConnected(true);
        setSocket(ws);
        
        // Send initial connection message with user context
        const connectionMessage = {
          type: 'connection',
          userId: user.id,
          tenantId: user.tenantId,
          userRole: user.role,
          timestamp: new Date().toISOString(),
        };
        console.log('📤 Sending connection message:', connectionMessage);
        ws.send(JSON.stringify(connectionMessage));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📥 WebSocket message received:', data);
          
          // Handle AWS IoT telemetry data format
          if (data.eventType === 'INSERT' && data.data) {
            console.log('📊 AWS IoT Telemetry data received:', data);
            
            // Extract only temperature, pressure, and waterLevel for prototype
            const telemetryData = {
              type: 'telemetry',
              deviceId: data.device_id || data.data.deviceId,
              temperature: data.data.temperature || 0,
              pressure: data.data.pressure || 0,
              waterLevel: data.data.waterLevel || 0,
              timestamp: new Date().toISOString(),
              // Include some additional useful data for debugging
              isFault: data.data.isFault || false,
              PUMP_1: data.data.PUMP_1 || false,
              PUMP_2: data.data.PUMP_2 || false,
            };
            
            console.log('📊 Processed telemetry data:', telemetryData);
            setLastMessage(telemetryData);
          } else {
            // Handle other message types
            switch (data.type) {
              case 'telemetry':
                console.log('📊 Telemetry data received:', data);
                setLastMessage(data);
                break;
              case 'alert':
                console.log('🚨 Alert received:', data);
                break;
              case 'device_status':
                console.log('📱 Device status update:', data);
                break;
              case 'connection_ack':
                console.log('✅ Connection acknowledged by server');
                break;
              default:
                console.log('❓ Unknown message type:', data);
            }
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
          console.log('Raw message data:', event.data);
        }
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setSocket(null);
        wsRef.current = null;
        
        // Log close codes for debugging
        switch (event.code) {
          case 1000:
            console.log('📝 Close code 1000: Normal closure');
            break;
          case 1001:
            console.log('📝 Close code 1001: Going away');
            break;
          case 1002:
            console.log('📝 Close code 1002: Protocol error');
            break;
          case 1003:
            console.log('📝 Close code 1003: Unsupported data');
            break;
          case 1006:
            console.log('📝 Close code 1006: Abnormal closure (no close frame)');
            break;
          case 1015:
            console.log('📝 Close code 1015: TLS handshake failure');
            break;
          default:
            console.log(`📝 Close code ${event.code}: ${event.reason || 'Unknown'}`);
        }

        // Attempt to reconnect after a delay (unless it's a normal closure)
        if (event.code !== 1000 && user) {
          console.log('🔄 Scheduling reconnection in 5 seconds...');
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            connectWebSocket();
          }, 5000);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error occurred:', error);
        console.error('❌ Error details:', {
          readyState: ws.readyState,
          url: ws.url.replace(token, '[TOKEN_HIDDEN]'),
          bufferedAmount: ws.bufferedAmount,
          errorType: error.type,
          isTrusted: error.isTrusted,
          timeStamp: error.timeStamp,
        });
        
        // Log more details about the error
        switch (ws.readyState) {
          case WebSocket.CLOSED:
            console.log('🔍 WebSocket state: CLOSED');
            break;
          case WebSocket.CONNECTING:
            console.log('🔍 WebSocket state: CONNECTING');
            break;
          case WebSocket.OPEN:
            console.log('🔍 WebSocket state: OPEN');
            break;
          default:
            console.log('🔍 WebSocket state: UNKNOWN');
        }

                 // Provide specific error guidance based on the error context
         if (ws.readyState === WebSocket.CLOSED) {
           console.error('🔍 Possible causes:');
           console.error('1. Network connectivity issues');
           console.error('2. AWS API Gateway is down or unreachable');
           console.error('3. Invalid or expired JWT token');
           console.error('4. CORS policy blocking the connection');
           console.error('5. Firewall or proxy blocking WebSocket connections');
         }
      };

    } catch (error) {
      console.error('❌ Error creating WebSocket connection:', error);
      setIsConnected(false);
      setSocket(null);
    }
  };

  const reconnect = () => {
    console.log('🔄 Manual reconnection requested');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    connectWebSocket();
  };

  useEffect(() => {
    connectWebSocket();

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        console.log('🔌 Closing WebSocket connection on cleanup');
        wsRef.current.close();
      }
    };
  }, [user?.id, user?.tenantId, user?.role]);

  const sendMessage = (event: string, data: any) => {
    if (socket && isConnected && wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: event,
        ...data,
        userId: user?.id,
        tenantId: user?.tenantId,
        timestamp: new Date().toISOString(),
      };
      
      console.log('📤 Sending WebSocket message:', message);
      socket.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message');
      console.warn('Connection status:', {
        socket: !!socket,
        isConnected,
        readyState: wsRef.current?.readyState,
      });
    }
  };

  const value = {
    isConnected,
    socket,
    lastMessage,
    sendMessage,
    reconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
} 