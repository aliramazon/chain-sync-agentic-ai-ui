import { Box, Icon, Text } from "@chakra-ui/react";
import type { ElementType } from "react";
import { NavLink } from "react-router-dom";

export interface SidebarNavItemProps {
    to: string;
    icon: ElementType;
    label: string;
}

export const SidebarNavItem = ({ to, icon, label }: SidebarNavItemProps) => {
    return (
        <NavLink to={to} style={{ textDecoration: "none" }}>
            {({ isActive }) => (
                <Box
                    px={4}
                    py={3}
                    mx={3}
                    borderRadius="xl"
                    bg={isActive ? "blue.500" : "transparent"}
                    color={isActive ? "white" : "inherit"}
                    _hover={{
                        bg: isActive ? "blue.600" : "gray.100",
                        transform: "translateX(4px)",
                        shadow: "md",
                    }}
                    position="relative"
                    transition="all 0.2s ease"
                    display="flex"
                    alignItems="center"
                    gap={4}
                    _before={
                        isActive
                            ? {
                                  content: '""',
                                  position: "absolute",
                                  left: "-12px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  width: "4px",
                                  height: "60%",
                                  bg: "blue.500",
                                  borderRadius: "0 2px 2px 0",
                              }
                            : undefined
                    }
                >
                    <Icon as={icon} boxSize={5} />
                    <Text fontWeight="medium" fontSize="sm">
                        {label}
                    </Text>
                </Box>
            )}
        </NavLink>
    );
};
