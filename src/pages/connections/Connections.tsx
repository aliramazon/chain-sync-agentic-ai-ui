import {
    Badge,
    Button,
    Card,
    Grid,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getConnectors } from "../../services/connectors/get-connectors";
import { ConnectorStatus, type Connector } from "../../types";

export const Connections = () => {
    const [connectors, setConnectors] = useState<Connector[] | null>(null);

    useEffect(() => {
        getConnectors().then((data) => {
            setConnectors(data);
        });
    }, []);

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

    return connectors ? (
        <VStack align="stretch" gap={6}>
            <Heading size="lg">Connectors</Heading>

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
                                    <Button variant="outline">
                                        Disconnect
                                    </Button>
                                ) : (
                                    <Button colorPalette={"blue"}>
                                        Connect
                                    </Button>
                                )}
                            </Card.Footer>
                        </Card.Root>
                    );
                })}
            </Grid>
        </VStack>
    ) : null;
};
