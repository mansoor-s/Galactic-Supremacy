/*
<chandlerp> http://jsfiddle.net/AzqkW/
[17:28] <chandlerp> there you go
[17:29] <chandlerp> where origin is camera.position, vector comes from the call to projector.unproject()
[17:29] <chandlerp> and z_plane_point is where you want to intersect the Z plane at
[17:33] <IvanKuzev> thank you
*/
var origin = new THREE.Vector3(8, 7, 5);
var vector = new THREE.Vector3(-1, -1, -1);
var z_plane_point = 0;

var  =(z_plane_point - origin.z) / vector.z
var intersection = origin.clone().addSelf( vector.multiplyScalar(scalar) );

console.debug(intersection);