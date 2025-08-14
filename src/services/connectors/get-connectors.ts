import type { Connector } from "../../types";

export async function getConnectors(): Promise<Connector[]> {
    try {
        const res = await fetch(`http://localhost:3000/api/connectors`, {
            method: "GET",
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(
                errorBody?.message ||
                    `Failed to fetch connectors list: ${res.status} ${res.statusText}`
            );
        }

        return res.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred");
    }
}
