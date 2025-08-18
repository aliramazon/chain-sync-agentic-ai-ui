import {
    Box,
    Button,
    Flex,
    Heading,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toaster } from "../../components/toaster/Toaster";
import { changeWorkflowStatus } from "../../services/workflows/change-workflow-status";
import { deleteWorkflow as deleteWorkflowService } from "../../services/workflows/delete-workflow";
import { getAllWorkflows } from "../../services/workflows/get-all-workflows";
import type { Workflow } from "../../types";
import { CreateWorkflowModal } from "./components/CreateWorkflowModal";
import { WorkflowCard } from "./components/WorkflowCard";

export const Workflows = () => {
    const [workflows, setWorkflows] = useState<Workflow[] | null>(null);
    const [fetchingWorkflows, setFetchingWorkflows] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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

    const deleteWorkflow = async (id: string) => {
        try {
            await deleteWorkflowService(id);

            // Remove the workflow from local state
            setWorkflows(
                (prevWorkflows) =>
                    prevWorkflows?.filter((workflow) => workflow.id !== id) ||
                    null
            );

            toaster.create({
                title: "Workflow Deleted",
                description: "Workflow has been deleted successfully.",
                type: "success",
                duration: 3000,
            });

            // If currently viewing the deleted workflow, redirect to workflows list
            if (location.pathname === `/workflows/${id}`) {
                navigate("/workflows");
            }
        } catch (error) {
            console.error("Failed to delete workflow:", error);
            toaster.create({
                title: "Failed to Delete Workflow",
                description:
                    error instanceof Error
                        ? error.message
                        : "Could not delete workflow. Please try again.",
                type: "error",
                duration: 4000,
            });
        }
    };

    const handleCreateWorkflow = () => {
        setIsCreateModalOpen(true);
    };

    const handleWorkflowCreated = (workflow: Workflow) => {
        // Add the new workflow to local state
        setWorkflows((prevWorkflows) =>
            prevWorkflows ? [workflow, ...prevWorkflows] : [workflow]
        );

        // Show success toast
        toaster.create({
            title: "Workflow Created",
            description: `Workflow "${workflow.name}" has been created successfully.`,
            type: "success",
            duration: 3000,
        });

        // Navigate to the new workflow
        navigate(`/workflows/${workflow.id}`);
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
    };

    return (
        <VStack align="stretch" gap={6}>
            <Flex justify="space-between" align="center">
                <Heading size="lg">Workflows</Heading>
                <Button colorPalette="blue" onClick={handleCreateWorkflow}>
                    Create Workflow
                </Button>
            </Flex>
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
                                        deleteWorkflow: deleteWorkflow,
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

            <CreateWorkflowModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                onWorkflowCreated={handleWorkflowCreated}
            />
        </VStack>
    );
};
