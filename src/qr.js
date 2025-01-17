import Quagga from 'quagga';

const resultWrapper = document.querySelector('#result')

Quagga.init(
    {
        inputStream: {
            type: 'LiveStream',
            target: document.querySelector('#scanner'),
            constraints: {
                facingMode: 'environment', // Использование задней камеры
            },
        },
        decoder: {
            readers: ['code_128_reader', 'ean_reader'], // Добавьте тип вашего линейного кода
        },
    },
    (err) => {
        if (err) {
            console.error('Ошибка инициализации Quagga:', err);
            resultWrapper.textContent = err;
            return;
        }
        console.log('Quagga инициализирован');
        Quagga.start();
    }
);

Quagga.onDetected((data) => {
    console.log('Считан код:', data.codeResult.code);
    alert(`Результат: ${data.codeResult.code}`);
});
