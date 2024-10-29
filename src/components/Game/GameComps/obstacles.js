import * as THREE from "three";
import tubePath from './tubePath'


function obstacles(){
    const {tubeGeometry} = tubePath();


    const obstaclesGroup = new THREE.Group();
    const numBoxes = 50;
    const size = 0.075;
      
    const obstaclesGeo = new THREE.BoxGeometry(size, size, size);

    for(let i = 0; i < numBoxes; i++){
        const p = (i / numBoxes + Math.random() * 0.1) % 1;
        const pos = tubeGeometry.parameters.path.getPointAt(p);
  
        const color = new THREE.Color().setHSL(0.7 + p, 1, 0.5);
        const hitBoxMat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.4
    });
  
    const hitBox = new THREE.Mesh(obstaclesGeo, hitBoxMat);
    hitBox.name = 'box';
        
    pos.x += Math.random() - 0.4;
    pos.y += Math.random() - 0.4;
    hitBox.position.copy(pos);
  
    const coords = new THREE.Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
    );
  
    hitBox.rotation.set(coords.x, coords.y, coords.z);
    hitBox.userData.box = hitBox;
    obstaclesGroup.add(hitBox);

    }
    
    return {obstaclesGroup};
}

export default obstacles;