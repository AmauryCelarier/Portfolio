import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const apiUrl = import.meta.env.VITE_API_URL;

const scene = new THREE.Scene();
const loadingManager = new THREE.LoadingManager();
const loader = new GLTFLoader(loadingManager);  
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Sidebar
const sidebar = document.getElementById('sidebar');
const toggleSidebarButton = document.getElementById('toggle-sidebar');
const sidebarTitle = document.getElementById("sidebar-title");
const categoryLinks = document.querySelectorAll(".sidebar a");

// Largeur de la sidebar
const sidebarWidth = 600;

// Bascule l'état de la sidebar et déplace le bouton
toggleSidebarButton.addEventListener('click', () => {
    const isOpen = sidebar.style.left === '0px';
    isOpen ? closeSidebar() : openSidebar();
});

function openSidebar() {
    sidebar.style.left = '0px';                            // Ouvre la sidebar
    toggleSidebarButton.style.left = `${sidebarWidth + 15}px`;  // Place le bouton à droite
    toggleSidebarButton.classList.add('active');           // Ajoute la classe active (ex: pour tourner une flèche)
}

function closeSidebar() {
    sidebar.style.left = `-${sidebarWidth}px`;             // Ferme la sidebar en la décalant à gauche
    toggleSidebarButton.style.left = '15px';               // Ramène le bouton à gauche
    toggleSidebarButton.classList.remove('active');        // Retire la classe active
}

sidebar.addEventListener("mouseenter", () => {
    const canvas = document.getElementById("webgl-container");
    canvas.style.pointerEvents = 'none';
});
sidebar.addEventListener("mouseleave", () => {
    const canvas = document.getElementById("webgl-container");
    canvas.style.pointerEvents = 'auto';
});

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Fond transparent
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optionnel : améliore la qualité des ombres
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;


// Position initiale de la caméra
let cameraDistance = 30; // Distance initiale de la caméra
camera.position.set(0, cameraDistance, 10);  // Position initiale de la caméra
let x_camcenter = 0;
let y_camcenter = 0;
let z_camcenter = 0;
camera.lookAt(x_camcenter, y_camcenter, z_camcenter);  // Regarder le centre de la scène
let isCameraUpdate = true;

// Lumière
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(40, 30, 40); // Positionner la lumière au-dessus et sur le côté
directionalLight.castShadow = true; // Activer les ombres
directionalLight.intensity = 1.2; // Double l'intensité (1 est la valeur par défaut)
scene.add(directionalLight);
directionalLight.shadow.mapSize.width = 2048; // Résolution des ombres (augmenter pour une meilleure qualité)
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5; // Distance proche du rendu des ombres
directionalLight.shadow.camera.far = 1000; // Distance éloignée du rendu des ombres

const d = 50; // Taille de la boîte d'ombre
directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;

directionalLight.shadow.bias = -0.0002;
directionalLight.shadow.normalBias = 0.01;   


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Plus clair, mieux réparti
scene.add(ambientLight);

// Raycaster et souris
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Ajouter le rendu à la div
const container = document.getElementById('webgl-container');
container.appendChild(renderer.domElement);


let totalModels = 0;
let loadedModels = 0;

function loadModel(path, position, rotation, scale, name = '', onLoaded = () => {}) {
    loader.load(path, (gltf) => {
        const model = gltf.scene;
        model.position.set(...position);
        model.rotation.set(...rotation);
        model.scale.set(...scale);
        if (name) model.name = name;
        scene.add(model);
        onLoaded(model);

        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                // Traitement spécial pour l'écran de l'ordi
                if (name === 'computer' && child.name === 'Cube002') {
                    const textureLoader = new THREE.TextureLoader();
                    textureLoader.load("images/veille.jpeg", (texture) => {
                        texture.encoding = THREE.sRGBEncoding;
                        child.material.map = texture;
                        child.material.emissive = new THREE.Color(0xffff00);
                        child.material.emissiveMap = texture;
                        texture.wrapS = THREE.ClampToEdgeWrapping;
                        texture.wrapT = THREE.ClampToEdgeWrapping;
                        texture.minFilter = THREE.LinearFilter;
                        texture.repeat.set(1, texture.image.height / texture.image.width);
                        texture.offset.set(0, (1 - texture.repeat.y) / 2);
                        child.material.needsUpdate = true;
                    });
                }
            } 
        });

        loadedModels++;
        updateLoadingBar();

        console.log()
        if (loadedModels === totalModels) {
            onAllModelsLoaded(); 
        }
    }, undefined, 
        function (error) {
            console.error(`Erreur lors du chargement de ${path}:`, error);
        }
    );
}



function updateLoadingBar() {
    const progress = loadedModels / totalModels;
    const loadingBar = document.querySelector('#progress-bar > div');
    if (loadingBar) {
        loadingBar.style.width = `${progress * 100}%`;
    }
}

function onAllModelsLoaded() {
    const loadingScreen = document.querySelector('#loading-screen');
    const startButton = document.querySelector('#start-button');
    const progressBar = document.querySelector('#progress-bar');
    const chargementText = document.querySelector('#chargement-text');

    if (loadingScreen && startButton) {
        startButton.style.display = 'block';
        loadingScreen.classList.add('ready'); 
        progressBar.style.display = 'none';
        chargementText.style.display = 'none';
    }
}

let base, mushroom, instagram, gmail, linkedin, github, computer, tele, CV, trophee, skills, volley;

