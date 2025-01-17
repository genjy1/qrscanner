        // Проверяем поддержку Barcode Detection API
        if (!('BarcodeDetector' in window)) {
            alert('Barcode Detection API не поддерживается в этом браузере.');
        } else {
            const video = document.getElementById('video');
            const resultElement = document.getElementById('result');
            const stopButton = document.getElementById('stop');
            let stream;

            // Инициализация BarcodeDetector
            const barcodeDetector = new BarcodeDetector({
                formats: ['data_matrix'], // Указываем формат DataMatrix
            });

            // Функция для запуска камеры
            async function startCamera() {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'environment' }, // Используем заднюю камеру
                    });
                    video.srcObject = stream;
                    video.play();

                    // Начинаем распознавание
                    detectBarcode();
                } catch (error) {
                    console.error('Ошибка доступа к камере:', error);
                    alert('Не удалось получить доступ к камере.');
                }
            }

            // Функция для распознавания DataMatrix кодов
            async function detectBarcode() {
                try {
                    while (stream && stream.active) {
                        const barcodes = await barcodeDetector.detect(video);
                        if (barcodes.length > 0) {
                            resultElement.textContent = `Распознан код: ${barcodes[0].rawValue}`;
                            console.log('Детали:', barcodes[0]);
                            break; // Останавливаем сканирование после распознавания
                        }
                        await new Promise((resolve) => setTimeout(resolve, 100)); // Ожидание перед следующим кадром
                    }
                } catch (error) {
                    console.error('Ошибка распознавания:', error);
                }
            }

            // Остановка камеры
            function stopCamera() {
                if (stream) {
                    stream.getTracks().forEach((track) => track.stop());
                    video.srcObject = null;
                    resultElement.textContent = 'Сканирование остановлено.';
                }
            }

            // Обработчик для кнопки остановки
            stopButton.addEventListener('click', stopCamera);

            // Запускаем камеру
            startCamera();
        }