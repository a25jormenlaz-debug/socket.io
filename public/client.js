const socket = io();
let nom = null;

// Actualitza l'indicador d'estat i bloqueja o desbloqueja l'enviament
function actualitzarEstat(connectat) {
  const estat = document.getElementById('estat');

  if (connectat) {
    estat.textContent = 'Connectat';
    estat.className = 'estat connectat';
  } else {
    estat.textContent = 'Desconnectat';
    estat.className = 'estat desconnectat';
  }

  document.getElementById('btnEnviar').disabled = !connectat;
}

// Al carregar la pàgina encara no hi ha connexió: bloquegem el botó
document.getElementById('btnEnviar').disabled = !socket.connected;

socket.on('connect', () => {
  console.log('Connectat', socket.id);
  actualitzarEstat(true);
});

socket.on('disconnect', () => {
  console.log('Desconnectat');
  actualitzarEstat(false);
});

document.getElementById('formEntrada').addEventListener('submit', (event) => {
  event.preventDefault();

  const valor = document.getElementById('inputNom').value.trim();
  const error = document.getElementById('errorNom');

  if (valor === '') {
    error.textContent = 'El nom no pot estar buit.';
    return;
  }
  if (valor.length > 20) {
    error.textContent = 'El nom no pot tenir més de 20 caràcters.';
    return;
  }

  error.textContent = '';
  nom = valor;

  document.getElementById('nomUsuari').textContent = nom;
  document.getElementById('formEntrada').classList.add('hidden');
  document.getElementById('xat').classList.remove('hidden');
});

document.getElementById('formEnviar').addEventListener('submit', (event) => {
  event.preventDefault();

  if (!socket.connected || nom === null) return;

  const input = document.getElementById('inputText');
  const text = input.value.trim();
  if (text === '') return;

  socket.emit('chat:send', { nom, text });
  input.value = '';
});


socket.on('chat:message', (msg) => {
  const llista = document.getElementById('missatges');

  const li = document.createElement('li');
  li.className = 'missatge';

  const emissor = document.createElement('span');
  emissor.className = 'emissor';
  emissor.textContent = msg.nom;

  const hora = document.createElement('span');
  hora.className = 'hora';
  hora.textContent = new Date(msg.hora).toLocaleTimeString('ca-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const text = document.createElement('div');
  text.className = 'text';
  text.textContent = msg.text;

  li.append(emissor, hora, text);
  llista.append(li);

  // Baixar el scroll fins al darrer missatge
  llista.scrollTop = llista.scrollHeight;
});


socket.on('chat:error', (error) => {
  console.warn('El servidor ha rebutjat el missatge:', error);
});