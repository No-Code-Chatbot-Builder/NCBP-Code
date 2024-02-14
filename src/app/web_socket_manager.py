from fastapi import WebSocket

class SocketConnectionManager:
    def __init__(self):
        self.websocket: WebSocket = WebSocket

    async def connect(self, websocket: WebSocket):
        await websocket.accept()

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def stream_message(self, message: str):
        await self.websocket.send_text(message)