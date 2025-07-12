import QuantumAPI from '../api/quantum_client.js';

const delay = ms => new Promise(res => setTimeout(res, ms));

const api = new QuantumAPI();

function showMessage(type) {
  const box = document.getElementById('message-box');
  const msg = document.getElementById(`${type}-msg`);

  ['connected-msg', 'disconnected-msg', 'connection-failed-msg', 'code-error-msg'].forEach(id =>
    document.getElementById(id).classList.remove('active')
  );

  msg.classList.add('active');
  box.classList.add('show');

  setTimeout(() => {
    box.classList.remove('show');

    setTimeout(() => {
      msg.classList.remove('active');
    }, 400);
  }, 2000);
}

async function heartbeat() {
  console.log('Connecting...');
  await api.connect();

  let alreadyFailed = false;
  let connected = false;

  while (true) {
    if (connected) {
      const [_, status] = await api.ping();
      if (status !== 200) {
        console.log('Disconnected');
        showMessage('disconnected');
        connected = false;
      }
    }
    else {
      connected = await api.connect();
      if (connected) {
        console.log('Connected');
        showMessage('connected');
        alreadyFailed = false;
      }
      else {
        if (!alreadyFailed) {
          console.log('Failed to connect');
          showMessage('connection-failed');
          alreadyFailed = true;
        }
      }
    }
    
    
    await delay(10000);
  }
}

heartbeat();

export { api };