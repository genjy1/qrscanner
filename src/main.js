import { startBarcodeScanner } from './qr.js';

document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.querySelector('#video');
    const resultElement = document.querySelector('#result');
    const startButton = document.querySelector('#startScan');

    startButton.addEventListener('click', () => {
        startBarcodeScanner(videoElement, resultElement);
    });
});
