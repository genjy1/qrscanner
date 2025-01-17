export async function startBarcodeScanner(videoElement, resultElement) {
    if (!('BarcodeDetector' in window)) {
        console.error('Barcode Detection API не поддерживается в этом браузере.');
        resultElement.textContent = 'API не поддерживается.';
        return;
    }

    resultElement.textContent = await BarcodeDetector.getSupportedFormats();

    const barcodeDetector = new BarcodeDetector({
        formats: ['data_matrix'], // Распознавание DataMatrix
    });

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
        });

        videoElement.srcObject = stream;
        videoElement.play();

        // Начинаем сканирование
        while (true) {
            const barcodes = await barcodeDetector.detect(videoElement);
            if (barcodes.length > 0) {
                resultElement.textContent = `Распознан код: ${barcodes[0].rawValue}`;
                console.log('Распознан код:', barcodes[0]);
                break; // Прерываем после первого найденного кода
            }
            await new Promise((resolve) => setTimeout(resolve, 100)); // Пауза между проверками
        }
    } catch (error) {
        console.error('Ошибка работы камеры:', error);
        resultElement.textContent = 'Ошибка доступа к камере.';
    }
}