totalModels = 12;
loadModel('/model_3D/scene.glb', [0, 0, 0], [0, 0, 0], [0.3, 0.3, 0.3], '', (model) => base = model);
loadModel('/model_3D/Champignon.glb', [-9, 3, 8.5], [0, Math.PI / 2, 0], [0.3, 0.3, 0.3], '', (model) => mushroom = model);
loadModel('/model_3D/instagram.glb', [-4, 1.95, -10], [0, 0, 0], [0.75, 0.75, 0.75], '', (model) => instagram = model);
loadModel('/model_3D/gmail.glb', [0, 1.75, -10], [0, 0, 0], [1.5, 1.5, 1.5], '', (model) => gmail = model);
loadModel('/model_3D/linkedin.glb', [-3.5, 3.55, -10], [0, 0, 0], [0.75, 0.75, 0.75], '', (model) => linkedin = model);
loadModel('/model_3D/github.glb', [-1.5, 3.55, -10], [0, 0, 0], [0.75, 0.75, 0.75], '', (model) => github = model);
loadModel('/model_3D/computer.glb', [5, 3.9, -9], [0, -Math.PI / 2, 0], [1, 1, 1], 'computer', (model) => {
    computer = model;
    applyScreensaver();
});
loadModel('/model_3D/TV.glb', [-10.75, 7.5, 4.5], [0, 0, 0], [0.3, 0.3, 0.3], '', (model) => tele = model);
loadModel('/model_3D/CV.glb', [1.5, 3.65, -4.5], [0, 0, 0], [0.3, 0.3, 0.3], '', (model) => CV = model);
loadModel('/model_3D/trophee.glb', [8.5, 7.35, -10.2], [0, 0, 0], [0.3, 0.3, 0.3], '', (model) => trophee = model);
loadModel('/model_3D/skills.glb', [5.5, 9, -10.2], [0, 0, 0], [0.3, 0.3, 0.3], '', (model) => skills = model);
loadModel('/model_3D/volleyball.glb', [-8.5, 1.75, -1], [0, 0, 0], [0.3, 0.3, 0.3], '', (model) => volley = model);

    const interactiveObjects = [
        {
            name: "Télé",
            description: "Contient mes tops 10",
            action: focusOnTele
        },
        {
            name: "Trophée",
            description: "Mon rôle au BDE ASCII",
            action: focusOnTrophee
        },
        {
            name: "Livre",
            description: "Mes compétences et logiciels",
            action: focusOnSkills
        },
        {
            name: "Ballon de Volley",
            description: "Ma passion pour le volleyball",
            action: focusOnVolley
        },
        {
            name: "Champignon",
            description: "Accès à mon parcours",
            action: focusOnMushroom
        }
    ];

document.querySelector('#start-button').addEventListener('click', () => {
    const loadingScreen = document.querySelector('#loading-screen');
    loadingScreen.style.display = 'none'; // Masquer le loading-screen
});

// Variables pour gérer la rotation de la caméra
let isMouseDown = false; // Pour suivre si la souris est enfoncée
let rotationSpeed = 0.005; // Vitesse de rotation
let mouseX = 0; // Position X actuelle de la souris
let mouseY = 0; // Position Y actuelle de la souris
let targetRotationX = 0.1; // Rotation cible en X
let targetRotationY = 0; // Rotation cible en Y
let isZoomDisabled = false; // Ajout d'une variable pour désactiver le zoom

// Limites pour l'angle vertical
const minVerticalAngle = 0.1; // Limite vers le bas (4°)
const maxVerticalAngle = Math.PI / 2; // Limite vers le haut (45°)

// Variables pour la gestion tactile
let isTouching = false;
let touchStartDistance = 0; // Pour le pinch-to-zoom
let lastTouchX = 0;
let lastTouchY = 0;

// ===== GESTION SOURIS =====

// Gestion des événements souris
window.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
});


window.addEventListener('mouseup', () => {
    isMouseDown = false;
});

window.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        let deltaX = event.clientX - mouseX;
        let deltaY = event.clientY - mouseY;

        // Inversion du mouvement horizontal pour correspondre au clic gauche -> mouvement à gauche
        targetRotationY -= deltaX * rotationSpeed; // Inversé ici
        targetRotationX += deltaY * rotationSpeed; // Rotation verticale normale

        // Limiter la rotation verticale pour éviter un retournement complet
        targetRotationX = Math.max(minVerticalAngle, Math.min(maxVerticalAngle, targetRotationX));

        mouseX = event.clientX;
        mouseY = event.clientY;
    }
});

// Ajouter un écouteur d'événement pour détecter les clics
window.addEventListener('click', onMouseClick, false);

// Gestion du zoom avec la molette
window.addEventListener('wheel', (event) => {
    if (!isZoomDisabled) { 
        const zoomSpeed = 0.2; // Facteur de zoom
        cameraDistance += event.deltaY * zoomSpeed * 0.05;

        // Limiter la distance de zoom pour éviter un zoom excessif
        cameraDistance = Math.max(18, Math.min(50, cameraDistance));
    }
});

// ===== GESTION TACTILE ===== 

// Fonction pour calculer la distance entre deux touches
function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

window.addEventListener('touchstart', (event) => {
    event.preventDefault(); // Empêche le comportement par défaut (scroll, zoom du navigateur)
    
    if (event.touches.length === 1) {
        // Un seul doigt : rotation
        isTouching = true;
        lastTouchX = event.touches[0].clientX;
        lastTouchY = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
        // Deux doigts : zoom (pinch)
        isTouching = false; // Désactiver la rotation pendant le zoom
        touchStartDistance = getTouchDistance(event.touches);
    }
});

