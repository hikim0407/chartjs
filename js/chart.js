class Chart {
    constructor(canvasId, options = {}, config = {}) {
        this.canvasId = canvasId;
        this.createElement();
        
        this.init();
    }

    init = function() {
        drawData();
    };

    drawData = function() {
        
    };

    createElement = function() {
        const container = document.getElementById(this.canvasId);

        const chartDiv = document.createElement('div');
        chartDiv.id = 'chart';
        chartDiv.className = 'chart';
        container.appendChild(newDiv);

        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.className = 'tooltip';
        container.appendChild(newDiv);
    };
}
document.addEventListener('DOMContentLoaded', () => {
    const data = [50, 70, 30, 90, 60];  // Your data here
    const chart = document.getElementById('chart');

    data.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value}%`;

        const span = document.createElement('span');
        span.textContent = `${value}%`;

        bar.appendChild(span);
        chart.appendChild(bar);
    });
});
