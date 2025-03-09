// Tab navigation
function changeTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active-tab');
    });
    
    document.getElementById(tabId).classList.add('active-tab');
    
    // Update active link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('data-tab') === tabId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            changeTab(tabId);
        });
    });

    // Add event listeners to buttons that change tabs
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabToChange = button.getAttribute('onclick')?.match(/changeTab\('(.+)'\)/)?.[1];
            if (tabToChange) {
                changeTab(tabToChange);
            }
        });
    });

    // Remove the inline onclick attributes as we're using event listeners
    document.querySelectorAll('.btn[onclick]').forEach(button => {
        button.removeAttribute('onclick');
    });

    // Initialize all effects
    createDigitalRain();
    createParticles();
    createCryptoAnimation();
    createFinancialGraphs();
});

// Digital rain effect
function createDigitalRain() {
    const container = document.getElementById('digitalRain');
    if (!container) return;
    
    const containerWidth = window.innerWidth;
    
    // Clear existing rain
    container.innerHTML = '';
    
    const columns = Math.floor(containerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.classList.add('rain-column');
        column.style.left = `${i * 20 + Math.random() * 10}px`;
        
        const characters = generateRandomCharacters(20);
        column.textContent = characters;
        
        const duration = 10 + Math.random() * 20;
        column.style.animationDuration = `${duration}s`;
        
        const delay = Math.random() * 20;
        column.style.animationDelay = `${delay}s`;
        
        container.appendChild(column);
    }
}

function generateRandomCharacters(length) {
    const charset = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
}

// Particle effect
function createParticles() {
    // Remove existing canvas if any
    const existingCanvas = document.getElementById('particleCanvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: i % 2 === 0 ? '#d4ff00' : '#00ff80',
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX = -particle.speedX;
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY = -particle.speedY;
            }
        });
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Cryptographic animation (binary, hexadecimal, hash patterns)
function createCryptoAnimation() {
    // Remove existing container if any
    const existingContainer = document.getElementById('cryptoContainer');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    const container = document.createElement('div');
    container.id = 'cryptoContainer';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-2';
    container.style.opacity = '0.15';
    document.body.appendChild(container);
    
    // Create floating hash patterns
    for (let i = 0; i < 5; i++) {
        createHashElement(container);
    }
    
    // Create binary streams
    for (let i = 0; i < 8; i++) {
        createBinaryStream(container);
    }
    
    // Create hexadecimal blocks
    for (let i = 0; i < 3; i++) {
        createHexBlock(container);
    }
    
    // Create blockchain visualization
    createBlockchainVisualization(container);
}

function createHashElement(parent) {
    const hashTypes = [
        "1a2b3c4d5e6f7890",
        "e7d6c5b4a3928170",
        "fd5c91ae72b38e04",
        "0x1a2b3c4d5e6f7890",
        "0xfd5c91ae72b38e04"
    ];
    
    const element = document.createElement('div');
    element.className = 'hash-element';
    element.textContent = hashTypes[Math.floor(Math.random() * hashTypes.length)];
    element.style.position = 'absolute';
    element.style.color = Math.random() > 0.5 ? '#d4ff00' : '#00ff80';
    element.style.fontSize = `${Math.random() * 10 + 10}px`;
    element.style.fontFamily = 'monospace';
    element.style.top = `${Math.random() * 100}%`;
    element.style.left = `${Math.random() * 100}%`;
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 1s ease, transform 1s ease';
    
    parent.appendChild(element);
    
    // Animation timing
    setTimeout(() => {
        element.style.opacity = '0.8';
        element.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            element.remove();
            createHashElement(parent);
        }, 1000);
    }, 5000 + Math.random() * 5000);
}

function createBinaryStream(parent) {
    const stream = document.createElement('div');
    stream.className = 'binary-stream';
    stream.style.position = 'absolute';
    stream.style.top = `${Math.random() * 100}%`;
    stream.style.left = `${Math.random() * 100}%`;
    stream.style.color = '#00ff80';
    stream.style.fontSize = '14px';
    stream.style.fontFamily = 'monospace';
    stream.style.whiteSpace = 'nowrap';
    stream.style.opacity = '0.7';
    
    parent.appendChild(stream);
    
    let binaryString = '';
    const streamLength = 20 + Math.floor(Math.random() * 30);
    
    function addBit() {
        binaryString += Math.round(Math.random());
        if (binaryString.length > streamLength) {
            binaryString = binaryString.substring(1);
        }
        stream.textContent = binaryString;
        
        setTimeout(addBit, 100 + Math.random() * 300);
    }
    
    addBit();
    
    // Reposition the stream every so often
    setInterval(() => {
        stream.style.top = `${Math.random() * 100}%`;
        stream.style.left = `${Math.random() * 100}%`;
    }, 15000 + Math.random() * 10000);
}