window.addEventListener('touchmove', (event) => {
    event.preventDefault();
    
    if (event.touches.length === 1 && isTouching) {
        // Rotation avec un doigt
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        
        const deltaX = touchX - lastTouchX;
        const deltaY = touchY - lastTouchY;
        
        // Même logique que pour la souris
        targetRotationY -= deltaX * rotationSpeed;
        targetRotationX += deltaY * rotationSpeed;
        
        // Limiter la rotation verticale
        targetRotationX = Math.max(minVerticalAngle, Math.min(maxVerticalAngle, targetRotationX));
        
        lastTouchX = touchX;
        lastTouchY = touchY;
        
    } else if (event.touches.length === 2 && !isZoomDisabled) {
        // Zoom avec deux doigts (pinch)
        const currentDistance = getTouchDistance(event.touches);
        const deltaDistance = currentDistance - touchStartDistance;
        
        const zoomSpeed = 0.01; // Vitesse de zoom tactile (plus lente que la molette)
        cameraDistance -= deltaDistance * zoomSpeed;
        cameraDistance = Math.max(18, Math.min(50, cameraDistance));
        
        touchStartDistance = currentDistance;
    }
});

window.addEventListener('touchend', (event) => {
    event.preventDefault();
    
    if (event.touches.length === 0) {
        // Plus de doigts sur l'écran
        isTouching = false;
    } else if (event.touches.length === 1) {
        // Il reste un doigt : reprendre la rotation
        isTouching = true;
        lastTouchX = event.touches[0].clientX;
        lastTouchY = event.touches[0].clientY;
    }
});

// Empêcher le comportement par défaut sur touchcancel
window.addEventListener('touchcancel', (event) => {
    event.preventDefault();
    isTouching = false;
});

window.addEventListener('touchend', (event) => {
    // Si c'est un tap simple (pas un drag), on peut déclencher onMouseClick
    if (event.changedTouches.length === 1 && !event.defaultPrevented) {
        const touch = event.changedTouches[0];
        // Créer un objet similaire à un événement de souris
        const fakeMouseEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            preventDefault: () => {}
        };
        onMouseClick(fakeMouseEvent);
    }
});

// Fonction pour mettre à jour la position de la caméra
function updateCameraRotation(x_camcenter,y_camcenter,z_camcenter) {
    camera.position.x = cameraDistance * Math.sin(targetRotationY) * Math.cos(targetRotationX);
    camera.position.y = cameraDistance * Math.sin(targetRotationX);
    camera.position.z = cameraDistance * Math.cos(targetRotationY) * Math.cos(targetRotationX);
    camera.lookAt(x_camcenter, y_camcenter, z_camcenter); // La caméra regarde toujours le centre de la scène
}

// Animation
function animate() {

    if(isCameraUpdate)
        updateCameraRotation(x_camcenter,y_camcenter,z_camcenter); // Mise à jour de la caméra
    renderer.render(scene, camera);

    if (currentModel) {
        currentModel.rotation.y -= 0.01; // Tourne lentement autour de l'axe Y
    }
    
}
renderer.setAnimationLoop(animate);


// Fonction pour détecter le clic
function onMouseClick(event) {
    const isOverSidebar = event.target.closest('.sidebar');
    if (isOverSidebar) return;

    // Calculer la position de la souris dans les coordonnées normalisées
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le raycaster avec la position de la souris
    raycaster.setFromCamera(mouse, camera);

    //Clique sur différents objets

    const baseClicked = raycaster.intersectObject(base);
    const mushroomClicked = raycaster.intersectObject(mushroom);
    const instagramClicked = raycaster.intersectObject(instagram);
    const gmailClicked = raycaster.intersectObject(gmail);
    const linkedinClicked = raycaster.intersectObject(linkedin);
    const githubClicked = raycaster.intersectObject(github);
    const computerClicked = raycaster.intersectObject(computer);
    const teleClicked = raycaster.intersectObject(tele);
    const CVClicked = raycaster.intersectObject(CV);
    const tropheeClicked = raycaster.intersectObject(trophee);
    const bookClicked = raycaster.intersectObject(skills);
    const volleyClicked = raycaster.intersectObject(volley);

    if (instagramClicked.length >0){
        if(isZoomDisabled)
            window.open("https://www.instagram.com/amaury3d_art/", "_blank");
        contactLink.click();
    }
    else if (gmailClicked.length >0){
        if(isZoomDisabled)
            window.open("mailto:amaury.clrr@gmail.com", "_blank");
        contactLink.click();
    }
    else if (linkedinClicked.length >0){
        if(isZoomDisabled)
            window.open("https://www.linkedin.com/in/amaury-celarier/", "_blank");
        contactLink.click();
    }
    else if (githubClicked.length >0){
        if(isZoomDisabled)
            window.open("https://github.com/AmauryCelarier", "_blank");
        contactLink.click();
    }
    else if (CVClicked.length >0){
        if(isZoomDisabled)
            ;
        focusOnCV();
    }
    else if (computerClicked.length >0){
        projectLink.click();
    }
    else if (teleClicked.length >0){
        focusOnTele();
    }
    else if (volleyClicked.length >0){
        focusOnVolley();
    }
    else if (tropheeClicked.length >0){
        focusOnTrophee();
    }
    else if (bookClicked.length >0){
        focusOnSkills();
    }
    else if (mushroomClicked.length >0){
       focusOnMushroom();
    }
    else if (baseClicked.length > 0) {
        isCameraUpdate = true;
        isZoomDisabled = false;
        
        if(cameraDistance <18)
            cameraDistance = 18;
        x_camcenter = base.position.x;
        y_camcenter = base.position.y;
        z_camcenter = base.position.z;
        backButton.click(); // Simule un clique sur le bouton retour
    }
    
    
}


