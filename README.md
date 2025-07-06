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
