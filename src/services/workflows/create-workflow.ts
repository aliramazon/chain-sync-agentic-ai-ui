import type { Workflow } from "../../types";
import { config } from "../config";

export async function createWorkflow(
    prompt: string
): Promise<{ workflow: Workflow }> {
    try {
        const res = await fetch(`${config.apiBaseUrl}/workflows`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(
                errorBody?.message ||
                    `Failed to create workflow: ${res.status} ${res.statusText}`
            );
        }

        return res.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred while creating workflow");
    }
}