// Références des éléments
const categoryList = document.getElementById("category-list");
const backButton = document.getElementById("back-button");

// Gérer les clics sur les catégories
categoryLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault(); // Empêche le comportement par défaut
        const newTitle = link.getAttribute("data-title"); // Récupère le titre de la catégorie

        // Mettre à jour le titre et afficher uniquement la catégorie sélectionnée
        sidebarTitle.textContent = newTitle;
        categoryList.style.display = "none"; // Masquer la liste
        backButton.style.display = "block"; // Afficher le bouton "Retour"
    });
});

// Gérer le clic sur le bouton "Retour"
backButton.addEventListener("click", () => {

    // Mettre à jour le contenu de la sidebar
    sidebarTitle.textContent = "Menu"; // Remettre le titre par défaut
    categoryList.style.display = "block"; // Réafficher la liste des catégories
    backButton.style.display = "none"; // Cacher le bouton "Retour"
    
    // Mise à jour de la Caméra
    isCameraUpdate = true;
    isZoomDisabled = false;
    if(cameraDistance <18)
        cameraDistance = 18;
    x_camcenter = base.position.x;
    y_camcenter = base.position.y;
    z_camcenter = base.position.z;

    // Suppressions des éléments non-voulus
    const contactContainer = document.getElementById("project-list");
    contactContainer.style.display = "none";
    const projectDetailsContainer = document.getElementById("project-details")
    projectDetailsContainer.style.display = "none";

    applyScreensaver();
    closeDialogue();
});


function focusOnComputer() {

    // Désactiver le mouvement de la caméra
    isCameraUpdate = false;
    isZoomDisabled = true;
    
    // Définir la nouvelle position et cible de la caméra
    const targetPosition = new THREE.Vector3(computer.position.x - 1.5, computer.position.y + 1, computer.position.z + 2);
    const targetLookAt = new THREE.Vector3(computer.position.x - 0.5, computer.position.y + 0.5, computer.position.z);
   

    // Animation fluide vers la nouvelle position
    let frame = 0;
    const duration = 50; // Durée en frames

    function animateCamera() {
        frame++;
        camera.position.lerp(targetPosition, 1 / (duration - frame + 1)); // Toujours interpolé depuis sa position actuelle
        camera.lookAt(targetLookAt);

        if (frame < duration) {
            requestAnimationFrame(animateCamera);
        }
    }
    animateCamera();   

    // Afficher les projets
    const projectContainer = document.getElementById("project-list");
    projectContainer.style.display = "flex";
    const projectDetailsContainer = document.getElementById("project-details")
    projectDetailsContainer.style.display = "none";

    // Mettre à jour la sidebar pour afficher "Projets"
    openSidebar();
    sidebarTitle.textContent = "Projets"; // Changer le titre
    categoryList.style.display = "none"; // Masquer les autres catégories
    backButton.style.display = "block"; // Afficher le bouton retour
}



const projectLink = document.querySelector('a[data-title="Projets"]');
projectLink.addEventListener("click", (e) => {
    e.preventDefault();
    focusOnComputer();
    focusOnComputer();
});

const contactLink = document.querySelector('a[data-title="Contact"]');
contactLink.addEventListener("click", (e) => {  
    e.preventDefault();
    focusOnContacts();
    focusOnContacts();
});

function focusOnContacts() {
    closeDialogue();
    // Désactiver le mouvement de la caméra
    isCameraUpdate = false;
    isZoomDisabled = true;

    // Définir la nouvelle position et cible de la caméra
    const targetPosition = new THREE.Vector3(-3, 2.95, -5);
    const targetLookAt = new THREE.Vector3(-3, 2.45, -10);

    // Animation fluide vers la nouvelle position
    let frame = 0;
    const duration = 50;

    function animateCamera() {
        frame++;
        camera.position.lerp(targetPosition, 1 / (duration - frame + 1)); // Interpolation dynamique
        camera.lookAt(targetLookAt);

        if (frame < duration) {
            requestAnimationFrame(animateCamera);
        }
    }
    animateCamera();   

    // Mettre à jour la sidebar pour afficher "Projets"
    openSidebar();
    sidebarTitle.textContent = "Contacts"; // Changer le titre
    categoryList.style.display = "none"; // Masquer les autres catégories
    backButton.style.display = "block"; // Afficher le bouton retour
    

     // Liste des contacts
     const contacts = [
        { name: "LinkedIn", link: "https://www.linkedin.com/in/amaury-celarier/", icon: "linkedin.png" },
        { name: "GitHub", link: "https://github.com/AmauryCelarier", icon: "github.png" },
        { name: "Instagram", link: "https://www.instagram.com/amaury3d_art/", icon: "instagram.png" },
        { name: "Gmail", link: "mailto:amaury.clrr@gmail.com", icon: "gmail.png" }
    ];

    // Création de la liste des contacts
    const contactList = document.createElement("ul");
    contactList.classList.add("contact-list");

    contacts.forEach(contact => {
        const li = document.createElement("li");
        li.innerHTML = `
            <a href="${contact.link}" target="_blank">
                <img src="/icons/${contact.icon}" alt="${contact.name}" class="contact-icon">
                ${contact.name}
            </a>
        `;
        contactList.appendChild(li);
    });

    // Ajouter la liste des contacts dans la sidebar
    const contactContainer = document.getElementById("project-list");
    contactContainer.innerHTML = "";
    contactContainer.appendChild(contactList);
    contactContainer.style.display = "block";
}

