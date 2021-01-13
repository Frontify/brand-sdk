import { SocketMessageType } from "./SocketMessageType";

export interface SocketMessage {
    message: SocketMessageType;
    data: unknown;
}
