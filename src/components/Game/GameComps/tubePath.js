import * as THREE from "three";
import spline from './spline'
import levelConfig from './gameLevel';

function tubePath(currentLevel = 0) {
    const tubeGeometry = new THREE.TubeGeometry(spline, 225, 0.65, 16, true);
    const tubeColor = levelConfig[currentLevel].tubeColor;
      
    const edges = new THREE.EdgesGeometry(tubeGeometry, 0.3);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: tubeColor
    });
    const tubeLines = new THREE.LineSegments(edges, lineMaterial);

    const hitMaterial = new THREE.MeshBasicMaterial({
      color: tubeColor,
      transparent: true,
      opacity: 0.0,
      side: THREE.BackSide
    });
    const tubeHitArea = new THREE.Mesh(tubeGeometry, hitMaterial);

    return { tubeHitArea, tubeLines, tubeGeometry };
}

export default tubePath;
