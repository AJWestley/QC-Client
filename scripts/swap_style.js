const darkRules = [
    { token: 'keyword', foreground: '61AFEF' },
    { token: 'gate', foreground: 'C678DD' },
    { token: 'builtin', foreground: 'E5C07B' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'operator', foreground: '56B6C2' },
    { token: 'string', foreground: '98C379' },
    { token: 'comment', foreground: '7F848E' },
    { token: 'identifier', foreground: 'E06C75' },
    { token: 'bracket', foreground: 'D19A66' }
]

const lightRules = [
    { token: 'keyword', foreground: '1E7FC5' },
    { token: 'gate', foreground: '9842B2' },
    { token: 'builtin', foreground: 'B89040' },
    { token: 'number', foreground: '7A9B6E' },
    { token: 'operator', foreground: '2E7E88' },
    { token: 'string', foreground: '5D8C43' },
    { token: 'comment', foreground: 'AAAAAA' },
    { token: 'identifier', foreground: 'A43740' },
    { token: 'bracket', foreground: 'A06433' }
]

function switchTheme() {
    const defaultTheme = document.getElementById('theme-light');
    const darkTheme = document.getElementById('theme-dark');

    const isDark = !darkTheme.disabled;

    defaultTheme.disabled = !isDark;
    darkTheme.disabled = isDark;

    const baseTheme = isDark ? 'vs' : 'vs-dark';
    const chosenRules = isDark ? lightRules : darkRules;

    // Redefine and apply the theme
    monaco.editor.defineTheme('qasm-theme', {
        base: baseTheme,
        inherit: true,
        rules: chosenRules,
        colors: {}
    });

    monaco.editor.setTheme('qasm-theme');
}