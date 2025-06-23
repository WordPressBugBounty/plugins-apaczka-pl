(() => {
    "use strict";
    var e, t = {
        977: () => {
            const e = window.React, t = window.wp.blocks, o = window.wp.element, n = window.wp.primitives,
                r = (0, o.createElement)(n.SVG, {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 24 24"
                }, (0, o.createElement)(n.Path, {
                    fillRule: "evenodd",
                    d: "M5 5.5h14a.5.5 0 01.5.5v1.5a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5zM4 9.232A2 2 0 013 7.5V6a2 2 0 012-2h14a2 2 0 012 2v1.5a2 2 0 01-1 1.732V18a2 2 0 01-2 2H6a2 2 0 01-2-2V9.232zm1.5.268V18a.5.5 0 00.5.5h12a.5.5 0 00.5-.5V9.5h-13z",
                    clipRule: "evenodd"
                })),
                a = (window.wp.i18n, window.wp.blockEditor, window.wp.components, window.wc.wcSettings, JSON.parse('{"apiVersion":2,"name":"apaczka-pl/block","version":"1.0.0","title":"Apaczka PL Map Button","category":"woocommerce","description":"This code adds map button and adds input to save delivery point data.","supports":{"html":false,"align":false,"multiple":false,"reusable":false},"parent":["woocommerce/checkout-shipping-methods-block"],"attributes":{"lock":{"type":"object","default":{"remove":true,"move":true}},"text":{"type":"string","source":"html","selector":".wp-block-apaczka-pl","default":""}},"textdomain":"apaczka-pl","editorStyle":""}'));
            (0, t.registerBlockType)(a, {
                icon: {
                    src: (0, e.createElement)((function ({icon: e, size: t = 24, ...n}) {
                        return (0, o.cloneElement)(e, {width: t, height: t, ...n})
                    }), {icon: r})
                }, edit: ({attributes: e, setAttributes: t}) => {
                }, save: ({attributes: e}) => {
                }
            })
        }
    }, o = {};

    function n(e) {
        var r = o[e];
        if (void 0 !== r) return r.exports;
        var a = o[e] = {exports: {}};
        return t[e](a, a.exports, n), a.exports
    }

    n.m = t, e = [], n.O = (t, o, r, a) => {
        if (!o) {
            var i = 1 / 0;
            for (d = 0; d < e.length; d++) {
                o = e[d][0], r = e[d][1], a = e[d][2];
                for (var s = !0, c = 0; c < o.length; c++) (!1 & a || i >= a) && Object.keys(n.O).every((e => n.O[e](o[c]))) ? o.splice(c--, 1) : (s = !1, a < i && (i = a));
                if (s) {
                    e.splice(d--, 1);
                    var l = r();
                    void 0 !== l && (t = l)
                }
            }
            return t
        }
        a = a || 0;
        for (var d = e.length; d > 0 && e[d - 1][2] > a; d--) e[d] = e[d - 1];
        e[d] = [o, r, a]
    }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (() => {
        var e = {576: 0, 115: 0};
        n.O.j = t => 0 === e[t];
        var t = (t, o) => {
            var r, a, i = o[0], s = o[1], c = o[2], l = 0;
            if (i.some((t => 0 !== e[t]))) {
                for (r in s) n.o(s, r) && (n.m[r] = s[r]);
                if (c) var d = c(n)
            }
            for (t && t(o); l < i.length; l++) a = i[l], n.o(e, a) && e[a] && e[a][0](), e[a] = 0;
            return n.O(d)
        }, o = self.webpackChunkalsendo_connect = self.webpackChunkalsendo_connect || [];
        o.forEach(t.bind(null, 0)), o.push = t.bind(null, o.push.bind(o))
    })();
    var r = n.O(void 0, [115], (() => n(977)));
    r = n.O(r)
})();