const chartContainer = document.getElementById('chart');
const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 400,
    layout: { backgroundColor: '#1e1e1e', textColor: 'white' },
    grid: { vertLines: { color: '#444' }, horzLines: { color: '#444' } },
});

const candleSeries = chart.addCandlestickSeries({
    upColor: 'green',
    downColor: 'red',
    borderUpColor: 'green',
    borderDownColor: 'red',
    wickUpColor: 'green',
    wickDownColor: 'red',
});

let fakePrice = 100;
let balance = 1000;
const balanceEl = document.getElementById('balance');
const positions = [];
const positionList = document.getElementById('positions');

setInterval(() => {
    const change = (Math.random() - 0.5) * 2;
    const newPrice = fakePrice + change;
    const timestamp = Math.floor(Date.now() / 1000);

    candleSeries.update({
        time: timestamp,
        open: fakePrice,
        high: newPrice + 1,
        low: newPrice - 1,
        close: newPrice
    });

    fakePrice = newPrice;
}, 1000);

function placeOrder(type) {
    const price = fakePrice.toFixed(2);
    const cost = 10;

    if (balance >= cost) {
        balance -= cost;  // Mengurangi saldo saat membuka posisi
        balanceEl.textContent = balance;

        const position = { type, price, id: Date.now(), openPrice: price }; // Menyimpan harga saat membuka posisi
        positions.push(position);
        updatePositions();
    } else {
        alert("Degen tidak cukup!");
    }
}

function closePosition(id) {
    const index = positions.findIndex(pos => pos.id === id);
    if (index !== -1) {
        const position = positions[index];
        const closePrice = fakePrice.toFixed(2);
        let profitLoss = 0;

        // Menghitung profit/loss
        if (position.type === 'buy' && closePrice > position.openPrice) {
            profitLoss = 10;  // Profit jika prediksi benar
        } else if (position.type === 'sell' && closePrice < position.openPrice) {
            profitLoss = 10;  // Profit jika prediksi benar
        } else {
            profitLoss = -10; // Loss jika prediksi salah
        }

        balance += profitLoss;  // Menambah atau mengurangi saldo
        balanceEl.textContent = balance;

        positions.splice(index, 1);  // Menghapus posisi setelah ditutup
        updatePositions();
    }
}

function updatePositions() {
    positionList.innerHTML = '';
    positions.forEach(pos => {
        const li = document.createElement('li');
        li.textContent = `${pos.type.toUpperCase()} @ ${pos.openPrice}`;
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Tutup';
        closeBtn.onclick = () => closePosition(pos.id);
        li.appendChild(closeBtn);
        positionList.appendChild(li);
    });
}