document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-array-btn');
    const sortBtn = document.getElementById('sort-btn');
    const barContainer = document.getElementById('bar-container');
    const sizeSlider = document.getElementById('size-slider');
    const speedSlider = document.getElementById('speed-slider');
    const algorithmSelect = document.getElementById('algorithm-select');

    let array = [];
    let delay = 300 - speedSlider.value * 2.5;
    generateBtn.addEventListener('click', generateNewArray);
    sortBtn.addEventListener('click', startSort);
    sizeSlider.addEventListener('input', () => {
        generateNewArray();
    });
    speedSlider.addEventListener('input', () => {
        delay = 300 - speedSlider.value * 2.5;
    });

    function generateNewArray() {
        array = [];
        const size = sizeSlider.value;
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 95) + 5); 
        }
        renderArray();
    }

    function renderArray(highlightIndices = {}) {
        barContainer.innerHTML = '';
        array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${value}%`;
            bar.style.width = `${100 / array.length}%`;

            if (highlightIndices.comparing && (index === highlightIndices.comparing[0] || index === highlightIndices.comparing[1])) {
                bar.style.backgroundColor = '#e94560'; 
            } else if (highlightIndices.swapping && (index === highlightIndices.swapping[0] || index === highlightIndices.swapping[1])) {
                bar.style.backgroundColor = '#f4a261'; // Orange for swapping
            } else if (highlightIndices.sorted && highlightIndices.sorted.includes(index)) {
                bar.style.backgroundColor = '#2a9d8f'; 
            }
            
            barContainer.appendChild(bar);
        });
    }
    
    function sleep() {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    function disableControls() {
        sortBtn.disabled = true;
        generateBtn.disabled = true;
        sizeSlider.disabled = true;
        algorithmSelect.disabled = true;
    }

    function enableControls() {
        sortBtn.disabled = false;
        generateBtn.disabled = false;
        sizeSlider.disabled = false;
        algorithmSelect.disabled = false;
    }

    async function startSort() {
        disableControls();
        const selectedAlgorithm = algorithmSelect.value;
        switch (selectedAlgorithm) {
            case 'bubble':
                await bubbleSort();
                break;
            case 'selection':
                await selectionSort();
                break;
            case 'insertion':
                await insertionSort();
                break;
            case 'quick':
                await quickSort(0, array.length - 1);
                break;
            case 'merge':
                await mergeSort(0, array.length - 1);
                break;
        }
        
        renderArray({ sorted: array.map((_, i) => i) });
        enableControls();
    }

    async function bubbleSort() {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                renderArray({ comparing: [j, j + 1] });
                await sleep();
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    renderArray({ swapping: [j, j + 1] });
                    await sleep();
                }
            }
        }
    }

    async function selectionSort() {
        for (let i = 0; i < array.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < array.length; j++) {
                renderArray({ comparing: [minIndex, j] });
                await sleep();
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [array[i], array[minIndex]] = [array[minIndex], array[i]];
                renderArray({ swapping: [i, minIndex] });
                await sleep();
            }
        }
    }

    async function insertionSort() {
        for (let i = 1; i < array.length; i++) {
            let key = array[i];
            let j = i - 1;
            renderArray({ comparing: [i, j] });
            await sleep();

            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                renderArray({ swapping: [j, j + 1] });
                await sleep();
                j--;
            }
            array[j + 1] = key;
        }
    }

    async function quickSort(low, high) {
        if (low < high) {
            let pi = await partition(low, high);
            await quickSort(low, pi - 1);
            await quickSort(pi + 1, high);
        }
    }

    async function partition(low, high) {
        let pivot = array[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            renderArray({ comparing: [j, high] });
            await sleep();
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                renderArray({ swapping: [i, j] });
                await sleep();
            }
        }
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        renderArray({ swapping: [i + 1, high] });
        await sleep();
        return i + 1;
    }

    async function mergeSort(l, r) {
        if (l >= r) return;
        const m = Math.floor((l + r) / 2);
        await mergeSort(l, m);
        await mergeSort(m + 1, r);
        await merge(l, m, r);
    }

    async function merge(l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = new Array(n1);
        let R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = array[l + i];
        for (let j = 0; j < n2; j++) R[j] = array[m + 1 + j];

        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            renderArray({ comparing: [l + i, m + 1 + j] });
            await sleep();
            if (L[i] <= R[j]) {
                array[k] = L[i];
                i++;
            } else {
                array[k] = R[j];
                j++;
            }
            renderArray({ swapping: [k] });
            await sleep();
            k++;
        }
        while (i < n1) {
            array[k] = L[i];
            renderArray({ swapping: [k] });
            await sleep();
            i++; k++;
        }
        while (j < n2) {
            array[k] = R[j];
            renderArray({ swapping: [k] });
            await sleep();
            j++; k++;
        }
    }

    // Initial array generation
    generateNewArray();
});