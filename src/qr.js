import { BrowserMultiFormatReader } from '@zxing/library';

window.addEventListener('DOMContentLoaded', () => {

    console.log('init');
    

    const scannerElement = document.querySelector('#scanner');
    const startButton = document.createElement('button');
    const stopButton = document.createElement('button');

    if (!scannerElement) {
        console.error('Элемент #scanner не найден.');
        return;
    }

    // Создание кнопки "Начать сканирование"
    startButton.textContent = 'Начать сканирование';
    startButton.style.marginRight = '10px';

    // Создание кнопки "Остановить сканирование"
    stopButton.textContent = 'Остановить сканирование';
    stopButton.disabled = true;

    scannerElement.appendChild(startButton);
    scannerElement.appendChild(stopButton);

    let codeReader = new BrowserMultiFormatReader();
    let currentStream = null;

    startButton.addEventListener('click', () => {
        const constraints = {
            video: {
                facingMode: 'environment', // Использование задней камеры
            },
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

                currentStream = stream;

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

                startButton.disabled = true;
                stopButton.disabled = false;
            })
            .catch((error) => {
                console.error('Ошибка доступа к камере:', error);
            });
    });

    stopButton.addEventListener('click', () => {
        if (codeReader) {
            codeReader.reset();
        }
        if (currentStream) {
            currentStream.getTracks().forEach((track) => track.stop());
        }
        scannerElement.querySelectorAll('video').forEach((video) => video.remove());
        console.log('Сканирование остановлено');

        startButton.disabled = false;
        stopButton.disabled = true;
    });
});
