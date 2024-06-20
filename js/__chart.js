class Chart {
  constructor(canvasId, options = {}, config = {}) {
    this.canvasId = canvasId;
	  this.createElement();

    this.canvas = document.getElementById("bgCanvas");
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = options.width || 800;
    this.canvas.height = options.height || 600;

    this.dataCanvas = document.getElementById("dataCanvas");
    this.dataCtx = this.dataCanvas.getContext('2d');
    this.dataCanvas.width = options.width || 800;
    this.dataCanvas.height = options.height || 600;
    this.dataCanvas.dataPoints = [];

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.tooltip = document.getElementById("tooltip");
    this.options = options;
    this.config = config;

    this.canvas.dataLabels = [];
	  this.colors = ['blue', 'red', 'green'];
	
    this.init();
  }

  init() {
    this.drawBackground();
    this.drawAxes();
    this.drawGrid();
    this.drawDataLabels();
    this.drawData();
    this.addDataLabelEvents();
    this.addTooltipEvents();
  }

  drawBackground() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.config.chartTitle) {
      this.ctx.fillStyle = '#000';
      this.ctx.font = '16px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.config.chartTitle, this.width / 2, 20);
    }
  }

  drawAxes() {
    this.ctx.beginPath();
    this.ctx.moveTo(60, 40); // Adjusted starting point for y-axis
    this.ctx.lineTo(60, this.height - 50);
    this.ctx.lineTo(this.width - 30, this.height - 50); // Adjusted x position for x-axis
    this.ctx.strokeStyle = '#000'; // Light gray color for grid lines
    this.ctx.stroke();

    // X-axis title
    if (this.config.xAxisTitle) {
      this.ctx.fillStyle = '#000';
      this.ctx.font = '14px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.config.xAxisTitle, this.width / 2, this.height - 10);
    }

    // Y-axis title
    if (this.config.yAxisTitle) {
      this.ctx.save();
      this.ctx.translate(20, this.height / 2);
      this.ctx.rotate(-Math.PI / 2);
      this.ctx.fillStyle = '#000';
      this.ctx.font = '14px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.config.yAxisTitle, 0, 0);
      this.ctx.restore();
    }
  }

  drawGrid() {
    const maxValue = this.options.maxValue || 100; // Default max value if not provided
    const gridSpacing = this.options.gridSpacing || 10; // Default grid spacing if not provided

    // Draw horizontal grid lines and labels
    this.ctx.beginPath();
    this.ctx.fillStyle = '#000';
    this.ctx.font = '12px Arial';
    for (let i = 1; i <= maxValue / gridSpacing; i++) {
      const y = this.height - 50 - ((this.height - 100) / (maxValue / gridSpacing) * i);
      this.ctx.moveTo(60, y);
      this.ctx.lineTo(this.width - 30, y); // Adjusted x position for x-axis
      const label = i * gridSpacing;
      this.ctx.fillText(label, 30, y + 4); // Adjusted x position for labels
    }
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'; // Light gray color for grid lines
    this.ctx.stroke();

    // Draw vertical grid lines and labels
    this.ctx.beginPath();
    this.ctx.fillStyle = '#000';
    this.ctx.font = '12px Arial';
    this.config.labels.forEach((label, index) => {
      const x = ((this.width - 40) / this.config.labels.length) * index + 60; // Adjusted x position
      this.ctx.moveTo(x, this.height - 50);
      this.ctx.lineTo(x, 40);
      this.ctx.fillText(label, x, this.height - 30); // Adjusted y position for labels
    });
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'; // Light gray color for grid lines
    this.ctx.stroke();
  }

  drawDataLabels() {
    this.config.data.forEach((dataset, index) => {
      if (dataset.label) {
        const x = this.width / this.config.data.length+index*(dataset.label.length*5+20);
        const y = 30;
        const width = 10;
        const height = 10;
        const padding = 2;

        this.ctx.fillStyle = this.colors[index % this.colors.length];
        this.ctx.fillRect(x, y, width, height);  // (x, y, width, height)

        this.ctx.fillStyle = '#000';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(dataset.label, x+width+padding, y+height);

        this.canvas.dataLabels.push({ x, y, width, height, padding, label: dataset.label, color: this.colors[index % this.colors.length] });
      }
    });
  }

  addDataLabelEvents() {
    this.canvas.addEventListener('click', this.handleDataLabel.bind(this));
  }

  handleDataLabel(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    this.canvas.dataLabels.forEach((point) => {
      const xStart = point.x;
      const xEnd = point.x + point.width + point.padding;
      const yStart = point.y;
      const yEnd = point.y + point.height;
      
      if(mouseX >= xStart && mouseX <= xEnd && mouseY >= yStart && mouseY <= yEnd) {
        
      }
    });
  }

  drawData() {
    const maxValue = this.options.maxValue || 100; // Default max value if not provided
    const minValue = 0; // Assuming minValue is always 0 for this example
	
	  this.config.data.forEach((dataset, dataIndex) => {
      // Draw data points and handle tooltips
      dataset.data.forEach((value, index) => {
        const x = ((this.width - 40) / this.config.labels.length) * index + 60; // Adjusted x position
        const y = this.height - 50 - ((this.height - 100) * (value - minValue)) / maxValue; // Adjusted y position
        this.dataCtx.beginPath();
        this.dataCtx.arc(x, y, 6, 0, 2 * Math.PI, false); // Larger radius for easier hover
        this.dataCtx.fillStyle = this.colors[dataIndex % this.colors.length]; // Different color for each dataset
        this.dataCtx.fill();

        // Store data point positions for tooltip

        this.dataCanvas.dataPoints.push({ x, y, label: this.config.labels[index], value, color: this.colors[dataIndex % this.colors.length], label: dataset.label });
      });

      // Draw lines between data points
      this.dataCtx.beginPath();
      dataset.data.forEach((value, index) => {
        const x = ((this.width - 40) / this.config.labels.length) * index + 60; // Adjusted x position
        const y = this.height - 50 - ((this.height - 100) * (value - minValue)) / maxValue; // Adjusted y position
        if (index === 0) {
          this.dataCtx.moveTo(x, y);
        } else {
          this.dataCtx.lineTo(x, y);
        }
      });
      this.dataCtx.strokeStyle = this.colors[dataIndex % this.colors.length]; // Different color for each dataset
      this.dataCtx.stroke();
    });
  }
  
  addTooltipEvents() {
    this.dataCanvas.addEventListener('mousemove', this.handleTooltip.bind(this));
  }

  handleTooltip(e) {
    const rect = this.dataCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    let tooltipShown = false;

    // Check if mouse is close to any data point
    this.dataCanvas.dataPoints.forEach((point) => {
      const distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2));
      if (distance < 10) { // Adjust this threshold as needed
        this.showTooltip(point.x + rect.left, point.y + rect.top, point.label, point.value);
        tooltipShown = true;
      }
    });

    if (!tooltipShown) {
      this.hideTooltip();
    }
  }

  showTooltip(x, y, label, value) {
    this.tooltip.style.left = `${x + 10}px`;
    this.tooltip.style.top = `${y - 25}px`;
    this.tooltip.innerHTML = `${label}: ${value}`;
    this.tooltip.style.display = 'block';
  }

  hideTooltip() {
    this.tooltip.style.display = 'none';
  }
  
  createElement() {
    const container = document.getElementById(this.canvasId);

    const bgCanvas = document.createElement("canvas");
    bgCanvas.id = "bgCanvas";
    container.appendChild(bgCanvas);

    const dataCanvas = document.createElement("canvas");
    dataCanvas.id = "dataCanvas";
    container.appendChild(dataCanvas);

    const newDiv = document.createElement('div');
    newDiv.id = 'tooltip';
    newDiv.className = 'tooltip';
    container.appendChild(newDiv);
  }
}