function createHexBlock(parent) {
    const block = document.createElement('div');
    block.className = 'hex-block';
    block.style.position = 'absolute';
    block.style.width = `${100 + Math.random() * 150}px`;
    block.style.padding = '10px';
    block.style.background = 'rgba(2, 48, 32, 0.3)';
    block.style.border = '1px solid #00ff80';
    block.style.borderRadius = '4px';
    block.style.color = '#d4ff00';
    block.style.fontSize = '10px';
    block.style.fontFamily = 'monospace';
    block.style.top = `${Math.random() * 70}%`;
    block.style.left = `${Math.random() * 70}%`;
    block.style.opacity = '0';
    block.style.transform = 'scale(0.8)';
    block.style.transition = 'opacity 1s ease, transform 1s ease';
    
    let hexContent = '';
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 8; j++) {
            hexContent += (Math.floor(Math.random() * 16)).toString(16);
        }
        hexContent += '<br>';
    }
    
    block.innerHTML = hexContent;
    parent.appendChild(block);
    
    setTimeout(() => {
        block.style.opacity = '0.6';
        block.style.transform = 'scale(1)';
    }, 100);
    
    // Move and refresh the hex block periodically
    setInterval(() => {
        block.style.opacity = '0';
        block.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            block.style.top = `${Math.random() * 70}%`;
            block.style.left = `${Math.random() * 70}%`;
            
            let newHexContent = '';
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 8; j++) {
                    newHexContent += (Math.floor(Math.random() * 16)).toString(16);
                }
                newHexContent += '<br>';
            }
            block.innerHTML = newHexContent;
            
            block.style.opacity = '0.6';
            block.style.transform = 'scale(1)';
        }, 1000);
    }, 8000 + Math.random() * 4000);
}

function createBlockchainVisualization(parent) {
    const blockchain = document.createElement('div');
    blockchain.className = 'blockchain-visual';
    blockchain.style.position = 'absolute';
    blockchain.style.bottom = '5%';
    blockchain.style.left = '10%';
    blockchain.style.display = 'flex';
    blockchain.style.opacity = '0.8';
    
    parent.appendChild(blockchain);
    
    function addBlock() {
        if (blockchain.children.length > 6) {
            blockchain.removeChild(blockchain.firstChild);
        }
        
        const block = document.createElement('div');
        block.className = 'blockchain-block';
        block.style.width = '50px';
        block.style.height = '30px';
        block.style.margin = '0 10px';
        block.style.background = 'rgba(2, 48, 32, 0.5)';
        block.style.border = '1px solid #d4ff00';
        block.style.borderRadius = '3px';
        block.style.display = 'flex';
        block.style.justifyContent = 'center';
        block.style.alignItems = 'center';
        block.style.fontSize = '10px';
        block.style.color = '#d4ff00';
        block.style.fontFamily = 'monospace';
        block.style.transform = 'scale(0)';
        block.style.transition = 'transform 0.5s ease';
        
        block.textContent = Math.floor(Math.random() * 1000);
        blockchain.appendChild(block);
        
        // Connect blocks with lines
        if (blockchain.children.length > 1) {
            const connection = document.createElement('div');
            connection.style.position = 'relative';
            connection.style.top = '15px';
            connection.style.width = '0';
            connection.style.height = '1px';
            connection.style.background = '#00ff80';
            connection.style.marginLeft = '-10px';
            connection.style.marginRight = '-10px';
            connection.style.transition = 'width 0.5s ease';
            
            blockchain.insertBefore(connection, block);
            
            setTimeout(() => {
                connection.style.width = '20px';
            }, 100);
        }
        
        setTimeout(() => {
            block.style.transform = 'scale(1)';
        }, 100);
        
        setTimeout(addBlock, 3000 + Math.random() * 2000);
    }
    
    addBlock();
}

// Financial graphs and charts
function createFinancialGraphs() {
    // Remove existing container if any
    const existingContainer = document.getElementById('financialContainer');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    const container = document.createElement('div');
    container.id = 'financialContainer';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-3';
    container.style.opacity = '0.2';
    document.body.appendChild(container);
    
    // Create candlestick chart
    createCandlestickChart(container);
    
    // Create line chart
    createLineChart(container);
    
    // Create price tickers
    createPriceTickers(container);
}

function createCandlestickChart(parent) {
    const chart = document.createElement('div');
    chart.className = 'candlestick-chart';
    chart.style.position = 'absolute';
    chart.style.width = '300px';
    chart.style.height = '150px';
    chart.style.top = '60%';
    chart.style.right = '10%';
    chart.style.border = '1px solid #00ff80';
    chart.style.borderRadius = '5px';
    chart.style.padding = '10px';
    chart.style.background = 'rgba(2, 48, 32, 0.3)';
    
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 130;
    chart.appendChild(canvas);
    
    parent.appendChild(chart);
    
    const ctx = canvas.getContext('2d');
    
    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 255, 128, 0.2)';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const y = i * 20 + 10;
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        for (let i = 0; i < 14; i++) {
            const x = i * 20;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        ctx.stroke();
        
        // Draw candlesticks
        for (let i = 0; i < 14; i++) {
            const x = i * 20 + 10;
            const open = 30 + Math.random() * 70;
            const close = 30 + Math.random() * 70;
            const high = Math.max(open, close) + Math.random() * 10;
            const low = Math.min(open, close) - Math.random() * 10;
            
            // Draw the wick
            ctx.beginPath();
            ctx.moveTo(x, canvas.height - high);
            ctx.lineTo(x, canvas.height - low);
            ctx.strokeStyle = '#d4ff00';
            ctx.stroke();
            
            // Draw the body
            ctx.fillStyle = open > close ? '#ff3366' : '#00ff80';
            const bodyHeight = Math.abs(open - close);
            ctx.fillRect(x - 5, canvas.height - Math.max(open, close), 10, bodyHeight);
        }
    }
    
    drawChart();
    setInterval(drawChart, 5000);
}

