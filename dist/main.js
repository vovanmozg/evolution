(() => {
  "use strict";
  const t = 100;

  function n(t, n) {
    return t < 0 && (t = 99), t > 99 && (t = 0), n < 0 && (n = 49), n > 49 && (n = 0), { x: t, y: n }
  }

  const o = [[1, 0], [0, -1], [-1, 0], [0, 1]], e = (t, n, o) => o && o[t] && o[t][n] && o[t][n].bot;

  function r(t) {
    return t.push(t.shift()), t
  }

  const c = (t, n, o) => (delete o[t][n].bot, o);

  function i(n, o, e, r) {
    if (((n, o) => {
      if (n >= t || n < 0) throw new Error("x should be from 0 to 100");
      if (o >= 50 || o < 0) throw new Error("x should be from 0 to 100")
    })(n, o), r[n][o].bot) throw new Error(`Bot already exists in cell ${n}:${o}`);
    return r[n][o].bot = e, r
  }

  function a(t, n, o) {
    return o[t][n]
  }

  const s = {
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

  function u() {
    return `${Math.random()}`
  }

  function d(t, n, o) {
    return {
      ...s,
      id: u(),
      x: t,
      y: n,
      direction: Math.floor(4 * Math.random()),
      rotate: Math.random() > .5 ? 1 : -1,
      program: o(),
      options: {},
      style: { h: Math.random(), s: Math.random(), v: Math.random() }
    }
  }

  function f(t) {
    t.xp -= 1
  }

  function m(t, n, o) {
    t.xp <= 0 && (c(t.x, t.y, n.map), o(t, n.map))
  }

  const p = {
    generateId: u, generateRandom: d, liveStep: f, tryDie: m, cloneBot: function (t, n = {}) {
      return {
        x: void 0 === n.x ? t.x : n.x,
        y: void 0 === n.y ? t.y : n.y,
        id: void 0 === n.id ? t.id : n.id,
        direction: void 0 === n.direction ? t.direction : n.direction,
        xp: void 0 === n.xp ? t.xp : n.xp,
        rotate: t.rotate,
        program: { commands: t.program.commands.slice(), current: t.program.current },
        options: { ...t.options },
        style: { h: t.style.h, s: t.style.s, v: t.style.v },
        processing: t.processing
      }
    }, isProcessing: function (t) {
      return !1 === t.processing
    }, DEFAULT_BOT: s, RIGHT: 0, TOP: 1, LEFT: 2, BOTTOM: 3, DEFAULT_XP: 10
  };

  function l(t, n, o, e) {
    e[t][n].resources = { ...e[t][n].resources, ...o }
  }

  const h = { MOVE: 0, CLONE: 1, EAT: 2, EAT_SOLAR: 3, ROTATE_CLOCKWISE: 4, ROTATE_COUNTERCLOCKWISE: 5 };

  function g(t) {
    return t[Math.floor(Math.random() * t.length)]
  }

  function x() {
    return g(Object.values(h))
  }

  function y(t) {
    const n = .01;
    let o = Math.random() > .5 ? 1 : -1;
    return (t + n * o <= 0 || t + n * o >= 1) && (o *= -1), t + n * o
  }

  const E = {
    execute: function (t, r) {
      const i = function (t) {
        const e = o[t.direction];
        return n(t.x + e[0], t.y + e[1])
      }(t);
      t.options.hasBotInFront = !!e(i.x, i.y, r.map), t.options.hasBotInFront || function (t, n, o) {
        if (e(n.x, n.y, o)) throw new Error(`Bot in cell ${n.x}:${n.y} already exists`);
        ((t, n, o, e) => {
          e[t][n] = { ...e[t][n], ...o }
        })(n.x, n.y, { bot: t }, o), c(t.x, t.y, o), t.x = n.x, t.y = n.y
      }(t, i, r.map)
    }
  }, T = {
    execute: function (t, n) {
      t.direction = t.direction + 1 & 3
    }
  }, b = {
    execute: function (t, n) {
      t.direction = t.direction + -1 & 3
    }
  }, O = {
    execute: function (t, n) {
      const o = a(t.x, t.y, n.map);
      o.resources.food && (t.xp += 100, t.xp > 255 && (t.xp = 255), delete o.resources.food)
    }
  }, M = {
    execute: function (t, n) {
      const o = a(t.x, t.y, n.map);
      t.xp += 3 * o.resources.light.power
    }
  }, v = {
    execute: function (t, c) {
      const a = function (t) {
        const e = r(r(o))[t.direction];
        return n(t.x + e[0], t.y + e[1])
      }(t);
      if (e(a.x, a.y, c.map)) return;
      if (t.xp < 2 * p.DEFAULT_XP) return;
      t.xp /= 2;
      const s = p.cloneBot(t, { ...a, id: p.generateId(), direction: (u = t.direction, u + 2 & 3), xp: p.DEFAULT_XP });
      var u;
      i(s.x, s.y, s, c.map)
    }
  }, A = function (t, n) {
  }, I = function (t, n) {
    if (!0 === t.processing) return;
    t.processing = !0;
    const o = {
      [h.MOVE]: E,
      [h.ROTATE_CLOCKWISE]: T,
      [h.ROTATE_COUNTERCLOCKWISE]: b,
      [h.EAT]: O,
      [h.EAT_SOLAR]: M,
      [h.CLONE]: v
    };
    t.program.current >= t.program.commands.length && (t.program.current = t.program.commands.length - 1);
    const e = t.program.commands[t.program.current];
    void 0 !== e && (t.program.current += 1, t.program.current >= t.program.commands.length && (t.program.current = 0), o[e].execute(t, n), e === h.EAT_SOLAR && A(t, n))
  }, C = function () {
    const t = [h.MOVE, h.ROTATE_CLOCKWISE, h.ROTATE_COUNTERCLOCKWISE, h.EAT, h.EAT_SOLAR, h.CLONE];
    return t[Math.floor(Math.random() * t.length)]
  };

  function w() {
    const t = [];
    for (let n = 0; n < 10; n += 1) t.push(C());
    return { commands: t, current: 0 }
  }

  function L(n, o) {
    for (let n = 0; n < t; n += 1) for (let t = 0; t < 50; t += 1) o(n, t)
  }

  function R(t, n, o) {
    L(0, (function (r, c) {
      const i = e(r, c, t.map);
      i && n(i, o)
    }))
  }

  function _(t) {
    R(t, (n => {
      (function (t) {
        if (Math.random() > .001) return;
        const n = [(t, n) => function (t, n) {
          return t[n] = x(), t
        }(t, n), (t, n) => function (t, n) {
          return t.splice(n, 1), t
        }(t, n), (t, n) => function (t, n) {
          return t.splice(n, 0, x()), t
        }(t, n)], o = Math.floor(Math.random() * t.program.commands.length);
        g(n)(t.program.commands, o), t.style.h = y(t.style.h), t.style.s = y(t.style.s), t.style.v = y(t.style.v)
      })(n), function (t, n) {
        I(t, n)
      }(n, t), f(n), m(n, t, ((t, n) => {
        l(t.x, t.y, { food: { type: "food" } }, n)
      }))
    })), function (t) {
      R(t, (t => {
        t.processing = !1
      }))
    }(t)
  }

  const S = (t, n, o) => t >= o[0] && t <= o[2] && n >= o[1] && n <= o[3], B = 10;

  function D(n, o, e, r) {
    let c = o * t * B * 4 + 4 * n;
    r.data[c] = e.r, c += 1, r.data[c] = e.g, c += 1, r.data[c] = e.b, c += 1, r.data[c] = void 0 === e.a ? 255 : e.a
  }

  function F(t, n) {
    !function (t, n) {
      const o = function (t) {
        const n = [0, .15, .3, .45, .6, .75, .9], o = t.program.commands.map((t => n[t])),
          e = o.reduce(((t, n) => t + n), 0) / o.length || 0;
        return function (t, n, o) {
          let e, r, c;
          1 === arguments.length && (n = t.s, o = t.v, t = t.h);
          const i = Math.floor(6 * t), a = 6 * t - i, s = o * (1 - n), u = o * (1 - a * n), d = o * (1 - (1 - a) * n);
          switch (i % 6) {
            case 0:
              e = o, r = d, c = s;
              break;
            case 1:
              e = u, r = o, c = s;
              break;
            case 2:
              e = s, r = o, c = d;
              break;
            case 3:
              e = s, r = u, c = o;
              break;
            case 4:
              e = d, r = s, c = o;
              break;
            case 5:
              e = o, r = s, c = u
          }
          return { r: Math.round(255 * e), g: Math.round(255 * r), b: Math.round(255 * c) }
        }(t.style.h, t.style.s, e)
      }(t);
      !function (t, n, o, e, r, c) {
        const i = t + 1, a = t + B - 2, s = n + 1, u = n + B - 2, d = t, f = t + B - 1, m = n, l = n + B - 1, h = {
          [p.RIGHT]: [f - 1, m + 4, f, l - 4],
          [p.TOP]: [d + 4, m, f - 4, m + 1],
          [p.LEFT]: [d, m + 4, d + 1, l - 4],
          [p.BOTTOM]: [d + 4, l - 1, f - 4, l]
        }[e];
        !function (t, n, o, e, r, c, i) {
          for (let a = t; a <= n; a += 1) S(o, a, e) || D(o, a, r, c), S(i, a, e) || D(i, a, r, c)
        }(s, u, d, h, r, c, f), function (t, n, o, e, r, c, i) {
          for (let a = t; a <= n; a += 1) S(a, o, e) || D(a, o, r, c), S(a, i, e) || D(a, i, r, c)
        }(i, a, m, h, r, c, l), function (t, n, o, e, r, c, i) {
          for (let a = t; a <= n; a += 1) for (let t = o; t <= e; t += 1) S(a, t, r) || D(a, t, c, i)
        }(i, a, s, u, h, r, c)
      }(t.x * B, t.y * B, 0, t.direction, o, n)
    }(t, n.imageData)
  }

  function $(t) {
    const n = t.ctx.createImageData(1e3, 500);
    for (let t = 0; t < 2e6; t += 4) n.data[t] = 0, n.data[t + 1] = 0, n.data[t + 2] = 0, n.data[t + 3] = 255;
    !function (t, n) {
      L(0, ((o, e) => {
        const r = a(o, e, t.map);
        r.resources && function (t, n, o, e) {
          o.food && function (t, n, o, e) {
            for (let r = t + 3; r < t + B - 3; r += 1) for (let t = n + 3; t < n + B - 3; t += 1) D(r, t, o, e)
          }(t *= B, n *= B, { r: 140, g: 80, b: 0 }, e)
        }(o, e, r.resources, n)
      }))
    }(t.world, n), R(t.world, F, { imageData: n }), t.ctx.putImageData(n, 0, 0)
  }

  const W = {};
  let U;
  const K = document.getElementById("cnv"), N = document.getElementById("info"), P = K.clientWidth / t,
    X = K.clientHeight / 50, k = () => {
      void 0 !== W.botX && void 0 !== W.botY && (W.bot = e(W.botX, W.botY, U.map))
    }, H = t => {
      W.botX = parseInt(t.x / P, 10), W.botY = parseInt(t.y / X, 10), k()
    };

  function V() {
    const { bot: t } = W;
    void 0 === t || t && t.xp <= 0 ? k() : N.innerHTML = `x: ${t.x}</br>y: ${t.y}</br>xp: ${parseInt(t.xp, 10)}</br>program: ${t.program.commands}</br>id: ${t.id}</br>`
  }

  function Y(t) {
    U = t, K.addEventListener("mousedown", H), setInterval(V, 1e3)
  }

  function q(t, n) {
    _(t), $(n), requestAnimationFrame((() => q(t, n)))
  }

  function G(t, n) {
    requestAnimationFrame((() => q(t, n))), setInterval((() => {
      console.log(Date.now(), window.debugInfo1)
    }), 1e3), Y(t)
  }

  String.prototype.hashCode = function () {
    let t, n, o = 0;
    if (0 === this.length) return o;
    for (t = 0; t < this.length; t += 1) n = this.charCodeAt(t), o = (o << 5) - o + n, o |= 0;
    return o
  };
  const j = function () {
    const t = function () {
      const t = { map: [] };
      return function (t) {
        L(0, ((n, o) => {
          !function (t, n, o, e = { resources: {} }) {
            void 0 === o[t] && (o[t] = []), o[t][n] = e
          }(n, o, t.map)
        }))
      }(t), function (t) {
        L(0, ((n, o) => {
          Math.random() > .9 && i(n, o, d(n, o, w), t.map)
        }))
      }(t), function (t) {
        L(0, ((n, o) => {
          Math.random() > .9 && l(n, o, { food: { type: "food" } }, t.map), l(n, o, {
            light: {
              type: "light",
              power: 1 - o / 50
            }
          }, t.map)
        }))
      }(t), window.debugWorld = t, t
    }(), n = function (t) {
      const n = document.getElementById("cnv");
      n.width = 1e3, n.height = 500;
      const o = { world: t, ctx: n.getContext("2d") };
      return o.ctx = n.getContext("2d"), o.ctx.imageSmoothingEnabled = !1, o
    }(t);
    G(t, n)
  };
  j()
})();
//# sourceMappingURL=main.js.map
