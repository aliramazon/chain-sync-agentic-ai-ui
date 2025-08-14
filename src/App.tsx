import styled from "@emotion/styled";
import { Link, Outlet } from "react-router-dom";

const AppLayout = styled.main`
    display: flex;
`;

export const App = () => {
    return (
        <AppLayout>
            <nav
                style={{
                    width: "200px",
                    background: "#f4f4f4",
                    padding: "1rem",
                }}
            >
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li>
                        <Link to="/workflows">Workflows</Link>
                    </li>
                    <li>
                        <Link to="/connections">Connections</Link>
                    </li>
                    <li>
                        <Link to="/chat">Chat</Link>
                    </li>
                </ul>
            </nav>

            <div style={{ flex: 1, padding: "1rem" }}>
                <Outlet />
            </div>
        </AppLayout>
    );
};
