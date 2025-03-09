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

// Add event listeners to nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.getAttribute('data-tab');
        changeTab(tabId);
    });
});

// Digital rain effect
function createDigitalRain() {
    const container = document.getElementById('digitalRain');
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

// Smoke effect for atmospheric background
function createSmokeEffect() {
    const smokeContainer = document.createElement('div');
    smokeContainer.className = 'smoke-container';
    smokeContainer.style.position = 'fixed';
    smokeContainer.style.top = '0';
    smokeContainer.style.left = '0';
    smokeContainer.style.width = '100%';
    smokeContainer.style.height = '100%';
    smokeContainer.style.pointerEvents = 'none';
    smokeContainer.style.zIndex = '-2';
    smokeContainer.style.opacity = '0.3';
    document.body.appendChild(smokeContainer);
    
    for (let i = 0; i < 5; i++) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        smoke.style.position = 'absolute';
        smoke.style.width = `${Math.random() * 200 + 100}px`;
        smoke.style.height = `${Math.random() * 200 + 100}px`;
        smoke
