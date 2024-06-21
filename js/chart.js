class Chart {
    constructor(canvasId, options = {}, config = {}) {
        this.maxValue = options.maxValue || 100;
        this.gridInterval = options.gridInterval || 10;
        this.container = document.getElementById(canvasId);

        this.config = config;
        this.dataInfo = config.dataInfo;
        this.labels = config.labels;
        
        this.init();
    };

    init = function() {
        this.drawLayOut();
        this.drawData();
        this.drawGrid();
    };

    drawLayOut = function() {
        this.chartTitle = this.createElement({"id": "chartTitle", "className": "chart-title", "tag": "div", "parent": this.container});
        this.chartTitle.textContent = `${this.config.chartTitle}`;

        this.chartWrapper = this.createElement({"id": "chartWrapper", "className": "chart-wrapper", "tag": "div", "parent": this.container});

        this.yAxisWrapper = this.createElement({"id": "yAxisWrapper", "className": "y-axis-title", "tag": "div", "parent": this.chartWrapper});
        this.yAxisTitle = this.createElement({"id": "yAxisTitle", "className": "y-axis-title", "tag": "div", "parent": this.chartWrapper});
        this.yAxis = this.createElement({"id": "yAxisTitle", "className": "y-axis-title", "tag": "div", "parent": this.chartWrapper});

        this.xAxisTitle = this.createElement({"id": "xAxisTitle", "className": "x-axis-title", "tag": "div", "parent": this.chartWrapper});
        this.xAxisWapper = this.createElement({"id": "xAxisTitle", "className": "x-axis-title", "tag": "div", "parent": this.chartWrapper});
        this.xAxis = this.createElement({"id": "xAxisTitle", "className": "x-axis-title", "tag": "div", "parent": this.chartWrapper});

        this.chartContainer = this.createElement({"id": "chartContainer", "className": "chart-container", "tag": "div", "parent": this.chartWrapper});
        this.chart = this.createElement({"id": "chart", "className": "chart", "tag": "div", "parent": this.chartContainer});
        this.labelWrapper = this.createElement({"id": "labelWrapper", "className": "labels", "tag": "div", "parent": this.chartContainer});
        this.tooltip = this.createElement({"id": "tooltip", "className": "tooltip", "tag": "div", "parent": this.container});
    };

    drawGrid = function() {
        const grid = this.createElement({"id": "", "className": "grid", "tag": "div", "parent": this.chart});
        grid.style.setProperty('--grid-lines', Math.floor(this.maxValue / this.gridInterval));
    };

    drawData = function() {
        this.labels.forEach((label, index) => {
            const section = document.createElement('div');
            section.className = 'section';

            const barsContainer = document.createElement('div');
            barsContainer.className = 'bars';

            const data = [];
            this.dataInfo.forEach(info => {
                data.push(info.data[index]);
            });
            data.forEach(value => {
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = `${value}%`;
        
                const span = document.createElement('span');
                span.textContent = `${value}%`;
        
                bar.appendChild(span);
                barsContainer.appendChild(bar);

                bar.addEventListener('mouseover', (event) => this.showTooltip(event, label, value));
                bar.addEventListener('mouseout', () => this.hideTooltip());
            });
            section.appendChild(barsContainer);
            this.chart.appendChild(section);
        });
    };

    createElement = function(options) {
        const element = document.createElement(options.tag);
        element.id = options.id;
        element.className = options.className;
        options.parent.appendChild(element);

        return element;
    };

    showTooltip = function(event, label, value) {
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = `${event.pageX}px`;
        this.tooltip.style.top = `${event.pageY - 10}px`;
        this.tooltip.textContent = `${label}: ${value}%`;
    };

    hideTooltip = function() {
        this.tooltip.style.display = 'none';
    };
}
