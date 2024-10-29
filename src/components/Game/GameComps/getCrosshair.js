import * as THREE from "three";

function getCrosshair(){

    const crosshair = new THREE.Group();
    crosshair.position.z = -1;
    const crossMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff
    });
    const lineGeometry = new THREE.BufferGeometry();
    const lineVertex = [0, 0.05, 0, 0, 0.02, 0];
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(lineVertex, 3));

    for(let i = 0; i < 4; i++){
      const line = new THREE.Line(lineGeometry, crossMaterial);
      line.rotation.z = i * 0.5 * Math.PI;
      crosshair.add(line);
    }

    return { crosshair };
}

export default getCrosshair;