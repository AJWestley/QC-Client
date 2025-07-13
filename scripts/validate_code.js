function hasMeasurement(qasmScript) {
  const pattern = /^\s*measure\s+.+?;\s*$/m;
  return pattern.test(qasmScript);
}

export function executionFailedMessage(message) {
    const box = document.getElementById('message-box');
    const msg = document.getElementById('code-error-msg');

    ['connected-msg', 'disconnected-msg', 'connection-failed-msg', 'code-error-msg'].forEach(id =>
        document.getElementById(id).classList.remove('active')
    );

    msg.textContent = message;
    msg.classList.add('active');
    box.classList.add('show');

    setTimeout(() => {
        box.classList.remove('show');

        setTimeout(() => {
        msg.classList.remove('active');
        }, 400);
    }, 3000);
}


export function isValidSyntax(code) {
    if (!hasMeasurement(code)) {
        executionFailedMessage('Measurement Error');
        return false;
    }
    return true;
}