/* Alpha Seller — the shader on the last growth tile.

   A warped fractal-noise field in the brand green, the standard domain-warping recipe:
   noise sampled at a point that has itself been pushed around by two more layers of noise,
   which is what gives the slow marbled drift rather than plain moving blobs. Everything is
   in this file and in WebGL 1, so the demo still runs with no network.

   It only draws while the tile is on screen — an IntersectionObserver starts and stops the
   loop — and it draws a single frame and stops for a visitor who asked for less motion.
   The canvas is sized from its own box, capped at 2x device pixels: it is a 388px square at
   most, and there is no point paying for more. */

const canvas = document.querySelector('.tile__shader');

if (canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false });

  if (gl) {
    const VERT = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    /* --ground is black and --c-green is #A6ED00; both are written in here rather than read
       from CSS, because this tile keeps its own colours the way the case cards do. */
    const FRAG = `
      precision highp float;

      uniform vec2 u_res;
      uniform float u_time;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      /* Value noise with a smoothstep fade — cheap, and smooth enough that four octaves of
         it read as cloud rather than as a grid. */
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 5; i++) {
          v += amp * noise(p);
          p *= 2.02;
          amp *= 0.5;
        }
        return v;
      }

      void main() {
        /* Square-corrected coordinates, so the pattern does not stretch with the box. */
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 p = uv * 2.2;
        p.x *= u_res.x / u_res.y;

        float t = u_time * 0.05;

        /* Two warps. The second is sampled at the point the first moved, which is where the
           folding and the sheen come from. */
        vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
        vec2 r = vec2(
          fbm(p + 3.4 * q + vec2(1.7, 9.2) + 0.6 * t),
          fbm(p + 3.4 * q + vec2(8.3, 2.8) - 0.5 * t)
        );
        float f = fbm(p + 3.6 * r);

        vec3 ink = vec3(0.03, 0.03, 0.03);
        vec3 green = vec3(0.651, 0.929, 0.0);   /* #A6ED00 */
        /* Deeper green in the troughs so the field has a body and not just a glow. */
        vec3 deep = green * 0.22;

        vec3 col = mix(ink, deep, clamp(f * 1.9, 0.0, 1.0));
        col = mix(col, green, clamp(pow(f, 2.2) * 2.4, 0.0, 1.0));
        /* The highlight rides the warp, not the noise, so it moves across the folds. */
        col += green * pow(clamp(r.x, 0.0, 1.0), 5.0) * 0.55;
        /* Dark at the top, where the text sits, bright at the foot — the tile has to stay
           legible, and gl_FragCoord counts up from the bottom, so this reads inverted. */
        col *= 0.35 + 0.85 * (1.0 - uv.y);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type, src) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);

    if (vs && fs) {
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);

      /* One triangle that covers the clip space — cheaper than two, and nothing here needs
         a quad's seam. */
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

      const a_pos = gl.getAttribLocation(program, 'a_pos');
      gl.enableVertexAttribArray(a_pos);
      gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);

      const u_res = gl.getUniformLocation(program, 'u_res');
      const u_time = gl.getUniformLocation(program, 'u_time');

      const stillness = window.matchMedia('(prefers-reduced-motion: reduce)');
      let raf = null;
      let started = 0;

      const size = () => {
        const box = canvas.getBoundingClientRect();
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(box.width * scale));
        const h = Math.max(1, Math.round(box.height * scale));
        if (canvas.width === w && canvas.height === h) return;
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      };

      const draw = (seconds) => {
        size();
        gl.uniform2f(u_res, canvas.width, canvas.height);
        gl.uniform1f(u_time, seconds);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const frame = (now) => {
        if (!started) started = now;
        draw((now - started) / 1000);
        raf = requestAnimationFrame(frame);
      };

      const run = (on) => {
        if (on && !raf && !stillness.matches) {
          raf = requestAnimationFrame(frame);
          return;
        }
        if (!on && raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      };

      /* The tile is one screen down a page of eight; there is no reason to burn a frame
         budget on it until it is in view. */
      new IntersectionObserver(
        (entries) => entries.forEach((entry) => run(entry.isIntersecting)),
        { threshold: 0 }
      ).observe(canvas);

      /* A first frame regardless, so the tile is never a black hole: on load, on a resize,
         and for a visitor who asked for less motion, who gets this one and nothing after. */
      draw(0);
      window.addEventListener('resize', () => { if (!raf) draw(0); });
      stillness.addEventListener('change', () => {
        if (stillness.matches) run(false);
      });
    }
  }
}
