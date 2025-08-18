import { Box, Spinner, Text, VStack, useToken } from "@chakra-ui/react";
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

import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { buildGraphFromWorkflow } from "./build-graph-from-workflow";
import { useWorkflow } from "./use-workflow";
import { WorkflowNode } from "./WorkflowNode";

export const Workflow = () => {
    const { id } = useParams<{ id: string }>();
    const { workflow, loading } = useWorkflow(id);

    // pull Chakra colors
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

    useEffect(() => {
        setNodes(initialGraph.nodes);
        setEdges(initialGraph.edges);
    }, [initialGraph.nodes, initialGraph.edges, setNodes, setEdges]);

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
        <Box h="full" w="full">
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={{ custom: WorkflowNode }}
                    fitViewOptions={{ padding: 0.2 }}
                    nodesDraggable
                    fitView
                    defaultEdgeOptions={{
                        type: "smoothstep",
                        animated: true,
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            width: 20,
                            height: 20,
                        },
                        style: { strokeWidth: 2, stroke: blue500 },
                    }}
                >
                    <Background gap={22} size={1} color={gray200} />
                    <Controls showInteractive={false} position="bottom-right" />
                </ReactFlow>
            </ReactFlowProvider>
        </Box>
    );
};
