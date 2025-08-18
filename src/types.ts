export const ConnectorStatus = {
    CONNECTED: "connected",
    NOT_CONNECTED: "not_connected",
    DISCONNECTED: "disconnected",
} as const;

export type ConnectorStatus =
    (typeof ConnectorStatus)[keyof typeof ConnectorStatus];

export interface Connector {
    id: string;
    name: string;
    key: string;
    status: ConnectorStatus;
    lastError: string | null;
    connectedAt: Date | null;
    disconnectedAt: Date | null;
    createdAt: Date;
    updatedAt: Date; // Added missing field
}

export const ActionType = {
    TRIGGER: "trigger",
    ACTION: "action",
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export interface ActionCatalog {
    id: string;
    connectorId: string;
    type: ActionType;
    key: string;
    title: string;
    description: string;
    schemaInput?: unknown;
    schemaOutput?: unknown;
    examples?: unknown;
    createdAt: Date;
    updatedAt: Date;

    // Related data (when included)
    connector?: Connector;
}

export interface WorkflowStep {
    id: string;
    workflowId: string;
    actionId: string;
    connectorId: string;
    stepOrder: number;
    externalId: string;
    createdAt: string;
    updatedAt: string;
    dependsOn: string[];
    description: string;

    action?: ActionCatalog;
    connector?: Connector;
    workflow?: Workflow;
}

export interface Workflow {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    _count: {
        steps: number;
    };
    steps?: WorkflowStep[];
}
