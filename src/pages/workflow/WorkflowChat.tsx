import { Box, Flex, IconButton, Input } from "@chakra-ui/react";
import { IoSend } from "react-icons/io5";

interface WorkflowChatProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
}
export const WorkflowChat = ({
    value,
    onChange,
    onSend,
}: WorkflowChatProps) => {
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };
    return (
        <Box
            position="absolute"
            bottom="4"
            left="50%"
            transform="translateX(-50%)"
            zIndex={10}
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.200"
            p="2"
            w="75%"
        >
            <Flex align="center" gap={2}>
                <Input
                    placeholder="Describe changes to make to this workflow..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    size="lg"
                    border="none"
                    _focus={{ boxShadow: "none" }}
                    flex="1"
                />
                <IconButton
                    aria-label="Send workflow change"
                    onClick={onSend}
                    size="md"
                    colorPalette="blue"
                    disabled={!value.trim()}
                >
                    <IoSend />
                </IconButton>
            </Flex>
        </Box>
    );
};