const aboutLink = document.querySelector('a[data-title="À propos"]');
aboutLink.addEventListener("click",(e)=>{
    e.preventDefault();
    focusOnCV();
})

const numeriqueRespLink = document.querySelector('a[data-title="Numérique Responsable"]');
numeriqueRespLink.addEventListener("click",(e)=>{
    e.preventDefault();
    focusOnNumeriqueResp();
})

function focusOnNumeriqueResp(){
    closeDialogue();
    closeSidebar();

    isCameraUpdate = false;
    isZoomDisabled = true;

     // Affichage dans la sidebar
     openSidebar();
    sidebarTitle.textContent = "Numérique Responsable";
    categoryList.style.display = "none";
    backButton.style.display = "block";

    const container = document.getElementById("project-list");
    container.innerHTML = `
        <div class="numerique-responsable-section">
            <h3>🌱 Numérique Responsable</h3>
            <p>Le secteur numérique représente aujourd'hui 4% des émissions mondiales de GES. 
            J'ai fait du numérique responsable un pilier central de ma pratique professionnelle.</p>

            <h4>🎯 Ma Vision</h4>
            <p>Pour moi, le numérique responsable ne se limite pas à développer des applications "vertes". 
            Il s'agit de concevoir des architectures et algorithmes où la légèreté, l'optimisation et la 
            maintenabilité sont prioritaires.</p>

            <h4>⚡ Optimisation et Performance</h4>
            <ul>
                <li><strong>Choix technologiques éclairés :</strong> Frameworks performants et durables</li>
                <li><strong>Code optimisé :</strong> Réduction de la consommation de ressources</li>
                <li><strong>Accessibilité numérique :</strong> Conception inclusive pour tous</li>
                <li><strong>Gestion des médias :</strong> Compression et optimisation</li>
                <li><strong>Architecture sobre :</strong> Minimisation des requêtes</li>
            </ul>

            <h4>🤖 L'IA : Un Outil à Double Tranchant</h4>
            <p>L'IA permet de gagner du temps et d'améliorer la qualité du code, mais je reste 
            conscient de son impact environnemental. J'adopte une approche raisonnée :</p>
            <ul>
                <li><strong>Prompts optimisés :</strong> Rédaction efficace pour minimiser les interactions</li>
                <li><strong>Usage ciblé :</strong> Utilisation uniquement quand nécessaire</li>
                <li><strong>Alternatives locales :</strong> Privilégier les outils locaux</li>
            </ul>

            <h4>📊 Mes Pratiques Concrètes</h4>
            <ul>
                <li><strong>Éco-conception :</strong> Audit avec Lighthouse et EcoIndex</li>
                <li><strong>Accessibilité :</strong> Tests WCAG et RGAA</li>
                <li><strong>Sobriété numérique :</strong> Fonctionnalités au strict nécessaire</li>
            </ul>

            <h4>💡 Un Engagement Continu</h4>
            <p>Le numérique responsable est un processus d'amélioration continue. Cette démarche 
            améliore la performance, la maintenabilité et la compétitivité des solutions développées.</p>
        </div>
    `;
    container.style.display = "block";
}

function focusOnCV() {
    closeDialogue();
    closeSidebar();

    isCameraUpdate = false;
    isZoomDisabled = true;

    const targetPosition = new THREE.Vector3(CV.position.x , CV.position.y + 0.4, CV.position.z + 1.1);
    const targetLookAt = new THREE.Vector3(CV.position.x - 0.7, CV.position.y, CV.position.z);

    let frame = 0;
    const duration = 50;

    function animateCamera() {
        frame++;
        camera.position.lerp(targetPosition, 1 / (duration - frame + 1));
        camera.lookAt(targetLookAt);
        if (frame < duration) {
            requestAnimationFrame(animateCamera);
        }
    }

    animateCamera();

    // Affichage dans la sidebar
    openSidebar();
    sidebarTitle.textContent = "À propos";
    categoryList.style.display = "none";
    backButton.style.display = "block";

    const container = document.getElementById("project-list");
    container.innerHTML = `
        <div class="cv-section">
            <h3>👤 Amaury Celarier – 20 ans</h3>
            <p>Technicien supérieur en informatique, j’ai pour ambition
 d’intégrer une équipe de production 3D pour proposer des
 idées en créant des modèles originaux.</p>

            <h4>🎓 Formation</h4>
            <ul>
                <li><strong>BUT Informatique-Graphique</strong> – IUT Clermont Auvergne (2023 - 2026)</li>
                <li><strong>Bac général Math / NSI</strong> – Notre Dame du Château (2023)</li>
            </ul>

            <h4>💼 Expériences Pro</h4>
            <ul>
                <li><strong>Chargé de Com</strong> – BDE ASCII (2023-2025)</li>
                <li><strong>Assistant Graphiste</strong> – Jecom Une Idée Pour Vous (2022)</li>
            </ul>

            <h4>🛠️ Compétences</h4>
            <ul>
                <li><strong>Modélisation 3D :</strong> Blender, 3DsMax, animation, optimisation</li>
                <li><strong>Dev :</strong> C++, Git, Web, bases de données</li>
                <li><strong>Outils :</strong> Unreal Engine, InDesign, Photoshop</li>
            </ul>

            <h4>🌐 Langues</h4>
            <ul>
                <li>Français : langue maternelle</li>
                <li>Anglais : B2</li>
                <li>Espagnol : A2</li>
            </ul>

            <h4>🎯 Centres d’intérêt</h4>
            <ul>
                <li><strong>Volley</strong> – "Pour moi tant que le ballon n’a pas touché le sol ce n’est pas encore perdu !"</li>
                <li><strong>Mythologie japonaise</strong> – Fan de Susanoo et des tempêtes divines</li>
                <li><strong>Piano</strong> – Autodidacte (Glimpse of Us - Joji, OST...)</li>
            </ul>

            <div class="project-link" style="margin-top: 15px;">
                <a href="Amaury CELARIER - CV.pdf" download>Télécharger mon CV en PDF</a>
            </div>
        </div>
    `;
    container.style.display = "block";
}

