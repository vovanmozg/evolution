(() => {
  "use strict";
  var e = {};

  function t(e) {
    return t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, t(e)
  }

  function n(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t && (r = r.filter((function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable
      }))), n.push.apply(n, r)
    }
    return n
  }

  function r(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2 ? n(Object(r), !0).forEach((function (t) {
        o(e, t, r[t])
      })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach((function (t) {
        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
      }))
    }
    return e
  }

  function o(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[t] = n, e
  }

  function i(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
  }

  function c(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
    }
  }

  function u(e, t, n) {
    return t && c(e.prototype, t), n && c(e, n), e
  }

  e.g = function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")()
    } catch (e) {
      if ("object" == typeof window) return window
    }
  }();
  var a = function () {
    function e() {
      i(this, e)
    }

    return u(e, null, [{
      key: "rand", value: function () {
        var e = [I("OPERATIONS").MOVE, I("OPERATIONS").ROTATE_CLOCKWISE, I("OPERATIONS").ROTATE_COUNTERCLOCKWISE, I("OPERATIONS").EAT, I("OPERATIONS").EAT_SOLAR, I("OPERATIONS").CLONE, I("OPERATIONS").OVERPOPULATION];
        return e[Math.floor(Math.random() * e.length)]
      }
    }, {
      key: "execute", value: function (e, t) {
        var n;
        if (!0 !== e.processing) {
          e.processing = !0;
          var r = (o(n = {}, I("OPERATIONS").MOVE, I("CommandMove")), o(n, I("OPERATIONS").ROTATE_CLOCKWISE, I("CommandRotateClockwise")), o(n, I("OPERATIONS").ROTATE_COUNTERCLOCKWISE, I("CommandRotateCounterclockwise")), o(n, I("OPERATIONS").EAT, I("CommandEat")), o(n, I("OPERATIONS").EAT_SOLAR, I("CommandEatSolar")), o(n, I("OPERATIONS").CLONE, I("CommandClone")), o(n, I("OPERATIONS").OVERPOPULATION, I("CommandOverpopulation")), n);
          e.program.current >= e.program.commands.length && (e.program.current = e.program.commands.length - 1);
          var i = e.program.commands[e.program.current];
          void 0 !== i && (e.program.current++, e.program.current >= e.program.commands.length && (e.program.current = 0), r[i].execute(e, t), i === I("OPERATIONS").EAT_SOLAR && I("CommandOverpopulation").execute(e, t))
        }
      }
    }]), e
  }(), _ = function () {
    function e() {
      i(this, e)
    }

    return u(e, null, [{
      key: "execute", value: function (e, t) {
        var n = I("Bot").frontPosition(e), o = n.x, i = n.y, c = t.getCell(o, i);
        I("Bot").get(c) ? e.options = r(r({}, e.options), {}, { hasBotInFront: !0 }) : (t.setCellProps(o, i, { bot: e }, t.map), delete t.getCell(e.x, e.y).bot, e.x = o, e.y = i, e.options = r(r({}, e.options), {}, { hasBotInFront: !1 }))
      }
    }]), e
  }(), f = function () {
    function e() {
      i(this, e)
    }

    return u(e, null, [{
      key: "execute", value: function (e, t) {
        e.direction = I("CommandRotateClockwise").rotate(e.direction, 1)
      }
    }, {
      key: "rotate", value: function (e, t) {
        return e + t & 3
      }
    }]), e
  }(), l = function () {
    function e() {
      i(this, e)
    }

    return u(e, null, [{
      key: "execute", value: function (e, t) {
        e.direction = I("CommandRotateCounterclockwise").rotate(e.direction, -1)
      }
    }, {
      key: "rotate", value: function (e, t) {
        return e + t & 3
      }
    }]), e
  }(), s = function () {
    function e() {
      i(this, e)
    }

    return u(e, null, [{
      key: "execute", value: function (e, t) {
        var n = t.getCell(e.x, e.y);
        n.resources.food && (e.xp += 100, e.xp > 255 && (e.xp = 255), delete n.resources.food)
      }
    }]), e
  }(), y = function () {
    function e() {
      i(this, e)
    }

    return u(e, null, [{
      key: "execute", value: function (e, t) {
        var n = t.getCell(e.x, e.y);
        e.xp += 3 * n.resources.light.power
      }
    }]), e
  }(), O = function () {
    function e() {
      i(this, e)
    }

    return u(e, null, [{
      key: "execute", value: function (e, t) {
        var n = I("Bot").backPosition(e), o = t.getCell(n.x, n.y);
        if (!(I("Bot").get(o) || e.xp < I("Bot").DEFAULT_XP * I("CLONE_RATE"))) {
          e.xp /= 2;
          var i = I("Bot").cloneBot(e, r(r({}, n), {}, {
            id: I("Bot").generateId(),
            direction: I("CommandClone").turn(e.direction),
            xp: I("Bot").DEFAULT_XP
          }));
          t.addBot(i.x, i.y, i)
        }
      }
    }, {
      key: "turn", value: function (e) {
        return e / 90 + 2 & 3
      }
    }]), e
  }(), h = function () {
    function e() {
      i(this, e)
    }

    return u(e, null, [{
      key: "execute", value: function (e, t) {
        var n = 0;
        t.eachNeighborBot(e, t, (function (e) {
          n++
        })), e.xp -= n / 3
      }
    }]), e
  }();

  function E() {
    try {
      if (e.g) return e.g
    } catch (e) {
      try {
        if (window) return window
      } catch (e) {
        return this
      }
    }
  }

  var d, v = null;

  function p() {
    if (null === v) {
      var e = E();
      e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ || (e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0), v = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++
    }
    return v
  }

  function b() {
    var e = E();
    return e.__$$GLOBAL_REWIRE_REGISTRY__ || (e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)), e.__$$GLOBAL_REWIRE_REGISTRY__
  }

  function m() {
    var e = p(), t = b(), n = t[e];
    return n || (t[e] = Object.create(null), n = t[e]), n
  }

  (d = E()).__rewire_reset_all__ || (d.__rewire_reset_all__ = function () {
    d.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)
  });
  var R = "__INTENTIONAL_UNDEFINED__", g = {};

  function I(e) {
    var t = m();
    if (void 0 === t[e]) return function (e) {
      switch (e) {
        case"OPERATIONS":
          return A;
        case"CommandMove":
          return _;
        case"CommandRotateClockwise":
          return f;
        case"CommandRotateCounterclockwise":
          return l;
        case"CommandEat":
          return s;
        case"CommandEatSolar":
          return y;
        case"CommandClone":
          return O;
        case"CommandOverpopulation":
          return h;
        case"Bot":
          return qe;
        case"CLONE_RATE":
          return 2
      }
    }(e);
    var n = t[e];
    return n === R ? void 0 : n
  }

  function w(e, n) {
    var r = m();
    return "object" === t(e) ? (Object.keys(e).forEach((function (t) {
      r[t] = e[t]
    })), function () {
      Object.keys(e).forEach((function (t) {
        T(e)
      }))
    }) : (r[e] = void 0 === n ? R : n, function () {
      T(e)
    })
  }

  function T(e) {
    var t = m();
    delete t[e], 0 == Object.keys(t).length && delete b()[p]
  }

  function L(e) {
    var t = m(), n = Object.keys(e), r = {};

    function o() {
      n.forEach((function (e) {
        t[e] = r[e]
      }))
    }

    return function (i) {
      n.forEach((function (n) {
        r[n] = t[n], t[n] = e[n]
      }));
      var c = i();
      return c && "function" == typeof c.then ? c.then(o).catch(o) : o(), c
    }
  }

  function D(e) {
    return D = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, D(e)
  }

  function j(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
    }
  }

  !function () {
    function e(e, t) {
      Object.defineProperty(g, e, { value: t, enumerable: !1, configurable: !0 })
    }

    e("__get__", I), e("__GetDependency__", I), e("__Rewire__", w), e("__set__", w), e("__reset__", T), e("__ResetDependency__", T), e("__with__", L)
  }();
  var S = function () {
      function e() {
        !function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }(this, e)
      }

      var t, n;
      return t = e, n = [{
        key: "generate", value: function () {
          for (var e = [], t = 0; t < W("PROGRAM_LENGTH"); t++) e.push(W("Command").rand());
          return { commands: e, current: 0 }
        }
      }, {
        key: "step", value: function (e, t) {
          W("Command").execute(e, t)
        }
      }], null && j(t.prototype, null), n && j(t, n), e
    }(),
    A = { MOVE: 0, ROTATE_CLOCKWISE: 1, ROTATE_COUNTERCLOCKWISE: 2, EAT: 3, EAT_SOLAR: 4, CLONE: 5, OVERPOPULATION: 6 };

  function k() {
    try {
      if (e.g) return e.g
    } catch (e) {
      try {
        if (window) return window
      } catch (e) {
        return this
      }
    }
  }

  var P = null;

  function B() {
    if (null === P) {
      var e = k();
      e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ || (e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0), P = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++
    }
    return P
  }

  function C() {
    var e = k();
    return e.__$$GLOBAL_REWIRE_REGISTRY__ || (e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)), e.__$$GLOBAL_REWIRE_REGISTRY__
  }

  function G() {
    var e = B(), t = C(), n = t[e];
    return n || (t[e] = Object.create(null), n = t[e]), n
  }

  !function () {
    var e = k();
    e.__rewire_reset_all__ || (e.__rewire_reset_all__ = function () {
      e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)
    })
  }();
  var $ = "__INTENTIONAL_UNDEFINED__", N = {};

  function W(e) {
    var t = G();
    if (void 0 === t[e]) return function (e) {
      switch (e) {
        case"PROGRAM_LENGTH":
          return 10;
        case"Command":
          return a
      }
    }(e);
    var n = t[e];
    return n === $ ? void 0 : n
  }

  function x(e, t) {
    var n = G();
    return "object" === D(e) ? (Object.keys(e).forEach((function (t) {
      n[t] = e[t]
    })), function () {
      Object.keys(e).forEach((function (t) {
        M(e)
      }))
    }) : (n[e] = void 0 === t ? $ : t, function () {
      M(e)
    })
  }

  function M(e) {
    var t = G();
    delete t[e], 0 == Object.keys(t).length && delete C()[B]
  }

  function U(e) {
    var t = G(), n = Object.keys(e), r = {};

    function o() {
      n.forEach((function (e) {
        t[e] = r[e]
      }))
    }

    return function (i) {
      n.forEach((function (n) {
        r[n] = t[n], t[n] = e[n]
      }));
      var c = i();
      return c && "function" == typeof c.then ? c.then(o).catch(o) : o(), c
    }
  }

  function H(e) {
    return H = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, H(e)
  }

  function Y(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
    }
  }

  !function () {
    function e(e, t) {
      Object.defineProperty(N, e, { value: t, enumerable: !1, configurable: !0 })
    }

    e("__get__", W), e("__GetDependency__", W), e("__Rewire__", x), e("__set__", x), e("__reset__", M), e("__ResetDependency__", M), e("__with__", U)
  }();
  var X, F, z = function () {
    function e() {
      !function (e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
      }(this, e)
    }

    var t, n;
    return t = e, n = [{
      key: "mutate", value: function (e) {
        var t = this;
        if (!(Math.random() > te("Mutation").MUTATION_PROBABILITY)) {
          var n = [function (e, n) {
            return t.mutateSubstitution(e, n)
          }, function (e, n) {
            return t.mutateDeletion(e, n)
          }, function (e, n) {
            return t.mutateInsertion(e, n)
          }], r = Math.floor(Math.random() * e.program.commands.length);
          n.random()(e.program.commands, r), e.style.h = this.randomChangeStyleComponent(e.style.h), e.style.s = this.randomChangeStyleComponent(e.style.s), e.style.v = this.randomChangeStyleComponent(e.style.v)
        }
      }
    }, {
      key: "randomChangeStyleComponent", value: function (e) {
        var t = .01, n = Math.random() > .5 ? 1 : -1;
        return (e + t * n <= 0 || e + t * n >= 1) && (n *= -1), e + t * n
      }
    }, {
      key: "mutateSubstitution", value: function (e, t) {
        return e[t] = this.randomOperationCode(), e
      }
    }, {
      key: "mutateDeletion", value: function (e, t) {
        return e.splice(t, 1), e
      }
    }, {
      key: "mutateInsertion", value: function (e, t) {
        return e.splice(t, 0, this.randomOperationCode()), e
      }
    }, {
      key: "randomOperationsPosition", value: function (e) {
        return Math.floor(Math.random() * bot.program.commands.length)
      }
    }, {
      key: "randomOperationCode", value: function () {
        return Object.values(te("OPERATIONS")).random()
      }
    }], null && Y(t.prototype, null), n && Y(t, n), e
  }();

  function V() {
    try {
      if (e.g) return e.g
    } catch (e) {
      try {
        if (window) return window
      } catch (e) {
        return this
      }
    }
  }

  (F = "MUTATION_PROBABILITY") in (X = te("Mutation")) ? Object.defineProperty(X, F, {
    value: .001,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : X[F] = .001;
  var K = null;

  function q() {
    if (null === K) {
      var e = V();
      e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ || (e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0), K = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++
    }
    return K
  }

  function J() {
    var e = V();
    return e.__$$GLOBAL_REWIRE_REGISTRY__ || (e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)), e.__$$GLOBAL_REWIRE_REGISTRY__
  }

  function Q() {
    var e = q(), t = J(), n = t[e];
    return n || (t[e] = Object.create(null), n = t[e]), n
  }

  !function () {
    var e = V();
    e.__rewire_reset_all__ || (e.__rewire_reset_all__ = function () {
      e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)
    })
  }();
  var Z = "__INTENTIONAL_UNDEFINED__", ee = {};

  function te(e) {
    var t = Q();
    if (void 0 === t[e]) return function (e) {
      switch (e) {
        case"Mutation":
          return z;
        case"OPERATIONS":
          return A
      }
    }(e);
    var n = t[e];
    return n === Z ? void 0 : n
  }

  function ne(e, t) {
    var n = Q();
    return "object" === H(e) ? (Object.keys(e).forEach((function (t) {
      n[t] = e[t]
    })), function () {
      Object.keys(e).forEach((function (t) {
        re(e)
      }))
    }) : (n[e] = void 0 === t ? Z : t, function () {
      re(e)
    })
  }

  function re(e) {
    var t = Q();
    delete t[e], 0 == Object.keys(t).length && delete J()[q]
  }

  function oe(e) {
    var t = Q(), n = Object.keys(e), r = {};

    function o() {
      n.forEach((function (e) {
        t[e] = r[e]
      }))
    }

    return function (i) {
      n.forEach((function (n) {
        r[n] = t[n], t[n] = e[n]
      }));
      var c = i();
      return c && "function" == typeof c.then ? c.then(o).catch(o) : o(), c
    }
  }

  function ie(e) {
    return ie = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, ie(e)
  }

  function ce(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t && (r = r.filter((function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable
      }))), n.push.apply(n, r)
    }
    return n
  }

  function ue(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2 ? ce(Object(n), !0).forEach((function (t) {
        ae(e, t, n[t])
      })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ce(Object(n)).forEach((function (t) {
        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
      }))
    }
    return e
  }

  function ae(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[t] = n, e
  }

  function _e(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
  }

  function fe(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
    }
  }

  function le(e, t, n) {
    return t && fe(e.prototype, t), n && fe(e, n), e
  }

  !function () {
    function e(e, t) {
      Object.defineProperty(ee, e, { value: t, enumerable: !1, configurable: !0 })
    }

    e("__get__", te), e("__GetDependency__", te), e("__Rewire__", ne), e("__set__", ne), e("__reset__", re), e("__ResetDependency__", re), e("__with__", oe)
  }();
  var se = function () {
    function e(t, n) {
      _e(this, e), this.width = t, this.height = n, this.initCells(), window.debugWorld = this
    }

    return le(e, [{
      key: "eachCell", value: function (e) {
        for (var t = 0; t < this.width; t++) for (var n = 0; n < this.height; n++) e(t, n)
      }
    }, {
      key: "eachBot", value: function (e) {
        var t = this;
        this.eachCell((function (n, r) {
          var o = me("Bot").get(t.getCell(n, r));
          o && e(o)
        }))
      }
    }, {
      key: "eachNeighborBot", value: function (e, t, n) {
        for (var r = -1; r <= 1; r++) for (var o = -1; o <= 1; o++) if (0 !== r && 0 !== o) {
          var i = me("World").normalizeCoords(e.x + r, e.y + o), c = t.getCell(i.x, i.y), u = me("Bot").get(c);
          u && me("Bot").isProcessing(u) && n(u)
        }
      }
    }, {
      key: "populate", value: function () {
        var e = this;
        this.eachCell((function (t, n) {
          Math.random() > .9 && e.addBot(t, n, me("Bot").generateRandom(t, n))
        }))
      }
    }, {
      key: "populateTest1", value: function () {
        var e = this;
        TEST_CASES[2].forEach((function (t) {
          e.addBot(t.x, t.y, t)
        }))
      }
    }, {
      key: "initResources", value: function (e) {
        this.eachCell((function (t, n) {
          if (Math.random() > .9) {
            var r = me("Resource").generateRandom();
            me("Resource").add(t, n, r, e)
          }
          var o = { light: { type: "light", power: 1 - n / me("HEIGHT") } };
          me("Resource").add(t, n, o, e)
        }))
      }
    }, {
      key: "step", value: function () {
        var e = this;
        this.eachBot((function (t) {
          me("Mutation").mutate(t), me("Program").step(t, e), me("Bot").liveStep(t), me("Bot").tryDie(t, e)
        })), this.eachBot((function (e) {
          return e.processing = !1
        }))
      }
    }, {
      key: "destroyBot", value: function (e) {
        delete this.getCell(e.x, e.y).bot
      }
    }, {
      key: "getCell", value: function (e, t) {
        return this.map[e][t]
      }
    }, {
      key: "setCellProps", value: function (e, t, n, r) {
        r[e][t] = ue(ue({}, r[e][t]), n)
      }
    }, {
      key: "initCell", value: function (e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;
        void 0 === n && (n = { resources: {} }), void 0 === this.map[e] && (this.map[e] = []), this.map[e][t] = n
      }
    }, {
      key: "initCells", value: function () {
        var e = this;
        this.map = [], this.eachCell((function (t, n) {
          e.initCell(t, n)
        }))
      }
    }, {
      key: "addBot", value: function (e, t, n) {
        if (me("World").validateCoords(e, t), this.map[e][t].bot) throw"Bot already exists in cell ".concat(e, ":").concat(t);
        this.map[e][t].bot = n
      }
    }, {
      key: "print", value: function () {
        for (var e = 0; e < this.height; e++) for (var t = 0; t < this.width; t++) this.map[t][e].bot
      }
    }], [{
      key: "validateCoords", value: function (e, t) {
        if (e >= me("WIDTH") || e < 0) throw"x should be from 0 to ".concat(me("WIDTH"));
        if (t >= me("HEIGHT") || t < 0) throw"x should be from 0 to ".concat(me("WIDTH"))
      }
    }, {
      key: "normalizeCoords", value: function (e, t) {
        return e < 0 && (e = me("WIDTH") - 1), e > me("WIDTH") - 1 && (e = 0), t < 0 && (t = me("HEIGHT") - 1), t > me("HEIGHT") - 1 && (t = 0), {
          x: e,
          y: t
        }
      }
    }]), e
  }(), ye = function () {
    function e() {
      _e(this, e)
    }

    return le(e, null, [{
      key: "create", value: function () {
        var e = new (me("World"))(me("WIDTH"), me("HEIGHT"));
        return e.populate(), e.initResources(e.map), e
      }
    }]), e
  }();

  function Oe() {
    try {
      if (e.g) return e.g
    } catch (e) {
      try {
        if (window) return window
      } catch (e) {
        return this
      }
    }
  }

  var he = null;

  function Ee() {
    if (null === he) {
      var e = Oe();
      e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ || (e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0), he = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++
    }
    return he
  }

  function de() {
    var e = Oe();
    return e.__$$GLOBAL_REWIRE_REGISTRY__ || (e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)), e.__$$GLOBAL_REWIRE_REGISTRY__
  }

  function ve() {
    var e = Ee(), t = de(), n = t[e];
    return n || (t[e] = Object.create(null), n = t[e]), n
  }

  !function () {
    var e = Oe();
    e.__rewire_reset_all__ || (e.__rewire_reset_all__ = function () {
      e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)
    })
  }();
  var pe = "__INTENTIONAL_UNDEFINED__", be = {};

  function me(e) {
    var t = ve();
    if (void 0 === t[e]) return function (e) {
      switch (e) {
        case"WIDTH":
          return 100;
        case"HEIGHT":
          return 50;
        case"Bot":
          return qe;
        case"World":
          return se;
        case"Resource":
          return Se;
        case"Mutation":
          return z;
        case"Program":
          return S
      }
    }(e);
    var n = t[e];
    return n === pe ? void 0 : n
  }

  function Re(e, t) {
    var n = ve();
    return "object" === ie(e) ? (Object.keys(e).forEach((function (t) {
      n[t] = e[t]
    })), function () {
      Object.keys(e).forEach((function (t) {
        ge(e)
      }))
    }) : (n[e] = void 0 === t ? pe : t, function () {
      ge(e)
    })
  }

  function ge(e) {
    var t = ve();
    delete t[e], 0 == Object.keys(t).length && delete de()[Ee]
  }

  function Ie(e) {
    var t = ve(), n = Object.keys(e), r = {};

    function o() {
      n.forEach((function (e) {
        t[e] = r[e]
      }))
    }

    return function (i) {
      n.forEach((function (n) {
        r[n] = t[n], t[n] = e[n]
      }));
      var c = i();
      return c && "function" == typeof c.then ? c.then(o).catch(o) : o(), c
    }
  }

  function we(e) {
    return we = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, we(e)
  }

  function Te(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t && (r = r.filter((function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable
      }))), n.push.apply(n, r)
    }
    return n
  }

  function Le(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2 ? Te(Object(n), !0).forEach((function (t) {
        De(e, t, n[t])
      })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Te(Object(n)).forEach((function (t) {
        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
      }))
    }
    return e
  }

  function De(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[t] = n, e
  }

  function je(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
    }
  }

  !function () {
    function e(e, t) {
      Object.defineProperty(be, e, { value: t, enumerable: !1, configurable: !0 })
    }

    e("__get__", me), e("__GetDependency__", me), e("__Rewire__", Re), e("__set__", Re), e("__reset__", ge), e("__ResetDependency__", ge), e("__with__", Ie)
  }();
  var Se = function () {
    function e() {
      !function (e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
      }(this, e)
    }

    var t, n;
    return t = e, n = [{
      key: "add", value: function (e, t, n, r) {
        Ne("World").validateCoords(e, t), r[e][t].resources = Le(Le({}, r[e][t].resources), n)
      }
    }, {
      key: "generateRandom", value: function () {
        return { food: { type: "food" } }
      }
    }], null && je(t.prototype, null), n && je(t, n), e
  }();

  function Ae() {
    try {
      if (e.g) return e.g
    } catch (e) {
      try {
        if (window) return window
      } catch (e) {
        return this
      }
    }
  }

  var ke = null;

  function Pe() {
    if (null === ke) {
      var e = Ae();
      e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ || (e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0), ke = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++
    }
    return ke
  }

  function Be() {
    var e = Ae();
    return e.__$$GLOBAL_REWIRE_REGISTRY__ || (e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)), e.__$$GLOBAL_REWIRE_REGISTRY__
  }

  function Ce() {
    var e = Pe(), t = Be(), n = t[e];
    return n || (t[e] = Object.create(null), n = t[e]), n
  }

  !function () {
    var e = Ae();
    e.__rewire_reset_all__ || (e.__rewire_reset_all__ = function () {
      e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)
    })
  }();
  var Ge = "__INTENTIONAL_UNDEFINED__", $e = {};

  function Ne(e) {
    var t = Ce();
    if (void 0 === t[e]) return function (e) {
      if ("World" === e) return se
    }(e);
    var n = t[e];
    return n === Ge ? void 0 : n
  }

  function We(e, t) {
    var n = Ce();
    return "object" === we(e) ? (Object.keys(e).forEach((function (t) {
      n[t] = e[t]
    })), function () {
      Object.keys(e).forEach((function (t) {
        xe(e)
      }))
    }) : (n[e] = void 0 === t ? Ge : t, function () {
      xe(e)
    })
  }

  function xe(e) {
    var t = Ce();
    delete t[e], 0 == Object.keys(t).length && delete Be()[Pe]
  }

  function Me(e) {
    var t = Ce(), n = Object.keys(e), r = {};

    function o() {
      n.forEach((function (e) {
        t[e] = r[e]
      }))
    }

    return function (i) {
      n.forEach((function (n) {
        r[n] = t[n], t[n] = e[n]
      }));
      var c = i();
      return c && "function" == typeof c.then ? c.then(o).catch(o) : o(), c
    }
  }

  function Ue(e) {
    return Ue = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, Ue(e)
  }

  function He(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t && (r = r.filter((function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable
      }))), n.push.apply(n, r)
    }
    return n
  }

  function Ye(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2 ? He(Object(n), !0).forEach((function (t) {
        Fe(e, t, n[t])
      })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : He(Object(n)).forEach((function (t) {
        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
      }))
    }
    return e
  }

  function Xe(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
    }
  }

  function Fe(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[t] = n, e
  }

  !function () {
    function e(e, t) {
      Object.defineProperty($e, e, { value: t, enumerable: !1, configurable: !0 })
    }

    e("__get__", Ne), e("__GetDependency__", Ne), e("__Rewire__", We), e("__set__", We), e("__reset__", xe), e("__ResetDependency__", xe), e("__with__", Me)
  }();
  var ze = {
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

  function Ve() {
    return [[1, 0], [0, -1], [-1, 0], [0, 1]]
  }

  function Ke(e) {
    return e.push(e.shift()), e
  }

  var qe = function () {
    function e() {
      !function (e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
      }(this, e)
    }

    var t, n;
    return t = e, n = [{
      key: "generateRandom", value: function (e, t) {
        return Ye(Ye({}, ot("DEFAULT_BOT")), {}, {
          id: ot("Bot").generateId(),
          x: e,
          y: t,
          direction: Math.floor(4 * Math.random()),
          rotate: Math.random() > .5 ? 1 : -1,
          program: ot("Program").generate(),
          options: {},
          style: { h: Math.random(), s: Math.random(), v: Math.random() }
        })
      }
    }, {
      key: "get", value: function (e) {
        return e.bot
      }
    }, {
      key: "frontPosition", value: function (e) {
        var t = ot("shifts")()[e.direction];
        return ot("World").normalizeCoords(e.x + t[0], e.y + t[1])
      }
    }, {
      key: "backPosition", value: function (e) {
        var t = ot("rightCyclicShift")(ot("rightCyclicShift")(ot("shifts")()))[e.direction];
        return ot("World").normalizeCoords(e.x + t[0], e.y + t[1])
      }
    }, {
      key: "cloneBot", value: function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = JSON.parse(JSON.stringify(e));
        return Ye(Ye({}, n), t)
      }
    }, {
      key: "generateId", value: function () {
        return "" + Math.random()
      }
    }, {
      key: "liveStep", value: function (e) {
        e.xp--
      }
    }, {
      key: "tryDie", value: function (e, t) {
        if (e.xp <= 0) {
          t.destroyBot(e);
          var n = ot("Resource").generateRandom();
          ot("Resource").add(e.x, e.y, n, t.map)
        }
      }
    }, {
      key: "isProcessing", value: function (e) {
        return 0 == e.processing
      }
    }], null && Xe(t.prototype, null), n && Xe(t, n), e
  }();

  function Je() {
    try {
      if (e.g) return e.g
    } catch (e) {
      try {
        if (window) return window
      } catch (e) {
        return this
      }
    }
  }

  Fe(ot("Bot"), "DEFAULT_XP", 10);
  var Qe = null;

  function Ze() {
    if (null === Qe) {
      var e = Je();
      e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ || (e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0), Qe = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++
    }
    return Qe
  }

  function et() {
    var e = Je();
    return e.__$$GLOBAL_REWIRE_REGISTRY__ || (e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)), e.__$$GLOBAL_REWIRE_REGISTRY__
  }

  function tt() {
    var e = Ze(), t = et(), n = t[e];
    return n || (t[e] = Object.create(null), n = t[e]), n
  }

  !function () {
    var e = Je();
    e.__rewire_reset_all__ || (e.__rewire_reset_all__ = function () {
      e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)
    })
  }();
  var nt = "__INTENTIONAL_UNDEFINED__", rt = {};

  function ot(e) {
    var t = tt();
    if (void 0 === t[e]) return function (e) {
      switch (e) {
        case"DEFAULT_BOT":
          return ze;
        case"Bot":
          return qe;
        case"Program":
          return S;
        case"shifts":
          return Ve;
        case"World":
          return se;
        case"rightCyclicShift":
          return Ke;
        case"Resource":
          return Se
      }
    }(e);
    var n = t[e];
    return n === nt ? void 0 : n
  }

  function it(e, t) {
    var n = tt();
    return "object" === Ue(e) ? (Object.keys(e).forEach((function (t) {
      n[t] = e[t]
    })), function () {
      Object.keys(e).forEach((function (t) {
        ct(e)
      }))
    }) : (n[e] = void 0 === t ? nt : t, function () {
      ct(e)
    })
  }

  function ct(e) {
    var t = tt();
    delete t[e], 0 == Object.keys(t).length && delete et()[Ze]
  }

  function ut(e) {
    var t = tt(), n = Object.keys(e), r = {};

    function o() {
      n.forEach((function (e) {
        t[e] = r[e]
      }))
    }

    return function (i) {
      n.forEach((function (n) {
        r[n] = t[n], t[n] = e[n]
      }));
      var c = i();
      return c && "function" == typeof c.then ? c.then(o).catch(o) : o(), c
    }
  }

  function at(e) {
    return at = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, at(e)
  }

  function _t(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
  }

  function ft(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
    }
  }

  function lt(e, t, n) {
    return t && ft(e.prototype, t), n && ft(e, n), e
  }

  function st(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t && (r = r.filter((function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable
      }))), n.push.apply(n, r)
    }
    return n
  }

  function yt(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2 ? st(Object(n), !0).forEach((function (t) {
        Ot(e, t, n[t])
      })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : st(Object(n)).forEach((function (t) {
        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
      }))
    }
    return e
  }

  function Ot(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[t] = n, e
  }

  !function () {
    function e(e, t) {
      Object.defineProperty(rt, e, { value: t, enumerable: !1, configurable: !0 })
    }

    e("__get__", ot), e("__GetDependency__", ot), e("__Rewire__", it), e("__set__", it), e("__reset__", ct), e("__ResetDependency__", ct), e("__with__", ut)
  }(), yt(yt({}, Lt("DEFAULT_BOT")), {}, {
    x: 42,
    y: 20,
    direction: 90,
    id: "0.99",
    rotate: 1,
    program: { commands: [1, 1, 0, 0, 1] },
    options: {}
  }), yt(yt({}, Lt("DEFAULT_BOT")), {}, {
    x: 42,
    y: 21,
    direction: 90,
    id: "0.10",
    rotate: 1,
    program: { commands: [0, 1, 1, 1, 0] },
    options: {}
  }), yt(yt({}, Lt("DEFAULT_BOT")), {}, {
    x: 10,
    y: 10,
    direction: 270,
    id: "0.99",
    rotate: 1,
    program: { commands: [0, 1] },
    options: {},
    processing: !1
  }), yt(yt({}, Lt("DEFAULT_BOT")), {}, {
    x: 10,
    y: 11,
    direction: 90,
    id: "0.10",
    rotate: 1,
    program: { commands: [0, 1] },
    options: {},
    processing: !1
  }), yt(yt({}, Lt("DEFAULT_BOT")), {}, {
    x: 10,
    y: 10,
    direction: 270,
    id: "0.99",
    rotate: 1,
    program: { commands: [5] },
    options: {},
    processing: !1
  });
  var ht = function () {
    function e(t) {
      _t(this, e), this.world = t, this.size = 10;
      var n = document.getElementById("cnv");
      n.width = Lt("WIDTH") * this.size, n.height = Lt("HEIGHT") * this.size, this.ctx = n.getContext("2d")
    }

    return lt(e, [{
      key: "redraw", value: function () {
        for (var e = this, t = this.ctx.createImageData(Lt("WIDTH") * this.size, Lt("HEIGHT") * this.size), n = 0; n < Lt("WIDTH") * this.size * Lt("HEIGHT") * this.size * 4; n += 4) t.data[n] = 0, t.data[n + 1] = 0, t.data[n + 2] = 0, t.data[n + 3] = 255;
        this.world.eachCell((function (n, r) {
          var o = e.world.getCell(n, r);
          o.resources && (o.resources.food, e.drawResource(n, r, o.resources, t))
        })), this.world.eachBot((function (n) {
          e.drawBot(n, t)
        })), this.ctx.putImageData(t, 0, 0)
      }
    }, {
      key: "drawResource", value: function (e, t, n, r) {
        n.food && (e *= this.size, t *= this.size, this.writeImageDataResource(e, t, { r: 140, g: 80, b: 0 }, r))
      }
    }, {
      key: "writeImageDataResource", value: function (e, t, n, r) {
        for (var o = e + 3; o < e + this.size - 3; o++) for (var i = t + 3; i < t + this.size - 3; i++) this.writeImageDataPixel(o, i, n, r)
      }
    }, {
      key: "drawBot", value: function (e, t) {
        var n;
        n = Lt("HSVtoRGB")(e.style.h, e.style.s, e.style.v);
        var r = (e = this.setColor(e)).x * this.size, o = e.y * this.size;
        this.writeImageDataBot(r, o, e.direction, n, t)
      }
    }, {
      key: "setColor", value: function (e) {
        return e
      }
    }, {
      key: "writeImageDataBot", value: function (e, t, n, r, o) {
        for (var i = t + 1; i < t + this.size - 1; i += 1) this.writeImageDataPixel(e, i, r, o), this.writeImageDataPixel(e + this.size - 1, i, r, o);
        for (var c = e + 1; c < e + this.size - 1; c += 1) this.writeImageDataPixel(c, t, r, o), this.writeImageDataPixel(c, t + this.size - 1, r, o);
        for (var u = e + 1; u < e + this.size - 1; u++) for (var a = t + 1; a < t + this.size - 1; a++) this.writeImageDataPixel(u, a, r, o)
      }
    }, {
      key: "writeImageDataPixel", value: function (e, t, n, r) {
        var o = t * (Lt("WIDTH") * this.size * 4) + 4 * e + 0;
        r.data[o] = n.r, o++, r.data[o] = n.g, o++, r.data[o] = n.b, o++, r.data[o] = void 0 === n.a ? 255 : n.a
      }
    }]), e
  }(), Et = 0, dt = function () {
    function e(t) {
      if (_t(this, e), !t) throw Error("Invalid argument world");
      this.world = t, this.drawer = new (Lt("Drawer"))(t)
    }

    return lt(e, [{
      key: "step", value: function () {
        var e = this, t = performance.now();
        this.world.step(), t = performance.now() - t, function (e, t) {
          var n = It();
          void 0 === n.counter ? Et = t : n.counter = t
        }(0, Lt("counter") + 1);
        var n = performance.now();
        this.drawer.redraw();
        n = performance.now() - n, Lt("counter") % 11 == 0 && console.log("perf: ".concat(t, ", ").concat(n, " milliseconds.")), requestAnimationFrame((function () {
          return e.step()
        }))
      }
    }, {
      key: "run", value: function () {
        var e = this;
        requestAnimationFrame((function () {
          return e.step()
        })), this.initDebugWindow()
      }
    }, {
      key: "initDebugWindow", value: function () {
        var e = this, t = document.getElementById("cnv");
        document.getElementById("info"), t.addEventListener("mousedown", (function (n) {
          var r = t.clientWidth / Lt("WIDTH"), o = t.clientHeight / Lt("HEIGHT"), i = parseInt(n.x / r),
            c = parseInt(n.y / o);
          e.debugOptions = { botX: i, botY: c }
        })), requestAnimationFrame((function () {
          return e.updateDebugWindow()
        }))
      }
    }, {
      key: "updateDebugWindow", value: function () {
        var e = this;
        if (this.debugOptions) {
          var t = document.getElementById("info"),
            n = debugWorld.getCell(this.debugOptions.botX, this.debugOptions.botY), r = Lt("Bot").get(n);
          r || (r = { x: "", y: "", xp: "", program: "", id: "" });
          var o = "";
          o += "x: ".concat(r.x, "</br>"), o += "y: ".concat(r.y, "</br>"), o += "xp: ".concat(Math.floor(r.xp), "</br>"), o += "program: ".concat(r.program.commands, "</br>"), o += "id: ".concat(r.id, "</br>"), t.innerHTML = o
        }
        requestAnimationFrame((function () {
          return e.updateDebugWindow()
        }))
      }
    }]), e
  }();

  function vt() {
    var e = Lt("WorldCreator").create();
    new (Lt("GamePerformer"))(e).run()
  }

  function pt(e, t, n) {
    var r, o, i, c, u, a, _, f;
    switch (1 === arguments.length && (t = e.s, n = e.v, e = e.h), a = n * (1 - t), _ = n * (1 - (u = 6 * e - (c = Math.floor(6 * e))) * t), f = n * (1 - (1 - u) * t), c % 6) {
      case 0:
        r = n, o = f, i = a;
        break;
      case 1:
        r = _, o = n, i = a;
        break;
      case 2:
        r = a, o = n, i = f;
        break;
      case 3:
        r = a, o = _, i = n;
        break;
      case 4:
        r = f, o = a, i = n;
        break;
      case 5:
        r = n, o = a, i = _
    }
    return { r: Math.round(255 * r), g: Math.round(255 * o), b: Math.round(255 * i) }
  }

  function bt() {
    try {
      if (e.g) return e.g
    } catch (e) {
      try {
        if (window) return window
      } catch (e) {
        return this
      }
    }
  }

  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)]
  }, Lt("run")();
  var mt = null;

  function Rt() {
    if (null === mt) {
      var e = bt();
      e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ || (e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0), mt = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++
    }
    return mt
  }

  function gt() {
    var e = bt();
    return e.__$$GLOBAL_REWIRE_REGISTRY__ || (e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)), e.__$$GLOBAL_REWIRE_REGISTRY__
  }

  function It() {
    var e = Rt(), t = gt(), n = t[e];
    return n || (t[e] = Object.create(null), n = t[e]), n
  }

  !function () {
    var e = bt();
    e.__rewire_reset_all__ || (e.__rewire_reset_all__ = function () {
      e.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null)
    })
  }();
  var wt = "__INTENTIONAL_UNDEFINED__", Tt = {};

  function Lt(e) {
    var t = It();
    if (void 0 === t[e]) return function (e) {
      switch (e) {
        case"DEFAULT_BOT":
          return ze;
        case"WIDTH":
          return 100;
        case"HEIGHT":
          return 50;
        case"HSVtoRGB":
          return pt;
        case"Drawer":
          return ht;
        case"counter":
          return Et;
        case"Bot":
          return qe;
        case"WorldCreator":
          return ye;
        case"GamePerformer":
          return dt;
        case"run":
          return vt
      }
    }(e);
    var n = t[e];
    return n === wt ? void 0 : n
  }

  function Dt(e, t) {
    var n = It();
    return "object" === at(e) ? (Object.keys(e).forEach((function (t) {
      n[t] = e[t]
    })), function () {
      Object.keys(e).forEach((function (t) {
        jt(e)
      }))
    }) : (n[e] = void 0 === t ? wt : t, function () {
      jt(e)
    })
  }

  function jt(e) {
    var t = It();
    delete t[e], 0 == Object.keys(t).length && delete gt()[Rt]
  }

  function St(e) {
    var t = It(), n = Object.keys(e), r = {};

    function o() {
      n.forEach((function (e) {
        t[e] = r[e]
      }))
    }

    return function (i) {
      n.forEach((function (n) {
        r[n] = t[n], t[n] = e[n]
      }));
      var c = i();
      return c && "function" == typeof c.then ? c.then(o).catch(o) : o(), c
    }
  }

  !function () {
    function e(e, t) {
      Object.defineProperty(Tt, e, { value: t, enumerable: !1, configurable: !0 })
    }

    e("__get__", Lt), e("__GetDependency__", Lt), e("__Rewire__", Dt), e("__set__", Dt), e("__reset__", jt), e("__ResetDependency__", jt), e("__with__", St)
  }()
})();
//# sourceMappingURL=main.js.map
