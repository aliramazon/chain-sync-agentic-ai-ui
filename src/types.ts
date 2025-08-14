export const ConnectorStatus = {
    CONNECTED: "connected",
    NOT_CONNECTED: "not_connected",
    DISCONNECTED: "disconnected",
} as const;

export type ConnectorStatus =
    (typeof ConnectorStatus)[keyof typeof ConnectorStatus];

export interface Connector {
    name: string;
    id: string;
    key: string;
    createdAt: Date;
    status: ConnectorStatus;
    lastError: string | null;
    connectedAt: Date | null;
    disconnectedAt: Date | null;
}
