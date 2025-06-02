import { DouDiZhuGame } from './game.js';
// import { initToolbar } from '@stagewise/toolbar';

// Stagewise Toolbar Integration - temporarily disabled
// const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// if (isDevelopment) {
//   const stagewiseConfig = {
//     plugins: []
//   };
//   initToolbar(stagewiseConfig);
// }

let game;
let backgroundMusic;
let musicToggleButton;
let dragonViewer;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    
    // Check if all required containers exist
    const humanCardsContainer = document.getElementById('human-cards');
    const player1Container = document.getElementById('player1');
    const player2Container = document.getElementById('player2');
    
    console.log('Required containers:');
    console.log('- Human cards container:', humanCardsContainer);
    console.log('- Player 1 container:', player1Container);
    console.log('- Player 2 container:', player2Container);
    
    if (!humanCardsContainer) {
        console.error('ERROR: human-cards container not found!');
        return;
    }
    
    try {
        game = new DouDiZhuGame();
        console.log('Game initialized successfully:', game);
        console.log('Players after init:', game.players);
        console.log('Deck length after init:', game.deck.length);
        
        // Initialize background music
        initializeBackgroundMusic();
        
        // Initialize 3D Dragon Viewer with PROVEN WORKING METHOD
        initializeDragonViewerDirect();
        
        // Force debug after a short delay
        setTimeout(() => {
            console.log('Running debug check...');
            game.debugCheckGameState();
        }, 1000);
        
    } catch (error) {
        console.error('Error initializing game:', error);
        console.error('Error stack:', error.stack);
    }
});

// Direct Dragon Viewer Initialization (PROVEN WORKING METHOD)
async function initializeDragonViewerDirect() {
    console.log('🐉 Initializing Dragon Viewer with PROVEN WORKING ES6 method...');
    
    const canvas = document.getElementById('dragon-canvas');
    const container = document.getElementById('dragon-viewer');
    
    if (!canvas || !container) {
        console.error('❌ Dragon viewer elements not found!');
        return;
    }
    
    try {
        // Use the EXACT SAME method that worked in our test + OrbitControls
        const THREE = await import('https://unpkg.com/three@0.155.0/build/three.module.js');
        const { GLTFLoader } = await import('https://unpkg.com/three@0.155.0/examples/jsm/loaders/GLTFLoader.js');
        const { OrbitControls } = await import('https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js');
        
        console.log('✅ Three.js ES6 modules loaded successfully in main game!');
        console.log('✅ OrbitControls loaded - drag to rotate dragon!');
        
        // Create scene (same as working test)
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true, 
            antialias: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: true
        });
        
        // 设置完全透明的背景
        renderer.setClearColor(0x000000, 0); // 黑色背景，透明度为0
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add lighting (enhanced for larger view)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8); // 增强环境光
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // 增强方向光
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xff6600, 1.0, 100); // 增强点光源
        pointLight.position.set(0, 0, 3);
        scene.add(pointLight);
        
        // 为超大的dragon viewer调整相机位置
        camera.position.set(0, 2, 7); // 进一步后退并抬高，展现全貌
        
        // Add OrbitControls for drag-to-rotate functionality
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Smooth camera movements
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 4; // 适应超大尺寸的最小距离
        controls.maxDistance = 25; // 进一步增加最大距离
        controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation
        controls.target.set(0, 0, 0); // Look at center of scene
        
        console.log('✅ Drag controls enabled! 🖱️ Drag to rotate, scroll to zoom');
        
        console.log('✅ Dragon scene initialized! Loading your dragon.glb...');
        
        // Load dragon.glb (EXACT SAME CODE that worked)
        const loader = new GLTFLoader();
        
        loader.load(
            './images/dragon.glb',
            function(gltf) {
                console.log('🎉 SUCCESS! Your dragon.glb is now rendering in the main game!');
                
                const dragon = gltf.scene;
                dragon.scale.set(3.5, 3.5, 3.5); // 进一步增大龙的尺寸到3.5，更加壮观
                dragon.position.set(0, -2, 0); // 稍微再下移，适应超大区域
                
                // Enable shadows and add glow
                dragon.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        if (child.material) {
                            child.material.emissive = new THREE.Color(0x221100);
                            child.material.emissiveIntensity = 0.2;
                        }
                    }
                });
                
                scene.add(dragon);
                
                // Animate the dragon with interactive controls
                function animate() {
                    requestAnimationFrame(animate);
                    
                    // Update controls for smooth damping
                    controls.update();
                    
                    // Gentle auto-rotation (can be overridden by user dragging)
                    if (!controls.autoRotate) {
                        dragon.rotation.y += 0.003; // Slower auto-rotation
                        dragon.rotation.x = Math.sin(Date.now() * 0.001) * 0.05; // Subtle bobbing
                        dragon.position.y = Math.sin(Date.now() * 0.002) * 0.1 - 1; // Gentle floating
                    }
                    
                    renderer.render(scene, camera);
                }
                animate();
                
                console.log('🐉 Your 15.6MB dragon.glb is successfully integrated and animating!');
                console.log('🖱️ Controls: Left drag = rotate, Right drag = pan, Mouse wheel = zoom');
            },
            function(progress) {
                const percent = Math.round((progress.loaded / progress.total) * 100);
                console.log(`🔄 Loading dragon.glb: ${percent}% (${progress.loaded}/${progress.total} bytes)`);
            },
            function(error) {
                console.error('❌ Error loading dragon.glb in main game:', error);
                console.log('This should not happen since we confirmed the file works...');
            }
        );
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
    } catch (error) {
        console.error('❌ Dragon ES6 import failed in main game:', error);
        
        // Fallback to legacy method
        console.log('🔄 Trying legacy DragonViewer class...');
        if (typeof DragonViewer !== 'undefined') {
            dragonViewer = new DragonViewer();
            console.log('Dragon viewer initialized with legacy method');
        } else {
            console.error('DragonViewer class not found. Dragon will not be displayed.');
        }
    }
}

