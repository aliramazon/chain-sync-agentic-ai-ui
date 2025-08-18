import { config } from "../config";

export async function runWorkflowWithSyntheticData(
    workflowId: string
): Promise<{ message: string }> {
    try {
        const res = await fetch(
            `${config.apiBaseUrl}/workflows/${workflowId}/run-with-synthetic-data`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(
                errorBody?.message ||
                    `Failed to run workflow with synthetic data: ${res.status} ${res.statusText}`
            );
        }

        return res.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error(
            "An unexpected error occurred while running workflow with synthetic data"
        );
    }
}
