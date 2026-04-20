// Three.js 3D neural network hero background
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
const NODE_COUNT = isMobile ? 60 : 180;
const CONNECT_DIST = isMobile ? 2.2 : 2.8;
const canvas = document.getElementById('heroCanvas');
if (!canvas) throw new Error('No heroCanvas');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 0, 14);

// ── Nodes ──
const nodePositions = [];
for (let i = 0; i < NODE_COUNT; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi   = Math.acos(2 * Math.random() - 1);
  const r     = 3 + Math.random() * 4.5;
  nodePositions.push(new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta) * 0.7,
    r * Math.cos(phi)
  ));
}

const nodeGeo  = new THREE.SphereGeometry(0.06, 6, 6);
const nodeMat  = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
const glowMat  = new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.12 });
const glowGeo  = new THREE.SphereGeometry(0.18, 6, 6);

const nodeGroup = new THREE.Group();
nodePositions.forEach(pos => {
  const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
  mesh.position.copy(pos);
  nodeGroup.add(mesh);

  const glow = new THREE.Mesh(glowGeo, glowMat.clone());
  glow.position.copy(pos);
  nodeGroup.add(glow);
});

// ── Edges ──
const edgePositionsArr = [];
for (let i = 0; i < NODE_COUNT; i++) {
  for (let j = i + 1; j < NODE_COUNT; j++) {
    if (nodePositions[i].distanceTo(nodePositions[j]) < CONNECT_DIST) {
      edgePositionsArr.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
      edgePositionsArr.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
    }
  }
}

const edgeGeo = new THREE.BufferGeometry();
edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePositionsArr, 3));
const edgeMat = new THREE.LineBasicMaterial({
  color: 0x00f5ff,
  transparent: true,
  opacity: 0.15,
});
const edges = new THREE.LineSegments(edgeGeo, edgeMat);
nodeGroup.add(edges);

// ── Purple accent nodes ──
const purpleMat = new THREE.MeshBasicMaterial({ color: 0x7b2fff });
const accentCount = Math.floor(NODE_COUNT * 0.15);
for (let i = 0; i < accentCount; i++) {
  const idx = Math.floor(Math.random() * NODE_COUNT);
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), purpleMat.clone());
  mesh.position.copy(nodePositions[idx]);
  nodeGroup.add(mesh);
}

scene.add(nodeGroup);

// ── Mouse parallax ──
const mouse = { x: 0, y: 0 };
const targetRot = { x: 0, y: 0 };

if (!isMobile) {
  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.8;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.5;
  }, { passive: true });
}

// ── Resize ──
const onResize = () => {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
};
window.addEventListener('resize', onResize, { passive: true });

// ── Animate ──
let frame = 0;
const animate = () => {
  requestAnimationFrame(animate);
  frame++;

  // Slow rotation
  nodeGroup.rotation.y += 0.0004;
  nodeGroup.rotation.x += 0.0001;

  // Mouse parallax
  if (!isMobile) {
    targetRot.y += (mouse.x - targetRot.y) * 0.04;
    targetRot.x += (mouse.y - targetRot.x) * 0.04;
    nodeGroup.rotation.y += targetRot.y * 0.005;
    nodeGroup.rotation.x += targetRot.x * 0.005;
  }

  // Pulse: edge opacity breathes
  edgeMat.opacity = 0.1 + Math.sin(frame * 0.018) * 0.07;

  renderer.render(scene, camera);
};

animate();
