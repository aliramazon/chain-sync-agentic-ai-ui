import { Badge, Card, Text, VStack } from "@chakra-ui/react";
import { Handle, Position } from "@xyflow/react";
import { NODE_HEIGHT, NODE_WIDTH } from "./build-graph-from-workflow";

export const WorkflowNode = ({ data }: { data: any }) => (
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
                <Text fontSize="md" color="gray.500" fontWeight="semibold">
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