const helpLink = document.querySelector('a[data-title="Aides"]');
helpLink.addEventListener("click", (e) => {
    e.preventDefault();
    showHelpMenu();
});

function showHelpMenu() {
    closeDialogue();
    openSidebar();

    sidebarTitle.textContent = "Aide";
    categoryList.style.display = "none";
    backButton.style.display = "block";

    const container = document.getElementById("project-list");

    // Affichage du sélecteur
    container.innerHTML = `
        <div class="help-section">
            <h3>Liste des objets interactifs</h3>

            <div class="level-selector">
                <label for="help-level">Sélectionnez le niveau :</label>
                <select id="help-level">
                    <option value="1">🔍 Niveau 1 – Objets à retrouver</option>
                    <option value="2">🎯 Niveau 2 – Navigation directe</option>
                </select>
            </div>

            <div id="help-content" style="margin-top: 15px;"></div>
        </div>
    `;

    container.style.display = "block";

    const levelSelect = document.getElementById("help-level");
    const helpContent = document.getElementById("help-content");

    function renderHelpContent(level) {
        if (level === "1") {
            helpContent.innerHTML = `
                <p>🔍 Essayez de retrouver ces objets dans la scène :</p>
                <ul>
                    ${interactiveObjects.map(obj => `<li><strong>${obj.name}</strong> – ${obj.description}</li>`).join("")}
                </ul>
            `;
        } else {
            helpContent.innerHTML = `
                <p>🎯 Cliquez pour vous déplacer vers un objet :</p>
                <ul>
                    ${interactiveObjects.map((obj, index) => 
                        `<li><a href="#" class="focus-object" data-index="${index}">Aller à ${obj.name}</a></li>`
                    ).join("")}
                </ul>
            `;

            document.querySelectorAll('.focus-object').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const index = parseInt(e.target.dataset.index);
                    interactiveObjects[index].action();
                });
            });
        }
    }

    // Initialisation à niveau 1
    renderHelpContent("1");

    // Changement de niveau
    levelSelect.addEventListener("change", (e) => {
        renderHelpContent(e.target.value);
    });
}

function focusOnMushroom() {
    closeDialogue();
    closeSidebar();

    // Désactiver le mouvement libre de la caméra
    isCameraUpdate = false;
    isZoomDisabled = true;

    // Définir la position et la cible à atteindre
    const targetPosition = new THREE.Vector3(mushroom.position.x + 2, mushroom.position.y + 0.5, mushroom.position.z + 1.5);
    const targetLookAt = new THREE.Vector3(mushroom.position.x, mushroom.position.y + 0.3, mushroom.position.z);

    let frame = 0;
    const duration = 50;

    function animateCamera() {
        frame++;
        camera.position.lerp(targetPosition, 1 / (duration - frame + 1));
        camera.lookAt(targetLookAt);

        if (frame < duration) {
            requestAnimationFrame(animateCamera);
        }
    }

    animateCamera();

    showDialogue("Ce champi, c’est le début d’un long voyage dans la 3D...");
}

function focusOnTele() {
    closeDialogue();
    closeSidebar();

    // Désactiver le mouvement libre de la caméra
    isCameraUpdate = false;
    isZoomDisabled = true;

    // Définir la position et la cible à atteindre
    const targetPosition = new THREE.Vector3(tele.position.x + 3, tele.position.y, tele.position.z);
    const targetLookAt = new THREE.Vector3(tele.position.x, tele.position.y, tele.position.z);

    let frame = 0;
    const duration = 50;

    function animateCamera() {
        frame++;
        camera.position.lerp(targetPosition, 1 / (duration - frame + 1));
        camera.lookAt(targetLookAt);

        if (frame < duration) {
            requestAnimationFrame(animateCamera);
        }
    }

    animateCamera();

    showDialogue("Films, séries, animés... Quand c’est bien écrit, je me souviens de chaque réplique.");
}

function focusOnTrophee() {
    closeDialogue();
    closeSidebar();

    // Désactiver le mouvement libre de la caméra
    isCameraUpdate = false;
    isZoomDisabled = true;

    // Définir la position et la cible à atteindre
    const targetPosition = new THREE.Vector3(trophee.position.x, trophee.position.y + 1, trophee.position.z + 2);
    const targetLookAt = new THREE.Vector3(trophee.position.x, trophee.position.y + 0.5, trophee.position.z);

    let frame = 0;
    const duration = 50;

    function animateCamera() {
        frame++;
        camera.position.lerp(targetPosition, 1 / (duration - frame + 1));
        camera.lookAt(targetLookAt);

        if (frame < duration) {
            requestAnimationFrame(animateCamera);
        }
    }

    animateCamera();

    showDialogue("J'étais derrière la communication du BDE pendant un moment...Pour moi, être au BDE c’est être à fond dans la vie étudiante.");
}

