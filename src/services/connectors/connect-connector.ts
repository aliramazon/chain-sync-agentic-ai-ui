import type { Connector } from "../../types";
import { config } from "../config";

export async function connectConnector(id: string): Promise<Connector> {
    try {
        const res = await fetch(
            `${config.apiBaseUrl}/connectors/${id}/connect`,
            {
                method: "POST",
            }
        );

        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(
                errorBody?.message ||
                    `Failed to connect connector: ${res.status} ${res.statusText}`
            );
        }

        return res.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred while connecting");
    }
}
