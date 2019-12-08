(function(global) {

  var canvas, gl, shaders = [];

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    // kubus
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);   
    // huruf
    var vertex2Shader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
        fragment2Shader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);
    var program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    var program2 = glUtils.createProgram(gl, vertex2Shader, fragment2Shader);
    shaders.push(program);
    shaders.push(program2);

    startDraw();
  }

  // Interaksi dengan keyboard
  function onKeyDown(event) {
    if (event.keyCode == 189) thetaSpeed -= 0.005;      // tombol '-'
    else if (event.keyCode == 187) thetaSpeed += 0.005; // tombol '='
    else if (event.keyCode == 48) thetaSpeed = 0;       // tombol '0'
  }
  document.addEventListener('keydown', onKeyDown);

  // Interaksi dengan mouse
  var lastx, lasty, dragging;
  function onMouseDown(event) { // Ketika tombol klik kiri ditekan
    var x = event.clientX;
    var y = event.clientY;
    var rect = event.target.getBoundingClientRect();
    if (
      rect.left <= x &&
      rect.right > x &&
      rect.top <= y &&
      rect.bottom > y
    ) {
      lastx = x;
      lasty = y;
      dragging = true;
    }
  }
  function onMouseUp(event) {   // Ketika tombol klik kiri dilepas
    dragging = false;
  }
  function onMouseMove(event) { // Ketika mouse bergerak
    var x = event.clientX;
    var y = event.clientY;
    if (dragging) {
      var factor = 10 / canvas.height;
      var dx = factor * (x - lastx);  // Perubahan posisi mouse secara horizontal
      var dy = factor * (y - lasty);  // Perubahan posisi mouse secara vertikal
      theta[xAxis] += dy;
      theta[yAxis] += dx;
    }
    lastx = x;
    lasty = y;
  }
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mousemove', onMouseMove);

  function initCubes() {
    var vertices = new Float32Array([ 
      // x, y, z            u, v         normal
  
      // depan BAD BDC tidak perlu, karena dibiarkan terbuka
      // -0.5,  0.5,  0.5,     0.0, 1.0,  0.0, 0.0, 1.0,
      // -0.5, -0.5,  0.5,     0.0, 0.0,  0.0, 0.0, 1.0, 
      //  0.5, -0.5,  0.5,     1.0, 0.0,  0.0, 0.0, 1.0, 
      // -0.5,  0.5,  0.5,     0.0, 1.0,  0.0, 0.0, 1.0, 
      //  0.5, -0.5,  0.5,     1.0, 0.0,  0.0, 0.0, 1.0, 
      //  0.5,  0.5,  0.5,     1.0, 1.0,  0.0, 0.0, 1.0, 
  
      // kanan CDH CHG
      0.5,  0.5,  0.5,     0.0, 1.0,  1.0, 0.0, 0.0, // kanan, hijau, CDH CHG
      0.5, -0.5,  0.5,     0.0, 0.0,  1.0, 0.0, 0.0,
      0.5, -0.5, -0.5,     0.2, 0.0,  1.0, 0.0, 0.0,
      0.5,  0.5,  0.5,     0.0, 1.0,  1.0, 0.0, 0.0,
      0.5, -0.5, -0.5,     0.2, 0.0,  1.0, 0.0, 0.0,
      0.5,  0.5, -0.5,     0.2, 1.0,  1.0, 0.0, 0.0,
 
      // bawah DAE DEH
      0.5, -0.5,  0.5,     0.2, 1.0,  0.0, -1.0, 0.0, // bawah, biru, DAE DEH
      -0.5, -0.5,  0.5,     0.2, 0.0,  0.0, -1.0, 0.0,
      -0.5, -0.5, -0.5,     0.4, 0.0,  0.0, -1.0, 0.0,
      0.5, -0.5,  0.5,     0.2, 1.0,  0.0, -1.0, 0.0,
      -0.5, -0.5, -0.5,     0.4, 0.0,  0.0, -1.0, 0.0,
      0.5, -0.5, -0.5,     0.4, 1.0,  0.0, -1.0, 0.0,
 
      // belakang EFG EGH
      -0.5, -0.5, -0.5,     0.4, 1.0,  0.0, 0.0, -1.0, // belakang, kuning, EFG EGH
      -0.5,  0.5, -0.5,     0.4, 0.0,  0.0, 0.0, -1.0,
      0.5,  0.5, -0.5,     0.6, 0.0,  0.0, 0.0, -1.0,
      -0.5, -0.5, -0.5,     0.4, 1.0,  0.0, 0.0, -1.0,
      0.5,  0.5, -0.5,     0.6, 0.0,  0.0, 0.0, -1.0,
      0.5, -0.5, -0.5,     0.6, 1.0,  0.0, 0.0, -1.0,
 
      // kiri FEA FAB
      -0.5,  0.5, -0.5,     0.6, 1.0,  -1.0, 0.0, 0.0, // kiri, cyan, FEA FAB
      -0.5, -0.5, -0.5,     0.6, 0.0,  -1.0, 0.0, 0.0,       -0.5, -0.5,  0.5,     0.8, 0.0,  -1.0, 0.0, 0.0,
      -0.5,  0.5, -0.5,     0.6, 1.0,  -1.0, 0.0, 0.0,
      -0.5, -0.5,  0.5,     0.8, 0.0,  -1.0, 0.0, 0.0,
      -0.5,  0.5,  0.5,     0.8, 1.0,  -1.0, 0.0, 0.0,
 
      // atas GFB GBC
      0.5,  0.5, -0.5,     0.8, 1.0,  0.0, 1.0, 0.0, // atas, magenta, GFB GBC
      -0.5,  0.5, -0.5,     0.8, 0.0,  0.0, 1.0, 0.0,
      -0.5,  0.5,  0.5,     1.0, 0.0,  0.0, 1.0, 0.0,
      0.5,  0.5, -0.5,     0.8, 1.0,  0.0, 1.0, 0.0,
      -0.5,  0.5,  0.5,     1.0, 0.0,  0.0, 1.0, 0.0,
      0.5,  0.5,  0.5,     1.0, 1.0,  0.0, 1.0, 0.0
    ]);
    n = 30;

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(shaders[0], 'vPosition');
    var vTexCoord = gl.getAttribLocation(shaders[0], 'vTexCoord');
    var vNormal = gl.getAttribLocation(shaders[0], 'vNormal');
    gl.vertexAttribPointer(
      vPosition,
      3,
      gl.FLOAT,
      gl.FALSE,
      8 * Float32Array.BYTES_PER_ELEMENT,
      0);
    gl.vertexAttribPointer(
      vTexCoord,
      2,
      gl.FLOAT,
      gl.FALSE,
      8 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(
      vNormal,
      3,
      gl.FLOAT,
      gl.FALSE,
      3 * Float32Array.BYTES_PER_ELEMENT,
      5 * Float32Array.BYTES_PER_ELEMENT);
    
    gl.enableVertexAttribArray(vPosition);
    gl.enableVertexAttribArray(vTexCoord);
    gl.enableVertexAttribArray(vNormal);

    // Definisi cahaya
    var lightColorLoc = gl.getUniformLocation(shaders[0], 'lightColor');
    var lightPositionLoc = gl.getUniformLocation(shaders[0], 'lightPosition');
    var lightColor = [1.0, 1.0, 1.0]; // Cahaya warna putih
    var lightPosition = glMatrix.vec3.fromValues(0.5, 4.0, 3.0);
    gl.uniform3fv(lightColorLoc, lightColor);
    gl.uniform3fv(lightPositionLoc, lightPosition);
    var ambientColorLoc = gl.getUniformLocation(shaders[0], 'ambientColor');
    gl.uniform3fv(ambientColorLoc, glMatrix.vec3.fromValues(0.17, 0.0, 0.30));
    var shineLoc = gl.getUniformLocation(shaders[0], 'shininess');
    var shine = 0.06;
    gl.uniform1f(shineLoc, shine);

    // Definisi matriks pandangan (view matrix)
    var vmLoc = gl.getUniformLocation(shaders[0], 'viewMatrix');
    var vm = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(vm,
      glMatrix.mat3.fromValues(0.0, 0.0,  0.0), // eye: posisi kamera
      glMatrix.mat3.fromValues(0.0, 0.0, -2.0), // at: posisi kamera menghadap
      glMatrix.mat3.fromValues(0.0, 1.0,  0.0)  // up: posisi arah atas kamera
    );
    gl.uniformMatrix4fv(vmLoc, false, vm);

    // Definisi matriks proyeksi perspektif
    var pmLoc = gl.getUniformLocation(shaders[0], 'perspectiveMatrix');
    var pm = glMatrix.mat4.create();
    glMatrix.mat4.perspective(pm,
      glMatrix.glMatrix.toRadian(90), // fovy dalam radian
      canvas.width / canvas.height,
      1.0,  // near
      10.0  // far
    );
    gl.uniformMatrix4fv(pmLoc, false, pm);

    // Definisi matriks model
    var mmLoc = gl.getUniformLocation(shaders[0], 'modelMatrix');
    var mm = glMatrix.mat4.create();
      glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -0.2]);
      glMatrix.mat4.rotateX(mm, mm, theta[xAxis]);
      glMatrix.mat4.rotateY(mm, mm, theta[yAxis]);
      glMatrix.mat4.rotateZ(mm, mm, theta[zAxis]);
      gl.uniformMatrix4fv(mmLoc, false, mm);

    // Definisi matriks normal
    var nmLoc = gl.getUniformLocation(shaders[0], 'normalMatrix');
    var nm = glMatrix.mat3.create();
      glMatrix.mat3.normalFromMat4(nm, mm);
      gl.uniformMatrix3fv(nmLoc, false, nm);

    return n;
  }

  function initBuffersBlock() {
    var vertices = new Float32Array([
      -0.35, -0.5,    0.83, 0.13, 0.18,
      -0.35, +0.5,    0.89, 0.15, 0.21,
      -0.15, +0.5,    0.89, 0.51, 0.41,

      -0.15, +0.5,    0.89, 0.51, 0.41,
      -0.15, -0.5,    0.89, 0.15, 0.21,
      -0.35, -0.5,    0.83, 0.13, 0.18,

      -0.15, +0.1,    0.83, 0.13, 0.18,
      +0.15, +0.5,    0.89, 0.15, 0.21,
      +0.35, +0.5,    0.89, 0.51, 0.41,

      +0.35, +0.5,    0.89, 0.51, 0.41,
      0.0, 0.0,    0.89, 0.15, 0.21,
      -0.15, +0.1,    0.83, 0.13, 0.18,

      -0.15, +0.1,    0.89, 0.15, 0.21,
      -0.15, -0.1,    0.89, 0.15, 0.21,
      0.0, 0.0,    0.89, 0.15, 0.21,

      0.0, 0.0,    0.89, 0.15, 0.21,
      +0.35, -0.5,    0.89, 0.51, 0.41,
      +0.15, -0.5,    0.83, 0.13, 0.18,

      +0.15, -0.5,    0.83, 0.13, 0.18,
      -0.15, -0.1,    0.89, 0.51, 0.41,
      0.0, 0.0,    0.89, 0.15, 0.21
    ]);
    var n = 21;

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(shaders[1], 'vPosition');
    var vColor = gl.getAttribLocation(shaders[1], 'vColor');

    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(vPosition);
    gl.enableVertexAttribArray(vColor);

    // Definisi cahaya
    var lightColorLoc = gl.getUniformLocation(shaders[1], 'lightColor');
    var lightPositionLoc = gl.getUniformLocation(shaders[1], 'lightPosition');
    var lightColor = [1.0, 1.0, 1.0]; // Cahaya warna putih
    var lightPosition = glMatrix.vec3.fromValues(0.5, 4.0, 3.0);
    gl.uniform3fv(lightColorLoc, lightColor);
    gl.uniform3fv(lightPositionLoc, lightPosition);
    var ambientColorLoc = gl.getUniformLocation(shaders[1], 'ambientColor');
    gl.uniform3fv(ambientColorLoc, glMatrix.vec3.fromValues(0.17, 0.0, 0.30));
    var shineLoc = gl.getUniformLocation(shaders[1], 'shininess');
    var shine = 0.06;
    gl.uniform1f(shineLoc, shine);

    // Definisi matriks pandangan (view matrix)
    var vmLoc = gl.getUniformLocation(shaders[0], 'viewMatrix');
    var vm = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(vm,
      glMatrix.mat3.fromValues(0.0, 0.0,  0.0), // eye: posisi kamera
      glMatrix.mat3.fromValues(0.0, 0.0, -2.0), // at: posisi kamera menghadap
      glMatrix.mat3.fromValues(0.0, 1.0,  0.0)  // up: posisi arah atas kamera
    );
    gl.uniformMatrix4fv(vmLoc, false, vm);

    // Definisi matriks proyeksi perspektif
    var pmLoc = gl.getUniformLocation(shaders[0], 'perspectiveMatrix');
    var pm = glMatrix.mat4.create();
    glMatrix.mat4.perspective(pm,
      glMatrix.glMatrix.toRadian(90), // fovy dalam radian
      canvas.width / canvas.height,
      1.0,  // near
      10.0  // far
    );
    gl.uniformMatrix4fv(pmLoc, false, pm);

    // Definisi matriks model
    var mmLoc = gl.getUniformLocation(shaders[0], 'modelMatrix');
    var mm = glMatrix.mat4.create();
      glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -0.2]);
      glMatrix.mat4.rotateX(mm, mm, theta[xAxis]);
      glMatrix.mat4.rotateY(mm, mm, theta[yAxis]);
      glMatrix.mat4.rotateZ(mm, mm, theta[zAxis]);
      gl.uniformMatrix4fv(mmLoc, false, mm);

    // Definisi matriks normal
    var nmLoc = gl.getUniformLocation(shaders[0], 'normalMatrix');
    var nm = glMatrix.mat3.create();
      glMatrix.mat3.normalFromMat4(nm, mm);
      gl.uniformMatrix3fv(nmLoc, false, nm);

    return n;
  }

  function startDraw() {
    thetaLoc = gl.getUniformLocation(shaders[0], 'theta');
    theta = [20, 40, 0];

    theta2Loc = gl.getUniformLocation(shaders[1], 'theta'); 
    transLoc = gl.getUniformLocation(shaders[1], 'point');
    scaleLoc = gl.getUniformLocation(shaders[1], 'diffScale');
    diffScale = 0.4;
    theta2 = [30, 60, 0];
    point = [0, 0, 0];
    addX = 0.0081;
    addY = 0.0099;
    addZ = 0.053;
    adder = 0.81;

    function render(){
      
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(shaders[0]);

      var nLine = initCubes(gl);
      gl.uniform3fv(thetaLoc, theta);
      gl.drawArrays(gl.LINES, 0, nLine);

      gl.useProgram(shaders[1]);

      var nBlock = initBuffersBlock(gl);
      gl.uniform1f(scaleLoc, diffScale);
      if(point[0] > 0.7*(1-diffScale) || point[0] < -0.7*(1-diffScale) ) {
        addX = addX * -1;
      }
      point[0] += addX;
      if(point[1] > 0.8*(1-diffScale) || point[1] < -0.8*(1-diffScale) ) {
        addY = addY * -1;
      }
      point[1] += addY;
      if(point[2] > 0.8*(1-diffScale) || point[2] < -0.8*(1-diffScale) ) {
        addZ = addZ * -1;
      }
      point[2] += addZ;
      gl.uniform3fv(transLoc, point);
      theta2[1] -= (adder * 2.5);
      gl.uniform3fv(theta2Loc, theta2);
      gl.drawArrays(gl.TRIANGLES, 0, nBlock);

      requestAnimationFrame(render);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    gl.activeTexture(gl.TEXTURE0);
    var sampler0Loc = gl.getUniformLocation(shaders[0], 'sampler0');
    gl.uniform1i(sampler0Loc, 0);
    
    // Asynchronously load an image
    var image = new Image();
    image.src = "images/txStainglass.bmp";
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
    });

    render();
  }

})(window || this);