/* Alpha Seller — the orb on the last growth tile.

   A voice-assistant / "thinking" orb, in the brand green. Written here in WebGL 1 rather
   than pulled in: the demo has to run with no network, and the libraries that do this
   (react-bits' Orb on OGL, ElevenLabs' UI orb, the Skia one for React Native) are all React
   and would cost more than the tile is worth. The **technique** is theirs, and it is the one
   every orb in that family uses:

     - polar coordinates around a centre, so everything is written as a radius and an angle;
     - a noise field modulating that radius, which is what makes the edge breathe instead of
       being a circle;
     - inverse-square falloffs (`1 / (1 + k*d*d)`) standing in for lights, rather than any
       real lighting: one for the rim, one or two more for the highlights travelling around
       inside it;
     - smoothstep rings for the inner and outer fades, so the body has depth;
     - on hover: the orb leans toward the pointer, its uv is rippled, and the whole thing
       brightens and speeds up.

   Everything the pointer drives is smoothed in JS (an exponential approach per frame), so
   the orb follows the hand rather than snapping to it, and settles back to the middle when
   the pointer leaves. */

const canvas = document.querySelector('.tile__shader');

if (canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false });

  if (gl) {
    const VERT = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    /* The greens are the brand's `#A6ED00` and two derivations of it. They live here rather
       than being read from CSS because this tile keeps its own colours, the way the case
       cards do. */
    const FRAG = `
      precision highp float;

      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;    /* in pixels, canvas space; the tile's centre when idle */
      uniform float u_hover;   /* 0..1, smoothed in JS */
      uniform float u_margin;  /* px, canvas space — the gap from the tile's corner */

      float hash(vec3 p) {
        p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      /* Value noise in 3D — the third axis is time, so the field evolves instead of
         scrolling. Smooth enough at three octaves to read as breath. */
      float noise(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
              mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
          mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
              mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
          f.z);
      }

      float fbm(vec3 p) {
        float v = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 3; i++) {
          v += amp * noise(p);
          p *= 2.03;
          amp *= 0.5;
        }
        return v;
      }

      /* The two falloffs every orb of this kind is built out of: linear for a soft wash,
         quadratic for a point of light. */
      float wash(float intensity, float k, float d) { return intensity / (1.0 + k * d); }
      float lamp(float intensity, float k, float d) { return intensity / (1.0 + k * d * d); }

      void main() {
        float size = min(u_res.x, u_res.y);
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / size * 2.0;
        vec2 mouse = (u_mouse - 0.5 * u_res) / size * 2.0;

        /* The orb stands in the bottom-left corner, u_margin px clear of both edges —
           the client's call, 2026-09-03, after one round centred. Its resting radius is
           0.27 uv, and 1 uv is half the short side, so the centre has to sit a margin plus
           that radius in from each edge; everything below is written around this origin. */
        float rest = 0.135 * size;   /* the resting radius, in pixels */
        vec2 origin = (vec2(u_margin + rest) - 0.5 * u_res) / size * 2.0;
        uv -= origin;
        mouse -= origin;

        float t = u_time * (1.0 + 0.5 * u_hover);

        /* Lean toward the pointer, and ripple with it. Both are the hover alone — at rest
           the orb is centred and smooth. The lean is in uv units, so it shrank with the
           orb; 0.10 keeps it reading as the same gesture against the smaller body. */
        uv -= 0.10 * u_hover * mouse;
        uv += 0.014 * u_hover * sin(14.0 * uv.yx + t * 1.6);

        float len = length(uv);
        float ang = atan(uv.y, uv.x);

        /* The breathing edge: a slow pulse plus a noise field, so the silhouette is never
           twice the same and never a circle. */
        float n = fbm(vec3(uv * 2.8, t * 0.30));
        float radius = 0.27 + 0.016 * sin(t * 0.9) + 0.060 * (n - 0.5) + 0.024 * u_hover;

        /* Distance to the edge, which is what the rim light is attached to. */
        float edge = abs(len - radius);
        float rim = wash(1.0, 52.0, edge) * smoothstep(radius * 1.55, radius * 0.55, len);

        /* Two highlights orbiting inside, at different speeds and in opposite directions —
           the "thinking" motion. A third, slower one keeps the body from ever going flat. */
        vec2 p1 = vec2(cos(t * 0.62), sin(t * 0.62)) * radius * 0.62;
        vec2 p2 = vec2(cos(-t * 0.41 + 2.1), sin(-t * 0.41 + 2.1)) * radius * 0.74;
        vec2 p3 = vec2(cos(t * 0.23 + 4.0), sin(t * 0.23 + 4.0)) * radius * 0.35;
        float l1 = lamp(0.85, 64.0, distance(uv, p1));
        float l2 = lamp(0.65, 88.0, distance(uv, p2));
        float l3 = lamp(0.45, 36.0, distance(uv, p3));

        /* Body and halo. The body is filled inward from the edge; the halo is what escapes
           it, and it is what makes the tile glow rather than hold a sticker. */
        float body = smoothstep(radius + 0.01, radius - 0.15, len);
        float halo = exp(-3.2 * max(len - radius, 0.0) * 12.0);

        vec3 green = vec3(0.651, 0.929, 0.0);   /* #A6ED00 */
        vec3 mint = mix(green, vec3(1.0), 0.55);
        vec3 deep = green * 0.18;

        /* Colour by depth: deep green in the body, brand green where the lights fall, mint
           at their cores. The angular term keeps a slow sweep going around the rim. */
        float sweep = 0.5 + 0.5 * cos(ang * 1.0 + t * 0.8);
        vec3 col = deep * body;
        col += green * (rim * (0.55 + 0.45 * sweep));
        col += green * (l1 + l2) * body;
        col += mint * (l1 * l1 * 0.9 + l2 * l2 * 0.6 + l3 * 0.25) * body;
        col += green * halo * (0.22 + 0.20 * u_hover);

        /* A touch of grain, so the gradients do not band on a dark ground. */
        col += (hash(vec3(gl_FragCoord.xy, floor(u_time * 24.0))) - 0.5) * 0.015;

        /* Sits on the tile's own near-black rather than on pure black. */
        vec3 ink = vec3(0.102, 0.094, 0.090);
        gl_FragColor = vec4(ink + col, 1.0);
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

      /* One triangle covering clip space — cheaper than two, and nothing here needs a quad's
         seam. */
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

      const a_pos = gl.getAttribLocation(program, 'a_pos');
      gl.enableVertexAttribArray(a_pos);
      gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);

      const u_res = gl.getUniformLocation(program, 'u_res');
      const u_time = gl.getUniformLocation(program, 'u_time');
      const u_mouse = gl.getUniformLocation(program, 'u_mouse');
      const u_hover = gl.getUniformLocation(program, 'u_hover');
      const u_margin = gl.getUniformLocation(program, 'u_margin');

      const tile = canvas.closest('.tile') || canvas;
      const stillness = window.matchMedia('(prefers-reduced-motion: reduce)');

      let raf = null;
      let started = 0;
      /* CSS px from the tile's corner to the orb's edge. Scaled to canvas pixels at draw
         time, so it stays 28 on the page at either device ratio. 20 → 28 on the client's
         call, 2026-09-03: he asked for exactly 8 more once the orb had been halved. */
      const MARGIN = 28;
      let ratio = 1;

      /* Where the pointer is, and where the shader currently believes it is. The gap between
         the two is the whole feel of it: the orb never arrives at the cursor, it leans. */
      const target = { x: 0.5, y: 0.5, hover: 0 };
      const eased = { x: 0.5, y: 0.5, hover: 0 };

      const size = () => {
        const box = canvas.getBoundingClientRect();
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        ratio = scale;
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
        /* The uniform is in canvas pixels and GL counts y up from the bottom. */
        gl.uniform2f(u_mouse, eased.x * canvas.width, (1 - eased.y) * canvas.height);
        gl.uniform1f(u_hover, eased.hover);
        gl.uniform1f(u_margin, MARGIN * ratio);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      /* Exponential approach, framerate-independent enough for this: the constants are a
         third of the way per frame at 60fps for the position, a fifth for the hover, so the
         lean lands in about a tenth of a second and the brightening a shade slower. */
      const follow = () => {
        eased.x += (target.x - eased.x) * 0.09;
        eased.y += (target.y - eased.y) * 0.09;
        eased.hover += (target.hover - eased.hover) * 0.06;
      };

      const frame = (now) => {
        if (!started) started = now;
        follow();
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

      /* The pointer is tracked on the tile, not the canvas: the canvas is under the text,
         and a pointer over the words is still a pointer over the tile. */
      tile.addEventListener('pointermove', (e) => {
        const box = canvas.getBoundingClientRect();
        target.x = (e.clientX - box.left) / box.width;
        target.y = (e.clientY - box.top) / box.height;
        target.hover = 1;
      });

      tile.addEventListener('pointerleave', () => {
        target.x = 0.5;
        target.y = 0.5;
        target.hover = 0;
      });

      /* No reason to burn a frame budget on a tile a screen and a half down the page. */
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