function focusOnVolley() {
    closeDialogue();
    closeSidebar();

    // Désactiver le mouvement libre de la caméra
    isCameraUpdate = false;
    isZoomDisabled = true;

    // Définir la position et la cible à atteindre
    const targetPosition = new THREE.Vector3(volley.position.x + 2, volley.position.y + 1, volley.position.z - 2);
    const targetLookAt = new THREE.Vector3(volley.position.x, volley.position.y + 0.5, volley.position.z);

    let frame = 0;
    const duration = 50;

    function animateCamera() {
        frame++;
        camera.position.lerp(targetPosition, 1 / (duration - frame + 1));
        camera.lookAt(targetLookAt);

        if (frame < duration) {
            requestAnimationFrame(animateCamera);
        }
    }

    animateCamera();

    showDialogue("Pour moi, tant que le ballon n'a pas touché le sol ce n'est pas encore perdu !");
}

function focusOnSkills() {
    closeDialogue();
    closeSidebar();

    // Désactiver le mouvement libre de la caméra
    isCameraUpdate = false;
    isZoomDisabled = true;

    // Définir la position et la cible à atteindre
    const targetPosition = new THREE.Vector3(skills.position.x + 1, skills.position.y + 1, skills.position.z + 2);
    const targetLookAt = new THREE.Vector3(skills.position.x, skills.position.y, skills.position.z);

    let frame = 0;
    const duration = 50;

    function animateCamera() {
        frame++;
        camera.position.lerp(targetPosition, 1 / (duration - frame + 1));
        camera.lookAt(targetLookAt);

        if (frame < duration) {
            requestAnimationFrame(animateCamera);
        }
    }

    animateCamera();

    showDialogue("Chaque logiciel est un outil. Ce que j’aime, c’est créer avec.");
}

function closeDialogue(){
    const box = document.getElementById("dialogue-box");
    box.classList.add("hidden");
}

