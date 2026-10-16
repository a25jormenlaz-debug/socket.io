const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const MAX_NOM = 20;
const MAX_TEXT = 500;

// Retorna un text d'error si les dades no són vàlides, o null si tot està bé
function validarMissatge(data) {
  const nom = data?.nom;
  const text = data?.text;

  if (typeof nom !== 'string' || typeof text !== 'string') {
    return 'El nom i el text han de ser cadenes de text.';
  }
  if (nom.trim() === '' || text.trim() === '') {
    return 'El nom i el text no poden estar buits.';
  }
  if (nom.trim().length > MAX_NOM) {
    return `El nom no pot tenir més de ${MAX_NOM} caràcters.`;
  }
  if (text.trim().length > MAX_TEXT) {
    return `El missatge no pot tenir més de ${MAX_TEXT} caràcters.`;
  }
  return null;
}

io.on('connection', (socket) => {
  console.log('Client connectat:', socket.id);

  socket.on('chat:send', (data) => {
    const error = validarMissatge(data);

    if (error) {
      console.log('Missatge rebutjat de', socket.id, '-', error);
      socket.emit('chat:error', error);
      return;
    }

    io.emit('chat:message', {
      nom: data.nom.trim(),
      text: data.text.trim(),
      hora: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('Client desconnectat:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Servidor escoltant al port 3000');
});