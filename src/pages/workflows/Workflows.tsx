import { Box, Flex, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { toaster } from "../../components/toaster/Toaster";
import { changeWorkflowStatus } from "../../services/workflows/change-status";
import { getAllWorkflows } from "../../services/workflows/get-all-workflows";
import type { Workflow } from "../../types";
import { WorkflowCard } from "./components/WorkflowCard";

export const Workflows = () => {
    const [workflows, setWorkflows] = useState<Workflow[] | null>(null);
    const [fetchingWorkflows, setFetchingWorkflows] = useState(true);
    const location = useLocation();

    const hasNestedRoute = location.pathname !== "/workflows";

    useEffect(() => {
        setFetchingWorkflows(true);
        getAllWorkflows()
            .then((data) => {
                setWorkflows(data);
            })
            .catch((error) => {
                console.error("Failed to fetch workflows:", error);
                toaster.create({
                    title: "Failed to Load Workflows",
                    description: "Could not fetch workflows. Please try again.",
                    type: "error",
                    duration: 4000,
                });
            })
            .finally(() => {
                setFetchingWorkflows(false);
            });
    }, []);

    const changeStatus = async (
        id: string,
        status: "activate" | "deactivate"
    ) => {
        try {
            const updatedWorkflow = await changeWorkflowStatus(id, status);

            // Update the workflow in local state
            setWorkflows(
                (prevWorkflows) =>
                    prevWorkflows?.map((workflow) =>
                        workflow.id === id
                            ? {
                                  ...workflow,
                                  isActive: updatedWorkflow.isActive,
                              }
                            : workflow
                    ) || null
            );

            toaster.create({
                title: "Workflow Updated",
                description: `Workflow has been ${status}d successfully.`,
                type: "success",
                duration: 3000,
            });
        } catch (error) {
            console.error("Failed to change workflow status:", error);
            toaster.create({
                title: "Failed to Update Workflow",
                description:
                    error instanceof Error
                        ? error.message
                        : "Could not update workflow status. Please try again.",
                type: "error",
                duration: 4000,
            });
        }
    };

    return (
        <VStack align="stretch" gap={6}>
            <Heading size="lg">Workflows</Heading>
            <Flex h="calc(100vh - 120px)" gap={0}>
                <Box
                    w="25rem"
                    borderRight="1px solid"
                    borderColor="gray.200"
                    bg="gray.50"
                    overflowY="auto"
                >
                    <VStack align="stretch" gap={3} p={4}>
                        {fetchingWorkflows ? (
                            <VStack gap={4} py={8}>
                                <Spinner size="lg" color="blue.500" />
                                <Text color="gray.500" fontSize="sm">
                                    Loading workflows...
                                </Text>
                            </VStack>
                        ) : workflows && workflows.length > 0 ? (
                            workflows.map((workflow) => (
                                <WorkflowCard
                                    {...{
                                        ...workflow,
                                        changeStatus: changeStatus,
                                    }}
                                    key={workflow.id}
                                />
                            ))
                        ) : (
                            <VStack gap={3} py={8}>
                                <Text color="gray.500" fontSize="sm">
                                    No workflows available
                                </Text>
                                <Text
                                    fontSize="xs"
                                    color="gray.400"
                                    textAlign="center"
                                >
                                    Create your first workflow to get started
                                </Text>
                            </VStack>
                        )}
                    </VStack>
                </Box>

                <Box flex={1} bg="white" overflowY="auto">
                    {hasNestedRoute ? (
                        <Outlet />
                    ) : (
                        <VStack gap={4} py={12} justify="center" h="full">
                            <Text color="gray.500" fontSize="lg">
                                Select a workflow
                            </Text>
                            <Text
                                color="gray.400"
                                fontSize="sm"
                                textAlign="center"
                            >
                                Choose a workflow from the left panel to view
                            </Text>
                        </VStack>
                    )}
                </Box>
            </Flex>
        </VStack>
    );
};
