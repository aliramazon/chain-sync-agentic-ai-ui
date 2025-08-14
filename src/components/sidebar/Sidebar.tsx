import { Box, Separator, Text, VStack } from "@chakra-ui/react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavItem, type SidebarNavItemProps } from "./SidebarNavItem";

interface SidebarProps {
    items: SidebarNavItemProps[];
}

export const Sidebar = ({ items }: SidebarProps) => {
    return (
        <Box
            as="aside"
            w={{ base: "76px", md: "280px" }}
            bg="white"
            borderRight="1px solid"
            borderColor="gray.200"
            shadow="md"
            display="flex"
            flexDirection="column"
        >
            <SidebarHeader />

            <Box p={4}>
                <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.500"
                    mb={4}
                    px={3}
                    textTransform="uppercase"
                    letterSpacing="wider"
                >
                    Main
                </Text>

                <VStack gap={2} align="stretch">
                    {items.map((item) => (
                        <SidebarNavItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                        />
                    ))}
                </VStack>

                <Separator my={6} />
            </Box>
        </Box>
    );
};
