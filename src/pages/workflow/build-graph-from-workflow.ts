import { MarkerType, type Edge, type Node } from "@xyflow/react";
import dagre from "dagre";
import type { Workflow } from "../../types";

const RANK_SEP = 80; // vertical gap (TB)
const NODE_SEP = 60; // horizontal gap (TB)
const EDGE_SEP = 30;
export const NODE_WIDTH = 520;
export const NODE_HEIGHT = 180;

const layoutWithDagre = (
    nodes: Node[],
    edges: Edge[],
    direction: "TB" | "LR" = "TB"
) => {
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
};

export const buildGraphFromWorkflow = (
    data: Workflow | null
): {
    nodes: Node[];
    edges: Edge[];
} => {
    if (!data?.steps?.length) return { nodes: [], edges: [] };

    const sorted = [...data.steps].sort((a, b) => a.stepOrder - b.stepOrder);

    const nodes: Node[] = sorted.map((step, i) => ({
        id: step.externalId,
        type: "custom",
        // temporary position, replaced by dagre:
        position: { x: 0, y: i * (NODE_HEIGHT + 24) },
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

    const idSet = new Set(nodes.map((n) => n.id));
    const hasDependsOn = sorted.some((s) => s.dependsOn?.length);
    const edges: Edge[] = [];

    if (hasDependsOn) {
        for (const step of sorted) {
            for (const dep of step.dependsOn ?? []) {
                if (idSet.has(dep) && idSet.has(step.externalId)) {
                    edges.push({
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
                        style: { strokeWidth: 2, stroke: "#3182ce" },
                    });
                }
            }
        }
    } else {
        for (let i = 0; i < sorted.length - 1; i++) {
            const a = sorted[i].externalId;
            const b = sorted[i + 1].externalId;
            edges.push({
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

    return layoutWithDagre(nodes, edges, "TB");
};
