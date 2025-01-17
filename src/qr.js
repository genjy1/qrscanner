import { BrowserMultiFormatReader } from '@zxing/library';

window.addEventListener('DOMContentLoaded', () => {
    const scannerElement = document.querySelector('#scanner');

    if (!scannerElement) {
        console.error('Элемент #scanner не найден.');
        return;
    }

    // Инициализация сканера
    const codeReader = new BrowserMultiFormatReader();

    // Настройка видео потока (используем заднюю камеру)
    const constraints = {
        video: {
            facingMode: 'environment',
        },
    };

    // Запуск камеры и чтение DataMatrix
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            const videoElement = document.createElement('video');
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.srcObject = stream;
            videoElement.setAttribute('playsinline', true); // Отключение полноэкранного режима на iOS
            videoElement.play();
            scannerElement.appendChild(videoElement);

            // Чтение кода с видеопотока
            codeReader.decodeFromVideoDevice(null, videoElement, (result, error) => {
                if (result) {
                    console.log('Считан DataMatrix-код:', result.text);
                    alert(`DataMatrix-код: ${result.text}`);
                }
                if (error && !(error instanceof zxing.NotFoundException)) {
                    console.error('Ошибка сканирования:', error);
                }
            });
        })
        .catch((error) => {
            console.error('Ошибка доступа к камере:', error);
        });

    // Остановка сканирования (пример кнопки остановки)
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Остановить сканирование';
    stopButton.addEventListener('click', () => {
        codeReader.reset();
        console.log('Сканирование остановлено');
    });
    scannerElement.appendChild(stopButton);
});
