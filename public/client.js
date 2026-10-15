const socket = io();
let nom = null;

io.on('connection', (socket) => {
  console.log('Client connectat:', socket.id);

  socket.on('chat:send', (data) => {
    // La validació completa la afegirem al pas 6
    io.emit('chat:message', {
      nom: data.nom,
      text: data.text,
      hora: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('Client desconnectat:', socket.id);
  });
});
// Formulari d'entrada
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