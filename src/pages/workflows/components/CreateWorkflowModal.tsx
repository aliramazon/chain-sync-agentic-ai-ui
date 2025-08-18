import {
    Button,
    DialogActionTrigger,
    DialogBackdrop,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogPositioner,
    DialogRoot,
    DialogTitle,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { createWorkflow } from "../../../services/workflows/create-workflow";
import type { Workflow } from "../../../types";

interface CreateWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWorkflowCreated: (workflow: Workflow) => void;
}

export const CreateWorkflowModal = ({
    isOpen,
    onClose,
    onWorkflowCreated,
}: CreateWorkflowModalProps) => {
    const [prompt, setPrompt] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        if (!isCreating) {
            setPrompt("");
            setError(null);
            onClose();
        }
    };

    const handleCreate = async () => {
        if (!prompt.trim()) {
            setError("Please enter a workflow description");
            return;
        }

        setIsCreating(true);
        setError(null);

        try {
            const result = await createWorkflow(prompt.trim());
            onWorkflowCreated(result.workflow);
            setPrompt("");
            onClose();
        } catch (error) {
            console.error("Failed to create workflow:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create workflow. Please try again."
            );
        } finally {
            setIsCreating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleCreate();
        }
    };

    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={(e) => !e.open && handleClose()}
        >
            <DialogBackdrop />
            <DialogPositioner>
                <DialogContent maxW="lg" bg="white" shadow="xl" mx={4}>
                    <DialogHeader>
                        <DialogTitle>Create New Workflow</DialogTitle>
                        <DialogCloseTrigger disabled={isCreating} />
                    </DialogHeader>

                    <DialogBody p={6}>
                        <VStack align="stretch" gap={4}>
                            <Text fontSize="sm" color="gray.600">
                                Describe what you want your workflow to do in
                                natural language.
                            </Text>

                            <Textarea
                                placeholder="e.g., Send a welcome email to new users and add them to a CRM..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={4}
                                resize="vertical"
                                disabled={isCreating}
                                bg="white"
                            />

                            {error && (
                                <Text color="red.500" fontSize="sm">
                                    {error}
                                </Text>
                            )}
                        </VStack>
                    </DialogBody>

                    <DialogFooter p={6} pt={0}>
                        <DialogActionTrigger asChild>
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                disabled={isCreating}
                                mr={3}
                            >
                                Cancel
                            </Button>
                        </DialogActionTrigger>
                        <Button
                            onClick={handleCreate}
                            loading={isCreating}
                            loadingText="Creating..."
                            disabled={!prompt.trim() || isCreating}
                            colorPalette="blue"
                        >
                            Create Workflow
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>
    );
};
