precision mediump float;

attribute vec3 vPosition;
attribute vec3 vColor;
attribute vec3 vNormal;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec3 fColor;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 perspectiveMatrix;
uniform mat3 normalMatrix;

uniform vec3 theta;
uniform vec3 point;
uniform float diffScale;

void main() {
  fColor = vColor;
  vec3 angle = radians(theta);
  vec3 cosinus = cos(angle);
  vec3 sinus = sin(angle);

  mat4 translate = mat4(
    1.0, 0.0, 0.0, point.x,
    0.0, 1.0, 0.0, point.y,
    0.0, 0.0, 1.0, point.z,
    0.0, 0.0, 0.0, 1.0
  );

  mat4 scale = mat4(
    diffScale, 0.0, 0.0, 0.0,
    0.0, diffScale, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  mat4 rotateY = mat4(
    cosinus.y, 0.0, -sinus.y, 0.0,
    0.0, 1.0, 0.0, 0.0,
    sinus.y, 0.0, cosinus.y, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  // perkalian dari kanan
  // gl_Position = vec4(vPosition, 1.0) * scale * rotateY;
  // gl_Position = gl_Position * translate;

  gl_Position = perspectiveMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);

  fPosition = vec3(viewMatrix * modelMatrix * vec4(vPosition, 1.0));
  fNormal = normalMatrix * vNormal;
}
