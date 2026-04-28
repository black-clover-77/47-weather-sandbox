const canvas = document.getElementById('sandbox-canvas');
const ctx = canvas.getContext('2d');
const toolBtns = document.querySelectorAll('.tool-btn');
const audio = document.getElementById('bg-audio');
const audioToggle = document.getElementById('audio-toggle');

let particles = [];
let currentTool = 'rain';
let isPainting = false;
let isAudioPlaying = false;

const weather = {
    rain: { color: '#00d4ff', size: 2, speed: 10, audio: 'https://cdn.pixabay.com/audio/2022/03/10/audio_51a33a1e9a.mp3' },
    snow: { color: '#fff', size: 3, speed: 2, audio: 'https://cdn.pixabay.com/audio/2022/03/15/audio_2d8a4a1e9a.mp3' },
    lightning: { color: '#ffff00', size: 5, speed: 0, audio: 'https://cdn.pixabay.com/audio/2021/11/25/audio_1e3a9a1e9a.mp3' }
};

class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = weather[type].size;
        this.vy = weather[type].speed;
        this.opacity = 1;
    }
    update() {
        if (this.type === 'lightning') {
            this.opacity -= 0.05;
        } else {
            this.y += this.vy;
        }
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = weather[this.type].color;
        if (this.type === 'lightning') {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ffff00';
            ctx.fillRect(this.x, 0, 2, canvas.height);
            ctx.shadowBlur = 0;
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function init() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    document.getElementById('loader').classList.add('hidden');
    animate();
}

function animate() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.y > canvas.height || p.opacity <= 0) {
            particles.splice(i, 1);
        }
    });
    
    requestAnimationFrame(animate);
}

canvas.addEventListener('mousedown', () => isPainting = true);
window.addEventListener('mouseup', () => isPainting = false);
canvas.addEventListener('mousemove', (e) => {
    if (isPainting && currentTool !== 'clear') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(x + Math.random() * 20 - 10, y, currentTool));
        }
    }
});

toolBtns.forEach(btn => {
    btn.onclick = () => {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.type;
        if (currentTool === 'clear') particles = [];
    };
});

audioToggle.onclick = () => {
    if (isAudioPlaying) {
        audio.pause();
        audioToggle.textContent = '🎵';
    } else {
        audio.src = weather[currentTool].audio;
        audio.play();
        audioToggle.textContent = '🔊';
    }
    isAudioPlaying = !isAudioPlaying;
};

window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

init();