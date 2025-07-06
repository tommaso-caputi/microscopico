# Microscopico

Microscopico è un progetto che integra una dashboard web, un server backend e un sistema di raccolta dati tramite Arduino. L'obiettivo è monitorare e visualizzare in tempo reale dati provenienti da sensori (ad esempio temperatura, umidità, ecc.) raccolti da una scheda Arduino, inviati a un server e visualizzati tramite una dashboard moderna e interattiva.

Il progetto è suddiviso in tre parti principali:
- **arduino/**: contiene il codice per la raccolta dati dai sensori tramite Arduino.
- **server/**: gestisce la ricezione, l'elaborazione e la distribuzione dei dati raccolti.
- **dashboard/**: applicazione web per la visualizzazione e l'analisi dei dati in tempo reale.

Di seguito trovi maggiori dettagli su ciascuna componente e su come utilizzare il progetto.

# Guida all'avvio del server per Arduino

Segui questi passaggi per configurare e avviare il server che comunica con Arduino Uno:

1. **Apri l'IDE di Arduino**
   - Avvia l'applicazione Arduino IDE sul tuo computer.

2. **Individua la porta seriale dell'Arduino Uno**
   - Collega l'Arduino Uno al computer tramite USB.
   - Nell'IDE di Arduino, vai su `Strumenti` > `Porta` e annota il nome della porta seriale associata ad Arduino (es. `/dev/cu.usbmodem11201` su Mac, `COM3` su Windows, ecc.).

3. **Apri il file `server.js`**
   - Vai nella cartella `server` del progetto.
   - Apri il file `server.js` con un editor di testo.

4. **Modifica la variabile della porta seriale**
   - Trova la seguente riga nel file:
     ```js
     path: '/dev/cu.usbmodem11201', // DA CAMBIARE LA PARTE DELLE ULTIME CIFRE
     ```
   - Sostituisci il valore di `path` con quello della tua porta seriale individuata al punto 2.

5. **Avvia lo script di start**
   - Dal terminale, posizionati nella cartella principale del progetto.
   - Esegui il comando:
     ```sh
     ./start.sh
     ```

## Installazione e configurazione di ngrok

ngrok è uno strumento che permette di esporre localmente un server su Internet tramite un tunnel sicuro. È utile per testare servizi in locale accessibili dall'esterno (ad esempio, per testare webhook o dashboard).

### Installazione

#### Su macOS (Homebrew):
```sh
brew install --cask ngrok
```

#### Su Linux:
Scarica l'ultima versione da [ngrok.com/download](https://ngrok.com/download) e segui le istruzioni per il tuo sistema operativo.

#### Su Windows:
Scarica l'eseguibile da [ngrok.com/download](https://ngrok.com/download) e aggiungilo al PATH.

### Configurazione

1. **Crea un account su [ngrok.com](https://ngrok.com/)** e copia il tuo authtoken personale.
2. **Configura ngrok con il tuo authtoken:**
   ```sh
   ngrok config add-authtoken <TUO_AUTHTOKEN>
   ```

### Note
- Il link pubblico fornito da ngrok sarà accessibile da Internet finché il tunnel è attivo.
- Puoi consultare la dashboard web di ngrok su [http://localhost:4040](http://localhost:4040) per vedere le richieste in tempo reale.

## Configurazione del path per Node.js e dominio statico ngrok

Nel file `start.sh` puoi specificare:
- Il percorso assoluto dello script Node.js da avviare (variabile `NODE_SCRIPT`)
- Il dominio statico riservato di ngrok (variabile `DOMAIN`)
- La porta su cui gira il server (variabile `PORT`)

Esempio di configurazione all'inizio di `start.sh`:

```sh
# ⚙️ Configurazione: specifica qui il path del tuo script Node.js e il dominio statico di ngrok
# Modifica NODE_SCRIPT con il percorso assoluto del tuo file server.js
NODE_SCRIPT="/Users/tommasocaputi/Desktop/Projects/microscopico/server/server.js"
# Modifica DOMAIN con il tuo dominio statico riservato di ngrok (es: panda-solid-globally.ngrok-free.app)
DOMAIN="panda-solid-globally.ngrok-free.app"
# Modifica PORT se necessario
PORT=3001
```

Assicurati di aggiornare questi valori in base al tuo ambiente e al dominio statico che hai riservato su ngrok.
