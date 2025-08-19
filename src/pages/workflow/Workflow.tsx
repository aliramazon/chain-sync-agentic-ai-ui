import {
    Box,
    Button,
    Flex,
    Spinner,
    Text,
    VStack,
    useToken,
} from "@chakra-ui/react";
import {
    Background,
    Controls,
    type Edge,
    MarkerType,
    type Node,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toaster } from "../../components/toaster/Toaster";
import { runWorkflowWithSyntheticData } from "../../services/workflows/run-workflow-with-synthetic-data";

import { buildGraphFromWorkflow } from "./build-graph-from-workflow";
import { useWorkflow } from "./use-workflow";
import { WorkflowChat } from "./WorkflowChat";
import { WorkflowNode } from "./WorkflowNode";

export const Workflow = () => {
    const { id } = useParams<{ id: string }>();
    const { workflow, loading } = useWorkflow(id);

    // theme colors
    const [blue500, gray200] = useToken("colors", ["blue.500", "gray.200"]);

    const initialGraph = useMemo(
        () => buildGraphFromWorkflow(workflow),
        [workflow]
    );
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
        initialGraph.nodes
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
        initialGraph.edges
    );

    const [isRunning, setIsRunning] = useState(false);
    const [chatInputValue, setChatInputValue] = useState("");

    useEffect(() => {
        setNodes(initialGraph.nodes);
        setEdges(initialGraph.edges);
    }, [initialGraph.nodes, initialGraph.edges, setNodes, setEdges]);

    const handleRunWorkflow = async () => {
        if (!workflow?.id || isRunning) return;

        try {
            setIsRunning(true);

            const result = await runWorkflowWithSyntheticData(workflow.id);

            toaster.success({
                title: "Workflow executed",
                description:
                    result.message ?? "Workflow ran with synthetic data",

                duration: 4000,
            });
        } catch (err) {
            console.error(err);

            toaster.error({
                title: "Workflow failed",
                description:
                    err instanceof Error ? err.message : "Something went wrong",
                duration: 4000,
            });
        } finally {
            setIsRunning(false);
        }
    };

    const onChatValueChange = (value: string) => {
        setChatInputValue(value);
    };

    const sendUserIntent = () => {
        console.log("Send: ", chatInputValue);
        setChatInputValue("");
    };

    if (loading) {
        return (
            <VStack gap={4} py={12} justify="center" h="full">
                <Spinner size="lg" color={blue500} />
                <Text color="gray.500">Preparing layout…</Text>
            </VStack>
        );
    }

    if (!workflow) {
        return (
            <VStack gap={4} py={12} justify="center" h="full">
                <Text color="gray.500" fontSize="lg">
                    Workflow not found
                </Text>
            </VStack>
        );
    }

    if (nodes.length === 0) {
        return (
            <VStack gap={4} py={12} justify="center" h="full">
                <Text color="gray.500" fontSize="lg">
                    No workflow steps found
                </Text>
                <Text color="gray.400" fontSize="sm">
                    This workflow does not have any steps configured.
                </Text>
            </VStack>
        );
    }

    return (
        <Box h="full" w="full" padding={4}>
            <VStack h="full" w="full" align="stretch" gap={6}>
                <Flex align="center" justify="flex-end">
                    <Button
                        onClick={handleRunWorkflow}
                        loading={isRunning}
                        loadingText="Running…"
                        colorScheme="blue"
                        size="sm"
                        colorPalette="blue"
                    >
                        Run Workflow
                    </Button>
                </Flex>

                <Box
                    flex="1 1 auto"
                    minH="0"
                    h="full"
                    w="full"
                    position="relative"
                >
                    <ReactFlowProvider>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            nodeTypes={{ custom: WorkflowNode }}
                            fitView
                            fitViewOptions={{ padding: 0.2 }}
                            nodesDraggable
                            defaultEdgeOptions={{
                                type: "smoothstep",
                                animated: true,
                                markerEnd: {
                                    type: MarkerType.ArrowClosed,
                                    width: 20,
                                    height: 20,
                                },
                                style: {
                                    strokeWidth: 2,
                                    stroke: blue500,
                                },
                            }}
                        >
                            <Background gap={22} size={1} color={gray200} />
                            <Controls
                                showInteractive={false}
                                position="bottom-right"
                            />
                        </ReactFlow>
                    </ReactFlowProvider>

                    <WorkflowChat
                        onChange={onChatValueChange}
                        value={chatInputValue}
                        onSend={sendUserIntent}
                    />
                </Box>
            </VStack>
        </Box>
    );
};
