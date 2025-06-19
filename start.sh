# Check if node is installed
if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is not installed. Please install Node.js to continue."
  exit 1
fi

# Check if ngrok is installed
if ! command -v ngrok >/dev/null 2>&1; then
  echo "Error: ngrok is not installed. Please install ngrok to continue."
  exit 1
fi

# Check if ngrok authtoken is set
if ! ngrok config check 2>&1 | grep -q 'ok'; then
  echo "Error: ngrok authtoken is not set. Please run 'ngrok config add-authtoken <YOUR_AUTHTOKEN>' to set it."
  exit 1
fi

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
