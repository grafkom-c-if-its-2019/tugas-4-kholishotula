precision mediump float;

uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform vec3 ambientColor;
uniform float shininess;

varying vec3 fPosition;
varying vec3 fNormal;
varying vac3 fColor;

uniform sampler2D sampler0;

void main() {

  // Menormalisasi vektor normal (lagi),
  //  karena dia terinterpolasi dan ada kemungkinan tidak berpanjang 1
  vec3 normal = normalize(fNormal);
  
  // Menghitung nilai cos dari sudut antara arah cahaya dan normal
  //  (sama dengan perkalian titik dari vektor arah cahaya dan vektor normal)
  vec3 lightDirection = normalize(lightPosition - fPosition);
  float lightIntensity = max(dot(lightDirection, normal), 0.0); 

  // Menghitung nilai diffuse dari interaksi cahaya dan material
  vec3 diffuse = fColor * lightIntensity;

  // Menghitung nilai ambient dari verteks
  vec3 ambient = ambientColor * fColor;

  vec3 reflection = 2. * dot(normal, lightDirection) * normal - lightDirection;

  vec3 to_camera = -1. * fPosition;

  reflection = normalize(reflection);
  to_camera = normalize(to_camera);
  lightIntensity = dot(reflection, to_camera);
  lightIntensity = clamp(lightIntensity, 0.0, 1.0);
  lightIntensity = pow(lightIntensity, shininess);

  vec3 specular;
  if (lightIntensity > 0.0){
    specular = lightColor * lightIntensity;
    diffuse = diffuse * (1. - lightIntensity);
  }else{
    specular = vec3(0., 1., 0.);
  }

  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
