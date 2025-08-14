import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { App } from "../App";
import { Chat } from "../pages/chat/Chat";
import { Connections } from "../pages/connections/Connections";
import { Workflows } from "../pages/workflows/Workflow";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index element={<Workflows />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="connections" element={<Connections />} />
            <Route path="chat" element={<Chat />} />
        </Route>
    )
);
