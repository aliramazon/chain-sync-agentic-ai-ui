import { Badge, Box, Card, Spinner, Text, VStack } from "@chakra-ui/react";
import {
    Background,
    Controls,
    type Edge,
    Handle,
    MarkerType,
    MiniMap,
    type Node,
    Position,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toaster } from "../../components/toaster/Toaster";
import { getWorkflow } from "../../services/workflows/get-workflow";
import { type Workflow as WorkflowType } from "../../types";

/** ---- Layout constants ---- */
const NODE_WIDTH = 520;
const NODE_HEIGHT = 220;
const RANK_SEP = 80; // vertical gap (TB)
const NODE_SEP = 60; // horizontal gap (TB)
const EDGE_SEP = 30;

/** ---- Dagre helper ---- */
function layoutWithDagre(
    nodes: Node[],
    edges: Edge[],
    direction: "TB" | "LR" = "TB"
) {
    const g = new dagre.graphlib.Graph();
    g.setGraph({
        rankdir: direction,
        ranksep: RANK_SEP,
        nodesep: NODE_SEP,
        edgesep: EDGE_SEP,
    });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((n) =>
        g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
    );
    edges.forEach((e) => g.setEdge(e.source, e.target));

    dagre.layout(g);

    const laidOutNodes: Node[] = nodes.map((n) => {
        const { x, y } = g.node(n.id);
        return {
            ...n,
            position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
            style: { width: NODE_WIDTH, height: NODE_HEIGHT },
        };
    });

    return { nodes: laidOutNodes, edges };
}

/** ---- Custom Node with handles ---- */
const CustomNode = ({ data }: { data: any }) => (
    <Card.Root
        bg="white"
        borderRadius="md"
        shadow="lg"
        border="2px solid"
        minW={`${NODE_WIDTH}px`}
        maxW={`${NODE_WIDTH}px`}
        h={`${NODE_HEIGHT}px`}
        borderColor={data.type === "trigger" ? "orange.200" : "blue.200"}
        overflow="hidden"
    >
        <Handle
            type="target"
            position={Position.Top}
            style={{ width: 10, height: 10 }}
        />
        <Card.Body p={4}>
            <VStack align="start" gap={2}>
                <Badge
                    colorPalette={data.type === "trigger" ? "orange" : "blue"}
                    size="sm"
                    variant="solid"
                >
                    {data.type?.toUpperCase() ?? "ACTION"}
                </Badge>
                <Text fontSize="2xl" fontWeight="semibold" lineHeight="1.2">
                    {data.title ?? "Untitled step"}
                </Text>
                <Text fontSize="lg" color="gray.600" lineHeight="1.3">
                    {data.description ?? "No description"}
                </Text>
                <Text fontSize="md" color="gray.500" fontWeight="semibold" f>
                    {data.connector ?? "Unknown Connector"}
                </Text>
            </VStack>
        </Card.Body>
        <Handle
            type="source"
            position={Position.Bottom}
            style={{ width: 10, height: 10 }}
        />
    </Card.Root>
);

export const Workflow = () => {
    const { id } = useParams<{ id: string }>();
    const [workflow, setWorkflow] = useState<WorkflowType | null>(null);
    const [loading, setLoading] = useState(true);

    // Use controlled state so drag updates persist in React state
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    // Gate rendering until we have laid-out positions (prevents initial overlap)
    const [layoutReady, setLayoutReady] = useState(false);

    // Prevent re-layout after user drags; flip this when topology (steps) changes
    const didInitialLayoutRef = useRef(false);

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

    useEffect(() => {
        if (!id) return;
        let canceled = false;
        setLoading(true);
        setLayoutReady(false);
        didInitialLayoutRef.current = false;

        getWorkflow(id)
            .then((data) => {
                if (canceled) return;
                setWorkflow(data);

                if (!data?.steps?.length) {
                    setNodes([]);
                    setEdges([]);
                    setLayoutReady(true);
                    return;
                }

                // Deterministic order
                const sorted = [...data.steps].sort(
                    (a, b) => a.stepOrder - b.stepOrder
                );

                // Temporary spaced positions to avoid overlap if you decide to render early
                const provisionalNodes: Node[] = sorted.map((step, i) => ({
                    id: step.externalId,
                    type: "custom",
                    position: { x: 0, y: i * (NODE_HEIGHT + 24) }, // provisional; replaced by dagre below
                    data: {
                        actionKey: step.action?.key ?? "",
                        title: step.action?.title ?? "Unknown Action",
                        type: step.action?.type ?? "action",
                        description:
                            step.description ??
                            step.action?.description ??
                            "No description",
                        connector: step.connector?.name ?? "Unknown Connector",
                    },
                }));

                const nodeIdSet = new Set(provisionalNodes.map((n) => n.id));
                const hasDependsOn = sorted.some((s) => s.dependsOn?.length);
                const provisionalEdges: Edge[] = [];

                if (hasDependsOn) {
                    for (const step of sorted) {
                        for (const dep of step.dependsOn ?? []) {
                            if (
                                nodeIdSet.has(dep) &&
                                nodeIdSet.has(step.externalId)
                            ) {
                                provisionalEdges.push({
                                    id: `edge-${dep}-${step.externalId}`,
                                    source: dep,
                                    target: step.externalId,
                                    type: "smoothstep",
                                    animated: true,
                                    markerEnd: {
                                        type: MarkerType.ArrowClosed,
                                        width: 20,
                                        height: 20,
                                    },
                                    style: {
                                        strokeWidth: 2,
                                        stroke: "#3182ce",
                                    },
                                });
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < sorted.length - 1; i++) {
                        const a = sorted[i].externalId;
                        const b = sorted[i + 1].externalId;
                        provisionalEdges.push({
                            id: `edge-${a}-${b}`,
                            source: a,
                            target: b,
                            type: "smoothstep",
                            animated: true,
                            markerEnd: {
                                type: MarkerType.ArrowClosed,
                                width: 20,
                                height: 20,
                            },
                            style: { strokeWidth: 2, stroke: "#3182ce" },
                        });
                    }
                }

                // One-time layout before first render
                const { nodes: laidOutNodes, edges: laidOutEdges } =
                    layoutWithDagre(provisionalNodes, provisionalEdges, "TB");

                setNodes(laidOutNodes);
                setEdges(laidOutEdges);
                didInitialLayoutRef.current = true;
                setLayoutReady(true);
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
    }, [id, setEdges, setNodes]);

    if (loading || !layoutReady) {
        return (
            <VStack gap={4} py={12} justify="center" h="full">
                <Spinner size="lg" color="blue.500" />
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
                    nodeTypes={nodeTypes}
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
                        style: { strokeWidth: 2, stroke: "#3182ce" },
                    }}
                >
                    <Background gap={22} size={1} color="#e2e8f0" />
                    <Controls showInteractive={false} position="bottom-right" />
                    <MiniMap
                        nodeColor={() => "#3182ce"}
                        maskColor="rgba(0,0,0,0.06)"
                        position="top-right"
                    />
                </ReactFlow>
            </ReactFlowProvider>
        </Box>
    );
};