function showDialogue(text, speed = 30){
    const box = document.getElementById("dialogue-box");
    
    box.classList.remove("hidden");
    box.textContent = "";

    let i = 0;

    function type() {
        if (i < text.length) {
            box.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();

}

async function fetchProjects() {
    try {
        const response = await fetch(`${apiUrl}/projects`);
        const projects = await response.json();

        const projectContainer = document.getElementById("project-list");
        projectContainer.innerHTML = ""; // Nettoie l'affichage

        projects.forEach(proj => {
            const projectItem = document.createElement("div");
            projectItem.classList.add("project-item");
            projectItem.innerHTML = `
                <h4>${proj.title}</h4>
            `;

             // Ajoute un event listener pour afficher les détails du projet
             projectItem.addEventListener("click", () => showProjectDetails(proj.id));

            projectContainer.appendChild(projectItem);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des projets", error);
    }
}


// Appeler la fonction quand la sidebar affiche "Projets"
document.querySelector('a[data-title="Projets"]').addEventListener("click", () => {
    fetchProjects();
});

document.querySelectorAll('.project-title').forEach(title => {
    title.addEventListener('click', async (event) => {
        const projectId = event.target.dataset.id;
        try {
            const response = await fetch(`${apiUrl}/api/project/${projectId}`);
            const project = await response.json();

            if (project.error) {
                console.error("Erreur :", project.error);
                return;
            }

            // Mettre à jour la sidebarx    
            document.getElementById('project-description').innerText = project.description;
            document.getElementById('project-link').innerHTML = `<a href="${project.link}" target="_blank">Lien du projet</a>`;
            document.getElementById('project-date').innerText = `Créé le : ${new Date(project.createdAt).toLocaleDateString()}`;
        } catch (error) {
            console.error("Erreur lors de la récupération du projet :", error);
        }
    });
});
  
let slideshowInterval = null;

  async function showProjectDetails(projectId) {
    console.log("ID reçu dans showProjectDetails :", projectId); // Vérifie l'ID
    const url = `${apiUrl}/api/project/${projectId}`;
    console.log("Fetching:", url); // Ajoute ce log pour vérifier l'URL
    console.log("Chargement du projet...");

    try {
        const response = await fetch(url);
        const proj = await response.json();

        console.log("Réponse API :", proj);

        if (proj.error) {
            console.error("Erreur API :", proj.error);
            return;
        }

        const projectContainer = document.getElementById("project-list");
        const detailsContainer = document.getElementById("project-details");

        // Cache la liste et affiche les détails
        projectContainer.style.display = "none";
        detailsContainer.style.display = "block";

        // Construire les images si elles existent
        let imagesHtml 
        if (proj.images && proj.images.length > 0) {
            imagesHtml = proj.images.map(img => 
                `<img src="/${img.path}" alt="Image du projet" style="max-width: 300px;">`
            ).join("");
        }

        // Construire les paragraphes
        let paragraphsHtml = proj.paragraphs?.map(p => 
            `<p>${p.content}</p>`
        ).join("") || "<p>Aucun paragraphe disponible.</p>";

        // Construire les compétences
        let skillsHtml = proj.skills?.map(s => 
            `<span class="skill-badge">${s.skill.name} (${s.skill.type})</span>`
        ).join("") || "<p>Aucune compétence associée.</p>";

        detailsContainer.innerHTML = `
            <div class="project-details">
                <h2>${proj.title}</h2>
                
                <div class="project-info">
                    <p><strong>Description :</strong> ${proj.description}</p>
                    <p><strong>Date de création :</strong> ${new Date(proj.createdAt).toLocaleDateString()}</p>
                </div>

                <div class="skills-container">
                    ${proj.skills?.some(s => s.skill.type === "TECHNICAL") ? `
                        <div class="skills-list">
                            <h3>Compétences Techniques Liées</h3>
                            <ul>
                                ${proj.skills.filter(s => s.skill.type === "TECHNICAL")
                                    .map(s => `<li class="skill-badge">${s.skill.name}</li>`)
                                    .join("")}
                            </ul>
                        </div>
                    ` : ""}
                    
                    ${proj.skills?.some(s => s.skill.type === "SOFT") ? `
                        <div class="skills-list">
                            <h3>Soft Skills Liés</h3>
                            <ul>
                                ${proj.skills.filter(s => s.skill.type === "SOFT")
                                    .map(s => `<li class="skill-badge">${s.skill.name}</li>`)
                                    .join("")}
                            </ul>
                        </div>
                    ` : ""}
                </div>

                <div class="project-content">
                    <h3>Contenu :</h3>
                    ${paragraphsHtml}
                </div>

                <div class="project-images">
                    ${imagesHtml}
                </div>

                <div class="project-link">
                    <a href="${proj.link}" target="_blank">Voir le projet</a>
                </div>
            </div>
        `;
        if (proj.images && proj.images.length > 0 && computer) {
            const textureLoader = new THREE.TextureLoader();
            const screenMeshName = "Cube002";
            const materialName = "Texture_Screen";
            const screenTextures = [];
            let currentIndex = 0;
        
            if (slideshowInterval) {
                clearInterval(slideshowInterval);
                slideshowInterval = null;
            }

            function showSlide(index) {
                const imgUrl = `/${proj.images[index].path}`;
                textureLoader.load(imgUrl, (loadedImg) => {
                    const tex = createCanvasTextureFromImage(loadedImg.image);
                    applyTextureToScreen(tex);
                });
            }

            showSlide(currentIndex);
        
            // 🎞️ Changement automatique d’image toutes les 4 secondes
            slideshowInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % proj.images.length;
                showSlide(currentIndex);
            }, 3000);   
            
            loadModelIfExists(proj.id);
            
    }               
        
    } catch (error) {
        console.error("Erreur lors de la récupération du projet :", error);
    }
}
let currentModel = null;

async function loadModelIfExists(projectId) {
    console.log("API URL utilisée :", `${apiUrl}/api/project/${projectId}`);
    const res = await fetch(`${apiUrl}/api/project/${projectId}`);
    const project = await res.json();
    console.log("URL du modèle 3D :", project.model3D);

    if (currentModel) {
        scene.remove(currentModel);
        currentModel.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();
                if (child.material.map) child.material.map.dispose();
                child.material.dispose();
            }
        });
        currentModel = null;
    }

    if (project.model3D) {
        const loader = new GLTFLoader();
        loader.load(project.model3D, (gltf) => {
            const model = gltf.scene;
            model.position.set(7.5, 3.87, -9);
            model.rotation.y = -1;
            model.scale.set(0.5, 0.5, 0.5);
            scene.add(model);
            currentModel = model;
        }, undefined, (error) => {
            console.error("Erreur de chargement du modèle :", error);
        });
    } else {
        console.log("Aucun modèle à charger.");
    }
  }

function createCanvasTextureFromImage(img, targetWidth = 1024, targetHeight = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    // Fond noir
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calcule le ratio pour "contain"
    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth, drawHeight;

    if (imgRatio > canvasRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
    } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
    }

    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    texture.needsUpdate = true;
    return texture;
}

function applyTextureToScreen(texture) {
    computer.traverse((child) => {
        if (child.isMesh && child.name === "Cube002") {
            const applyToMaterial = (mat) => {
                if (child.isMesh && child.name === "Cube002") {
                    const mat = Array.isArray(child.material)
                        ? child.material.find(m => m.name === "Texture_Screen")
                        : child.material;
        
                    if (mat) {
                        mat.map = texture;
                        mat.emissive = new THREE.Color(0xffffff);
                        mat.emissiveMap = texture;
                        mat.color = new THREE.Color(0x000000);
                        texture.needsUpdate = true;
                        mat.needsUpdate = true;
                    }
                }
            };

            if (Array.isArray(child.material)) {
                child.material.forEach(applyToMaterial);
            } else {
                applyToMaterial(child.material);
            }
        }
    });
}

function applyScreensaver() {
    const imageUrl = "/images/veille.jpg";

    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (loadedImg) => {
        const finalTexture = createCanvasTextureFromImage(loadedImg.image);
    
        computer.traverse((child) => {  
            if (child.isMesh && child.name === "Cube002") {
                const mat = Array.isArray(child.material)
                    ? child.material.find(m => m.name === "Texture_Screen")
                    : child.material;
    
                if (mat) {
                    mat.map = finalTexture;
                    mat.emissive = new THREE.Color(0xffffff);
                    mat.emissiveMap = finalTexture;
                    mat.needsUpdate = true;
                }
            }
        });
    });
}
