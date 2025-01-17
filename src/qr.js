import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

window.addEventListener('DOMContentLoaded', () => {
    const scannerElement = document.querySelector('#scanner');
    const resultWrapper = document.querySelector('#result');

    if (!scannerElement) {
        console.error('Элемент #scanner не найден.');
        return;
    }

    if (!resultWrapper) {
        console.error('Элемент #result не найден.');
        return;
    }

    // Указываем форматы для чтения (QR-код и DataMatrix)
    const formats = [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE];
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    // Инициализация сканера
    const codeReader = new BrowserMultiFormatReader(hints);

    // Настройки камеры
    const constraints = {
        video: { facingMode: 'environment' }, // Используем заднюю камеру
    };

    // Запуск видеопотока
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            const videoElement = document.createElement('video');
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.srcObject = stream;
            videoElement.setAttribute('playsinline', true); // Отключение полноэкранного режима на iOS
            videoElement.play();
            scannerElement.appendChild(videoElement);

            // Начало декодирования видеопотока
            codeReader.decodeFromVideoDevice(
                null,
                videoElement,
                (result, error) => {
                    if (result) {
                        console.log('Считан код:', result.text);
                        resultWrapper.textContent = `Результат: ${result.text}`;
                    }
                    if (error && !(error instanceof NotFoundException)) {
                        console.error('Ошибка сканирования:', error);
                    }
                }
            );
        })
        .catch((error) => {
            console.error('Ошибка доступа к камере:', error);
        });

    // Кнопка для остановки сканирования
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Остановить сканирование';
    scannerElement.appendChild(stopButton);

    stopButton.addEventListener('click', () => {
        codeReader.reset();
        console.log('Сканирование остановлено');
    });
});
