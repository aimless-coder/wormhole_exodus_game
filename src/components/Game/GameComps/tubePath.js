import * as THREE from "three";
import spline from './spline'

function tubePath(){
    const tubeGeometry = new THREE.TubeGeometry(spline, 225, 0.65, 16, true);
      
    const edges = new THREE.EdgesGeometry(tubeGeometry, 0.3);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0099ff
    });
    const tubeLines = new THREE.LineSegments(edges, lineMaterial);

    const hitMaterial = new THREE.MeshBasicMaterial({
      color: 0x0099ff,
      transparent: true,
      opacity: 0.0,
      side: THREE.BackSide
    });
    const tubeHitArea = new THREE.Mesh(tubeGeometry, hitMaterial);

    return { tubeHitArea, tubeLines, tubeGeometry };
}

export default tubePath;