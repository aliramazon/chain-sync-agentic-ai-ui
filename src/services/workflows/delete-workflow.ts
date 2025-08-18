import { config } from "../config";

export async function deleteWorkflow(id: string): Promise<void> {
    try {
        const res = await fetch(`${config.apiBaseUrl}/workflows/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(
                errorBody?.message ||
                    `Failed to delete workflow: ${res.status} ${res.statusText}`
            );
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred while deleting workflow");
    }
}
