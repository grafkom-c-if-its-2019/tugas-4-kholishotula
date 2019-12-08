(function() {

    glUtils.SL.init({ callback: function() { main(); } });

    point = [0.0, 0.0, 0.0];
    addX = 0.02;
    addY = 0.03;
    addZ = 0.04;
  
    function main() {
      
      var canvas = document.getElementById("glcanvas");
      var gl = glUtils.checkWebGL(canvas);
    
      // 1 untuk kubus, 2 untuk huruf
      var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);   
      var vertex2Shader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
        fragment2Shader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);
      var program = glUtils.createProgram(gl, vertexShader, fragmentShader);
      var program2 = glUtils.createProgram(gl, vertex2Shader, fragment2Shader);

      var theta = [ 0.0, 0.0, 0.0 ];
      var axis = 0;
      var xAxis = 0, yAxis = 1, zAxis = 2;

      function eventListener()
      {
        // Interaksi dengan keyboard
        function onKeyDown(event) {
            if (event.keyCode == 189) axis = xAxis;    // tombol '-'
            else if (event.keyCode == 187) axis = yAxis; // tombol '='
            else if (event.keyCode == 48) axis = zAxis;       // tombol '0'
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
      }
      
      function render() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
        // Bersihkan buffernya canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
        gl.useProgram(program);
        initCube();
        gl.drawArrays(gl.TRIANGLES, 0, 30);

        gl.useProgram(program2);
        initAlpha();
        gl.drawArrays(gl.TRIANGLES, 0, 21);

        requestAnimationFrame(render);
      }

      function initCube()
      {
  
        var cubeVertices = new Float32Array([ 
            // x, y, z            u, v         normal
        
            // depan BAD BDC tidak perlu, karena dibiarkan terbuka
            // -0.5,  0.5,  0.5,     0.0, 1.0,  0.0, 0.0, 1.0,
            // -0.5, -0.5,  0.5,     0.0, 0.0,  0.0, 0.0, 1.0, 
            //  0.5, -0.5,  0.5,     1.0, 0.0,  0.0, 0.0, 1.0, 
            // -0.5,  0.5,  0.5,     0.0, 1.0,  0.0, 0.0, 1.0, 
            //  0.5, -0.5,  0.5,     1.0, 0.0,  0.0, 0.0, 1.0, 
            //  0.5,  0.5,  0.5,     1.0, 1.0,  0.0, 0.0, 1.0, 
        
            // kanan CDH CHG
            0.5,  0.5,  0.5,     0.0, 1.0,  1.0, 0.0, 0.0,
            0.5, -0.5,  0.5,     0.0, 0.0,  1.0, 0.0, 0.0,
            0.5, -0.5, -0.5,     0.2, 0.0,  1.0, 0.0, 0.0,
            0.5,  0.5,  0.5,     0.0, 1.0,  1.0, 0.0, 0.0,
            0.5, -0.5, -0.5,     0.2, 0.0,  1.0, 0.0, 0.0,
            0.5,  0.5, -0.5,     0.2, 1.0,  1.0, 0.0, 0.0,
    
            // bawah DAE DEH
            0.5, -0.5,  0.5,     0.2, 1.0,  0.0, -1.0, 0.0,
            -0.5, -0.5,  0.5,     0.2, 0.0,  0.0, -1.0, 0.0,
            -0.5, -0.5, -0.5,     0.4, 0.0,  0.0, -1.0, 0.0,
            0.5, -0.5,  0.5,     0.2, 1.0,  0.0, -1.0, 0.0,
            -0.5, -0.5, -0.5,     0.4, 0.0,  0.0, -1.0, 0.0,
            0.5, -0.5, -0.5,     0.4, 1.0,  0.0, -1.0, 0.0,
    
            // belakang EFG EGH
            -0.5, -0.5, -0.5,     0.4, 1.0,  0.0, 0.0, -1.0,
            -0.5,  0.5, -0.5,     0.4, 0.0,  0.0, 0.0, -1.0,
            0.5,  0.5, -0.5,     0.6, 0.0,  0.0, 0.0, -1.0,
            -0.5, -0.5, -0.5,     0.4, 1.0,  0.0, 0.0, -1.0,
            0.5,  0.5, -0.5,     0.6, 0.0,  0.0, 0.0, -1.0,
            0.5, -0.5, -0.5,     0.6, 1.0,  0.0, 0.0, -1.0,
    
            // kiri FEA FAB
            -0.5,  0.5, -0.5,     0.6, 1.0,  -1.0, 0.0, 0.0,
            -0.5, -0.5, -0.5,     0.6, 0.0,  -1.0, 0.0, 0.0,
            -0.5, -0.5,  0.5,     0.8, 0.0,  -1.0, 0.0, 0.0,
            -0.5,  0.5, -0.5,     0.6, 1.0,  -1.0, 0.0, 0.0,
            -0.5, -0.5,  0.5,     0.8, 0.0,  -1.0, 0.0, 0.0,
            -0.5,  0.5,  0.5,     0.8, 1.0,  -1.0, 0.0, 0.0,
    
            // atas GFB GBC
            0.5,  0.5, -0.5,     0.8, 1.0,  0.0, 1.0, 0.0,
            -0.5,  0.5, -0.5,     0.8, 0.0,  0.0, 1.0, 0.0,
            -0.5,  0.5,  0.5,     1.0, 0.0,  0.0, 1.0, 0.0,
            0.5,  0.5, -0.5,     0.8, 1.0,  0.0, 1.0, 0.0,
            -0.5,  0.5,  0.5,     1.0, 0.0,  0.0, 1.0, 0.0,
            0.5,  0.5,  0.5,     1.0, 1.0,  0.0, 1.0, 0.0
        ]);
    
        // Link antara CPU Memory dengan GPU Memory
        var cubeVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
    
        // Link untuk attribute
        var vPosition = gl.getAttribLocation(program, 'vPosition');
        var vNormal = gl.getAttribLocation(program, 'vNormal');
        var vTexCoord = gl.getAttribLocation(program, 'vTexCoord');
        gl.vertexAttribPointer(
            vPosition,  // variabel yang memegang posisi attribute di shader
            3,          // jumlah elemen per atribut
            gl.FLOAT,   // tipe data atribut
            false, 
            8 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex 
            0                                   // offset dari posisi elemen di array
        );
        gl.vertexAttribPointer(
            vNormal,
            3,
            gl.FLOAT,
            false,
            8 * Float32Array.BYTES_PER_ELEMENT,
            5 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.vertexAttribPointer(
            vTexCoord,
            2,
            gl.FLOAT,
            false,
            8 * Float32Array.BYTES_PER_ELEMENT,
            3 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.enableVertexAttribArray(vPosition);
        gl.enableVertexAttribArray(vNormal);
        gl.enableVertexAttribArray(vTexCoord);
    
        // Definisi matriks pandangan (view matrix)
        var vmLoc = gl.getUniformLocation(program, 'viewMatrix');
        var vm = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(vm,
            glMatrix.mat3.fromValues(0.0, 0.0, 1.0), // eye: posisi kamera
            glMatrix.mat3.fromValues(0.0, 0.0, 0.0), // at: posisi kamera menghadap
            glMatrix.mat3.fromValues(0.0, 1.0, 0.0)  // up: posisi arah atas kamera
        );
        gl.uniformMatrix4fv(vmLoc, false, vm);
    
        // Definisi matriks proyeksi perspektif
        var pmLoc = gl.getUniformLocation(program, 'perspectiveMatrix');
        var pm = glMatrix.mat4.create();
        glMatrix.mat4.perspective(pm,
            glMatrix.glMatrix.toRadian(90), // fovy dalam radian
            canvas.width / canvas.height,
            0.1,  // near
            10.0  // far
        );
        gl.uniformMatrix4fv(pmLoc, false, pm);

        // Definisi matriks model
        var mmLoc = gl.getUniformLocation(program, 'modelMatrix');
        var mm = glMatrix.mat4.create();
        glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -0.2]);
        glMatrix.mat4.rotateX(mm, mm, theta[xAxis]);
        glMatrix.mat4.rotateY(mm, mm, theta[yAxis]);
        glMatrix.mat4.rotateZ(mm, mm, theta[zAxis]);
        gl.uniformMatrix4fv(mmLoc, false, mm);

        // Definisi matriks normal
        var nmLoc = gl.getUniformLocation(program, 'normalMatrix');
        var nm = glMatrix.mat3.create();
        glMatrix.mat3.normalFromMat4(nm, mm);
        gl.uniformMatrix3fv(nmLoc, false, nm);
           
        // Definisi cahaya
        var lightColorLoc = gl.getUniformLocation(program, 'lightColor');
        var lightPositionLoc = gl.getUniformLocation(program, 'lightPosition');
        var lightColor = [1.0, 1.0, 1.0]; // Cahaya warna putih
        var lightPosition = glMatrix.vec3.fromValues(0+point[0], 0+point[1], 0+point[2]);
        gl.uniform3fv(lightColorLoc, lightColor);
        gl.uniform3fv(lightPositionLoc, lightPosition);
        var ambientColorLoc = gl.getUniformLocation(program, 'ambientColor');
        gl.uniform3fv(ambientColorLoc, glMatrix.vec3.fromValues(0.17, 0.40, 0.30));
        var shineLoc = gl.getUniformLocation(program, 'shininess');
        var shine = 0.06;
        gl.uniform1f(shineLoc, shine);   
      }
      
      function initAlpha()
      {
        var triVertices = new Float32Array([
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

        var triangleVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triVertices), gl.STATIC_DRAW);

        var vPosition = gl.getAttribLocation(program2, 'vPosition');
        var vColor = gl.getAttribLocation(program2, 'vColor');

        gl.vertexAttribPointer(
            vPosition,
            2, gl.FLOAT,
            false,
            5 * Float32Array.BYTES_PER_ELEMENT,
            0);
        gl.vertexAttribPointer(
            vColor,
            3,
            gl.FLOAT,
            false,
            5 * Float32Array.BYTES_PER_ELEMENT,
            2 * Float32Array.BYTES_PER_ELEMENT);

        gl.enableVertexAttribArray(vPosition);
        gl.enableVertexAttribArray(vColor);

        var trans = gl.getUniformLocation(program2, 'bounce');
        var mid = gl.getUniformLocation(program2, 'mid');

        if (point[0] < -0.45 || point[0] > 0.45) {
            addX*=-1;
        }

        point[0] += addX;
        var middle_point = -0.3 + point[0];
        
        gl.uniform1f(mid, middle_point);

        if (point[1] < -0.45 || point[1] > 0.45) {
            addY*=-1;
        }

        point[1] += addY;

        if (point[2] < -0.45 || point[2] > 0.45) {
            addZ*=-1;
        }

        point[2] += addZ;
        
        gl.uniform3fv(trans, point);
        

        if (scale >= 1) flag = -1;
        else if (scale <= -1) flag = 1;
        scale = scale + (flag * 0.00130); 
        gl.uniform1f(scaleLoc, scale);

        // Definisi matriks pandangan (view matrix)
        var vmLoc = gl.getUniformLocation(program2, 'viewMatrix');
        var vm = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(vm,
            glMatrix.mat3.fromValues(0.0, 0.0,  1.0), // eye: posisi kamera
            glMatrix.mat3.fromValues(0.0, 0.0, -2.0), // at: posisi kamera menghadap
            glMatrix.mat3.fromValues(0.0, 1.0,  0.0)  // up: posisi arah atas kamera
        );
        gl.uniformMatrix4fv(vmLoc, false, vm);
    
        // Definisi matriks proyeksi perspektif
        var pmLoc = gl.getUniformLocation(program2, 'perspectiveMatrix');
        var pm = glMatrix.mat4.create();
        glMatrix.mat4.perspective(pm,
            glMatrix.glMatrix.toRadian(90), // fovy dalam radian
            canvas.width / canvas.height,
            0.5,  // near
            10.0  // far
        );
        gl.uniformMatrix4fv(pmLoc, false, pm);

        // Definisi matriks model
        var mmLoc = gl.getUniformLocation(program2, 'modelMatrix');
        var mm = glMatrix.mat4.create();
        glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -0.2]);
        glMatrix.mat4.translate(mm, mm, point);
        glMatrix.mat4.scale(mm, mm, [0.2, 0.2, 0.2]);
        glMatrix.mat4.scale(mm, mm, [scale, 1.0, 1.0]);
        gl.uniformMatrix4fv(mmLoc, false, mm);

        // Definisi matriks normal
        var nmLoc = gl.getUniformLocation(program2, 'normalMatrix');
        var nm = glMatrix.mat3.create();
        glMatrix.mat3.normalFromMat4(nm, mm);
        gl.uniformMatrix3fv(nmLoc, false, nm);
           
        // Definisi cahaya
        var lightColorLoc = gl.getUniformLocation(program2, 'lightColor');
        var lightPositionLoc = gl.getUniformLocation(program2, 'lightPosition');
        var lightColor = [1.0, 1.0, 1.0]; // Cahaya warna putih
        var lightPosition = glMatrix.vec3.fromValues(0+point[0], 0+point[1], 0+point[2]);
        gl.uniform3fv(lightColorLoc, lightColor);
        gl.uniform3fv(lightPositionLoc, lightPosition);
        var ambientColorLoc = gl.getUniformLocation(program2, 'ambientColor');
        gl.uniform3fv(ambientColorLoc, glMatrix.vec3.fromValues(0.17, 0.40, 0.30));
        var shineLoc = gl.getUniformLocation(program2, 'shininess');
        var shine = 0.01;
        gl.uniform1f(shineLoc, shine);   
      }
  
      function initTexture()
      {
        gl.useProgram(program);
        var sampler0Loc = gl.getUniformLocation(program, 'sampler0');
        gl.uniform1i(sampler0Loc, 0);

        // Create a texture.
        var texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                        new Uint8Array([0, 0, 255, 255]));
    
        var imageSource = 'images/ini.png';
        var promise = new Promise(function(resolve, reject) {
            var image = new Image();
            if (!image) {
                reject(new Error('Gagal membuat objek gambar'));
            }
            image.onload = function() {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                resolve('Sukses');
            }
            image.src = imageSource;
        });
        
        // useTexture(function () {
        //     render();
        // });
      }
      
      function useTexture(callback, args)
      {
        // Asynchronously load an image
        var imageSource = 'images/ini.png';
        var promise = new Promise(function(resolve, reject) {
            var image = new Image();
            if (!image) {
                reject(new Error('Gagal membuat objek gambar'));
            }
            image.onload = function() {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                resolve('Sukses');
            }
            image.src = imageSource;
        });
          promise.then(function() {
            if (callback) {
                callback(args);
            }
          }, function (error) {
            console.log('Galat pemuatan gambar', error);
          });
      }
      
      var scale = 1;
      var flag = 1;
      var scaleLoc = gl.getUniformLocation(program2, 'scale');

      // Bersihkan layar jadi hitam
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
      gl.enable(gl.DEPTH_TEST);
  
      render();
      initTexture();
      eventListener();
    }
  })();
  