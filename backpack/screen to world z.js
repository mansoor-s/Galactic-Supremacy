/*
<chandlerp> http://jsfiddle.net/AzqkW/
[17:28] <chandlerp> there you go
[17:29] <chandlerp> where origin is camera.position, vector comes from the call to projector.unproject()
[17:29] <chandlerp> and z_plane_point is where you want to intersect the Z plane at
[17:33] <IvanKuzev> thank you
*/

function getWorldXYZ(camera,xyPosition,z){
    var origin = camera.position;
    var vector =  projector.unprojectVector(new THREE.Vector3(xyPosition.x,xyPosition.y,1), camera);
    var z_plane_point = z;

    var scalar =(z_plane_point - origin.z) / vector.z
    var intersection = origin.clone().addSelf( vector.multiplyScalar(scalar) );

    debugger;
    return intersection;
}