// Background Music Functions
function initializeBackgroundMusic() {
    backgroundMusic = document.getElementById('background-music');
    musicToggleButton = document.getElementById('music-toggle');
    
    if (!backgroundMusic || !musicToggleButton) {
        console.error('Background music elements not found');
        return;
    }
    
    // Set default volume
    backgroundMusic.volume = 0.3;
    
    // Handle autoplay restrictions
    backgroundMusic.addEventListener('canplaythrough', () => {
        console.log('Background music loaded and ready to play');
        attemptAutoplay();
    });
    
    // Handle play/pause errors
    backgroundMusic.addEventListener('error', (e) => {
        console.error('Error loading background music:', e);
        musicToggleButton.style.display = 'none';
    });
    
    // Music toggle button event
    musicToggleButton.addEventListener('click', toggleMusic);
    
    // Try to start music when user first interacts with the page
    document.addEventListener('click', attemptAutoplay, { once: true });
    document.addEventListener('keydown', attemptAutoplay, { once: true });
    
    console.log('Background music initialized');
}

function attemptAutoplay() {
    if (!backgroundMusic) return;
    
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Background music started successfully');
                updateMusicButton(false); // false = not muted
            })
            .catch((error) => {
                console.log('Autoplay prevented by browser:', error);
                updateMusicButton(true); // true = muted/paused
            });
    }
}

function toggleMusic() {
    if (!backgroundMusic) return;
    
    if (backgroundMusic.paused) {
        backgroundMusic.play()
            .then(() => {
                updateMusicButton(false);
                console.log('Background music resumed');
            })
            .catch((error) => {
                console.error('Error playing background music:', error);
            });
    } else {
        backgroundMusic.pause();
        updateMusicButton(true);
        console.log('Background music paused');
    }
}

function updateMusicButton(isMuted) {
    if (!musicToggleButton) return;
    
    if (isMuted) {
        musicToggleButton.textContent = '🔇';
        musicToggleButton.classList.add('muted');
        musicToggleButton.title = 'Click to enable music';
    } else {
        musicToggleButton.textContent = '🎵';
        musicToggleButton.classList.remove('muted');
        musicToggleButton.title = 'Click to mute music';
    }
}
