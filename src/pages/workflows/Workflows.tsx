import {
    Badge,
    Box,
    Card,
    Flex,
    Heading,
    HStack,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toaster } from "../../components/toaster/Toaster";
import { getAllWorkflows } from "../../services/workflows/get-all-workflows";
import type { Workflow } from "../../types";
import { formatDate } from "../../utils/format-date";

export const Workflows = () => {
    const [workflows, setWorkflows] = useState<Workflow[] | null>(null);
    const [fetchingWorkflows, setFetchingWorkflows] = useState(true);
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

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <Badge colorPalette="green">Active</Badge>
        ) : (
            <Badge colorPalette="gray">Inactive</Badge>
        );
    };

    const handleWorkflowClick = (workflowId: string) => {
        navigate(`/workflows/${workflowId}`);
    };

    return (
        <VStack align="stretch" gap={6}>
            <Heading size="lg">Workflows</Heading>
            <Flex h="calc(100vh - 120px)" gap={0}>
                <Box
                    w="20rem"
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
                                <Card.Root
                                    key={workflow.id}
                                    cursor="pointer"
                                    _hover={{ bg: "gray.100" }}
                                >
                                    <Card.Body
                                        gap={2}
                                        p={3}
                                        onClick={() =>
                                            handleWorkflowClick(workflow.id)
                                        }
                                    >
                                        <HStack
                                            justify="space-between"
                                            align="start"
                                        >
                                            <Text
                                                fontSize="sm"
                                                fontWeight="medium"
                                                flex={1}
                                                lineHeight="1.3"
                                                maxHeight="2.6em"
                                                overflow="hidden"
                                            >
                                                {workflow.name}
                                            </Text>
                                            {getStatusBadge(workflow.isActive)}
                                        </HStack>

                                        <Text
                                            fontSize="xs"
                                            color="gray.600"
                                            lineHeight="1.2"
                                            maxHeight="2.4em"
                                            overflow="hidden"
                                        >
                                            {workflow.description ||
                                                "No description"}
                                        </Text>

                                        <HStack justify="space-between" mt={2}>
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                {workflow._count.steps}
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                {formatDate(
                                                    workflow.createdAt,
                                                    true
                                                )}
                                            </Text>
                                        </HStack>
                                    </Card.Body>
                                </Card.Root>
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
