precision mediump float;

uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform vec3 ambientColor;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fTexCoord;

uniform sampler2D sampler0;

void main() {

  // Menormalisasi vektor normal (lagi),
  //  karena dia terinterpolasi dan ada kemungkinan tidak berpanjang 1
  vec3 normal = normalize(fNormal);
  
  // Menghitung nilai cos dari sudut antara arah cahaya dan normal
  //  (sama dengan perkalian titik dari vektor arah cahaya dan vektor normal)
  vec3 lightDirection = normalize(lightPosition - fPosition);
  float lightIntensity = max(dot(lightDirection, -normal), 0.0); 

  // Fungsi untuk mendapatkan nilai warna dari tekstur
  vec4 tex0 = texture2D(sampler0, fTexCoord);
  
  float specularPower = 120.0;
  float specular = 0.0;
  if (lightIntensity > 0.0){
    // viewing vector
    vec3 viewVec = vec3(0,0,1.0);

    // reflective vector
    vec3 reflectVec = reflect(-lightDirection, normal);

    // determine the specularFactor based on the dot product of viewing and reflective,
    // taking at least a minimum of 0.0
    float specularFactor = max(dot(reflectVec, viewVec), 0.0);
    specular = pow(specularFactor, specularPower);
  }

  // Menghitung nilai diffuse dari interaksi cahaya dan material
  vec3 diffuse = lightColor * tex0.rgb * lightIntensity + specular;

  // Menghitung nilai ambient dari verteks
  vec3 ambient = ambientColor * tex0.rgb;

  gl_FragColor = vec4(diffuse + ambient, 1.0);
}
