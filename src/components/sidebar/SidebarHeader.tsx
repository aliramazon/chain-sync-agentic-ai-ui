import { Box, Heading, HStack } from "@chakra-ui/react";

export const SidebarHeader = () => {
    return (
        <Box p={6} borderBottom="1px solid" borderColor="gray.200">
            <HStack justify="space-between" mb={4}>
                <Heading size="md">ChainSync</Heading>
            </HStack>
        </Box>
    );
};
