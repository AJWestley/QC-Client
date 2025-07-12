import requests
import time

BASE_URL_ENDPOINT = "https://gist.githubusercontent.com/AJWestley/8cd6b6a60bc82b67dde7895891c53097/raw/pi_url.txt"


class API:
    """
    A blocking API client for interacting with a remote Quantum API server.

    This client performs connection checking, script execution, backend configuration,
    and other operations via HTTP. Designed to be called from a GUI using background threads.
    """

    def __init__(self):
        self._connected = False
        self._base_url = None

    @property
    def connected(self) -> bool:
        """Return whether the client is currently connected to a working API server."""
        return self._connected

    def connect(self, retry_delay: float = 1.0, timeout: int = 5) -> None:
        """
        Attempt to connect to the server by pinging the discovered URL.

        Repeats until the connection is successful. This method is blocking.

        Args:
            retry_delay: Time to wait between retries (in seconds).
            timeout: HTTP timeout in seconds for ping requests.
        """
        self._connected = False

        while True:
            try:
                url = get_base_url()
                r = requests.get(f'{url}/ping', timeout=timeout)
                if r.status_code == 200:
                    self._base_url = url
                    self._connected = True
                    return
            except requests.RequestException:
                pass
            time.sleep(retry_delay)

    def is_alive(self, timeout: int = 3) -> bool:
        """
        Check if the server is currently responding to pings.

        Returns:
            True if the server responds with HTTP 200, False otherwise.
        """
        if not self._base_url:
            return False
        try:
            r = requests.get(f'{self._base_url}/ping', timeout=timeout)
            return r.status_code == 200
        except requests.RequestException:
            return False

    def execute(self, qasm_script: str, shots: int = 1024):
        """
        Submit a QASM script to be executed on the quantum backend.

        Args:
            qasm_script: QASM code as a string.
            shots: Number of measurement shots to perform.

        Returns:
            A tuple of (response_json, status_code)
        """
        try:
            r = requests.post(f'{self._base_url}/execute', json={'script': qasm_script, 'shots': shots}, timeout=10)
            data = r.json()
            if 'statevector' in data:
                data['statevector'] = convert_state_vector(data['statevector'])
            if 'line' in data:
                data['line'] = int(data['line'])
            if 'col' in data:
                data['col'] = int(data['col'])
            return data, r.status_code
        except requests.RequestException as e:
            return {'error': str(e)}, 503

    def validate(self, qasm_script: str):
        """
        Validate a QASM script using the server.

        Args:
            qasm_script: QASM code as a string.

        Returns:
            A tuple of (response_json, status_code)
        """
        try:
            r = requests.post(f'{self._base_url}/validate', json={'script': qasm_script}, timeout=5)
            data = r.json()
            if 'line' in data:
                data['line'] = int(data['line'])
            if 'col' in data:
                data['col'] = int(data['col'])
            return data, r.status_code
        except requests.RequestException as e:
            return {'error': str(e)}, 503

    def set_qubits(self, num_qubits: int):
        """
        Set the number of qubits used by the simulator.

        Args:
            num_qubits: Integer number of qubits.

        Returns:
            A tuple of (response_json, status_code)
        """
        try:
            r = requests.post(f'{self._base_url}/update/qubits', json={'num_qubits': num_qubits}, timeout=5)
            return r.json(), r.status_code
        except requests.RequestException as e:
            return {'error': str(e)}, 503

    def set_backend(self, backend: str):
        """
        Set the simulation backend (e.g., 'fault-tolerant', 'noisy').

        Args:
            backend: Backend string.

        Returns:
            A tuple of (response_json, status_code)
        """
        try:
            r = requests.post(f'{self._base_url}/update/backend', json={'backend': backend}, timeout=5)
            return r.json(), r.status_code
        except requests.RequestException as e:
            return {'error': str(e)}, 503

    def get_qubits(self):
        """
        Retrieve the current number of qubits configured on the server.

        Returns:
            A tuple of (response_json, status_code)
        """
        try:
            r = requests.get(f'{self._base_url}/get/qubits', timeout=5)
            return r.json(), r.status_code
        except requests.RequestException as e:
            return {'error': str(e)}, 503

    def get_backend(self):
        """
        Retrieve the current simulation backend.

        Returns:
            A tuple of (response_json, status_code)
        """
        try:
            r = requests.get(f'{self._base_url}/get/backend', timeout=5)
            return r.json(), r.status_code
        except requests.RequestException as e:
            return {'error': str(e)}, 503


def get_base_url() -> str:
    """
    Fetch the latest base URL for the API server from a known gist endpoint.

    Returns:
        The base URL as a string.
    """
    r = requests.get(f"{BASE_URL_ENDPOINT}?cacheBust={int(time.time())}", timeout=3)
    return r.text.strip()

def convert_state_vector(state_vector: list[tuple[float, float]]) -> list[complex]:
    return list(map(lambda st: complex(st[0], st[1]), state_vector))
