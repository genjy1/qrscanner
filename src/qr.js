export async function startBarcodeScanner(videoElement, resultElement, formatElement) {
    if (!('BarcodeDetector' in window)) {
        console.error('Barcode Detection API не поддерживается в этом браузере.');
        resultElement.textContent = 'API не поддерживается.';
        return;
    }

    // Проверка поддерживаемых форматов
    const supportedFormats = await BarcodeDetector.getSupportedFormats();
    formatElement.textContent = `Поддерживаемые форматы: ${supportedFormats.join(', ')}`;

    if (!supportedFormats.includes('data_matrix')) {
        console.error('DataMatrix не поддерживается вашим браузером.');
        resultElement.textContent = 'DataMatrix не поддерживается.';
        return;
    }

    // Инициализация BarcodeDetector
    const barcodeDetector = new BarcodeDetector({ formats: ['data_matrix'] });

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
        });

        videoElement.srcObject = stream;
        videoElement.play();

        videoElement.onloadedmetadata = () => {
            console.log('Видео загружено:', videoElement.videoWidth, videoElement.videoHeight);
        };

        videoElement.onerror = (err) => {
            console.error('Ошибка воспроизведения видео:', err);
        };

        // Цикл сканирования
        while (true) {
            try {
                const barcodes = await barcodeDetector.detect(videoElement);
                console.log('Обнаруженные коды:', barcodes);

                if (barcodes.length > 0) {
                    resultElement.textContent = `Распознан код: ${barcodes[0].rawValue}`;
                    console.log('Распознан код:', barcodes[0]);

                    // Остановить видеопоток
                    const stream = videoElement.srcObject;
                    if (stream) {
                        const tracks = stream.getTracks();
                        tracks.forEach((track) => track.stop());
                    }
                    break; // Завершить цикл
                }
            } catch (err) {
                console.error('Ошибка распознавания:', err);
            }

            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    } catch (error) {
        console.error('Ошибка работы камеры:', error);
        resultElement.textContent = 'Ошибка доступа к камере.';
    }
}
