import { useEffect, useState } from "react";
import { toaster } from "../../components/toaster/Toaster";
import { getWorkflow } from "../../services/workflows/get-workflow";
import type { Workflow } from "../../types";

export const useWorkflow = (workflowId?: string) => {
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!workflowId) return;
        let canceled = false;
        setLoading(true);

        getWorkflow(workflowId)
            .then((data) => {
                if (!canceled) setWorkflow(data ?? null);
            })
            .catch((error) => {
                console.error("Failed to fetch workflow:", error);
                toaster.create({
                    title: "Failed to Load Workflow",
                    description:
                        "Could not fetch workflow details. Please try again.",
                    type: "error",
                    duration: 4000,
                });
            })
            .finally(() => {
                if (!canceled) setLoading(false);
            });

        return () => {
            canceled = true;
        };
    }, [workflowId]);

    return { workflow, loading };
};
