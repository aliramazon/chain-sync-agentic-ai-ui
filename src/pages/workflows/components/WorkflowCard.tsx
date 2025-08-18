import {
    Badge,
    Card,
    HStack,
    IconButton,
    Menu,
    Portal,
    Text,
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import type { Workflow } from "../../../types";
import { formatDate } from "../../../utils/format-date";

interface WorkflowCardProps extends Workflow {
    changeStatus: (id: string, status: "activate" | "deactivate") => void;
}

export const WorkflowCard = ({
    isActive,
    description,
    _count,
    createdAt,
    name,
    id,
    changeStatus,
}: WorkflowCardProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if this workflow is the currently active route
    const isCurrentRoute = location.pathname === `/workflows/${id}`;

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

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleToggleActivation = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isActive) {
            changeStatus(id, "deactivate");
        } else {
            console.log(`Activate workflow ${id}`);
            changeStatus(id, "activate");
        }
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        // Prevent card click when clicking menu
        e.stopPropagation();
    };

    return (
        <Card.Root
            cursor="pointer"
            _hover={{ bg: isCurrentRoute ? "blue.100" : "blue.50" }}
            bg={isCurrentRoute ? "blue.50" : "white"}
            borderColor={isCurrentRoute ? "blue.200" : "gray.200"}
            borderWidth={isCurrentRoute ? "2px" : "1px"}
        >
            <Card.Body gap={2} p={3} onClick={() => handleWorkflowClick(id)}>
                <HStack justify="space-between" align="start">
                    <Text
                        fontSize="md"
                        fontWeight="medium"
                        flex={1}
                        lineHeight="1.3"
                        maxHeight="2.6em"
                        overflow="hidden"
                        pr={2}
                    >
                        {name}
                    </Text>
                    <HStack gap={1} flexShrink={0} minW="fit-content">
                        {getStatusBadge(isActive)}
                        <Menu.Root positioning={{ placement: "bottom-end" }}>
                            <Menu.Trigger asChild>
                                <IconButton
                                    variant="ghost"
                                    size="xs"
                                    onClick={handleMenuClick}
                                    aria-label="Workflow options"
                                    w={6}
                                    h={6}
                                    minW={6}
                                    opacity={0.7}
                                    _hover={{ opacity: 1, bg: "gray.100" }}
                                >
                                    <HiDotsVertical size={14} />
                                </IconButton>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        <Menu.Item
                                            value="toggle-activation"
                                            onClick={handleToggleActivation}
                                        >
                                            {isActive
                                                ? "Deactivate"
                                                : "Activate"}
                                        </Menu.Item>
                                        <Menu.Item
                                            value="delete"
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </HStack>
                </HStack>

                <Text
                    fontSize="sm"
                    color="gray.600"
                    lineHeight="1.2"
                    maxHeight="2.4em"
                    overflow="hidden"
                >
                    {description || "No description"}
                </Text>

                <HStack justify="space-between" mt={2}>
                    <Text fontSize="sm" color="gray.900">
                        {_count.steps}
                    </Text>
                    <Text fontSize="sm" color="gray.900">
                        {formatDate(createdAt, true)}
                    </Text>
                </HStack>
            </Card.Body>
        </Card.Root>
    );
};
