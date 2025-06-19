# Configuration
PORT=3001
NODE_SCRIPT="server/server.js"
DOMAIN="panda-solid-globally.ngrok-free.app"

# Start Node.js server
echo "Starting Node.js server on port $PORT..."
node "$NODE_SCRIPT" &
NODE_PID=$!

# Wait for server to start
sleep 2

# Start ngrok with reserved domain
echo "Starting ngrok tunnel with reserved domain: https://$DOMAIN ..."
ngrok http --domain=$DOMAIN $PORT > /dev/null &
NGROK_PID=$!

sleep 3

echo "Server is available at: https://$DOMAIN"

# Cleanup on exit
trap "echo 'Stopping processes...'; kill -0 $NODE_PID 2>/dev/null && kill $NODE_PID; kill -0 $NGROK_PID 2>/dev/null && kill $NGROK_PID" EXIT
wait $NODE_PID
