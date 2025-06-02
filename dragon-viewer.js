// 3D Dragon Model Viewer - Updated to use ES6 Modules for reliable GLB loading
class DragonViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.dragon = null;
        this.canvas = document.getElementById('dragon-canvas');
        this.container = document.getElementById('dragon-viewer');
        
        console.log('DragonViewer: Initializing with ES6 module support...');
        console.log('Canvas:', this.canvas);
        console.log('Container:', this.container);
        
        if (this.canvas && this.container) {
            this.init();
            this.loadDragonWithModules();
            this.animate();
        } else {
            console.error('Dragon viewer elements not found!');
        }
    }

    init() {
        console.log('DragonViewer: Setting up Three.js scene...');
        
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 5);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xff6600, 0.8, 100);
        pointLight.position.set(0, 0, 3);
        this.scene.add(pointLight);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        console.log('DragonViewer: Three.js scene initialized successfully');
    }

    async loadDragonWithModules() {
        console.log('DragonViewer: Using ES6 modules to load dragon.glb (PROVEN WORKING METHOD)...');
        console.log('Looking for file at: ./images/dragon.glb');
        
        try {
            // Use dynamic import for Three.js modules (same as working test)
            const THREE = await import('https://unpkg.com/three@0.155.0/build/three.module.js');
            const { GLTFLoader } = await import('https://unpkg.com/three@0.155.0/examples/jsm/loaders/GLTFLoader.js');
            
            console.log('✅ Three.js ES6 modules loaded successfully');
            
            const loader = new GLTFLoader();
            
            loader.load(
                './images/dragon.glb',
                (gltf) => {
                    console.log('🎉 DRAGON.GLB LOADED SUCCESSFULLY WITH ES6 MODULES! Using actual dragon model.');
                    console.log('Dragon model details:', gltf);
                    this.dragon = gltf.scene;
                    this.dragon.scale.set(2, 2, 2);
                    this.dragon.position.set(0, -1, 0);
                    
                    // Enable shadows and effects (same as working test)
                    this.dragon.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            // Add glow effect
                            if (child.material) {
                                child.material.emissive = new THREE.Color(0x221100);
                                child.material.emissiveIntensity = 0.2;
                            }
                        }
                    });
                    
                    this.scene.add(this.dragon);
                    console.log('🐉 Your dragon.glb is now integrated into the card game!');
                },
                (progress) => {
                    const percent = Math.round((progress.loaded / progress.total * 100));
                    console.log(`🔄 Loading dragon.glb: ${percent}% (${progress.loaded}/${progress.total} bytes)`);
                },
                (error) => {
                    console.log('❌ Dragon GLB failed to load with ES6 modules, showing fallback dragon');
                    console.error('ES6 GLB Load error details:', error);
                    console.log('🔄 Switching to procedural fallback dragon...');
                    this.showFallback();
                }
            );
            
        } catch (error) {
            console.error('❌ ES6 module loading failed:', error);
            console.log('🔄 Falling back to old THREE.GLTFLoader method...');
            this.loadDragonLegacy();
        }
    }

    loadDragonLegacy() {
        console.log('DragonViewer: Attempting legacy THREE.GLTFLoader method...');
        
        // Check if THREE.GLTFLoader exists (old method)
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.error('❌ Legacy GLTFLoader not available, showing fallback dragon');
            this.showFallback();
            return;
        }
        
        // Use legacy THREE.GLTFLoader
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            './images/dragon.glb',
            (gltf) => {
                console.log('✅ DRAGON.GLB LOADED with legacy method! Using actual dragon model.');
                console.log('Dragon model details:', gltf);
                this.dragon = gltf.scene;
                this.dragon.scale.set(2, 2, 2);
                this.dragon.position.set(0, -1, 0);
                
                // Enable shadows
                this.dragon.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        // Add some glow effect
                        if (child.material) {
                            child.material.emissive = new THREE.Color(0x221100);
                            child.material.emissiveIntensity = 0.2;
                        }
                    }
                });
                
                this.scene.add(this.dragon);
                console.log('Dragon.glb added to scene with legacy loader');
            },
            (progress) => {
                const percent = Math.round((progress.loaded / progress.total * 100));
                console.log(`🔄 Loading dragon.glb (legacy): ${percent}% (${progress.loaded}/${progress.total} bytes)`);
            },
            (error) => {
                console.log('❌ Legacy dragon GLB failed to load, showing fallback dragon');
                console.error('Legacy GLB Load error details:', error);
                console.log('🔄 Switching to procedural fallback dragon...');
                this.showFallback();
            }
        );
    }

    showFallback() {
        console.log('🔶 DragonViewer: Creating procedural fallback dragon (NOT using dragon.glb)');
        console.log('🔶 This means dragon.glb either failed to load or GLTFLoader is unavailable');
        
        // Create a more elaborate fallback dragon
        const group = new THREE.Group();
        
        // Dragon body (elongated sphere)
        const bodyGeometry = new THREE.SphereGeometry(1, 16, 12);
        bodyGeometry.scale(2, 1, 1.5);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff4400, 
            shininess: 100,
            emissive: 0x221100
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Dragon head
        const headGeometry = new THREE.SphereGeometry(0.8, 12, 10);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(2.5, 0.3, 0);
        group.add(head);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0x440000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(3, 0.6, 0.3);
        group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(3, 0.6, -0.3);
        group.add(rightEye);
        
        // Wings
        const wingGeometry = new THREE.ConeGeometry(1.5, 3, 6);
        const wingMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x994400,
            transparent: true,
            opacity: 0.8 
        });
        
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(0, 1, 2);
        leftWing.rotation.z = Math.PI / 4;
        group.add(leftWing);
        
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(0, 1, -2);
        rightWing.rotation.z = -Math.PI / 4;
        group.add(rightWing);
        
        // Tail
        const tailGeometry = new THREE.ConeGeometry(0.3, 3, 8);
        const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
        tail.position.set(-3, 0, 0);
        tail.rotation.z = Math.PI / 2;
        group.add(tail);
        
        this.dragon = group;
        this.dragon.position.set(0, 0, 0);
        this.scene.add(this.dragon);
        
        console.log('DragonViewer: Fallback dragon created and added to scene');
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.dragon) {
            // Gentle rotation animation
            this.dragon.rotation.y += 0.005;
            this.dragon.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
            
            // Floating effect
            this.dragon.position.y = Math.sin(Date.now() * 0.002) * 0.2 - 0.5;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.container) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

// Remove the automatic initialization since main.js handles it
// This prevents double initialization conflicts 