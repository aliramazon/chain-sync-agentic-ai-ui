import type { Connector } from "../../types";

export async function disconnectConnector(id: string): Promise<Connector> {
    try {
        const res = await fetch(
            `http://localhost:3000/api/connectors/${id}/disconnect`,
            {
                method: "POST",
            }
        );

        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(
                errorBody?.message ||
                    `Failed to disconnect connector: ${res.status} ${res.statusText}`
            );
        }

        return res.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred while disconnecting");
    }
}
