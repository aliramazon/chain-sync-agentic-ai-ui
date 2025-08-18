import type { Workflow } from "../../types";
import { config } from "../config";

export async function changeWorkflowStatus(
    id: string,
    status: "activate" | "deactivate"
): Promise<Pick<Workflow, "id" | "isActive">> {
    try {
        const res = await fetch(
            `${config.apiBaseUrl}/workflows/${id}/change-status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            }
        );

        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(
                errorBody?.message ||
                    `Failed to change workflow status: ${res.status} ${res.statusText}`
            );
        }

        return res.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error(
            "An unexpected error occurred while changing workflow status"
        );
    }
}
