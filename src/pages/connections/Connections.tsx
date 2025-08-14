import {
    Badge,
    Button,
    Card,
    Grid,
    Heading,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toaster } from "../../components/toaster/Toaster";
import { connectConnector } from "../../services/connectors/connect-connector";
import { disconnectConnector } from "../../services/connectors/disconnect-connector";
import { getConnectors } from "../../services/connectors/get-connectors";
import { ConnectorStatus, type Connector } from "../../types";

export const Connections = () => {
    const [connectors, setConnectors] = useState<Connector[] | null>(null);
    const [buttonLoading, setButtonLoading] = useState<string | null>(null);
    const [fetchingConnectors, setFetchingConnectors] = useState(true);

    useEffect(() => {
        setFetchingConnectors(true);
        getConnectors()
            .then((data) => {
                setConnectors(data);
            })
            .catch((error) => {
                console.error("Failed to fetch connectors:", error);
                toaster.create({
                    title: "Failed to Load Connectors",
                    description:
                        "Could not fetch connectors. Please try again.",
                    type: "error",
                    duration: 4000,
                });
            })
            .finally(() => {
                setFetchingConnectors(false);
            });
    }, []);

    const handleConnect = (connectorId: string, connectorName: string) => {
        setButtonLoading(connectorId);
        connectConnector(connectorId)
            .then((updatedConnector) => {
                setConnectors(
                    (prev) =>
                        prev?.map((connector) =>
                            connector.id === connectorId
                                ? updatedConnector
                                : connector
                        ) || null
                );
                toaster.create({
                    title: "Connected Successfully",
                    description: `${connectorName} has been connected successfully.`,
                    type: "success",
                    duration: 4000,
                });
            })
            .catch((error) => {
                console.error("Failed to connect connector:", error);
                toaster.create({
                    title: "Connection Failed",
                    description: `Failed to connect ${connectorName}. ${
                        error.message || "Please try again."
                    }`,
                    type: "error",
                    duration: 4000,
                });
            })
            .finally(() => {
                setButtonLoading(null);
            });
    };

    const handleDisconnect = (connectorId: string, connectorName: string) => {
        setButtonLoading(connectorId);
        disconnectConnector(connectorId)
            .then((updatedConnector) => {
                setConnectors(
                    (prev) =>
                        prev?.map((connector) =>
                            connector.id === connectorId
                                ? updatedConnector
                                : connector
                        ) || null
                );
                toaster.create({
                    title: "Disconnected Successfully",
                    description: `${connectorName} has been disconnected successfully.`,
                    type: "success",
                    duration: 4000,
                });
            })
            .catch((error) => {
                console.error("Failed to disconnect connector:", error);
                toaster.create({
                    title: "Disconnection Failed",
                    description: `Failed to disconnect ${connectorName}. ${
                        error.message || "Please try again."
                    }`,
                    type: "error",
                    duration: 4000,
                });
            })
            .finally(() => {
                setButtonLoading(null);
            });
    };

    const getStatusBadge = (status: ConnectorStatus) => {
        switch (status) {
            case ConnectorStatus.CONNECTED:
                return <Badge colorPalette="green">Connected</Badge>;
            case ConnectorStatus.NOT_CONNECTED:
                return <Badge colorPalette="gray">Not Connected</Badge>;
            case ConnectorStatus.DISCONNECTED:
                return <Badge colorPalette="red">Disconnected</Badge>;
            default:
                return <Badge colorPalette="gray">Unknown</Badge>;
        }
    };

    const getDescription = (name: string) => {
        const descriptions: Record<string, string> = {
            NetSuite:
                "Enterprise resource planning (ERP) and accounting software for business management.",
            Shippo: "Multi-carrier shipping API for e-commerce businesses and marketplaces.",
            Shopify:
                "E-commerce platform for online stores and retail point-of-sale systems.",
            Stripe: "Payment processing platform for online and mobile commerce transactions.",
            Zendesk:
                "Customer service software and support ticket system for help desks.",
            Salesforce:
                "Customer relationship management (CRM) platform for sales and marketing.",
        };
        return (
            descriptions[name] ||
            "Integration connector for business automation."
        );
    };

    return (
        <VStack align="stretch" gap={6}>
            <Heading size="lg">Connectors</Heading>

            {fetchingConnectors ? (
                <VStack gap={4} py={8}>
                    <Spinner size="lg" color="blue.500" />
                    <Text color="gray.500">Loading connectors...</Text>
                </VStack>
            ) : connectors ? (
                <Grid
                    templateColumns={{
                        base: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                    }}
                    gap={6}
                >
                    {connectors.map((connector) => {
                        return (
                            <Card.Root
                                key={connector.id || connector.name}
                                maxWidth="320px"
                            >
                                <Card.Body gap={3}>
                                    <Card.Title
                                        mt="2"
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        {connector.name}
                                        {getStatusBadge(connector.status)}
                                    </Card.Title>
                                    <Text
                                        fontSize="sm"
                                        color="gray.600"
                                        lineHeight="1.4"
                                    >
                                        {getDescription(connector.name)}
                                    </Text>
                                </Card.Body>
                                <Card.Footer justifyContent="flex-end">
                                    {connector.status ===
                                    ConnectorStatus.CONNECTED ? (
                                        <Button
                                            variant="outline"
                                            loading={
                                                buttonLoading === connector.id
                                            }
                                            onClick={() =>
                                                handleDisconnect(
                                                    connector.id,
                                                    connector.name
                                                )
                                            }
                                        >
                                            Disconnect
                                        </Button>
                                    ) : (
                                        <Button
                                            colorPalette={"blue"}
                                            loading={
                                                buttonLoading === connector.id
                                            }
                                            onClick={() =>
                                                handleConnect(
                                                    connector.id,
                                                    connector.name
                                                )
                                            }
                                        >
                                            Connect
                                        </Button>
                                    )}
                                </Card.Footer>
                            </Card.Root>
                        );
                    })}
                </Grid>
            ) : (
                <VStack gap={4} py={8}>
                    <Text color="gray.500">No connectors available</Text>
                </VStack>
            )}
        </VStack>
    );
};
