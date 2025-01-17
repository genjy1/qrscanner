import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

window.addEventListener('DOMContentLoaded', () => {
    const scannerElement = document.querySelector('#scanner');
    const resultWrapper = document.querySelector('#result');

    if (!scannerElement) {
        console.error('Элемент #scanner не найден.');
        return;
    }

    const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX];
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    const codeReader = new BrowserMultiFormatReader();

    const constraints = {
        video: { facingMode: 'environment' },
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            const videoElement = document.createElement('video');
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.srcObject = stream;
            videoElement.setAttribute('playsinline', true); // Отключение полноэкранного режима на iOS
            videoElement.play();
            scannerElement.appendChild(videoElement);

            codeReader.decodeFromVideoDevice(null, videoElement, (result, error) => {
                if (result) {
                    console.log('Распознанный код:', result.text);
                    resultWrapper.textContent = `Результат: ${result.text}`;
                }
                if (error && !(error instanceof zxing.NotFoundException)) {
                    console.error('Ошибка сканирования:', error);
                }
            }, hints);
        })
        .catch((error) => {
            console.error('Ошибка доступа к камере:', error);
        });
});
