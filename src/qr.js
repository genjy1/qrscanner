const resultWrapper = document.querySelector('#result')
if (!('BarcodeDetector' in window)) {
    console.error('Barcode Detection API is not supported in this browser.');
    resultWrapper.textContent = 'Barcode Detection API is not supported in this browser.'
} else {
    console.log('Barcode Detection API is supported.');
    resultWrapper.textContent = 'Barcode Detection API is supported.'
}
