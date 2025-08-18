import type { Workflow } from "../../types";
import { config } from "../config";

export async function getAllWorkflows(): Promise<Workflow[]> {
    try {
        const res = await fetch(`${config.apiBaseUrl}/workflows`, {
            method: "GET",
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(
                errorBody?.message ||
                    `Failed to fetch workflows: ${res.status} ${res.statusText}`
            );
        }

        return res.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error(
            "An unexpected error occurred while fetching workflows"
        );
    }
}
