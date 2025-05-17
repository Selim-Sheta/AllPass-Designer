// S. Sheta 2025
import LZString from 'lz-string';

export function saveToFile(state) {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filter_design.json';
    a.click();
    URL.revokeObjectURL(url);
}

export function loadFromFile(hydrateCallback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                hydrateCallback(data);
            } catch (err) {
                alert("Invalid file.");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

export function getURLState(state) {
    const json = JSON.stringify(state);
    return LZString.compressToEncodedURIComponent(json);
}

export function loadFromURL() {
    const compressed = new URLSearchParams(window.location.search).get('state');
    if (!compressed) return null;
    try {
        const json = LZString.decompressFromEncodedURIComponent(compressed);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function updateURL(state) {
    const stateStr = getURLState(state);
    const newURL = `${window.location.origin}${window.location.pathname}?state=${stateStr}`;
    window.history.replaceState(null, '', newURL);
}