function createLineChart(parent) {
    const chart = document.createElement('div');
    chart.className = 'line-chart';
    chart.style.position = 'absolute';
    chart.style.width = '250px';
    chart.style.height = '120px';
    chart.style.top = '20%';
    chart.style.left = '15%';
    chart.style.border = '1px solid #d4ff00';
    chart.style.borderRadius = '5px';
    chart.style.padding = '10px';
    chart.style.background = 'rgba(2, 48, 32, 0.3)';
    
    const canvas = document.createElement('canvas');
    canvas.width = 230;
    canvas.height = 100;
    chart.appendChild(canvas);
    
    parent.appendChild(chart);
    
    const ctx = canvas.getContext('2d');
    
    // Generate initial data points
    const dataPoints = [];
    for (let i = 0; i < 20; i++) {
        dataPoints.push(30 + Math.random() * 40);
    }
    
    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(212, 255, 0, 0.2)';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const y = i * 20 + 10;
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - dataPoints[0]);
        for (let i = 1; i < dataPoints.length; i++) {
            const x = (i / (dataPoints.length - 1)) * canvas.width;
            const y = canvas.height - dataPoints[i];
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#d4ff00';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Fill area under the line
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(212, 255, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(212, 255, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Update data for next frame
        dataPoints.shift();
        dataPoints.push(dataPoints[dataPoints.length - 1] + (Math.random() * 10 - 5));
        
        // Keep values in range
        dataPoints[dataPoints.length - 1] = Math.max(10, Math.min(90, dataPoints[dataPoints.length - 1]));
    }
    
    setInterval(drawChart, 1000);
    drawChart();
}

function createPriceTickers(parent) {
    const ticker = document.createElement('div');
    ticker.className = 'price-ticker';
    ticker.style.position = 'absolute';
    ticker.style.bottom = '20%';
    ticker.style.left = '0';
    ticker.style.width = '100%';
    ticker.style.overflow = 'hidden';
    ticker.style.whiteSpace = 'nowrap';
    ticker.style.color = '#d4ff00';
    ticker.style.fontFamily = 'monospace';
    ticker.style.fontSize = '14px';
    ticker.style.padding = '10px 0';
    ticker.style.borderTop = '1px solid rgba(0, 255, 128, 0.3)';
    ticker.style.borderBottom = '1px solid rgba(0, 255, 128, 0.3)';
    ticker.style.background = 'rgba(1, 26, 18, 0.5)';
    
    parent.appendChild(ticker);
    
    const tickerContent = document.createElement('div');
    tickerContent.style.display = 'inline-block';
    tickerContent.style.animation = 'ticker 30s linear infinite';
    ticker.appendChild(tickerContent);
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
    @keyframes ticker {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
    }`;
    document.head.appendChild(style);
    
    // Create ticker symbols
    const symbols = [
        { name: 'BTC', price: 44000 + Math.random() * 2000 },
        { name: 'ETH', price: 2200 + Math.random() * 200 },
        { name: 'SOL', price: 150 + Math.random() * 20 },
        { name: 'AVAX', price: 30 + Math.random() * 5 },
        { name: 'DOT', price: 15 + Math.random() * 3 },
        { name: 'LINK', price: 18 + Math.random() * 4 },
        { name: 'AAVE', price: 120 + Math.random() * 15 },
        { name: 'UNI', price: 10 + Math.random() * 2 },
        { name: 'SYPH', price: 25 + Math.random() * 5 }
    ];
    
    function updateTicker() {
        tickerContent.innerHTML = '';
        
        symbols.forEach((symbol, index) => {
            // Update price with small random change
            const change = symbol.price * (Math.random() * 0.06 - 0.03);
            symbol.price += change;
            
            const symbolElement = document.createElement('span');
            symbolElement.style.margin = '0 20px';
            
            const direction = change >= 0 ? '▲' : '▼';
            const color = change >= 0 ? '#00ff80' : '#ff3366';
            
            symbolElement.innerHTML = `${symbol.name}: <span style="color: ${color}">${symbol.price.toFixed(2)} ${direction}</span>`;
            
            tickerContent.appendChild(symbolElement);
        });
    }
    
    updateTicker();
    setInterval(updateTicker, 5000);
}

// Handle window resizing
window.addEventListener('resize', () => {
    createDigitalRain();
});
