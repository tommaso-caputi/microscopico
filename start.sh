# ✅ Controllo se Node.js è installato
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Errore: Node.js non è installato. Per favore installa Node.js per continuare."
  exit 1
fi

# ✅ Controllo se ngrok è installato
if ! command -v ngrok >/dev/null 2>&1; then
  echo "❌ Errore: ngrok non è installato. Per favore installa ngrok per continuare."
  exit 1
fi

# ✅ Controllo se l'authtoken di ngrok è impostato
if ! ngrok config check 2>&1 | grep -q 'ok'; then
  echo "❌ Errore: l'authtoken di ngrok non è impostato. Esegui 'ngrok config add-authtoken <TUO_AUTHTOKEN>' per impostarlo."
  exit 1
fi

# Modifica NODE_SCRIPT con il percorso assoluto del tuo file server.js
NODE_SCRIPT=""
# Modifica DOMAIN con il tuo dominio statico riservato di ngrok
DOMAIN=""
# Modifica PORT se necessario
PORT=3001

# 🚀 Avvio del server Node.js
echo "🟢 Avvio del server Node.js sulla porta $PORT..."
node "$NODE_SCRIPT" &
NODE_PID=$!

# ⏳ Attendo l'avvio del server
sleep 2

# 🌐 Avvio del tunnel ngrok con dominio riservato
echo "\n🟣 Avvio del tunnel ngrok con dominio riservato: https://$DOMAIN ..."
ngrok http --domain=$DOMAIN $PORT > /dev/null &
NGROK_PID=$!

sleep 3

echo "\n✅ Server disponibile all'indirizzo: https://$DOMAIN"

echo "\n🔴 Premi Ctrl+C per fermare tutto."

# 🧹 Pulizia all'uscita
trap "\necho '🛑 Arresto dei processi...'; kill -0 $NODE_PID 2>/dev/null && kill $NODE_PID; kill -0 $NGROK_PID 2>/dev/null && kill $NGROK_PID" EXIT
wait $NODE_PID
