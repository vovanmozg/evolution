(() => {
  "use strict";
  const t = 70, e = 40;

  function o(t, e) {
    return t < 0 && (t = 69), t > 69 && (t = 0), e < 0 && (e = 39), e > 39 && (e = 0), { x: t, y: e }
  }

  const n = [[1, 0], [0, -1], [-1, 0], [0, 1]], r = (t, e, o) => o && o[t] && o[t][e] && o[t][e].bot;

  function i(t) {
    return t.push(t.shift()), t
  }

  const s = (t, e, o) => (delete o[t][e].bot, o);

  function a(o, n, r, i) {
    if (((o, n) => {
      if (o >= t || o < 0) throw new Error("x should be from 0 to 70");
      if (n >= e || n < 0) throw new Error("x should be from 0 to 70")
    })(o, n), i[o][n].bot) throw new Error(`Bot already exists in cell ${o}:${n}`);
    return i[o][n].bot = r, i
  }

  function c(t, e, o) {
    return o[t][e]
  }

  const u = {
    x: 0,
    y: 0,
    direction: 0,
    id: null,
    rotate: 1,
    program: { commands: [], current: 0 },
    options: {},
    xp: 127,
    style: { h: 1, s: 1, b: 1 }
  };

  function d(t) {
    return !1 === t.processing
  }

  function m() {
    return `${Math.random()}`
  }

  function h(t, e, o) {
    return {
      ...u,
      id: m(),
      x: t,
      y: e,
      direction: Math.floor(4 * Math.random()),
      rotate: Math.random() > .5 ? 1 : -1,
      program: o(),
      options: {},
      style: { h: Math.random(), s: Math.random(), v: Math.random() }
    }
  }

  function l(t) {
    t.xp -= 1
  }

  function f(t, e, o) {
    t.xp <= 0 && (s(t.x, t.y, e.map), o(t, e.map))
  }

  const p = {
    generateId: m, generateRandom: h, liveStep: l, tryDie: f, cloneBot: function (t, e = {}) {
      return {
        x: void 0 === e.x ? t.x : e.x,
        y: void 0 === e.y ? t.y : e.y,
        id: void 0 === e.id ? t.id : e.id,
        direction: void 0 === e.direction ? t.direction : e.direction,
        xp: void 0 === e.xp ? t.xp : e.xp,
        rotate: t.rotate,
        program: { commands: t.program.commands.slice(), current: t.program.current },
        options: { ...t.options },
        style: { h: t.style.h, s: t.style.s, v: t.style.v },
        processing: t.processing
      }
    }, isProcessing: d, DEFAULT_BOT: u, RIGHT: 0, TOP: 1, LEFT: 2, BOTTOM: 3, DEFAULT_XP: 10
  };

  function g(t, e, o, n) {
    n[t][e].resources = { ...n[t][e].resources, ...o }
  }

  const x = {
    MOVE: 0,
    CLONE: 1,
    EAT: 2,
    EAT_SOLAR: 3,
    ROTATE_CLOCKWISE: 4,
    ROTATE_COUNTERCLOCKWISE: 5,
    OVERPOPULATION: 6
  };

  function y(t) {
    return t[Math.floor(Math.random() * t.length)]
  }

  function E() {
    return y(Object.values(x))
  }

  function w(t) {
    const e = .01;
    let o = Math.random() > .5 ? 1 : -1;
    return (t + e * o <= 0 || t + e * o >= 1) && (o *= -1), t + e * o
  }

  const O = {
    execute: function (t, e) {
      const i = function (t) {
        const e = n[t.direction];
        return o(t.x + e[0], t.y + e[1])
      }(t);
      t.options.hasBotInFront = !!r(i.x, i.y, e.map), t.options.hasBotInFront || function (t, e, o) {
        if (r(e.x, e.y, o)) throw new Error(`Bot in cell ${e.x}:${e.y} already exists`);
        ((t, e, o, n) => {
          n[t][e] = { ...n[t][e], ...o }
        })(e.x, e.y, { bot: t }, o), s(t.x, t.y, o), t.x = e.x, t.y = e.y
      }(t, i, e.map)
    }
  }, T = {
    execute: function (t, e) {
      t.direction = t.direction + 1 & 3
    }
  }, I = {
    execute: function (t, e) {
      t.direction = t.direction + -1 & 3
    }
  }, b = {
    execute: function (t, e) {
      const o = c(t.x, t.y, e.map);
      o.resources.food && (t.xp += 100, t.xp > 255 && (t.xp = 255), delete o.resources.food)
    }
  }, M = {
    execute: function (t, e) {
      const o = c(t.x, t.y, e.map);
      t.xp += 3 * o.resources.light.power
    }
  }, v = {
    execute: function (t, e) {
      const s = function (t) {
        const e = i(i(n))[t.direction];
        return o(t.x + e[0], t.y + e[1])
      }(t);
      if (r(s.x, s.y, e.map)) return;
      if (t.xp < 2 * p.DEFAULT_XP) return;
      t.xp /= 2;
      const c = p.cloneBot(t, { ...s, id: p.generateId(), direction: (u = t.direction, u + 2 & 3), xp: p.DEFAULT_XP });
      var u;
      a(c.x, c.y, c, e.map)
    }
  }, A = {
    execute: function (t, e) {
      let n = 0;
      !function (t, e, i, s) {
        for (let i = -1; i <= 1; i += 1) for (let a = -1; a <= 1; a += 1) if (0 !== i && 0 !== a) {
          const c = o(t.x + i, t.y + a), u = r(c.x, c.y, e.map);
          u && s(u) && (n += 1)
        }
      }(t, e, 0, d), t.xp -= (t => t / 3)(n)
    }
  }, L = function (t, e) {
    if (!0 === t.processing) return;
    t.processing = !0;
    const o = {
      [x.MOVE]: O,
      [x.ROTATE_CLOCKWISE]: T,
      [x.ROTATE_COUNTERCLOCKWISE]: I,
      [x.EAT]: b,
      [x.EAT_SOLAR]: M,
      [x.CLONE]: v,
      [x.OVERPOPULATION]: A
    };
    t.program.current >= t.program.commands.length && (t.program.current = t.program.commands.length - 1);
    const n = t.program.commands[t.program.current];
    void 0 !== n && (t.program.current += 1, t.program.current >= t.program.commands.length && (t.program.current = 0), o[n].execute(t, e), n === x.EAT_SOLAR && A.execute(t, e))
  }, R = function () {
    const t = [x.MOVE, x.ROTATE_CLOCKWISE, x.ROTATE_COUNTERCLOCKWISE, x.EAT, x.EAT_SOLAR, x.CLONE, x.OVERPOPULATION];
    return t[Math.floor(Math.random() * t.length)]
  };

  function C() {
    const t = [];
    for (let e = 0; e < 10; e += 1) t.push(R());
    return { commands: t, current: 0 }
  }

  function D(o, n) {
    for (let o = 0; o < t; o += 1) for (let t = 0; t < e; t += 1) n(o, t)
  }

  function P(t, e) {
    D(0, ((o, n) => {
      const i = r(o, n, t.map);
      i && e(i)
    }))
  }

  function z(t) {
    P(t, (e => {
      (function (t) {
        if (Math.random() > .001) return;
        const e = [(t, e) => function (t, e) {
          return t[e] = E(), t
        }(t, e), (t, e) => function (t, e) {
          return t.splice(e, 1), t
        }(t, e), (t, e) => function (t, e) {
          return t.splice(e, 0, E()), t
        }(t, e)], o = Math.floor(Math.random() * t.program.commands.length);
        y(e)(t.program.commands, o), t.style.h = w(t.style.h), t.style.s = w(t.style.s), t.style.v = w(t.style.v)
      })(e), function (t, e) {
        L(t, e)
      }(e, t), l(e), f(e, t, ((t, e) => {
        g(t.x, t.y, { food: { type: "food" } }, e)
      }))
    })), function (t) {
      P(t, (t => {
        t.processing = !1
      }))
    }(t)
  }

  const B = (t, e, o) => t >= o[0] && t <= o[2] && e >= o[1] && e <= o[3];

  class ${constructor(o){this.world=o,this.size=10;const n=document.getElementById("cnv");this.ctx=n.getContext("2d"),this.ctx.imageSmoothingEnabled=!1,n.width=t*this.size,n.height=e*this.size}
  redraw

  ()
  {
    const o = this.ctx.createImageData(t * this.size, e * this.size);
    for (let n = 0; n < t * this.size * e * this.size * 4; n += 4) o.data[n] = 0, o.data[n + 1] = 0, o.data[n + 2] = 0, o.data[n + 3] = 255;
    D(this.world, ((t, e) => {
      const n = c(t, e, this.world.map);
      n.resources && this.drawResource(t, e, n.resources, o)
    })), P(this.world, (t => {
      this.drawBot(t, o)
    })), this.ctx.putImageData(o, 0, 0)
  }
  drawResource(t, e, o, n)
  {
    if (o.food) {
      t *= this.size, e *= this.size;
      const o = { r: 140, g: 80, b: 0 };
      this.writeImageDataResource(t, e, o, n)
    }
  }
  writeImageDataResource(t, e, o, n)
  {
    for (let r = t + 3; r < t + this.size - 3; r += 1) for (let t = e + 3; t < e + this.size - 3; t += 1) this.writeImageDataPixel(r, t, o, n)
  }
  getColor(t)
  {
    const e = [0, .15, .3, .45, .6, .75, .9], o = t.program.commands.map((t => e[t])),
      n = o.reduce(((t, e) => t + e), 0) / o.length || 0;
    return function (t, e, o) {
      let n, r, i;
      1 === arguments.length && (e = t.s, o = t.v, t = t.h);
      const s = Math.floor(6 * t), a = 6 * t - s, c = o * (1 - e), u = o * (1 - a * e), d = o * (1 - (1 - a) * e);
      switch (s % 6) {
        case 0:
          n = o, r = d, i = c;
          break;
        case 1:
          n = u, r = o, i = c;
          break;
        case 2:
          n = c, r = o, i = d;
          break;
        case 3:
          n = c, r = u, i = o;
          break;
        case 4:
          n = d, r = c, i = o;
          break;
        case 5:
          n = o, r = c, i = u
      }
      return { r: Math.round(255 * n), g: Math.round(255 * r), b: Math.round(255 * i) }
    }(t.style.h, t.style.s, n)
  }
  drawBot(t, e)
  {
    const o = this.getColor(t), n = t.x * this.size, r = t.y * this.size;
    this.writeImageDataBot(n, r, t, t.direction, o, e)
  }
  setColor(t)
  {
    return t
  }
  writeImageDataBot(t, e, o, n, r, i)
  {
    const s = t + 1, a = t + this.size - 2, c = e + 1, u = e + this.size - 2, d = t, m = t + this.size - 1, h = e,
      l = e + this.size - 1, f = {
        [p.RIGHT]: [m - 1, h + 4, m, l - 4],
        [p.TOP]: [d + 4, h, m - 4, h + 1],
        [p.LEFT]: [d, h + 4, d + 1, l - 4],
        [p.BOTTOM]: [d + 4, l - 1, m - 4, l]
      }[n];
    for (let t = c; t <= u; t += 1) B(d, t, f) || this.writeImageDataPixel(d, t, r, i), B(m, t, f) || this.writeImageDataPixel(m, t, r, i);
    for (let t = s; t <= a; t += 1) B(t, h, f) || this.writeImageDataPixel(t, h, r, i), B(t, l, f) || this.writeImageDataPixel(t, l, r, i);
    for (let t = s; t <= a; t += 1) for (let e = c; e <= u; e += 1) B(t, e, f) || this.writeImageDataPixel(t, e, r, i)
  }
  writeImageDataPixel(e, o, n, r)
  {
    let i = o * t * this.size * 4 + 4 * e;
    r.data[i] = n.r, i += 1, r.data[i] = n.g, i += 1, r.data[i] = n.b, i += 1, r.data[i] = void 0 === n.a ? 255 : n.a
  }
}
const _ = {};
let S, F = 0;
const U = document.getElementById("cnv"), N = document.getElementById("info"), W = U.clientWidth / t,
  K = U.clientHeight / e, V = () => {
    void 0 !== _.botX && void 0 !== _.botY && (_.bot = r(_.botX, _.botY, S.map))
  }, X = t => {
    _.botX = parseInt(t.x / W, 10), _.botY = parseInt(t.y / K, 10), V()
  };

function k() {
  const { bot: t } = _;
  void 0 === t || t && t.xp <= 0 ? V() : N.innerHTML = `x: ${t.x}</br>y: ${t.y}</br>xp: ${parseInt(t.xp, 10)}</br>program: ${t.program.commands}</br>id: ${t.id}</br>`
}

function H(t) {
  S = t, U.addEventListener("mousedown", X), setInterval(k, 1e3)
}

let Y;

function q(t, e) {
  const o = performance.now();
  return t(e), performance.now() - o
}

function G(t) {
  var e;
  e = [q(z, t), q(Y)], F += 1, window.debugInfo1 = `${F} ${Date.now()} perf: ${e[0]}, ${e[1]} milliseconds`, requestAnimationFrame((() => G(t)))
}

const j = function () {
  const t = function () {
    const t = { map: [] };
    return function (t) {
      D(0, ((e, o) => {
        !function (t, e, o, n = { resources: {} }) {
          void 0 === o[t] && (o[t] = []), o[t][e] = n
        }(e, o, t.map)
      }))
    }(t), function (t) {
      D(0, ((e, o) => {
        Math.random() > .9 && a(e, o, h(e, o, C), t.map)
      }))
    }(t), function (t) {
      D(0, ((o, n) => {
        Math.random() > .9 && g(o, n, { food: { type: "food" } }, t.map), g(o, n, {
          light: {
            type: "light",
            power: 1 - n / e
          }
        }, t.map)
      }))
    }(t), window.debugWorld = t, t
  }();
  !function (t, e) {
    Y = e.redraw.bind(e), requestAnimationFrame((() => G(t))), setInterval((() => {
      console.log(Date.now(), window.debugInfo1)
    }), 1e3), H(t)
  }(t, new $(t))
};
j()
})
();
//# sourceMappingURL=main.js.map
