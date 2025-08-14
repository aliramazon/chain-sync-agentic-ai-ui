import { Box, Flex } from "@chakra-ui/react";
import { FiLayers, FiLink, FiMessageCircle } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/sidebar/Sidebar";
import type { SidebarNavItemProps } from "./components/sidebar/SidebarNavItem";
import { Toaster } from "./components/toaster/Toaster";

export const App = () => {
    const sidebarItems: SidebarNavItemProps[] = [
        {
            to: "/workflows",
            icon: FiLayers,
            label: "Workflows",
        },
        {
            to: "/connections",
            icon: FiLink,
            label: "Connections",
        },
        {
            to: "/chat",
            icon: FiMessageCircle,
            label: "Chat",
        },
    ];

    return (
        <>
            <Flex h="100vh" bg={["gray.50", null, "gray.100"]}>
                <Sidebar items={sidebarItems} />

                <Box as="main" flex="1" p={{ base: 4, md: 6 }} overflowY="auto">
                    <Outlet />
                </Box>
            </Flex>
            <Toaster />
        </>
    );
};
