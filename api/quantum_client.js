const BASE_URL_ENDPOINT = "https://gist.githubusercontent.com/AJWestley/8cd6b6a60bc82b67dde7895891c53097/raw/pi_url.txt";

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

class QuantumAPI {
  constructor() {
    this._connected = false;
    this._baseUrl = null;
  }

  get connected() {
    return this._connected;
  }

  async connect(retryDelay = 1000, timeout = 5000) {
    this._connected = false;

    for (let i = 0; i < 5; i++) {
      try {
        const url = await getBaseUrl();
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`${url}/ping`, { signal: controller.signal, headers: DEFAULT_HEADERS });
        clearTimeout(id);

        if (response.ok) {
          this._baseUrl = url;
          this._connected = true;
          console.log('Connected', response.text())
          return true;
        }
      } catch (e) {
        // swallow and retry
      }
      await sleep(retryDelay);
    }
    return false;
  }

  async ping() {
    const timeout = 5000;
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${this._baseUrl}/ping`, {
        method: 'GET',
        signal: controller.signal,
        headers: DEFAULT_HEADERS
      });

      clearTimeout(id);
      const data = await response.text();
      return [data, response.status];
    } catch (e) {
      return [{ error: e.message }, 503];
    }
  }

  async execute(qasmScript, shots = 1024) {
    return this._post('/execute', { script: qasmScript, shots }, 10000, (data) => {
      if (data.statevector) {
        data.statevector = convertStateVector(data.statevector);
      }
      if ('line' in data) data.line = parseInt(data.line);
      if ('col' in data) data.col = parseInt(data.col);
      return data;
    });
  }

  async validate(qasmScript) {
    return this._post('/validate', { script: qasmScript }, 5000, (data) => {
      if ('line' in data) data.line = parseInt(data.line);
      if ('col' in data) data.col = parseInt(data.col);
      return data;
    });
  }

  async setQubits(numQubits) {
    return this._post('/update/qubits', { num_qubits: numQubits });
  }

  async setBackend(backend) {
    return this._post('/update/backend', { backend });
  }

  async getQubits() {
    return this._get('/get/qubits');
  }

  async getBackend() {
    return this._get('/get/backend');
  }

  // ----- Internal helpers -----

  async _post(path, body, timeout = 5000, transform = null) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${this._baseUrl}${path}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(id);
      const data = await response.json();
      return [transform ? transform(data) : data, response.status];
    } catch (e) {
      return [{ error: e.message }, 503];
    }
  }

  async _get(path, timeout = 5000) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${this._baseUrl}${path}`, {
        method: 'GET',
        signal: controller.signal,
        headers: DEFAULT_HEADERS
      });

      clearTimeout(id);
      const data = await response.json();
      return [data, response.status];
    } catch (e) {
      return [{ error: e.message }, 503];
    }
  }
}

// ----- Utility Functions -----

async function getBaseUrl() {
  const url = `${BASE_URL_ENDPOINT}?cacheBust=${Date.now()}`;
  const response = await fetch(url, { cache: 'no-store', timeout: 3000 });
  const text = await response.text();
  return text.trim();
}

function convertStateVector(stateVector) {
  return stateVector.map(([re, im]) => new Complex(re, im));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Complex {
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }

  toString() {
    return `${this.re} + ${this.im}i`;
  }
}

export { QuantumAPI as default, Complex };