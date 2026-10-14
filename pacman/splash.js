// Three.js 3D animated splash screen (Hero, Princess in Cage, Villain Malakor)
(function() {
  const splashEl = document.getElementById('splash-screen');
  const threeContainer = document.getElementById('three-container');
  let splashActive = true;
  let scene, camera3D, renderer, heroGroup, princessGroup, villainGroup, cageGroup, swordPivot;

  function initThreeSplash() {
    if (typeof THREE === 'undefined') return;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.035);

    camera3D = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeContainer.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xfef08a, 1.1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Pedestals
    const heroIsl = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 0.9, 0.6, 8),
      new THREE.MeshStandardMaterial({ color: 0x10b981, flatShading: true })
    );
    heroIsl.position.set(-2.3, -0.3, 1.2);
    scene.add(heroIsl);

    const darkIsl = new THREE.Mesh(
      new THREE.CylinderGeometry(2.1, 1.5, 0.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x3b0764, flatShading: true })
    );
    darkIsl.position.set(1.5, 0.2, -0.8);
    scene.add(darkIsl);

    // 3D Hero
    heroGroup = new THREE.Group();
    heroGroup.position.set(-2.3, 0, 1.2);
    heroGroup.rotation.y = 0.45;

    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.95, 0.46),
      new THREE.MeshStandardMaterial({ color: 0xdc141f })
    );
    torso.position.y = 0.65;
    heroGroup.add(torso);

    const whiteStripe1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.78, 0.16, 0.48),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    whiteStripe1.position.y = 0.55;
    const whiteStripe2 = whiteStripe1.clone();
    whiteStripe2.position.y = 0.82;
    heroGroup.add(whiteStripe1, whiteStripe2);

    const blueArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.8, 0.36),
      new THREE.MeshStandardMaterial({ color: 0x172a88 })
    );
    blueArm.position.set(-0.48, 0.65, 0);
    heroGroup.add(blueArm);

    const headMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.62, 0.62),
      new THREE.MeshStandardMaterial({ color: 0xeac096 })
    );
    headMesh.position.y = 1.45;
    heroGroup.add(headMesh);

    const shades = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 0.22, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.2 })
    );
    shades.position.set(0, 1.5, 0.28);
    heroGroup.add(shades);

    const capCrown = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 0.3, 0.66),
      new THREE.MeshStandardMaterial({ color: 0x172a88 })
    );
    capCrown.position.y = 1.82;
    heroGroup.add(capCrown);

    const capVisorBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.1, 0.45),
      new THREE.MeshStandardMaterial({ color: 0xdc141f })
    );
    capVisorBack.position.set(-0.42, 1.72, 0);
    heroGroup.add(capVisorBack);

    swordPivot = new THREE.Group();
    swordPivot.position.set(0.5, 0.8, 0.2);
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1.15, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5 })
    );
    blade.position.y = 0.55;
    swordPivot.add(blade);
    heroGroup.add(swordPivot);
    scene.add(heroGroup);

    // 3D Princess
    princessGroup = new THREE.Group();
    princessGroup.position.set(0.35, 0.6, -0.5);
    const dress = new THREE.Mesh(
      new THREE.ConeGeometry(0.48, 1.05, 8),
      new THREE.MeshStandardMaterial({ color: 0xf472b6 })
    );
    dress.position.y = 0.52;
    princessGroup.add(dress);

    const pHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xfde68a })
    );
    pHead.position.y = 1.25;
    princessGroup.add(pHead);

    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.18, 0.2, 6),
      new THREE.MeshStandardMaterial({ color: 0xfacc15 })
    );
    crown.position.y = 1.6;
    princessGroup.add(crown);
    scene.add(princessGroup);

    cageGroup = new THREE.Group();
    cageGroup.position.copy(princessGroup.position);
    const barMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 0.6 });
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.9, 6), barMat);
      bar.position.set(Math.cos(a) * 0.62, 0.95, Math.sin(a) * 0.62);
      cageGroup.add(bar);
    }
    scene.add(cageGroup);

    // 3D Villain
    villainGroup = new THREE.Group();
    villainGroup.position.set(2.3, 0.6, -0.7);
    villainGroup.rotation.y = -0.45;
    const vBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 1.25, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x1e1b4b })
    );
    vBody.position.y = 0.75;
    villainGroup.add(vBody);

    const vHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.68, 0.68),
      new THREE.MeshStandardMaterial({ color: 0x312e81 })
    );
    vHead.position.y = 1.65;
    villainGroup.add(vHead);

    const hornMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 5), hornMat);
    hornL.position.set(-0.32, 2.15, 0);
    hornL.rotation.z = 0.35;
    const hornR = hornL.clone();
    hornR.position.x = 0.32;
    hornR.rotation.z = -0.35;
    villainGroup.add(hornL, hornR);
    scene.add(villainGroup);

    updateThreeCameraAspect();
  }

  function updateThreeCameraAspect() {
    if (!camera3D || !renderer) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;
    camera3D.aspect = aspect;
    camera3D.position.z = aspect < 0.75 ? 13.5 : aspect < 1.1 ? 11.0 : 9.0;
    camera3D.position.y = aspect < 0.75 ? 2.0 : 2.3;
    camera3D.lookAt(0, 0.9, 0);
    camera3D.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.updateThreeCameraAspect = updateThreeCameraAspect;

  function animateThreeSplash(time) {
    if (!splashActive) return;
    requestAnimationFrame(animateThreeSplash);
    const t = time * 0.001;
    if (heroGroup) {
      heroGroup.position.y = Math.sin(t * 3) * 0.08;
      swordPivot.rotation.x = 0.4 + Math.sin(t * 5) * 0.25;
    }
    if (princessGroup && cageGroup) {
      const bob = 0.6 + Math.sin(t * 2.2 + 1) * 0.14;
      princessGroup.position.y = bob;
      cageGroup.position.y = bob;
      cageGroup.rotation.y = t * 0.5;
    }
    if (villainGroup) {
      villainGroup.position.y = 0.65 + Math.sin(t * 2.5) * 0.18;
    }
    if (renderer && scene && camera3D) renderer.render(scene, camera3D);
  }

  initThreeSplash();
  requestAnimationFrame(animateThreeSplash);

  document.getElementById('btn-start-game').addEventListener('click', () => {
    splashActive = false;
    splashEl.classList.add('hidden');
    if (window.playTone) window.playTone('win');
  });

  document.getElementById('btn-story').addEventListener('click', () => {
    splashActive = true;
    splashEl.classList.remove('hidden');
    updateThreeCameraAspect();
    requestAnimationFrame(animateThreeSplash);
  });
})();
