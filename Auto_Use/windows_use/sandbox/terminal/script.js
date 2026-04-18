document.addEventListener('DOMContentLoaded', () => {
    const outputStream = document.getElementById('outputStream');
    const aiHead = document.getElementById('aiHead');
    const normalEyes = document.getElementById('normalEyes');
    const happyEyes = document.getElementById('happyEyes');
    const globeContainer = document.getElementById('globeContainer');
    const containerAiInput = document.querySelector('.container-ai-input');
    
    let isStreaming = false;
    let isPaused = false;
    let pollInterval = null;
    let idleTimer = null;
    let globeInitialized = false;
    let globeAnimationId = null;
    let globeScene, globeCamera, globeRenderer, globeEarth, globeNetworkGroup, globeParticles, globeLineMesh, globeActivePackets;
    let webAnimationInterval = null;
    const IDLE_TIMEOUT = 800;
    
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Globe initialization function
    const initGlobe = () => {
        if (globeInitialized) return;
        globeInitialized = true;
        
        // Scene setup - transparent background
        globeScene = new THREE.Scene();
        
        globeCamera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
        globeCamera.position.z = 12;
        globeCamera.position.y = 0;
        
        globeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        globeRenderer.setClearColor(0x000000, 0);
        globeRenderer.setSize(100, 100);
        globeRenderer.setPixelRatio(window.devicePixelRatio);
        globeContainer.appendChild(globeRenderer.domElement);
        
        // Texture generation helpers
        const getX = (lon) => (lon + 180) * (4096 / 360);
        const getY = (lat) => ((-lat) + 90) * (2048 / 180);
        
        const drawContinentsPath = (ctx) => {
            ctx.beginPath();
            const drawPoly = (coords) => {
                ctx.moveTo(getX(coords[0][0]), getY(coords[0][1]));
                for (let i = 1; i < coords.length; i++) {
                    ctx.lineTo(getX(coords[i][0]), getY(coords[i][1]));
                }
            };
            drawPoly([[-77, 8], [-75, 11], [-60, 10], [-50, 5], [-35, -5], [-35, -10], [-39, -20], [-40, -30], [-55, -55], [-70, -55], [-75, -50], [-73, -40], [-71, -30], [-75, -20], [-81, -5], [-77, 8]]);
            drawPoly([[-165, 65], [-120, 70], [-90, 75], [-70, 70], [-60, 60], [-55, 52], [-75, 35], [-80, 25], [-82, 9], [-95, 18], [-105, 20], [-125, 35], [-125, 45], [-130, 50], [-165, 65]]);
            drawPoly([[-50, 60], [-40, 65], [-30, 80], [-60, 80], [-50, 60]]);
            drawPoly([[-15, 35], [10, 37], [30, 31], [40, 15], [51, 11], [45, -10], [40, -15], [35, -30], [20, -35], [10, -5], [5, 5], [-10, 5], [-17, 15], [-15, 35]]);
            drawPoly([[43, -25], [50, -15], [49, -12], [44, -22]]);
            drawPoly([[-10, 36], [-9, 43], [0, 50], [10, 55], [25, 70], [40, 65], [35, 45], [25, 35], [15, 40], [10, 45], [5, 42], [-10, 36]]);
            drawPoly([[-5, 50], [2, 51], [0, 58], [-6, 56]]);
            drawPoly([[40, 65], [60, 75], [100, 75], [170, 70], [140, 50], [130, 40], [120, 30], [120, 20], [110, 10], [100, 15], [90, 22], [80, 5], [70, 10], [60, 25], [50, 30], [40, 45], [40, 65]]);
            drawPoly([[130, 32], [138, 36], [142, 40], [140, 45], [135, 35]]);
            drawPoly([[100, 0], [110, -5], [140, -5], [150, -10], [130, 0]]);
            drawPoly([[113, -25], [130, -12], [145, -10], [153, -25], [150, -38], [135, -35], [115, -35], [113, -25]]);
            drawPoly([[166, -45], [174, -35], [178, -38], [168, -47]]);
            ctx.closePath();
        };
        
        // Color texture
        const createColorTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 4096; canvas.height = 2048;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 4096, 2048);
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 30;
            ctx.fillStyle = '#dcdcdc';
            ctx.strokeStyle = '#555555';
            ctx.lineWidth = 4;
            ctx.lineJoin = 'round';
            drawContinentsPath(ctx);
            ctx.fill();
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-atop';
            for (let i = 0; i < 2000; i++) {
                const x = Math.random() * 4096;
                const y = Math.random() * 2048;
                const r = 5 + Math.random() * 20;
                ctx.fillStyle = 'rgba(200, 200, 200, 0.1)';
                ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
            }
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let x = 0; x < 4096; x += 60) { ctx.moveTo(x, 0); ctx.lineTo(x, 2048); }
            for(let y = 0; y < 2048; y += 60) { ctx.moveTo(0, y); ctx.lineTo(4096, y); }
            ctx.stroke();
            return new THREE.CanvasTexture(canvas);
        };
        
        // Height texture
        const createHeightTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 4096; canvas.height = 2048;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 4096, 2048);
            ctx.save();
            drawContinentsPath(ctx);
            ctx.clip();
            ctx.fillStyle = '#808080';
            ctx.fillRect(0, 0, 4096, 2048);
            for (let i = 0; i < 10000; i++) {
                const x = Math.random() * 4096;
                const y = Math.random() * 2048;
                const radius = 5 + Math.random() * 30;
                const shade = Math.floor(100 + Math.random() * 155);
                const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
                grad.addColorStop(0, `rgba(${shade}, ${shade}, ${shade}, 0.5)`);
                grad.addColorStop(1, `rgba(${shade}, ${shade}, ${shade}, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 2;
            drawContinentsPath(ctx);
            ctx.stroke();
            ctx.restore();
            return new THREE.CanvasTexture(canvas);
        };
        
        // Earth - scaled down
        const earthGeo = new THREE.SphereGeometry(4, 128, 128);
        const earthMat = new THREE.MeshPhongMaterial({
            map: createColorTexture(),
            displacementMap: createHeightTexture(),
            displacementScale: 0.5,
            displacementBias: 0,
            color: 0xffffff,
            specular: 0x333333,
            shininess: 8
        });
        globeEarth = new THREE.Mesh(earthGeo, earthMat);
        globeScene.add(globeEarth);
        
        // Atmosphere - scaled down
        const atmGeo = new THREE.SphereGeometry(4.2, 64, 64);
        const atmMat = new THREE.MeshBasicMaterial({
            color: 0x888888,
            transparent: true,
            opacity: 0.05,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmGeo, atmMat);
        globeScene.add(atmosphere);
        
        // Network - scaled down
        const particlesCount = 100;
        const connectionDistance = 2.5;
        const sphereRadius = 4.4;
        
        globeNetworkGroup = new THREE.Group();
        globeScene.add(globeNetworkGroup);
        
        const packetColors = [0x222222, 0x333333, 0x111111];
        const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
        globeParticles = [];
        
        for (let i = 0; i < particlesCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particlesCount);
            const theta = Math.sqrt(particlesCount * Math.PI) * phi;
            const greyVal = 0.5 + Math.random() * 0.3;
            const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(greyVal, greyVal, greyVal) });
            const mesh = new THREE.Mesh(particleGeo, mat);
            mesh.position.setFromSphericalCoords(sphereRadius, phi, theta);
            mesh.position.x += (Math.random() - 0.5) * 0.2;
            mesh.position.y += (Math.random() - 0.5) * 0.2;
            mesh.position.z += (Math.random() - 0.5) * 0.2;
            mesh.userData = {
                velocity: new THREE.Vector3((Math.random() - 0.5) * 0.005, (Math.random() - 0.5) * 0.005, (Math.random() - 0.5) * 0.005),
                packetColor: packetColors[Math.floor(Math.random() * packetColors.length)]
            };
            globeNetworkGroup.add(mesh);
            globeParticles.push(mesh);
        }
        
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x999999, transparent: true, opacity: 0.2 });
        globeLineMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
        globeNetworkGroup.add(globeLineMesh);
        
        // Packets - scaled down
        const packetGeo = new THREE.BufferGeometry();
        const packetMat = new THREE.PointsMaterial({
            size: 0.16,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            map: (() => {
                const canvas = document.createElement('canvas');
                canvas.width = 32; canvas.height = 32;
                const ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.arc(16, 16, 14, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();
                return new THREE.CanvasTexture(canvas);
            })()
        });
        const packetSystem = new THREE.Points(packetGeo, packetMat);
        globeNetworkGroup.add(packetSystem);
        globeActivePackets = [];
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        globeScene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(20, 10, 20);
        globeScene.add(dirLight);
        const rimLight = new THREE.DirectionalLight(0xeeeeee, 0.3);
        rimLight.position.set(-10, 10, -20);
        globeScene.add(rimLight);
        
        // Animation
        const animateGlobe = () => {
            globeAnimationId = requestAnimationFrame(animateGlobe);
            
            globeEarth.rotation.y += 0.002;
            globeNetworkGroup.rotation.y += 0.0022;
            
            const linePositions = [];
            const connections = [];
            
            globeParticles.forEach((p) => {
                p.position.add(p.userData.velocity);
                p.position.normalize().multiplyScalar(sphereRadius);
            });
            
            for (let i = 0; i < globeParticles.length; i++) {
                for (let j = i + 1; j < globeParticles.length; j++) {
                    const dist = globeParticles[i].position.distanceTo(globeParticles[j].position);
                    if (dist < connectionDistance) {
                        linePositions.push(
                            globeParticles[i].position.x, globeParticles[i].position.y, globeParticles[i].position.z,
                            globeParticles[j].position.x, globeParticles[j].position.y, globeParticles[j].position.z
                        );
                        connections.push({ start: globeParticles[i].position, end: globeParticles[j].position, color: globeParticles[i].userData.packetColor });
                    }
                }
            }
            
            globeLineMesh.geometry.dispose();
            const lineGeo = new THREE.BufferGeometry();
            lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            globeLineMesh.geometry = lineGeo;
            
            for (let k = 0; k < 5; k++) {
                if (Math.random() > 0.5 && connections.length > 0) {
                    const route = connections[Math.floor(Math.random() * connections.length)];
                    globeActivePackets.push({ start: route.start, end: route.end, progress: 0, speed: 0.01 + Math.random() * 0.02, color: new THREE.Color(route.color) });
                }
            }
            
            const packetPositions = [];
            const packetColorsArr = [];
            
            for (let i = globeActivePackets.length - 1; i >= 0; i--) {
                const pkt = globeActivePackets[i];
                pkt.progress += pkt.speed;
                if (pkt.progress >= 1) { globeActivePackets.splice(i, 1); continue; }
                const x = THREE.MathUtils.lerp(pkt.start.x, pkt.end.x, pkt.progress);
                const y = THREE.MathUtils.lerp(pkt.start.y, pkt.end.y, pkt.progress);
                const z = THREE.MathUtils.lerp(pkt.start.z, pkt.end.z, pkt.progress);
                packetPositions.push(x, y, z);
                packetColorsArr.push(pkt.color.r, pkt.color.g, pkt.color.b);
            }
            
            packetGeo.setAttribute('position', new THREE.Float32BufferAttribute(packetPositions, 3));
            packetGeo.setAttribute('color', new THREE.Float32BufferAttribute(packetColorsArr, 3));
            
            globeRenderer.render(globeScene, globeCamera);
        };
        
        animateGlobe();
    };
    
    const resetIdleTimer = () => {
        if (idleTimer) {
            clearTimeout(idleTimer);
        }
        idleTimer = setTimeout(() => {
            if (!isPaused) {
                setThinkingState('thinking-straight');
            }
        }, IDLE_TIMEOUT);
    };

    const ALL_HEAD_STATES = [
        'thinking-straight', 'thinking-left', 'thinking-right', 'thinking-up',
        'thinking-left-up', 'thinking-right-up',
        'thinking-left-down', 'thinking-slight-left-down', 'thinking-down', 
        'thinking-slight-right-down', 'thinking-right-down'
    ];
    
    const PONDERING_STATES = [
        'thinking-straight', 'thinking-left', 'thinking-right', 'thinking-up',
        'thinking-left-up', 'thinking-right-up'
    ];
    
    const setThinkingState = (state) => {
        aiHead.classList.remove(...ALL_HEAD_STATES);
        if (state) {
            aiHead.classList.add(state);
        }
    };
    
    const getRandomPonderingState = (excludeState) => {
        const available = PONDERING_STATES.filter(s => s !== excludeState);
        return available[Math.floor(Math.random() * available.length)];
    };
    
    const runPonderingSequence = async () => {
        isPaused = true;
        if (idleTimer) clearTimeout(idleTimer);
        
        let currentState = null;
        for (let i = 0; i < 3; i++) {
            currentState = getRandomPonderingState(currentState);
            setThinkingState(currentState);
            await sleep(600 + Math.random() * 400);
        }
        
        setThinkingState(null);
        isPaused = false;
    };
    
    const runReadingSequence = async () => {
        isPaused = true;
        if (idleTimer) clearTimeout(idleTimer);
        
        setThinkingState('thinking-left-down');
        await sleep(300);
        
        setThinkingState('thinking-slight-left-down');
        await sleep(250);
        
        setThinkingState('thinking-down');
        await sleep(300);
        
        setThinkingState('thinking-slight-right-down');
        await sleep(250);
        
        setThinkingState('thinking-right-down');
        await sleep(300);
        
        setThinkingState('thinking-slight-right-down');
        await sleep(200);
        
        setThinkingState('thinking-down');
        await sleep(200);
        
        setThinkingState(null);
        isPaused = false;
    };
    
    // Web search animation - show globe, shift AI head right, look left with eyes closed
    const startWebAnimation = () => {
        if (idleTimer) clearTimeout(idleTimer);
        
        if (webAnimationInterval) {
            clearTimeout(webAnimationInterval);
            webAnimationInterval = null;
        }
        
        initGlobe();
        
        globeContainer.classList.add('visible');
        containerAiInput.classList.add('web-active');
        
        // Look left at globe with eyes closed (like memory)
        aiHead.classList.add('looking-at-globe');
        closeEyes();
    };
    
    // End web search animation
    const endWebAnimation = async () => {
        if (!globeContainer.classList.contains('visible')) {
            return;
        }
        
        if (webAnimationInterval) {
            clearTimeout(webAnimationInterval);
            webAnimationInterval = null;
        }
        
        aiHead.classList.remove('looking-at-globe');
        openEyes();
        
        globeContainer.classList.remove('visible');
        containerAiInput.classList.remove('web-active');
        
        await sleep(600);
    };
    
    // Start streaming mode
    const startStreamingMode = () => {
        aiHead.classList.add('streaming');
    };
    
    // End streaming mode
    const endStreamingMode = () => {
        aiHead.classList.remove('streaming');
    };
    
    // Close eyes effect
    const closeEyes = () => {
        aiHead.classList.add('eyes-closed');
        normalEyes.style.display = 'none';
        happyEyes.style.display = 'flex';
    };
    
    // Open eyes
    const openEyes = () => {
        aiHead.classList.remove('eyes-closed');
        normalEyes.style.display = '';
        happyEyes.style.display = '';
    };

    // Check if content has error/failed status
    const hasError = (content) => {
        const lowerContent = content.toLowerCase();
        return lowerContent.includes('status: failed') || 
               lowerContent.includes('status: error') ||
               lowerContent.includes('"status": "failed"') ||
               lowerContent.includes('"status": "error"');
    };

    // Render message to output stream
    const renderMessage = async (msg) => {
        const { type, content } = msg;
        
        if (globeContainer.classList.contains('visible') && 
            type !== 'web_start' && type !== 'web_end') {
            await endWebAnimation();
        }
        
        // Handle thinking block
        if (type === 'thinking') {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'log-line thinking-block';
            headerDiv.style.fontWeight = 'bold';
            headerDiv.style.marginTop = '10px';
            headerDiv.textContent = '🧠 Thinking';
            outputStream.appendChild(headerDiv);
            
            const lines = content.split('\n');
            for (const line of lines) {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'log-line thinking-block';
                lineDiv.textContent = line || ' ';
                outputStream.appendChild(lineDiv);
            }
            
            outputStream.scrollTop = outputStream.scrollHeight;
            await runPonderingSequence();
            return;
        }
        
        // Handle current_goal block
        if (type === 'current_goal') {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'log-line goal-block';
            headerDiv.style.fontWeight = 'bold';
            headerDiv.style.marginTop = '8px';
            headerDiv.textContent = '🎯 Goal';
            outputStream.appendChild(headerDiv);
            
            const lineDiv = document.createElement('div');
            lineDiv.className = 'log-line goal-block';
            lineDiv.textContent = content;
            outputStream.appendChild(lineDiv);
            
            outputStream.scrollTop = outputStream.scrollHeight;
            await runPonderingSequence();
            return;
        }
        
        // Handle memory block
        if (type === 'memory') {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'log-line memory-block';
            headerDiv.style.fontWeight = 'bold';
            headerDiv.style.marginTop = '8px';
            headerDiv.textContent = '💾 Memory';
            outputStream.appendChild(headerDiv);
            
            const lineDiv = document.createElement('div');
            lineDiv.className = 'log-line memory-block';
            lineDiv.textContent = content;
            outputStream.appendChild(lineDiv);
            
            outputStream.scrollTop = outputStream.scrollHeight;
            
            isPaused = true;
            if (idleTimer) clearTimeout(idleTimer);
            closeEyes();
            setThinkingState('thinking-straight');
            await sleep(800);
            setThinkingState('thinking-up');
            await sleep(600);
            setThinkingState('thinking-straight');
            await sleep(400);
            openEyes();
            setThinkingState(null);
            
            isPaused = false;
            return;
        }
        
        // Handle shell_command
        if (type === 'shell_command') {
            const { cwd, command, output, status } = content;
            
            const promptDiv = document.createElement('div');
            promptDiv.className = 'log-line ps-prompt';
            promptDiv.textContent = `PS ${cwd}>`;
            outputStream.appendChild(promptDiv);
            
            const cmdDiv = document.createElement('div');
            cmdDiv.className = 'log-line ps-command';
            cmdDiv.textContent = command;
            outputStream.appendChild(cmdDiv);
            
            if (output) {
                const lines = output.split('\n');
                for (const line of lines) {
                    const lineDiv = document.createElement('div');
                    lineDiv.className = 'log-line ps-output';
                    lineDiv.textContent = line || ' ';
                    outputStream.appendChild(lineDiv);
                }
            }
            
            if (status) {
                const statusDiv = document.createElement('div');
                statusDiv.className = status === 'success' ? 'log-line ps-status-success' : 'log-line ps-status-failed';
                statusDiv.textContent = status === 'success' ? '✓' : `✗ ${status}`;
                outputStream.appendChild(statusDiv);
            }
            
            outputStream.scrollTop = outputStream.scrollHeight;
            await runReadingSequence();
            return;
        }
        
        // Handle web search start
        if (type === 'web_start') {
            const webDiv = document.createElement('div');
            webDiv.className = 'log-line';
            webDiv.style.color = '#33ccff';
            webDiv.style.fontWeight = 'bold';
            webDiv.style.marginTop = '8px';
            webDiv.textContent = `🌐 Web Search: ${content}`;
            outputStream.appendChild(webDiv);
            outputStream.scrollTop = outputStream.scrollHeight;
            
            startWebAnimation();
            return;
        }
        
        // Handle web search end
        if (type === 'web_end') {
            const webEndDiv = document.createElement('div');
            webEndDiv.className = 'log-line';
            webEndDiv.style.color = '#66dbd6';
            webEndDiv.textContent = `✓ Web search complete`;
            outputStream.appendChild(webEndDiv);
            outputStream.scrollTop = outputStream.scrollHeight;
            
            await endWebAnimation();
            return;
        }
        
        // Handle exit
        if (type === 'exit') {
            const exitDiv = document.createElement('div');
            exitDiv.className = 'log-line';
            exitDiv.style.color = '#c1ff5c';
            exitDiv.style.marginTop = '10px';
            exitDiv.textContent = `✅ Exit: ${content}`;
            outputStream.appendChild(exitDiv);
            outputStream.scrollTop = outputStream.scrollHeight;
            
            endStreamingMode();
            if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
            }
            return;
        }
        
        // Handle error
        if (type === 'error') {
            closeEyes();
            aiHead.classList.add('warning-straight');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'log-line';
            errorDiv.style.color = '#e64565';
            errorDiv.style.fontWeight = 'bold';
            errorDiv.textContent = `❌ Error: ${content}`;
            outputStream.appendChild(errorDiv);
            outputStream.scrollTop = outputStream.scrollHeight;
            
            await sleep(2000);
            openEyes();
            aiHead.classList.remove('warning-straight');
            return;
        }
    };

    // Poll for new messages from pywebview API
    const pollMessages = async () => {
        try {
            if (window.pywebview && window.pywebview.api) {
                const messages = await window.pywebview.api.get_messages();
                
                if (messages && messages.length > 0) {
                    if (!isStreaming) {
                        isStreaming = true;
                        startStreamingMode();
                    }
                    
                    resetIdleTimer();
                    
                    for (const msg of messages) {
                        await renderMessage(msg);
                    }
                    
                    resetIdleTimer();
                }
            }
        } catch (err) {
            console.error('Error polling messages:', err);
        }
    };
    
    // Start polling when pywebview is ready
    const startPolling = () => {
        const initDiv = document.createElement('div');
        initDiv.className = 'log-line';
        initDiv.style.color = '#66dbd6';
        initDiv.textContent = '🚀 CLI Agent Terminal Ready...';
        outputStream.appendChild(initDiv);
        
        startStreamingMode();
        
        pollInterval = setInterval(pollMessages, 100);
    };
    
    // Wait for pywebview to be ready
    if (window.pywebview) {
        startPolling();
    } else {
        window.addEventListener('pywebviewready', startPolling);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            isPaused = !isPaused;
        }
        if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            outputStream.innerHTML = '';
        }
    });
});