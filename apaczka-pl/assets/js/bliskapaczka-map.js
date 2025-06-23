var BPWidget, i18n, APACZKA_FIELD, POSType, I18n;
var bliskapaczka_alsendo_shipping_country;
var bliskapaczka_alsendo_y = 52.2625;
var bliskapaczka_alsendo_x = 21.07828;
document.addEventListener("DOMContentLoaded", function() {

    let wc_block_data = window.wcSettings;
    if (typeof wc_block_data != 'undefined' && wc_block_data !== null) {
        //console.log("wc_block_data");
        //console.log(wc_block_data);
        let checkout_data = wc_block_data.checkoutData;
        if (typeof checkout_data != 'undefined' && checkout_data !== null) {
            //console.log("wc_block_checkout_data");
            //console.log(checkout_data);
            bliskapaczka_alsendo_shipping_country = checkout_data.shipping_address.country;
        }
    } else {
        let bliskapaczka_alsendo_shipping = document.getElementById( 'shipping_country' );
        if (typeof bliskapaczka_alsendo_shipping != 'undefined' && bliskapaczka_alsendo_shipping !== null) {
            bliskapaczka_alsendo_shipping_country = bliskapaczka_alsendo_shipping.value;
            if ( 'undefined' == typeof bliskapaczka_alsendo_shipping_country || null === bliskapaczka_alsendo_shipping_country ) {
                let bliskapaczka_alsendo_billing = document.getElementById( 'billing_country' );
                if (typeof bliskapaczka_alsendo_billing != 'undefined' && bliskapaczka_alsendo_billing !== null) {
                    bliskapaczka_alsendo_shipping_country = bliskapaczka_alsendo_billing.value;
                }
            }
        }
    }

    document.addEventListener( 'change', function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if ( target.hasAttribute('id') ) {
            if( 'shipping_country' === target.getAttribute('id') || 'billing_country' === target.getAttribute('id') ) {
                //console.log('shipping_country billing_country');
                if( 'RO' === target.value ) {
                    bliskapaczka_alsendo_y = 44.433701;
                    bliskapaczka_alsendo_x = 26.125315;
                    //console.log('switch map to RO');
                } else {
                    bliskapaczka_alsendo_y = 52.2625;
                    bliskapaczka_alsendo_x = 21.07828;
                    //console.log('switch map to PL');
                }
            }
        }

    }, false );

});




class ApaczkaMap {
    constructor(t) {
        this.DAYS_MAP = {
            MONDAY: "mon",
            TUESDAY: "tue",
            WEDNESDAY: "wen",
            THURSDAY: "thu",
            FRIDAY: "fri",
            SATURDAY: "sat",
            SUNDAY: "sun"
        }, this.APACZKA_OPERATORS = [{operator: "DHL"}, {operator: "DPD"}, {operator: "INPOST"}, {operator: "POCZTA"}, {operator: "UPS"}], this.mapApaczkaCriteria(t), this.mapMapsOptions(t.center, t.zoom), this.options = t, this.selectedOperators = this.APACZKA_OPERATORS;
        t = document.createElement("div");
        t.setAttribute("id", "bpWidget"), t.style.width = "1024px", t.style.height = "800px", document.body.appendChild(t), this.element = t, this.loadMap()
    }

    show(t) {
        this.mapApaczkaAddress(t.address), this.mapApaczkaPoint(t.point), t.address || t.point || this.mapMapsOptions(t.center, t.zoom), this.loadMap()
    }

    setFilterSupplierAllowed(t, e) {
        this.selectedOperators = [], t.forEach(t => this.selectedOperators.push({
            operator: this.mapOperator(t),
            checked: !e || e.includes(t)
        })), this.loadMap()
    }

    loadMap() {
        BPWidget.init(this.element, {
            codOnly: this.remappedCriteria.codOnly,
            posType: this.remappedCriteria.posType,
            callback: t => {
                if (this.options.onChange) return this.options.onChange(this.mapApaczkaCallback(t))
            },
            mapOptions: this.mapOptions,
            showCod: !this.options.hideServicesCod,
            selectedPos: this.selectedPoint,
            initialAddress: this.initialAddress,
            operators: this.selectedOperators
        })
    }

    mapApaczkaCallback(t) {
        return {
            access_point_id: t.code,
            additional_info: t.description,
            city: t.city,
            foreign_access_point_id: t.code,
            latitude: t.latitude,
            longitude: t.longitude,
            name: t.description,
            open_hours: this.mapOpeningHours(t.openingHoursMap),
            postal_code: t.postalCode,
            services_cod: t.cod,
            services_receiver: t.deliveryPoint,
            services_sender: t.postingPoint,
            street: t.street,
            supplier: this.mapOperator(t.operator),
            subtype: t.brand
        }
    }

    mapOpeningHours(e) {
        let i = {};
        return Object.keys(e).map(t => {
            i[this.DAYS_MAP[t]] = [e[t].from, e[t].to]
        }), i
    }

    mapOperator(t) {
        return "DHL" === t ? "DHL_PARCEL" : t
    }

    mapApaczkaAddress(t) {
        this.initialAddress = t ? t.street + ", " + t.city : null
    }

    mapApaczkaPoint(t) {
        t ? ("DHL_PARCEL" === t.supplier && (t.supplier = "DHL"), this.selectedPoint = {
            code: t.foreign_access_point_id,
            operator: t.supplier
        }) : this.selectedPoint = null
    }

    mapMapsOptions(t, e) {
        this.mapOptions = {center: t ? {lat: t[0], lng: t[1]} : {lat: 52.226376, lng: 21.009979}, zoom: e || 12}
    }

    mapApaczkaCriteria(t) {
        let n = {};
        if (t.criteria) {
            let e = !1, i = !1;
            t.criteria.forEach(t => {
                t.field === APACZKA_FIELD.services_receiver && (e = t.value), t.field === APACZKA_FIELD.services_sender && (i = t.value), t.field === APACZKA_FIELD.services_cod && (n.codOnly = t.value)
            }), e && !i ? n.posType = POSType.DELIVERY : i && !e && (n.posType = POSType.POSTING)
        }
        this.remappedCriteria = n
    }
}

function posId(t) {
    return t.operator + "/" + t.code
}

!function (t) {
    t[t.services_sender = "services_sender"] = "services_sender", t[t.services_cod = "services_cod"] = "services_cod", t[t.services_receiver = "services_receiver"] = "services_receiver"
}(APACZKA_FIELD = APACZKA_FIELD || {}), function (t) {
    t[t.DELIVERY = "DELIVERY"] = "DELIVERY", t[t.POSTING = "POSTING"] = "POSTING"
}(POSType = POSType || {}), function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).leaflet = {})
}(this, function (t) {
    "use strict";

    function h(t) {
        for (var e, i, n = 1, o = arguments.length; n < o; n++) for (e in i = arguments[n]) t[e] = i[e];
        return t
    }

    var Z = Object.create || function (t) {
        return R.prototype = t, new R
    };

    function R() {
    }

    function a(t, e) {
        var i, n = Array.prototype.slice;
        return t.bind ? t.bind.apply(t, n.call(arguments, 1)) : (i = n.call(arguments, 2), function () {
            return t.apply(e, i.length ? i.concat(n.call(arguments)) : arguments)
        })
    }

    var D = 0;

    function d(t) {
        return "_leaflet_id" in t || (t._leaflet_id = ++D), t._leaflet_id
    }

    function j(t, e, i) {
        function n() {
            o = !1, s && (r.apply(i, s), s = !1)
        }

        var o, s, r = function () {
            o ? s = arguments : (t.apply(i, arguments), setTimeout(n, e), o = !0)
        };
        return r
    }

    function F(t, e, i) {
        var n = e[1], o = n - (e = e[0]);
        return t === n && i ? t : ((t - e) % o + o) % o + e
    }

    function p() {
        return !1
    }

    function i(t, e) {
        return !1 === e ? t : (e = Math.pow(10, void 0 === e ? 6 : e), Math.round(t * e) / e)
    }

    function U(t) {
        return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "")
    }

    function H(t) {
        return U(t).split(/\s+/)
    }

    function l(t, e) {
        for (var i in Object.prototype.hasOwnProperty.call(t, "options") || (t.options = t.options ? Z(t.options) : {}), e) t.options[i] = e[i];
        return t.options
    }

    function W(t, e, i) {
        var n, o = [];
        for (n in t) o.push(encodeURIComponent(i ? n.toUpperCase() : n) + "=" + encodeURIComponent(t[n]));
        return (e && -1 !== e.indexOf("?") ? "&" : "?") + o.join("&")
    }

    var G = /\{ *([\w_ -]+) *\}/g;

    function V(t, i) {
        return t.replace(G, function (t, e) {
            if (void 0 === (e = i[e])) throw new Error("No value provided for variable " + t);
            return "function" == typeof e ? e(i) : e
        })
    }

    var u = Array.isArray || function (t) {
        return "[object Array]" === Object.prototype.toString.call(t)
    };

    function q(t, e) {
        for (var i = 0; i < t.length; i++) if (t[i] === e) return i;
        return -1
    }

    var $ = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

    function Y(t) {
        return window["webkit" + t] || window["moz" + t] || window["ms" + t]
    }

    var K = 0;

    function X(t) {
        var e = +new Date, i = Math.max(0, 16 - (e - K));
        return K = e + i, window.setTimeout(t, i)
    }

    var J = window.requestAnimationFrame || Y("RequestAnimationFrame") || X,
        Q = window.cancelAnimationFrame || Y("CancelAnimationFrame") || Y("CancelRequestAnimationFrame") || function (t) {
            window.clearTimeout(t)
        };

    function y(t, e, i) {
        if (!i || J !== X) return J.call(window, a(t, e));
        t.call(e)
    }

    function r(t) {
        t && Q.call(window, t)
    }

    var tt = {
        __proto__: null,
        extend: h,
        create: Z,
        bind: a,
        get lastId() {
            return D
        },
        stamp: d,
        throttle: j,
        wrapNum: F,
        falseFn: p,
        formatNum: i,
        trim: U,
        splitWords: H,
        setOptions: l,
        getParamString: W,
        template: V,
        isArray: u,
        indexOf: q,
        emptyImageUrl: $,
        requestFn: J,
        cancelFn: Q,
        requestAnimFrame: y,
        cancelAnimFrame: r
    };

    function et() {
    }

    et.extend = function (t) {
        function e() {
            l(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks()
        }

        var i, n = e.__super__ = this.prototype, o = Z(n);
        for (i in (o.constructor = e).prototype = o, this) Object.prototype.hasOwnProperty.call(this, i) && "prototype" !== i && "__super__" !== i && (e[i] = this[i]);
        if (t.statics && h(e, t.statics), t.includes) {
            var s = t.includes;
            if ("undefined" != typeof L && L && L.Mixin) for (var s = u(s) ? s : [s], r = 0; r < s.length; r++) s[r] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", (new Error).stack);
            h.apply(null, [o].concat(t.includes))
        }
        return h(o, t), delete o.statics, delete o.includes, o.options && (o.options = n.options ? Z(n.options) : {}, h(o.options, t.options)), o._initHooks = [], o.callInitHooks = function () {
            if (!this._initHooksCalled) {
                n.callInitHooks && n.callInitHooks.call(this), this._initHooksCalled = !0;
                for (var t = 0, e = o._initHooks.length; t < e; t++) o._initHooks[t].call(this)
            }
        }, e
    }, et.include = function (t) {
        var e = this.prototype.options;
        return h(this.prototype, t), t.options && (this.prototype.options = e, this.mergeOptions(t.options)), this
    }, et.mergeOptions = function (t) {
        return h(this.prototype.options, t), this
    }, et.addInitHook = function (t) {
        var e = Array.prototype.slice.call(arguments, 1), i = "function" == typeof t ? t : function () {
            this[t].apply(this, e)
        };
        return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(i), this
    };
    var e = {
            on: function (t, e, i) {
                if ("object" == typeof t) for (var n in t) this._on(n, t[n], e); else for (var o = 0, s = (t = H(t)).length; o < s; o++) this._on(t[o], e, i);
                return this
            }, off: function (t, e, i) {
                if (arguments.length) if ("object" == typeof t) for (var n in t) this._off(n, t[n], e); else {
                    t = H(t);
                    for (var o = 1 === arguments.length, s = 0, r = t.length; s < r; s++) o ? this._off(t[s]) : this._off(t[s], e, i)
                } else delete this._events;
                return this
            }, _on: function (t, e, i, n) {
                "function" != typeof e ? console.warn("wrong listener type: " + typeof e) : !1 === this._listens(t, e, i) && (e = {
                    fn: e,
                    ctx: i = i === this ? void 0 : i
                }, n && (e.once = !0), this._events = this._events || {}, this._events[t] = this._events[t] || [], this._events[t].push(e))
            }, _off: function (t, e, i) {
                var n, o, s;
                if (this._events && (n = this._events[t])) if (1 === arguments.length) {
                    if (this._firingCount) for (o = 0, s = n.length; o < s; o++) n[o].fn = p;
                    delete this._events[t]
                } else "function" != typeof e ? console.warn("wrong listener type: " + typeof e) : !1 !== (e = this._listens(t, e, i)) && (i = n[e], this._firingCount && (i.fn = p, this._events[t] = n = n.slice()), n.splice(e, 1))
            }, fire: function (t, e, i) {
                if (this.listens(t, i)) {
                    var n = h({}, e, {type: t, target: this, sourceTarget: e && e.sourceTarget || this});
                    if (this._events) {
                        var o = this._events[t];
                        if (o) {
                            this._firingCount = this._firingCount + 1 || 1;
                            for (var s = 0, r = o.length; s < r; s++) {
                                var a = o[s], l = a.fn;
                                a.once && this.off(t, l, a.ctx), l.call(a.ctx || this, n)
                            }
                            this._firingCount--
                        }
                    }
                    i && this._propagateEvent(n)
                }
                return this
            }, listens: function (t, e, i, n) {
                "string" != typeof t && console.warn('"string" type argument expected');
                var o = e, s = ("function" != typeof e && (n = !!e, i = o = void 0), this._events && this._events[t]);
                if (s && s.length && !1 !== this._listens(t, o, i)) return !0;
                if (n) for (var r in this._eventParents) if (this._eventParents[r].listens(t, e, i, n)) return !0;
                return !1
            }, _listens: function (t, e, i) {
                if (this._events) {
                    var n = this._events[t] || [];
                    if (!e) return !!n.length;
                    i === this && (i = void 0);
                    for (var o = 0, s = n.length; o < s; o++) if (n[o].fn === e && n[o].ctx === i) return o
                }
                return !1
            }, once: function (t, e, i) {
                if ("object" == typeof t) for (var n in t) this._on(n, t[n], e, !0); else for (var o = 0, s = (t = H(t)).length; o < s; o++) this._on(t[o], e, i, !0);
                return this
            }, addEventParent: function (t) {
                return this._eventParents = this._eventParents || {}, this._eventParents[d(t)] = t, this
            }, removeEventParent: function (t) {
                return this._eventParents && delete this._eventParents[d(t)], this
            }, _propagateEvent: function (t) {
                for (var e in this._eventParents) this._eventParents[e].fire(t.type, h({
                    layer: t.target,
                    propagatedFrom: t.target
                }, t), !0)
            }
        },
        it = (e.addEventListener = e.on, e.removeEventListener = e.clearAllEventListeners = e.off, e.addOneTimeEventListener = e.once, e.fireEvent = e.fire, e.hasEventListeners = e.listens, et.extend(e));

    function f(t, e, i) {
        this.x = i ? Math.round(t) : t, this.y = i ? Math.round(e) : e
    }

    var nt = Math.trunc || function (t) {
        return 0 < t ? Math.floor(t) : Math.ceil(t)
    };

    function m(t, e, i) {
        return t instanceof f ? t : u(t) ? new f(t[0], t[1]) : null == t ? t : "object" == typeof t && "x" in t && "y" in t ? new f(t.x, t.y) : new f(t, e, i)
    }

    function _(t, e) {
        if (t) for (var i = e ? [t, e] : t, n = 0, o = i.length; n < o; n++) this.extend(i[n])
    }

    function c(t, e) {
        return !t || t instanceof _ ? t : new _(t, e)
    }

    function s(t, e) {
        if (t) for (var i = e ? [t, e] : t, n = 0, o = i.length; n < o; n++) this.extend(i[n])
    }

    function g(t, e) {
        return t instanceof s ? t : new s(t, e)
    }

    function v(t, e, i) {
        if (isNaN(t) || isNaN(e)) throw new Error("Invalid LatLng object: (" + t + ", " + e + ")");
        this.lat = +t, this.lng = +e, void 0 !== i && (this.alt = +i)
    }

    function b(t, e, i) {
        return t instanceof v ? t : u(t) && "object" != typeof t[0] ? 3 === t.length ? new v(t[0], t[1], t[2]) : 2 === t.length ? new v(t[0], t[1]) : null : null == t ? t : "object" == typeof t && "lat" in t ? new v(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : void 0 === e ? null : new v(t, e, i)
    }

    f.prototype = {
        clone: function () {
            return new f(this.x, this.y)
        }, add: function (t) {
            return this.clone()._add(m(t))
        }, _add: function (t) {
            return this.x += t.x, this.y += t.y, this
        }, subtract: function (t) {
            return this.clone()._subtract(m(t))
        }, _subtract: function (t) {
            return this.x -= t.x, this.y -= t.y, this
        }, divideBy: function (t) {
            return this.clone()._divideBy(t)
        }, _divideBy: function (t) {
            return this.x /= t, this.y /= t, this
        }, multiplyBy: function (t) {
            return this.clone()._multiplyBy(t)
        }, _multiplyBy: function (t) {
            return this.x *= t, this.y *= t, this
        }, scaleBy: function (t) {
            return new f(this.x * t.x, this.y * t.y)
        }, unscaleBy: function (t) {
            return new f(this.x / t.x, this.y / t.y)
        }, round: function () {
            return this.clone()._round()
        }, _round: function () {
            return this.x = Math.round(this.x), this.y = Math.round(this.y), this
        }, floor: function () {
            return this.clone()._floor()
        }, _floor: function () {
            return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this
        }, ceil: function () {
            return this.clone()._ceil()
        }, _ceil: function () {
            return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this
        }, trunc: function () {
            return this.clone()._trunc()
        }, _trunc: function () {
            return this.x = nt(this.x), this.y = nt(this.y), this
        }, distanceTo: function (t) {
            var e = (t = m(t)).x - this.x, t = t.y - this.y;
            return Math.sqrt(e * e + t * t)
        }, equals: function (t) {
            return (t = m(t)).x === this.x && t.y === this.y
        }, contains: function (t) {
            return t = m(t), Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y)
        }, toString: function () {
            return "Point(" + i(this.x) + ", " + i(this.y) + ")"
        }
    }, _.prototype = {
        extend: function (t) {
            var e, i;
            if (t) {
                if (t instanceof f || "number" == typeof t[0] || "x" in t) e = i = m(t); else if (e = (t = c(t)).min, i = t.max, !e || !i) return this;
                this.min || this.max ? (this.min.x = Math.min(e.x, this.min.x), this.max.x = Math.max(i.x, this.max.x), this.min.y = Math.min(e.y, this.min.y), this.max.y = Math.max(i.y, this.max.y)) : (this.min = e.clone(), this.max = i.clone())
            }
            return this
        }, getCenter: function (t) {
            return m((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, t)
        }, getBottomLeft: function () {
            return m(this.min.x, this.max.y)
        }, getTopRight: function () {
            return m(this.max.x, this.min.y)
        }, getTopLeft: function () {
            return this.min
        }, getBottomRight: function () {
            return this.max
        }, getSize: function () {
            return this.max.subtract(this.min)
        }, contains: function (t) {
            var e, i;
            return (t = ("number" == typeof t[0] || t instanceof f ? m : c)(t)) instanceof _ ? (e = t.min, i = t.max) : e = i = t, e.x >= this.min.x && i.x <= this.max.x && e.y >= this.min.y && i.y <= this.max.y
        }, intersects: function (t) {
            t = c(t);
            var e = this.min, i = this.max, n = t.min, o = (t = t.max).x >= e.x && n.x <= i.x,
                t = t.y >= e.y && n.y <= i.y;
            return o && t
        }, overlaps: function (t) {
            t = c(t);
            var e = this.min, i = this.max, n = t.min, o = (t = t.max).x > e.x && n.x < i.x, t = t.y > e.y && n.y < i.y;
            return o && t
        }, isValid: function () {
            return !(!this.min || !this.max)
        }, pad: function (t) {
            var e = this.min, i = this.max, n = Math.abs(e.x - i.x) * t, t = Math.abs(e.y - i.y) * t;
            return c(m(e.x - n, e.y - t), m(i.x + n, i.y + t))
        }, equals: function (t) {
            return !!t && (t = c(t), this.min.equals(t.getTopLeft())) && this.max.equals(t.getBottomRight())
        }
    }, s.prototype = {
        extend: function (t) {
            var e, i, n = this._southWest, o = this._northEast;
            if (t instanceof v) i = e = t; else {
                if (!(t instanceof s)) return t ? this.extend(b(t) || g(t)) : this;
                if (e = t._southWest, i = t._northEast, !e || !i) return this
            }
            return n || o ? (n.lat = Math.min(e.lat, n.lat), n.lng = Math.min(e.lng, n.lng), o.lat = Math.max(i.lat, o.lat), o.lng = Math.max(i.lng, o.lng)) : (this._southWest = new v(e.lat, e.lng), this._northEast = new v(i.lat, i.lng)), this
        }, pad: function (t) {
            var e = this._southWest, i = this._northEast, n = Math.abs(e.lat - i.lat) * t,
                t = Math.abs(e.lng - i.lng) * t;
            return new s(new v(e.lat - n, e.lng - t), new v(i.lat + n, i.lng + t))
        }, getCenter: function () {
            return new v((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2)
        }, getSouthWest: function () {
            return this._southWest
        }, getNorthEast: function () {
            return this._northEast
        }, getNorthWest: function () {
            return new v(this.getNorth(), this.getWest())
        }, getSouthEast: function () {
            return new v(this.getSouth(), this.getEast())
        }, getWest: function () {
            return this._southWest.lng
        }, getSouth: function () {
            return this._southWest.lat
        }, getEast: function () {
            return this._northEast.lng
        }, getNorth: function () {
            return this._northEast.lat
        }, contains: function (t) {
            t = ("number" == typeof t[0] || t instanceof v || "lat" in t ? b : g)(t);
            var e, i, n = this._southWest, o = this._northEast;
            return t instanceof s ? (e = t.getSouthWest(), i = t.getNorthEast()) : e = i = t, e.lat >= n.lat && i.lat <= o.lat && e.lng >= n.lng && i.lng <= o.lng
        }, intersects: function (t) {
            t = g(t);
            var e = this._southWest, i = this._northEast, n = t.getSouthWest(),
                o = (t = t.getNorthEast()).lat >= e.lat && n.lat <= i.lat, t = t.lng >= e.lng && n.lng <= i.lng;
            return o && t
        }, overlaps: function (t) {
            t = g(t);
            var e = this._southWest, i = this._northEast, n = t.getSouthWest(),
                o = (t = t.getNorthEast()).lat > e.lat && n.lat < i.lat, t = t.lng > e.lng && n.lng < i.lng;
            return o && t
        }, toBBoxString: function () {
            return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",")
        }, equals: function (t, e) {
            return !!t && (t = g(t), this._southWest.equals(t.getSouthWest(), e)) && this._northEast.equals(t.getNorthEast(), e)
        }, isValid: function () {
            return !(!this._southWest || !this._northEast)
        }
    };
    var ot = {
        latLngToPoint: function (t, e) {
            return t = this.projection.project(t), e = this.scale(e), this.transformation._transform(t, e)
        }, pointToLatLng: function (t, e) {
            return e = this.scale(e), t = this.transformation.untransform(t, e), this.projection.unproject(t)
        }, project: function (t) {
            return this.projection.project(t)
        }, unproject: function (t) {
            return this.projection.unproject(t)
        }, scale: function (t) {
            return 256 * Math.pow(2, t)
        }, zoom: function (t) {
            return Math.log(t / 256) / Math.LN2
        }, getProjectedBounds: function (t) {
            var e;
            return this.infinite ? null : (e = this.projection.bounds, t = this.scale(t), new _(this.transformation.transform(e.min, t), this.transformation.transform(e.max, t)))
        }, infinite: !(v.prototype = {
            equals: function (t, e) {
                return !!t && (t = b(t), Math.max(Math.abs(this.lat - t.lat), Math.abs(this.lng - t.lng)) <= (void 0 === e ? 1e-9 : e))
            }, toString: function (t) {
                return "LatLng(" + i(this.lat, t) + ", " + i(this.lng, t) + ")"
            }, distanceTo: function (t) {
                return st.distance(this, b(t))
            }, wrap: function () {
                return st.wrapLatLng(this)
            }, toBounds: function (t) {
                var e = (t = 180 * t / 40075017) / Math.cos(Math.PI / 180 * this.lat);
                return g([this.lat - t, this.lng - e], [this.lat + t, this.lng + e])
            }, clone: function () {
                return new v(this.lat, this.lng, this.alt)
            }
        }), wrapLatLng: function (t) {
            var e = this.wrapLng ? F(t.lng, this.wrapLng, !0) : t.lng;
            return new v(this.wrapLat ? F(t.lat, this.wrapLat, !0) : t.lat, e, t.alt)
        }, wrapLatLngBounds: function (t) {
            var e = t.getCenter(), i = this.wrapLatLng(e), n = e.lat - i.lat, e = e.lng - i.lng;
            return 0 == n && 0 == e ? t : (i = t.getSouthWest(), t = t.getNorthEast(), new s(new v(i.lat - n, i.lng - e), new v(t.lat - n, t.lng - e)))
        }
    }, st = h({}, ot, {
        wrapLng: [-180, 180], R: 6371e3, distance: function (t, e) {
            var i = Math.PI / 180, n = t.lat * i, o = e.lat * i, s = Math.sin((e.lat - t.lat) * i / 2),
                e = Math.sin((e.lng - t.lng) * i / 2), t = s * s + Math.cos(n) * Math.cos(o) * e * e,
                i = 2 * Math.atan2(Math.sqrt(t), Math.sqrt(1 - t));
            return this.R * i
        }
    }), rt = {
        R: 6378137, MAX_LATITUDE: 85.0511287798, project: function (t) {
            var e = Math.PI / 180, i = this.MAX_LATITUDE, i = Math.max(Math.min(i, t.lat), -i), i = Math.sin(i * e);
            return new f(this.R * t.lng * e, this.R * Math.log((1 + i) / (1 - i)) / 2)
        }, unproject: function (t) {
            var e = 180 / Math.PI;
            return new v((2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * e, t.x * e / this.R)
        }, bounds: new _([-(rt = 6378137 * Math.PI), -rt], [rt, rt])
    };

    function at(t, e, i, n) {
        u(t) ? (this._a = t[0], this._b = t[1], this._c = t[2], this._d = t[3]) : (this._a = t, this._b = e, this._c = i, this._d = n)
    }

    function lt(t, e, i, n) {
        return new at(t, e, i, n)
    }

    at.prototype = {
        transform: function (t, e) {
            return this._transform(t.clone(), e)
        }, _transform: function (t, e) {
            return t.x = (e = e || 1) * (this._a * t.x + this._b), t.y = e * (this._c * t.y + this._d), t
        }, untransform: function (t, e) {
            return new f((t.x / (e = e || 1) - this._b) / this._a, (t.y / e - this._d) / this._c)
        }
    };
    var ht = h({}, st, {
        code: "EPSG:3857",
        projection: rt,
        transformation: lt(ht = .5 / (Math.PI * rt.R), .5, -ht, .5)
    }), ut = h({}, ht, {code: "EPSG:900913"});

    function ct(t) {
        return document.createElementNS("http://www.w3.org/2000/svg", t)
    }

    function dt(t, e) {
        for (var i, n, o, s, r = "", a = 0, l = t.length; a < l; a++) {
            for (i = 0, n = (o = t[a]).length; i < n; i++) r += (i ? "L" : "M") + (s = o[i]).x + " " + s.y;
            r += e ? w.svg ? "z" : "x" : ""
        }
        return r || "M0 0"
    }

    var pt = document.documentElement.style, ft = (Ee = "ActiveXObject" in window) && !document.addEventListener,
        n = "msLaunchUri" in navigator && !("documentMode" in document), mt = x("webkit"), _t = x("android"),
        gt = x("android 2") || x("android 3"), vt = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10),
        vt = _t && x("Google") && vt < 537 && !("AudioNode" in window), yt = !!window.opera, bt = !n && x("chrome"),
        Lt = x("gecko") && !mt && !yt && !Ee, xt = !bt && x("safari"), wt = x("phantom"), o = "OTransition" in pt,
        Pt = 0 === navigator.platform.indexOf("Win"), Ct = Ee && "transition" in pt,
        Et = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix && !gt, pt = "MozPerspective" in pt,
        Tt = !window.L_DISABLE_3D && (Ct || Et || pt) && !o && !wt,
        Mt = (qi = "undefined" != typeof orientation || x("mobile")) && mt, St = qi && Et,
        kt = !window.PointerEvent && window.MSPointerEvent, Ot = !(!window.PointerEvent && !kt),
        At = "ontouchstart" in window || !!window.TouchEvent, It = !window.L_NO_TOUCH && (At || Ot), zt = qi && yt,
        Bt = qi && Lt, Nt = 1 < (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI),
        Zt = function () {
            var t = !1;
            try {
                var e = Object.defineProperty({}, "passive", {
                    get: function () {
                        t = !0
                    }
                });
                window.addEventListener("testPassiveEventSupport", p, e), window.removeEventListener("testPassiveEventSupport", p, e)
            } catch (t) {
            }
            return t
        }(), Rt = !!document.createElement("canvas").getContext,
        Dt = !(!document.createElementNS || !ct("svg").createSVGRect),
        jt = !!Dt && ((jt = document.createElement("div")).innerHTML = "<svg/>", "http://www.w3.org/2000/svg" === (jt.firstChild && jt.firstChild.namespaceURI));

    function x(t) {
        return 0 <= navigator.userAgent.toLowerCase().indexOf(t)
    }

    var w = {
            ie: Ee,
            ielt9: ft,
            edge: n,
            webkit: mt,
            android: _t,
            android23: gt,
            androidStock: vt,
            opera: yt,
            chrome: bt,
            gecko: Lt,
            safari: xt,
            phantom: wt,
            opera12: o,
            win: Pt,
            ie3d: Ct,
            webkit3d: Et,
            gecko3d: pt,
            any3d: Tt,
            mobile: qi,
            mobileWebkit: Mt,
            mobileWebkit3d: St,
            msPointer: kt,
            pointer: Ot,
            touch: It,
            touchNative: At,
            mobileOpera: zt,
            mobileGecko: Bt,
            retina: Nt,
            passiveEvents: Zt,
            canvas: Rt,
            svg: Dt,
            vml: !Dt && function () {
                try {
                    var t = document.createElement("div"), e = (t.innerHTML = '<v:shape adj="1"/>', t.firstChild);
                    return e.style.behavior = "url(#default#VML)", e && "object" == typeof e.adj
                } catch (t) {
                    return !1
                }
            }(),
            inlineSvg: jt,
            mac: 0 === navigator.platform.indexOf("Mac"),
            linux: 0 === navigator.platform.indexOf("Linux")
        }, Ft = w.msPointer ? "MSPointerDown" : "pointerdown", Ut = w.msPointer ? "MSPointerMove" : "pointermove",
        Ht = w.msPointer ? "MSPointerUp" : "pointerup", Wt = w.msPointer ? "MSPointerCancel" : "pointercancel",
        Gt = {touchstart: Ft, touchmove: Ut, touchend: Ht, touchcancel: Wt}, Vt = {
            touchstart: function (t, e) {
                e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH && I(e), Jt(t, e)
            }, touchmove: Jt, touchend: Jt, touchcancel: Jt
        }, qt = {}, $t = !1;

    function Yt(t) {
        qt[t.pointerId] = t
    }

    function Kt(t) {
        qt[t.pointerId] && (qt[t.pointerId] = t)
    }

    function Xt(t) {
        delete qt[t.pointerId]
    }

    function Jt(t, e) {
        if (e.pointerType !== (e.MSPOINTER_TYPE_MOUSE || "mouse")) {
            for (var i in e.touches = [], qt) e.touches.push(qt[i]);
            e.changedTouches = [e], t(e)
        }
    }

    var Qt = 200;
    var te, ee, ie, ne, oe, se = _e(["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]),
        re = _e(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]),
        ae = "webkitTransition" === re || "OTransition" === re ? re + "End" : "transitionend";

    function le(t) {
        return "string" == typeof t ? document.getElementById(t) : t
    }

    function he(t, e) {
        var i = t.style[e] || t.currentStyle && t.currentStyle[e];
        return "auto" === (i = i && "auto" !== i || !document.defaultView ? i : (t = document.defaultView.getComputedStyle(t, null)) ? t[e] : null) ? null : i
    }

    function P(t, e, i) {
        return (t = document.createElement(t)).className = e || "", i && i.appendChild(t), t
    }

    function C(t) {
        var e = t.parentNode;
        e && e.removeChild(t)
    }

    function ue(t) {
        for (; t.firstChild;) t.removeChild(t.firstChild)
    }

    function ce(t) {
        var e = t.parentNode;
        e && e.lastChild !== t && e.appendChild(t)
    }

    function de(t) {
        var e = t.parentNode;
        e && e.firstChild !== t && e.insertBefore(t, e.firstChild)
    }

    function pe(t, e) {
        return void 0 !== t.classList ? t.classList.contains(e) : 0 < (t = me(t)).length && new RegExp("(^|\\s)" + e + "(\\s|$)").test(t)
    }

    function E(t, e) {
        var i;
        if (void 0 !== t.classList) for (var n = H(e), o = 0, s = n.length; o < s; o++) t.classList.add(n[o]); else pe(t, e) || fe(t, ((i = me(t)) ? i + " " : "") + e)
    }

    function T(t, e) {
        void 0 !== t.classList ? t.classList.remove(e) : fe(t, U((" " + me(t) + " ").replace(" " + e + " ", " ")))
    }

    function fe(t, e) {
        void 0 === t.className.baseVal ? t.className = e : t.className.baseVal = e
    }

    function me(t) {
        return void 0 === (t = t.correspondingElement || t).className.baseVal ? t.className : t.className.baseVal
    }

    function M(t, e) {
        if ("opacity" in t.style) t.style.opacity = e; else if ("filter" in t.style) {
            var i = !1, n = "DXImageTransform.Microsoft.Alpha";
            try {
                i = t.filters.item(n)
            } catch (t) {
                if (1 === e) return
            }
            e = Math.round(100 * e), i ? (i.Enabled = 100 !== e, i.Opacity = e) : t.style.filter += " progid:" + n + "(opacity=" + e + ")"
        }
    }

    function _e(t) {
        for (var e = document.documentElement.style, i = 0; i < t.length; i++) if (t[i] in e) return t[i];
        return !1
    }

    function ge(t, e, i) {
        e = e || new f(0, 0), t.style[se] = (w.ie3d ? "translate(" + e.x + "px," + e.y + "px)" : "translate3d(" + e.x + "px," + e.y + "px,0)") + (i ? " scale(" + i + ")" : "")
    }

    function S(t, e) {
        t._leaflet_pos = e, w.any3d ? ge(t, e) : (t.style.left = e.x + "px", t.style.top = e.y + "px")
    }

    function ve(t) {
        return t._leaflet_pos || new f(0, 0)
    }

    function ye() {
        k(window, "dragstart", I)
    }

    function be() {
        A(window, "dragstart", I)
    }

    function Le(t) {
        for (; -1 === t.tabIndex;) t = t.parentNode;
        t.style && (xe(), oe = (ne = t).style.outlineStyle, t.style.outlineStyle = "none", k(window, "keydown", xe))
    }

    function xe() {
        ne && (ne.style.outlineStyle = oe, oe = ne = void 0, A(window, "keydown", xe))
    }

    function we(t) {
        for (; !((t = t.parentNode).offsetWidth && t.offsetHeight || t === document.body);) ;
        return t
    }

    function Pe(t) {
        var e = t.getBoundingClientRect();
        return {x: e.width / t.offsetWidth || 1, y: e.height / t.offsetHeight || 1, boundingClientRect: e}
    }

    function k(t, e, i, n) {
        if (e && "object" == typeof e) for (var o in e) Se(t, o, e[o], i); else for (var s = 0, r = (e = H(e)).length; s < r; s++) Se(t, e[s], i, n);
        return this
    }

    var Ce = "onselectstart" in document ? (ie = function () {
        k(window, "selectstart", I)
    }, function () {
        A(window, "selectstart", I)
    }) : (ee = _e(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]), ie = function () {
        var t;
        ee && (t = document.documentElement.style, te = t[ee], t[ee] = "none")
    }, function () {
        ee && (document.documentElement.style[ee] = te, te = void 0)
    }), Ee = {
        __proto__: null,
        TRANSFORM: se,
        TRANSITION: re,
        TRANSITION_END: ae,
        get: le,
        getStyle: he,
        create: P,
        remove: C,
        empty: ue,
        toFront: ce,
        toBack: de,
        hasClass: pe,
        addClass: E,
        removeClass: T,
        setClass: fe,
        getClass: me,
        setOpacity: M,
        testProp: _e,
        setTransform: ge,
        setPosition: S,
        getPosition: ve,
        get disableTextSelection() {
            return ie
        },
        get enableTextSelection() {
            return Ce
        },
        disableImageDrag: ye,
        enableImageDrag: be,
        preventOutline: Le,
        restoreOutline: xe,
        getSizedParentNode: we,
        getScale: Pe
    }, O = "_leaflet_events";

    function A(t, e, i, n) {
        if (1 === arguments.length) Te(t), delete t[O]; else if (e && "object" == typeof e) for (var o in e) ke(t, o, e[o], i); else if (e = H(e), 2 === arguments.length) Te(t, function (t) {
            return -1 !== q(e, t)
        }); else for (var s = 0, r = e.length; s < r; s++) ke(t, e[s], i, n);
        return this
    }

    function Te(t, e) {
        for (var i in t[O]) {
            var n = i.split(/\d/)[0];
            e && !e(n) || ke(t, n, null, null, i)
        }
    }

    var Me = {mouseenter: "mouseover", mouseleave: "mouseout", wheel: !("onwheel" in window) && "mousewheel"};

    function Se(e, t, i, n) {
        var o, s, r, a, l, h, u = t + d(i) + (n ? "_" + d(n) : "");

        function c(t) {
            var e;
            1 !== t.detail ? l = t.detail : "mouse" === t.pointerType || t.sourceCapabilities && !t.sourceCapabilities.firesTouchEvents || (e = Be(t)).some(function (t) {
                return t instanceof HTMLLabelElement && t.attributes.for
            }) && !e.some(function (t) {
                return t instanceof HTMLInputElement || t instanceof HTMLSelectElement
            }) || ((e = Date.now()) - h <= Qt ? 2 == ++l && a(function (t) {
                var e, i, n = {};
                for (i in t) e = t[i], n[i] = e && e.bind ? e.bind(t) : e;
                return (t = n).type = "dblclick", n.detail = 2, n.isTrusted = !1, n._simulated = !0, n
            }(t)) : l = 1, h = e)
        }

        e[O] && e[O][u] || (s = o = function (t) {
            return i.call(n || e, t || window.event)
        }, !w.touchNative && w.pointer && 0 === t.indexOf("touch") ? o = function (t, e, i) {
            return "touchstart" !== e || $t || (document.addEventListener(Ft, Yt, !0), document.addEventListener(Ut, Kt, !0), document.addEventListener(Ht, Xt, !0), document.addEventListener(Wt, Xt, !0), $t = !0), Vt[e] ? (i = Vt[e].bind(this, i), t.addEventListener(Gt[e], i, !1), i) : (console.warn("wrong event specified:", e), p)
        }(e, t, o) : w.touch && "dblclick" === t ? (a = o, (r = e).addEventListener("dblclick", a), h = 0, r.addEventListener("click", c), o = {
            dblclick: a,
            simDblclick: c
        }) : "addEventListener" in e ? "touchstart" === t || "touchmove" === t || "wheel" === t || "mousewheel" === t ? e.addEventListener(Me[t] || t, o, !!w.passiveEvents && {passive: !1}) : "mouseenter" === t || "mouseleave" === t ? e.addEventListener(Me[t], o = function (t) {
            t = t || window.event, De(e, t) && s(t)
        }, !1) : e.addEventListener(t, s, !1) : e.attachEvent("on" + t, o), e[O] = e[O] || {}, e[O][u] = o)
    }

    function ke(t, e, i, n, o) {
        var s, r;
        o = o || e + d(i) + (n ? "_" + d(n) : ""), (i = t[O] && t[O][o]) && (!w.touchNative && w.pointer && 0 === e.indexOf("touch") ? (n = t, r = i, Gt[s = e] ? n.removeEventListener(Gt[s], r, !1) : console.warn("wrong event specified:", s)) : w.touch && "dblclick" === e ? ((r = t).removeEventListener("dblclick", (n = i).dblclick), r.removeEventListener("click", n.simDblclick)) : "removeEventListener" in t ? t.removeEventListener(Me[e] || e, i, !1) : t.detachEvent("on" + e, i), t[O][o] = null)
    }

    function Oe(t) {
        return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, this
    }

    function Ae(t) {
        return Se(t, "wheel", Oe), this
    }

    function Ie(t) {
        return k(t, "mousedown touchstart dblclick contextmenu", Oe), t._leaflet_disable_click = !0, this
    }

    function I(t) {
        return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this
    }

    function ze(t) {
        return I(t), Oe(t), this
    }

    function Be(t) {
        if (t.composedPath) return t.composedPath();
        for (var e = [], i = t.target; i;) e.push(i), i = i.parentNode;
        return e
    }

    function Ne(t, e) {
        var i, n;
        return e ? (n = (i = Pe(e)).boundingClientRect, new f((t.clientX - n.left) / i.x - e.clientLeft, (t.clientY - n.top) / i.y - e.clientTop)) : new f(t.clientX, t.clientY)
    }

    var Ze = w.linux && w.chrome ? window.devicePixelRatio : w.mac ? 3 * window.devicePixelRatio : 0 < window.devicePixelRatio ? 2 * window.devicePixelRatio : 1;

    function Re(t) {
        return w.edge ? t.wheelDeltaY / 2 : t.deltaY && 0 === t.deltaMode ? -t.deltaY / Ze : t.deltaY && 1 === t.deltaMode ? 20 * -t.deltaY : t.deltaY && 2 === t.deltaMode ? 60 * -t.deltaY : t.deltaX || t.deltaZ ? 0 : t.wheelDelta ? (t.wheelDeltaY || t.wheelDelta) / 2 : t.detail && Math.abs(t.detail) < 32765 ? 20 * -t.detail : t.detail ? t.detail / -32765 * 60 : 0
    }

    function De(t, e) {
        var i = e.relatedTarget;
        if (!i) return !0;
        try {
            for (; i && i !== t;) i = i.parentNode
        } catch (t) {
            return !1
        }
        return i !== t
    }

    var ft = {
        __proto__: null,
        on: k,
        off: A,
        stopPropagation: Oe,
        disableScrollPropagation: Ae,
        disableClickPropagation: Ie,
        preventDefault: I,
        stop: ze,
        getPropagationPath: Be,
        getMousePosition: Ne,
        getWheelDelta: Re,
        isExternalTarget: De,
        addListener: k,
        removeListener: A
    }, je = it.extend({
        run: function (t, e, i, n) {
            this.stop(), this._el = t, this._inProgress = !0, this._duration = i || .25, this._easeOutPower = 1 / Math.max(n || .5, .2), this._startPos = ve(t), this._offset = e.subtract(this._startPos), this._startTime = +new Date, this.fire("start"), this._animate()
        }, stop: function () {
            this._inProgress && (this._step(!0), this._complete())
        }, _animate: function () {
            this._animId = y(this._animate, this), this._step()
        }, _step: function (t) {
            var e = +new Date - this._startTime, i = 1e3 * this._duration;
            e < i ? this._runFrame(this._easeOut(e / i), t) : (this._runFrame(1), this._complete())
        }, _runFrame: function (t, e) {
            t = this._startPos.add(this._offset.multiplyBy(t)), e && t._round(), S(this._el, t), this.fire("step")
        }, _complete: function () {
            r(this._animId), this._inProgress = !1, this.fire("end")
        }, _easeOut: function (t) {
            return 1 - Math.pow(1 - t, this._easeOutPower)
        }
    }), z = it.extend({
        options: {
            crs: ht,
            center: void 0,
            zoom: void 0,
            minZoom: void 0,
            maxZoom: void 0,
            layers: [],
            maxBounds: void 0,
            renderer: void 0,
            zoomAnimation: !0,
            zoomAnimationThreshold: 4,
            fadeAnimation: !0,
            markerZoomAnimation: !0,
            transform3DLimit: 8388608,
            zoomSnap: 1,
            zoomDelta: 1,
            trackResize: !0
        },
        initialize: function (t, e) {
            e = l(this, e), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(t), this._initLayout(), this._onResize = a(this._onResize, this), this._initEvents(), e.maxBounds && this.setMaxBounds(e.maxBounds), void 0 !== e.zoom && (this._zoom = this._limitZoom(e.zoom)), e.center && void 0 !== e.zoom && this.setView(b(e.center), e.zoom, {reset: !0}), this.callInitHooks(), this._zoomAnimated = re && w.any3d && !w.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), k(this._proxy, ae, this._catchTransitionEnd, this)), this._addLayers(this.options.layers)
        },
        setView: function (t, e, i) {
            return (e = void 0 === e ? this._zoom : this._limitZoom(e), t = this._limitCenter(b(t), e, this.options.maxBounds), i = i || {}, this._stop(), this._loaded && !i.reset && !0 !== i && (void 0 !== i.animate && (i.zoom = h({animate: i.animate}, i.zoom), i.pan = h({
                animate: i.animate,
                duration: i.duration
            }, i.pan)), this._zoom !== e ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, e, i.zoom) : this._tryAnimatedPan(t, i.pan))) ? clearTimeout(this._sizeTimer) : this._resetView(t, e, i.pan && i.pan.noMoveStart), this
        },
        setZoom: function (t, e) {
            return this._loaded ? this.setView(this.getCenter(), t, {zoom: e}) : (this._zoom = t, this)
        },
        zoomIn: function (t, e) {
            return t = t || (w.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, e)
        },
        zoomOut: function (t, e) {
            return t = t || (w.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, e)
        },
        setZoomAround: function (t, e, i) {
            var n = this.getZoomScale(e), o = this.getSize().divideBy(2),
                t = (t instanceof f ? t : this.latLngToContainerPoint(t)).subtract(o).multiplyBy(1 - 1 / n),
                n = this.containerPointToLatLng(o.add(t));
            return this.setView(n, e, {zoom: i})
        },
        _getBoundsCenterZoom: function (t, e) {
            e = e || {}, t = t.getBounds ? t.getBounds() : g(t);
            var i = m(e.paddingTopLeft || e.padding || [0, 0]), n = m(e.paddingBottomRight || e.padding || [0, 0]),
                o = this.getBoundsZoom(t, !1, i.add(n));
            return (o = "number" == typeof e.maxZoom ? Math.min(e.maxZoom, o) : o) === 1 / 0 ? {
                center: t.getCenter(),
                zoom: o
            } : (e = n.subtract(i).divideBy(2), n = this.project(t.getSouthWest(), o), i = this.project(t.getNorthEast(), o), {
                center: this.unproject(n.add(i).divideBy(2).add(e), o),
                zoom: o
            })
        },
        fitBounds: function (t, e) {
            if ((t = g(t)).isValid()) return t = this._getBoundsCenterZoom(t, e), this.setView(t.center, t.zoom, e);
            throw new Error("Bounds are not valid.")
        },
        fitWorld: function (t) {
            return this.fitBounds([[-90, -180], [90, 180]], t)
        },
        panTo: function (t, e) {
            return this.setView(t, this._zoom, {pan: e})
        },
        panBy: function (t, e) {
            var i;
            return e = e || {}, (t = m(t).round()).x || t.y ? (!0 === e.animate || this.getSize().contains(t) ? (this._panAnim || (this._panAnim = new je, this._panAnim.on({
                step: this._onPanTransitionStep,
                end: this._onPanTransitionEnd
            }, this)), e.noMoveStart || this.fire("movestart"), !1 !== e.animate ? (E(this._mapPane, "leaflet-pan-anim"), i = this._getMapPanePos().subtract(t).round(), this._panAnim.run(this._mapPane, i, e.duration || .25, e.easeLinearity)) : (this._rawPanBy(t), this.fire("move").fire("moveend"))) : this._resetView(this.unproject(this.project(this.getCenter()).add(t)), this.getZoom()), this) : this.fire("moveend")
        },
        flyTo: function (o, s, t) {
            if (!1 === (t = t || {}).animate || !w.any3d) return this.setView(o, s, t);
            this._stop();
            var r = this.project(this.getCenter()), a = this.project(o), e = this.getSize(), l = this._zoom,
                h = (o = b(o), s = void 0 === s ? l : s, Math.max(e.x, e.y)), i = h * this.getZoomScale(l, s),
                u = a.distanceTo(r) || 1, c = 1.42, d = c * c;

            function n(t) {
                return t = (i * i - h * h + (t ? -1 : 1) * d * d * u * u) / (2 * (t ? i : h) * d * u), (t = Math.sqrt(t * t + 1) - t) < 1e-9 ? -18 : Math.log(t)
            }

            function p(t) {
                return (Math.exp(t) - Math.exp(-t)) / 2
            }

            function f(t) {
                return (Math.exp(t) + Math.exp(-t)) / 2
            }

            var m = n(0);
            var _ = Date.now(), g = (n(1) - m) / c, v = t.duration ? 1e3 * t.duration : 1e3 * g * .8;
            return this._moveStart(!0, t.noMoveStart), function t() {
                var e, i = (Date.now() - _) / v, n = (1 - Math.pow(1 - i, 1.5)) * g;
                i <= 1 ? (this._flyToFrame = y(t, this), this._move(this.unproject(r.add(a.subtract(r).multiplyBy((e = n, h * (f(m) * (p(e = m + c * e) / f(e)) - p(m)) / d / u))), l), this.getScaleZoom(h / (i = n, h * (f(m) / f(m + c * i))), l), {flyTo: !0})) : this._move(o, s)._moveEnd(!0)
            }.call(this), this
        },
        flyToBounds: function (t, e) {
            return t = this._getBoundsCenterZoom(t, e), this.flyTo(t.center, t.zoom, e)
        },
        setMaxBounds: function (t) {
            return t = g(t), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), t.isValid() ? (this.options.maxBounds = t, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this)
        },
        setMinZoom: function (t) {
            var e = this.options.minZoom;
            return this.options.minZoom = t, this._loaded && e !== t && (this.fire("zoomlevelschange"), this.getZoom() < this.options.minZoom) ? this.setZoom(t) : this
        },
        setMaxZoom: function (t) {
            var e = this.options.maxZoom;
            return this.options.maxZoom = t, this._loaded && e !== t && (this.fire("zoomlevelschange"), this.getZoom() > this.options.maxZoom) ? this.setZoom(t) : this
        },
        panInsideBounds: function (t, e) {
            this._enforcingBounds = !0;
            var i = this.getCenter(), t = this._limitCenter(i, this._zoom, g(t));
            return i.equals(t) || this.panTo(t, e), this._enforcingBounds = !1, this
        },
        panInside: function (t, e) {
            var i = m((e = e || {}).paddingTopLeft || e.padding || [0, 0]),
                n = m(e.paddingBottomRight || e.padding || [0, 0]), o = this.project(this.getCenter()),
                t = this.project(t), s = (i = c([(s = this.getPixelBounds()).min.add(i), s.max.subtract(n)])).getSize();
            return i.contains(t) || (this._enforcingBounds = !0, n = t.subtract(i.getCenter()), i = i.extend(t).getSize().subtract(s), o.x += n.x < 0 ? -i.x : i.x, o.y += n.y < 0 ? -i.y : i.y, this.panTo(this.unproject(o), e), this._enforcingBounds = !1), this
        },
        invalidateSize: function (t) {
            if (!this._loaded) return this;
            t = h({animate: !1, pan: !0}, !0 === t ? {animate: !0} : t);
            var e = this.getSize(), i = (this._sizeChanged = !0, this._lastCenter = null, this.getSize()),
                n = e.divideBy(2).round(), o = i.divideBy(2).round();
            return (n = n.subtract(o)).x || n.y ? (t.animate && t.pan ? this.panBy(n) : (t.pan && this._rawPanBy(n), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(a(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
                oldSize: e,
                newSize: i
            })) : this
        },
        stop: function () {
            return this.setZoom(this._limitZoom(this._zoom)), this.options.zoomSnap || this.fire("viewreset"), this._stop()
        },
        locate: function (t) {
            var e, i;
            return t = this._locateOptions = h({
                timeout: 1e4,
                watch: !1
            }, t), "geolocation" in navigator ? (e = a(this._handleGeolocationResponse, this), i = a(this._handleGeolocationError, this), t.watch ? this._locationWatchId = navigator.geolocation.watchPosition(e, i, t) : navigator.geolocation.getCurrentPosition(e, i, t)) : this._handleGeolocationError({
                code: 0,
                message: "Geolocation not supported."
            }), this
        },
        stopLocate: function () {
            return navigator.geolocation && navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this
        },
        _handleGeolocationError: function (t) {
            var e;
            this._container._leaflet_id && (e = t.code, t = t.message || (1 === e ? "permission denied" : 2 === e ? "position unavailable" : "timeout"), this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
                code: e,
                message: "Geolocation error: " + t + "."
            }))
        },
        _handleGeolocationResponse: function (t) {
            if (this._container._leaflet_id) {
                var e, i, n = new v(t.coords.latitude, t.coords.longitude), o = n.toBounds(2 * t.coords.accuracy),
                    s = this._locateOptions,
                    r = (s.setView && (e = this.getBoundsZoom(o), this.setView(n, s.maxZoom ? Math.min(e, s.maxZoom) : e)), {
                        latlng: n,
                        bounds: o,
                        timestamp: t.timestamp
                    });
                for (i in t.coords) "number" == typeof t.coords[i] && (r[i] = t.coords[i]);
                this.fire("locationfound", r)
            }
        },
        addHandler: function (t, e) {
            return e && (e = this[t] = new e(this), this._handlers.push(e), this.options[t]) && e.enable(), this
        },
        remove: function () {
            if (this._initEvents(!0), this.options.maxBounds && this.off("moveend", this._panInsideMaxBounds), this._containerId !== this._container._leaflet_id) throw new Error("Map container is being reused by another instance");
            try {
                delete this._container._leaflet_id, delete this._containerId
            } catch (t) {
                this._container._leaflet_id = void 0, this._containerId = void 0
            }
            for (var t in void 0 !== this._locationWatchId && this.stopLocate(), this._stop(), C(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (r(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload"), this._layers) this._layers[t].remove();
            for (t in this._panes) C(this._panes[t]);
            return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this
        },
        createPane: function (t, e) {
            return e = P("div", "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), e || this._mapPane), t && (this._panes[t] = e), e
        },
        getCenter: function () {
            return this._checkIfLoaded(), this._lastCenter && !this._moved() ? this._lastCenter.clone() : this.layerPointToLatLng(this._getCenterLayerPoint())
        },
        getZoom: function () {
            return this._zoom
        },
        getBounds: function () {
            var t = this.getPixelBounds();
            return new s(this.unproject(t.getBottomLeft()), this.unproject(t.getTopRight()))
        },
        getMinZoom: function () {
            return void 0 === this.options.minZoom ? this._layersMinZoom || 0 : this.options.minZoom
        },
        getMaxZoom: function () {
            return void 0 === this.options.maxZoom ? void 0 === this._layersMaxZoom ? 1 / 0 : this._layersMaxZoom : this.options.maxZoom
        },
        getBoundsZoom: function (t, e, i) {
            t = g(t), i = m(i || [0, 0]);
            var n = this.getZoom() || 0, o = this.getMinZoom(), s = this.getMaxZoom(), r = t.getNorthWest(),
                t = t.getSouthEast(), i = this.getSize().subtract(i),
                t = c(this.project(t, n), this.project(r, n)).getSize(), r = w.any3d ? this.options.zoomSnap : 1,
                a = i.x / t.x, i = i.y / t.y, t = e ? Math.max(a, i) : Math.min(a, i), n = this.getScaleZoom(t, n);
            return r && (n = Math.round(n / (r / 100)) * (r / 100), n = e ? Math.ceil(n / r) * r : Math.floor(n / r) * r), Math.max(o, Math.min(s, n))
        },
        getSize: function () {
            return this._size && !this._sizeChanged || (this._size = new f(this._container.clientWidth || 0, this._container.clientHeight || 0), this._sizeChanged = !1), this._size.clone()
        },
        getPixelBounds: function (t, e) {
            return new _(t = this._getTopLeftPoint(t, e), t.add(this.getSize()))
        },
        getPixelOrigin: function () {
            return this._checkIfLoaded(), this._pixelOrigin
        },
        getPixelWorldBounds: function (t) {
            return this.options.crs.getProjectedBounds(void 0 === t ? this.getZoom() : t)
        },
        getPane: function (t) {
            return "string" == typeof t ? this._panes[t] : t
        },
        getPanes: function () {
            return this._panes
        },
        getContainer: function () {
            return this._container
        },
        getZoomScale: function (t, e) {
            var i = this.options.crs;
            return e = void 0 === e ? this._zoom : e, i.scale(t) / i.scale(e)
        },
        getScaleZoom: function (t, e) {
            var i = this.options.crs, t = (e = void 0 === e ? this._zoom : e, i.zoom(t * i.scale(e)));
            return isNaN(t) ? 1 / 0 : t
        },
        project: function (t, e) {
            return e = void 0 === e ? this._zoom : e, this.options.crs.latLngToPoint(b(t), e)
        },
        unproject: function (t, e) {
            return e = void 0 === e ? this._zoom : e, this.options.crs.pointToLatLng(m(t), e)
        },
        layerPointToLatLng: function (t) {
            return t = m(t).add(this.getPixelOrigin()), this.unproject(t)
        },
        latLngToLayerPoint: function (t) {
            return this.project(b(t))._round()._subtract(this.getPixelOrigin())
        },
        wrapLatLng: function (t) {
            return this.options.crs.wrapLatLng(b(t))
        },
        wrapLatLngBounds: function (t) {
            return this.options.crs.wrapLatLngBounds(g(t))
        },
        distance: function (t, e) {
            return this.options.crs.distance(b(t), b(e))
        },
        containerPointToLayerPoint: function (t) {
            return m(t).subtract(this._getMapPanePos())
        },
        layerPointToContainerPoint: function (t) {
            return m(t).add(this._getMapPanePos())
        },
        containerPointToLatLng: function (t) {
            return t = this.containerPointToLayerPoint(m(t)), this.layerPointToLatLng(t)
        },
        latLngToContainerPoint: function (t) {
            return this.layerPointToContainerPoint(this.latLngToLayerPoint(b(t)))
        },
        mouseEventToContainerPoint: function (t) {
            return Ne(t, this._container)
        },
        mouseEventToLayerPoint: function (t) {
            return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t))
        },
        mouseEventToLatLng: function (t) {
            return this.layerPointToLatLng(this.mouseEventToLayerPoint(t))
        },
        _initContainer: function (t) {
            if (!(t = this._container = le(t))) throw new Error("Map container not found.");
            if (t._leaflet_id) throw new Error("Map container is already initialized.");
            k(t, "scroll", this._onScroll, this), this._containerId = d(t)
        },
        _initLayout: function () {
            var t = this._container,
                e = (this._fadeAnimated = this.options.fadeAnimation && w.any3d, E(t, "leaflet-container" + (w.touch ? " leaflet-touch" : "") + (w.retina ? " leaflet-retina" : "") + (w.ielt9 ? " leaflet-oldie" : "") + (w.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : "")), he(t, "position"));
            "absolute" !== e && "relative" !== e && "fixed" !== e && "sticky" !== e && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos()
        },
        _initPanes: function () {
            var t = this._panes = {};
            this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), S(this._mapPane, new f(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (E(t.markerPane, "leaflet-zoom-hide"), E(t.shadowPane, "leaflet-zoom-hide"))
        },
        _resetView: function (t, e, i) {
            S(this._mapPane, new f(0, 0));
            var n = !this._loaded,
                o = (this._loaded = !0, e = this._limitZoom(e), this.fire("viewprereset"), this._zoom !== e);
            this._moveStart(o, i)._move(t, e)._moveEnd(o), this.fire("viewreset"), n && this.fire("load")
        },
        _moveStart: function (t, e) {
            return t && this.fire("zoomstart"), e || this.fire("movestart"), this
        },
        _move: function (t, e, i, n) {
            void 0 === e && (e = this._zoom);
            var o = this._zoom !== e;
            return this._zoom = e, this._lastCenter = t, this._pixelOrigin = this._getNewPixelOrigin(t), n ? i && i.pinch && this.fire("zoom", i) : ((o || i && i.pinch) && this.fire("zoom", i), this.fire("move", i)), this
        },
        _moveEnd: function (t) {
            return t && this.fire("zoomend"), this.fire("moveend")
        },
        _stop: function () {
            return r(this._flyToFrame), this._panAnim && this._panAnim.stop(), this
        },
        _rawPanBy: function (t) {
            S(this._mapPane, this._getMapPanePos().subtract(t))
        },
        _getZoomSpan: function () {
            return this.getMaxZoom() - this.getMinZoom()
        },
        _panInsideMaxBounds: function () {
            this._enforcingBounds || this.panInsideBounds(this.options.maxBounds)
        },
        _checkIfLoaded: function () {
            if (!this._loaded) throw new Error("Set map center and zoom first.")
        },
        _initEvents: function (t) {
            this._targets = {};
            var e = t ? A : k;
            e((this._targets[d(this._container)] = this)._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && e(window, "resize", this._onResize, this), w.any3d && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd)
        },
        _onResize: function () {
            r(this._resizeRequest), this._resizeRequest = y(function () {
                this.invalidateSize({debounceMoveend: !0})
            }, this)
        },
        _onScroll: function () {
            this._container.scrollTop = 0, this._container.scrollLeft = 0
        },
        _onMoveEnd: function () {
            var t = this._getMapPanePos();
            Math.max(Math.abs(t.x), Math.abs(t.y)) >= this.options.transform3DLimit && this._resetView(this.getCenter(), this.getZoom())
        },
        _findEventTargets: function (t, e) {
            for (var i, n = [], o = "mouseout" === e || "mouseover" === e, s = t.target || t.srcElement, r = !1; s;) {
                if ((i = this._targets[d(s)]) && ("click" === e || "preclick" === e) && this._draggableMoved(i)) {
                    r = !0;
                    break
                }
                if (i && i.listens(e, !0)) {
                    if (o && !De(s, t)) break;
                    if (n.push(i), o) break
                }
                if (s === this._container) break;
                s = s.parentNode
            }
            return n.length || r || o || !this.listens(e, !0) ? n : [this]
        },
        _isClickDisabled: function (t) {
            for (; t && t !== this._container;) {
                if (t._leaflet_disable_click) return !0;
                t = t.parentNode
            }
        },
        _handleDOMEvent: function (t) {
            var e, i = t.target || t.srcElement;
            !this._loaded || i._leaflet_disable_events || "click" === t.type && this._isClickDisabled(i) || ("mousedown" === (e = t.type) && Le(i), this._fireDOMEvent(t, e))
        },
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: function (t, e, i) {
            "click" === t.type && ((a = h({}, t)).type = "preclick", this._fireDOMEvent(a, a.type, i));
            var n = this._findEventTargets(t, e);
            if (i) {
                for (var o = [], s = 0; s < i.length; s++) i[s].listens(e, !0) && o.push(i[s]);
                n = o.concat(n)
            }
            if (n.length) {
                "contextmenu" === e && I(t);
                var r, a = n[0], l = {originalEvent: t};
                for ("keypress" !== t.type && "keydown" !== t.type && "keyup" !== t.type && (r = a.getLatLng && (!a._radius || a._radius <= 10), l.containerPoint = r ? this.latLngToContainerPoint(a.getLatLng()) : this.mouseEventToContainerPoint(t), l.layerPoint = this.containerPointToLayerPoint(l.containerPoint), l.latlng = r ? a.getLatLng() : this.layerPointToLatLng(l.layerPoint)), s = 0; s < n.length; s++) if (n[s].fire(e, l, !0), l.originalEvent._stopped || !1 === n[s].options.bubblingMouseEvents && -1 !== q(this._mouseEvents, e)) return
            }
        },
        _draggableMoved: function (t) {
            return (t = t.dragging && t.dragging.enabled() ? t : this).dragging && t.dragging.moved() || this.boxZoom && this.boxZoom.moved()
        },
        _clearHandlers: function () {
            for (var t = 0, e = this._handlers.length; t < e; t++) this._handlers[t].disable()
        },
        whenReady: function (t, e) {
            return this._loaded ? t.call(e || this, {target: this}) : this.on("load", t, e), this
        },
        _getMapPanePos: function () {
            return ve(this._mapPane) || new f(0, 0)
        },
        _moved: function () {
            var t = this._getMapPanePos();
            return t && !t.equals([0, 0])
        },
        _getTopLeftPoint: function (t, e) {
            return (t && void 0 !== e ? this._getNewPixelOrigin(t, e) : this.getPixelOrigin()).subtract(this._getMapPanePos())
        },
        _getNewPixelOrigin: function (t, e) {
            var i = this.getSize()._divideBy(2);
            return this.project(t, e)._subtract(i)._add(this._getMapPanePos())._round()
        },
        _latLngToNewLayerPoint: function (t, e, i) {
            return i = this._getNewPixelOrigin(i, e), this.project(t, e)._subtract(i)
        },
        _latLngBoundsToNewLayerBounds: function (t, e, i) {
            return i = this._getNewPixelOrigin(i, e), c([this.project(t.getSouthWest(), e)._subtract(i), this.project(t.getNorthWest(), e)._subtract(i), this.project(t.getSouthEast(), e)._subtract(i), this.project(t.getNorthEast(), e)._subtract(i)])
        },
        _getCenterLayerPoint: function () {
            return this.containerPointToLayerPoint(this.getSize()._divideBy(2))
        },
        _getCenterOffset: function (t) {
            return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint())
        },
        _limitCenter: function (t, e, i) {
            var n, o;
            return !i || (n = this.project(t, e), o = this.getSize().divideBy(2), o = new _(n.subtract(o), n.add(o)), o = this._getBoundsOffset(o, i, e), Math.abs(o.x) <= 1 && Math.abs(o.y) <= 1) ? t : this.unproject(n.add(o), e)
        },
        _limitOffset: function (t, e) {
            var i;
            return e ? (i = new _((i = this.getPixelBounds()).min.add(t), i.max.add(t)), t.add(this._getBoundsOffset(i, e))) : t
        },
        _getBoundsOffset: function (t, e, i) {
            return i = (e = c(this.project(e.getNorthEast(), i), this.project(e.getSouthWest(), i))).min.subtract(t.min), e = e.max.subtract(t.max), new f(this._rebound(i.x, -e.x), this._rebound(i.y, -e.y))
        },
        _rebound: function (t, e) {
            return 0 < t + e ? Math.round(t - e) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(e))
        },
        _limitZoom: function (t) {
            var e = this.getMinZoom(), i = this.getMaxZoom(), n = w.any3d ? this.options.zoomSnap : 1;
            return n && (t = Math.round(t / n) * n), Math.max(e, Math.min(i, t))
        },
        _onPanTransitionStep: function () {
            this.fire("move")
        },
        _onPanTransitionEnd: function () {
            T(this._mapPane, "leaflet-pan-anim"), this.fire("moveend")
        },
        _tryAnimatedPan: function (t, e) {
            return t = this._getCenterOffset(t)._trunc(), !(!0 !== (e && e.animate) && !this.getSize().contains(t) || (this.panBy(t, e), 0))
        },
        _createAnimProxy: function () {
            var t = this._proxy = P("div", "leaflet-proxy leaflet-zoom-animated");
            this._panes.mapPane.appendChild(t), this.on("zoomanim", function (t) {
                var e = se, i = this._proxy.style[e];
                ge(this._proxy, this.project(t.center, t.zoom), this.getZoomScale(t.zoom, 1)), i === this._proxy.style[e] && this._animatingZoom && this._onZoomTransitionEnd()
            }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this)
        },
        _destroyAnimProxy: function () {
            C(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy
        },
        _animMoveEnd: function () {
            var t = this.getCenter(), e = this.getZoom();
            ge(this._proxy, this.project(t, e), this.getZoomScale(e, 1))
        },
        _catchTransitionEnd: function (t) {
            this._animatingZoom && 0 <= t.propertyName.indexOf("transform") && this._onZoomTransitionEnd()
        },
        _nothingToAnimate: function () {
            return !this._container.getElementsByClassName("leaflet-zoom-animated").length
        },
        _tryAnimatedZoom: function (t, e, i) {
            if (!this._animatingZoom) {
                if (i = i || {}, !this._zoomAnimated || !1 === i.animate || this._nothingToAnimate() || Math.abs(e - this._zoom) > this.options.zoomAnimationThreshold) return !1;
                var n = this.getZoomScale(e), n = this._getCenterOffset(t)._divideBy(1 - 1 / n);
                if (!0 !== i.animate && !this.getSize().contains(n)) return !1;
                y(function () {
                    this._moveStart(!0, i.noMoveStart || !1)._animateZoom(t, e, !0)
                }, this)
            }
            return !0
        },
        _animateZoom: function (t, e, i, n) {
            this._mapPane && (i && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = e, E(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
                center: t,
                zoom: e,
                noUpdate: n
            }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(a(this._onZoomTransitionEnd, this), 250))
        },
        _onZoomTransitionEnd: function () {
            this._animatingZoom && (this._mapPane && T(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0))
        }
    });

    function Fe(t) {
        return new B(t)
    }

    var B = et.extend({
        options: {position: "topright"}, initialize: function (t) {
            l(this, t)
        }, getPosition: function () {
            return this.options.position
        }, setPosition: function (t) {
            var e = this._map;
            return e && e.removeControl(this), this.options.position = t, e && e.addControl(this), this
        }, getContainer: function () {
            return this._container
        }, addTo: function (t) {
            this.remove(), this._map = t;
            var e = this._container = this.onAdd(t), i = this.getPosition(), t = t._controlCorners[i];
            return E(e, "leaflet-control"), -1 !== i.indexOf("bottom") ? t.insertBefore(e, t.firstChild) : t.appendChild(e), this._map.on("unload", this.remove, this), this
        }, remove: function () {
            return this._map && (C(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null), this
        }, _refocusOnMap: function (t) {
            this._map && t && 0 < t.screenX && 0 < t.screenY && this._map.getContainer().focus()
        }
    }), Ue = (z.include({
        addControl: function (t) {
            return t.addTo(this), this
        }, removeControl: function (t) {
            return t.remove(), this
        }, _initControlPos: function () {
            var i = this._controlCorners = {}, n = "leaflet-",
                o = this._controlContainer = P("div", n + "control-container", this._container);

            function t(t, e) {
                i[t + e] = P("div", n + t + " " + n + e, o)
            }

            t("top", "left"), t("top", "right"), t("bottom", "left"), t("bottom", "right")
        }, _clearControlPos: function () {
            for (var t in this._controlCorners) C(this._controlCorners[t]);
            C(this._controlContainer), delete this._controlCorners, delete this._controlContainer
        }
    }), B.extend({
        options: {
            collapsed: !0,
            position: "topright",
            autoZIndex: !0,
            hideSingleBase: !1,
            sortLayers: !1,
            sortFunction: function (t, e, i, n) {
                return i < n ? -1 : n < i ? 1 : 0
            }
        }, initialize: function (t, e, i) {
            for (var n in l(this, i), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1, t) this._addLayer(t[n], n);
            for (n in e) this._addLayer(e[n], n, !0)
        }, onAdd: function (t) {
            this._initLayout(), this._update(), (this._map = t).on("zoomend", this._checkDisabledLayers, this);
            for (var e = 0; e < this._layers.length; e++) this._layers[e].layer.on("add remove", this._onLayerChange, this);
            return this._container
        }, addTo: function (t) {
            return B.prototype.addTo.call(this, t), this._expandIfNotCollapsed()
        }, onRemove: function () {
            this._map.off("zoomend", this._checkDisabledLayers, this);
            for (var t = 0; t < this._layers.length; t++) this._layers[t].layer.off("add remove", this._onLayerChange, this)
        }, addBaseLayer: function (t, e) {
            return this._addLayer(t, e), this._map ? this._update() : this
        }, addOverlay: function (t, e) {
            return this._addLayer(t, e, !0), this._map ? this._update() : this
        }, removeLayer: function (t) {
            return t.off("add remove", this._onLayerChange, this), (t = this._getLayer(d(t))) && this._layers.splice(this._layers.indexOf(t), 1), this._map ? this._update() : this
        }, expand: function () {
            E(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
            var t = this._map.getSize().y - (this._container.offsetTop + 50);
            return t < this._section.clientHeight ? (E(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = t + "px") : T(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this
        }, collapse: function () {
            return T(this._container, "leaflet-control-layers-expanded"), this
        }, _initLayout: function () {
            var t = "leaflet-control-layers", e = this._container = P("div", t), i = this.options.collapsed,
                n = (e.setAttribute("aria-haspopup", !0), Ie(e), Ae(e), this._section = P("section", t + "-list")),
                o = (i && (this._map.on("click", this.collapse, this), k(e, {
                    mouseenter: this._expandSafely,
                    mouseleave: this.collapse
                }, this)), this._layersLink = P("a", t + "-toggle", e));
            o.href = "#", o.title = "Layers", o.setAttribute("role", "button"), k(o, {
                keydown: function (t) {
                    13 === t.keyCode && this._expandSafely()
                }, click: function (t) {
                    I(t), this._expandSafely()
                }
            }, this), i || this.expand(), this._baseLayersList = P("div", t + "-base", n), this._separator = P("div", t + "-separator", n), this._overlaysList = P("div", t + "-overlays", n), e.appendChild(n)
        }, _getLayer: function (t) {
            for (var e = 0; e < this._layers.length; e++) if (this._layers[e] && d(this._layers[e].layer) === t) return this._layers[e]
        }, _addLayer: function (t, e, i) {
            this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({
                layer: t,
                name: e,
                overlay: i
            }), this.options.sortLayers && this._layers.sort(a(function (t, e) {
                return this.options.sortFunction(t.layer, e.layer, t.name, e.name)
            }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed()
        }, _update: function () {
            if (this._container) {
                ue(this._baseLayersList), ue(this._overlaysList), this._layerControlInputs = [];
                for (var t, e, i, n = 0, o = 0; o < this._layers.length; o++) i = this._layers[o], this._addItem(i), e = e || i.overlay, t = t || !i.overlay, n += i.overlay ? 0 : 1;
                this.options.hideSingleBase && (this._baseLayersList.style.display = (t = t && 1 < n) ? "" : "none"), this._separator.style.display = e && t ? "" : "none"
            }
            return this
        }, _onLayerChange: function (t) {
            this._handlingClick || this._update();
            var e = this._getLayer(d(t.target));
            (t = e.overlay ? "add" === t.type ? "overlayadd" : "overlayremove" : "add" === t.type ? "baselayerchange" : null) && this._map.fire(t, e)
        }, _createRadioElement: function (t, e) {
            return t = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (e ? ' checked="checked"' : "") + "/>", (e = document.createElement("div")).innerHTML = t, e.firstChild
        }, _addItem: function (t) {
            var e, i = document.createElement("label"), n = this._map.hasLayer(t.layer);
            t.overlay ? ((e = document.createElement("input")).type = "checkbox", e.className = "leaflet-control-layers-selector", e.defaultChecked = n) : e = this._createRadioElement("leaflet-base-layers_" + d(this), n), this._layerControlInputs.push(e), e.layerId = d(t.layer), k(e, "click", this._onInputClick, this);
            (n = document.createElement("span")).innerHTML = " " + t.name;
            var o = document.createElement("span");
            return i.appendChild(o), o.appendChild(e), o.appendChild(n), (t.overlay ? this._overlaysList : this._baseLayersList).appendChild(i), this._checkDisabledLayers(), i
        }, _onInputClick: function () {
            if (!this._preventClick) {
                var t, e, i = this._layerControlInputs, n = [], o = [];
                this._handlingClick = !0;
                for (var s = i.length - 1; 0 <= s; s--) t = i[s], e = this._getLayer(t.layerId).layer, t.checked ? n.push(e) : t.checked || o.push(e);
                for (s = 0; s < o.length; s++) this._map.hasLayer(o[s]) && this._map.removeLayer(o[s]);
                for (s = 0; s < n.length; s++) this._map.hasLayer(n[s]) || this._map.addLayer(n[s]);
                this._handlingClick = !1, this._refocusOnMap()
            }
        }, _checkDisabledLayers: function () {
            for (var t, e, i = this._layerControlInputs, n = this._map.getZoom(), o = i.length - 1; 0 <= o; o--) t = i[o], e = this._getLayer(t.layerId).layer, t.disabled = void 0 !== e.options.minZoom && n < e.options.minZoom || void 0 !== e.options.maxZoom && n > e.options.maxZoom
        }, _expandIfNotCollapsed: function () {
            return this._map && !this.options.collapsed && this.expand(), this
        }, _expandSafely: function () {
            var t = this._section, e = (this._preventClick = !0, k(t, "click", I), this.expand(), this);
            setTimeout(function () {
                A(t, "click", I), e._preventClick = !1
            })
        }
    })), He = B.extend({
        options: {
            position: "topleft",
            zoomInText: '<span aria-hidden="true">+</span>',
            zoomInTitle: "Zoom in",
            zoomOutText: '<span aria-hidden="true">&#x2212;</span>',
            zoomOutTitle: "Zoom out"
        }, onAdd: function (t) {
            var e = "leaflet-control-zoom", i = P("div", e + " leaflet-bar"), n = this.options;
            return this._zoomInButton = this._createButton(n.zoomInText, n.zoomInTitle, e + "-in", i, this._zoomIn), this._zoomOutButton = this._createButton(n.zoomOutText, n.zoomOutTitle, e + "-out", i, this._zoomOut), this._updateDisabled(), t.on("zoomend zoomlevelschange", this._updateDisabled, this), i
        }, onRemove: function (t) {
            t.off("zoomend zoomlevelschange", this._updateDisabled, this)
        }, disable: function () {
            return this._disabled = !0, this._updateDisabled(), this
        }, enable: function () {
            return this._disabled = !1, this._updateDisabled(), this
        }, _zoomIn: function (t) {
            !this._disabled && this._map._zoom < this._map.getMaxZoom() && this._map.zoomIn(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1))
        }, _zoomOut: function (t) {
            !this._disabled && this._map._zoom > this._map.getMinZoom() && this._map.zoomOut(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1))
        }, _createButton: function (t, e, i, n, o) {
            return (i = P("a", i, n)).innerHTML = t, i.href = "#", i.title = e, i.setAttribute("role", "button"), i.setAttribute("aria-label", e), Ie(i), k(i, "click", ze), k(i, "click", o, this), k(i, "click", this._refocusOnMap, this), i
        }, _updateDisabled: function () {
            var t = this._map, e = "leaflet-disabled";
            T(this._zoomInButton, e), T(this._zoomOutButton, e), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), !this._disabled && t._zoom !== t.getMinZoom() || (E(this._zoomOutButton, e), this._zoomOutButton.setAttribute("aria-disabled", "true")), !this._disabled && t._zoom !== t.getMaxZoom() || (E(this._zoomInButton, e), this._zoomInButton.setAttribute("aria-disabled", "true"))
        }
    }), We = (z.mergeOptions({zoomControl: !0}), z.addInitHook(function () {
        this.options.zoomControl && (this.zoomControl = new He, this.addControl(this.zoomControl))
    }), B.extend({
        options: {position: "bottomleft", maxWidth: 100, metric: !0, imperial: !0}, onAdd: function (t) {
            var e = "leaflet-control-scale", i = P("div", e), n = this.options;
            return this._addScales(n, e + "-line", i), t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i
        }, onRemove: function (t) {
            t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this)
        }, _addScales: function (t, e, i) {
            t.metric && (this._mScale = P("div", e, i)), t.imperial && (this._iScale = P("div", e, i))
        }, _update: function () {
            var t = (e = this._map).getSize().y / 2,
                e = e.distance(e.containerPointToLatLng([0, t]), e.containerPointToLatLng([this.options.maxWidth, t]));
            this._updateScales(e)
        }, _updateScales: function (t) {
            this.options.metric && t && this._updateMetric(t), this.options.imperial && t && this._updateImperial(t)
        }, _updateMetric: function (t) {
            var e = this._getRoundNum(t);
            this._updateScale(this._mScale, e < 1e3 ? e + " m" : e / 1e3 + " km", e / t)
        }, _updateImperial: function (t) {
            var e, i;
            5280 < (t = 3.2808399 * t) ? (i = this._getRoundNum(e = t / 5280), this._updateScale(this._iScale, i + " mi", i / e)) : (i = this._getRoundNum(t), this._updateScale(this._iScale, i + " ft", i / t))
        }, _updateScale: function (t, e, i) {
            t.style.width = Math.round(this.options.maxWidth * i) + "px", t.innerHTML = e
        }, _getRoundNum: function (t) {
            var e = Math.pow(10, (Math.floor(t) + "").length - 1);
            return e * (10 <= (t = t / e) ? 10 : 5 <= t ? 5 : 3 <= t ? 3 : 2 <= t ? 2 : 1)
        }
    })), Ge = B.extend({
        options: {
            position: "bottomright",
            prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (w.inlineSvg ? '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg> ' : "") + "Leaflet</a>"
        }, initialize: function (t) {
            l(this, t), this._attributions = {}
        }, onAdd: function (t) {
            for (var e in (t.attributionControl = this)._container = P("div", "leaflet-control-attribution"), Ie(this._container), t._layers) t._layers[e].getAttribution && this.addAttribution(t._layers[e].getAttribution());
            return this._update(), t.on("layeradd", this._addAttribution, this), this._container
        }, onRemove: function (t) {
            t.off("layeradd", this._addAttribution, this)
        }, _addAttribution: function (t) {
            t.layer.getAttribution && (this.addAttribution(t.layer.getAttribution()), t.layer.once("remove", function () {
                this.removeAttribution(t.layer.getAttribution())
            }, this))
        }, setPrefix: function (t) {
            return this.options.prefix = t, this._update(), this
        }, addAttribution: function (t) {
            return t && (this._attributions[t] || (this._attributions[t] = 0), this._attributions[t]++, this._update()), this
        }, removeAttribution: function (t) {
            return t && this._attributions[t] && (this._attributions[t]--, this._update()), this
        }, _update: function () {
            if (this._map) {
                var t, e = [];
                for (t in this._attributions) this._attributions[t] && e.push(t);
                var i = [];
                this.options.prefix && i.push(this.options.prefix), e.length && i.push(e.join(", ")), this._container.innerHTML = i.join(' <span aria-hidden="true">|</span> ')
            }
        }
    });
    z.mergeOptions({attributionControl: !0}), z.addInitHook(function () {
        this.options.attributionControl && (new Ge).addTo(this)
    }), B.Layers = Ue, B.Zoom = He, B.Scale = We, B.Attribution = Ge, Fe.layers = function (t, e, i) {
        return new Ue(t, e, i)
    }, Fe.zoom = function (t) {
        return new He(t)
    }, Fe.scale = function (t) {
        return new We(t)
    }, Fe.attribution = function (t) {
        return new Ge(t)
    };
    (n = et.extend({
        initialize: function (t) {
            this._map = t
        }, enable: function () {
            return this._enabled || (this._enabled = !0, this.addHooks()), this
        }, disable: function () {
            return this._enabled && (this._enabled = !1, this.removeHooks()), this
        }, enabled: function () {
            return !!this._enabled
        }
    })).addTo = function (t, e) {
        return t.addHandler(e, this), this
    };
    var mt = {Events: e}, Ve = w.touch ? "touchstart mousedown" : "mousedown", qe = it.extend({
        options: {clickTolerance: 3}, initialize: function (t, e, i, n) {
            l(this, n), this._element = t, this._dragStartTarget = e || t, this._preventOutline = i
        }, enable: function () {
            this._enabled || (k(this._dragStartTarget, Ve, this._onDown, this), this._enabled = !0)
        }, disable: function () {
            this._enabled && (qe._dragging === this && this.finishDrag(!0), A(this._dragStartTarget, Ve, this._onDown, this), this._enabled = !1, this._moved = !1)
        }, _onDown: function (t) {
            var e, i;
            this._enabled && (this._moved = !1, pe(this._element, "leaflet-zoom-anim") || (t.touches && 1 !== t.touches.length ? qe._dragging === this && this.finishDrag() : qe._dragging || t.shiftKey || 1 !== t.which && 1 !== t.button && !t.touches || ((qe._dragging = this)._preventOutline && Le(this._element), ye(), ie(), this._moving) || (this.fire("down"), i = t.touches ? t.touches[0] : t, e = we(this._element), this._startPoint = new f(i.clientX, i.clientY), this._startPos = ve(this._element), this._parentScale = Pe(e), i = "mousedown" === t.type, k(document, i ? "mousemove" : "touchmove", this._onMove, this), k(document, i ? "mouseup" : "touchend touchcancel", this._onUp, this))))
        }, _onMove: function (t) {
            var e;
            this._enabled && (t.touches && 1 < t.touches.length ? this._moved = !0 : !(e = new f((e = t.touches && 1 === t.touches.length ? t.touches[0] : t).clientX, e.clientY)._subtract(this._startPoint)).x && !e.y || Math.abs(e.x) + Math.abs(e.y) < this.options.clickTolerance || (e.x /= this._parentScale.x, e.y /= this._parentScale.y, I(t), this._moved || (this.fire("dragstart"), this._moved = !0, E(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), E(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(e), this._moving = !0, this._lastEvent = t, this._updatePosition()))
        }, _updatePosition: function () {
            var t = {originalEvent: this._lastEvent};
            this.fire("predrag", t), S(this._element, this._newPos), this.fire("drag", t)
        }, _onUp: function () {
            this._enabled && this.finishDrag()
        }, finishDrag: function (t) {
            T(document.body, "leaflet-dragging"), this._lastTarget && (T(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), A(document, "mousemove touchmove", this._onMove, this), A(document, "mouseup touchend touchcancel", this._onUp, this), be(), Ce();
            var e = this._moved && this._moving;
            this._moving = !1, qe._dragging = !1, e && this.fire("dragend", {
                noInertia: t,
                distance: this._newPos.distanceTo(this._startPos)
            })
        }
    });

    function $e(t, e, i) {
        for (var n, o, s, r, a, l, h, u = [1, 4, 2, 8], c = 0, d = t.length; c < d; c++) t[c]._code = ii(t[c], e);
        for (s = 0; s < 4; s++) {
            for (l = u[s], n = [], c = 0, o = (d = t.length) - 1; c < d; o = c++) r = t[c], a = t[o], r._code & l ? a._code & l || ((h = ei(a, r, l, e, i))._code = ii(h, e), n.push(h)) : (a._code & l && ((h = ei(a, r, l, e, i))._code = ii(h, e), n.push(h)), n.push(r));
            t = n
        }
        return t
    }

    function Ye(t, e) {
        var i, n, o, s, r, a, l;
        if (!t || 0 === t.length) throw new Error("latlngs not passed");
        N(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        for (var h = b([0, 0]), u = g(t), c = (u.getNorthWest().distanceTo(u.getSouthWest()) * u.getNorthEast().distanceTo(u.getNorthWest()) < 1700 && (h = Ke(t)), t.length), d = [], p = 0; p < c; p++) {
            var f = b(t[p]);
            d.push(e.project(b([f.lat - h.lat, f.lng - h.lng])))
        }
        for (p = r = a = l = 0, i = c - 1; p < c; i = p++) s = (n = d[p]).y * (o = d[i]).x - o.y * n.x, a += (n.x + o.x) * s, l += (n.y + o.y) * s, r += 3 * s;
        return b([(u = e.unproject(m(u = 0 === r ? d[0] : [a / r, l / r]))).lat + h.lat, u.lng + h.lng])
    }

    function Ke(t) {
        for (var e = 0, i = 0, n = 0, o = 0; o < t.length; o++) {
            var s = b(t[o]);
            e += s.lat, i += s.lng, n++
        }
        return b([e / n, i / n])
    }

    var Xe, _t = {__proto__: null, clipPolygon: $e, polygonCenter: Ye, centroid: Ke};

    function Je(t, e) {
        if (e && t.length) {
            var i = t = function (t, e) {
                for (var i, n, o, s = [t[0]], r = 1, a = 0, l = t.length; r < l; r++) i = t[r], n = t[a], o = void 0, (o = n.x - i.x) * o + (n = n.y - i.y) * n > e && (s.push(t[r]), a = r);
                return a < l - 1 && s.push(t[l - 1]), s
            }(t, e *= e), n = i.length, o = new (typeof Uint8Array != void 0 + "" ? Uint8Array : Array)(n);
            o[0] = o[n - 1] = 1, function t(e, i, n, o, s) {
                for (var r, a, l = 0, h = o + 1; h <= s - 1; h++) l < (a = ni(e[h], e[o], e[s], !0)) && (r = h, l = a);
                n < l && (i[r] = 1, t(e, i, n, o, r), t(e, i, n, r, s))
            }(i, o, e, 0, n - 1);
            for (var s = [], r = 0; r < n; r++) o[r] && s.push(i[r]);
            return s
        }
        return t.slice()
    }

    function Qe(t, e, i) {
        return Math.sqrt(ni(t, e, i, !0))
    }

    function ti(t, e, i, n, o) {
        var s, r, a, l = n ? Xe : ii(t, i), h = ii(e, i);
        for (Xe = h; ;) {
            if (!(l | h)) return [t, e];
            if (l & h) return !1;
            a = ii(r = ei(t, e, s = l || h, i, o), i), s === l ? (t = r, l = a) : (e = r, h = a)
        }
    }

    function ei(t, e, i, n, o) {
        var s, r, a = e.x - t.x, e = e.y - t.y, l = n.min, n = n.max;
        return 8 & i ? (s = t.x + a * (n.y - t.y) / e, r = n.y) : 4 & i ? (s = t.x + a * (l.y - t.y) / e, r = l.y) : 2 & i ? (s = n.x, r = t.y + e * (n.x - t.x) / a) : 1 & i && (s = l.x, r = t.y + e * (l.x - t.x) / a), new f(s, r, o)
    }

    function ii(t, e) {
        var i = 0;
        return t.x < e.min.x ? i |= 1 : t.x > e.max.x && (i |= 2), t.y < e.min.y ? i |= 4 : t.y > e.max.y && (i |= 8), i
    }

    function ni(t, e, i, n) {
        var o = e.x, e = e.y, s = i.x - o, r = i.y - e, a = s * s + r * r;
        return 0 < a && (1 < (a = ((t.x - o) * s + (t.y - e) * r) / a) ? (o = i.x, e = i.y) : 0 < a && (o += s * a, e += r * a)), s = t.x - o, r = t.y - e, n ? s * s + r * r : new f(o, e)
    }

    function N(t) {
        return !u(t[0]) || "object" != typeof t[0][0] && void 0 !== t[0][0]
    }

    function oi(t) {
        return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), N(t)
    }

    function si(t, e) {
        var i, n, o, s, r, a;
        if (!t || 0 === t.length) throw new Error("latlngs not passed");
        N(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        for (var l = b([0, 0]), h = g(t), u = (h.getNorthWest().distanceTo(h.getSouthWest()) * h.getNorthEast().distanceTo(h.getNorthWest()) < 1700 && (l = Ke(t)), t.length), c = [], d = 0; d < u; d++) {
            var p = b(t[d]);
            c.push(e.project(b([p.lat - l.lat, p.lng - l.lng])))
        }
        for (i = d = 0; d < u - 1; d++) i += c[d].distanceTo(c[d + 1]) / 2;
        if (0 === i) a = c[0]; else for (n = d = 0; d < u - 1; d++) if (i < (n += r = (o = c[d]).distanceTo(s = c[d + 1]))) {
            a = [s.x - (r = (n - i) / r) * (s.x - o.x), s.y - r * (s.y - o.y)];
            break
        }
        return b([(h = e.unproject(m(a))).lat + l.lat, h.lng + l.lng])
    }

    var gt = {
            __proto__: null,
            simplify: Je,
            pointToSegmentDistance: Qe,
            closestPointOnSegment: function (t, e, i) {
                return ni(t, e, i)
            },
            clipSegment: ti,
            _getEdgeIntersection: ei,
            _getBitCode: ii,
            _sqClosestPointOnSegment: ni,
            isFlat: N,
            _flat: oi,
            polylineCenter: si
        }, bt = {
            __proto__: null,
            LonLat: vt = {
                project: function (t) {
                    return new f(t.lng, t.lat)
                }, unproject: function (t) {
                    return new v(t.y, t.x)
                }, bounds: new _([-180, -90], [180, 90])
            },
            Mercator: yt = {
                R: 6378137,
                R_MINOR: 6356752.314245179,
                bounds: new _([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),
                project: function (t) {
                    var e = Math.PI / 180, i = this.R, n = t.lat * e, o = this.R_MINOR / i,
                        s = (o = Math.sqrt(1 - o * o)) * Math.sin(n),
                        s = Math.tan(Math.PI / 4 - n / 2) / Math.pow((1 - s) / (1 + s), o / 2),
                        n = -i * Math.log(Math.max(s, 1e-10));
                    return new f(t.lng * e * i, n)
                },
                unproject: function (t) {
                    for (var e, i = 180 / Math.PI, n = this.R, o = this.R_MINOR / n, s = Math.sqrt(1 - o * o), r = Math.exp(-t.y / n), a = Math.PI / 2 - 2 * Math.atan(r), l = 0, h = .1; l < 15 && 1e-7 < Math.abs(h); l++) e = s * Math.sin(a), e = Math.pow((1 - e) / (1 + e), s / 2), a += h = Math.PI / 2 - 2 * Math.atan(r * e) - a;
                    return new v(a * i, t.x * i / n)
                }
            },
            SphericalMercator: rt
        }, xt = h({}, st, {code: "EPSG:3395", projection: yt, transformation: lt(Lt = .5 / (Math.PI * yt.R), .5, -Lt, .5)}),
        ri = h({}, st, {code: "EPSG:4326", projection: vt, transformation: lt(1 / 180, 1, -1 / 180, .5)}),
        wt = h({}, ot, {
            projection: vt, transformation: lt(1, 0, -1, 0), scale: function (t) {
                return Math.pow(2, t)
            }, zoom: function (t) {
                return Math.log(t) / Math.LN2
            }, distance: function (t, e) {
                var i = e.lng - t.lng, e = e.lat - t.lat;
                return Math.sqrt(i * i + e * e)
            }, infinite: !0
        }),
        o = (ot.Earth = st, ot.EPSG3395 = xt, ot.EPSG3857 = ht, ot.EPSG900913 = ut, ot.EPSG4326 = ri, ot.Simple = wt, it.extend({
            options: {
                pane: "overlayPane",
                attribution: null,
                bubblingMouseEvents: !0
            }, addTo: function (t) {
                return t.addLayer(this), this
            }, remove: function () {
                return this.removeFrom(this._map || this._mapToAdd)
            }, removeFrom: function (t) {
                return t && t.removeLayer(this), this
            }, getPane: function (t) {
                return this._map.getPane(t ? this.options[t] || t : this.options.pane)
            }, addInteractiveTarget: function (t) {
                return this._map._targets[d(t)] = this
            }, removeInteractiveTarget: function (t) {
                return delete this._map._targets[d(t)], this
            }, getAttribution: function () {
                return this.options.attribution
            }, _layerAdd: function (t) {
                var e, i = t.target;
                i.hasLayer(this) && (this._map = i, this._zoomAnimated = i._zoomAnimated, this.getEvents && (e = this.getEvents(), i.on(e, this), this.once("remove", function () {
                    i.off(e, this)
                }, this)), this.onAdd(i), this.fire("add"), i.fire("layeradd", {layer: this}))
            }
        })), ai = (z.include({
            addLayer: function (t) {
                var e;
                if (t._layerAdd) return e = d(t), this._layers[e] || ((this._layers[e] = t)._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t)), this;
                throw new Error("The provided object is not a Layer.")
            }, removeLayer: function (t) {
                var e = d(t);
                return this._layers[e] && (this._loaded && t.onRemove(this), delete this._layers[e], this._loaded && (this.fire("layerremove", {layer: t}), t.fire("remove")), t._map = t._mapToAdd = null), this
            }, hasLayer: function (t) {
                return d(t) in this._layers
            }, eachLayer: function (t, e) {
                for (var i in this._layers) t.call(e, this._layers[i]);
                return this
            }, _addLayers: function (t) {
                for (var e = 0, i = (t = t ? u(t) ? t : [t] : []).length; e < i; e++) this.addLayer(t[e])
            }, _addZoomLimit: function (t) {
                isNaN(t.options.maxZoom) && isNaN(t.options.minZoom) || (this._zoomBoundLayers[d(t)] = t, this._updateZoomLevels())
            }, _removeZoomLimit: function (t) {
                t = d(t), this._zoomBoundLayers[t] && (delete this._zoomBoundLayers[t], this._updateZoomLevels())
            }, _updateZoomLevels: function () {
                var t, e = 1 / 0, i = -1 / 0, n = this._getZoomSpan();
                for (t in this._zoomBoundLayers) var o = this._zoomBoundLayers[t].options, e = void 0 === o.minZoom ? e : Math.min(e, o.minZoom), i = void 0 === o.maxZoom ? i : Math.max(i, o.maxZoom);
                this._layersMaxZoom = i === -1 / 0 ? void 0 : i, this._layersMinZoom = e === 1 / 0 ? void 0 : e, n !== this._getZoomSpan() && this.fire("zoomlevelschange"), void 0 === this.options.maxZoom && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), void 0 === this.options.minZoom && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom)
            }
        }), o.extend({
            initialize: function (t, e) {
                var i, n;
                if (l(this, e), this._layers = {}, t) for (i = 0, n = t.length; i < n; i++) this.addLayer(t[i])
            }, addLayer: function (t) {
                var e = this.getLayerId(t);
                return this._layers[e] = t, this._map && this._map.addLayer(t), this
            }, removeLayer: function (t) {
                return t = t in this._layers ? t : this.getLayerId(t), this._map && this._layers[t] && this._map.removeLayer(this._layers[t]), delete this._layers[t], this
            }, hasLayer: function (t) {
                return ("number" == typeof t ? t : this.getLayerId(t)) in this._layers
            }, clearLayers: function () {
                return this.eachLayer(this.removeLayer, this)
            }, invoke: function (t) {
                var e, i, n = Array.prototype.slice.call(arguments, 1);
                for (e in this._layers) (i = this._layers[e])[t] && i[t].apply(i, n);
                return this
            }, onAdd: function (t) {
                this.eachLayer(t.addLayer, t)
            }, onRemove: function (t) {
                this.eachLayer(t.removeLayer, t)
            }, eachLayer: function (t, e) {
                for (var i in this._layers) t.call(e, this._layers[i]);
                return this
            }, getLayer: function (t) {
                return this._layers[t]
            }, getLayers: function () {
                var t = [];
                return this.eachLayer(t.push, t), t
            }, setZIndex: function (t) {
                return this.invoke("setZIndex", t)
            }, getLayerId: d
        })), li = ai.extend({
            addLayer: function (t) {
                return this.hasLayer(t) ? this : (t.addEventParent(this), ai.prototype.addLayer.call(this, t), this.fire("layeradd", {layer: t}))
            }, removeLayer: function (t) {
                return this.hasLayer(t) ? ((t = t in this._layers ? this._layers[t] : t).removeEventParent(this), ai.prototype.removeLayer.call(this, t), this.fire("layerremove", {layer: t})) : this
            }, setStyle: function (t) {
                return this.invoke("setStyle", t)
            }, bringToFront: function () {
                return this.invoke("bringToFront")
            }, bringToBack: function () {
                return this.invoke("bringToBack")
            }, getBounds: function () {
                var t, e = new s;
                for (t in this._layers) {
                    var i = this._layers[t];
                    e.extend(i.getBounds ? i.getBounds() : i.getLatLng())
                }
                return e
            }
        }), hi = et.extend({
            options: {popupAnchor: [0, 0], tooltipAnchor: [0, 0], crossOrigin: !1}, initialize: function (t) {
                l(this, t)
            }, createIcon: function (t) {
                return this._createIcon("icon", t)
            }, createShadow: function (t) {
                return this._createIcon("shadow", t)
            }, _createIcon: function (t, e) {
                var i = this._getIconUrl(t);
                if (i) return i = this._createImg(i, e && "IMG" === e.tagName ? e : null), this._setIconStyles(i, t), !this.options.crossOrigin && "" !== this.options.crossOrigin || (i.crossOrigin = !0 === this.options.crossOrigin ? "" : this.options.crossOrigin), i;
                if ("icon" === t) throw new Error("iconUrl not set in Icon options (see the docs).");
                return null
            }, _setIconStyles: function (t, e) {
                var i = this.options, n = m(n = "number" == typeof (n = i[e + "Size"]) ? [n, n] : n),
                    o = m("shadow" === e && i.shadowAnchor || i.iconAnchor || n && n.divideBy(2, !0));
                t.className = "leaflet-marker-" + e + " " + (i.className || ""), o && (t.style.marginLeft = -o.x + "px", t.style.marginTop = -o.y + "px"), n && (t.style.width = n.x + "px", t.style.height = n.y + "px")
            }, _createImg: function (t, e) {
                return (e = e || document.createElement("img")).src = t, e
            }, _getIconUrl: function (t) {
                return w.retina && this.options[t + "RetinaUrl"] || this.options[t + "Url"]
            }
        }), ui = hi.extend({
            options: {
                iconUrl: "marker-icon.png",
                iconRetinaUrl: "marker-icon-2x.png",
                shadowUrl: "marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                shadowSize: [41, 41]
            }, _getIconUrl: function (t) {
                return "string" != typeof ui.imagePath && (ui.imagePath = this._detectIconPath()), (this.options.imagePath || ui.imagePath) + hi.prototype._getIconUrl.call(this, t)
            }, _stripUrl: function (t) {
                function e(t, e, i) {
                    return (e = e.exec(t)) && e[i]
                }

                return (t = e(t, /^url\((['"])?(.+)\1\)$/, 2)) && e(t, /^(.*)marker-icon\.png$/, 1)
            }, _detectIconPath: function () {
                var t = P("div", "leaflet-default-icon-path", document.body),
                    e = he(t, "background-image") || he(t, "backgroundImage");
                return document.body.removeChild(t), this._stripUrl(e) || ((t = document.querySelector('link[href$="leaflet.css"]')) ? t.href.substring(0, t.href.length - "leaflet.css".length - 1) : "")
            }
        }), ci = n.extend({
            initialize: function (t) {
                this._marker = t
            }, addHooks: function () {
                var t = this._marker._icon;
                this._draggable || (this._draggable = new qe(t, t, !0)), this._draggable.on({
                    dragstart: this._onDragStart,
                    predrag: this._onPreDrag,
                    drag: this._onDrag,
                    dragend: this._onDragEnd
                }, this).enable(), E(t, "leaflet-marker-draggable")
            }, removeHooks: function () {
                this._draggable.off({
                    dragstart: this._onDragStart,
                    predrag: this._onPreDrag,
                    drag: this._onDrag,
                    dragend: this._onDragEnd
                }, this).disable(), this._marker._icon && T(this._marker._icon, "leaflet-marker-draggable")
            }, moved: function () {
                return this._draggable && this._draggable._moved
            }, _adjustPan: function (t) {
                var e = this._marker, i = e._map, n = this._marker.options.autoPanSpeed,
                    o = this._marker.options.autoPanPadding, s = ve(e._icon), r = i.getPixelBounds(),
                    a = i.getPixelOrigin();
                (a = c(r.min._subtract(a).add(o), r.max._subtract(a).subtract(o))).contains(s) || (o = m((Math.max(a.max.x, s.x) - a.max.x) / (r.max.x - a.max.x) - (Math.min(a.min.x, s.x) - a.min.x) / (r.min.x - a.min.x), (Math.max(a.max.y, s.y) - a.max.y) / (r.max.y - a.max.y) - (Math.min(a.min.y, s.y) - a.min.y) / (r.min.y - a.min.y)).multiplyBy(n), i.panBy(o, {animate: !1}), this._draggable._newPos._add(o), this._draggable._startPos._add(o), S(e._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = y(this._adjustPan.bind(this, t)))
            }, _onDragStart: function () {
                this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart")
            }, _onPreDrag: function (t) {
                this._marker.options.autoPan && (r(this._panRequest), this._panRequest = y(this._adjustPan.bind(this, t)))
            }, _onDrag: function (t) {
                var e = this._marker, i = e._shadow, n = ve(e._icon), o = e._map.layerPointToLatLng(n);
                i && S(i, n), e._latlng = o, t.latlng = o, t.oldLatLng = this._oldLatLng, e.fire("move", t).fire("drag", t)
            }, _onDragEnd: function (t) {
                r(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t)
            }
        }), di = o.extend({
            options: {
                icon: new ui,
                interactive: !0,
                keyboard: !0,
                title: "",
                alt: "Marker",
                zIndexOffset: 0,
                opacity: 1,
                riseOnHover: !1,
                riseOffset: 250,
                pane: "markerPane",
                shadowPane: "shadowPane",
                bubblingMouseEvents: !1,
                autoPanOnFocus: !0,
                draggable: !1,
                autoPan: !1,
                autoPanPadding: [50, 50],
                autoPanSpeed: 10
            }, initialize: function (t, e) {
                l(this, e), this._latlng = b(t)
            }, onAdd: function (t) {
                this._zoomAnimated = this._zoomAnimated && t.options.markerZoomAnimation, this._zoomAnimated && t.on("zoomanim", this._animateZoom, this), this._initIcon(), this.update()
            }, onRemove: function (t) {
                this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), delete this.dragging, this._zoomAnimated && t.off("zoomanim", this._animateZoom, this), this._removeIcon(), this._removeShadow()
            }, getEvents: function () {
                return {zoom: this.update, viewreset: this.update}
            }, getLatLng: function () {
                return this._latlng
            }, setLatLng: function (t) {
                var e = this._latlng;
                return this._latlng = b(t), this.update(), this.fire("move", {oldLatLng: e, latlng: this._latlng})
            }, setZIndexOffset: function (t) {
                return this.options.zIndexOffset = t, this.update()
            }, getIcon: function () {
                return this.options.icon
            }, setIcon: function (t) {
                return this.options.icon = t, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this
            }, getElement: function () {
                return this._icon
            }, update: function () {
                var t;
                return this._icon && this._map && (t = this._map.latLngToLayerPoint(this._latlng).round(), this._setPos(t)), this
            }, _initIcon: function () {
                var t = this.options, e = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"),
                    i = t.icon.createIcon(this._icon), n = !1;
                i !== this._icon && (this._icon && this._removeIcon(), n = !0, t.title && (i.title = t.title), "IMG" === i.tagName) && (i.alt = t.alt || ""), E(i, e), t.keyboard && (i.tabIndex = "0", i.setAttribute("role", "button")), this._icon = i, t.riseOnHover && this.on({
                    mouseover: this._bringToFront,
                    mouseout: this._resetZIndex
                }), this.options.autoPanOnFocus && k(i, "focus", this._panOnFocus, this);
                var o = !1;
                (i = t.icon.createShadow(this._shadow)) !== this._shadow && (this._removeShadow(), o = !0), i && (E(i, e), i.alt = ""), this._shadow = i, t.opacity < 1 && this._updateOpacity(), n && this.getPane().appendChild(this._icon), this._initInteraction(), i && o && this.getPane(t.shadowPane).appendChild(this._shadow)
            }, _removeIcon: function () {
                this.options.riseOnHover && this.off({
                    mouseover: this._bringToFront,
                    mouseout: this._resetZIndex
                }), this.options.autoPanOnFocus && A(this._icon, "focus", this._panOnFocus, this), C(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null
            }, _removeShadow: function () {
                this._shadow && C(this._shadow), this._shadow = null
            }, _setPos: function (t) {
                this._icon && S(this._icon, t), this._shadow && S(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex()
            }, _updateZIndex: function (t) {
                this._icon && (this._icon.style.zIndex = this._zIndex + t)
            }, _animateZoom: function (t) {
                t = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round(), this._setPos(t)
            }, _initInteraction: function () {
                var t;
                this.options.interactive && (E(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), ci) && (t = this.options.draggable, this.dragging && (t = this.dragging.enabled(), this.dragging.disable()), this.dragging = new ci(this), t) && this.dragging.enable()
            }, setOpacity: function (t) {
                return this.options.opacity = t, this._map && this._updateOpacity(), this
            }, _updateOpacity: function () {
                var t = this.options.opacity;
                this._icon && M(this._icon, t), this._shadow && M(this._shadow, t)
            }, _bringToFront: function () {
                this._updateZIndex(this.options.riseOffset)
            }, _resetZIndex: function () {
                this._updateZIndex(0)
            }, _panOnFocus: function () {
                var t, e, i = this._map;
                i && (t = (e = this.options.icon.options).iconSize ? m(e.iconSize) : m(0, 0), e = e.iconAnchor ? m(e.iconAnchor) : m(0, 0), i.panInside(this._latlng, {
                    paddingTopLeft: e,
                    paddingBottomRight: t.subtract(e)
                }))
            }, _getPopupAnchor: function () {
                return this.options.icon.options.popupAnchor
            }, _getTooltipAnchor: function () {
                return this.options.icon.options.tooltipAnchor
            }
        }), pi = o.extend({
            options: {
                stroke: !0,
                color: "#3388ff",
                weight: 3,
                opacity: 1,
                lineCap: "round",
                lineJoin: "round",
                dashArray: null,
                dashOffset: null,
                fill: !1,
                fillColor: null,
                fillOpacity: .2,
                fillRule: "evenodd",
                interactive: !0,
                bubblingMouseEvents: !0
            }, beforeAdd: function (t) {
                this._renderer = t.getRenderer(this)
            }, onAdd: function () {
                this._renderer._initPath(this), this._reset(), this._renderer._addPath(this)
            }, onRemove: function () {
                this._renderer._removePath(this)
            }, redraw: function () {
                return this._map && this._renderer._updatePath(this), this
            }, setStyle: function (t) {
                return l(this, t), this._renderer && (this._renderer._updateStyle(this), this.options.stroke) && t && Object.prototype.hasOwnProperty.call(t, "weight") && this._updateBounds(), this
            }, bringToFront: function () {
                return this._renderer && this._renderer._bringToFront(this), this
            }, bringToBack: function () {
                return this._renderer && this._renderer._bringToBack(this), this
            }, getElement: function () {
                return this._path
            }, _reset: function () {
                this._project(), this._update()
            }, _clickTolerance: function () {
                return (this.options.stroke ? this.options.weight / 2 : 0) + (this._renderer.options.tolerance || 0)
            }
        }), fi = pi.extend({
            options: {fill: !0, radius: 10}, initialize: function (t, e) {
                l(this, e), this._latlng = b(t), this._radius = this.options.radius
            }, setLatLng: function (t) {
                var e = this._latlng;
                return this._latlng = b(t), this.redraw(), this.fire("move", {oldLatLng: e, latlng: this._latlng})
            }, getLatLng: function () {
                return this._latlng
            }, setRadius: function (t) {
                return this.options.radius = this._radius = t, this.redraw()
            }, getRadius: function () {
                return this._radius
            }, setStyle: function (t) {
                var e = t && t.radius || this._radius;
                return pi.prototype.setStyle.call(this, t), this.setRadius(e), this
            }, _project: function () {
                this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds()
            }, _updateBounds: function () {
                var t = this._radius, e = this._radiusY || t, i = this._clickTolerance();
                this._pxBounds = new _(this._point.subtract(t = [t + i, e + i]), this._point.add(t))
            }, _update: function () {
                this._map && this._updatePath()
            }, _updatePath: function () {
                this._renderer._updateCircle(this)
            }, _empty: function () {
                return this._radius && !this._renderer._bounds.intersects(this._pxBounds)
            }, _containsPoint: function (t) {
                return t.distanceTo(this._point) <= this._radius + this._clickTolerance()
            }
        }), mi = fi.extend({
            initialize: function (t, e, i) {
                if (l(this, e = "number" == typeof e ? h({}, i, {radius: e}) : e), this._latlng = b(t), isNaN(this.options.radius)) throw new Error("Circle radius cannot be NaN");
                this._mRadius = this.options.radius
            }, setRadius: function (t) {
                return this._mRadius = t, this.redraw()
            }, getRadius: function () {
                return this._mRadius
            }, getBounds: function () {
                var t = [this._radius, this._radiusY || this._radius];
                return new s(this._map.layerPointToLatLng(this._point.subtract(t)), this._map.layerPointToLatLng(this._point.add(t)))
            }, setStyle: pi.prototype.setStyle, _project: function () {
                var t, e, i, n, o, s = this._latlng.lng, r = this._latlng.lat, a = this._map, l = a.options.crs;
                l.distance === st.distance ? (n = Math.PI / 180, o = this._mRadius / st.R / n, t = a.project([r + o, s]), e = a.project([r - o, s]), e = t.add(e).divideBy(2), i = a.unproject(e).lat, n = Math.acos((Math.cos(o * n) - Math.sin(r * n) * Math.sin(i * n)) / (Math.cos(r * n) * Math.cos(i * n))) / n, !isNaN(n) && 0 !== n || (n = o / Math.cos(Math.PI / 180 * r)), this._point = e.subtract(a.getPixelOrigin()), this._radius = isNaN(n) ? 0 : e.x - a.project([i, s - n]).x, this._radiusY = e.y - t.y) : (o = l.unproject(l.project(this._latlng).subtract([this._mRadius, 0])), this._point = a.latLngToLayerPoint(this._latlng), this._radius = this._point.x - a.latLngToLayerPoint(o).x), this._updateBounds()
            }
        }), _i = pi.extend({
            options: {smoothFactor: 1, noClip: !1}, initialize: function (t, e) {
                l(this, e), this._setLatLngs(t)
            }, getLatLngs: function () {
                return this._latlngs
            }, setLatLngs: function (t) {
                return this._setLatLngs(t), this.redraw()
            }, isEmpty: function () {
                return !this._latlngs.length
            }, closestLayerPoint: function (t) {
                for (var e = 1 / 0, i = null, n = ni, o = 0, s = this._parts.length; o < s; o++) for (var r = this._parts[o], a = 1, l = r.length; a < l; a++) {
                    var h, u, c = n(t, h = r[a - 1], u = r[a], !0);
                    c < e && (e = c, i = n(t, h, u))
                }
                return i && (i.distance = Math.sqrt(e)), i
            }, getCenter: function () {
                if (this._map) return si(this._defaultShape(), this._map.options.crs);
                throw new Error("Must add layer to map before using getCenter()")
            }, getBounds: function () {
                return this._bounds
            }, addLatLng: function (t, e) {
                return e = e || this._defaultShape(), t = b(t), e.push(t), this._bounds.extend(t), this.redraw()
            }, _setLatLngs: function (t) {
                this._bounds = new s, this._latlngs = this._convertLatLngs(t)
            }, _defaultShape: function () {
                return N(this._latlngs) ? this._latlngs : this._latlngs[0]
            }, _convertLatLngs: function (t) {
                for (var e = [], i = N(t), n = 0, o = t.length; n < o; n++) i ? (e[n] = b(t[n]), this._bounds.extend(e[n])) : e[n] = this._convertLatLngs(t[n]);
                return e
            }, _project: function () {
                var t = new _;
                this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t), this._bounds.isValid() && t.isValid() && (this._rawPxBounds = t, this._updateBounds())
            }, _updateBounds: function () {
                var t = new f(t = this._clickTolerance(), t);
                this._rawPxBounds && (this._pxBounds = new _([this._rawPxBounds.min.subtract(t), this._rawPxBounds.max.add(t)]))
            }, _projectLatlngs: function (t, e, i) {
                var n, o, s = t[0] instanceof v, r = t.length;
                if (s) {
                    for (o = [], n = 0; n < r; n++) o[n] = this._map.latLngToLayerPoint(t[n]), i.extend(o[n]);
                    e.push(o)
                } else for (n = 0; n < r; n++) this._projectLatlngs(t[n], e, i)
            }, _clipPoints: function () {
                var t = this._renderer._bounds;
                if (this._parts = [], this._pxBounds && this._pxBounds.intersects(t)) if (this.options.noClip) this._parts = this._rings; else for (var e, i, n, o, s = this._parts, r = 0, a = 0, l = this._rings.length; r < l; r++) for (e = 0, i = (o = this._rings[r]).length; e < i - 1; e++) (n = ti(o[e], o[e + 1], t, e, !0)) && (s[a] = s[a] || [], s[a].push(n[0]), n[1] === o[e + 1] && e !== i - 2 || (s[a].push(n[1]), a++))
            }, _simplifyPoints: function () {
                for (var t = this._parts, e = this.options.smoothFactor, i = 0, n = t.length; i < n; i++) t[i] = Je(t[i], e)
            }, _update: function () {
                this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath())
            }, _updatePath: function () {
                this._renderer._updatePoly(this)
            }, _containsPoint: function (t, e) {
                var i, n, o, s, r, a, l = this._clickTolerance();
                if (this._pxBounds && this._pxBounds.contains(t)) for (i = 0, s = this._parts.length; i < s; i++) for (n = 0, o = (r = (a = this._parts[i]).length) - 1; n < r; o = n++) if ((e || 0 !== n) && Qe(t, a[o], a[n]) <= l) return !0;
                return !1
            }
        }), gi = (_i._flat = oi, _i.extend({
            options: {fill: !0}, isEmpty: function () {
                return !this._latlngs.length || !this._latlngs[0].length
            }, getCenter: function () {
                if (this._map) return Ye(this._defaultShape(), this._map.options.crs);
                throw new Error("Must add layer to map before using getCenter()")
            }, _convertLatLngs: function (t) {
                var e = (t = _i.prototype._convertLatLngs.call(this, t)).length;
                return 2 <= e && t[0] instanceof v && t[0].equals(t[e - 1]) && t.pop(), t
            }, _setLatLngs: function (t) {
                _i.prototype._setLatLngs.call(this, t), N(this._latlngs) && (this._latlngs = [this._latlngs])
            }, _defaultShape: function () {
                return (N(this._latlngs[0]) ? this._latlngs : this._latlngs[0])[0]
            }, _clipPoints: function () {
                var t = this._renderer._bounds, e = new f(e = this.options.weight, e),
                    t = new _(t.min.subtract(e), t.max.add(e));
                if (this._parts = [], this._pxBounds && this._pxBounds.intersects(t)) if (this.options.noClip) this._parts = this._rings; else for (var i, n = 0, o = this._rings.length; n < o; n++) (i = $e(this._rings[n], t, !0)).length && this._parts.push(i)
            }, _updatePath: function () {
                this._renderer._updatePoly(this, !0)
            }, _containsPoint: function (t) {
                var e, i, n, o, s, r, a, l, h = !1;
                if (!this._pxBounds || !this._pxBounds.contains(t)) return !1;
                for (o = 0, a = this._parts.length; o < a; o++) for (s = 0, r = (l = (e = this._parts[o]).length) - 1; s < l; r = s++) i = e[s], n = e[r], i.y > t.y != n.y > t.y && t.x < (n.x - i.x) * (t.y - i.y) / (n.y - i.y) + i.x && (h = !h);
                return h || _i.prototype._containsPoint.call(this, t, !0)
            }
        })), vi = li.extend({
            initialize: function (t, e) {
                l(this, e), this._layers = {}, t && this.addData(t)
            }, addData: function (t) {
                var e, i, n, o = u(t) ? t : t.features;
                if (o) {
                    for (e = 0, i = o.length; e < i; e++) ((n = o[e]).geometries || n.geometry || n.features || n.coordinates) && this.addData(n);
                    return this
                }
                var s, r = this.options;
                return r.filter && !r.filter(t) || !(s = yi(t, r)) ? this : (s.feature = Ei(t), s.defaultOptions = s.options, this.resetStyle(s), r.onEachFeature && r.onEachFeature(t, s), this.addLayer(s))
            }, resetStyle: function (t) {
                return void 0 === t ? this.eachLayer(this.resetStyle, this) : (t.options = h({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this)
            }, setStyle: function (e) {
                return this.eachLayer(function (t) {
                    this._setLayerStyle(t, e)
                }, this)
            }, _setLayerStyle: function (t, e) {
                t.setStyle && ("function" == typeof e && (e = e(t.feature)), t.setStyle(e))
            }
        });

    function yi(t, e) {
        var i, n, o, s, r = "Feature" === t.type ? t.geometry : t, a = r ? r.coordinates : null, l = [],
            h = e && e.pointToLayer, u = e && e.coordsToLatLng || Li;
        if (!a && !r) return null;
        switch (r.type) {
            case"Point":
                return bi(h, t, i = u(a), e);
            case"MultiPoint":
                for (o = 0, s = a.length; o < s; o++) i = u(a[o]), l.push(bi(h, t, i, e));
                return new li(l);
            case"LineString":
            case"MultiLineString":
                return n = xi(a, "LineString" === r.type ? 0 : 1, u), new _i(n, e);
            case"Polygon":
            case"MultiPolygon":
                return n = xi(a, "Polygon" === r.type ? 1 : 2, u), new gi(n, e);
            case"GeometryCollection":
                for (o = 0, s = r.geometries.length; o < s; o++) {
                    var c = yi({geometry: r.geometries[o], type: "Feature", properties: t.properties}, e);
                    c && l.push(c)
                }
                return new li(l);
            case"FeatureCollection":
                for (o = 0, s = r.features.length; o < s; o++) {
                    var d = yi(r.features[o], e);
                    d && l.push(d)
                }
                return new li(l);
            default:
                throw new Error("Invalid GeoJSON object.")
        }
    }

    function bi(t, e, i, n) {
        return t ? t(e, i) : new di(i, n && n.markersInheritOptions && n)
    }

    function Li(t) {
        return new v(t[1], t[0], t[2])
    }

    function xi(t, e, i) {
        for (var n, o = [], s = 0, r = t.length; s < r; s++) n = e ? xi(t[s], e - 1, i) : (i || Li)(t[s]), o.push(n);
        return o
    }

    function wi(t, e) {
        return void 0 !== (t = b(t)).alt ? [i(t.lng, e), i(t.lat, e), i(t.alt, e)] : [i(t.lng, e), i(t.lat, e)]
    }

    function Pi(t, e, i, n) {
        for (var o = [], s = 0, r = t.length; s < r; s++) o.push(e ? Pi(t[s], N(t[s]) ? 0 : e - 1, i, n) : wi(t[s], n));
        return !e && i && 0 < o.length && o.push(o[0].slice()), o
    }

    function Ci(t, e) {
        return t.feature ? h({}, t.feature, {geometry: e}) : Ei(e)
    }

    function Ei(t) {
        return "Feature" === t.type || "FeatureCollection" === t.type ? t : {
            type: "Feature",
            properties: {},
            geometry: t
        }
    }

    function Ti(t, e) {
        return new vi(t, e)
    }

    di.include(Pt = {
        toGeoJSON: function (t) {
            return Ci(this, {type: "Point", coordinates: wi(this.getLatLng(), t)})
        }
    }), mi.include(Pt), fi.include(Pt), _i.include({
        toGeoJSON: function (t) {
            var e = !N(this._latlngs);
            return Ci(this, {type: (e ? "Multi" : "") + "LineString", coordinates: Pi(this._latlngs, e ? 1 : 0, !1, t)})
        }
    }), gi.include({
        toGeoJSON: function (t) {
            var e = !N(this._latlngs), i = e && !N(this._latlngs[0]), t = Pi(this._latlngs, i ? 2 : e ? 1 : 0, !0, t);
            return Ci(this, {type: (i ? "Multi" : "") + "Polygon", coordinates: t = e ? t : [t]})
        }
    }), ai.include({
        toMultiPoint: function (e) {
            var i = [];
            return this.eachLayer(function (t) {
                i.push(t.toGeoJSON(e).geometry.coordinates)
            }), Ci(this, {type: "MultiPoint", coordinates: i})
        }, toGeoJSON: function (e) {
            var i, n, t = this.feature && this.feature.geometry && this.feature.geometry.type;
            return "MultiPoint" === t ? this.toMultiPoint(e) : (i = "GeometryCollection" === t, n = [], this.eachLayer(function (t) {
                t.toGeoJSON && (t = t.toGeoJSON(e), i ? n.push(t.geometry) : "FeatureCollection" === (t = Ei(t)).type ? n.push.apply(n, t.features) : n.push(t))
            }), i ? Ci(this, {geometries: n, type: "GeometryCollection"}) : {type: "FeatureCollection", features: n})
        }
    });
    var Ct = Ti, Mi = o.extend({
        options: {opacity: 1, alt: "", interactive: !1, crossOrigin: !1, errorOverlayUrl: "", zIndex: 1, className: ""},
        initialize: function (t, e, i) {
            this._url = t, this._bounds = g(e), l(this, i)
        },
        onAdd: function () {
            this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (E(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset()
        },
        onRemove: function () {
            C(this._image), this.options.interactive && this.removeInteractiveTarget(this._image)
        },
        setOpacity: function (t) {
            return this.options.opacity = t, this._image && this._updateOpacity(), this
        },
        setStyle: function (t) {
            return t.opacity && this.setOpacity(t.opacity), this
        },
        bringToFront: function () {
            return this._map && ce(this._image), this
        },
        bringToBack: function () {
            return this._map && de(this._image), this
        },
        setUrl: function (t) {
            return this._url = t, this._image && (this._image.src = t), this
        },
        setBounds: function (t) {
            return this._bounds = g(t), this._map && this._reset(), this
        },
        getEvents: function () {
            var t = {zoom: this._reset, viewreset: this._reset};
            return this._zoomAnimated && (t.zoomanim = this._animateZoom), t
        },
        setZIndex: function (t) {
            return this.options.zIndex = t, this._updateZIndex(), this
        },
        getBounds: function () {
            return this._bounds
        },
        getElement: function () {
            return this._image
        },
        _initImage: function () {
            var t = "IMG" === this._url.tagName, e = this._image = t ? this._url : P("img");
            E(e, "leaflet-image-layer"), this._zoomAnimated && E(e, "leaflet-zoom-animated"), this.options.className && E(e, this.options.className), e.onselectstart = p, e.onmousemove = p, e.onload = a(this.fire, this, "load"), e.onerror = a(this._overlayOnError, this, "error"), !this.options.crossOrigin && "" !== this.options.crossOrigin || (e.crossOrigin = !0 === this.options.crossOrigin ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), t ? this._url = e.src : (e.src = this._url, e.alt = this.options.alt)
        },
        _animateZoom: function (t) {
            var e = this._map.getZoomScale(t.zoom),
                t = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;
            ge(this._image, t, e)
        },
        _reset: function () {
            var t = this._image,
                e = new _(this._map.latLngToLayerPoint(this._bounds.getNorthWest()), this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
                i = e.getSize();
            S(t, e.min), t.style.width = i.x + "px", t.style.height = i.y + "px"
        },
        _updateOpacity: function () {
            M(this._image, this.options.opacity)
        },
        _updateZIndex: function () {
            this._image && void 0 !== this.options.zIndex && null !== this.options.zIndex && (this._image.style.zIndex = this.options.zIndex)
        },
        _overlayOnError: function () {
            this.fire("error");
            var t = this.options.errorOverlayUrl;
            t && this._url !== t && (this._url = t, this._image.src = t)
        },
        getCenter: function () {
            return this._bounds.getCenter()
        }
    }), Si = Mi.extend({
        options: {autoplay: !0, loop: !0, keepAspectRatio: !0, muted: !1, playsInline: !0},
        _initImage: function () {
            var t = "VIDEO" === this._url.tagName, e = this._image = t ? this._url : P("video");
            if (E(e, "leaflet-image-layer"), this._zoomAnimated && E(e, "leaflet-zoom-animated"), this.options.className && E(e, this.options.className), e.onselectstart = p, e.onmousemove = p, e.onloadeddata = a(this.fire, this, "load"), t) {
                for (var i = e.getElementsByTagName("source"), n = [], o = 0; o < i.length; o++) n.push(i[o].src);
                this._url = 0 < i.length ? n : [e.src]
            } else {
                u(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(e.style, "objectFit") && (e.style.objectFit = "fill"), e.autoplay = !!this.options.autoplay, e.loop = !!this.options.loop, e.muted = !!this.options.muted, e.playsInline = !!this.options.playsInline;
                for (var s = 0; s < this._url.length; s++) {
                    var r = P("source");
                    r.src = this._url[s], e.appendChild(r)
                }
            }
        }
    }), ki = Mi.extend({
        _initImage: function () {
            var t = this._image = this._url;
            E(t, "leaflet-image-layer"), this._zoomAnimated && E(t, "leaflet-zoom-animated"), this.options.className && E(t, this.options.className), t.onselectstart = p, t.onmousemove = p
        }
    }), Oi = o.extend({
        options: {interactive: !1, offset: [0, 0], className: "", pane: void 0, content: ""},
        initialize: function (t, e) {
            t && (t instanceof v || u(t)) ? (this._latlng = b(t), l(this, e)) : (l(this, t), this._source = e), this.options.content && (this._content = this.options.content)
        },
        openOn: function (t) {
            return (t = arguments.length ? t : this._source._map).hasLayer(this) || t.addLayer(this), this
        },
        close: function () {
            return this._map && this._map.removeLayer(this), this
        },
        toggle: function (t) {
            return this._map ? this.close() : (arguments.length ? this._source = t : t = this._source, this._prepareOpen(), this.openOn(t._map)), this
        },
        onAdd: function (t) {
            this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && M(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && M(this._container, 1), this.bringToFront(), this.options.interactive && (E(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container))
        },
        onRemove: function (t) {
            t._fadeAnimated ? (M(this._container, 0), this._removeTimeout = setTimeout(a(C, void 0, this._container), 200)) : C(this._container), this.options.interactive && (T(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container))
        },
        getLatLng: function () {
            return this._latlng
        },
        setLatLng: function (t) {
            return this._latlng = b(t), this._map && (this._updatePosition(), this._adjustPan()), this
        },
        getContent: function () {
            return this._content
        },
        setContent: function (t) {
            return this._content = t, this.update(), this
        },
        getElement: function () {
            return this._container
        },
        update: function () {
            this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan())
        },
        getEvents: function () {
            var t = {zoom: this._updatePosition, viewreset: this._updatePosition};
            return this._zoomAnimated && (t.zoomanim = this._animateZoom), t
        },
        isOpen: function () {
            return !!this._map && this._map.hasLayer(this)
        },
        bringToFront: function () {
            return this._map && ce(this._container), this
        },
        bringToBack: function () {
            return this._map && de(this._container), this
        },
        _prepareOpen: function (t) {
            if (!(i = this._source)._map) return !1;
            if (i instanceof li) {
                var e, i = null, n = this._source._layers;
                for (e in n) if (n[e]._map) {
                    i = n[e];
                    break
                }
                if (!i) return !1;
                this._source = i
            }
            if (!t) if (i.getCenter) t = i.getCenter(); else if (i.getLatLng) t = i.getLatLng(); else {
                if (!i.getBounds) throw new Error("Unable to get source layer LatLng.");
                t = i.getBounds().getCenter()
            }
            return this.setLatLng(t), this._map && this.update(), !0
        },
        _updateContent: function () {
            if (this._content) {
                var t = this._contentNode,
                    e = "function" == typeof this._content ? this._content(this._source || this) : this._content;
                if ("string" == typeof e) t.innerHTML = e; else {
                    for (; t.hasChildNodes();) t.removeChild(t.firstChild);
                    t.appendChild(e)
                }
                this.fire("contentupdate")
            }
        },
        _updatePosition: function () {
            var t, e, i;
            this._map && (e = this._map.latLngToLayerPoint(this._latlng), t = m(this.options.offset), i = this._getAnchor(), this._zoomAnimated ? S(this._container, e.add(i)) : t = t.add(e).add(i), e = this._containerBottom = -t.y, i = this._containerLeft = -Math.round(this._containerWidth / 2) + t.x, this._container.style.bottom = e + "px", this._container.style.left = i + "px")
        },
        _getAnchor: function () {
            return [0, 0]
        }
    }), Ai = (z.include({
        _initOverlay: function (t, e, i, n) {
            var o = e;
            return o instanceof t || (o = new t(n).setContent(e)), i && o.setLatLng(i), o
        }
    }), o.include({
        _initOverlay: function (t, e, i, n) {
            var o = i;
            return o instanceof t ? (l(o, n), o._source = this) : (o = e && !n ? e : new t(n, this)).setContent(i), o
        }
    }), Oi.extend({
        options: {
            pane: "popupPane",
            offset: [0, 7],
            maxWidth: 300,
            minWidth: 50,
            maxHeight: null,
            autoPan: !0,
            autoPanPaddingTopLeft: null,
            autoPanPaddingBottomRight: null,
            autoPanPadding: [5, 5],
            keepInView: !1,
            closeButton: !0,
            autoClose: !0,
            closeOnEscapeKey: !0,
            className: ""
        }, openOn: function (t) {
            return !(t = arguments.length ? t : this._source._map).hasLayer(this) && t._popup && t._popup.options.autoClose && t.removeLayer(t._popup), t._popup = this, Oi.prototype.openOn.call(this, t)
        }, onAdd: function (t) {
            Oi.prototype.onAdd.call(this, t), t.fire("popupopen", {popup: this}), this._source && (this._source.fire("popupopen", {popup: this}, !0), this._source instanceof pi || this._source.on("preclick", Oe))
        }, onRemove: function (t) {
            Oi.prototype.onRemove.call(this, t), t.fire("popupclose", {popup: this}), this._source && (this._source.fire("popupclose", {popup: this}, !0), this._source instanceof pi || this._source.off("preclick", Oe))
        }, getEvents: function () {
            var t = Oi.prototype.getEvents.call(this);
            return (void 0 !== this.options.closeOnClick ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this.close), this.options.keepInView && (t.moveend = this._adjustPan), t
        }, _initLayout: function () {
            var t = "leaflet-popup",
                e = this._container = P("div", t + " " + (this.options.className || "") + " leaflet-zoom-animated"),
                i = this._wrapper = P("div", t + "-content-wrapper", e);
            this._contentNode = P("div", t + "-content", i), Ie(e), Ae(this._contentNode), k(e, "contextmenu", Oe), this._tipContainer = P("div", t + "-tip-container", e), this._tip = P("div", t + "-tip", this._tipContainer), this.options.closeButton && ((i = this._closeButton = P("a", t + "-close-button", e)).setAttribute("role", "button"), i.setAttribute("aria-label", "Close popup"), i.href = "#close", i.innerHTML = '<span aria-hidden="true">&#215;</span>', k(i, "click", function (t) {
                I(t), this.close()
            }, this))
        }, _updateLayout: function () {
            var t = this._contentNode, e = t.style, i = (e.width = "", e.whiteSpace = "nowrap", t.offsetWidth),
                i = Math.min(i, this.options.maxWidth),
                i = (i = Math.max(i, this.options.minWidth), e.width = i + 1 + "px", e.whiteSpace = "", e.height = "", t.offsetHeight),
                n = this.options.maxHeight;
            (n && n < i ? (e.height = n + "px", E) : T)(t, "leaflet-popup-scrolled"), this._containerWidth = this._container.offsetWidth
        }, _animateZoom: function (t) {
            var t = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center), e = this._getAnchor();
            S(this._container, t.add(e))
        }, _adjustPan: function () {
            var t, e, i, n, o, s, r, a;
            this.options.autoPan && (this._map._panAnim && this._map._panAnim.stop(), this._autopanning ? this._autopanning = !1 : (t = this._map, e = parseInt(he(this._container, "marginBottom"), 10) || 0, e = this._container.offsetHeight + e, a = this._containerWidth, (i = new f(this._containerLeft, -e - this._containerBottom))._add(ve(this._container)), i = t.layerPointToContainerPoint(i), o = m(this.options.autoPanPadding), n = m(this.options.autoPanPaddingTopLeft || o), o = m(this.options.autoPanPaddingBottomRight || o), s = t.getSize(), r = 0, i.x + a + o.x > s.x && (r = i.x + a - s.x + o.x), i.x - r - n.x < (a = 0) && (r = i.x - n.x), i.y + e + o.y > s.y && (a = i.y + e - s.y + o.y), i.y - a - n.y < 0 && (a = i.y - n.y), (r || a) && (this.options.keepInView && (this._autopanning = !0), t.fire("autopanstart").panBy([r, a]))))
        }, _getAnchor: function () {
            return m(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0])
        }
    })), Ii = (z.mergeOptions({closePopupOnClick: !0}), z.include({
        openPopup: function (t, e, i) {
            return this._initOverlay(Ai, t, e, i).openOn(this), this
        }, closePopup: function (t) {
            return (t = arguments.length ? t : this._popup) && t.close(), this
        }
    }), o.include({
        bindPopup: function (t, e) {
            return this._popup = this._initOverlay(Ai, this._popup, t, e), this._popupHandlersAdded || (this.on({
                click: this._openPopup,
                keypress: this._onKeyPress,
                remove: this.closePopup,
                move: this._movePopup
            }), this._popupHandlersAdded = !0), this
        }, unbindPopup: function () {
            return this._popup && (this.off({
                click: this._openPopup,
                keypress: this._onKeyPress,
                remove: this.closePopup,
                move: this._movePopup
            }), this._popupHandlersAdded = !1, this._popup = null), this
        }, openPopup: function (t) {
            return this._popup && (this instanceof li || (this._popup._source = this), this._popup._prepareOpen(t || this._latlng)) && this._popup.openOn(this._map), this
        }, closePopup: function () {
            return this._popup && this._popup.close(), this
        }, togglePopup: function () {
            return this._popup && this._popup.toggle(this), this
        }, isPopupOpen: function () {
            return !!this._popup && this._popup.isOpen()
        }, setPopupContent: function (t) {
            return this._popup && this._popup.setContent(t), this
        }, getPopup: function () {
            return this._popup
        }, _openPopup: function (t) {
            var e;
            this._popup && this._map && (ze(t), e = t.layer || t.target, this._popup._source !== e || e instanceof pi ? (this._popup._source = e, this.openPopup(t.latlng)) : this._map.hasLayer(this._popup) ? this.closePopup() : this.openPopup(t.latlng))
        }, _movePopup: function (t) {
            this._popup.setLatLng(t.latlng)
        }, _onKeyPress: function (t) {
            13 === t.originalEvent.keyCode && this._openPopup(t)
        }
    }), Oi.extend({
        options: {pane: "tooltipPane", offset: [0, 0], direction: "auto", permanent: !1, sticky: !1, opacity: .9},
        onAdd: function (t) {
            Oi.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", {tooltip: this}), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", {tooltip: this}, !0))
        },
        onRemove: function (t) {
            Oi.prototype.onRemove.call(this, t), t.fire("tooltipclose", {tooltip: this}), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", {tooltip: this}, !0))
        },
        getEvents: function () {
            var t = Oi.prototype.getEvents.call(this);
            return this.options.permanent || (t.preclick = this.close), t
        },
        _initLayout: function () {
            var t = "leaflet-tooltip " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
            this._contentNode = this._container = P("div", t), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + d(this))
        },
        _updateLayout: function () {
        },
        _adjustPan: function () {
        },
        _setPosition: function (t) {
            var e, i = this._map, n = this._container, o = i.latLngToContainerPoint(i.getCenter()),
                i = i.layerPointToContainerPoint(t), s = this.options.direction, r = n.offsetWidth, a = n.offsetHeight,
                l = m(this.options.offset), h = this._getAnchor(),
                i = "top" === s ? (e = r / 2, a) : "bottom" === s ? (e = r / 2, 0) : (e = "center" === s ? r / 2 : "right" === s ? 0 : "left" === s ? r : i.x < o.x ? (s = "right", 0) : (s = "left", r + 2 * (l.x + h.x)), a / 2);
            t = t.subtract(m(e, i, !0)).add(l).add(h), T(n, "leaflet-tooltip-right"), T(n, "leaflet-tooltip-left"), T(n, "leaflet-tooltip-top"), T(n, "leaflet-tooltip-bottom"), E(n, "leaflet-tooltip-" + s), S(n, t)
        },
        _updatePosition: function () {
            var t = this._map.latLngToLayerPoint(this._latlng);
            this._setPosition(t)
        },
        setOpacity: function (t) {
            this.options.opacity = t, this._container && M(this._container, t)
        },
        _animateZoom: function (t) {
            t = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center), this._setPosition(t)
        },
        _getAnchor: function () {
            return m(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0])
        }
    })), zi = (z.include({
        openTooltip: function (t, e, i) {
            return this._initOverlay(Ii, t, e, i).openOn(this), this
        }, closeTooltip: function (t) {
            return t.close(), this
        }
    }), o.include({
        bindTooltip: function (t, e) {
            return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(Ii, this._tooltip, t, e), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this
        }, unbindTooltip: function () {
            return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), this._tooltip = null), this
        }, _initTooltipInteractions: function (t) {
            var e, i;
            !t && this._tooltipHandlersAdded || (e = t ? "off" : "on", i = {
                remove: this.closeTooltip,
                move: this._moveTooltip
            }, this._tooltip.options.permanent ? i.add = this._openTooltip : (i.mouseover = this._openTooltip, i.mouseout = this.closeTooltip, i.click = this._openTooltip, this._map ? this._addFocusListeners() : i.add = this._addFocusListeners), this._tooltip.options.sticky && (i.mousemove = this._moveTooltip), this[e](i), this._tooltipHandlersAdded = !t)
        }, openTooltip: function (t) {
            return this._tooltip && (this instanceof li || (this._tooltip._source = this), this._tooltip._prepareOpen(t)) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this)), this
        }, closeTooltip: function () {
            if (this._tooltip) return this._tooltip.close()
        }, toggleTooltip: function () {
            return this._tooltip && this._tooltip.toggle(this), this
        }, isTooltipOpen: function () {
            return this._tooltip.isOpen()
        }, setTooltipContent: function (t) {
            return this._tooltip && this._tooltip.setContent(t), this
        }, getTooltip: function () {
            return this._tooltip
        }, _addFocusListeners: function () {
            this.getElement ? this._addFocusListenersOnLayer(this) : this.eachLayer && this.eachLayer(this._addFocusListenersOnLayer, this)
        }, _addFocusListenersOnLayer: function (t) {
            var e = "function" == typeof t.getElement && t.getElement();
            e && (k(e, "focus", function () {
                this._tooltip._source = t, this.openTooltip()
            }, this), k(e, "blur", this.closeTooltip, this))
        }, _setAriaDescribedByOnLayer: function (t) {
            (t = "function" == typeof t.getElement && t.getElement()) && t.setAttribute("aria-describedby", this._tooltip._container.id)
        }, _openTooltip: function (t) {
            var e;
            this._tooltip && this._map && (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag ? (this._openOnceFlag = !0, (e = this)._map.once("moveend", function () {
                e._openOnceFlag = !1, e._openTooltip(t)
            })) : (this._tooltip._source = t.layer || t.target, this.openTooltip(this._tooltip.options.sticky ? t.latlng : void 0)))
        }, _moveTooltip: function (t) {
            var e = t.latlng;
            this._tooltip.options.sticky && t.originalEvent && (t = this._map.mouseEventToContainerPoint(t.originalEvent), t = this._map.containerPointToLayerPoint(t), e = this._map.layerPointToLatLng(t)), this._tooltip.setLatLng(e)
        }
    }), hi.extend({
        options: {iconSize: [12, 12], html: !1, bgPos: null, className: "leaflet-div-icon"},
        createIcon: function (t) {
            var t = t && "DIV" === t.tagName ? t : document.createElement("div"), e = this.options;
            return e.html instanceof Element ? (ue(t), t.appendChild(e.html)) : t.innerHTML = !1 !== e.html ? e.html : "", e.bgPos && (e = m(e.bgPos), t.style.backgroundPosition = -e.x + "px " + -e.y + "px"), this._setIconStyles(t, "icon"), t
        },
        createShadow: function () {
            return null
        }
    })), Bi = (hi.Default = ui, o.extend({
        options: {
            tileSize: 256,
            opacity: 1,
            updateWhenIdle: w.mobile,
            updateWhenZooming: !0,
            updateInterval: 200,
            zIndex: 1,
            bounds: null,
            minZoom: 0,
            maxZoom: void 0,
            maxNativeZoom: void 0,
            minNativeZoom: void 0,
            noWrap: !1,
            pane: "tilePane",
            className: "",
            keepBuffer: 2
        }, initialize: function (t) {
            l(this, t)
        }, onAdd: function () {
            this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView()
        }, beforeAdd: function (t) {
            t._addZoomLimit(this)
        }, onRemove: function (t) {
            this._removeAllTiles(), C(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0
        }, bringToFront: function () {
            return this._map && (ce(this._container), this._setAutoZIndex(Math.max)), this
        }, bringToBack: function () {
            return this._map && (de(this._container), this._setAutoZIndex(Math.min)), this
        }, getContainer: function () {
            return this._container
        }, setOpacity: function (t) {
            return this.options.opacity = t, this._updateOpacity(), this
        }, setZIndex: function (t) {
            return this.options.zIndex = t, this._updateZIndex(), this
        }, isLoading: function () {
            return this._loading
        }, redraw: function () {
            var t;
            return this._map && (this._removeAllTiles(), (t = this._clampZoom(this._map.getZoom())) !== this._tileZoom && (this._tileZoom = t, this._updateLevels()), this._update()), this
        }, getEvents: function () {
            var t = {
                viewprereset: this._invalidateAll,
                viewreset: this._resetView,
                zoom: this._resetView,
                moveend: this._onMoveEnd
            };
            return this.options.updateWhenIdle || (this._onMove || (this._onMove = j(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t
        }, createTile: function () {
            return document.createElement("div")
        }, getTileSize: function () {
            var t = this.options.tileSize;
            return t instanceof f ? t : new f(t, t)
        }, _updateZIndex: function () {
            this._container && void 0 !== this.options.zIndex && null !== this.options.zIndex && (this._container.style.zIndex = this.options.zIndex)
        }, _setAutoZIndex: function (t) {
            for (var e, i = this.getPane().children, n = -t(-1 / 0, 1 / 0), o = 0, s = i.length; o < s; o++) e = i[o].style.zIndex, i[o] !== this._container && e && (n = t(n, +e));
            isFinite(n) && (this.options.zIndex = n + t(-1, 1), this._updateZIndex())
        }, _updateOpacity: function () {
            if (this._map && !w.ielt9) {
                M(this._container, this.options.opacity);
                var t, e = +new Date, i = !1, n = !1;
                for (t in this._tiles) {
                    var o, s = this._tiles[t];
                    s.current && s.loaded && (o = Math.min(1, (e - s.loaded) / 200), M(s.el, o), o < 1 ? i = !0 : (s.active ? n = !0 : this._onOpaqueTile(s), s.active = !0))
                }
                n && !this._noPrune && this._pruneTiles(), i && (r(this._fadeFrame), this._fadeFrame = y(this._updateOpacity, this))
            }
        }, _onOpaqueTile: p, _initContainer: function () {
            this._container || (this._container = P("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container))
        }, _updateLevels: function () {
            var t = this._tileZoom, e = this.options.maxZoom;
            if (void 0 !== t) {
                for (var i in this._levels) i = Number(i), this._levels[i].el.children.length || i === t ? (this._levels[i].el.style.zIndex = e - Math.abs(t - i), this._onUpdateLevel(i)) : (C(this._levels[i].el), this._removeTilesAtZoom(i), this._onRemoveLevel(i), delete this._levels[i]);
                var n = this._levels[t], o = this._map;
                return n || ((n = this._levels[t] = {}).el = P("div", "leaflet-tile-container leaflet-zoom-animated", this._container), n.el.style.zIndex = e, n.origin = o.project(o.unproject(o.getPixelOrigin()), t).round(), n.zoom = t, this._setZoomTransform(n, o.getCenter(), o.getZoom()), p(n.el.offsetWidth), this._onCreateLevel(n)), this._level = n
            }
        }, _onUpdateLevel: p, _onRemoveLevel: p, _onCreateLevel: p, _pruneTiles: function () {
            if (this._map) {
                var t, e, i, n = this._map.getZoom();
                if (n > this.options.maxZoom || n < this.options.minZoom) this._removeAllTiles(); else {
                    for (t in this._tiles) (i = this._tiles[t]).retain = i.current;
                    for (t in this._tiles) (i = this._tiles[t]).current && !i.active && (e = i.coords, this._retainParent(e.x, e.y, e.z, e.z - 5) || this._retainChildren(e.x, e.y, e.z, e.z + 2));
                    for (t in this._tiles) this._tiles[t].retain || this._removeTile(t)
                }
            }
        }, _removeTilesAtZoom: function (t) {
            for (var e in this._tiles) this._tiles[e].coords.z === t && this._removeTile(e)
        }, _removeAllTiles: function () {
            for (var t in this._tiles) this._removeTile(t)
        }, _invalidateAll: function () {
            for (var t in this._levels) C(this._levels[t].el), this._onRemoveLevel(Number(t)), delete this._levels[t];
            this._removeAllTiles(), this._tileZoom = void 0
        }, _retainParent: function (t, e, i, n) {
            var i = i - 1,
                o = ((o = new f(+(t = Math.floor(t / 2)), +(e = Math.floor(e / 2)))).z = i, this._tileCoordsToKey(o));
            return (o = this._tiles[o]) && o.active ? o.retain = !0 : (o && o.loaded && (o.retain = !0), n < i && this._retainParent(t, e, i, n))
        }, _retainChildren: function (t, e, i, n) {
            for (var o = 2 * t; o < 2 * t + 2; o++) for (var s = 2 * e; s < 2 * e + 2; s++) {
                (r = new f(o, s)).z = i + 1;
                var r = this._tileCoordsToKey(r);
                (r = this._tiles[r]) && r.active ? r.retain = !0 : (r && r.loaded && (r.retain = !0), i + 1 < n && this._retainChildren(o, s, i + 1, n))
            }
        }, _resetView: function (t) {
            t = t && (t.pinch || t.flyTo), this._setView(this._map.getCenter(), this._map.getZoom(), t, t)
        }, _animateZoom: function (t) {
            this._setView(t.center, t.zoom, !0, t.noUpdate)
        }, _clampZoom: function (t) {
            var e = this.options;
            return void 0 !== e.minNativeZoom && t < e.minNativeZoom ? e.minNativeZoom : void 0 !== e.maxNativeZoom && e.maxNativeZoom < t ? e.maxNativeZoom : t
        }, _setView: function (t, e, i, n) {
            var o = Math.round(e),
                o = void 0 !== this.options.maxZoom && o > this.options.maxZoom || void 0 !== this.options.minZoom && o < this.options.minZoom ? void 0 : this._clampZoom(o),
                s = this.options.updateWhenZooming && o !== this._tileZoom;
            n && !s || (this._tileZoom = o, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), void 0 !== o && this._update(t), i || this._pruneTiles(), this._noPrune = !!i), this._setZoomTransforms(t, e)
        }, _setZoomTransforms: function (t, e) {
            for (var i in this._levels) this._setZoomTransform(this._levels[i], t, e)
        }, _setZoomTransform: function (t, e, i) {
            var n = this._map.getZoomScale(i, t.zoom),
                e = t.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(e, i)).round();
            w.any3d ? ge(t.el, e, n) : S(t.el, e)
        }, _resetGrid: function () {
            var t = this._map, e = t.options.crs, i = this._tileSize = this.getTileSize(), n = this._tileZoom,
                o = this._map.getPixelWorldBounds(this._tileZoom);
            o && (this._globalTileRange = this._pxBoundsToTileRange(o)), this._wrapX = e.wrapLng && !this.options.noWrap && [Math.floor(t.project([0, e.wrapLng[0]], n).x / i.x), Math.ceil(t.project([0, e.wrapLng[1]], n).x / i.y)], this._wrapY = e.wrapLat && !this.options.noWrap && [Math.floor(t.project([e.wrapLat[0], 0], n).y / i.x), Math.ceil(t.project([e.wrapLat[1], 0], n).y / i.y)]
        }, _onMoveEnd: function () {
            this._map && !this._map._animatingZoom && this._update()
        }, _getTiledPixelBounds: function (t) {
            var e = (i = this._map)._animatingZoom ? Math.max(i._animateToZoom, i.getZoom()) : i.getZoom(),
                e = i.getZoomScale(e, this._tileZoom), t = i.project(t, this._tileZoom).floor(),
                i = i.getSize().divideBy(2 * e);
            return new _(t.subtract(i), t.add(i))
        }, _update: function (t) {
            if (n = this._map) {
                var e = this._clampZoom(n.getZoom());
                if (void 0 === t && (t = n.getCenter()), void 0 !== this._tileZoom) {
                    var i, n = this._getTiledPixelBounds(t), o = this._pxBoundsToTileRange(n), s = o.getCenter(),
                        r = [], n = this.options.keepBuffer,
                        a = new _(o.getBottomLeft().subtract([n, -n]), o.getTopRight().add([n, -n]));
                    if (!(isFinite(o.min.x) && isFinite(o.min.y) && isFinite(o.max.x) && isFinite(o.max.y))) throw new Error("Attempted to load an infinite number of tiles");
                    for (i in this._tiles) {
                        var l = this._tiles[i].coords;
                        l.z === this._tileZoom && a.contains(new f(l.x, l.y)) || (this._tiles[i].current = !1)
                    }
                    if (1 < Math.abs(e - this._tileZoom)) this._setView(t, e); else {
                        for (var h = o.min.y; h <= o.max.y; h++) for (var u = o.min.x; u <= o.max.x; u++) {
                            var c, d = new f(u, h);
                            d.z = this._tileZoom, this._isValidTile(d) && ((c = this._tiles[this._tileCoordsToKey(d)]) ? c.current = !0 : r.push(d))
                        }
                        if (r.sort(function (t, e) {
                            return t.distanceTo(s) - e.distanceTo(s)
                        }), 0 !== r.length) {
                            this._loading || (this._loading = !0, this.fire("loading"));
                            for (var p = document.createDocumentFragment(), u = 0; u < r.length; u++) this._addTile(r[u], p);
                            this._level.el.appendChild(p)
                        }
                    }
                }
            }
        }, _isValidTile: function (t) {
            var e = this._map.options.crs;
            if (!e.infinite) {
                var i = this._globalTileRange;
                if (!e.wrapLng && (t.x < i.min.x || t.x > i.max.x) || !e.wrapLat && (t.y < i.min.y || t.y > i.max.y)) return !1
            }
            return !this.options.bounds || (e = this._tileCoordsToBounds(t), g(this.options.bounds).overlaps(e))
        }, _keyToBounds: function (t) {
            return this._tileCoordsToBounds(this._keyToTileCoords(t))
        }, _tileCoordsToNwSe: function (t) {
            var e = this._map, i = this.getTileSize(), n = t.scaleBy(i), i = n.add(i);
            return [e.unproject(n, t.z), e.unproject(i, t.z)]
        }, _tileCoordsToBounds: function (t) {
            return t = new s((t = this._tileCoordsToNwSe(t))[0], t[1]), this.options.noWrap ? t : this._map.wrapLatLngBounds(t)
        }, _tileCoordsToKey: function (t) {
            return t.x + ":" + t.y + ":" + t.z
        }, _keyToTileCoords: function (t) {
            var e = new f(+(t = t.split(":"))[0], +t[1]);
            return e.z = +t[2], e
        }, _removeTile: function (t) {
            var e = this._tiles[t];
            e && (C(e.el), delete this._tiles[t], this.fire("tileunload", {
                tile: e.el,
                coords: this._keyToTileCoords(t)
            }))
        }, _initTile: function (t) {
            E(t, "leaflet-tile");
            var e = this.getTileSize();
            t.style.width = e.x + "px", t.style.height = e.y + "px", t.onselectstart = p, t.onmousemove = p, w.ielt9 && this.options.opacity < 1 && M(t, this.options.opacity)
        }, _addTile: function (t, e) {
            var i = this._getTilePos(t), n = this._tileCoordsToKey(t),
                o = this.createTile(this._wrapCoords(t), a(this._tileReady, this, t));
            this._initTile(o), this.createTile.length < 2 && y(a(this._tileReady, this, t, null, o)), S(o, i), this._tiles[n] = {
                el: o,
                coords: t,
                current: !0
            }, e.appendChild(o), this.fire("tileloadstart", {tile: o, coords: t})
        }, _tileReady: function (t, e, i) {
            e && this.fire("tileerror", {error: e, tile: i, coords: t});
            var n = this._tileCoordsToKey(t);
            (i = this._tiles[n]) && (i.loaded = +new Date, this._map._fadeAnimated ? (M(i.el, 0), r(this._fadeFrame), this._fadeFrame = y(this._updateOpacity, this)) : (i.active = !0, this._pruneTiles()), e || (E(i.el, "leaflet-tile-loaded"), this.fire("tileload", {
                tile: i.el,
                coords: t
            })), this._noTilesToLoad()) && (this._loading = !1, this.fire("load"), w.ielt9 || !this._map._fadeAnimated ? y(this._pruneTiles, this) : setTimeout(a(this._pruneTiles, this), 250))
        }, _getTilePos: function (t) {
            return t.scaleBy(this.getTileSize()).subtract(this._level.origin)
        }, _wrapCoords: function (t) {
            var e = new f(this._wrapX ? F(t.x, this._wrapX) : t.x, this._wrapY ? F(t.y, this._wrapY) : t.y);
            return e.z = t.z, e
        }, _pxBoundsToTileRange: function (t) {
            var e = this.getTileSize();
            return new _(t.min.unscaleBy(e).floor(), t.max.unscaleBy(e).ceil().subtract([1, 1]))
        }, _noTilesToLoad: function () {
            for (var t in this._tiles) if (!this._tiles[t].loaded) return !1;
            return !0
        }
    })), Ni = Bi.extend({
        options: {
            minZoom: 0,
            maxZoom: 18,
            subdomains: "abc",
            errorTileUrl: "",
            zoomOffset: 0,
            tms: !1,
            zoomReverse: !1,
            detectRetina: !1,
            crossOrigin: !1,
            referrerPolicy: !1
        }, initialize: function (t, e) {
            this._url = t, (e = l(this, e)).detectRetina && w.retina && 0 < e.maxZoom ? (e.tileSize = Math.floor(e.tileSize / 2), e.zoomReverse ? (e.zoomOffset--, e.minZoom = Math.min(e.maxZoom, e.minZoom + 1)) : (e.zoomOffset++, e.maxZoom = Math.max(e.minZoom, e.maxZoom - 1)), e.minZoom = Math.max(0, e.minZoom)) : e.zoomReverse ? e.minZoom = Math.min(e.maxZoom, e.minZoom) : e.maxZoom = Math.max(e.minZoom, e.maxZoom), "string" == typeof e.subdomains && (e.subdomains = e.subdomains.split("")), this.on("tileunload", this._onTileRemove)
        }, setUrl: function (t, e) {
            return this._url === t && void 0 === e && (e = !0), this._url = t, e || this.redraw(), this
        }, createTile: function (t, e) {
            var i = document.createElement("img");
            return k(i, "load", a(this._tileOnLoad, this, e, i)), k(i, "error", a(this._tileOnError, this, e, i)), !this.options.crossOrigin && "" !== this.options.crossOrigin || (i.crossOrigin = !0 === this.options.crossOrigin ? "" : this.options.crossOrigin), "string" == typeof this.options.referrerPolicy && (i.referrerPolicy = this.options.referrerPolicy), i.alt = "", i.src = this.getTileUrl(t), i
        }, getTileUrl: function (t) {
            var e = {r: w.retina ? "@2x" : "", s: this._getSubdomain(t), x: t.x, y: t.y, z: this._getZoomForUrl()};
            return this._map && !this._map.options.crs.infinite && (t = this._globalTileRange.max.y - t.y, this.options.tms && (e.y = t), e["-y"] = t), V(this._url, h(e, this.options))
        }, _tileOnLoad: function (t, e) {
            w.ielt9 ? setTimeout(a(t, this, null, e), 0) : t(null, e)
        }, _tileOnError: function (t, e, i) {
            var n = this.options.errorTileUrl;
            n && e.getAttribute("src") !== n && (e.src = n), t(i, e)
        }, _onTileRemove: function (t) {
            t.tile.onload = null
        }, _getZoomForUrl: function () {
            var t = this._tileZoom, e = this.options.maxZoom;
            return (this.options.zoomReverse ? e - t : t) + this.options.zoomOffset
        }, _getSubdomain: function (t) {
            return t = Math.abs(t.x + t.y) % this.options.subdomains.length, this.options.subdomains[t]
        }, _abortLoading: function () {
            var t, e, i;
            for (t in this._tiles) this._tiles[t].coords.z !== this._tileZoom && ((i = this._tiles[t].el).onload = p, i.onerror = p, i.complete || (i.src = $, e = this._tiles[t].coords, C(i), delete this._tiles[t], this.fire("tileabort", {
                tile: i,
                coords: e
            })))
        }, _removeTile: function (t) {
            var e = this._tiles[t];
            if (e) return e.el.setAttribute("src", $), Bi.prototype._removeTile.call(this, t)
        }, _tileReady: function (t, e, i) {
            if (this._map && (!i || i.getAttribute("src") !== $)) return Bi.prototype._tileReady.call(this, t, e, i)
        }
    });

    function Zi(t, e) {
        return new Ni(t, e)
    }

    var Ri = Ni.extend({
        defaultWmsParams: {
            service: "WMS",
            request: "GetMap",
            layers: "",
            styles: "",
            format: "image/jpeg",
            transparent: !1,
            version: "1.1.1"
        }, options: {crs: null, uppercase: !1}, initialize: function (t, e) {
            this._url = t;
            var i, n = h({}, this.defaultWmsParams);
            for (i in e) i in this.options || (n[i] = e[i]);
            var t = (e = l(this, e)).detectRetina && w.retina ? 2 : 1, o = this.getTileSize();
            n.width = o.x * t, n.height = o.y * t, this.wmsParams = n
        }, onAdd: function (t) {
            this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
            var e = 1.3 <= this._wmsVersion ? "crs" : "srs";
            this.wmsParams[e] = this._crs.code, Ni.prototype.onAdd.call(this, t)
        }, getTileUrl: function (t) {
            var e = this._tileCoordsToNwSe(t), e = (i = c((i = this._crs).project(e[0]), i.project(e[1]))).min,
                i = i.max,
                e = (1.3 <= this._wmsVersion && this._crs === ri ? [e.y, e.x, i.y, i.x] : [e.x, e.y, i.x, i.y]).join(",");
            return (i = Ni.prototype.getTileUrl.call(this, t)) + W(this.wmsParams, i, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + e
        }, setParams: function (t, e) {
            return h(this.wmsParams, t), e || this.redraw(), this
        }
    }), Di = (Ni.WMS = Ri, Zi.wms = function (t, e) {
        return new Ri(t, e)
    }, o.extend({
        options: {padding: .1}, initialize: function (t) {
            l(this, t), d(this), this._layers = this._layers || {}
        }, onAdd: function () {
            this._container || (this._initContainer(), E(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this)
        }, onRemove: function () {
            this.off("update", this._updatePaths, this), this._destroyContainer()
        }, getEvents: function () {
            var t = {viewreset: this._reset, zoom: this._onZoom, moveend: this._update, zoomend: this._onZoomEnd};
            return this._zoomAnimated && (t.zoomanim = this._onAnimZoom), t
        }, _onAnimZoom: function (t) {
            this._updateTransform(t.center, t.zoom)
        }, _onZoom: function () {
            this._updateTransform(this._map.getCenter(), this._map.getZoom())
        }, _updateTransform: function (t, e) {
            var i = this._map.getZoomScale(e, this._zoom),
                n = this._map.getSize().multiplyBy(.5 + this.options.padding), o = this._map.project(this._center, e),
                n = n.multiplyBy(-i).add(o).subtract(this._map._getNewPixelOrigin(t, e));
            w.any3d ? ge(this._container, n, i) : S(this._container, n)
        }, _reset: function () {
            for (var t in this._update(), this._updateTransform(this._center, this._zoom), this._layers) this._layers[t]._reset()
        }, _onZoomEnd: function () {
            for (var t in this._layers) this._layers[t]._project()
        }, _updatePaths: function () {
            for (var t in this._layers) this._layers[t]._update()
        }, _update: function () {
            var t = this.options.padding, e = this._map.getSize(),
                i = this._map.containerPointToLayerPoint(e.multiplyBy(-t)).round();
            this._bounds = new _(i, i.add(e.multiplyBy(1 + 2 * t)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom()
        }
    })), ji = Di.extend({
        options: {tolerance: 0}, getEvents: function () {
            var t = Di.prototype.getEvents.call(this);
            return t.viewprereset = this._onViewPreReset, t
        }, _onViewPreReset: function () {
            this._postponeUpdatePaths = !0
        }, onAdd: function () {
            Di.prototype.onAdd.call(this), this._draw()
        }, _initContainer: function () {
            var t = this._container = document.createElement("canvas");
            k(t, "mousemove", this._onMouseMove, this), k(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), k(t, "mouseout", this._handleMouseOut, this), t._leaflet_disable_events = !0, this._ctx = t.getContext("2d")
        }, _destroyContainer: function () {
            r(this._redrawRequest), delete this._ctx, C(this._container), A(this._container), delete this._container
        }, _updatePaths: function () {
            if (!this._postponeUpdatePaths) {
                for (var t in this._redrawBounds = null, this._layers) this._layers[t]._update();
                this._redraw()
            }
        }, _update: function () {
            var t, e, i, n;
            this._map._animatingZoom && this._bounds || (Di.prototype._update.call(this), t = this._bounds, e = this._container, i = t.getSize(), n = w.retina ? 2 : 1, S(e, t.min), e.width = n * i.x, e.height = n * i.y, e.style.width = i.x + "px", e.style.height = i.y + "px", w.retina && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update"))
        }, _reset: function () {
            Di.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths())
        }, _initPath: function (t) {
            this._updateDashArray(t), t = (this._layers[d(t)] = t)._order = {
                layer: t,
                prev: this._drawLast,
                next: null
            }, this._drawLast && (this._drawLast.next = t), this._drawLast = t, this._drawFirst = this._drawFirst || this._drawLast
        }, _addPath: function (t) {
            this._requestRedraw(t)
        }, _removePath: function (t) {
            var e = (i = t._order).next, i = i.prev;
            e ? e.prev = i : this._drawLast = i, i ? i.next = e : this._drawFirst = e, delete t._order, delete this._layers[d(t)], this._requestRedraw(t)
        }, _updatePath: function (t) {
            this._extendRedrawBounds(t), t._project(), t._update(), this._requestRedraw(t)
        }, _updateStyle: function (t) {
            this._updateDashArray(t), this._requestRedraw(t)
        }, _updateDashArray: function (t) {
            if ("string" == typeof t.options.dashArray) {
                for (var e, i = t.options.dashArray.split(/[, ]+/), n = [], o = 0; o < i.length; o++) {
                    if (e = Number(i[o]), isNaN(e)) return;
                    n.push(e)
                }
                t.options._dashArray = n
            } else t.options._dashArray = t.options.dashArray
        }, _requestRedraw: function (t) {
            this._map && (this._extendRedrawBounds(t), this._redrawRequest = this._redrawRequest || y(this._redraw, this))
        }, _extendRedrawBounds: function (t) {
            var e;
            t._pxBounds && (e = (t.options.weight || 0) + 1, this._redrawBounds = this._redrawBounds || new _, this._redrawBounds.extend(t._pxBounds.min.subtract([e, e])), this._redrawBounds.extend(t._pxBounds.max.add([e, e])))
        }, _redraw: function () {
            this._redrawRequest = null, this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()), this._clear(), this._draw(), this._redrawBounds = null
        }, _clear: function () {
            var t, e = this._redrawBounds;
            e ? (t = e.getSize(), this._ctx.clearRect(e.min.x, e.min.y, t.x, t.y)) : (this._ctx.save(), this._ctx.setTransform(1, 0, 0, 1, 0, 0), this._ctx.clearRect(0, 0, this._container.width, this._container.height), this._ctx.restore())
        }, _draw: function () {
            var t, e, i = this._redrawBounds;
            this._ctx.save(), i && (e = i.getSize(), this._ctx.beginPath(), this._ctx.rect(i.min.x, i.min.y, e.x, e.y), this._ctx.clip()), this._drawing = !0;
            for (var n = this._drawFirst; n; n = n.next) t = n.layer, (!i || t._pxBounds && t._pxBounds.intersects(i)) && t._updatePath();
            this._drawing = !1, this._ctx.restore()
        }, _updatePoly: function (t, e) {
            if (this._drawing) {
                var i, n, o, s, r = t._parts, a = r.length, l = this._ctx;
                if (a) {
                    for (l.beginPath(), i = 0; i < a; i++) {
                        for (n = 0, o = r[i].length; n < o; n++) s = r[i][n], l[n ? "lineTo" : "moveTo"](s.x, s.y);
                        e && l.closePath()
                    }
                    this._fillStroke(l, t)
                }
            }
        }, _updateCircle: function (t) {
            var e, i, n, o;
            this._drawing && !t._empty() && (e = t._point, i = this._ctx, n = Math.max(Math.round(t._radius), 1), 1 != (o = (Math.max(Math.round(t._radiusY), 1) || n) / n) && (i.save(), i.scale(1, o)), i.beginPath(), i.arc(e.x, e.y / o, n, 0, 2 * Math.PI, !1), 1 != o && i.restore(), this._fillStroke(i, t))
        }, _fillStroke: function (t, e) {
            var i = e.options;
            i.fill && (t.globalAlpha = i.fillOpacity, t.fillStyle = i.fillColor || i.color, t.fill(i.fillRule || "evenodd")), i.stroke && 0 !== i.weight && (t.setLineDash && t.setLineDash(e.options && e.options._dashArray || []), t.globalAlpha = i.opacity, t.lineWidth = i.weight, t.strokeStyle = i.color, t.lineCap = i.lineCap, t.lineJoin = i.lineJoin, t.stroke())
        }, _onClick: function (t) {
            for (var e, i, n = this._map.mouseEventToLayerPoint(t), o = this._drawFirst; o; o = o.next) (e = o.layer).options.interactive && e._containsPoint(n) && (("click" === t.type || "preclick" === t.type) && this._map._draggableMoved(e) || (i = e));
            this._fireEvent(!!i && [i], t)
        }, _onMouseMove: function (t) {
            var e;
            !this._map || this._map.dragging.moving() || this._map._animatingZoom || (e = this._map.mouseEventToLayerPoint(t), this._handleMouseHover(t, e))
        }, _handleMouseOut: function (t) {
            var e = this._hoveredLayer;
            e && (T(this._container, "leaflet-interactive"), this._fireEvent([e], t, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1)
        }, _handleMouseHover: function (t, e) {
            if (!this._mouseHoverThrottled) {
                for (var i, n, o = this._drawFirst; o; o = o.next) (i = o.layer).options.interactive && i._containsPoint(e) && (n = i);
                n !== this._hoveredLayer && (this._handleMouseOut(t), n) && (E(this._container, "leaflet-interactive"), this._fireEvent([n], t, "mouseover"), this._hoveredLayer = n), this._fireEvent(!!this._hoveredLayer && [this._hoveredLayer], t), this._mouseHoverThrottled = !0, setTimeout(a(function () {
                    this._mouseHoverThrottled = !1
                }, this), 32)
            }
        }, _fireEvent: function (t, e, i) {
            this._map._fireDOMEvent(e, i || e.type, t)
        }, _bringToFront: function (t) {
            var e, i, n = t._order;
            n && (e = n.next, i = n.prev, e) && ((e.prev = i) ? i.next = e : e && (this._drawFirst = e), n.prev = this._drawLast, (this._drawLast.next = n).next = null, this._drawLast = n, this._requestRedraw(t))
        }, _bringToBack: function (t) {
            var e, i, n = t._order;
            n && (e = n.next, i = n.prev) && ((i.next = e) ? e.prev = i : i && (this._drawLast = i), n.prev = null, n.next = this._drawFirst, this._drawFirst.prev = n, this._drawFirst = n, this._requestRedraw(t))
        }
    });

    function Fi(t) {
        return w.canvas ? new ji(t) : null
    }

    var Ui = function () {
        try {
            return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function (t) {
                return document.createElement("<lvml:" + t + ' class="lvml">')
            }
        } catch (t) {
        }
        return function (t) {
            return document.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')
        }
    }(), Et = {
        _initContainer: function () {
            this._container = P("div", "leaflet-vml-container")
        }, _update: function () {
            this._map._animatingZoom || (Di.prototype._update.call(this), this.fire("update"))
        }, _initPath: function (t) {
            var e = t._container = Ui("shape");
            E(e, "leaflet-vml-shape " + (this.options.className || "")), e.coordsize = "1 1", t._path = Ui("path"), e.appendChild(t._path), this._updateStyle(t), this._layers[d(t)] = t
        }, _addPath: function (t) {
            var e = t._container;
            this._container.appendChild(e), t.options.interactive && t.addInteractiveTarget(e)
        }, _removePath: function (t) {
            var e = t._container;
            C(e), t.removeInteractiveTarget(e), delete this._layers[d(t)]
        }, _updateStyle: function (t) {
            var e = t._stroke, i = t._fill, n = t.options, o = t._container;
            o.stroked = !!n.stroke, o.filled = !!n.fill, n.stroke ? (e = e || (t._stroke = Ui("stroke")), o.appendChild(e), e.weight = n.weight + "px", e.color = n.color, e.opacity = n.opacity, n.dashArray ? e.dashStyle = u(n.dashArray) ? n.dashArray.join(" ") : n.dashArray.replace(/( *, *)/g, " ") : e.dashStyle = "", e.endcap = n.lineCap.replace("butt", "flat"), e.joinstyle = n.lineJoin) : e && (o.removeChild(e), t._stroke = null), n.fill ? (i = i || (t._fill = Ui("fill")), o.appendChild(i), i.color = n.fillColor || n.color, i.opacity = n.fillOpacity) : i && (o.removeChild(i), t._fill = null)
        }, _updateCircle: function (t) {
            var e = t._point.round(), i = Math.round(t._radius), n = Math.round(t._radiusY || i);
            this._setPath(t, t._empty() ? "M0 0" : "AL " + e.x + "," + e.y + " " + i + "," + n + " 0,23592600")
        }, _setPath: function (t, e) {
            t._path.v = e
        }, _bringToFront: function (t) {
            ce(t._container)
        }, _bringToBack: function (t) {
            de(t._container)
        }
    }, Hi = w.vml ? Ui : ct, Wi = Di.extend({
        _initContainer: function () {
            this._container = Hi("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Hi("g"), this._container.appendChild(this._rootGroup)
        }, _destroyContainer: function () {
            C(this._container), A(this._container), delete this._container, delete this._rootGroup, delete this._svgSize
        }, _update: function () {
            var t, e, i;
            this._map._animatingZoom && this._bounds || (Di.prototype._update.call(this), e = (t = this._bounds).getSize(), i = this._container, this._svgSize && this._svgSize.equals(e) || (this._svgSize = e, i.setAttribute("width", e.x), i.setAttribute("height", e.y)), S(i, t.min), i.setAttribute("viewBox", [t.min.x, t.min.y, e.x, e.y].join(" ")), this.fire("update"))
        }, _initPath: function (t) {
            var e = t._path = Hi("path");
            t.options.className && E(e, t.options.className), t.options.interactive && E(e, "leaflet-interactive"), this._updateStyle(t), this._layers[d(t)] = t
        }, _addPath: function (t) {
            this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path)
        }, _removePath: function (t) {
            C(t._path), t.removeInteractiveTarget(t._path), delete this._layers[d(t)]
        }, _updatePath: function (t) {
            t._project(), t._update()
        }, _updateStyle: function (t) {
            var e = t._path, t = t.options;
            e && (t.stroke ? (e.setAttribute("stroke", t.color), e.setAttribute("stroke-opacity", t.opacity), e.setAttribute("stroke-width", t.weight), e.setAttribute("stroke-linecap", t.lineCap), e.setAttribute("stroke-linejoin", t.lineJoin), t.dashArray ? e.setAttribute("stroke-dasharray", t.dashArray) : e.removeAttribute("stroke-dasharray"), t.dashOffset ? e.setAttribute("stroke-dashoffset", t.dashOffset) : e.removeAttribute("stroke-dashoffset")) : e.setAttribute("stroke", "none"), t.fill ? (e.setAttribute("fill", t.fillColor || t.color), e.setAttribute("fill-opacity", t.fillOpacity), e.setAttribute("fill-rule", t.fillRule || "evenodd")) : e.setAttribute("fill", "none"))
        }, _updatePoly: function (t, e) {
            this._setPath(t, dt(t._parts, e))
        }, _updateCircle: function (t) {
            var e = t._point, i = Math.max(Math.round(t._radius), 1),
                n = "a" + i + "," + (Math.max(Math.round(t._radiusY), 1) || i) + " 0 1,0 ",
                e = t._empty() ? "M0 0" : "M" + (e.x - i) + "," + e.y + n + 2 * i + ",0 " + n + 2 * -i + ",0 ";
            this._setPath(t, e)
        }, _setPath: function (t, e) {
            t._path.setAttribute("d", e)
        }, _bringToFront: function (t) {
            ce(t._path)
        }, _bringToBack: function (t) {
            de(t._path)
        }
    });

    function Gi(t) {
        return w.svg || w.vml ? new Wi(t) : null
    }

    w.vml && Wi.include(Et), z.include({
        getRenderer: function (t) {
            return t = (t = t.options.renderer || this._getPaneRenderer(t.options.pane) || this.options.renderer || this._renderer) || (this._renderer = this._createRenderer()), this.hasLayer(t) || this.addLayer(t), t
        }, _getPaneRenderer: function (t) {
            var e;
            return "overlayPane" !== t && void 0 !== t && (void 0 === (e = this._paneRenderers[t]) && (e = this._createRenderer({pane: t}), this._paneRenderers[t] = e), e)
        }, _createRenderer: function (t) {
            return this.options.preferCanvas && Fi(t) || Gi(t)
        }
    });
    var Vi = gi.extend({
            initialize: function (t, e) {
                gi.prototype.initialize.call(this, this._boundsToLatLngs(t), e)
            }, setBounds: function (t) {
                return this.setLatLngs(this._boundsToLatLngs(t))
            }, _boundsToLatLngs: function (t) {
                return [(t = g(t)).getSouthWest(), t.getNorthWest(), t.getNorthEast(), t.getSouthEast()]
            }
        }),
        pt = (Wi.create = Hi, Wi.pointsToPath = dt, vi.geometryToLayer = yi, vi.coordsToLatLng = Li, vi.coordsToLatLngs = xi, vi.latLngToCoords = wi, vi.latLngsToCoords = Pi, vi.getFeature = Ci, vi.asFeature = Ei, z.mergeOptions({boxZoom: !0}), n.extend({
            initialize: function (t) {
                this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this)
            }, addHooks: function () {
                k(this._container, "mousedown", this._onMouseDown, this)
            }, removeHooks: function () {
                A(this._container, "mousedown", this._onMouseDown, this)
            }, moved: function () {
                return this._moved
            }, _destroy: function () {
                C(this._pane), delete this._pane
            }, _resetState: function () {
                this._resetStateTimeout = 0, this._moved = !1
            }, _clearDeferredResetState: function () {
                0 !== this._resetStateTimeout && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0)
            }, _onMouseDown: function (t) {
                if (!t.shiftKey || 1 !== t.which && 1 !== t.button) return !1;
                this._clearDeferredResetState(), this._resetState(), ie(), ye(), this._startPoint = this._map.mouseEventToContainerPoint(t), k(document, {
                    contextmenu: ze,
                    mousemove: this._onMouseMove,
                    mouseup: this._onMouseUp,
                    keydown: this._onKeyDown
                }, this)
            }, _onMouseMove: function (t) {
                this._moved || (this._moved = !0, this._box = P("div", "leaflet-zoom-box", this._container), E(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);
                var e = (t = new _(this._point, this._startPoint)).getSize();
                S(this._box, t.min), this._box.style.width = e.x + "px", this._box.style.height = e.y + "px"
            }, _finish: function () {
                this._moved && (C(this._box), T(this._container, "leaflet-crosshair")), Ce(), be(), A(document, {
                    contextmenu: ze,
                    mousemove: this._onMouseMove,
                    mouseup: this._onMouseUp,
                    keydown: this._onKeyDown
                }, this)
            }, _onMouseUp: function (t) {
                1 !== t.which && 1 !== t.button || (this._finish(), this._moved && (this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(a(this._resetState, this), 0), t = new s(this._map.containerPointToLatLng(this._startPoint), this._map.containerPointToLatLng(this._point)), this._map.fitBounds(t).fire("boxzoomend", {boxZoomBounds: t})))
            }, _onKeyDown: function (t) {
                27 === t.keyCode && (this._finish(), this._clearDeferredResetState(), this._resetState())
            }
        })), Tt = (z.addInitHook("addHandler", "boxZoom", pt), z.mergeOptions({doubleClickZoom: !0}), n.extend({
            addHooks: function () {
                this._map.on("dblclick", this._onDoubleClick, this)
            }, removeHooks: function () {
                this._map.off("dblclick", this._onDoubleClick, this)
            }, _onDoubleClick: function (t) {
                var e = this._map, i = e.getZoom(), n = e.options.zoomDelta, i = t.originalEvent.shiftKey ? i - n : i + n;
                "center" === e.options.doubleClickZoom ? e.setZoom(i) : e.setZoomAround(t.containerPoint, i)
            }
        })), qi = (z.addInitHook("addHandler", "doubleClickZoom", Tt), z.mergeOptions({
            dragging: !0,
            inertia: !0,
            inertiaDeceleration: 3400,
            inertiaMaxSpeed: 1 / 0,
            easeLinearity: .2,
            worldCopyJump: !1,
            maxBoundsViscosity: 0
        }), n.extend({
            addHooks: function () {
                var t;
                this._draggable || (t = this._map, this._draggable = new qe(t._mapPane, t._container), this._draggable.on({
                    dragstart: this._onDragStart,
                    drag: this._onDrag,
                    dragend: this._onDragEnd
                }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this))), E(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = []
            }, removeHooks: function () {
                T(this._map._container, "leaflet-grab"), T(this._map._container, "leaflet-touch-drag"), this._draggable.disable()
            }, moved: function () {
                return this._draggable && this._draggable._moved
            }, moving: function () {
                return this._draggable && this._draggable._moving
            }, _onDragStart: function () {
                var t, e = this._map;
                e._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity ? (t = g(this._map.options.maxBounds), this._offsetLimit = c(this._map.latLngToContainerPoint(t.getNorthWest()).multiplyBy(-1), this._map.latLngToContainerPoint(t.getSouthEast()).multiplyBy(-1).add(this._map.getSize())), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity))) : this._offsetLimit = null, e.fire("movestart").fire("dragstart"), e.options.inertia && (this._positions = [], this._times = [])
            }, _onDrag: function (t) {
                var e, i;
                this._map.options.inertia && (e = this._lastTime = +new Date, i = this._lastPos = this._draggable._absPos || this._draggable._newPos, this._positions.push(i), this._times.push(e), this._prunePositions(e)), this._map.fire("move", t).fire("drag", t)
            }, _prunePositions: function (t) {
                for (; 1 < this._positions.length && 50 < t - this._times[0];) this._positions.shift(), this._times.shift()
            }, _onZoomEnd: function () {
                var t = this._map.getSize().divideBy(2), e = this._map.latLngToLayerPoint([0, 0]);
                this._initialWorldOffset = e.subtract(t).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x
            }, _viscousLimit: function (t, e) {
                return t - (t - e) * this._viscosity
            }, _onPreDragLimit: function () {
                var t, e;
                this._viscosity && this._offsetLimit && (t = this._draggable._newPos.subtract(this._draggable._startPos), e = this._offsetLimit, t.x < e.min.x && (t.x = this._viscousLimit(t.x, e.min.x)), t.y < e.min.y && (t.y = this._viscousLimit(t.y, e.min.y)), t.x > e.max.x && (t.x = this._viscousLimit(t.x, e.max.x)), t.y > e.max.y && (t.y = this._viscousLimit(t.y, e.max.y)), this._draggable._newPos = this._draggable._startPos.add(t))
            }, _onPreDragWrap: function () {
                var t = this._worldWidth, e = Math.round(t / 2), i = this._initialWorldOffset,
                    n = ((o = this._draggable._newPos.x) - e + i) % t + e - i, o = (o + e + i) % t - e - i,
                    t = Math.abs(n + i) < Math.abs(o + i) ? n : o;
                this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = t
            }, _onDragEnd: function (t) {
                var e, i, n, o, s = this._map, r = s.options, a = !r.inertia || t.noInertia || this._times.length < 2;
                s.fire("dragend", t), !a && (this._prunePositions(+new Date), t = this._lastPos.subtract(this._positions[0]), a = (this._lastTime - this._times[0]) / 1e3, e = r.easeLinearity, a = (t = t.multiplyBy(e / a)).distanceTo([0, 0]), i = Math.min(r.inertiaMaxSpeed, a), t = t.multiplyBy(i / a), n = i / (r.inertiaDeceleration * e), (o = t.multiplyBy(-n / 2).round()).x || o.y) ? (o = s._limitOffset(o, s.options.maxBounds), y(function () {
                    s.panBy(o, {duration: n, easeLinearity: e, noMoveStart: !0, animate: !0})
                })) : s.fire("moveend")
            }
        })), Mt = (z.addInitHook("addHandler", "dragging", qi), z.mergeOptions({
            keyboard: !0,
            keyboardPanDelta: 80
        }), n.extend({
            keyCodes: {
                left: [37],
                right: [39],
                down: [40],
                up: [38],
                zoomIn: [187, 107, 61, 171],
                zoomOut: [189, 109, 54, 173]
            }, initialize: function (t) {
                this._map = t, this._setPanDelta(t.options.keyboardPanDelta), this._setZoomDelta(t.options.zoomDelta)
            }, addHooks: function () {
                var t = this._map._container;
                t.tabIndex <= 0 && (t.tabIndex = "0"), k(t, {
                    focus: this._onFocus,
                    blur: this._onBlur,
                    mousedown: this._onMouseDown
                }, this), this._map.on({focus: this._addHooks, blur: this._removeHooks}, this)
            }, removeHooks: function () {
                this._removeHooks(), A(this._map._container, {
                    focus: this._onFocus,
                    blur: this._onBlur,
                    mousedown: this._onMouseDown
                }, this), this._map.off({focus: this._addHooks, blur: this._removeHooks}, this)
            }, _onMouseDown: function () {
                var t, e, i;
                this._focused || (i = document.body, t = document.documentElement, e = i.scrollTop || t.scrollTop, i = i.scrollLeft || t.scrollLeft, this._map._container.focus(), window.scrollTo(i, e))
            }, _onFocus: function () {
                this._focused = !0, this._map.fire("focus")
            }, _onBlur: function () {
                this._focused = !1, this._map.fire("blur")
            }, _setPanDelta: function (t) {
                for (var e = this._panKeys = {}, i = this.keyCodes, n = 0, o = i.left.length; n < o; n++) e[i.left[n]] = [-1 * t, 0];
                for (n = 0, o = i.right.length; n < o; n++) e[i.right[n]] = [t, 0];
                for (n = 0, o = i.down.length; n < o; n++) e[i.down[n]] = [0, t];
                for (n = 0, o = i.up.length; n < o; n++) e[i.up[n]] = [0, -1 * t]
            }, _setZoomDelta: function (t) {
                for (var e = this._zoomKeys = {}, i = this.keyCodes, n = 0, o = i.zoomIn.length; n < o; n++) e[i.zoomIn[n]] = t;
                for (n = 0, o = i.zoomOut.length; n < o; n++) e[i.zoomOut[n]] = -t
            }, _addHooks: function () {
                k(document, "keydown", this._onKeyDown, this)
            }, _removeHooks: function () {
                A(document, "keydown", this._onKeyDown, this)
            }, _onKeyDown: function (t) {
                if (!(t.altKey || t.ctrlKey || t.metaKey)) {
                    var e, i, n = t.keyCode, o = this._map;
                    if (n in this._panKeys) o._panAnim && o._panAnim._inProgress || (i = this._panKeys[n], t.shiftKey && (i = m(i).multiplyBy(3)), o.options.maxBounds && (i = o._limitOffset(m(i), o.options.maxBounds)), o.options.worldCopyJump ? (e = o.wrapLatLng(o.unproject(o.project(o.getCenter()).add(i))), o.panTo(e)) : o.panBy(i)); else if (n in this._zoomKeys) o.setZoom(o.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[n]); else {
                        if (27 !== n || !o._popup || !o._popup.options.closeOnEscapeKey) return;
                        o.closePopup()
                    }
                    ze(t)
                }
            }
        })), St = (z.addInitHook("addHandler", "keyboard", Mt), z.mergeOptions({
            scrollWheelZoom: !0,
            wheelDebounceTime: 40,
            wheelPxPerZoomLevel: 60
        }), n.extend({
            addHooks: function () {
                k(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0
            }, removeHooks: function () {
                A(this._map._container, "wheel", this._onWheelScroll, this)
            }, _onWheelScroll: function (t) {
                var e = Re(t), i = this._map.options.wheelDebounceTime,
                    e = (this._delta += e, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +new Date), Math.max(i - (+new Date - this._startTime), 0));
                clearTimeout(this._timer), this._timer = setTimeout(a(this._performZoom, this), e), ze(t)
            }, _performZoom: function () {
                var t = this._map, e = t.getZoom(), i = this._map.options.zoomSnap || 0,
                    n = (t._stop(), this._delta / (4 * this._map.options.wheelPxPerZoomLevel)),
                    n = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(n)))) / Math.LN2, i = i ? Math.ceil(n / i) * i : n,
                    n = t._limitZoom(e + (0 < this._delta ? i : -i)) - e;
                this._delta = 0, this._startTime = null, n && ("center" === t.options.scrollWheelZoom ? t.setZoom(e + n) : t.setZoomAround(this._lastMousePos, e + n))
            }
        })), kt = (z.addInitHook("addHandler", "scrollWheelZoom", St), z.mergeOptions({
            tapHold: w.touchNative && w.safari && w.mobile,
            tapTolerance: 15
        }), n.extend({
            addHooks: function () {
                k(this._map._container, "touchstart", this._onDown, this)
            }, removeHooks: function () {
                A(this._map._container, "touchstart", this._onDown, this)
            }, _onDown: function (t) {
                var e;
                clearTimeout(this._holdTimeout), 1 === t.touches.length && (e = t.touches[0], this._startPos = this._newPos = new f(e.clientX, e.clientY), this._holdTimeout = setTimeout(a(function () {
                    this._cancel(), this._isTapValid() && (k(document, "touchend", I), k(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", e))
                }, this), 600), k(document, "touchend touchcancel contextmenu", this._cancel, this), k(document, "touchmove", this._onMove, this))
            }, _cancelClickPrevent: function t() {
                A(document, "touchend", I), A(document, "touchend touchcancel", t)
            }, _cancel: function () {
                clearTimeout(this._holdTimeout), A(document, "touchend touchcancel contextmenu", this._cancel, this), A(document, "touchmove", this._onMove, this)
            }, _onMove: function (t) {
                t = t.touches[0], this._newPos = new f(t.clientX, t.clientY)
            }, _isTapValid: function () {
                return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance
            }, _simulateEvent: function (t, e) {
                (t = new MouseEvent(t, {
                    bubbles: !0,
                    cancelable: !0,
                    view: window,
                    screenX: e.screenX,
                    screenY: e.screenY,
                    clientX: e.clientX,
                    clientY: e.clientY
                }))._simulated = !0, e.target.dispatchEvent(t)
            }
        })), Ot = (z.addInitHook("addHandler", "tapHold", kt), z.mergeOptions({
            touchZoom: w.touch,
            bounceAtZoomLimits: !0
        }), n.extend({
            addHooks: function () {
                E(this._map._container, "leaflet-touch-zoom"), k(this._map._container, "touchstart", this._onTouchStart, this)
            }, removeHooks: function () {
                T(this._map._container, "leaflet-touch-zoom"), A(this._map._container, "touchstart", this._onTouchStart, this)
            }, _onTouchStart: function (t) {
                var e, i, n = this._map;
                !t.touches || 2 !== t.touches.length || n._animatingZoom || this._zooming || (e = n.mouseEventToContainerPoint(t.touches[0]), i = n.mouseEventToContainerPoint(t.touches[1]), this._centerPoint = n.getSize()._divideBy(2), this._startLatLng = n.containerPointToLatLng(this._centerPoint), "center" !== n.options.touchZoom && (this._pinchStartLatLng = n.containerPointToLatLng(e.add(i)._divideBy(2))), this._startDist = e.distanceTo(i), this._startZoom = n.getZoom(), this._moved = !1, this._zooming = !0, n._stop(), k(document, "touchmove", this._onTouchMove, this), k(document, "touchend touchcancel", this._onTouchEnd, this), I(t))
            }, _onTouchMove: function (t) {
                if (t.touches && 2 === t.touches.length && this._zooming) {
                    var e = this._map, i = e.mouseEventToContainerPoint(t.touches[0]),
                        n = e.mouseEventToContainerPoint(t.touches[1]), o = i.distanceTo(n) / this._startDist;
                    if (this._zoom = e.getScaleZoom(o, this._startZoom), !e.options.bounceAtZoomLimits && (this._zoom < e.getMinZoom() && o < 1 || this._zoom > e.getMaxZoom() && 1 < o) && (this._zoom = e._limitZoom(this._zoom)), "center" === e.options.touchZoom) {
                        if (this._center = this._startLatLng, 1 == o) return
                    } else {
                        if (i = i._add(n)._divideBy(2)._subtract(this._centerPoint), 1 == o && 0 === i.x && 0 === i.y) return;
                        this._center = e.unproject(e.project(this._pinchStartLatLng, this._zoom).subtract(i), this._zoom)
                    }
                    this._moved || (e._moveStart(!0, !1), this._moved = !0), r(this._animRequest), n = a(e._move, e, this._center, this._zoom, {
                        pinch: !0,
                        round: !1
                    }, void 0), this._animRequest = y(n, this, !0), I(t)
                }
            }, _onTouchEnd: function () {
                this._moved && this._zooming ? (this._zooming = !1, r(this._animRequest), A(document, "touchmove", this._onTouchMove, this), A(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom))) : this._zooming = !1
            }
        })),
        $i = (z.addInitHook("addHandler", "touchZoom", Ot), z.BoxZoom = pt, z.DoubleClickZoom = Tt, z.Drag = qi, z.Keyboard = Mt, z.ScrollWheelZoom = St, z.TapHold = kt, z.TouchZoom = Ot, t.Bounds = _, t.Browser = w, t.CRS = ot, t.Canvas = ji, t.Circle = mi, t.CircleMarker = fi, t.Class = et, t.Control = B, t.DivIcon = zi, t.DivOverlay = Oi, t.DomEvent = ft, t.DomUtil = Ee, t.Draggable = qe, t.Evented = it, t.FeatureGroup = li, t.GeoJSON = vi, t.GridLayer = Bi, t.Handler = n, t.Icon = hi, t.ImageOverlay = Mi, t.LatLng = v, t.LatLngBounds = s, t.Layer = o, t.LayerGroup = ai, t.LineUtil = gt, t.Map = z, t.Marker = di, t.Mixin = mt, t.Path = pi, t.Point = f, t.PolyUtil = _t, t.Polygon = gi, t.Polyline = _i, t.Popup = Ai, t.PosAnimation = je, t.Projection = bt, t.Rectangle = Vi, t.Renderer = Di, t.SVG = Wi, t.SVGOverlay = ki, t.TileLayer = Ni, t.Tooltip = Ii, t.Transformation = at, t.Util = tt, t.VideoOverlay = Si, t.bind = a, t.bounds = c, t.canvas = Fi, t.circle = function (t, e, i) {
            return new mi(t, e, i)
        }, t.circleMarker = function (t, e) {
            return new fi(t, e)
        }, t.control = Fe, t.divIcon = function (t) {
            return new zi(t)
        }, t.extend = h, t.featureGroup = function (t, e) {
            return new li(t, e)
        }, t.geoJSON = Ti, t.geoJson = Ct, t.gridLayer = function (t) {
            return new Bi(t)
        }, t.icon = function (t) {
            return new hi(t)
        }, t.imageOverlay = function (t, e, i) {
            return new Mi(t, e, i)
        }, t.latLng = b, t.latLngBounds = g, t.layerGroup = function (t, e) {
            return new ai(t, e)
        }, t.map = function (t, e) {
            return new z(t, e)
        }, t.marker = function (t, e) {
            return new di(t, e)
        }, t.point = m, t.polygon = function (t, e) {
            return new gi(t, e)
        }, t.polyline = function (t, e) {
            return new _i(t, e)
        }, t.popup = function (t, e) {
            return new Ai(t, e)
        }, t.rectangle = function (t, e) {
            return new Vi(t, e)
        }, t.setOptions = l, t.stamp = d, t.svg = Gi, t.svgOverlay = function (t, e, i) {
            return new ki(t, e, i)
        }, t.tileLayer = Zi, t.tooltip = function (t, e) {
            return new Ii(t, e)
        }, t.transformation = lt, t.version = "1.9.4", t.videoOverlay = function (t, e, i) {
            return new Si(t, e, i)
        }, window.L);
    t.noConflict = function () {
        return window.L = $i, this
    }, window.L = t
}), function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports, require("leaflet")) : "function" == typeof define && define.amd ? define(["exports", "leaflet"], e) : e((t || self).GeoSearch = {}, t.L)
}(this, function (t, e) {
    function i(i) {
        var n;
        return i && i.__esModule ? i : (n = Object.create(null), i && Object.keys(i).forEach(function (t) {
            var e;
            "default" !== t && (e = Object.getOwnPropertyDescriptor(i, t), Object.defineProperty(n, t, e.get ? e : {
                enumerable: !0,
                get: function () {
                    return i[t]
                }
            }))
        }), n.default = i, n)
    }

    var l = i(e);

    function r() {
        return (r = Object.assign ? Object.assign.bind() : function (t) {
            for (var e = 1; e < arguments.length; e++) {
                var i, n = arguments[e];
                for (i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i])
            }
            return t
        }).apply(this, arguments)
    }

    function s(t, e) {
        t.prototype = Object.create(e.prototype), o(t.prototype.constructor = t, e)
    }

    function o(t, e) {
        return (o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
            return t.__proto__ = e, t
        })(t, e)
    }

    function n(t, e, i) {
        return (n = function () {
            if ("undefined" != typeof Reflect && Reflect.construct && !Reflect.construct.sham) {
                if ("function" == typeof Proxy) return 1;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {
                    })), 1
                } catch (t) {
                }
            }
        }() ? Reflect.construct.bind() : function (t, e, i) {
            var n = [null], e = (n.push.apply(n, e), new (Function.bind.apply(t, n)));
            return i && o(e, i.prototype), e
        }).apply(null, arguments)
    }

    function a(t, e, i, n) {
        void 0 === e && (e = ""), void 0 === n && (n = {});
        var o = document.createElement(t);
        return e && (o.className = e), Object.keys(n).forEach(function (t) {
            var e;
            "function" == typeof n[t] ? (e = 0 === t.indexOf("on") ? t.substr(2).toLowerCase() : t, o.addEventListener(e, n[t])) : "html" === t ? o.innerHTML = n[t] : "text" === t ? o.innerText = n[t] : o.setAttribute(t, n[t])
        }), i && i.appendChild(o), o
    }

    function h(t) {
        t.preventDefault(), t.stopPropagation()
    }

    function u() {
        return [].slice.call(arguments).filter(Boolean).join(" ").trim()
    }

    function c(e, t) {
        e && e.classList && (Array.isArray(t) ? t : [t]).forEach(function (t) {
            e.classList.contains(t) || e.classList.add(t)
        })
    }

    function d(e, t) {
        e && e.classList && (Array.isArray(t) ? t : [t]).forEach(function (t) {
            e.classList.contains(t) && e.classList.remove(t)
        })
    }

    var p, f = [13, 27, 40, 38, 37, 39], m = function () {
        function t(t) {
            var e = this, i = t.handleSubmit, n = t.searchLabel, t = t.classNames, t = void 0 === t ? {} : t;
            this.container = void 0, this.form = void 0, this.input = void 0, this.handleSubmit = void 0, this.hasError = !1, this.container = a("div", u("geosearch", t.container)), this.form = a("form", ["", t.form].join(" "), this.container, {
                autocomplete: "none",
                onClick: h,
                onDblClick: h,
                touchStart: h,
                touchEnd: h
            }), this.input = a("input", ["glass", t.input].join(" "), this.form, {
                type: "text",
                placeholder: n || "search",
                onInput: this.onInput,
                onKeyUp: function (t) {
                    return e.onKeyUp(t)
                },
                onKeyPress: function (t) {
                    return e.onKeyPress(t)
                },
                onFocus: this.onFocus,
                onBlur: this.onBlur,
                onClick: function () {
                    e.input.focus(), e.input.dispatchEvent(new Event("focus"))
                }
            }), this.handleSubmit = i
        }

        var e = t.prototype;
        return e.onFocus = function () {
            c(this.form, "active")
        }, e.onBlur = function () {
            d(this.form, "active")
        }, e.onSubmit = function (t) {
            try {
                var e = this;
                return h(t), d(i = e.container, "error"), c(i, "pending"), Promise.resolve(e.handleSubmit({query: e.input.value})).then(function () {
                    d(e.container, "pending")
                })
            } catch (t) {
                return Promise.reject(t)
            }
            var i
        }, e.onInput = function () {
            this.hasError && (d(this.container, "error"), this.hasError = !1)
        }, e.onKeyUp = function (t) {
            27 === t.keyCode && (d(this.container, ["pending", "active"]), this.input.value = "", document.body.focus(), document.body.blur())
        }, e.onKeyPress = function (t) {
            13 === t.keyCode && this.onSubmit(t)
        }, e.setQuery = function (t) {
            this.input.value = t
        }, t
    }(), _ = function () {
        function t(t) {
            var e = this, i = t.handleClick, n = t.classNames, n = void 0 === n ? {} : n, t = t.notFoundMessage;
            this.handleClick = void 0, this.selected = -1, this.results = [], this.container = void 0, this.resultItem = void 0, this.notFoundMessage = void 0, this.onClick = function (t) {
                "function" == typeof e.handleClick && (t = t.target) && e.container.contains(t) && t.hasAttribute("data-key") && (t = Number(t.getAttribute("data-key")), e.clear(), e.handleClick({result: e.results[t]}))
            }, this.handleClick = i, this.notFoundMessage = t ? a("div", u(n.notfound), void 0, {html: t}) : void 0, this.container = a("div", u("results", n.resultlist)), this.container.addEventListener("click", this.onClick, !0), this.resultItem = a("div", u(n.item))
        }

        var e = t.prototype;
        return e.render = function (t, n) {
            var o = this;
            void 0 === t && (t = []), this.clear(), t.forEach(function (t, e) {
                var i = o.resultItem.cloneNode(!0);
                i.setAttribute("data-key", "" + e), i.innerHTML = n({result: t}), o.container.appendChild(i)
            }), 0 < t.length ? (c(this.container.parentElement, "open"), c(this.container, "active")) : this.notFoundMessage && (this.container.appendChild(this.notFoundMessage), c(this.container.parentElement, "open")), this.results = t
        }, e.select = function (i) {
            return Array.from(this.container.children).forEach(function (t, e) {
                return (e === i ? c : d)(t, "active")
            }), this.selected = i, this.results[i]
        }, e.count = function () {
            return this.results ? this.results.length : 0
        }, e.clear = function () {
            for (this.selected = -1; this.container.lastChild;) this.container.removeChild(this.container.lastChild);
            d(this.container.parentElement, "open"), d(this.container, "active")
        }, t
    }(), g = {
        position: "topleft",
        style: "button",
        showMarker: !0,
        showPopup: !1,
        popupFormat: function (t) {
            return "" + t.result.label
        },
        resultFormat: function (t) {
            return "" + t.result.label
        },
        marker: {icon: l && l.Icon ? new l.Icon.Default : void 0, draggable: !1},
        maxMarkers: 1,
        maxSuggestions: 5,
        retainZoomLevel: !1,
        animateZoom: !0,
        searchLabel: "Enter address",
        clearSearchLabel: "Clear search",
        notFoundMessage: "",
        messageHideDelay: 3e3,
        zoomLevel: 18,
        classNames: {
            container: "leaflet-bar leaflet-control leaflet-control-geosearch",
            button: "leaflet-bar-part leaflet-bar-part-single",
            resetButton: "reset",
            msgbox: "leaflet-bar message",
            form: "",
            input: "",
            resultlist: "",
            item: "",
            notfound: "leaflet-bar-notfound"
        },
        autoComplete: !0,
        autoCompleteDelay: 250,
        autoClose: !1,
        keepResult: !1,
        updateMap: !0
    }, v = "Leaflet must be loaded before instantiating the GeoSearch control", y = {
        options: r({}, g), classNames: r({}, g.classNames), initialize: function (t) {
            var e, i, n, o, s = this;
            if (!l) throw new Error(v);
            if (!t.provider) throw new Error("Provider is missing from options");
            this.options = r({}, g, t), this.classNames = r({}, this.classNames, t.classNames), this.markers = new l.FeatureGroup, this.classNames.container += " leaflet-geosearch-" + this.options.style, this.searchElement = new m({
                searchLabel: this.options.searchLabel,
                classNames: {
                    container: this.classNames.container,
                    form: this.classNames.form,
                    input: this.classNames.input
                },
                handleSubmit: function (t) {
                    return s.onSubmit(t)
                }
            }), this.button = a("a", this.classNames.button, this.searchElement.container, {
                title: this.options.searchLabel,
                href: "#",
                onClick: function (t) {
                    return s.onClick(t)
                }
            }), l.DomEvent.disableClickPropagation(this.button), this.resetButton = a("button", this.classNames.resetButton, this.searchElement.form, {
                text: "×",
                "aria-label": this.options.clearSearchLabel,
                onClick: function () {
                    "" === s.searchElement.input.value ? s.close() : s.clearResults(null, !0)
                }
            }), l.DomEvent.disableClickPropagation(this.resetButton), this.options.autoComplete && (this.resultList = new _({
                handleClick: function (t) {
                    t = t.result;
                    s.searchElement.input.value = t.label, s.onSubmit({query: t.label, data: t})
                },
                classNames: {
                    resultlist: this.classNames.resultlist,
                    item: this.classNames.item,
                    notfound: this.classNames.notfound
                },
                notFoundMessage: this.options.notFoundMessage
            }), this.searchElement.form.appendChild(this.resultList.container), this.searchElement.input.addEventListener("keyup", (e = function (t) {
                return s.autoSearch(t)
            }, void 0 === (i = this.options.autoCompleteDelay) && (i = 250), void 0 === n && (n = !1), function () {
                var t = [].slice.call(arguments);
                o && clearTimeout(o), o = setTimeout(function () {
                    o = null, n || e.apply(void 0, t)
                }, i), n && !o && e.apply(void 0, t)
            }), !0), this.searchElement.input.addEventListener("keydown", function (t) {
                return s.selectResult(t)
            }, !0), this.searchElement.input.addEventListener("keydown", function (t) {
                return s.clearResults(t, !0)
            }, !0)), this.searchElement.form.addEventListener("click", function (t) {
                t.preventDefault()
            }, !1)
        }, onAdd: function (t) {
            var e = this.options, i = e.showMarker, e = e.style;
            return this.map = t, i && this.markers.addTo(t), "bar" === e && (i = t.getContainer().querySelector(".leaflet-control-container"), this.container = a("div", "leaflet-control-geosearch leaflet-geosearch-bar"), this.container.appendChild(this.searchElement.form), i.appendChild(this.container)), l.DomEvent.disableClickPropagation(this.searchElement.form), this.searchElement.container
        }, onRemove: function () {
            var t;
            return null != (t = this.container) && t.remove(), this
        }, open: function () {
            var t = this.searchElement, e = t.input;
            c(t.container, "active"), e.focus()
        }, close: function () {
            d(this.searchElement.container, "active"), this.clearResults()
        }, onClick: function (t) {
            t.preventDefault(), t.stopPropagation(), this.searchElement.container.classList.contains("active") ? this.close() : this.open()
        }, selectResult: function (t) {
            var e, i;
            -1 !== [13, 40, 38].indexOf(t.keyCode) && (t.preventDefault(), 13 !== t.keyCode ? (i = this.resultList.count() - 1) < 0 || (e = this.resultList.selected, t = 40 === t.keyCode ? e + 1 : e - 1, e = this.resultList.select(t < 0 ? i : i < t ? 0 : t), this.searchElement.input.value = e.label) : (i = this.resultList.select(this.resultList.selected), this.onSubmit({
                query: this.searchElement.input.value,
                data: i
            })))
        }, clearResults: function (t, e) {
            var i;
            void 0 === e && (e = !1), t && 27 !== t.keyCode || (i = (t = this.options).autoComplete, !e && t.keepResult || (this.searchElement.input.value = "", this.markers.clearLayers()), i && this.resultList.clear())
        }, autoSearch: function (t) {
            try {
                var e, i, n, o = this;
                return -1 < f.indexOf(t.keyCode) ? Promise.resolve() : (e = t.target.value, i = o.options.provider, n = e.length ? Promise.resolve(i.search({query: e})).then(function (t) {
                    t = t.slice(0, o.options.maxSuggestions), o.resultList.render(t, o.options.resultFormat)
                }) : void o.resultList.clear(), Promise.resolve(n && n.then ? n.then(function () {
                }) : void 0))
            } catch (t) {
                return Promise.reject(t)
            }
        }, onSubmit: function (e) {
            try {
                var i = this;
                return Promise.resolve(i.options.provider.search(e)).then(function (t) {
                    t && 0 < t.length && i.showResult(t[0], e)
                })
            } catch (e) {
                return Promise.reject(e)
            }
        }, showResult: function (t, e) {
            var i = this.options, n = i.autoClose, i = i.updateMap, o = this.markers.getLayers(),
                o = (o.length >= this.options.maxMarkers && this.markers.removeLayer(o[0]), this.addMarker(t, e));
            i && this.centerMap(t), this.map.fireEvent("geosearch/showlocation", {
                location: t,
                marker: o
            }), n && this.closeResults()
        }, closeResults: function () {
            var t = this.searchElement.container;
            t.classList.contains("active") && d(t, "active"), this.clearResults()
        }, addMarker: function (t, e) {
            var i = this, n = this.options, o = n.marker, s = n.showPopup, n = n.popupFormat,
                r = new l.Marker([t.y, t.x], o), a = t.label;
            return "function" == typeof n && (a = n({
                query: e,
                result: t
            })), r.bindPopup(a), this.markers.addLayer(r), s && r.openPopup(), o.draggable && r.on("dragend", function (t) {
                i.map.fireEvent("geosearch/marker/dragend", {location: r.getLatLng(), event: t})
            }), r
        }, centerMap: function (t) {
            var e = this.options, i = e.retainZoomLevel, e = e.animateZoom,
                n = t.bounds ? new l.LatLngBounds(t.bounds) : new l.LatLng(t.y, t.x).toBounds(10),
                o = n.isValid() ? n : this.markers.getBounds();
            !i && n.isValid() && !t.bounds || i || !n.isValid() ? this.map.setView(o.getCenter(), this.getZoom(), {animate: e}) : this.map.fitBounds(o, {animate: e})
        }, getZoom: function () {
            var t = this.options, e = t.zoomLevel;
            return t.retainZoomLevel ? this.map.getZoom() : e
        }
    };

    function b() {
        if (l) return n(l.Control.extend(y), [].slice.call(arguments));
        throw new Error(v)
    }

    (e = p = p || {})[e.SEARCH = 0] = "SEARCH", e[e.REVERSE = 1] = "REVERSE";

    function L(t, e) {
        if (t === e) return !0;
        if (t && e && "object" == typeof t && "object" == typeof e) {
            if (t.constructor !== e.constructor) return !1;
            var i, n, o;
            if (Array.isArray(t)) {
                if ((i = t.length) != e.length) return !1;
                for (n = i; 0 != n--;) if (!L(t[n], e[n])) return !1
            } else {
                if (t.constructor === RegExp) return t.source === e.source && t.flags === e.flags;
                if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === e.valueOf();
                if (t.toString !== Object.prototype.toString) return t.toString() === e.toString();
                if ((i = (o = Object.keys(t)).length) !== Object.keys(e).length) return !1;
                for (n = i; 0 != n--;) if (!Object.prototype.hasOwnProperty.call(e, o[n])) return !1;
                for (n = i; 0 != n--;) {
                    var s = o[n];
                    if (!L(t[s], e[s])) return !1
                }
            }
            return !0
        }
        return t != t && e != e
    }

    var x, e = function () {
        function t(t) {
            void 0 === t && (t = {}), this.options = void 0, this.options = t
        }

        var e = t.prototype;
        return e.getParamString = function (t) {
            var e = r({}, this.options.params, t = void 0 === t ? {} : t);
            return Object.keys(e).map(function (t) {
                return encodeURIComponent(t) + "=" + encodeURIComponent(e[t])
            }).join("&")
        }, e.getUrl = function (t, e) {
            return t + "?" + this.getParamString(e)
        }, e.search = function (t) {
            try {
                var e = this, i = e.endpoint({query: t.query, type: p.SEARCH});
                return Promise.resolve(fetch(i)).then(function (t) {
                    return Promise.resolve(t.json()).then(function (t) {
                        return e.parse({data: t})
                    })
                })
            } catch (t) {
                return Promise.reject(t)
            }
        }, t
    }(), w = function (t) {
        function e() {
            return t.apply(this, arguments) || this
        }

        s(e, t);
        var i = e.prototype;
        return i.endpoint = function () {
            return "https://places-dsn.algolia.net/1/places/query"
        }, i.findBestMatchLevelIndex = function (t) {
            var e = t.find(function (t) {
                return "full" === t.matchLevel
            }) || t.find(function (t) {
                return "partial" === t.matchLevel
            });
            return e ? t.indexOf(e) : 0
        }, i.getLabel = function (t) {
            var e;
            return [null == (e = t.locale_names) ? void 0 : e.default[this.findBestMatchLevelIndex(t._highlightResult.locale_names.default)], null == (e = t.city) ? void 0 : e.default[this.findBestMatchLevelIndex(t._highlightResult.city.default)], t.administrative[this.findBestMatchLevelIndex(t._highlightResult.administrative)], null == (e = t.postcode) ? void 0 : e[this.findBestMatchLevelIndex(t._highlightResult.postcode)], null == (e = t.country) ? void 0 : e.default].filter(Boolean).join(", ")
        }, i.parse = function (t) {
            var e = this;
            return t.data.hits.map(function (t) {
                return {x: t._geoloc.lng, y: t._geoloc.lat, label: e.getLabel(t), bounds: null, raw: t}
            })
        }, i.search = function (t) {
            var e = t.query;
            try {
                var i = this, n = "string" == typeof e ? {query: e} : e;
                return Promise.resolve(fetch(i.endpoint(), {
                    method: "POST",
                    body: JSON.stringify(r({}, i.options.params, n))
                })).then(function (t) {
                    return Promise.resolve(t.json()).then(function (t) {
                        return i.parse({data: t})
                    })
                })
            } catch (t) {
                return Promise.reject(t)
            }
        }, e
    }(e), P = function (o) {
        function t() {
            for (var t, e = arguments.length, i = new Array(e), n = 0; n < e; n++) i[n] = arguments[n];
            return (t = o.call.apply(o, [this].concat(i)) || this).searchUrl = "https://dev.virtualearth.net/REST/v1/Locations", t
        }

        s(t, o);
        var e = t.prototype;
        return e.endpoint = function (t) {
            var e = t.query, e = "string" == typeof e ? {q: e} : e;
            return e.jsonp = t.jsonp, this.getUrl(this.searchUrl, e)
        }, e.parse = function (t) {
            return 0 === t.data.resourceSets.length ? [] : t.data.resourceSets[0].resources.map(function (t) {
                return {
                    x: t.point.coordinates[1],
                    y: t.point.coordinates[0],
                    label: t.address.formattedAddress,
                    bounds: [[t.bbox[0], t.bbox[1]], [t.bbox[2], t.bbox[3]]],
                    raw: t
                }
            })
        }, e.search = function (t) {
            var i, n, o, e = t.query;
            try {
                var s = this, r = "BING_JSONP_CB_" + Date.now();
                return Promise.resolve((i = s.endpoint({
                    query: e,
                    jsonp: r
                }), n = r, (o = a("script", null, document.body)).setAttribute("type", "text/javascript"), new Promise(function (e) {
                    window[n] = function (t) {
                        o.remove(), delete window[n], e(t)
                    }, o.setAttribute("src", i)
                }))).then(function (t) {
                    return s.parse({data: t})
                })
            } catch (t) {
                return Promise.reject(t)
            }
        }, t
    }(e), C = function (o) {
        function t() {
            for (var t, e = arguments.length, i = new Array(e), n = 0; n < e; n++) i[n] = arguments[n];
            return (t = o.call.apply(o, [this].concat(i)) || this).searchUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find", t
        }

        s(t, o);
        var e = t.prototype;
        return e.endpoint = function (t) {
            t = t.query, t = "string" == typeof t ? {text: t} : t;
            return t.f = "json", this.getUrl(this.searchUrl, t)
        }, e.parse = function (t) {
            return t.data.locations.map(function (t) {
                return {
                    x: t.feature.geometry.x,
                    y: t.feature.geometry.y,
                    label: t.name,
                    bounds: [[t.extent.ymin, t.extent.xmin], [t.extent.ymax, t.extent.xmax]],
                    raw: t
                }
            })
        }, t
    }(e), E = function (i) {
        function t(t) {
            var e;
            return (e = i.call(this, t = void 0 === t ? {} : t) || this).host = void 0, e.host = t.host || "http://localhost:4000", e
        }

        s(t, i);
        var e = t.prototype;
        return e.endpoint = function (t) {
            var e = t.query;
            return t.type === p.REVERSE ? this.getUrl(this.host + "/v1/reverse", "string" == typeof e ? {} : e) : this.getUrl(this.host + "/v1/autocomplete", "string" == typeof e ? {text: e} : e)
        }, e.parse = function (t) {
            return t.data.features.map(function (t) {
                var e = {
                    x: t.geometry.coordinates[0],
                    y: t.geometry.coordinates[1],
                    label: t.properties.label,
                    bounds: null,
                    raw: t
                };
                return Array.isArray(t.bbox) && 4 === t.bbox.length && (e.bounds = [[t.bbox[1], t.bbox[0]], [t.bbox[3], t.bbox[2]]]), e
            })
        }, t
    }(e), T = function (e) {
        function t(t) {
            return (t = void 0 === t ? {} : t).host = "https://api.geocode.earth", e.call(this, t) || this
        }

        return s(t, e), t
    }(E);
    const M = "__googleMapsScriptId";
    (k = x = x || {})[k.INITIALIZED = 0] = "INITIALIZED", k[k.LOADING = 1] = "LOADING", k[k.SUCCESS = 2] = "SUCCESS", k[k.FAILURE = 3] = "FAILURE";

    class S {
        constructor({
                        apiKey: t,
                        authReferrerPolicy: e,
                        channel: i,
                        client: n,
                        id: o = M,
                        language: s,
                        libraries: r = [],
                        mapIds: a,
                        nonce: l,
                        region: h,
                        retries: u = 3,
                        url: c = "https://maps.googleapis.com/maps/api/js",
                        version: d
                    }) {
            if (this.CALLBACK = "__googleMapsCallback", this.callbacks = [], this.done = !1, this.loading = !1, this.errors = [], this.apiKey = t, this.authReferrerPolicy = e, this.channel = i, this.client = n, this.id = o || M, this.language = s, this.libraries = r, this.mapIds = a, this.nonce = l, this.region = h, this.retries = u, this.url = c, this.version = d, S.instance) {
                if (L(this.options, S.instance.options)) return S.instance;
                throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ` + JSON.stringify(S.instance.options))
            }
            S.instance = this
        }

        get options() {
            return {
                version: this.version,
                apiKey: this.apiKey,
                channel: this.channel,
                client: this.client,
                id: this.id,
                libraries: this.libraries,
                language: this.language,
                region: this.region,
                mapIds: this.mapIds,
                nonce: this.nonce,
                url: this.url,
                authReferrerPolicy: this.authReferrerPolicy
            }
        }

        get status() {
            return this.errors.length ? x.FAILURE : this.done ? x.SUCCESS : this.loading ? x.LOADING : x.INITIALIZED
        }

        get failed() {
            return this.done && !this.loading && this.errors.length >= this.retries + 1
        }

        createUrl() {
            let t = this.url;
            return t += "?callback=" + this.CALLBACK, this.apiKey && (t += "&key=" + this.apiKey), this.channel && (t += "&channel=" + this.channel), this.client && (t += "&client=" + this.client), 0 < this.libraries.length && (t += "&libraries=" + this.libraries.join(",")), this.language && (t += "&language=" + this.language), this.region && (t += "&region=" + this.region), this.version && (t += "&v=" + this.version), this.mapIds && (t += "&map_ids=" + this.mapIds.join(",")), this.authReferrerPolicy && (t += "&auth_referrer_policy=" + this.authReferrerPolicy), t
        }

        deleteScript() {
            var t = document.getElementById(this.id);
            t && t.remove()
        }

        load() {
            return this.loadPromise()
        }

        loadPromise() {
            return new Promise((e, i) => {
                this.loadCallback(t => {
                    t ? i(t.error) : e(window.google)
                })
            })
        }

        loadCallback(t) {
            this.callbacks.push(t), this.execute()
        }

        setScript() {
            var t, e;
            document.getElementById(this.id) ? this.callback() : (t = this.createUrl(), (e = document.createElement("script")).id = this.id, e.type = "text/javascript", e.src = t, e.onerror = this.loadErrorCallback.bind(this), e.defer = !0, e.async = !0, this.nonce && (e.nonce = this.nonce), document.head.appendChild(e))
        }

        reset() {
            this.deleteScript(), this.done = !1, this.loading = !1, this.errors = [], this.onerrorEvent = null
        }

        resetIfRetryingFailed() {
            this.failed && this.reset()
        }

        loadErrorCallback(t) {
            if (this.errors.push(t), this.errors.length <= this.retries) {
                const t = this.errors.length * Math.pow(2, this.errors.length);
                console.log(`Failed to load Google Maps script, retrying in ${t} ms.`), setTimeout(() => {
                    this.deleteScript(), this.setScript()
                }, t)
            } else this.onerrorEvent = t, this.callback()
        }

        setCallback() {
            window.__googleMapsCallback = this.callback.bind(this)
        }

        callback() {
            this.done = !0, this.loading = !1, this.callbacks.forEach(t => {
                t(this.onerrorEvent)
            }), this.callbacks = []
        }

        execute() {
            this.resetIfRetryingFailed(), this.done ? this.callback() : window.google && window.google.maps && window.google.maps.version ? (console.warn("Google Maps already loaded outside @googlemaps/js-api-loader.This may result in undesirable behavior as options and script parameters may not match."), this.callback()) : this.loading || (this.loading = !0, this.setCallback(), this.setScript())
        }
    }

    var k = function (i) {
        function t(t) {
            var e;
            return (e = i.call(this, t) || this).loader = null, e.geocoder = null, "undefined" != typeof window && (e.loader = new S(t).load().then(function (t) {
                t = new t.maps.Geocoder;
                return e.geocoder = t
            })), e
        }

        s(t, i);
        var e = t.prototype;
        return e.endpoint = function (t) {
            throw new Error("Method not implemented.")
        }, e.parse = function (t) {
            return t.data.results.map(function (t) {
                var e = t.geometry.location.toJSON(), i = e.lat, e = e.lng, n = t.geometry.viewport.toJSON();
                return {x: e, y: i, label: t.formatted_address, bounds: [[n.south, n.west], [n.north, n.east]], raw: t}
            })
        }, e.search = function (e) {
            try {
                function t(t) {
                    if (t) return Promise.resolve(t.geocode({address: e.query}, function (t) {
                        return {results: t}
                    }).catch(function (t) {
                        return "ZERO_RESULTS" !== t.code && console.error(t.code + ": " + t.message), {results: []}
                    })).then(function (t) {
                        return i.parse({data: t})
                    });
                    throw new Error("GoogleMaps GeoCoder is not loaded. Are you trying to run this server side?")
                }

                var i = this, n = i.geocoder;
                return Promise.resolve(n ? t(n) : Promise.resolve(i.loader).then(t))
            } catch (e) {
                return Promise.reject(e)
            }
        }, t
    }(e), O = function (o) {
        function t() {
            for (var t, e = arguments.length, i = new Array(e), n = 0; n < e; n++) i[n] = arguments[n];
            return (t = o.call.apply(o, [this].concat(i)) || this).searchUrl = "https://maps.googleapis.com/maps/api/geocode/json", t
        }

        s(t, o);
        var e = t.prototype;
        return e.endpoint = function (t) {
            t = t.query;
            return this.getUrl(this.searchUrl, "string" == typeof t ? {address: t} : t)
        }, e.parse = function (t) {
            return t.data.results.map(function (t) {
                return {
                    x: t.geometry.location.lng,
                    y: t.geometry.location.lat,
                    label: t.formatted_address,
                    bounds: [[t.geometry.viewport.southwest.lat, t.geometry.viewport.southwest.lng], [t.geometry.viewport.northeast.lat, t.geometry.viewport.northeast.lng]],
                    raw: t
                }
            })
        }, t
    }(e), A = function (o) {
        function t() {
            for (var t, e = arguments.length, i = new Array(e), n = 0; n < e; n++) i[n] = arguments[n];
            return (t = o.call.apply(o, [this].concat(i)) || this).searchUrl = "https://geocode.search.hereapi.com/v1/autosuggest", t
        }

        s(t, o);
        var e = t.prototype;
        return e.endpoint = function (t) {
            t = t.query;
            return this.getUrl(this.searchUrl, "string" == typeof t ? {q: t} : t)
        }, e.parse = function (t) {
            return t.data.items.filter(function (t) {
                return void 0 !== t.position
            }).map(function (t) {
                return {x: t.position.lng, y: t.position.lat, label: t.address.label, bounds: null, raw: t}
            })
        }, t
    }(e), I = function (n) {
        function t(t) {
            (e = n.call(this, t = void 0 === t ? {} : t) || this).searchUrl = void 0, e.reverseUrl = void 0;
            var e, i = "https://nominatim.openstreetmap.org";
            return e.searchUrl = t.searchUrl || i + "/search", e.reverseUrl = t.reverseUrl || i + "/reverse", e
        }

        s(t, n);
        var e = t.prototype;
        return e.endpoint = function (t) {
            var e = t.query, t = t.type, e = "string" == typeof e ? {q: e} : e;
            return e.format = "json", this.getUrl(t === p.REVERSE ? this.reverseUrl : this.searchUrl, e)
        }, e.parse = function (t) {
            return (Array.isArray(t.data) ? t.data : [t.data]).map(function (t) {
                return {
                    x: Number(t.lon),
                    y: Number(t.lat),
                    label: t.display_name,
                    bounds: [[parseFloat(t.boundingbox[0]), parseFloat(t.boundingbox[2])], [parseFloat(t.boundingbox[1]), parseFloat(t.boundingbox[3])]],
                    raw: t
                }
            })
        }, t
    }(e), z = function (e) {
        function t(t) {
            return e.call(this, r({}, t, {
                searchUrl: "https://locationiq.org/v1/search.php",
                reverseUrl: "https://locationiq.org/v1/reverse.php"
            })) || this
        }

        return s(t, e), t
    }(I), B = function (o) {
        function t() {
            for (var t, e = arguments.length, i = new Array(e), n = 0; n < e; n++) i[n] = arguments[n];
            return (t = o.call.apply(o, [this].concat(i)) || this).searchUrl = "https://api.opencagedata.com/geocode/v1/json", t
        }

        s(t, o);
        var e = t.prototype;
        return e.endpoint = function (t) {
            t = t.query, t = "string" == typeof t ? {q: t} : t;
            return t.format = "json", this.getUrl(this.searchUrl, t)
        }, e.parse = function (t) {
            return t.data.results.map(function (t) {
                return {
                    x: t.geometry.lng,
                    y: t.geometry.lat,
                    label: t.formatted,
                    bounds: [[t.bounds.southwest.lat, t.bounds.southwest.lng], [t.bounds.northeast.lat, t.bounds.northeast.lng]],
                    raw: t
                }
            })
        }, e.search = function (t) {
            try {
                return Promise.resolve(t.query.length < 2 ? [] : o.prototype.search.call(this, t))
            } catch (t) {
                return Promise.reject(t)
            }
        }, t
    }(e), N = function (i) {
        function t(t) {
            var e;
            return (e = i.call(this, t = void 0 === t ? {} : t) || this).searchUrl = void 0, e.searchUrl = t.searchUrl || "https://a.tiles.mapbox.com/v4/geocode/mapbox.places/", e
        }

        s(t, i);
        var e = t.prototype;
        return e.endpoint = function (t) {
            return this.getUrl("" + this.searchUrl + t.query + ".json")
        }, e.parse = function (t) {
            return (Array.isArray(t.data.features) ? t.data.features : []).map(function (t) {
                var e = null;
                return t.bbox && (e = [[parseFloat(t.bbox[1]), parseFloat(t.bbox[0])], [parseFloat(t.bbox[3]), parseFloat(t.bbox[2])]]), {
                    x: Number(t.center[0]),
                    y: Number(t.center[1]),
                    label: t.place_name || t.text,
                    bounds: e,
                    raw: t
                }
            })
        }, t
    }(e), Z = function (n) {
        function t(t) {
            (e = n.call(this, t = void 0 === t ? {} : t) || this).searchUrl = void 0, e.reverseUrl = void 0;
            var e, i = "https://api-adresse.data.gouv.fr";
            return e.searchUrl = t.searchUrl || i + "/search", e.reverseUrl = t.reverseUrl || i + "/reverse", e
        }

        s(t, n);
        var e = t.prototype;
        return e.endpoint = function (t) {
            var e = t.query;
            return this.getUrl(t.type === p.REVERSE ? this.reverseUrl : this.searchUrl, "string" == typeof e ? {q: e} : e)
        }, e.parse = function (t) {
            return t.data.features.map(function (t) {
                return {
                    x: t.geometry.coordinates[0],
                    y: t.geometry.coordinates[1],
                    label: t.properties.label,
                    bounds: null,
                    raw: t
                }
            })
        }, t
    }(e), R = function (n) {
        function t(t) {
            (e = n.call(this, t = void 0 === t ? {} : t) || this).searchUrl = void 0, e.reverseUrl = void 0;
            var e, i = "https://api.geoapify.com/v1/geocode";
            return e.searchUrl = t.searchUrl || i + "/search", e.reverseUrl = t.reverseUrl || i + "/reverse", e
        }

        s(t, n);
        var e = t.prototype;
        return e.endpoint = function (t) {
            var e = t.query, t = t.type, e = "string" == typeof e ? {text: e} : e;
            return e.format = "json", this.getUrl(t === p.REVERSE ? this.reverseUrl : this.searchUrl, e)
        }, e.parse = function (t) {
            return (Array.isArray(t.data.results) ? t.data.results : [t.data.results]).map(function (t) {
                return {
                    x: Number(t.lon),
                    y: Number(t.lat),
                    label: t.formatted,
                    bounds: [[parseFloat(t.bbox.lat1), parseFloat(t.bbox.lon1)], [parseFloat(t.bbox.lat2), parseFloat(t.bbox.lon2)]],
                    raw: t
                }
            })
        }, t
    }(e);
    t.AlgoliaProvider = w, t.BingProvider = P, t.EsriProvider = C, t.GeoApiFrProvider = Z, t.GeoSearchControl = b, t.GeoapifyProvider = R, t.GeocodeEarthProvider = T, t.GoogleProvider = k, t.HereProvider = A, t.JsonProvider = e, t.LegacyGoogleProvider = O, t.LocationIQProvider = z, t.MapBoxProvider = N, t.OpenCageProvider = B, t.OpenStreetMapProvider = I, t.PeliasProvider = E, t.SearchControl = b, t.SearchElement = m
}), function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(((t = t || self).Leaflet = t.Leaflet || {}, t.Leaflet.markercluster = {}))
}(this, function (t) {
    "use strict";
    var e = L.MarkerClusterGroup = L.FeatureGroup.extend({
            options: {
                maxClusterRadius: 80,
                iconCreateFunction: null,
                clusterPane: L.Marker.prototype.options.pane,
                spiderfyOnEveryZoom: !1,
                spiderfyOnMaxZoom: !0,
                showCoverageOnHover: !0,
                zoomToBoundsOnClick: !0,
                singleMarkerMode: !1,
                disableClusteringAtZoom: null,
                removeOutsideVisibleBounds: !0,
                animate: !0,
                animateAddingMarkers: !1,
                spiderfyShapePositions: null,
                spiderfyDistanceMultiplier: 1,
                spiderLegPolylineOptions: {weight: 1.5, color: "#222", opacity: .5},
                chunkedLoading: !1,
                chunkInterval: 200,
                chunkDelay: 50,
                chunkProgress: null,
                polygonOptions: {}
            }, initialize: function (t) {
                L.Util.setOptions(this, t), this.options.iconCreateFunction || (this.options.iconCreateFunction = this._defaultIconCreateFunction), this._featureGroup = L.featureGroup(), this._featureGroup.addEventParent(this), this._nonPointGroup = L.featureGroup(), this._nonPointGroup.addEventParent(this), this._inZoomAnimation = 0, this._needsClustering = [], this._needsRemoving = [], this._currentShownBounds = null, this._queue = [], this._childMarkerEventHandlers = {
                    dragstart: this._childMarkerDragStart,
                    move: this._childMarkerMoved,
                    dragend: this._childMarkerDragEnd
                };
                t = L.DomUtil.TRANSITION && this.options.animate;
                L.extend(this, t ? this._withAnimation : this._noAnimation), this._markerCluster = t ? L.MarkerCluster : L.MarkerClusterNonAnimated
            }, addLayer: function (t) {
                if (t instanceof L.LayerGroup) return this.addLayers([t]);
                if (t.getLatLng) if (this._map) {
                    if (!this.hasLayer(t)) {
                        this._unspiderfy && this._unspiderfy(), this._addLayer(t, this._maxZoom), this.fire("layeradd", {layer: t}), this._topClusterLevel._recalculateBounds(), this._refreshClustersIcons();
                        var e = t, i = this._zoom;
                        if (t.__parent) for (; e.__parent._zoom >= i;) e = e.__parent;
                        this._currentShownBounds.contains(e.getLatLng()) && (this.options.animateAddingMarkers ? this._animationAddLayer(t, e) : this._animationAddLayerNonAnimated(t, e))
                    }
                } else this._needsClustering.push(t), this.fire("layeradd", {layer: t}); else this._nonPointGroup.addLayer(t), this.fire("layeradd", {layer: t});
                return this
            }, removeLayer: function (t) {
                return t instanceof L.LayerGroup ? this.removeLayers([t]) : (t.getLatLng ? this._map ? t.__parent && (this._unspiderfy && (this._unspiderfy(), this._unspiderfyLayer(t)), this._removeLayer(t, !0), this.fire("layerremove", {layer: t}), this._topClusterLevel._recalculateBounds(), this._refreshClustersIcons(), t.off(this._childMarkerEventHandlers, this), this._featureGroup.hasLayer(t)) && (this._featureGroup.removeLayer(t), t.clusterShow) && t.clusterShow() : (!this._arraySplice(this._needsClustering, t) && this.hasLayer(t) && this._needsRemoving.push({
                    layer: t,
                    latlng: t._latlng
                }), this.fire("layerremove", {layer: t})) : (this._nonPointGroup.removeLayer(t), this.fire("layerremove", {layer: t})), this)
            }, addLayers: function (n, o) {
                if (!L.Util.isArray(n)) return this.addLayer(n);
                var s, r = this._featureGroup, a = this._nonPointGroup, l = this.options.chunkedLoading,
                    h = this.options.chunkInterval, u = this.options.chunkProgress, c = n.length, d = 0, p = !0;
                if (this._map) {
                    var f = (new Date).getTime(), m = L.bind(function () {
                        var t, e = (new Date).getTime();
                        for (this._map && this._unspiderfy && this._unspiderfy(); d < c; d++) {
                            if (l && d % 200 == 0) {
                                var i = (new Date).getTime() - e;
                                if (h < i) break
                            }
                            (s = n[d]) instanceof L.LayerGroup ? (p && (n = n.slice(), p = !1), this._extractNonGroupLayers(s, n), c = n.length) : s.getLatLng ? !this.hasLayer(s) && (this._addLayer(s, this._maxZoom), o || this.fire("layeradd", {layer: s}), s.__parent) && 2 === s.__parent.getChildCount() && (t = (i = s.__parent.getAllChildMarkers())[0] === s ? i[1] : i[0], r.removeLayer(t)) : (a.addLayer(s), o || this.fire("layeradd", {layer: s}))
                        }
                        u && u(d, c, (new Date).getTime() - f), d === c ? (this._topClusterLevel._recalculateBounds(), this._refreshClustersIcons(), this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds)) : setTimeout(m, this.options.chunkDelay)
                    }, this);
                    m()
                } else for (var t = this._needsClustering; d < c; d++) (s = n[d]) instanceof L.LayerGroup ? (p && (n = n.slice(), p = !1), this._extractNonGroupLayers(s, n), c = n.length) : s.getLatLng ? this.hasLayer(s) || t.push(s) : a.addLayer(s);
                return this
            }, removeLayers: function (t) {
                var e, i = t.length, n = this._featureGroup, o = this._nonPointGroup, s = !0;
                if (this._map) {
                    if (this._unspiderfy) {
                        this._unspiderfy();
                        for (var r = t.slice(), a = i, l = 0; l < a; l++) (e = r[l]) instanceof L.LayerGroup ? (this._extractNonGroupLayers(e, r), a = r.length) : this._unspiderfyLayer(e)
                    }
                    for (l = 0; l < i; l++) (e = t[l]) instanceof L.LayerGroup ? (s && (t = t.slice(), s = !1), this._extractNonGroupLayers(e, t), i = t.length) : e.__parent ? (this._removeLayer(e, !0, !0), this.fire("layerremove", {layer: e}), n.hasLayer(e) && (n.removeLayer(e), e.clusterShow) && e.clusterShow()) : (o.removeLayer(e), this.fire("layerremove", {layer: e}));
                    this._topClusterLevel._recalculateBounds(), this._refreshClustersIcons(), this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds)
                } else for (l = 0; l < i; l++) (e = t[l]) instanceof L.LayerGroup ? (s && (t = t.slice(), s = !1), this._extractNonGroupLayers(e, t), i = t.length) : (this._arraySplice(this._needsClustering, e), o.removeLayer(e), this.hasLayer(e) && this._needsRemoving.push({
                    layer: e,
                    latlng: e._latlng
                }), this.fire("layerremove", {layer: e}));
                return this
            }, clearLayers: function () {
                return this._map || (this._needsClustering = [], this._needsRemoving = [], delete this._gridClusters, delete this._gridUnclustered), this._noanimationUnspiderfy && this._noanimationUnspiderfy(), this._featureGroup.clearLayers(), this._nonPointGroup.clearLayers(), this.eachLayer(function (t) {
                    t.off(this._childMarkerEventHandlers, this), delete t.__parent
                }, this), this._map && this._generateInitialClusters(), this
            }, getBounds: function () {
                var t = new L.LatLngBounds;
                this._topClusterLevel && t.extend(this._topClusterLevel._bounds);
                for (var e = this._needsClustering.length - 1; 0 <= e; e--) t.extend(this._needsClustering[e].getLatLng());
                return t.extend(this._nonPointGroup.getBounds()), t
            }, eachLayer: function (t, e) {
                var i, n, o, s = this._needsClustering.slice(), r = this._needsRemoving;
                for (this._topClusterLevel && this._topClusterLevel.getAllChildMarkers(s), n = s.length - 1; 0 <= n; n--) {
                    for (i = !0, o = r.length - 1; 0 <= o; o--) if (r[o].layer === s[n]) {
                        i = !1;
                        break
                    }
                    i && t.call(e, s[n])
                }
                this._nonPointGroup.eachLayer(t, e)
            }, getLayers: function () {
                var e = [];
                return this.eachLayer(function (t) {
                    e.push(t)
                }), e
            }, getLayer: function (e) {
                var i = null;
                return e = parseInt(e, 10), this.eachLayer(function (t) {
                    L.stamp(t) === e && (i = t)
                }), i
            }, hasLayer: function (t) {
                if (!t) return !1;
                for (var e = this._needsClustering, i = e.length - 1; 0 <= i; i--) if (e[i] === t) return !0;
                for (i = (e = this._needsRemoving).length - 1; 0 <= i; i--) if (e[i].layer === t) return !1;
                return !(!t.__parent || t.__parent._group !== this) || this._nonPointGroup.hasLayer(t)
            }, zoomToShowLayer: function (t, e) {
                var i = this._map, n = ("function" != typeof e && (e = function () {
                }), function () {
                    !i.hasLayer(t) && !i.hasLayer(t.__parent) || this._inZoomAnimation || (this._map.off("moveend", n, this), this.off("animationend", n, this), i.hasLayer(t) ? e() : t.__parent._icon && (this.once("spiderfied", e, this), t.__parent.spiderfy()))
                });
                t._icon && this._map.getBounds().contains(t.getLatLng()) ? e() : t.__parent._zoom < Math.round(this._map._zoom) ? (this._map.on("moveend", n, this), this._map.panTo(t.getLatLng())) : (this._map.on("moveend", n, this), this.on("animationend", n, this), t.__parent.zoomToBounds())
            }, onAdd: function (t) {
                var e, i, n;
                if (this._map = t, !isFinite(this._map.getMaxZoom())) throw "Map has no maxZoom specified";
                for (this._featureGroup.addTo(t), this._nonPointGroup.addTo(t), this._gridClusters || this._generateInitialClusters(), this._maxLat = t.options.crs.projection.MAX_LATITUDE, e = 0, i = this._needsRemoving.length; e < i; e++) (n = this._needsRemoving[e]).newlatlng = n.layer._latlng, n.layer._latlng = n.latlng;
                for (e = 0, i = this._needsRemoving.length; e < i; e++) n = this._needsRemoving[e], this._removeLayer(n.layer, !0), n.layer._latlng = n.newlatlng;
                this._needsRemoving = [], this._zoom = Math.round(this._map._zoom), this._currentShownBounds = this._getExpandedVisibleBounds(), this._map.on("zoomend", this._zoomEnd, this), this._map.on("moveend", this._moveEnd, this), this._spiderfierOnAdd && this._spiderfierOnAdd(), this._bindEvents(), i = this._needsClustering, this._needsClustering = [], this.addLayers(i, !0)
            }, onRemove: function (t) {
                t.off("zoomend", this._zoomEnd, this), t.off("moveend", this._moveEnd, this), this._unbindEvents(), this._map._mapPane.className = this._map._mapPane.className.replace(" leaflet-cluster-anim", ""), this._spiderfierOnRemove && this._spiderfierOnRemove(), delete this._maxLat, this._hideCoverage(), this._featureGroup.remove(), this._nonPointGroup.remove(), this._featureGroup.clearLayers(), this._map = null
            }, getVisibleParent: function (t) {
                for (var e = t; e && !e._icon;) e = e.__parent;
                return e || null
            }, _arraySplice: function (t, e) {
                for (var i = t.length - 1; 0 <= i; i--) if (t[i] === e) return t.splice(i, 1), !0
            }, _removeFromGridUnclustered: function (t, e) {
                for (var i = this._map, n = this._gridUnclustered, o = Math.floor(this._map.getMinZoom()); o <= e && n[e].removeObject(t, i.project(t.getLatLng(), e)); e--) ;
            }, _childMarkerDragStart: function (t) {
                t.target.__dragStart = t.target._latlng
            }, _childMarkerMoved: function (t) {
                var e;
                this._ignoreMove || t.target.__dragStart || (e = t.target._popup && t.target._popup.isOpen(), this._moveChild(t.target, t.oldLatLng, t.latlng), e && t.target.openPopup())
            }, _moveChild: function (t, e, i) {
                t._latlng = e, this.removeLayer(t), t._latlng = i, this.addLayer(t)
            }, _childMarkerDragEnd: function (t) {
                var e = t.target.__dragStart;
                delete t.target.__dragStart, e && this._moveChild(t.target, e, t.target._latlng)
            }, _removeLayer: function (t, e, i) {
                var n = this._gridClusters, o = this._gridUnclustered, s = this._featureGroup, r = this._map,
                    a = Math.floor(this._map.getMinZoom());
                e && this._removeFromGridUnclustered(t, this._maxZoom);
                var l, h = t.__parent, u = h._markers;
                for (this._arraySplice(u, t); h && (h._childCount--, h._boundsNeedUpdate = !0, !(h._zoom < a));) e && h._childCount <= 1 ? (l = h._markers[0] === t ? h._markers[1] : h._markers[0], n[h._zoom].removeObject(h, r.project(h._cLatLng, h._zoom)), o[h._zoom].addObject(l, r.project(l.getLatLng(), h._zoom)), this._arraySplice(h.__parent._childClusters, h), h.__parent._markers.push(l), l.__parent = h.__parent, h._icon && (s.removeLayer(h), i || s.addLayer(l))) : h._iconNeedsUpdate = !0, h = h.__parent;
                delete t.__parent
            }, _isOrIsParent: function (t, e) {
                for (; e;) {
                    if (t === e) return !0;
                    e = e.parentNode
                }
                return !1
            }, fire: function (t, e, i) {
                if (e && e.layer instanceof L.MarkerCluster) {
                    if (e.originalEvent && this._isOrIsParent(e.layer._icon, e.originalEvent.relatedTarget)) return;
                    t = "cluster" + t
                }
                L.FeatureGroup.prototype.fire.call(this, t, e, i)
            }, listens: function (t, e) {
                return L.FeatureGroup.prototype.listens.call(this, t, e) || L.FeatureGroup.prototype.listens.call(this, "cluster" + t, e)
            }, _defaultIconCreateFunction: function (t) {
                var t = t.getChildCount(), e = " marker-cluster-";
                return e += t < 10 ? "small" : t < 100 ? "medium" : "large", new L.DivIcon({
                    html: "<div><span>" + t + "</span></div>",
                    className: "marker-cluster" + e,
                    iconSize: new L.Point(40, 40)
                })
            }, _bindEvents: function () {
                var t = this._map, e = this.options.spiderfyOnMaxZoom, i = this.options.showCoverageOnHover,
                    n = this.options.zoomToBoundsOnClick, o = this.options.spiderfyOnEveryZoom;
                (e || n || o) && this.on("clusterclick clusterkeypress", this._zoomOrSpiderfy, this), i && (this.on("clustermouseover", this._showCoverage, this), this.on("clustermouseout", this._hideCoverage, this), t.on("zoomend", this._hideCoverage, this))
            }, _zoomOrSpiderfy: function (t) {
                var e = t.layer, i = e;
                if ("clusterkeypress" !== t.type || !t.originalEvent || 13 === t.originalEvent.keyCode) {
                    for (; 1 === i._childClusters.length;) i = i._childClusters[0];
                    i._zoom === this._maxZoom && i._childCount === e._childCount && this.options.spiderfyOnMaxZoom ? e.spiderfy() : this.options.zoomToBoundsOnClick && e.zoomToBounds(), this.options.spiderfyOnEveryZoom && e.spiderfy(), t.originalEvent && 13 === t.originalEvent.keyCode && this._map._container.focus()
                }
            }, _showCoverage: function (t) {
                var e = this._map;
                this._inZoomAnimation || (this._shownPolygon && e.removeLayer(this._shownPolygon), 2 < t.layer.getChildCount() && t.layer !== this._spiderfied && (this._shownPolygon = new L.Polygon(t.layer.getConvexHull(), this.options.polygonOptions), e.addLayer(this._shownPolygon)))
            }, _hideCoverage: function () {
                this._shownPolygon && (this._map.removeLayer(this._shownPolygon), this._shownPolygon = null)
            }, _unbindEvents: function () {
                var t = this.options.spiderfyOnMaxZoom, e = this.options.showCoverageOnHover,
                    i = this.options.zoomToBoundsOnClick, n = this.options.spiderfyOnEveryZoom, o = this._map;
                (t || i || n) && this.off("clusterclick clusterkeypress", this._zoomOrSpiderfy, this), e && (this.off("clustermouseover", this._showCoverage, this), this.off("clustermouseout", this._hideCoverage, this), o.off("zoomend", this._hideCoverage, this))
            }, _zoomEnd: function () {
                this._map && (this._mergeSplitClusters(), this._zoom = Math.round(this._map._zoom), this._currentShownBounds = this._getExpandedVisibleBounds())
            }, _moveEnd: function () {
                var t;
                this._inZoomAnimation || (t = this._getExpandedVisibleBounds(), this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), this._zoom, t), this._topClusterLevel._recursivelyAddChildrenToMap(null, Math.round(this._map._zoom), t), this._currentShownBounds = t)
            }, _generateInitialClusters: function () {
                var t = Math.ceil(this._map.getMaxZoom()), e = Math.floor(this._map.getMinZoom()),
                    i = this.options.maxClusterRadius, n = "function" != typeof i ? function () {
                        return i
                    } : i;
                null !== this.options.disableClusteringAtZoom && (t = this.options.disableClusteringAtZoom - 1), this._maxZoom = t, this._gridClusters = {}, this._gridUnclustered = {};
                for (var o = t; e <= o; o--) this._gridClusters[o] = new L.DistanceGrid(n(o)), this._gridUnclustered[o] = new L.DistanceGrid(n(o));
                this._topClusterLevel = new this._markerCluster(this, e - 1)
            }, _addLayer: function (t, e) {
                var i = this._gridClusters, n = this._gridUnclustered, o = Math.floor(this._map.getMinZoom());
                for (this.options.singleMarkerMode && this._overrideMarkerIcon(t), t.on(this._childMarkerEventHandlers, this); o <= e; e--) {
                    var s = this._map.project(t.getLatLng(), e), r = i[e].getNearObject(s);
                    if (r) return r._addChild(t), void (t.__parent = r);
                    if (r = n[e].getNearObject(s)) {
                        for (var a = r.__parent, l = (a && this._removeLayer(r, !1), new this._markerCluster(this, e, r, t)), h = (i[e].addObject(l, this._map.project(l._cLatLng, e)), r.__parent = l, t.__parent = l), u = e - 1; u > a._zoom; u--) h = new this._markerCluster(this, u, h), i[u].addObject(h, this._map.project(r.getLatLng(), u));
                        return a._addChild(h), void this._removeFromGridUnclustered(r, e)
                    }
                    n[e].addObject(t, s)
                }
                this._topClusterLevel._addChild(t), t.__parent = this._topClusterLevel
            }, _refreshClustersIcons: function () {
                this._featureGroup.eachLayer(function (t) {
                    t instanceof L.MarkerCluster && t._iconNeedsUpdate && t._updateIcon()
                })
            }, _enqueue: function (t) {
                this._queue.push(t), this._queueTimeout || (this._queueTimeout = setTimeout(L.bind(this._processQueue, this), 300))
            }, _processQueue: function () {
                for (var t = 0; t < this._queue.length; t++) this._queue[t].call(this);
                this._queue.length = 0, clearTimeout(this._queueTimeout), this._queueTimeout = null
            }, _mergeSplitClusters: function () {
                var t = Math.round(this._map._zoom);
                this._processQueue(), this._zoom < t && this._currentShownBounds.intersects(this._getExpandedVisibleBounds()) ? (this._animationStart(), this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), this._zoom, this._getExpandedVisibleBounds()), this._animationZoomIn(this._zoom, t)) : this._zoom > t ? (this._animationStart(), this._animationZoomOut(this._zoom, t)) : this._moveEnd()
            }, _getExpandedVisibleBounds: function () {
                return this.options.removeOutsideVisibleBounds ? L.Browser.mobile ? this._checkBoundsMaxLat(this._map.getBounds()) : this._checkBoundsMaxLat(this._map.getBounds().pad(1)) : this._mapBoundsInfinite
            }, _checkBoundsMaxLat: function (t) {
                var e = this._maxLat;
                return void 0 !== e && (t.getNorth() >= e && (t._northEast.lat = 1 / 0), t.getSouth() <= -e) && (t._southWest.lat = -1 / 0), t
            }, _animationAddLayerNonAnimated: function (t, e) {
                e === t ? this._featureGroup.addLayer(t) : 2 === e._childCount ? (e._addToMap(), t = e.getAllChildMarkers(), this._featureGroup.removeLayer(t[0]), this._featureGroup.removeLayer(t[1])) : e._updateIcon()
            }, _extractNonGroupLayers: function (t, e) {
                var i, n = t.getLayers(), o = 0;
                for (e = e || []; o < n.length; o++) (i = n[o]) instanceof L.LayerGroup ? this._extractNonGroupLayers(i, e) : e.push(i);
                return e
            }, _overrideMarkerIcon: function (t) {
                return t.options.icon = this.options.iconCreateFunction({
                    getChildCount: function () {
                        return 1
                    }, getAllChildMarkers: function () {
                        return [t]
                    }
                })
            }
        }),
        i = (L.MarkerClusterGroup.include({_mapBoundsInfinite: new L.LatLngBounds(new L.LatLng(-1 / 0, -1 / 0), new L.LatLng(1 / 0, 1 / 0))}), L.MarkerClusterGroup.include({
            _noAnimation: {
                _animationStart: function () {
                }, _animationZoomIn: function (t, e) {
                    this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), t), this._topClusterLevel._recursivelyAddChildrenToMap(null, e, this._getExpandedVisibleBounds()), this.fire("animationend")
                }, _animationZoomOut: function (t, e) {
                    this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), t), this._topClusterLevel._recursivelyAddChildrenToMap(null, e, this._getExpandedVisibleBounds()), this.fire("animationend")
                }, _animationAddLayer: function (t, e) {
                    this._animationAddLayerNonAnimated(t, e)
                }
            }, _withAnimation: {
                _animationStart: function () {
                    this._map._mapPane.className += " leaflet-cluster-anim", this._inZoomAnimation++
                }, _animationZoomIn: function (o, s) {
                    var r, a = this._getExpandedVisibleBounds(), l = this._featureGroup,
                        t = Math.floor(this._map.getMinZoom());
                    this._ignoreMove = !0, this._topClusterLevel._recursively(a, o, t, function (t) {
                        var e, i = t._latlng, n = t._markers;
                        for (a.contains(i) || (i = null), t._isSingleParent() && o + 1 === s ? (l.removeLayer(t), t._recursivelyAddChildrenToMap(null, s, a)) : (t.clusterHide(), t._recursivelyAddChildrenToMap(i, s, a)), r = n.length - 1; 0 <= r; r--) e = n[r], a.contains(e._latlng) || l.removeLayer(e)
                    }), this._forceLayout(), this._topClusterLevel._recursivelyBecomeVisible(a, s), l.eachLayer(function (t) {
                        t instanceof L.MarkerCluster || !t._icon || t.clusterShow()
                    }), this._topClusterLevel._recursively(a, o, s, function (t) {
                        t._recursivelyRestoreChildPositions(s)
                    }), this._ignoreMove = !1, this._enqueue(function () {
                        this._topClusterLevel._recursively(a, o, t, function (t) {
                            l.removeLayer(t), t.clusterShow()
                        }), this._animationEnd()
                    })
                }, _animationZoomOut: function (t, e) {
                    this._animationZoomOutSingle(this._topClusterLevel, t - 1, e), this._topClusterLevel._recursivelyAddChildrenToMap(null, e, this._getExpandedVisibleBounds()), this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), t, this._getExpandedVisibleBounds())
                }, _animationAddLayer: function (t, e) {
                    var i = this, n = this._featureGroup;
                    n.addLayer(t), e !== t && (2 < e._childCount ? (e._updateIcon(), this._forceLayout(), this._animationStart(), t._setPos(this._map.latLngToLayerPoint(e.getLatLng())), t.clusterHide(), this._enqueue(function () {
                        n.removeLayer(t), t.clusterShow(), i._animationEnd()
                    })) : (this._forceLayout(), i._animationStart(), i._animationZoomOutSingle(e, this._map.getMaxZoom(), this._zoom)))
                }
            }, _animationZoomOutSingle: function (e, i, n) {
                var o = this._getExpandedVisibleBounds(), s = Math.floor(this._map.getMinZoom()),
                    r = (e._recursivelyAnimateChildrenInAndAddSelfToMap(o, s, i + 1, n), this);
                this._forceLayout(), e._recursivelyBecomeVisible(o, n), this._enqueue(function () {
                    var t;
                    1 === e._childCount ? (t = e._markers[0], this._ignoreMove = !0, t.setLatLng(t.getLatLng()), this._ignoreMove = !1, t.clusterShow && t.clusterShow()) : e._recursively(o, n, s, function (t) {
                        t._recursivelyRemoveChildrenFromMap(o, s, i + 1)
                    }), r._animationEnd()
                })
            }, _animationEnd: function () {
                this._map && (this._map._mapPane.className = this._map._mapPane.className.replace(" leaflet-cluster-anim", "")), this._inZoomAnimation--, this.fire("animationend")
            }, _forceLayout: function () {
                L.Util.falseFn(document.body.offsetWidth)
            }
        }), L.markerClusterGroup = function (t) {
            return new L.MarkerClusterGroup(t)
        }, L.MarkerCluster = L.Marker.extend({
            options: L.Icon.prototype.options, initialize: function (t, e, i, n) {
                L.Marker.prototype.initialize.call(this, i ? i._cLatLng || i.getLatLng() : new L.LatLng(0, 0), {
                    icon: this,
                    pane: t.options.clusterPane
                }), this._group = t, this._zoom = e, this._markers = [], this._childClusters = [], this._childCount = 0, this._iconNeedsUpdate = !0, this._boundsNeedUpdate = !0, this._bounds = new L.LatLngBounds, i && this._addChild(i), n && this._addChild(n)
            }, getAllChildMarkers: function (t, e) {
                t = t || [];
                for (var i = this._childClusters.length - 1; 0 <= i; i--) this._childClusters[i].getAllChildMarkers(t, e);
                for (var n = this._markers.length - 1; 0 <= n; n--) e && this._markers[n].__dragStart || t.push(this._markers[n]);
                return t
            }, getChildCount: function () {
                return this._childCount
            }, zoomToBounds: function (t) {
                for (var e = this._childClusters.slice(), i = this._group._map, n = i.getBoundsZoom(this._bounds), o = this._zoom + 1, i = i.getZoom(); 0 < e.length && o < n;) {
                    o++;
                    for (var s = [], r = 0; r < e.length; r++) s = s.concat(e[r]._childClusters);
                    e = s
                }
                o < n ? this._group._map.setView(this._latlng, o) : n <= i ? this._group._map.setView(this._latlng, i + 1) : this._group._map.fitBounds(this._bounds, t)
            }, getBounds: function () {
                var t = new L.LatLngBounds;
                return t.extend(this._bounds), t
            }, _updateIcon: function () {
                this._iconNeedsUpdate = !0, this._icon && this.setIcon(this)
            }, createIcon: function () {
                return this._iconNeedsUpdate && (this._iconObj = this._group.options.iconCreateFunction(this), this._iconNeedsUpdate = !1), this._iconObj.createIcon()
            }, createShadow: function () {
                return this._iconObj.createShadow()
            }, _addChild: function (t, e) {
                this._iconNeedsUpdate = !0, this._boundsNeedUpdate = !0, this._setClusterCenter(t), t instanceof L.MarkerCluster ? (e || (this._childClusters.push(t), t.__parent = this), this._childCount += t._childCount) : (e || this._markers.push(t), this._childCount++), this.__parent && this.__parent._addChild(t, !0)
            }, _setClusterCenter: function (t) {
                this._cLatLng || (this._cLatLng = t._cLatLng || t._latlng)
            }, _resetBounds: function () {
                var t = this._bounds;
                t._southWest && (t._southWest.lat = 1 / 0, t._southWest.lng = 1 / 0), t._northEast && (t._northEast.lat = -1 / 0, t._northEast.lng = -1 / 0)
            }, _recalculateBounds: function () {
                var t, e, i, n = this._markers, o = this._childClusters, s = 0, r = 0, a = this._childCount;
                if (0 !== a) {
                    for (this._resetBounds(), t = 0; t < n.length; t++) e = n[t]._latlng, this._bounds.extend(e), s += e.lat, r += e.lng;
                    for (t = 0; t < o.length; t++) (i = o[t])._boundsNeedUpdate && i._recalculateBounds(), this._bounds.extend(i._bounds), e = i._wLatLng, i = i._childCount, s += e.lat * i, r += e.lng * i;
                    this._latlng = this._wLatLng = new L.LatLng(s / a, r / a), this._boundsNeedUpdate = !1
                }
            }, _addToMap: function (t) {
                t && (this._backupLatlng = this._latlng, this.setLatLng(t)), this._group._featureGroup.addLayer(this)
            }, _recursivelyAnimateChildrenIn: function (t, o, e) {
                this._recursively(t, this._group._map.getMinZoom(), e - 1, function (t) {
                    for (var e, i = t._markers, n = i.length - 1; 0 <= n; n--) (e = i[n])._icon && (e._setPos(o), e.clusterHide())
                }, function (t) {
                    for (var e, i = t._childClusters, n = i.length - 1; 0 <= n; n--) (e = i[n])._icon && (e._setPos(o), e.clusterHide())
                })
            }, _recursivelyAnimateChildrenInAndAddSelfToMap: function (e, i, n, o) {
                this._recursively(e, o, i, function (t) {
                    t._recursivelyAnimateChildrenIn(e, t._group._map.latLngToLayerPoint(t.getLatLng()).round(), n), t._isSingleParent() && n - 1 === o ? (t.clusterShow(), t._recursivelyRemoveChildrenFromMap(e, i, n)) : t.clusterHide(), t._addToMap()
                })
            }, _recursivelyBecomeVisible: function (t, e) {
                this._recursively(t, this._group._map.getMinZoom(), e, null, function (t) {
                    t.clusterShow()
                })
            }, _recursivelyAddChildrenToMap: function (n, o, s) {
                this._recursively(s, this._group._map.getMinZoom() - 1, o, function (t) {
                    if (o !== t._zoom) for (var e = t._markers.length - 1; 0 <= e; e--) {
                        var i = t._markers[e];
                        s.contains(i._latlng) && (n && (i._backupLatlng = i.getLatLng(), i.setLatLng(n), i.clusterHide) && i.clusterHide(), t._group._featureGroup.addLayer(i))
                    }
                }, function (t) {
                    t._addToMap(n)
                })
            }, _recursivelyRestoreChildPositions: function (t) {
                for (var e = this._markers.length - 1; 0 <= e; e--) {
                    var i = this._markers[e];
                    i._backupLatlng && (i.setLatLng(i._backupLatlng), delete i._backupLatlng)
                }
                if (t - 1 === this._zoom) for (var n = this._childClusters.length - 1; 0 <= n; n--) this._childClusters[n]._restorePosition(); else for (var o = this._childClusters.length - 1; 0 <= o; o--) this._childClusters[o]._recursivelyRestoreChildPositions(t)
            }, _restorePosition: function () {
                this._backupLatlng && (this.setLatLng(this._backupLatlng), delete this._backupLatlng)
            }, _recursivelyRemoveChildrenFromMap: function (t, e, i, n) {
                var o, s;
                this._recursively(t, e - 1, i - 1, function (t) {
                    for (s = t._markers.length - 1; 0 <= s; s--) o = t._markers[s], n && n.contains(o._latlng) || (t._group._featureGroup.removeLayer(o), o.clusterShow && o.clusterShow())
                }, function (t) {
                    for (s = t._childClusters.length - 1; 0 <= s; s--) o = t._childClusters[s], n && n.contains(o._latlng) || (t._group._featureGroup.removeLayer(o), o.clusterShow && o.clusterShow())
                })
            }, _recursively: function (t, e, i, n, o) {
                var s, r, a = this._childClusters, l = this._zoom;
                if (e <= l && (n && n(this), o) && l === i && o(this), l < e || l < i) for (s = a.length - 1; 0 <= s; s--) (r = a[s])._boundsNeedUpdate && r._recalculateBounds(), t.intersects(r._bounds) && r._recursively(t, e, i, n, o)
            }, _isSingleParent: function () {
                return 0 < this._childClusters.length && this._childClusters[0]._childCount === this._childCount
            }
        }));
    L.Marker.include({
        clusterHide: function () {
            var t = this.options.opacity;
            return this.setOpacity(0), this.options.opacity = t, this
        }, clusterShow: function () {
            return this.setOpacity(this.options.opacity)
        }
    }), L.DistanceGrid = function (t) {
        this._cellSize = t, this._sqCellSize = t * t, this._grid = {}, this._objectPoint = {}
    }, L.DistanceGrid.prototype = {
        addObject: function (t, e) {
            var i = this._getCoord(e.x), n = this._getCoord(e.y), o = this._grid, o = o[n] = o[n] || {},
                n = o[i] = o[i] || [], o = L.Util.stamp(t);
            this._objectPoint[o] = e, n.push(t)
        }, updateObject: function (t, e) {
            this.removeObject(t), this.addObject(t, e)
        }, removeObject: function (t, e) {
            var i, n, o = this._getCoord(e.x), e = this._getCoord(e.y), s = this._grid, r = s[e] = s[e] || {},
                a = r[o] = r[o] || [];
            for (delete this._objectPoint[L.Util.stamp(t)], i = 0, n = a.length; i < n; i++) if (a[i] === t) return a.splice(i, 1), 1 === n && delete r[o], !0
        }, eachObject: function (t, e) {
            var i, n, o, s, r, a, l = this._grid;
            for (i in l) for (n in r = l[i]) for (o = 0, s = (a = r[n]).length; o < s; o++) t.call(e, a[o]) && (o--, s--)
        }, getNearObject: function (t) {
            for (var e, i, n, o, s, r, a, l = this._getCoord(t.x), h = this._getCoord(t.y), u = this._objectPoint, c = this._sqCellSize, d = null, p = h - 1; p <= h + 1; p++) if (n = this._grid[p]) for (e = l - 1; e <= l + 1; e++) if (o = n[e]) for (i = 0, s = o.length; i < s; i++) r = o[i], ((a = this._sqDist(u[L.Util.stamp(r)], t)) < c || a <= c && null === d) && (c = a, d = r);
            return d
        }, _getCoord: function (t) {
            var e = Math.floor(t / this._cellSize);
            return isFinite(e) ? e : t
        }, _sqDist: function (t, e) {
            var i = e.x - t.x, e = e.y - t.y;
            return i * i + e * e
        }
    }, L.QuickHull = {
        getDistant: function (t, e) {
            var i = e[1].lat - e[0].lat;
            return (e[0].lng - e[1].lng) * (t.lat - e[0].lat) + i * (t.lng - e[0].lng)
        }, findMostDistantPointFromBaseLine: function (t, e) {
            for (var i, n, o = 0, s = null, r = [], a = e.length - 1; 0 <= a; a--) i = e[a], 0 < (n = this.getDistant(i, t)) && (r.push(i), o < n) && (o = n, s = i);
            return {maxPoint: s, newPoints: r}
        }, buildConvexHull: function (t, e) {
            var i = [], e = this.findMostDistantPointFromBaseLine(t, e);
            return e.maxPoint ? (i = i.concat(this.buildConvexHull([t[0], e.maxPoint], e.newPoints))).concat(this.buildConvexHull([e.maxPoint, t[1]], e.newPoints)) : [t[0]]
        }, getConvexHull: function (t) {
            for (var e, i = !1, n = !1, o = !1, s = !1, r = null, a = null, l = null, h = null, u = null, c = t.length - 1; 0 <= c; c--) {
                var d = t[c];
                (!1 === i || d.lat > i) && (i = (r = d).lat), (!1 === n || d.lat < n) && (n = (a = d).lat), (!1 === o || d.lng > o) && (o = (l = d).lng), (!1 === s || d.lng < s) && (s = (h = d).lng)
            }
            return e = n !== i ? (u = a, r) : (u = h, l), [].concat(this.buildConvexHull([u, e], t), this.buildConvexHull([e, u], t))
        }
    }, L.MarkerCluster.include({
        getConvexHull: function () {
            for (var t, e = this.getAllChildMarkers(), i = [], n = e.length - 1; 0 <= n; n--) t = e[n].getLatLng(), i.push(t);
            return L.QuickHull.getConvexHull(i)
        }
    }), L.MarkerCluster.include({
        _2PI: 2 * Math.PI,
        _circleFootSeparation: 25,
        _circleStartAngle: 0,
        _spiralFootSeparation: 28,
        _spiralLengthStart: 11,
        _spiralLengthFactor: 5,
        _circleSpiralSwitchover: 9,
        spiderfy: function () {
            var t, e;
            this._group._spiderfied === this || this._group._inZoomAnimation || (t = this.getAllChildMarkers(null, !0), e = this._group._map.latLngToLayerPoint(this._latlng), this._group._unspiderfy(), e = (this._group._spiderfied = this)._group.options.spiderfyShapePositions ? this._group.options.spiderfyShapePositions(t.length, e) : t.length >= this._circleSpiralSwitchover ? this._generatePointsSpiral(t.length, e) : (e.y += 10, this._generatePointsCircle(t.length, e)), this._animationSpiderfy(t, e))
        },
        unspiderfy: function (t) {
            this._group._inZoomAnimation || (this._animationUnspiderfy(t), this._group._spiderfied = null)
        },
        _generatePointsCircle: function (t, e) {
            var i, n,
                o = this._group.options.spiderfyDistanceMultiplier * this._circleFootSeparation * (2 + t) / this._2PI,
                s = this._2PI / t, r = [], o = Math.max(o, 35);
            for (r.length = t, i = 0; i < t; i++) n = this._circleStartAngle + i * s, r[i] = new L.Point(e.x + o * Math.cos(n), e.y + o * Math.sin(n))._round();
            return r
        },
        _generatePointsSpiral: function (t, e) {
            for (var i = this._group.options.spiderfyDistanceMultiplier, n = i * this._spiralLengthStart, o = i * this._spiralFootSeparation, s = i * this._spiralLengthFactor * this._2PI, r = 0, a = [], l = a.length = t; 0 <= l; l--) l < t && (a[l] = new L.Point(e.x + n * Math.cos(r), e.y + n * Math.sin(r))._round()), n += s / (r += o / n + 5e-4 * l);
            return a
        },
        _noanimationUnspiderfy: function () {
            var t, e, i = this._group, n = i._map, o = i._featureGroup, s = this.getAllChildMarkers(null, !0);
            for (i._ignoreMove = !0, this.setOpacity(1), e = s.length - 1; 0 <= e; e--) t = s[e], o.removeLayer(t), t._preSpiderfyLatlng && (t.setLatLng(t._preSpiderfyLatlng), delete t._preSpiderfyLatlng), t.setZIndexOffset && t.setZIndexOffset(0), t._spiderLeg && (n.removeLayer(t._spiderLeg), delete t._spiderLeg);
            i.fire("unspiderfied", {cluster: this, markers: s}), i._ignoreMove = !1, i._spiderfied = null
        }
    }), L.MarkerClusterNonAnimated = L.MarkerCluster.extend({
        _animationSpiderfy: function (t, e) {
            var i, n, o, s, r = this._group, a = r._map, l = r._featureGroup,
                h = this._group.options.spiderLegPolylineOptions;
            for (r._ignoreMove = !0, i = 0; i < t.length; i++) s = a.layerPointToLatLng(e[i]), n = t[i], o = new L.Polyline([this._latlng, s], h), a.addLayer(o), n._spiderLeg = o, n._preSpiderfyLatlng = n._latlng, n.setLatLng(s), n.setZIndexOffset && n.setZIndexOffset(1e6), l.addLayer(n);
            this.setOpacity(.3), r._ignoreMove = !1, r.fire("spiderfied", {cluster: this, markers: t})
        }, _animationUnspiderfy: function () {
            this._noanimationUnspiderfy()
        }
    }), L.MarkerCluster.include({
        _animationSpiderfy: function (t, e) {
            var i, n, o, s, r, a, l = this, h = this._group, u = h._map, c = h._featureGroup, d = this._latlng,
                p = u.latLngToLayerPoint(d), f = L.Path.SVG,
                m = L.extend({}, this._group.options.spiderLegPolylineOptions), _ = m.opacity;
            for (void 0 === _ && (_ = L.MarkerClusterGroup.prototype.options.spiderLegPolylineOptions.opacity), f ? (m.opacity = 0, m.className = (m.className || "") + " leaflet-cluster-spider-leg") : m.opacity = _, h._ignoreMove = !0, i = 0; i < t.length; i++) n = t[i], a = u.layerPointToLatLng(e[i]), o = new L.Polyline([d, a], m), u.addLayer(o), n._spiderLeg = o, f && (r = (s = o._path).getTotalLength() + .1, s.style.strokeDasharray = r, s.style.strokeDashoffset = r), n.setZIndexOffset && n.setZIndexOffset(1e6), n.clusterHide && n.clusterHide(), c.addLayer(n), n._setPos && n._setPos(p);
            for (h._forceLayout(), h._animationStart(), i = t.length - 1; 0 <= i; i--) a = u.layerPointToLatLng(e[i]), (n = t[i])._preSpiderfyLatlng = n._latlng, n.setLatLng(a), n.clusterShow && n.clusterShow(), f && ((s = (o = n._spiderLeg)._path).style.strokeDashoffset = 0, o.setStyle({opacity: _}));
            this.setOpacity(.3), h._ignoreMove = !1, setTimeout(function () {
                h._animationEnd(), h.fire("spiderfied", {cluster: l, markers: t})
            }, 200)
        }, _animationUnspiderfy: function (t) {
            var e, i, n, o, s, r = this, a = this._group, l = a._map, h = a._featureGroup,
                u = t ? l._latLngToNewLayerPoint(this._latlng, t.zoom, t.center) : l.latLngToLayerPoint(this._latlng),
                c = this.getAllChildMarkers(null, !0), d = L.Path.SVG;
            for (a._ignoreMove = !0, a._animationStart(), this.setOpacity(1), i = c.length - 1; 0 <= i; i--) (e = c[i])._preSpiderfyLatlng && (e.closePopup(), e.setLatLng(e._preSpiderfyLatlng), delete e._preSpiderfyLatlng, s = !0, e._setPos && (e._setPos(u), s = !1), e.clusterHide && (e.clusterHide(), s = !1), s && h.removeLayer(e), d) && (o = (n = (s = e._spiderLeg)._path).getTotalLength() + .1, n.style.strokeDashoffset = o, s.setStyle({opacity: 0}));
            a._ignoreMove = !1, setTimeout(function () {
                var t = 0;
                for (i = c.length - 1; 0 <= i; i--) (e = c[i])._spiderLeg && t++;
                for (i = c.length - 1; 0 <= i; i--) (e = c[i])._spiderLeg && (e.clusterShow && e.clusterShow(), e.setZIndexOffset && e.setZIndexOffset(0), 1 < t && h.removeLayer(e), l.removeLayer(e._spiderLeg), delete e._spiderLeg);
                a._animationEnd(), a.fire("unspiderfied", {cluster: r, markers: c})
            }, 200)
        }
    }), L.MarkerClusterGroup.include({
        _spiderfied: null, unspiderfy: function () {
            this._unspiderfy.apply(this, arguments)
        }, _spiderfierOnAdd: function () {
            this._map.on("click", this._unspiderfyWrapper, this), this._map.options.zoomAnimation && this._map.on("zoomstart", this._unspiderfyZoomStart, this), this._map.on("zoomend", this._noanimationUnspiderfy, this), L.Browser.touch || this._map.getRenderer(this)
        }, _spiderfierOnRemove: function () {
            this._map.off("click", this._unspiderfyWrapper, this), this._map.off("zoomstart", this._unspiderfyZoomStart, this), this._map.off("zoomanim", this._unspiderfyZoomAnim, this), this._map.off("zoomend", this._noanimationUnspiderfy, this), this._noanimationUnspiderfy()
        }, _unspiderfyZoomStart: function () {
            this._map && this._map.on("zoomanim", this._unspiderfyZoomAnim, this)
        }, _unspiderfyZoomAnim: function (t) {
            L.DomUtil.hasClass(this._map._mapPane, "leaflet-touching") || (this._map.off("zoomanim", this._unspiderfyZoomAnim, this), this._unspiderfy(t))
        }, _unspiderfyWrapper: function () {
            this._unspiderfy()
        }, _unspiderfy: function (t) {
            this._spiderfied && this._spiderfied.unspiderfy(t)
        }, _noanimationUnspiderfy: function () {
            this._spiderfied && this._spiderfied._noanimationUnspiderfy()
        }, _unspiderfyLayer: function (t) {
            t._spiderLeg && (this._featureGroup.removeLayer(t), t.clusterShow && t.clusterShow(), t.setZIndexOffset && t.setZIndexOffset(0), this._map.removeLayer(t._spiderLeg), delete t._spiderLeg)
        }
    }), L.MarkerClusterGroup.include({
        refreshClusters: function (t) {
            return t ? t instanceof L.MarkerClusterGroup ? t = t._topClusterLevel.getAllChildMarkers() : t instanceof L.LayerGroup ? t = t._layers : t instanceof L.MarkerCluster ? t = t.getAllChildMarkers() : t instanceof L.Marker && (t = [t]) : t = this._topClusterLevel.getAllChildMarkers(), this._flagParentsIconsNeedUpdate(t), this._refreshClustersIcons(), this.options.singleMarkerMode && this._refreshSingleMarkerModeMarkers(t), this
        }, _flagParentsIconsNeedUpdate: function (t) {
            var e, i;
            for (e in t) for (i = t[e].__parent; i;) i._iconNeedsUpdate = !0, i = i.__parent
        }, _refreshSingleMarkerModeMarkers: function (t) {
            var e, i;
            for (e in t) i = t[e], this.hasLayer(i) && i.setIcon(this._overrideMarkerIcon(i))
        }
    }), L.Marker.include({
        refreshIconOptions: function (t, e) {
            var i = this.options.icon;
            return L.setOptions(i, t), this.setIcon(i), e && this.__parent && this.__parent._group.refreshClusters(this), this
        }
    }), t.MarkerClusterGroup = e, t.MarkerCluster = i, Object.defineProperty(t, "__esModule", {value: !0})
}), (() => {
    var i = {
        8552: (t, e, i) => {
            i = i(852)(i(5639), "DataView");
            t.exports = i
        }, 1989: (t, e, i) => {
            var n = i(1789), o = i(401), s = i(7667), r = i(1327), i = i(1866);

            function a(t) {
                var e = -1, i = null == t ? 0 : t.length;
                for (this.clear(); ++e < i;) {
                    var n = t[e];
                    this.set(n[0], n[1])
                }
            }

            a.prototype.clear = n, a.prototype.delete = o, a.prototype.get = s, a.prototype.has = r, a.prototype.set = i, t.exports = a
        }, 8407: (t, e, i) => {
            var n = i(7040), o = i(4125), s = i(2117), r = i(7518), i = i(4705);

            function a(t) {
                var e = -1, i = null == t ? 0 : t.length;
                for (this.clear(); ++e < i;) {
                    var n = t[e];
                    this.set(n[0], n[1])
                }
            }

            a.prototype.clear = n, a.prototype.delete = o, a.prototype.get = s, a.prototype.has = r, a.prototype.set = i, t.exports = a
        }, 7071: (t, e, i) => {
            i = i(852)(i(5639), "Map");
            t.exports = i
        }, 3369: (t, e, i) => {
            var n = i(4785), o = i(1285), s = i(6e3), r = i(9916), i = i(5265);

            function a(t) {
                var e = -1, i = null == t ? 0 : t.length;
                for (this.clear(); ++e < i;) {
                    var n = t[e];
                    this.set(n[0], n[1])
                }
            }

            a.prototype.clear = n, a.prototype.delete = o, a.prototype.get = s, a.prototype.has = r, a.prototype.set = i, t.exports = a
        }, 3818: (t, e, i) => {
            i = i(852)(i(5639), "Promise");
            t.exports = i
        }, 8525: (t, e, i) => {
            i = i(852)(i(5639), "Set");
            t.exports = i
        }, 8668: (t, e, i) => {
            var n = i(3369), o = i(619), i = i(2385);

            function s(t) {
                var e = -1, i = null == t ? 0 : t.length;
                for (this.__data__ = new n; ++e < i;) this.add(t[e])
            }

            s.prototype.add = s.prototype.push = o, s.prototype.has = i, t.exports = s
        }, 6384: (t, e, i) => {
            var n = i(8407), o = i(7465), s = i(3779), r = i(7599), a = i(4758), i = i(4309);

            function l(t) {
                t = this.__data__ = new n(t);
                this.size = t.size
            }

            l.prototype.clear = o, l.prototype.delete = s, l.prototype.get = r, l.prototype.has = a, l.prototype.set = i, t.exports = l
        }, 2705: (t, e, i) => {
            i = i(5639).Symbol;
            t.exports = i
        }, 1149: (t, e, i) => {
            i = i(5639).Uint8Array;
            t.exports = i
        }, 577: (t, e, i) => {
            i = i(852)(i(5639), "WeakMap");
            t.exports = i
        }, 6874: t => {
            t.exports = function (t, e, i) {
                switch (i.length) {
                    case 0:
                        return t.call(e);
                    case 1:
                        return t.call(e, i[0]);
                    case 2:
                        return t.call(e, i[0], i[1]);
                    case 3:
                        return t.call(e, i[0], i[1], i[2])
                }
                return t.apply(e, i)
            }
        }, 4963: t => {
            t.exports = function (t, e) {
                for (var i = -1, n = null == t ? 0 : t.length, o = 0, s = []; ++i < n;) {
                    var r = t[i];
                    e(r, i, t) && (s[o++] = r)
                }
                return s
            }
        }, 7443: (t, e, i) => {
            var n = i(2118);
            t.exports = function (t, e) {
                return !(null == t || !t.length) && -1 < n(t, e, 0)
            }
        }, 1196: t => {
            t.exports = function (t, e, i) {
                for (var n = -1, o = null == t ? 0 : t.length; ++n < o;) if (i(e, t[n])) return !0;
                return !1
            }
        }, 4636: (t, e, i) => {
            var u = i(2545), c = i(5694), d = i(1469), p = i(4144), f = i(5776), m = i(6719),
                _ = Object.prototype.hasOwnProperty;
            t.exports = function (t, e) {
                var i, n = d(t), o = !n && c(t), s = !n && !o && p(t), r = !n && !o && !s && m(t), a = n || o || s || r,
                    l = a ? u(t.length, String) : [], h = l.length;
                for (i in t) !e && !_.call(t, i) || a && ("length" == i || s && ("offset" == i || "parent" == i) || r && ("buffer" == i || "byteLength" == i || "byteOffset" == i) || f(i, h)) || l.push(i);
                return l
            }
        }, 9932: t => {
            t.exports = function (t, e) {
                for (var i = -1, n = null == t ? 0 : t.length, o = Array(n); ++i < n;) o[i] = e(t[i], i, t);
                return o
            }
        }, 2488: t => {
            t.exports = function (t, e) {
                for (var i = -1, n = e.length, o = t.length; ++i < n;) t[o + i] = e[i];
                return t
            }
        }, 2663: t => {
            t.exports = function (t, e, i, n) {
                var o = -1, s = null == t ? 0 : t.length;
                for (n && s && (i = t[++o]); ++o < s;) i = e(i, t[o], o, t);
                return i
            }
        }, 2908: t => {
            t.exports = function (t, e) {
                for (var i = -1, n = null == t ? 0 : t.length; ++i < n;) if (e(t[i], i, t)) return !0;
                return !1
            }
        }, 4286: t => {
            t.exports = function (t) {
                return t.split("")
            }
        }, 9029: t => {
            var e = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
            t.exports = function (t) {
                return t.match(e) || []
            }
        }, 4865: (t, e, i) => {
            var o = i(9465), s = i(7813), r = Object.prototype.hasOwnProperty;
            t.exports = function (t, e, i) {
                var n = t[e];
                r.call(t, e) && s(n, i) && (void 0 !== i || e in t) || o(t, e, i)
            }
        }, 8470: (t, e, i) => {
            var n = i(7813);
            t.exports = function (t, e) {
                for (var i = t.length; i--;) if (n(t[i][0], e)) return i;
                return -1
            }
        }, 9465: (t, e, i) => {
            var n = i(8777);
            t.exports = function (t, e, i) {
                "__proto__" == e && n ? n(t, e, {configurable: !0, enumerable: !0, value: i, writable: !0}) : t[e] = i
            }
        }, 9881: (t, e, i) => {
            var n = i(7816), i = i(9291)(n);
            t.exports = i
        }, 1848: t => {
            t.exports = function (t, e, i, n) {
                for (var o = t.length, s = i + (n ? 1 : -1); n ? s-- : ++s < o;) if (e(t[s], s, t)) return s;
                return -1
            }
        }, 1078: (t, e, i) => {
            var h = i(2488), u = i(7285);
            t.exports = function t(e, i, n, o, s) {
                var r = -1, a = e.length;
                for (n = n || u, s = s || []; ++r < a;) {
                    var l = e[r];
                    0 < i && n(l) ? 1 < i ? t(l, i - 1, n, o, s) : h(s, l) : o || (s[s.length] = l)
                }
                return s
            }
        }, 8483: (t, e, i) => {
            i = i(5063)();
            t.exports = i
        }, 7816: (t, e, i) => {
            var n = i(8483), o = i(3674);
            t.exports = function (t, e) {
                return t && n(t, e, o)
            }
        }, 7786: (t, e, i) => {
            var o = i(1811), s = i(327);
            t.exports = function (t, e) {
                for (var i = 0, n = (e = o(e, t)).length; null != t && i < n;) t = t[s(e[i++])];
                return i && i == n ? t : void 0
            }
        }, 8866: (t, e, i) => {
            var n = i(2488), o = i(1469);
            t.exports = function (t, e, i) {
                e = e(t);
                return o(t) ? e : n(e, i(t))
            }
        }, 4239: (t, e, i) => {
            var n = i(2705), o = i(9607), s = i(2333), r = n ? n.toStringTag : void 0;
            t.exports = function (t) {
                return null == t ? void 0 === t ? "[object Undefined]" : "[object Null]" : (r && r in Object(t) ? o : s)(t)
            }
        }, 8565: t => {
            var i = Object.prototype.hasOwnProperty;
            t.exports = function (t, e) {
                return null != t && i.call(t, e)
            }
        }, 13: t => {
            t.exports = function (t, e) {
                return null != t && e in Object(t)
            }
        }, 2118: (t, e, i) => {
            var n = i(1848), o = i(2722), s = i(2351);
            t.exports = function (t, e, i) {
                return e == e ? s(t, e, i) : n(t, o, i)
            }
        }, 9454: (t, e, i) => {
            var n = i(4239), o = i(7005);
            t.exports = function (t) {
                return o(t) && "[object Arguments]" == n(t)
            }
        }, 939: (t, e, i) => {
            var r = i(2492), a = i(7005);
            t.exports = function t(e, i, n, o, s) {
                return e === i || (null == e || null == i || !a(e) && !a(i) ? e != e && i != i : r(e, i, n, o, t, s))
            }
        }, 2492: (t, e, i) => {
            var c = i(6384), d = i(7114), p = i(8351), f = i(6096), m = i(4160), _ = i(1469), g = i(4144), v = i(6719),
                y = "[object Arguments]", b = "[object Array]", L = "[object Object]",
                x = Object.prototype.hasOwnProperty;
            t.exports = function (t, e, i, n, o, s) {
                var r = _(t), a = _(e), l = r ? b : m(t), a = a ? b : m(e), h = (l = l == y ? L : l) == L,
                    u = (a = a == y ? L : a) == L, a = l == a;
                if (a && g(t)) {
                    if (!g(e)) return !1;
                    h = !(r = !0)
                }
                if (a && !h) return s = s || new c, r || v(t) ? d(t, e, i, n, o, s) : p(t, e, l, i, n, o, s);
                if (!(1 & i)) {
                    r = h && x.call(t, "__wrapped__"), l = u && x.call(e, "__wrapped__");
                    if (r || l) return o(r ? t.value() : t, l ? e.value() : e, i, n, s = s || new c)
                }
                return !!a && (s = s || new c, f(t, e, i, n, o, s))
            }
        }, 2958: (t, e, i) => {
            var p = i(6384), f = i(939);
            t.exports = function (t, e, i, n) {
                var o = i.length, s = o, r = !n;
                if (null == t) return !s;
                for (t = Object(t); o--;) {
                    var a = i[o];
                    if (r && a[2] ? a[1] !== t[a[0]] : !(a[0] in t)) return !1
                }
                for (; ++o < s;) {
                    var l = (a = i[o])[0], h = t[l], u = a[1];
                    if (r && a[2]) {
                        if (void 0 === h && !(l in t)) return !1
                    } else {
                        var c, d = new p;
                        if (!(void 0 === (c = n ? n(h, u, l, t, e, d) : c) ? f(u, h, 3, n, d) : c)) return !1
                    }
                }
                return !0
            }
        }, 2722: t => {
            t.exports = function (t) {
                return t != t
            }
        }, 8458: (t, e, i) => {
            var n = i(3560), o = i(5346), s = i(3218), r = i(346), a = /^\[object .+?Constructor\]$/,
                i = Function.prototype, l = Object.prototype, i = i.toString, l = l.hasOwnProperty,
                h = RegExp("^" + i.call(l).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
            t.exports = function (t) {
                return !(!s(t) || o(t)) && (n(t) ? h : a).test(r(t))
            }
        }, 8749: (t, e, i) => {
            var n = i(4239), o = i(1780), s = i(7005), r = {};
            r["[object Float32Array]"] = r["[object Float64Array]"] = r["[object Int8Array]"] = r["[object Int16Array]"] = r["[object Int32Array]"] = r["[object Uint8Array]"] = r["[object Uint8ClampedArray]"] = r["[object Uint16Array]"] = r["[object Uint32Array]"] = !0, r["[object Arguments]"] = r["[object Array]"] = r["[object ArrayBuffer]"] = r["[object Boolean]"] = r["[object DataView]"] = r["[object Date]"] = r["[object Error]"] = r["[object Function]"] = r["[object Map]"] = r["[object Number]"] = r["[object Object]"] = r["[object RegExp]"] = r["[object Set]"] = r["[object String]"] = r["[object WeakMap]"] = !1, t.exports = function (t) {
                return s(t) && o(t.length) && !!r[n(t)]
            }
        }, 7206: (t, e, i) => {
            var n = i(1573), o = i(6432), s = i(6557), r = i(1469), a = i(9601);
            t.exports = function (t) {
                return "function" == typeof t ? t : null == t ? s : "object" == typeof t ? r(t) ? o(t[0], t[1]) : n(t) : a(t)
            }
        }, 280: (t, e, i) => {
            var n = i(5726), o = i(6916), s = Object.prototype.hasOwnProperty;
            t.exports = function (t) {
                if (!n(t)) return o(t);
                var e, i = [];
                for (e in Object(t)) s.call(t, e) && "constructor" != e && i.push(e);
                return i
            }
        }, 9199: (t, e, i) => {
            var r = i(9881), a = i(8612);
            t.exports = function (t, n) {
                var o = -1, s = a(t) ? Array(t.length) : [];
                return r(t, function (t, e, i) {
                    s[++o] = n(t, e, i)
                }), s
            }
        }, 1573: (t, e, i) => {
            var n = i(2958), o = i(1499), s = i(2634);
            t.exports = function (e) {
                var i = o(e);
                return 1 == i.length && i[0][2] ? s(i[0][0], i[0][1]) : function (t) {
                    return t === e || n(t, e, i)
                }
            }
        }, 6432: (t, e, i) => {
            var o = i(939), s = i(7361), r = i(9095), a = i(5403), l = i(9162), h = i(2634), u = i(327);
            t.exports = function (i, n) {
                return a(i) && l(n) ? h(u(i), n) : function (t) {
                    var e = s(t, i);
                    return void 0 === e && e === n ? r(t, i) : o(n, e, 3)
                }
            }
        }, 9556: (t, e, i) => {
            var s = i(9932), r = i(7786), a = i(7206), l = i(9199), h = i(1131), u = i(1717), c = i(5022), d = i(6557),
                p = i(1469);
            t.exports = function (t, n, i) {
                n = n.length ? s(n, function (e) {
                    return p(e) ? function (t) {
                        return r(t, 1 === e.length ? e[0] : e)
                    } : e
                }) : [d];
                var o = -1, t = (n = s(n, u(a)), l(t, function (e, t, i) {
                    return {
                        criteria: s(n, function (t) {
                            return t(e)
                        }), index: ++o, value: e
                    }
                }));
                return h(t, function (t, e) {
                    return c(t, e, i)
                })
            }
        }, 371: t => {
            t.exports = function (e) {
                return function (t) {
                    return null == t ? void 0 : t[e]
                }
            }
        }, 9152: (t, e, i) => {
            var n = i(7786);
            t.exports = function (e) {
                return function (t) {
                    return n(t, e)
                }
            }
        }, 8674: t => {
            t.exports = function (e) {
                return function (t) {
                    return null == e ? void 0 : e[t]
                }
            }
        }, 98: t => {
            var a = Math.ceil, l = Math.max;
            t.exports = function (t, e, i, n) {
                for (var o = -1, s = l(a((e - t) / (i || 1)), 0), r = Array(s); s--;) r[n ? s : ++o] = t, t += i;
                return r
            }
        }, 8190: t => {
            var n = Math.floor;
            t.exports = function (t, e) {
                var i = "";
                if (!(!t || e < 1 || 9007199254740991 < e)) for (; e % 2 && (i += t), (e = n(e / 2)) && (t += t), e;) ;
                return i
            }
        }, 5976: (t, e, i) => {
            var n = i(6557), o = i(5357), s = i(61);
            t.exports = function (t, e) {
                return s(o(t, e, n), t + "")
            }
        }, 611: (t, e, i) => {
            var c = i(4865), d = i(1811), p = i(5776), f = i(3218), m = i(327);
            t.exports = function (t, e, i, n) {
                if (f(t)) for (var o = -1, s = (e = d(e, t)).length, r = s - 1, a = t; null != a && ++o < s;) {
                    var l, h = m(e[o]), u = i;
                    if ("__proto__" === h || "constructor" === h || "prototype" === h) return t;
                    o != r && (l = a[h], void 0 === (u = n ? n(l, h, a) : void 0)) && (u = f(l) ? l : p(e[o + 1]) ? [] : {}), c(a, h, u), a = a[h]
                }
                return t
            }
        }, 6560: (t, e, i) => {
            var n = i(5703), o = i(8777), i = i(6557);
            t.exports = o ? function (t, e) {
                return o(t, "toString", {configurable: !0, enumerable: !1, value: n(e), writable: !0})
            } : i
        }, 4259: t => {
            t.exports = function (t, e, i) {
                var n = -1, o = t.length;
                (i = o < i ? o : i) < 0 && (i += o), o = i < (e = e < 0 ? o < -e ? 0 : o + e : e) ? 0 : i - e >>> 0, e >>>= 0;
                for (var s = Array(o); ++n < o;) s[n] = t[n + e];
                return s
            }
        }, 1131: t => {
            t.exports = function (t, e) {
                var i = t.length;
                for (t.sort(e); i--;) t[i] = t[i].value;
                return t
            }
        }, 2545: t => {
            t.exports = function (t, e) {
                for (var i = -1, n = Array(t); ++i < t;) n[i] = e(i);
                return n
            }
        }, 531: (t, e, i) => {
            var n = i(2705), o = i(9932), s = i(1469), r = i(3448), i = n ? n.prototype : void 0,
                a = i ? i.toString : void 0;
            t.exports = function t(e) {
                var i;
                return "string" == typeof e ? e : s(e) ? o(e, t) + "" : r(e) ? a ? a.call(e) : "" : "0" == (i = e + "") && 1 / e == -1 / 0 ? "-0" : i
            }
        }, 7561: (t, e, i) => {
            var n = i(7990), o = /^\s+/;
            t.exports = function (t) {
                return t && t.slice(0, n(t) + 1).replace(o, "")
            }
        }, 1717: t => {
            t.exports = function (e) {
                return function (t) {
                    return e(t)
                }
            }
        }, 5652: (t, e, i) => {
            var p = i(8668), f = i(7443), m = i(1196), _ = i(4757), g = i(3593), v = i(1814);
            t.exports = function (t, e, i) {
                var n = -1, o = f, s = t.length, r = !0, a = [], l = a;
                if (i) r = !1, o = m; else if (200 <= s) {
                    var h = e ? null : g(t);
                    if (h) return v(h);
                    r = !1, o = _, l = new p
                } else l = e ? [] : a;
                t:for (; ++n < s;) {
                    var u = t[n], c = e ? e(u) : u, u = i || 0 !== u ? u : 0;
                    if (r && c == c) {
                        for (var d = l.length; d--;) if (l[d] === c) continue t;
                        e && l.push(c), a.push(u)
                    } else o(l, c, i) || (l !== a && l.push(c), a.push(u))
                }
                return a
            }
        }, 1757: t => {
            t.exports = function (t, e, i) {
                for (var n = -1, o = t.length, s = e.length, r = {}; ++n < o;) {
                    var a = n < s ? e[n] : void 0;
                    i(r, t[n], a)
                }
                return r
            }
        }, 4757: t => {
            t.exports = function (t, e) {
                return t.has(e)
            }
        }, 1811: (t, e, i) => {
            var n = i(1469), o = i(5403), s = i(5514), r = i(9833);
            t.exports = function (t, e) {
                return n(t) ? t : o(t, e) ? [t] : s(r(t))
            }
        }, 180: (t, e, i) => {
            var o = i(4259);
            t.exports = function (t, e, i) {
                var n = t.length;
                return i = void 0 === i ? n : i, !e && n <= i ? t : o(t, e, i)
            }
        }, 6393: (t, e, i) => {
            var u = i(3448);
            t.exports = function (t, e) {
                if (t !== e) {
                    var i = void 0 !== t, n = null === t, o = t == t, s = u(t), r = void 0 !== e, a = null === e,
                        l = e == e, h = u(e);
                    if (!a && !h && !s && e < t || s && r && l && !a && !h || n && r && l || !i && l || !o) return 1;
                    if (!n && !s && !h && t < e || h && i && o && !n && !s || a && i && o || !r && o || !l) return -1
                }
                return 0
            }
        }, 5022: (t, e, i) => {
            var h = i(6393);
            t.exports = function (t, e, i) {
                for (var n = -1, o = t.criteria, s = e.criteria, r = o.length, a = i.length; ++n < r;) {
                    var l = h(o[n], s[n]);
                    if (l) return a <= n ? l : l * ("desc" == i[n] ? -1 : 1)
                }
                return t.index - e.index
            }
        }, 4429: (t, e, i) => {
            i = i(5639)["__core-js_shared__"];
            t.exports = i
        }, 9291: (t, e, i) => {
            var a = i(8612);
            t.exports = function (s, r) {
                return function (t, e) {
                    if (null != t) {
                        if (!a(t)) return s(t, e);
                        for (var i = t.length, n = r ? i : -1, o = Object(t); (r ? n-- : ++n < i) && !1 !== e(o[n], n, o);) ;
                    }
                    return t
                }
            }
        }, 5063: t => {
            t.exports = function (l) {
                return function (t, e, i) {
                    for (var n = -1, o = Object(t), s = i(t), r = s.length; r--;) {
                        var a = s[l ? r : ++n];
                        if (!1 === e(o[a], a, o)) break
                    }
                    return t
                }
            }
        }, 8805: (t, e, i) => {
            var o = i(180), s = i(2689), r = i(3140), a = i(9833);
            t.exports = function (n) {
                return function (t) {
                    t = a(t);
                    var e = s(t) ? r(t) : void 0, i = e ? e[0] : t.charAt(0), e = e ? o(e, 1).join("") : t.slice(1);
                    return i[n]() + e
                }
            }
        }, 5393: (t, e, i) => {
            var n = i(2663), o = i(3816), s = i(8748), r = RegExp("['’]", "g");
            t.exports = function (e) {
                return function (t) {
                    return n(s(o(t).replace(r, "")), e, "")
                }
            }
        }, 7445: (t, e, i) => {
            var o = i(98), s = i(6612), r = i(8601);
            t.exports = function (n) {
                return function (t, e, i) {
                    return i && "number" != typeof i && s(t, e, i) && (e = i = void 0), t = r(t), void 0 === e ? (e = t, t = 0) : e = r(e), i = void 0 === i ? t < e ? 1 : -1 : r(i), o(t, e, i, n)
                }
            }
        }, 3593: (t, e, i) => {
            var n = i(8525), o = i(308), i = i(1814), i = n && 1 / i(new n([, -0]))[1] == 1 / 0 ? function (t) {
                return new n(t)
            } : o;
            t.exports = i
        }, 9389: (t, e, i) => {
            i = i(8674)({
                "À": "A",
                "Á": "A",
                "Â": "A",
                "Ã": "A",
                "Ä": "A",
                "Å": "A",
                "à": "a",
                "á": "a",
                "â": "a",
                "ã": "a",
                "ä": "a",
                "å": "a",
                "Ç": "C",
                "ç": "c",
                "Ð": "D",
                "ð": "d",
                "È": "E",
                "É": "E",
                "Ê": "E",
                "Ë": "E",
                "è": "e",
                "é": "e",
                "ê": "e",
                "ë": "e",
                "Ì": "I",
                "Í": "I",
                "Î": "I",
                "Ï": "I",
                "ì": "i",
                "í": "i",
                "î": "i",
                "ï": "i",
                "Ñ": "N",
                "ñ": "n",
                "Ò": "O",
                "Ó": "O",
                "Ô": "O",
                "Õ": "O",
                "Ö": "O",
                "Ø": "O",
                "ò": "o",
                "ó": "o",
                "ô": "o",
                "õ": "o",
                "ö": "o",
                "ø": "o",
                "Ù": "U",
                "Ú": "U",
                "Û": "U",
                "Ü": "U",
                "ù": "u",
                "ú": "u",
                "û": "u",
                "ü": "u",
                "Ý": "Y",
                "ý": "y",
                "ÿ": "y",
                "Æ": "Ae",
                "æ": "ae",
                "Þ": "Th",
                "þ": "th",
                "ß": "ss",
                "Ā": "A",
                "Ă": "A",
                "Ą": "A",
                "ā": "a",
                "ă": "a",
                "ą": "a",
                "Ć": "C",
                "Ĉ": "C",
                "Ċ": "C",
                "Č": "C",
                "ć": "c",
                "ĉ": "c",
                "ċ": "c",
                "č": "c",
                "Ď": "D",
                "Đ": "D",
                "ď": "d",
                "đ": "d",
                "Ē": "E",
                "Ĕ": "E",
                "Ė": "E",
                "Ę": "E",
                "Ě": "E",
                "ē": "e",
                "ĕ": "e",
                "ė": "e",
                "ę": "e",
                "ě": "e",
                "Ĝ": "G",
                "Ğ": "G",
                "Ġ": "G",
                "Ģ": "G",
                "ĝ": "g",
                "ğ": "g",
                "ġ": "g",
                "ģ": "g",
                "Ĥ": "H",
                "Ħ": "H",
                "ĥ": "h",
                "ħ": "h",
                "Ĩ": "I",
                "Ī": "I",
                "Ĭ": "I",
                "Į": "I",
                "İ": "I",
                "ĩ": "i",
                "ī": "i",
                "ĭ": "i",
                "į": "i",
                "ı": "i",
                "Ĵ": "J",
                "ĵ": "j",
                "Ķ": "K",
                "ķ": "k",
                "ĸ": "k",
                "Ĺ": "L",
                "Ļ": "L",
                "Ľ": "L",
                "Ŀ": "L",
                "Ł": "L",
                "ĺ": "l",
                "ļ": "l",
                "ľ": "l",
                "ŀ": "l",
                "ł": "l",
                "Ń": "N",
                "Ņ": "N",
                "Ň": "N",
                "Ŋ": "N",
                "ń": "n",
                "ņ": "n",
                "ň": "n",
                "ŋ": "n",
                "Ō": "O",
                "Ŏ": "O",
                "Ő": "O",
                "ō": "o",
                "ŏ": "o",
                "ő": "o",
                "Ŕ": "R",
                "Ŗ": "R",
                "Ř": "R",
                "ŕ": "r",
                "ŗ": "r",
                "ř": "r",
                "Ś": "S",
                "Ŝ": "S",
                "Ş": "S",
                "Š": "S",
                "ś": "s",
                "ŝ": "s",
                "ş": "s",
                "š": "s",
                "Ţ": "T",
                "Ť": "T",
                "Ŧ": "T",
                "ţ": "t",
                "ť": "t",
                "ŧ": "t",
                "Ũ": "U",
                "Ū": "U",
                "Ŭ": "U",
                "Ů": "U",
                "Ű": "U",
                "Ų": "U",
                "ũ": "u",
                "ū": "u",
                "ŭ": "u",
                "ů": "u",
                "ű": "u",
                "ų": "u",
                "Ŵ": "W",
                "ŵ": "w",
                "Ŷ": "Y",
                "ŷ": "y",
                "Ÿ": "Y",
                "Ź": "Z",
                "Ż": "Z",
                "Ž": "Z",
                "ź": "z",
                "ż": "z",
                "ž": "z",
                "Ĳ": "IJ",
                "ĳ": "ij",
                "Œ": "Oe",
                "œ": "oe",
                "ŉ": "'n",
                "ſ": "s"
            });
            t.exports = i
        }, 8777: (t, e, i) => {
            var n = i(852), i = function () {
                try {
                    var t = n(Object, "defineProperty");
                    return t({}, "", {}), t
                } catch (t) {
                }
            }();
            t.exports = i
        }, 7114: (t, e, i) => {
            var _ = i(8668), g = i(2908), v = i(4757);
            t.exports = function (t, e, i, n, o, s) {
                var r = 1 & i, a = t.length, l = e.length;
                if (a != l && !(r && a < l)) return !1;
                var l = s.get(t), h = s.get(e);
                if (l && h) return l == e && h == t;
                var u = -1, c = !0, d = 2 & i ? new _ : void 0;
                for (s.set(t, e), s.set(e, t); ++u < a;) {
                    var p, f = t[u], m = e[u];
                    if (void 0 !== (p = n ? r ? n(m, f, u, e, t, s) : n(f, m, u, t, e, s) : p)) {
                        if (p) continue;
                        c = !1;
                        break
                    }
                    if (d) {
                        if (!g(e, function (t, e) {
                            if (!v(d, e) && (f === t || o(f, t, i, n, s))) return d.push(e)
                        })) {
                            c = !1;
                            break
                        }
                    } else if (f !== m && !o(f, m, i, n, s)) {
                        c = !1;
                        break
                    }
                }
                return s.delete(t), s.delete(e), c
            }
        }, 8351: (t, e, i) => {
            var n = i(2705), h = i(1149), u = i(7813), c = i(7114), d = i(8776), p = i(1814),
                i = n ? n.prototype : void 0, f = i ? i.valueOf : void 0;
            t.exports = function (t, e, i, n, o, s, r) {
                switch (i) {
                    case"[object DataView]":
                        if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) return !1;
                        t = t.buffer, e = e.buffer;
                    case"[object ArrayBuffer]":
                        return !(t.byteLength != e.byteLength || !s(new h(t), new h(e)));
                    case"[object Boolean]":
                    case"[object Date]":
                    case"[object Number]":
                        return u(+t, +e);
                    case"[object Error]":
                        return t.name == e.name && t.message == e.message;
                    case"[object RegExp]":
                    case"[object String]":
                        return t == e + "";
                    case"[object Map]":
                        var a = d;
                    case"[object Set]":
                        a = a || p;
                        if (t.size != e.size && !(1 & n)) return !1;
                        var l = r.get(t);
                        if (l) return l == e;
                        n |= 2, r.set(t, e);
                        l = c(a(t), a(e), n, o, s, r);
                        return r.delete(t), l;
                    case"[object Symbol]":
                        if (f) return f.call(t) == f.call(e)
                }
                return !1
            }
        }, 6096: (t, e, i) => {
            var v = i(8234), y = Object.prototype.hasOwnProperty;
            t.exports = function (t, e, i, n, o, s) {
                var r = 1 & i, a = v(t), l = a.length;
                if (l != v(e).length && !r) return !1;
                for (var h = l; h--;) {
                    var u = a[h];
                    if (!(r ? u in e : y.call(e, u))) return !1
                }
                var c = s.get(t), d = s.get(e);
                if (c && d) return c == e && d == t;
                var p = !0;
                s.set(t, e), s.set(e, t);
                for (var f = r; ++h < l;) {
                    var m, _ = t[u = a[h]], g = e[u];
                    if (!(void 0 === (m = n ? r ? n(g, _, u, e, t, s) : n(_, g, u, t, e, s) : m) ? _ === g || o(_, g, i, n, s) : m)) {
                        p = !1;
                        break
                    }
                    f = f || "constructor" == u
                }
                return p && !f && (c = t.constructor) != (d = e.constructor) && "constructor" in t && "constructor" in e && !("function" == typeof c && c instanceof c && "function" == typeof d && d instanceof d) && (p = !1), s.delete(t), s.delete(e), p
            }
        }, 1957: (t, e, i) => {
            i = "object" == typeof i.g && i.g && i.g.Object === Object && i.g;
            t.exports = i
        }, 8234: (t, e, i) => {
            var n = i(8866), o = i(9551), s = i(3674);
            t.exports = function (t) {
                return n(t, s, o)
            }
        }, 5050: (t, e, i) => {
            var n = i(7019);
            t.exports = function (t, e) {
                t = t.__data__;
                return n(e) ? t["string" == typeof e ? "string" : "hash"] : t.map
            }
        }, 1499: (t, e, i) => {
            var s = i(9162), r = i(3674);
            t.exports = function (t) {
                for (var e = r(t), i = e.length; i--;) {
                    var n = e[i], o = t[n];
                    e[i] = [n, o, s(o)]
                }
                return e
            }
        }, 852: (t, e, i) => {
            var n = i(8458), o = i(7801);
            t.exports = function (t, e) {
                t = o(t, e);
                return n(t) ? t : void 0
            }
        }, 9607: (t, e, i) => {
            var i = i(2705), n = Object.prototype, s = n.hasOwnProperty, r = n.toString, a = i ? i.toStringTag : void 0;
            t.exports = function (t) {
                var e = s.call(t, a), i = t[a];
                try {
                    var n = !(t[a] = void 0)
                } catch (t) {
                }
                var o = r.call(t);
                return n && (e ? t[a] = i : delete t[a]), o
            }
        }, 9551: (t, e, i) => {
            var n = i(4963), i = i(479), o = Object.prototype.propertyIsEnumerable, s = Object.getOwnPropertySymbols;
            t.exports = s ? function (e) {
                return null == e ? [] : (e = Object(e), n(s(e), function (t) {
                    return o.call(e, t)
                }))
            } : i
        }, 4160: (t, e, i) => {
            var n = i(8552), o = i(7071), s = i(3818), r = i(8525), a = i(577), l = i(4239), h = i(346),
                u = "[object Map]", c = "[object Promise]", d = "[object Set]", p = "[object WeakMap]",
                f = "[object DataView]", m = h(n), _ = h(o), g = h(s), v = h(r), y = h(a), i = l;
            (n && i(new n(new ArrayBuffer(1))) != f || o && i(new o) != u || s && i(s.resolve()) != c || r && i(new r) != d || a && i(new a) != p) && (i = function (t) {
                var e = l(t), t = "[object Object]" == e ? t.constructor : void 0, t = t ? h(t) : "";
                if (t) switch (t) {
                    case m:
                        return f;
                    case _:
                        return u;
                    case g:
                        return c;
                    case v:
                        return d;
                    case y:
                        return p
                }
                return e
            }), t.exports = i
        }, 7801: t => {
            t.exports = function (t, e) {
                return null == t ? void 0 : t[e]
            }
        }, 222: (t, e, i) => {
            var a = i(1811), l = i(5694), h = i(1469), u = i(5776), c = i(1780), d = i(327);
            t.exports = function (t, e, i) {
                for (var n = -1, o = (e = a(e, t)).length, s = !1; ++n < o;) {
                    var r = d(e[n]);
                    if (!(s = null != t && i(t, r))) break;
                    t = t[r]
                }
                return s || ++n != o ? s : !!(o = null == t ? 0 : t.length) && c(o) && u(r, o) && (h(t) || l(t))
            }
        }, 2689: t => {
            var e = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");
            t.exports = function (t) {
                return e.test(t)
            }
        }, 3157: t => {
            var e = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
            t.exports = function (t) {
                return e.test(t)
            }
        }, 1789: (t, e, i) => {
            var n = i(4536);
            t.exports = function () {
                this.__data__ = n ? n(null) : {}, this.size = 0
            }
        }, 401: t => {
            t.exports = function (t) {
                t = this.has(t) && delete this.__data__[t];
                return this.size -= t ? 1 : 0, t
            }
        }, 7667: (t, e, i) => {
            var n = i(4536), o = Object.prototype.hasOwnProperty;
            t.exports = function (t) {
                var e, i = this.__data__;
                return n ? "__lodash_hash_undefined__" === (e = i[t]) ? void 0 : e : o.call(i, t) ? i[t] : void 0
            }
        }, 1327: (t, e, i) => {
            var n = i(4536), o = Object.prototype.hasOwnProperty;
            t.exports = function (t) {
                var e = this.__data__;
                return n ? void 0 !== e[t] : o.call(e, t)
            }
        }, 1866: (t, e, i) => {
            var n = i(4536);
            t.exports = function (t, e) {
                var i = this.__data__;
                return this.size += this.has(t) ? 0 : 1, i[t] = n && void 0 === e ? "__lodash_hash_undefined__" : e, this
            }
        }, 7285: (t, e, i) => {
            var n = i(2705), o = i(5694), s = i(1469), r = n ? n.isConcatSpreadable : void 0;
            t.exports = function (t) {
                return s(t) || o(t) || !!(r && t && t[r])
            }
        }, 5776: t => {
            var n = /^(?:0|[1-9]\d*)$/;
            t.exports = function (t, e) {
                var i = typeof t;
                return !!(e = null == e ? 9007199254740991 : e) && ("number" == i || "symbol" != i && n.test(t)) && -1 < t && t % 1 == 0 && t < e
            }
        }, 6612: (t, e, i) => {
            var o = i(7813), s = i(8612), r = i(5776), a = i(3218);
            t.exports = function (t, e, i) {
                var n;
                return !!a(i) && !!("number" == (n = typeof e) ? s(i) && r(e, i.length) : "string" == n && e in i) && o(i[e], t)
            }
        }, 5403: (t, e, i) => {
            var n = i(1469), o = i(3448), s = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, r = /^\w*$/;
            t.exports = function (t, e) {
                var i;
                return !n(t) && (!("number" != (i = typeof t) && "symbol" != i && "boolean" != i && null != t && !o(t)) || r.test(t) || !s.test(t) || null != e && t in Object(e))
            }
        }, 7019: t => {
            t.exports = function (t) {
                var e = typeof t;
                return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t
            }
        }, 5346: (t, e, i) => {
            var i = i(4429), n = (i = /[^.]+$/.exec(i && i.keys && i.keys.IE_PROTO || "")) ? "Symbol(src)_1." + i : "";
            t.exports = function (t) {
                return !!n && n in t
            }
        }, 5726: t => {
            var i = Object.prototype;
            t.exports = function (t) {
                var e = t && t.constructor;
                return t === ("function" == typeof e && e.prototype || i)
            }
        }, 9162: (t, e, i) => {
            var n = i(3218);
            t.exports = function (t) {
                return t == t && !n(t)
            }
        }, 7040: t => {
            t.exports = function () {
                this.__data__ = [], this.size = 0
            }
        }, 4125: (t, e, i) => {
            var n = i(8470), o = Array.prototype.splice;
            t.exports = function (t) {
                var e = this.__data__, t = n(e, t);
                return !(t < 0 || (t == e.length - 1 ? e.pop() : o.call(e, t, 1), --this.size, 0))
            }
        }, 2117: (t, e, i) => {
            var n = i(8470);
            t.exports = function (t) {
                var e = this.__data__, t = n(e, t);
                return t < 0 ? void 0 : e[t][1]
            }
        }, 7518: (t, e, i) => {
            var n = i(8470);
            t.exports = function (t) {
                return -1 < n(this.__data__, t)
            }
        }, 4705: (t, e, i) => {
            var o = i(8470);
            t.exports = function (t, e) {
                var i = this.__data__, n = o(i, t);
                return n < 0 ? (++this.size, i.push([t, e])) : i[n][1] = e, this
            }
        }, 4785: (t, e, i) => {
            var n = i(1989), o = i(8407), s = i(7071);
            t.exports = function () {
                this.size = 0, this.__data__ = {hash: new n, map: new (s || o), string: new n}
            }
        }, 1285: (t, e, i) => {
            var n = i(5050);
            t.exports = function (t) {
                t = n(this, t).delete(t);
                return this.size -= t ? 1 : 0, t
            }
        }, 6e3: (t, e, i) => {
            var n = i(5050);
            t.exports = function (t) {
                return n(this, t).get(t)
            }
        }, 9916: (t, e, i) => {
            var n = i(5050);
            t.exports = function (t) {
                return n(this, t).has(t)
            }
        }, 5265: (t, e, i) => {
            var o = i(5050);
            t.exports = function (t, e) {
                var i = o(this, t), n = i.size;
                return i.set(t, e), this.size += i.size == n ? 0 : 1, this
            }
        }, 8776: t => {
            t.exports = function (t) {
                var i = -1, n = Array(t.size);
                return t.forEach(function (t, e) {
                    n[++i] = [e, t]
                }), n
            }
        }, 2634: t => {
            t.exports = function (e, i) {
                return function (t) {
                    return null != t && t[e] === i && (void 0 !== i || e in Object(t))
                }
            }
        }, 4523: (t, e, i) => {
            var n = i(8306);
            t.exports = function (t) {
                var t = n(t, function (t) {
                    return 500 === e.size && e.clear(), t
                }), e = t.cache;
                return t
            }
        }, 4536: (t, e, i) => {
            i = i(852)(Object, "create");
            t.exports = i
        }, 6916: (t, e, i) => {
            i = i(5569)(Object.keys, Object);
            t.exports = i
        }, 1167: (t, e, i) => {
            t = i.nmd(t);
            var i = i(1957), e = e && !e.nodeType && e, n = e && t && !t.nodeType && t,
                o = n && n.exports === e && i.process, e = function () {
                    try {
                        return n && n.require && n.require("util").types || o && o.binding && o.binding("util")
                    } catch (t) {
                    }
                }();
            t.exports = e
        }, 2333: t => {
            var e = Object.prototype.toString;
            t.exports = function (t) {
                return e.call(t)
            }
        }, 5569: t => {
            t.exports = function (e, i) {
                return function (t) {
                    return e(i(t))
                }
            }
        }, 5357: (t, e, i) => {
            var l = i(6874), h = Math.max;
            t.exports = function (s, r, a) {
                return r = h(void 0 === r ? s.length - 1 : r, 0), function () {
                    for (var t = arguments, e = -1, i = h(t.length - r, 0), n = Array(i); ++e < i;) n[e] = t[r + e];
                    for (var e = -1, o = Array(r + 1); ++e < r;) o[e] = t[e];
                    return o[r] = a(n), l(s, this, o)
                }
            }
        }, 5639: (t, e, i) => {
            var i = i(1957), n = "object" == typeof self && self && self.Object === Object && self,
                i = i || n || Function("return this")();
            t.exports = i
        }, 619: t => {
            t.exports = function (t) {
                return this.__data__.set(t, "__lodash_hash_undefined__"), this
            }
        }, 2385: t => {
            t.exports = function (t) {
                return this.__data__.has(t)
            }
        }, 1814: t => {
            t.exports = function (t) {
                var e = -1, i = Array(t.size);
                return t.forEach(function (t) {
                    i[++e] = t
                }), i
            }
        }, 61: (t, e, i) => {
            var n = i(6560), i = i(1275)(n);
            t.exports = i
        }, 1275: t => {
            var s = Date.now;
            t.exports = function (i) {
                var n = 0, o = 0;
                return function () {
                    var t = s(), e = 16 - (t - o);
                    if (o = t, 0 < e) {
                        if (800 <= ++n) return arguments[0]
                    } else n = 0;
                    return i.apply(void 0, arguments)
                }
            }
        }, 7465: (t, e, i) => {
            var n = i(8407);
            t.exports = function () {
                this.__data__ = new n, this.size = 0
            }
        }, 3779: t => {
            t.exports = function (t) {
                var e = this.__data__, t = e.delete(t);
                return this.size = e.size, t
            }
        }, 7599: t => {
            t.exports = function (t) {
                return this.__data__.get(t)
            }
        }, 4758: t => {
            t.exports = function (t) {
                return this.__data__.has(t)
            }
        }, 4309: (t, e, i) => {
            var o = i(8407), s = i(7071), r = i(3369);
            t.exports = function (t, e) {
                var i = this.__data__;
                if (i instanceof o) {
                    var n = i.__data__;
                    if (!s || n.length < 199) return n.push([t, e]), this.size = ++i.size, this;
                    i = this.__data__ = new r(n)
                }
                return i.set(t, e), this.size = i.size, this
            }
        }, 2351: t => {
            t.exports = function (t, e, i) {
                for (var n = i - 1, o = t.length; ++n < o;) if (t[n] === e) return n;
                return -1
            }
        }, 3140: (t, e, i) => {
            var n = i(4286), o = i(2689), s = i(676);
            t.exports = function (t) {
                return (o(t) ? s : n)(t)
            }
        }, 5514: (t, e, i) => {
            var i = i(4523),
                n = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
                s = /\\(\\)?/g, i = i(function (t) {
                    var o = [];
                    return 46 === t.charCodeAt(0) && o.push(""), t.replace(n, function (t, e, i, n) {
                        o.push(i ? n.replace(s, "$1") : e || t)
                    }), o
                });
            t.exports = i
        }, 327: (t, e, i) => {
            var n = i(3448);
            t.exports = function (t) {
                var e;
                return "string" == typeof t || n(t) ? t : "0" == (e = t + "") && 1 / t == -1 / 0 ? "-0" : e
            }
        }, 346: t => {
            var e = Function.prototype.toString;
            t.exports = function (t) {
                if (null != t) {
                    try {
                        return e.call(t)
                    } catch (t) {
                    }
                    try {
                        return t + ""
                    } catch (t) {
                    }
                }
                return ""
            }
        }, 7990: t => {
            var i = /\s/;
            t.exports = function (t) {
                for (var e = t.length; e-- && i.test(t.charAt(e));) ;
                return e
            }
        }, 676: t => {
            var e = "\\ud800-\\udfff", i = "[" + e + "]", n = "[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",
                o = "\\ud83c[\\udffb-\\udfff]", e = "[^" + e + "]", s = "(?:\\ud83c[\\udde6-\\uddff]){2}",
                r = "[\\ud800-\\udbff][\\udc00-\\udfff]", a = "(?:" + n + "|" + o + ")?", l = "[\\ufe0e\\ufe0f]?",
                l = l + a + "(?:\\u200d(?:" + [e, s, r].join("|") + ")" + l + a + ")*",
                a = "(?:" + [e + n + "?", n, s, r, i].join("|") + ")", h = RegExp(o + "(?=" + o + ")|" + a + l, "g");
            t.exports = function (t) {
                return t.match(h) || []
            }
        }, 2757: t => {
            var e = "\\ud800-\\udfff", i = "\\u2700-\\u27bf", n = "a-z\\xdf-\\xf6\\xf8-\\xff",
                o = "A-Z\\xc0-\\xd6\\xd8-\\xde",
                s = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
                r = "[" + s + "]", a = "[" + i + "]", l = "[" + n + "]", s = "[^" + e + s + "\\d+" + i + n + o + "]",
                i = "(?:\\ud83c[\\udde6-\\uddff]){2}", n = "[\\ud800-\\udbff][\\udc00-\\udfff]", o = "[" + o + "]",
                h = "(?:" + l + "|" + s + ")", s = "(?:" + o + "|" + s + ")", u = "(?:['’](?:d|ll|m|re|s|t|ve))?",
                c = "(?:['’](?:D|LL|M|RE|S|T|VE))?",
                d = "(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?",
                p = "[\\ufe0e\\ufe0f]?",
                e = p + d + "(?:\\u200d(?:" + ["[^" + e + "]", i, n].join("|") + ")" + p + d + ")*",
                p = "(?:" + [a, i, n].join("|") + ")" + e,
                f = RegExp([o + "?" + l + "+" + u + "(?=" + [r, o, "$"].join("|") + ")", s + "+" + c + "(?=" + [r, o + h, "$"].join("|") + ")", o + "?" + h + "+" + u, o + "+" + c, "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", "\\d+", p].join("|"), "g");
            t.exports = function (t) {
                return t.match(f) || []
            }
        }, 8929: (t, e, i) => {
            var n = i(8403), i = i(5393)(function (t, e, i) {
                return e = e.toLowerCase(), t + (i ? n(e) : e)
            });
            t.exports = i
        }, 8403: (t, e, i) => {
            var n = i(9833), o = i(1700);
            t.exports = function (t) {
                return o(n(t).toLowerCase())
            }
        }, 5703: t => {
            t.exports = function (t) {
                return function () {
                    return t
                }
            }
        }, 3816: (t, e, i) => {
            var n = i(9389), o = i(9833), s = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
                r = RegExp("[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]", "g");
            t.exports = function (t) {
                return (t = o(t)) && t.replace(s, n).replace(r, "")
            }
        }, 7813: t => {
            t.exports = function (t, e) {
                return t === e || t != t && e != e
            }
        }, 2348: (t, e, i) => {
            var n = i(1078);
            t.exports = function (t) {
                return null != t && t.length ? n(t, 1 / 0) : []
            }
        }, 7361: (t, e, i) => {
            var n = i(7786);
            t.exports = function (t, e, i) {
                t = null == t ? void 0 : n(t, e);
                return void 0 === t ? i : t
            }
        }, 8721: (t, e, i) => {
            var n = i(8565), o = i(222);
            t.exports = function (t, e) {
                return null != t && o(t, e, n)
            }
        }, 9095: (t, e, i) => {
            var n = i(13), o = i(222);
            t.exports = function (t, e) {
                return null != t && o(t, e, n)
            }
        }, 6557: t => {
            t.exports = function (t) {
                return t
            }
        }, 5694: (t, e, i) => {
            var n = i(9454), o = i(7005), i = Object.prototype, s = i.hasOwnProperty, r = i.propertyIsEnumerable,
                i = n(function () {
                    return arguments
                }()) ? n : function (t) {
                    return o(t) && s.call(t, "callee") && !r.call(t, "callee")
                };
            t.exports = i
        }, 1469: t => {
            var e = Array.isArray;
            t.exports = e
        }, 8612: (t, e, i) => {
            var n = i(3560), o = i(1780);
            t.exports = function (t) {
                return null != t && o(t.length) && !n(t)
            }
        }, 4144: (t, e, i) => {
            t = i.nmd(t);
            var n = i(5639), i = i(5062), e = e && !e.nodeType && e, o = e && t && !t.nodeType && t,
                o = o && o.exports === e ? n.Buffer : void 0, e = (o ? o.isBuffer : void 0) || i;
            t.exports = e
        }, 3560: (t, e, i) => {
            var n = i(4239), o = i(3218);
            t.exports = function (t) {
                return !!o(t) && ("[object Function]" == (t = n(t)) || "[object GeneratorFunction]" == t || "[object AsyncFunction]" == t || "[object Proxy]" == t)
            }
        }, 1780: t => {
            t.exports = function (t) {
                return "number" == typeof t && -1 < t && t % 1 == 0 && t <= 9007199254740991
            }
        }, 3218: t => {
            t.exports = function (t) {
                var e = typeof t;
                return null != t && ("object" == e || "function" == e)
            }
        }, 7005: t => {
            t.exports = function (t) {
                return null != t && "object" == typeof t
            }
        }, 3448: (t, e, i) => {
            var n = i(4239), o = i(7005);
            t.exports = function (t) {
                return "symbol" == typeof t || o(t) && "[object Symbol]" == n(t)
            }
        }, 6719: (t, e, i) => {
            var n = i(8749), o = i(1717), i = i(1167), i = i && i.isTypedArray, o = i ? o(i) : n;
            t.exports = o
        }, 3674: (t, e, i) => {
            var n = i(4636), o = i(280), s = i(8612);
            t.exports = function (t) {
                return (s(t) ? n : o)(t)
            }
        }, 8306: (t, e, i) => {
            var r = i(3369);

            function a(n, o) {
                if ("function" != typeof n || null != o && "function" != typeof o) throw new TypeError("Expected a function");

                function s() {
                    var t = arguments, e = o ? o.apply(this, t) : t[0], i = s.cache;
                    return i.has(e) ? i.get(e) : (t = n.apply(this, t), s.cache = i.set(e, t) || i, t)
                }

                return s.cache = new (a.Cache || r), s
            }

            a.Cache = r, t.exports = a
        }, 308: t => {
            t.exports = function () {
            }
        }, 9601: (t, e, i) => {
            var n = i(371), o = i(9152), s = i(5403), r = i(327);
            t.exports = function (t) {
                return s(t) ? n(r(t)) : o(t)
            }
        }, 6026: (t, e, i) => {
            i = i(7445)();
            t.exports = i
        }, 6796: (t, e, i) => {
            var n = i(8190), o = i(6612), s = i(554), r = i(9833);
            t.exports = function (t, e, i) {
                return e = (i ? o(t, e, i) : void 0 === e) ? 1 : s(e), n(r(t), e)
            }
        }, 6968: (t, e, i) => {
            var n = i(611);
            t.exports = function (t, e, i) {
                return null == t ? t : n(t, e, i)
            }
        }, 1921: (t, e, i) => {
            var o = i(611);
            t.exports = function (t, e, i, n) {
                return n = "function" == typeof n ? n : void 0, null == t ? t : o(t, e, i, n)
            }
        }, 9734: (t, e, i) => {
            var n = i(1078), o = i(9556), s = i(5976), r = i(6612), i = s(function (t, e) {
                var i;
                return null == t ? [] : (1 < (i = e.length) && r(t, e[0], e[1]) ? e = [] : 2 < i && r(e[0], e[1], e[2]) && (e = [e[0]]), o(t, n(e, 1), []))
            });
            t.exports = i
        }, 479: t => {
            t.exports = function () {
                return []
            }
        }, 5062: t => {
            t.exports = function () {
                return !1
            }
        }, 8601: (t, e, i) => {
            var n = i(4841);
            t.exports = function (t) {
                return t ? 1 / 0 === (t = n(t)) || t === -1 / 0 ? 17976931348623157e292 * (t < 0 ? -1 : 1) : t == t ? t : 0 : 0 === t ? t : 0
            }
        }, 554: (t, e, i) => {
            var n = i(8601);
            t.exports = function (t) {
                var t = n(t), e = t % 1;
                return t == t ? e ? t - e : t : 0
            }
        }, 4841: (t, e, i) => {
            var n = i(7561), o = i(3218), s = i(3448), r = /^[-+]0x[0-9a-f]+$/i, a = /^0b[01]+$/i, l = /^0o[0-7]+$/i,
                h = parseInt;
            t.exports = function (t) {
                if ("number" == typeof t) return t;
                if (s(t)) return NaN;
                if (o(t) && (e = "function" == typeof t.valueOf ? t.valueOf() : t, t = o(e) ? e + "" : e), "string" != typeof t) return 0 === t ? t : +t;
                t = n(t);
                var e = a.test(t);
                return e || l.test(t) ? h(t.slice(2), e ? 2 : 8) : r.test(t) ? NaN : +t
            }
        }, 9833: (t, e, i) => {
            var n = i(531);
            t.exports = function (t) {
                return null == t ? "" : n(t)
            }
        }, 4908: (t, e, i) => {
            var n = i(5652);
            t.exports = function (t) {
                return t && t.length ? n(t) : []
            }
        }, 1700: (t, e, i) => {
            i = i(8805)("toUpperCase");
            t.exports = i
        }, 8748: (t, e, i) => {
            var n = i(9029), o = i(3157), s = i(9833), r = i(2757);
            t.exports = function (t, e, i) {
                return t = s(t), void 0 === (e = i ? void 0 : e) ? (o(t) ? r : n)(t) : t.match(e) || []
            }
        }, 7287: (t, e, i) => {
            var n = i(4865), o = i(1757);
            t.exports = function (t, e) {
                return o(t || [], e || [], n)
            }
        }
    }, n = {};

    function nt(t) {
        var e = n[t];
        return void 0 !== e || (e = n[t] = {
            id: t,
            loaded: !1,
            exports: {}
        }, i[t](e, e.exports, nt), e.loaded = !0), e.exports
    }

    nt.n = t => {
        var e = t && t.__esModule ? () => t.default : () => t;
        return nt.d(e, {a: e}), e
    }, nt.d = (t, e) => {
        for (var i in e) nt.o(e, i) && !nt.o(t, i) && Object.defineProperty(t, i, {enumerable: !0, get: e[i]})
    }, nt.g = function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (t) {
            if ("object" == typeof window) return window
        }
    }(), nt.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e), nt.r = t => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(t, "__esModule", {value: !0})
    }, nt.nmd = t => (t.paths = [], t.children || (t.children = []), t);
    var ot = {};
    (() => {
        "use strict";
        nt.r(ot), nt.d(ot, {
            I18n: () => it,
            Locales: () => c,
            MissingTranslation: () => et,
            Pluralization: () => d,
            useMakePlural: () => e
        });
        var t = nt(7361), r = nt.n(t), t = nt(8721), w = nt.n(t), t = nt(6968), P = nt.n(t), t = nt(1921), n = nt.n(t),
            t = nt(4908), C = nt.n(t);
        const E = (e, t) => {
            const i = [], n = [];
            return i.push(t), t || i.push(e.locale), e.enableFallback && i.push(e.defaultLocale), i.filter(Boolean).map(t => t.toString()).forEach(function (t) {
                n.includes(t) || n.push(t), e.enableFallback && (3 === (t = t.split("-")).length && n.push(t[0] + "-" + t[1]), n.push(t[0]))
            }), C()(n)
        };

        class c {
            constructor(t) {
                this.i18n = t, this.registry = {}, this.register("default", E)
            }

            register(t, e) {
                if ("function" != typeof e) {
                    const t = e;
                    e = () => t
                }
                this.registry[t] = e
            }

            get(t) {
                let e = this.registry[t] || this.registry[this.i18n.locale] || this.registry.default;
                return e = (e = "function" == typeof e ? e(this.i18n, t) : e) instanceof Array ? e : [e]
            }
        }

        function e({pluralizer: i, includeZero: n = !0, ordinal: o = !1}) {
            return function (t, e) {
                return [n && 0 === e ? "zero" : "", i(e, o)].filter(Boolean)
            }
        }

        const T = e({
            pluralizer: (t, e) => {
                var i = String(t).split("."), n = !i[1], o = Number(i[0]) == t, s = o && i[0].slice(-1),
                    o = o && i[0].slice(-2);
                return e ? 1 == s && 11 != o ? "one" : 2 == s && 12 != o ? "two" : 3 == s && 13 != o ? "few" : "other" : 1 == t && n ? "one" : "other"
            }, includeZero: !0
        });

        class d {
            constructor(t) {
                this.i18n = t, this.registry = {}, this.register("default", T)
            }

            register(t, e) {
                this.registry[t] = e
            }

            get(t) {
                return this.registry[t] || this.registry[this.i18n.locale] || this.registry.default
            }
        }

        var t = nt(8929), M = nt.n(t);

        function v(i) {
            return i ? Object.keys(i).reduce((t, e) => (t[M()(e)] = i[e], t), {}) : {}
        }

        function h(t) {
            return null != t
        }

        var i, X = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, Z = Math.ceil, R = Math.floor,
            D = "[BigNumber Error] ", j = D + "Number primitive has more than 15 significant digits: ", F = 1e14,
            U = 9007199254740991, H = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13];

        function W(t) {
            var e = 0 | t;
            return 0 < t || t === e ? e : e - 1
        }

        function G(t) {
            for (var e, i, n = 1, o = t.length, s = t[0] + ""; n < o;) {
                for (i = 14 - (e = t[n++] + "").length; i--; e = "0" + e) ;
                s += e
            }
            for (o = s.length; 48 === s.charCodeAt(--o);) ;
            return s.slice(0, o + 1 || 1)
        }

        function V(t, e) {
            var i, n, o = t.c, s = e.c, r = t.s, a = e.s, t = t.e, e = e.e;
            if (!r || !a) return null;
            if (i = o && !o[0], n = s && !s[0], i || n) return i ? n ? 0 : -a : r;
            if (r != a) return r;
            if (i = r < 0, n = t == e, !o || !s) return n ? 0 : !o ^ i ? 1 : -1;
            if (!n) return e < t ^ i ? 1 : -1;
            for (a = (t = o.length) < (e = s.length) ? t : e, r = 0; r < a; r++) if (o[r] != s[r]) return o[r] > s[r] ^ i ? 1 : -1;
            return t == e ? 0 : e < t ^ i ? 1 : -1
        }

        function q(t, e, i, n) {
            if (t < e || i < t || t !== R(t)) throw Error(D + (n || "Argument") + ("number" == typeof t ? t < e || i < t ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(t))
        }

        function $(t) {
            var e = t.c.length - 1;
            return W(t.e / 14) == e && t.c[e] % 2 != 0
        }

        function Y(t, e) {
            return (1 < t.length ? t.charAt(0) + "." + t.slice(1) : t) + (e < 0 ? "e" : "e+") + e
        }

        function K(t, e, i) {
            var n, o;
            if (e < 0) {
                for (o = i + "."; ++e; o += i) ;
                t = o + t
            } else if (++e > (n = t.length)) {
                for (o = i, e -= n; --e; o += i) ;
                t += o
            } else e < n && (t = t.slice(0, e) + "." + t.slice(e));
            return t
        }

        const p = function N(t) {
            var _, c, d, e, h, r, a, l, u, p, g, i = M.prototype = {constructor: M, toString: null, valueOf: null},
                f = new M(1), v = 20, y = 4, m = -7, b = 21, L = -1e7, x = 1e7, w = !1, n = 1, P = 0, C = {
                    prefix: "",
                    groupSize: 3,
                    secondaryGroupSize: 0,
                    groupSeparator: ",",
                    decimalSeparator: ".",
                    fractionGroupSize: 0,
                    fractionGroupSeparator: " ",
                    suffix: ""
                }, E = "0123456789abcdefghijklmnopqrstuvwxyz", T = !0;

            function M(t, e) {
                var i, n, o, s, r, a, l, h, u = this;
                if (!(u instanceof M)) return new M(t, e);
                if (null == e) {
                    if (t && !0 === t._isBigNumber) return u.s = t.s, void (!t.c || t.e > x ? u.c = u.e = null : t.e < L ? u.c = [u.e = 0] : (u.e = t.e, u.c = t.c.slice()));
                    if ((a = "number" == typeof t) && 0 * t == 0) {
                        if (u.s = 1 / t < 0 ? (t = -t, -1) : 1, t === ~~t) {
                            for (s = 0, r = t; 10 <= r; r /= 10, s++) ;
                            return void (x < s ? u.c = u.e = null : (u.e = s, u.c = [t]))
                        }
                        h = String(t)
                    } else {
                        if (!X.test(h = String(t))) return d(u, h, a);
                        u.s = 45 == h.charCodeAt(0) ? (h = h.slice(1), -1) : 1
                    }
                    0 < (r = (h = -1 < (s = h.indexOf(".")) ? h.replace(".", "") : h).search(/e/i)) ? (s < 0 && (s = r), s += +h.slice(r + 1), h = h.substring(0, r)) : s < 0 && (s = h.length)
                } else {
                    if (q(e, 2, E.length, "Base"), 10 == e && T) return k(u = new M(t), v + u.e + 1, y);
                    if (h = String(t), a = "number" == typeof t) {
                        if (0 * t != 0) return d(u, h, a, e);
                        if (u.s = 1 / t < 0 ? (h = h.slice(1), -1) : 1, M.DEBUG && 15 < h.replace(/^0\.0*|\./, "").length) throw Error(j + t)
                    } else u.s = 45 === h.charCodeAt(0) ? (h = h.slice(1), -1) : 1;
                    for (i = E.slice(0, e), s = r = 0, l = h.length; r < l; r++) if (i.indexOf(n = h.charAt(r)) < 0) {
                        if ("." == n) {
                            if (s < r) {
                                s = l;
                                continue
                            }
                        } else if (!o && (h == h.toUpperCase() && (h = h.toLowerCase()) || h == h.toLowerCase() && (h = h.toUpperCase()))) {
                            o = !0, r = -1, s = 0;
                            continue
                        }
                        return d(u, String(t), a, e)
                    }
                    a = !1, -1 < (s = (h = c(h, e, 10, u.s)).indexOf(".")) ? h = h.replace(".", "") : s = h.length
                }
                for (r = 0; 48 === h.charCodeAt(r); r++) ;
                for (l = h.length; 48 === h.charCodeAt(--l);) ;
                if (h = h.slice(r, ++l)) {
                    if (l -= r, a && M.DEBUG && 15 < l && (U < t || t !== R(t))) throw Error(j + u.s * t);
                    if ((s = s - r - 1) > x) u.c = u.e = null; else if (s < L) u.c = [u.e = 0]; else {
                        if (u.e = s, u.c = [], r = (s + 1) % 14, s < 0 && (r += 14), r < l) {
                            for (r && u.c.push(+h.slice(0, r)), l -= 14; r < l;) u.c.push(+h.slice(r, r += 14));
                            r = 14 - (h = h.slice(r)).length
                        } else r -= l;
                        for (; r--; h += "0") ;
                        u.c.push(+h)
                    }
                } else u.c = [u.e = 0]
            }

            function o(t, e, i, n) {
                var o, s, r, a;
                if (null == i ? i = y : q(i, 0, 8), !t.c) return t.toString();
                if (o = t.c[0], s = t.e, null == e) a = G(t.c), a = 1 == n || 2 == n && (s <= m || b <= s) ? Y(a, s) : K(a, s, "0"); else if (i = (t = k(new M(t), e, i)).e, r = (a = G(t.c)).length, 1 == n || 2 == n && (e <= i || i <= m)) {
                    for (; r < e; a += "0", r++) ;
                    a = Y(a, i)
                } else if (e -= s, a = K(a, i, "0"), r < i + 1) {
                    if (0 < --e) for (a += "."; e--; a += "0") ;
                } else if (0 < (e += i - r)) for (i + 1 == r && (a += "."); e--; a += "0") ;
                return t.s < 0 && o ? "-" + a : a
            }

            function s(t, e) {
                for (var i, n = 1, o = new M(t[0]); n < t.length; n++) {
                    if (!(i = new M(t[n])).s) {
                        o = i;
                        break
                    }
                    e.call(o, i) && (o = i)
                }
                return o
            }

            function S(t, e, i) {
                for (var n = 1, o = e.length; !e[--o]; e.pop()) ;
                for (o = e[0]; 10 <= o; o /= 10, n++) ;
                return (i = n + 14 * i - 1) > x ? t.c = t.e = null : i < L ? t.c = [t.e = 0] : (t.e = i, t.c = e), t
            }

            function k(t, e, i, n) {
                var o, s, r, a, l, h, u, c = t.c, d = H;
                if (c) {
                    t:{
                        for (o = 1, a = c[0]; 10 <= a; a /= 10, o++) ;
                        if ((s = e - o) < 0) s += 14, r = e, u = (l = c[h = 0]) / d[o - r - 1] % 10 | 0; else if ((h = Z((s + 1) / 14)) >= c.length) {
                            if (!n) break t;
                            for (; c.length <= h; c.push(0)) ;
                            l = u = 0, r = (s %= 14) - 14 + (o = 1)
                        } else {
                            for (l = a = c[h], o = 1; 10 <= a; a /= 10, o++) ;
                            u = (r = (s %= 14) - 14 + o) < 0 ? 0 : l / d[o - r - 1] % 10 | 0
                        }
                        if (n = n || e < 0 || null != c[h + 1] || (r < 0 ? l : l % d[o - r - 1]), n = i < 4 ? (u || n) && (0 == i || i == (t.s < 0 ? 3 : 2)) : 5 < u || 5 == u && (4 == i || n || 6 == i && (0 < s ? 0 < r ? l / d[o - r] : 0 : c[h - 1]) % 10 & 1 || i == (t.s < 0 ? 8 : 7)), e < 1 || !c[0]) return c.length = 0, n ? (e -= t.e + 1, c[0] = d[(14 - e % 14) % 14], t.e = -e || 0) : c[0] = t.e = 0, t;
                        if (0 == s ? (c.length = h, a = 1, h--) : (c.length = h + 1, a = d[14 - s], c[h] = 0 < r ? R(l / d[o - r] % d[r]) * a : 0), n) for (; ;) {
                            if (0 == h) {
                                for (s = 1, r = c[0]; 10 <= r; r /= 10, s++) ;
                                for (r = c[0] += a, a = 1; 10 <= r; r /= 10, a++) ;
                                s != a && (t.e++, c[0] == F) && (c[0] = 1);
                                break
                            }
                            if (c[h] += a, c[h] != F) break;
                            c[h--] = 0, a = 1
                        }
                        for (s = c.length; 0 === c[--s]; c.pop()) ;
                    }
                    t.e > x ? t.c = t.e = null : t.e < L && (t.c = [t.e = 0])
                }
                return t
            }

            function O(t) {
                var e, i = t.e;
                return null === i ? t.toString() : (e = G(t.c), e = i <= m || b <= i ? Y(e, i) : K(e, i, "0"), t.s < 0 ? "-" + e : e)
            }

            return M.clone = N, M.ROUND_UP = 0, M.ROUND_DOWN = 1, M.ROUND_CEIL = 2, M.ROUND_FLOOR = 3, M.ROUND_HALF_UP = 4, M.ROUND_HALF_DOWN = 5, M.ROUND_HALF_EVEN = 6, M.ROUND_HALF_CEIL = 7, M.ROUND_HALF_FLOOR = 8, M.EUCLID = 9, M.config = M.set = function (t) {
                var e, i;
                if (null != t) {
                    if ("object" != typeof t) throw Error(D + "Object expected: " + t);
                    if (t.hasOwnProperty(e = "DECIMAL_PLACES") && (q(i = t[e], 0, 1e9, e), v = i), t.hasOwnProperty(e = "ROUNDING_MODE") && (q(i = t[e], 0, 8, e), y = i), t.hasOwnProperty(e = "EXPONENTIAL_AT") && ((i = t[e]) && i.pop ? (q(i[0], -1e9, 0, e), q(i[1], 0, 1e9, e), m = i[0], b = i[1]) : (q(i, -1e9, 1e9, e), m = -(b = i < 0 ? -i : i))), t.hasOwnProperty(e = "RANGE")) if ((i = t[e]) && i.pop) q(i[0], -1e9, -1, e), q(i[1], 1, 1e9, e), L = i[0], x = i[1]; else {
                        if (q(i, -1e9, 1e9, e), !i) throw Error(D + e + " cannot be zero: " + i);
                        L = -(x = i < 0 ? -i : i)
                    }
                    if (t.hasOwnProperty(e = "CRYPTO")) {
                        if ((i = t[e]) !== !!i) throw Error(D + e + " not true or false: " + i);
                        if (i && ("undefined" == typeof crypto || !crypto || !crypto.getRandomValues && !crypto.randomBytes)) throw w = !i, Error(D + "crypto unavailable");
                        w = i
                    }
                    if (t.hasOwnProperty(e = "MODULO_MODE") && (q(i = t[e], 0, 9, e), n = i), t.hasOwnProperty(e = "POW_PRECISION") && (q(i = t[e], 0, 1e9, e), P = i), t.hasOwnProperty(e = "FORMAT")) {
                        if ("object" != typeof (i = t[e])) throw Error(D + e + " not an object: " + i);
                        C = i
                    }
                    if (t.hasOwnProperty(e = "ALPHABET")) {
                        if ("string" != typeof (i = t[e]) || /^.?$|[+\-.\s]|(.).*\1/.test(i)) throw Error(D + e + " invalid: " + i);
                        T = "0123456789" == i.slice(0, 10), E = i
                    }
                }
                return {
                    DECIMAL_PLACES: v,
                    ROUNDING_MODE: y,
                    EXPONENTIAL_AT: [m, b],
                    RANGE: [L, x],
                    CRYPTO: w,
                    MODULO_MODE: n,
                    POW_PRECISION: P,
                    FORMAT: C,
                    ALPHABET: E
                }
            }, M.isBigNumber = function (t) {
                if (!t || !0 !== t._isBigNumber) return !1;
                if (!M.DEBUG) return !0;
                var e, i, n = t.c, o = t.e, s = t.s;
                t:if ("[object Array]" == {}.toString.call(n)) {
                    if ((1 === s || -1 === s) && -1e9 <= o && o <= 1e9 && o === R(o)) if (0 === n[0]) {
                        if (0 === o && 1 === n.length) return !0
                    } else if ((e = (o + 1) % 14) < 1 && (e += 14), String(n[0]).length == e) {
                        for (e = 0; e < n.length; e++) if ((i = n[e]) < 0 || F <= i || i !== R(i)) break t;
                        if (0 !== i) return !0
                    }
                } else if (null === n && null === o && (null === s || 1 === s || -1 === s)) return !0;
                throw Error(D + "Invalid BigNumber: " + t)
            }, M.maximum = M.max = function () {
                return s(arguments, i.lt)
            }, M.minimum = M.min = function () {
                return s(arguments, i.gt)
            }, M.random = (e = 9007199254740992, h = Math.random() * e & 2097151 ? function () {
                return R(Math.random() * e)
            } : function () {
                return 8388608 * (1073741824 * Math.random() | 0) + (8388608 * Math.random() | 0)
            }, function (t) {
                var e, i, n, o, s, r = 0, a = [], l = new M(f);
                if (null == t ? t = v : q(t, 0, 1e9), o = Z(t / 14), w) if (crypto.getRandomValues) {
                    for (e = crypto.getRandomValues(new Uint32Array(o *= 2)); r < o;) 9e15 <= (s = 131072 * e[r] + (e[r + 1] >>> 11)) ? (i = crypto.getRandomValues(new Uint32Array(2)), e[r] = i[0], e[r + 1] = i[1]) : (a.push(s % 1e14), r += 2);
                    r = o / 2
                } else {
                    if (!crypto.randomBytes) throw w = !1, Error(D + "crypto unavailable");
                    for (e = crypto.randomBytes(o *= 7); r < o;) 9e15 <= (s = 281474976710656 * (31 & e[r]) + 1099511627776 * e[r + 1] + 4294967296 * e[r + 2] + 16777216 * e[r + 3] + (e[r + 4] << 16) + (e[r + 5] << 8) + e[r + 6]) ? crypto.randomBytes(7).copy(e, r) : (a.push(s % 1e14), r += 7);
                    r = o / 7
                }
                if (!w) for (; r < o;) (s = h()) < 9e15 && (a[r++] = s % 1e14);
                for (t %= 14, (o = a[--r]) && t && (a[r] = R(o / (s = H[14 - t])) * s); 0 === a[r]; a.pop(), r--) ;
                if (r < 0) a = [n = 0]; else {
                    for (n = -1; 0 === a[0]; a.splice(0, 1), n -= 14) ;
                    for (r = 1, s = a[0]; 10 <= s; s /= 10, r++) ;
                    r < 14 && (n -= 14 - r)
                }
                return l.e = n, l.c = a, l
            }), M.sum = function () {
                for (var t = 1, e = arguments, i = new M(e[0]); t < e.length;) i = i.plus(e[t++]);
                return i
            }, g = "0123456789", c = function (t, e, i, n, o) {
                var s, r, a, l, h, u, c, d, p = t.indexOf("."), f = v, m = y;
                for (0 <= p && (l = P, P = 0, t = t.replace(".", ""), u = (d = new M(e)).pow(t.length - p), P = l, d.c = B(K(G(u.c), u.e, "0"), 10, i, g), d.e = d.c.length), a = l = (c = B(t, e, i, o ? (s = E, g) : (s = g, E))).length; 0 == c[--l]; c.pop()) ;
                if (!c[0]) return s.charAt(0);
                if (p < 0 ? --a : (u.c = c, u.e = a, u.s = n, c = (u = _(u, d, f, m, i)).c, h = u.r, a = u.e), p = c[r = a + f + 1], l = i / 2, h = h || r < 0 || null != c[r + 1], h = m < 4 ? (null != p || h) && (0 == m || m == (u.s < 0 ? 3 : 2)) : l < p || p == l && (4 == m || h || 6 == m && 1 & c[r - 1] || m == (u.s < 0 ? 8 : 7)), r < 1 || !c[0]) t = h ? K(s.charAt(1), -f, s.charAt(0)) : s.charAt(0); else {
                    if (c.length = r, h) for (--i; ++c[--r] > i;) c[r] = 0, r || (++a, c = [1].concat(c));
                    for (l = c.length; !c[--l];) ;
                    for (p = 0, t = ""; p <= l; t += s.charAt(c[p++])) ;
                    t = K(t, a, s.charAt(0))
                }
                return t
            }, _ = function (t, e, i, n, o) {
                var s, r, a, l, h, u, c, d, p, f, m, _, g, v, y, b, L, x = t.s == e.s ? 1 : -1, w = t.c, P = e.c;
                if (!(w && w[0] && P && P[0])) return new M(t.s && e.s && (w ? !P || w[0] != P[0] : P) ? w && 0 == w[0] || !P ? 0 * x : x / 0 : NaN);
                for (p = (d = new M(x)).c = [], x = i + (r = t.e - e.e) + 1, o || (o = F, r = W(t.e / 14) - W(e.e / 14), x = x / 14 | 0), a = 0; P[a] == (w[a] || 0); a++) ;
                if (P[a] > (w[a] || 0) && r--, x < 0) p.push(1), l = !0; else {
                    for (v = w.length, b = P.length, x += 2, 1 < (h = R(o / (P[a = 0] + 1))) && (P = A(P, h, o), w = A(w, h, o), b = P.length, v = w.length), g = b, m = (f = w.slice(0, b)).length; m < b; f[m++] = 0) ;
                    L = P.slice(), L = [0].concat(L), y = P[0], P[1] >= o / 2 && y++;
                    do {
                        if (h = 0, (s = I(P, f, b, m)) < 0) {
                            if (_ = f[0], b != m && (_ = _ * o + (f[1] || 0)), 1 < (h = R(_ / y))) for (c = (u = A(P, h = o <= h ? o - 1 : h, o)).length, m = f.length; 1 == I(u, f, c, m);) h--, z(u, b < c ? L : P, c, o), c = u.length, s = 1; else 0 == h && (s = h = 1), c = (u = P.slice()).length;
                            if (z(f, u = c < m ? [0].concat(u) : u, m, o), m = f.length, -1 == s) for (; I(P, f, b, m) < 1;) h++, z(f, b < m ? L : P, m, o), m = f.length
                        } else 0 === s && (h++, f = [0])
                    } while (p[a++] = h, f[0] ? f[m++] = w[g] || 0 : (f = [w[g]], m = 1), (g++ < v || null != f[0]) && x--);
                    l = null != f[0], p[0] || p.splice(0, 1)
                }
                if (o == F) {
                    for (a = 1, x = p[0]; 10 <= x; x /= 10, a++) ;
                    k(d, i + (d.e = a + 14 * r - 1) + 1, n, l)
                } else d.e = r, d.r = +l;
                return d
            }, r = /^(-?)0([xbo])(?=\w[\w.]*$)/i, a = /^([^.]+)\.$/, l = /^\.([^.]+)$/, u = /^-?(Infinity|NaN)$/, p = /^\s*\+(?=[\w.])|^\s+|\s+$/g, d = function (t, e, i, n) {
                var o, s = i ? e : e.replace(p, "");
                if (u.test(s)) t.s = isNaN(s) ? null : s < 0 ? -1 : 1; else {
                    if (!i && (s = s.replace(r, function (t, e, i) {
                        return o = "x" == (i = i.toLowerCase()) ? 16 : "b" == i ? 2 : 8, n && n != o ? t : e
                    }), n && (o = n, s = s.replace(a, "$1").replace(l, "0.$1")), e != s)) return new M(s, o);
                    if (M.DEBUG) throw Error(D + "Not a" + (n ? " base " + n : "") + " number: " + e);
                    t.s = null
                }
                t.c = t.e = null
            }, i.absoluteValue = i.abs = function () {
                var t = new M(this);
                return t.s < 0 && (t.s = 1), t
            }, i.comparedTo = function (t, e) {
                return V(this, new M(t, e))
            }, i.decimalPlaces = i.dp = function (t, e) {
                var i, n;
                if (null != t) return q(t, 0, 1e9), null == e ? e = y : q(e, 0, 8), k(new M(this), t + this.e + 1, e);
                if (!(t = this.c)) return null;
                if (i = 14 * ((n = t.length - 1) - W(this.e / 14)), n = t[n]) for (; n % 10 == 0; n /= 10, i--) ;
                return i = i < 0 ? 0 : i
            }, i.dividedBy = i.div = function (t, e) {
                return _(this, new M(t, e), v, y)
            }, i.dividedToIntegerBy = i.idiv = function (t, e) {
                return _(this, new M(t, e), 0, 1)
            }, i.exponentiatedBy = i.pow = function (t, e) {
                var i, n, o, s, r, a, l, h, u = this;
                if ((t = new M(t)).c && !t.isInteger()) throw Error(D + "Exponent not an integer: " + O(t));
                if (null != e && (e = new M(e)), r = 14 < t.e, !u.c || !u.c[0] || 1 == u.c[0] && !u.e && 1 == u.c.length || !t.c || !t.c[0]) return h = new M(Math.pow(+O(u), r ? t.s * (2 - $(t)) : +O(t))), e ? h.mod(e) : h;
                if (a = t.s < 0, e) {
                    if (e.c ? !e.c[0] : !e.s) return new M(NaN);
                    (n = !a && u.isInteger() && e.isInteger()) && (u = u.mod(e))
                } else {
                    if (9 < t.e && (0 < u.e || u.e < -1 || (0 == u.e ? 1 < u.c[0] || r && 24e7 <= u.c[1] : u.c[0] < 8e13 || r && u.c[0] <= 9999975e7))) return s = u.s < 0 && $(t) ? -0 : 0, -1 < u.e && (s = 1 / s), new M(a ? 1 / s : s);
                    P && (s = Z(P / 14 + 2))
                }
                for (l = r ? (i = new M(.5), a && (t.s = 1), $(t)) : (o = Math.abs(+O(t))) % 2, h = new M(f); ;) {
                    if (l) {
                        if (!(h = h.times(u)).c) break;
                        s ? h.c.length > s && (h.c.length = s) : n && (h = h.mod(e))
                    }
                    if (o) {
                        if (0 === (o = R(o / 2))) break;
                        l = o % 2
                    } else if (k(t = t.times(i), t.e + 1, 1), 14 < t.e) l = $(t); else {
                        if (0 == (o = +O(t))) break;
                        l = o % 2
                    }
                    u = u.times(u), s ? u.c && u.c.length > s && (u.c.length = s) : n && (u = u.mod(e))
                }
                return n ? h : (a && (h = f.div(h)), e ? h.mod(e) : s ? k(h, P, y, void 0) : h)
            }, i.integerValue = function (t) {
                var e = new M(this);
                return null == t ? t = y : q(t, 0, 8), k(e, e.e + 1, t)
            }, i.isEqualTo = i.eq = function (t, e) {
                return 0 === V(this, new M(t, e))
            }, i.isFinite = function () {
                return !!this.c
            }, i.isGreaterThan = i.gt = function (t, e) {
                return 0 < V(this, new M(t, e))
            }, i.isGreaterThanOrEqualTo = i.gte = function (t, e) {
                return 1 === (e = V(this, new M(t, e))) || 0 === e
            }, i.isInteger = function () {
                return !!this.c && W(this.e / 14) > this.c.length - 2
            }, i.isLessThan = i.lt = function (t, e) {
                return V(this, new M(t, e)) < 0
            }, i.isLessThanOrEqualTo = i.lte = function (t, e) {
                return -1 === (e = V(this, new M(t, e))) || 0 === e
            }, i.isNaN = function () {
                return !this.s
            }, i.isNegative = function () {
                return this.s < 0
            }, i.isPositive = function () {
                return 0 < this.s
            }, i.isZero = function () {
                return !!this.c && 0 == this.c[0]
            }, i.minus = function (t, e) {
                var i, n, o, s, r = this.s;
                if (e = (t = new M(t, e)).s, !r || !e) return new M(NaN);
                if (r != e) return t.s = -e, this.plus(t);
                var a = this.e / 14, l = t.e / 14, h = this.c, u = t.c;
                if (!a || !l) {
                    if (!h || !u) return h ? (t.s = -e, t) : new M(u ? this : NaN);
                    if (!h[0] || !u[0]) return u[0] ? (t.s = -e, t) : new M(h[0] ? this : 3 == y ? -0 : 0)
                }
                if (a = W(a), l = W(l), h = h.slice(), r = a - l) {
                    for ((o = (s = r < 0) ? (r = -r, h) : (l = a, u)).reverse(), e = r; e--; o.push(0)) ;
                    o.reverse()
                } else for (n = (s = (r = h.length) < (e = u.length)) ? r : e, r = e = 0; e < n; e++) if (h[e] != u[e]) {
                    s = h[e] < u[e];
                    break
                }
                if (s && (o = h, h = u, u = o, t.s = -t.s), 0 < (e = (n = u.length) - (i = h.length))) for (; e--; h[i++] = 0) ;
                for (e = F - 1; r < n;) {
                    if (h[--n] < u[n]) {
                        for (i = n; i && !h[--i]; h[i] = e) ;
                        --h[i], h[n] += F
                    }
                    h[n] -= u[n]
                }
                for (; 0 == h[0]; h.splice(0, 1), --l) ;
                return h[0] ? S(t, h, l) : (t.s = 3 == y ? -1 : 1, t.c = [t.e = 0], t)
            }, i.modulo = i.mod = function (t, e) {
                var i;
                return t = new M(t, e), !this.c || !t.s || t.c && !t.c[0] ? new M(NaN) : !t.c || this.c && !this.c[0] ? new M(this) : (9 == n ? (e = t.s, t.s = 1, i = _(this, t, 0, 3), t.s = e, i.s *= e) : i = _(this, t, 0, n), (t = this.minus(i.times(t))).c[0] || 1 != n || (t.s = this.s), t)
            }, i.multipliedBy = i.times = function (t, e) {
                var i, n, o, s, r, a, l, h, u, c, d, p, f = this.c, m = (t = new M(t, e)).c;
                if (!(f && m && f[0] && m[0])) return !this.s || !t.s || f && !f[0] && !m || m && !m[0] && !f ? t.c = t.e = t.s = null : (t.s *= this.s, f && m ? (t.c = [0], t.e = 0) : t.c = t.e = null), t;
                for (e = W(this.e / 14) + W(t.e / 14), t.s *= this.s, (a = f.length) < (u = m.length) && (p = f, f = m, m = p, n = a, a = u, u = n), n = a + u, p = []; n--; p.push(0)) ;
                for (n = u; 0 <= --n;) {
                    for (c = m[n] % 1e7, d = m[n] / 1e7 | (i = 0), o = n + (s = a); n < o;) i = ((l = c * (l = f[--s] % 1e7) + (r = d * l + (h = f[s] / 1e7 | 0) * c) % 1e7 * 1e7 + p[o] + i) / 1e14 | 0) + (r / 1e7 | 0) + d * h, p[o--] = l % 1e14;
                    p[o] = i
                }
                return i ? ++e : p.splice(0, 1), S(t, p, e)
            }, i.negated = function () {
                var t = new M(this);
                return t.s = -t.s || null, t
            }, i.plus = function (t, e) {
                var i, n = this.s;
                if (e = (t = new M(t, e)).s, !n || !e) return new M(NaN);
                if (n != e) return t.s = -e, this.minus(t);
                var o = this.e / 14, s = t.e / 14, r = this.c, a = t.c;
                if (!o || !s) {
                    if (!r || !a) return new M(n / 0);
                    if (!r[0] || !a[0]) return a[0] ? t : new M(r[0] ? this : 0 * n)
                }
                if (o = W(o), s = W(s), r = r.slice(), n = o - s) {
                    for ((i = 0 < n ? (s = o, a) : (n = -n, r)).reverse(); n--; i.push(0)) ;
                    i.reverse()
                }
                for ((n = r.length) - (e = a.length) < 0 && (i = a, a = r, r = i, e = n), n = 0; e;) n = (r[--e] = r[e] + a[e] + n) / F | 0, r[e] = F === r[e] ? 0 : r[e] % F;
                return n && (r = [n].concat(r), ++s), S(t, r, s)
            }, i.precision = i.sd = function (t, e) {
                var i, n;
                if (null != t && t !== !!t) return q(t, 1, 1e9), null == e ? e = y : q(e, 0, 8), k(new M(this), t, e);
                if (!(e = this.c)) return null;
                if (i = 14 * (n = e.length - 1) + 1, n = e[n]) {
                    for (; n % 10 == 0; n /= 10, i--) ;
                    for (n = e[0]; 10 <= n; n /= 10, i++) ;
                }
                return i = t && this.e + 1 > i ? this.e + 1 : i
            }, i.shiftedBy = function (t) {
                return q(t, -9007199254740991, U), this.times("1e" + t)
            }, i.squareRoot = i.sqrt = function () {
                var t, e, i, n, o, s = this.c, r = this.s, a = this.e, l = v + 4, h = new M("0.5");
                if (1 !== r || !s || !s[0]) return new M(!r || r < 0 && (!s || s[0]) ? NaN : s ? this : 1 / 0);
                if ((i = 0 == (r = Math.sqrt(+O(this))) || r == 1 / 0 ? (((e = G(s)).length + a) % 2 == 0 && (e += "0"), r = Math.sqrt(+e), a = W((a + 1) / 2) - (a < 0 || a % 2), new M(e = r == 1 / 0 ? "5e" + a : (e = r.toExponential()).slice(0, e.indexOf("e") + 1) + a)) : new M(r + "")).c[0]) for ((r = (a = i.e) + l) < 3 && (r = 0); ;) if (o = i, i = h.times(o.plus(_(this, o, l, 1))), G(o.c).slice(0, r) === (e = G(i.c)).slice(0, r)) {
                    if (i.e < a && --r, "9999" != (e = e.slice(r - 3, r + 1)) && (n || "4999" != e)) {
                        +e && (+e.slice(1) || "5" != e.charAt(0)) || (k(i, i.e + v + 2, 1), t = !i.times(i).eq(this));
                        break
                    }
                    if (!n && (k(o, o.e + v + 2, 0), o.times(o).eq(this))) {
                        i = o;
                        break
                    }
                    l += 4, r += 4, n = 1
                }
                return k(i, i.e + v + 1, y, t)
            }, i.toExponential = function (t, e) {
                return null != t && (q(t, 0, 1e9), t++), o(this, t, e, 1)
            }, i.toFixed = function (t, e) {
                return null != t && (q(t, 0, 1e9), t = t + this.e + 1), o(this, t, e)
            }, i.toFormat = function (t, e, i) {
                if (null == i) null != t && e && "object" == typeof e ? (i = e, e = null) : t && "object" == typeof t ? (i = t, t = e = null) : i = C; else if ("object" != typeof i) throw Error(D + "Argument not an object: " + i);
                if (t = this.toFixed(t, e), this.c) {
                    var n, e = t.split("."), o = +i.groupSize, s = +i.secondaryGroupSize, r = i.groupSeparator || "",
                        a = e[0], e = e[1], l = this.s < 0, h = l ? a.slice(1) : a, u = h.length;
                    if (s && (n = o, o = s, u -= s = n), 0 < o && 0 < u) {
                        for (a = h.substr(0, n = u % o || o); n < u; n += o) a += r + h.substr(n, o);
                        0 < s && (a += r + h.slice(n)), l && (a = "-" + a)
                    }
                    t = e ? a + (i.decimalSeparator || "") + ((s = +i.fractionGroupSize) ? e.replace(new RegExp("\\d{" + s + "}\\B", "g"), "$&" + (i.fractionGroupSeparator || "")) : e) : a
                }
                return (i.prefix || "") + t + (i.suffix || "")
            }, i.toFraction = function (t) {
                var e, i, n, o, s, r, a, l, h, u, c = this.c;
                if (null != t && (!(a = new M(t)).isInteger() && (a.c || 1 !== a.s) || a.lt(f))) throw Error(D + "Argument " + (a.isInteger() ? "out of range: " : "not an integer: ") + O(a));
                if (!c) return new M(this);
                for (e = new M(f), h = i = new M(f), n = l = new M(f), c = G(c), s = e.e = c.length - this.e - 1, e.c[0] = H[(r = s % 14) < 0 ? 14 + r : r], t = !t || 0 < a.comparedTo(e) ? 0 < s ? e : h : a, r = x, x = 1 / 0, a = new M(c), l.c[0] = 0; u = _(a, e, 0, 1), 1 != (o = i.plus(u.times(n))).comparedTo(t);) i = n, n = o, h = l.plus(u.times(o = h)), l = o, e = a.minus(u.times(o = e)), a = o;
                return o = _(t.minus(i), n, 0, 1), l = l.plus(o.times(h)), i = i.plus(o.times(n)), l.s = h.s = this.s, c = _(h, n, s *= 2, y).minus(this).abs().comparedTo(_(l, i, s, y).minus(this).abs()) < 1 ? [h, n] : [l, i], x = r, c
            }, i.toNumber = function () {
                return +O(this)
            }, i.toPrecision = function (t, e) {
                return null != t && q(t, 1, 1e9), o(this, t, e, 2)
            }, i.toString = function (t) {
                var e, i = this, n = i.s, o = i.e;
                return null === o ? n ? (e = "Infinity", n < 0 && (e = "-" + e)) : e = "NaN" : (e = null == t ? o <= m || b <= o ? Y(G(i.c), o) : K(G(i.c), o, "0") : 10 === t && T ? K(G((i = k(new M(i), v + o + 1, y)).c), i.e, "0") : (q(t, 2, E.length, "Base"), c(K(G(i.c), o, "0"), 10, t, n, !0)), n < 0 && i.c[0] && (e = "-" + e)), e
            }, i.valueOf = i.toJSON = function () {
                return O(this)
            }, i._isBigNumber = !0, i[Symbol.toStringTag] = "BigNumber", i[Symbol.for("nodejs.util.inspect.custom")] = i.valueOf, null != t && M.set(t), M;

            function A(t, e, i) {
                var n, o, s, r = 0, a = t.length, l = e % 1e7, h = e / 1e7 | 0;
                for (t = t.slice(); a--;) r = ((o = l * (s = t[a] % 1e7) + (n = h * s + (s = t[a] / 1e7 | 0) * l) % 1e7 * 1e7 + r) / i | 0) + (n / 1e7 | 0) + h * s, t[a] = o % i;
                return t = r ? [r].concat(t) : t
            }

            function I(t, e, i, n) {
                var o, s;
                if (i != n) s = n < i ? 1 : -1; else for (o = s = 0; o < i; o++) if (t[o] != e[o]) {
                    s = t[o] > e[o] ? 1 : -1;
                    break
                }
                return s
            }

            function z(t, e, i, n) {
                for (var o = 0; i--;) t[i] -= o, o = t[i] < e[i] ? 1 : 0, t[i] = o * n + t[i] - e[i];
                for (; !t[0] && 1 < t.length; t.splice(0, 1)) ;
            }

            function B(t, e, i, n) {
                for (var o, s, r = [0], a = 0, l = t.length; a < l;) {
                    for (s = r.length; s--; r[s] *= e) ;
                    for (r[0] += n.indexOf(t.charAt(a++)), o = 0; o < r.length; o++) i - 1 < r[o] && (null == r[o + 1] && (r[o + 1] = 0), r[o + 1] += r[o] / i | 0, r[o] %= i)
                }
                return r.reverse()
            }
        }();

        function u(t) {
            return null != (t = i[t]) ? t : i.default
        }

        (t = i = i || {})[t.up = p.ROUND_UP] = "up", t[t.down = p.ROUND_DOWN] = "down", t[t.truncate = p.ROUND_DOWN] = "truncate", t[t.halfUp = p.ROUND_HALF_UP] = "halfUp", t[t.default = p.ROUND_HALF_UP] = "default", t[t.halfDown = p.ROUND_HALF_DOWN] = "halfDown", t[t.halfEven = p.ROUND_HALF_EVEN] = "halfEven", t[t.banker = p.ROUND_HALF_EVEN] = "banker", t[t.ceiling = p.ROUND_CEIL] = "ceiling", t[t.ceil = p.ROUND_CEIL] = "ceil", t[t.floor = p.ROUND_FLOOR] = "floor";
        var t = nt(6796), S = nt.n(t);

        function f(t, e) {
            [o, {precision: n, significant: i}] = [t, e];
            var i, n,
                o = i && null !== n && 0 < n ? n - ((i = o).isZero() ? 1 : Math.floor(Math.log10(i.abs().toNumber()) + 1)) : n;
            return null === o ? t.toString() : (i = u(e.roundMode), 0 <= o ? t.toFixed(o, i) : (n = Math.pow(10, Math.abs(o)), (t = new p(t.div(n).toFixed(0, i)).times(n)).toString()))
        }

        function o(t, e) {
            var i = new p(t);
            if (e.raise && !i.isFinite()) throw new Error(`"${t}" is not a valid numeric value`);
            var n = f(i, e), o = new p(n), s = o.lt(0), o = o.isZero();
            let [r, a] = n.split(".");
            var l = [];
            let h;
            var n = null != (n = e.format) ? n : "%n", u = null != (u = e.negativeFormat) ? u : "-" + n,
                s = s && !o ? u : n;
            for (r = r.replace("-", ""); 0 < r.length;) l.unshift(r.substr(Math.max(0, r.length - 3), 3)), r = r.substr(0, r.length - 3);
            return r = l.join(""), h = l.join(e.delimiter), a = e.significant ? ({
                significand: o,
                whole: u,
                precision: n
            } = [{
                whole: r,
                significand: a,
                precision: e.precision
            }][0], "0" === u || null === n ? o : (n = Math.max(0, n - u.length), (null != o ? o : "").substr(0, n))) : null != a ? a : S()("0", null != (u = e.precision) ? u : 0), e.stripInsignificantZeros && (a = a && a.replace(/0+$/, "")), i.isNaN() && (h = t.toString()), a && i.isFinite() && (h += (e.separator || ".") + a), [o, {
                formattedNumber: n,
                unit: u
            }] = [s, {formattedNumber: h, unit: e.unit}], o.replace("%n", n).replace("%u", u)
        }

        function a(t, e, i) {
            let n = "";
            return (e instanceof String || "string" == typeof e) && (n = e), e instanceof Array && (n = e.join(t.defaultSeparator)), n = i.scope ? [i.scope, n].join(t.defaultSeparator) : n
        }

        function l(t) {
            var e;
            return null === t ? "null" : "object" != (e = typeof t) ? e : (null == (t = null == (e = null == t ? void 0 : t.constructor) ? void 0 : e.name) ? void 0 : t.toLowerCase()) || "object"
        }

        function m(i, t, n) {
            n = Object.keys(n).reduce((t, e) => (t[i.transformKey(e)] = n[e], t), {});
            var e = t.match(i.placeholder);
            if (!e) return t;
            for (; e.length;) {
                var o = e.shift(), s = o.replace(i.placeholder, "$1"),
                    s = h(n[s]) ? n[s].toString().replace(/\$/gm, "_#$#_") : s in n ? i.nullPlaceholder(i, o, t, n) : i.missingPlaceholder(i, o, t, n),
                    o = new RegExp(o.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}"));
                t = t.replace(o, s)
            }
            return t.replace(/_#\$#_/g, "$")
        }

        function y(e, i, t = {}) {
            var n = ("locale" in (t = Object.assign({}, t)) ? t : e).locale, o = l(n),
                o = e.locales.get("string" === o ? n : typeof n).slice(),
                n = (i = a(e, i, t).split(e.defaultSeparator).map(t => e.transformKey(t)).join("."), o.map(t => r()(e.translations, [t, i].join("."))));
            return n.push(t.defaultValue), n.find(t => h(t))
        }

        var t = nt(9734), k = nt.n(t), t = nt(7287);
        const _ = {
                0: "unit",
                1: "ten",
                2: "hundred",
                3: "thousand",
                6: "million",
                9: "billion",
                12: "trillion",
                15: "quadrillion",
                "-1": "deci",
                "-2": "centi",
                "-3": "mili",
                "-6": "micro",
                "-9": "nano",
                "-12": "pico",
                "-15": "femto"
            }, O = nt.n(t)()(Object.values(_), Object.keys(_).map(t => parseInt(t, 10))),
            g = ["byte", "kb", "mb", "gb", "tb", "pb", "eb"];

        function b(t) {
            if (t instanceof Date) return t;
            if ("number" == typeof t) {
                const e = new Date;
                return e.setTime(t), e
            }
            const e = new String(t).match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2})(?:[.,](\d{1,3}))?)?(Z|\+00:?00)?/);
            if (e) {
                const t = e.slice(1, 8).map(t => parseInt(t, 10) || 0), [i, n, o, s, r, a, l] = (--t[1], t);
                return e[8] ? new Date(Date.UTC(i, n, o, s, r, a, l)) : new Date(i, n, o, s, r, a, l)
            }
            t.match(/([A-Z][a-z]{2}) ([A-Z][a-z]{2}) (\d+) (\d+:\d+:\d+) ([+-]\d+) (\d+)/) && (new Date).setTime(Date.parse([RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$6, RegExp.$4, RegExp.$5].join(" ")));
            const i = new Date;
            return i.setTime(Date.parse(t)), i
        }

        function s({i18n: t, count: e, scope: i, options: n, baseScope: o}) {
            let s, r;
            if (n = Object.assign({}, n), !(s = "object" == typeof i && i ? i : y(t, i, n))) return t.missingTranslation.get(i, n);
            for (var a = t.pluralization.get(n.locale)(t, e), l = []; a.length;) {
                const t = a.shift();
                if (h(s[t])) {
                    r = s[t];
                    break
                }
                l.push(t)
            }
            return h(r) ? (n.count = e, t.interpolate(t, r, n)) : t.missingTranslation.get(o.split(t.defaultSeparator).concat([l[0]]), n)
        }

        var t = nt(3218), A = nt.n(t), t = nt(2348), I = nt.n(t);

        class z {
            constructor(t) {
                this.target = t
            }

            call() {
                var t = I()(Object.keys(this.target).map(t => this.compute(this.target[t], t)));
                return t.sort(), t
            }

            compute(e, i) {
                return !Array.isArray(e) && A()(e) ? Object.keys(e).map(t => this.compute(e[t], i + "." + t)) : i
            }
        }

        const B = {
            meridian: {am: "AM", pm: "PM"},
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            abbrDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            monthNames: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            abbrMonthNames: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        };
        var t = nt(6026), N = nt.n(t);

        function J(t, e) {
            return e = (e = e instanceof Array ? e.join(t.defaultSeparator) : e).split(t.defaultSeparator).slice(-1)[0], t.missingTranslationPrefix + e.replace("_", " ").replace(/([a-z])([A-Z])/g, (t, e, i) => e + " " + i.toLowerCase())
        }

        const L = (t, e, i) => t <= i && i <= e, Q = (t, e, i) => {
            var e = a(t, e, i), i = ("locale" in i ? i : t).locale, n = l(i);
            return `[missing "${["string" == n ? i : n, e].join(t.defaultSeparator)}" translation]`
        }, tt = (t, e, i) => {
            e = a(t, e, i), i = [t.locale, e].join(t.defaultSeparator);
            throw new Error("Missing translation: " + i)
        };

        class et {
            constructor(t) {
                this.i18n = t, this.registry = {}, this.register("guess", J), this.register("message", Q), this.register("error", tt)
            }

            register(t, e) {
                this.registry[t] = e
            }

            get(t, e) {
                var i;
                return this.registry[null != (i = e.missingBehavior) ? i : this.i18n.missingBehavior](this.i18n, t, e)
            }
        }

        const x = {
            defaultLocale: "en",
            availableLocales: ["en"],
            locale: "en",
            defaultSeparator: ".",
            placeholder: /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm,
            enableFallback: !1,
            missingBehavior: "message",
            missingTranslationPrefix: "",
            missingPlaceholder: (t, e) => `[missing "${e}" value]`,
            nullPlaceholder: (t, e, i, n) => t.missingPlaceholder(t, e, i, n),
            transformKey: t => t
        };

        class it {
            constructor(t = {}, e = {}) {
                this._locale = x.locale, this._defaultLocale = x.defaultLocale, this._version = 0, this.onChangeHandlers = [], this.translations = {}, this.availableLocales = [], this.t = this.translate, this.p = this.pluralize, this.l = this.localize, this.distanceOfTimeInWords = this.timeAgoInWords;
                var {
                    locale: e,
                    enableFallback: i,
                    missingBehavior: n,
                    missingTranslationPrefix: o,
                    missingPlaceholder: s,
                    nullPlaceholder: r,
                    defaultLocale: a,
                    defaultSeparator: l,
                    placeholder: h,
                    transformKey: u
                } = Object.assign(Object.assign({}, x), e);
                this.locale = e, this.defaultLocale = a, this.defaultSeparator = l, this.enableFallback = i, this.locale = e, this.missingBehavior = n, this.missingTranslationPrefix = o, this.missingPlaceholder = s, this.nullPlaceholder = r, this.placeholder = h, this.pluralization = new d(this), this.locales = new c(this), this.missingTranslation = new et(this), this.transformKey = u, this.interpolate = m, this.store(t)
            }

            store(e) {
                new z(e).call().forEach(t => n()(this.translations, t, r()(e, t), Object)), this.hasChanged()
            }

            get locale() {
                return this._locale || this.defaultLocale || "en"
            }

            set locale(t) {
                if ("string" != typeof t) throw new Error("Expected newLocale to be a string; got " + l(t));
                var e = this._locale !== t;
                this._locale = t, e && this.hasChanged()
            }

            get defaultLocale() {
                return this._defaultLocale || "en"
            }

            set defaultLocale(t) {
                if ("string" != typeof t) throw new Error("Expected newLocale to be a string; got " + l(t));
                var e = this._defaultLocale !== t;
                this._defaultLocale = t, e && this.hasChanged()
            }

            translate(t, e) {
                var i = function (t, e, i) {
                    let n = [{scope: e}];
                    return h(i.defaults) && (n = n.concat(i.defaults)), h(i.defaultValue) && (t = "function" == typeof i.defaultValue ? i.defaultValue(t, e, i) : i.defaultValue, n.push({message: t}), delete i.defaultValue), n
                }(this, t, e = Object.assign({}, e));
                let n;
                return i.some(t => (h(t.scope) ? n = y(this, t.scope, e) : h(t.message) && (n = t.message), null != n)) ? ("string" == typeof n ? n = this.interpolate(this, n, e) : "object" == typeof n && n && h(e.count) && (n = s({
                    i18n: this,
                    count: e.count || 0,
                    scope: n,
                    options: e,
                    baseScope: a(this, t, e)
                })), n = e && n instanceof Array ? n.map(t => "string" == typeof t ? m(this, t, e) : t) : n) : this.missingTranslation.get(t, e)
            }

            pluralize(t, e, i) {
                return s({
                    i18n: this,
                    count: t,
                    scope: e,
                    options: Object.assign({}, i),
                    baseScope: a(this, e, null != i ? i : {})
                })
            }

            localize(t, e, i) {
                if (i = Object.assign({}, i), null == e) return "";
                switch (t) {
                    case"currency":
                        return this.numberToCurrency(e);
                    case"number":
                        return o(e, Object.assign({
                            delimiter: ",",
                            precision: 3,
                            separator: ".",
                            significant: !1,
                            stripInsignificantZeros: !1
                        }, y(this, "number.format")));
                    case"percentage":
                        return this.numberToPercentage(e);
                    default:
                        var n = t.match(/^(date|time)/) ? this.toTime(t, e) : e.toString();
                        return m(this, n, i)
                }
            }

            toTime(t, e) {
                e = b(e), t = y(this, t);
                return !e.toString().match(/invalid/i) && t ? this.strftime(e, t) : e.toString()
            }

            numberToCurrency(t, e = {}) {
                return o(t, Object.assign(Object.assign(Object.assign({
                    delimiter: ",",
                    format: "%u%n",
                    precision: 2,
                    separator: ".",
                    significant: !1,
                    stripInsignificantZeros: !1,
                    unit: "$"
                }, v(this.get("number.format"))), v(this.get("number.currency.format"))), e))
            }

            numberToPercentage(t, e = {}) {
                return o(t, Object.assign(Object.assign(Object.assign({
                    delimiter: "",
                    format: "%n%",
                    precision: 3,
                    stripInsignificantZeros: !1,
                    separator: ".",
                    significant: !1
                }, v(this.get("number.format"))), v(this.get("number.percentage.format"))), e))
            }

            numberToHumanSize(e, i = {}) {
                {
                    var n = this;
                    const r = u((i = Object.assign(Object.assign(Object.assign({
                            delimiter: "",
                            precision: 3,
                            significant: !0,
                            stripInsignificantZeros: !0,
                            units: {
                                billion: "Billion",
                                million: "Million",
                                quadrillion: "Quadrillion",
                                thousand: "Thousand",
                                trillion: "Trillion",
                                unit: ""
                            }
                        }, v(this.get("number.human.format"))), v(this.get("number.human.storage_units"))), i)).roundMode),
                        a = new p(e).abs(), l = a.lt(1024);
                    e = a, o = g.length - 1, e = new p(Math.log(e.toNumber())).div(Math.log(1024)).integerValue(p.ROUND_DOWN).toNumber();
                    var o = Math.min(o, e), e = l ? a.integerValue() : new p(f(a.div(Math.pow(1024, o)), {
                            significant: i.significant,
                            precision: i.precision,
                            roundMode: i.roundMode
                        })), s = n.translate("number.human.storage_units.format", {defaultValue: "%n %u"}),
                        n = n.translate("number.human.storage_units.units." + (l ? "byte" : g[o]), {count: a.integerValue().toNumber()});
                    let t = e.toFixed(i.precision, r);
                    return i.stripInsignificantZeros && (t = t.replace(/(\..*?)0+$/, "$1").replace(/\.$/, "")), s.replace("%n", t).replace("%u", n)
                }
            }

            numberToHuman(n, e = {}) {
                {
                    var o = this, s = n;
                    n = Object.assign(Object.assign(Object.assign({
                        delimiter: "",
                        separator: ".",
                        precision: 3,
                        significant: !0,
                        stripInsignificantZeros: !0,
                        format: "%n %u",
                        roundMode: "default",
                        units: {
                            billion: "Billion",
                            million: "Million",
                            quadrillion: "Quadrillion",
                            thousand: "Thousand",
                            trillion: "Trillion",
                            unit: ""
                        }
                    }, v(this.get("number.human.format"))), v(this.get("number.human.decimal_units"))), e), e = {
                        roundMode: n.roundMode,
                        precision: n.precision,
                        significant: n.significant
                    };
                    let t;
                    if ("string" === l(n.units)) {
                        const s = n.units;
                        if (!(t = y(o, s))) throw new Error(`The scope "${o.locale}${o.defaultSeparator}${a(o, s, {})}" couldn't be found`)
                    } else t = n.units;
                    let i = f(new p(s), e);
                    var r, o = ((t, e) => {
                        const i = t.isZero() ? 0 : Math.floor(Math.log10(t.abs().toNumber()));
                        return t = e, k()(Object.keys(t).map(t => O[t]), t => -1 * t).find(t => i >= t) || 0
                    })(new p(i), t), s = (s = t, r = o, s[_[r.toString()]] || "");
                    if (i = f(new p(i).div(Math.pow(10, o)), e), n.stripInsignificantZeros) {
                        let [t, e] = i.split(".");
                        e = (e || "").replace(/0+$/, ""), i = t, e && (i += "" + n.separator + e)
                    }
                    return n.format.replace("%n", i || "0").replace("%u", s).trim()
                }
            }

            numberToRounded(t, e) {
                return o(t, Object.assign({
                    unit: "",
                    precision: 3,
                    significant: !1,
                    separator: ".",
                    delimiter: "",
                    stripInsignificantZeros: !1
                }, e))
            }

            numberToDelimited(i, n = {}) {
                {
                    var o = Object.assign({
                        delimiterPattern: /(\d)(?=(\d\d\d)+(?!\d))/g,
                        delimiter: ",",
                        separator: "."
                    }, n);
                    if (!(n = new p(i)).isFinite()) return i.toString();
                    if (!o.delimiterPattern.global) throw new Error("options.delimiterPattern must be a global regular expression; received " + o.delimiterPattern);
                    let [t, e] = n.toString().split(".");
                    return [t = t.replace(o.delimiterPattern, t => "" + t + o.delimiter), e].filter(Boolean).join(o.separator)
                }
            }

            withLocale(e, i) {
                return t = this, a = function* () {
                    var t = this.locale;
                    try {
                        this.locale = e, yield i()
                    } finally {
                        this.locale = t
                    }
                }, new (r = (r = void 0, Promise))(function (i, e) {
                    function n(t) {
                        try {
                            s(a.next(t))
                        } catch (t) {
                            e(t)
                        }
                    }

                    function o(t) {
                        try {
                            s(a.throw(t))
                        } catch (t) {
                            e(t)
                        }
                    }

                    function s(t) {
                        var e;
                        t.done ? i(t.value) : ((e = t.value) instanceof r ? e : new r(function (t) {
                            t(e)
                        })).then(n, o)
                    }

                    s((a = a.apply(t, [])).next())
                });
                var t, r, a
            }

            strftime(e, i, n = {}) {
                {
                    var [e, i, n = {}] = [e, i, Object.assign(Object.assign(Object.assign({}, v(y(this, "date"))), {
                        meridian: {
                            am: y(this, "time.am") || "AM",
                            pm: y(this, "time.pm") || "PM"
                        }
                    }), n)], {
                        abbrDayNames: n,
                        dayNames: o,
                        abbrMonthNames: s,
                        monthNames: r,
                        meridian: a
                    } = Object.assign(Object.assign({}, B), n);
                    if (isNaN(e.getTime())) throw new Error("strftime() requires a valid date object, but received an invalid date.");
                    var l = e.getDay(), h = e.getDate(), u = e.getFullYear(), c = e.getMonth() + 1, d = e.getHours();
                    let t = d;
                    var p = 11 < d ? "pm" : "am", f = e.getSeconds(), m = e.getMinutes(), e = e.getTimezoneOffset(),
                        _ = Math.floor(Math.abs(e / 60)), g = Math.abs(e) - 60 * _,
                        e = (0 < e ? "-" : "+") + (_.toString().length < 2 ? "0" + _ : _) + (g.toString().length < 2 ? "0" + g : g);
                    return 12 < t ? t -= 12 : 0 === t && (t = 12), (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = i.replace("%a", n[l])).replace("%A", o[l])).replace("%b", s[c])).replace("%B", r[c])).replace("%d", h.toString().padStart(2, "0"))).replace("%e", h.toString())).replace("%-d", h.toString())).replace("%H", d.toString().padStart(2, "0"))).replace("%-H", d.toString())).replace("%k", d.toString())).replace("%I", t.toString().padStart(2, "0"))).replace("%-I", t.toString())).replace("%l", t.toString())).replace("%m", c.toString().padStart(2, "0"))).replace("%-m", c.toString())).replace("%M", m.toString().padStart(2, "0"))).replace("%-M", m.toString())).replace("%p", a[p])).replace("%P", a[p].toLowerCase())).replace("%S", f.toString().padStart(2, "0"))).replace("%-S", f.toString())).replace("%w", l.toString())).replace("%y", u.toString().padStart(2, "0").substr(-2))).replace("%-y", u.toString().padStart(2, "0").substr(-2).replace(/^0+/, ""))).replace("%Y", u.toString())).replace(/%z/i, e)
                }
            }

            update(t, e, i = {strict: !1}) {
                if (i.strict && !w()(this.translations, t)) throw new Error(`The path "${t}" is not currently defined`);
                var n = r()(this.translations, t), o = l(n), s = l(e);
                if (i.strict && o !== s) throw new Error(`The current type for "${t}" is "${o}", but you're trying to override it with "${s}"`);
                i = "object" === s ? Object.assign(Object.assign({}, n), e) : e, P()(this.translations, t, i), this.hasChanged()
            }

            toSentence(t, e = {}) {
                var {
                    wordsConnector: i,
                    twoWordsConnector: n,
                    lastWordConnector: o
                } = Object.assign(Object.assign({
                    wordsConnector: ", ",
                    twoWordsConnector: " and ",
                    lastWordConnector: ", and "
                }, v(y(this, "support.array"))), e), s = t.length;
                switch (s) {
                    case 0:
                        return "";
                    case 1:
                        return "" + t[0];
                    case 2:
                        return t.join(n);
                    default:
                        return [t.slice(0, s - 1).join(i), o, t[s - 1]].join("")
                }
            }

            timeAgoInWords(o, s, r = {}) {
                {
                    var [a, o, s, r = {}] = [this, o, s, r];
                    const p = r.scope || "datetime.distance_in_words", f = (t, e = 0) => a.t(t, {count: e, scope: p});
                    o = b(o), s = b(s);
                    let t = o.getTime() / 1e3, e = s.getTime() / 1e3;
                    t > e && ([o, s, t, e] = [s, o, e, t]);
                    var l = Math.round(e - t), h = Math.round((e - t) / 60), u = h / 60 / 24, c = Math.round(h / 60),
                        u = Math.round(u), d = Math.round(u / 30);
                    if (L(0, 1, h)) return r.includeSeconds ? L(0, 4, l) ? f("less_than_x_seconds", 5) : L(5, 9, l) ? f("less_than_x_seconds", 10) : L(10, 19, l) ? f("less_than_x_seconds", 20) : L(20, 39, l) ? f("half_a_minute") : L(40, 59, l) ? f("less_than_x_minutes", 1) : f("x_minutes", 1) : 0 === h ? f("less_than_x_minutes", 1) : f("x_minutes", h);
                    if (L(2, 44, h)) return f("x_minutes", h);
                    if (L(45, 89, h)) return f("about_x_hours", 1);
                    if (L(90, 1439, h)) return f("about_x_hours", c);
                    if (L(1440, 2519, h)) return f("x_days", 1);
                    if (L(2520, 43199, h)) return f("x_days", u);
                    if (L(43200, 86399, h)) return f("about_x_months", Math.round(h / 43200));
                    if (L(86400, 525599, h)) return f("x_months", d);
                    let i = o.getFullYear(), n = (3 <= o.getMonth() + 1 && (i += 1), s.getFullYear());
                    return s.getMonth() + 1 < 3 && --n, r = h - 1440 * (i > n ? 0 : N()(i, n).filter(t => 1 == new Date(t, 1, 29).getMonth()).length), l = Math.trunc(r / 525600), (c = parseFloat((r / 525600 - l).toPrecision(3))) < .25 ? f("about_x_years", l) : c < .75 ? f("over_x_years", l) : f("almost_x_years", l + 1)
                }
            }

            onChange(t) {
                return this.onChangeHandlers.push(t), () => {
                    this.onChangeHandlers.splice(this.onChangeHandlers.indexOf(t), 1)
                }
            }

            get version() {
                return this._version
            }

            formatNumber(t, e) {
                return o(t, e)
            }

            get(t) {
                return y(this, t)
            }

            runCallbacks() {
                this.onChangeHandlers.forEach(t => t(this))
            }

            hasChanged() {
                this._version += 1, this.runCallbacks()
            }
        }
    })(), I18n = ot
})(), function () {
    "use strict";
    i18n = new I18n.I18n, void 0 === BPWidget ? (BPWidget = function () {
        function u(t, e) {
            for (var i of t) if (e(i)) return i;
            return null
        }

        function t(t, e) {
            var i, n = [];
            for (i of t) n.push(e(i));
            return n
        }

        function n(t, e) {
            return t.classList ? t.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t.className)
        }

        function o(t, e) {
            t && (t.classList ? t.classList.add(e) : t.className += " " + e)
        }

        function s(t, e) {
            t && (t.classList ? t.classList.remove(e) : t.className = t.className.replace(new RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)", "gi"), " "))
        }

        function r(e, t) {
            t = document.getElementsByClassName(t);
            Array.from(t).forEach(t => {
                s(t, e)
            })
        }

        function a(n, o, s) {
            let r;
            return function () {
                const t = this, e = arguments;
                var i = s && !r;
                clearTimeout(r), r = setTimeout(function () {
                    r = null, s || n.apply(t, e)
                }, o), i && n.apply(t, e)
            }
        }

        var l, h, e;
        (e = l = l || {})[e.DELIVERY = "DELIVERY"] = "DELIVERY", e[e.POSTING = "POSTING"] = "POSTING";

        class i {
            constructor(t = !1) {
                let e;
                t ? (e = "https://pos.sandbox-bliskapaczka.pl", this.apiContextUrl = "https://api.sandbox-bliskapaczka.pl") : (e = "https://pos.bliskapaczka.pl", this.apiContextUrl = "https://api.bliskapaczka.pl"), this.posEndpointUrl = e + "/api/v1/pos", this.configurationUrl = this.apiContextUrl + "/v2/config/pointsmap/", this.openStreetMapApiUrl = "https://osm-search-eu.apaczka.pl/search"
            }

            loadConfiguration(t, e, i) {
                t = this.configurationUrl + t;
                this.xhrRequest(t, "GET", !1, e, i)
            }

            loadScript(t) {
                var e = document.createElement("script");
                e.type = "application/javascript", e.src = t, document.body.appendChild(e)
            }

            getPos(t, e, i) {
                t = this.posEndpointUrl + "/" + t;
                this.xhrRequest(t, "GET", !0, e, i)
            }

            getPosSync(t) {
                let i = this.posEndpointUrl + "/" + t;
                return new Promise((t, e) => {
                    this.xhrRequest(i, "GET", !0, t, e)
                })
            }

            getBrands(t, e) {
                var i = this.posEndpointUrl + "/brands";
                this.xhrRequest(i, "GET", !0, t, e)
            }

            getBrandsSync() {
                let i = this.posEndpointUrl + "/brands";
                return new Promise((t, e) => {
                    this.xhrRequest(i, "GET", !0, t, e)
                })
            }

            getLastPosListParams() {
                return this.lastPosListParams
            }

            listPos(t, e, i, n, o) {
                var s = this.posEndpointUrl + "/filter", r = new URLSearchParams;
                r.append("fields", "operator,code,latitude,longitude,brand,cod,brandPretty,operatorPretty,available,street,city,postalCode"), t.brandMode ? (t.operators && r.append("operators", t.operators.map(t => t.operator).join(",")), r.append("brands", e.join(" "))) : r.append("operators", e.join(",")), (t.codOnly || i) && r.append("cod", "true"), t.countryCodes && r.append("countryCodes", t.countryCodes), t.mapState.coordinates && t.mapState.radius && (r.append("lat", "" + t.mapState.coordinates.lat), r.append("lon", "" + t.mapState.coordinates.lng), r.append("distance", "" + t.mapState.radius), r.append("distanceUnit", "KM"), this.lastPosListParams = {
                    coordinates: {
                        lat: t.mapState.coordinates.lat,
                        lng: t.mapState.coordinates.lng
                    }, radius: t.mapState.radius, zoom: t.mapState.zoom, brandMode: t.brandMode
                }), t.posType && r.append("posType", l[t.posType].toLowerCase()), s += "?" + r.toString(), this.xhrRequest(s, "GET", !0, t => {
                    n(t)
                }, t => {
                    this.lastPosListParams = null, o(t)
                })
            }

            autocompletePosFilter(t, e, i, n) {
                var o = this.posEndpointUrl + "/filter", s = new URLSearchParams;
                s.append("searchText", t), s.append("size", "10"), e.countryCodes && s.append("countryCodes", e.countryCodes), s.append("fields", "code,city,street,brand,operator"), e.brandMode ? (e.operators && s.append("operators", e.operators.map(t => t.operator).join(",")), s.append("brand", i.join(" "))) : s.append("operators", i.join(",")), e.posType && s.append("posType", l[e.posType].toLowerCase()), o += "?" + s.toString(), this.xhrRequest(o, "GET", !0, t => {
                    n(t)
                }, () => {
                })
            }

            countPointSelection(t, e) {
                t = this.apiContextUrl + "/point/select/" + t + "/" + e;
                this.xhrRequest(t, "POST", !0, () => {
                }, t => console.error(t))
            }

            findLocalizationsByText(t, e, i) {
                e = this.openStreetMapApiUrl + `/point/select/?format=json&addressdetails=1&countrycodes=${e}&limit=4&q=` + t;
                this.xhrRequest(e, "GET", !0, i, t => console.error(t))
            }

            xhrRequest(t, e, i, n, o) {
                let s = new XMLHttpRequest;
                s.open(e, t, i), s.onload = () => {
                    var t;
                    s.readyState == XMLHttpRequest.DONE && (200 == s.status ? (t = s.responseText ? JSON.parse(s.responseText) : null, n(t)) : o && o(s.responseText))
                }, s.onerror = () => {
                    o(s.responseText)
                }, s.send()
            }
        }

        class c {
            static asset(t) {
                return "https://widget.bliskapaczka.pl/v8.2/" + t
            }

            static posImage(t) {
                return "https://pos.bliskapaczka.pl/assets/images/" + t
            }

            static submitButton(t) {
                return `
                        <button type="button" class="bp-map-submit-button">
                            ${t ? i18n.t("partials.select") : i18n.t("partials.select_point")}
                        </button>
                    `
            }

            static submitButtonOrText(t, e) {
                return e ? this.submitButton(t) : `<span>${i18n.t("partials.temporary_unavailable")}</span>`
            }

            static correctMapZoom(t) {
                return t < this.MIN_MAP_ZOOM ? this.MIN_MAP_ZOOM + 2 : this.DEFAULT_GLOBAL_ZOOM
            }

            static addressDescription(t) {
                var e = t.postalCode || "";
                return `
                        <address>${i18n.t("partials.st")} ${t.street}<br/>${e} ${t.city}</address>
                    `
            }

            static footer(t, e, i) {
                return `<div class="bp-footer-content">
                                <a href="${t ? i || "https://apaczka.pl" : "https://bliskapaczka.pl"}" target="_blank">
                                    <img class="${t ? "custom-footer-logo" : "bp-footer-logo"}" src="${t ? e || this.asset("images/apaczka_logo.svg") : this.asset("images/alsendo_logo.svg")}">
                                </a>
                                ${t ? `<div class="powered-by">
                                                    <div class="powered-by-label">
                                                        <span>powered by Alsendo</span>
                                                    </div>
                                                </div>` : ""}
                            </div>`
            }

            static parcelPrice(t) {
                return t && (t.price || 0 == t.price) ? t.price.toFixed(2).replace(".", ",") + " zł" : ""
            }

            static posType(t) {
                return t.deliveryPoint && !t.postingPoint ? `<span class="bp-text-bold">${i18n.t("partials.attention")}</span> ` + i18n.t("partials.delivery_point") : t.postingPoint && !t.deliveryPoint ? `<span class="bp-text-bold">${i18n.t("partials.attention")}!</span> ` + i18n.t("partials.posting_point") : ""
            }

            static posTags(t) {
                let e = "";
                return t.deliveryPoint && (e += `<p class="bp-tag">${i18n.t("partials.delivery_point")}</p>`), t.postingPoint && (e += `<p class="bp-tag">${i18n.t("partials.posting_point")}</p>`), t.cod && (e += `<p class="bp-tag">${i18n.t("partials.cod")}</p>`), "INPOST" !== t.operator && "RUCH" !== t.operator || !t.pointTypes || this.pointTypeTag(t.pointTypes, t.operator).forEach(t => e += `<p class="bp-tag">${t}</p>`), e
            }

            static pointTypeTag(t, e) {
                var i = [];
                return "RUCH" === e && (t.includes("PSD") && i.push("Salonik RUCH"), t.includes("APM") && i.push("Automat paczkowy Orlen Paczka"), t.includes("PKN")) && i.push("Stacja paliw Orlen"), "INPOST" === e && (t.some(t => ["POP", "POK", "PARCEL_LOCKER_SUPERPOP"].includes(t)) && i.push("Punkt obsługi przesyłki PaczkoPunkt"), 1 == t.length) && "PARCEL_LOCKER" === t[0] && i.push("Paczkomat 24/7"), i
            }

            static getPointLogo(t) {
                return BPWidget.options.brandMode ? this.brandLogo(t.brand) : this.operatorLogo(t.operator)
            }

            static getPointName(t) {
                return BPWidget.options.brandMode ? t.brandPretty : this.getOperatorName(t.operatorPretty)
            }

            static getOperatorName(t) {
                return "RUCH" == t ? "Orlen Paczka" : t
            }

            static operatorLogo(t) {
                return `<img src="${this.posImage((t = "RUCH" == t ? "ORLEN" : t) + ".png")}" alt="${t}"/>`
            }

            static brandLogo(t) {
                return `<img src="${this.posImage(`brand/${t = "DELIKATESY CENTRUM" == t ? "DELIKATESY_CENTRUM" : t}.png`)}" alt="${t}" />`
            }

            static openingHoursDescription(t) {
                var e = i18n.t("partials.opening_hours"), i = t.openingHoursMap;
                return `
                        <div class="bp-point-desc-opening-hours-text">${e} </div>
                        <div>
                            ${i && Object.keys(i).length ? function (t) {
                    const s = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
                        e = [i18n.t("partials.mon"), i18n.t("partials.tue"), i18n.t("partials.wed"), i18n.t("partials.thu"), i18n.t("partials.fri"), i18n.t("partials.sat"), i18n.t("partials.sun")];
                    let r = function (t) {
                        var e = {};
                        for (var i of s) {
                            var n = t[i];
                            e[i] = n ? n.from + " - " + n.to : i18n.t("partials.closed")
                        }
                        return e
                    }(t), i = "";
                    for (let t = 0; t < s.length; t++) {
                        var n = s[t], n = r[n], o = function (e, i) {
                            let n = e;
                            for (let t = e; t < s.length; t++) {
                                var o = s[t], o = r[o];
                                if (i != o) break;
                                n = t
                            }
                            return n
                        }(t, n), a = e[t], l = e[o], l = t != o ? a + "-" + l : a;
                        i += `<div>${l}: ${n}</div>`, t = o
                    }
                    return i = i.replace("00:00 - 23:59", "24h")
                }(i) : function (t) {
                    {
                        if ("ZABKA" == t.brand) return "Dostęp zgodnie z godzinami otwarcia sklepu";
                        if ("INPOST" == t.brand) return "24/7"
                    }
                    return i18n.t("partials.no_data")
                }(t)}
                        </div>
                    `
            }
        }

        c.DEFAULT_GLOBAL_ZOOM = 15, c.DEFAULT_POINT_ZOOM = 18, c.MIN_MAP_ZOOM = 10, (e = h = h || {})[e.OPERATOR = "OPERATOR"] = "OPERATOR", e[e.BRAND = "BRAND"] = "BRAND", e[e.COD = "COD"] = "COD";

        class d {
            constructor() {
                this.changeFiltersPositionState = !1
            }

            initWithBrands(t, e, i, n) {
                this.filters = this.createBrandFilters(t, e), this.init(e, i, n)
            }

            initWithOperators(t, e, i, n) {
                this.filters = this.createOperatorFilters(t, e), this.init(e, i, n)
            }

            init(t, e, i) {
                this.filtersElement.innerHTML = this.display(), this.collapseFilters(), this.forEachFilterElement(t => {
                    t && (t.checked = !0)
                });
                var n = this.findCodFilterElement();
                n && (n.checked = t.filterValue), e && (this.filtersButtonElement.style.display = "none"), i && (this.tryCreateExpandFiltersButton(), this.changeFiltersPositionState = i && !!document.querySelector(".bp-media-lg")), this.filtersButtonElement.addEventListener("click", () => {
                    this.isCollapsed() ? this.expandFilters() : this.collapseFilters()
                }), this.filtersContent.addEventListener("scroll", () => {
                    this.processFiltersInsetShadow()
                }), window.addEventListener("resize", () => {
                    this.filtersContent && this.processFiltersInsetShadow()
                }), this.closeButton.addEventListener("click", () => {
                    this.collapseFilters()
                }), this.processFiltersInsetShadow()
            }

            processFiltersInsetShadow() {
                var t = this.filtersContent.offsetWidth, e = this.filtersContent.scrollWidth,
                    i = this.filtersContent.scrollLeft;
                (t < e ? 0 == i ? (s(this.filtersContent, "left-scroll"), o) : i + t == e ? (o(this.filtersContent, "left-scroll"), s) : (o(this.filtersContent, "left-scroll"), o) : (s(this.filtersContent, "left-scroll"), s))(this.filtersContent, "right-scroll")
            }

            getValues() {
                let i = [];
                return this.forEachFilter(t => {
                    var e = this.findFilterElement(t);
                    e && e.checked && (t.operator ? i.push(t.operator) : t.brand && i.push(t.brand))
                }), i
            }

            getCod() {
                let i = !1;
                return this.forEachFilter(t => {
                    var e = this.findFilterElement(t);
                    e ? e.checked && t.type == h.COD && (i = !0) : i = Boolean(t.value)
                }), i
            }

            onChange(e) {
                this.forEachFilterElement(t => {
                    t && t.addEventListener("change", e)
                })
            }

            createBrandFilters(t, e) {
                return [...this.createBrandsFilters(t), this.createCODFilter(e)]
            }

            createOperatorFilters(t, e) {
                return [...this.createOperatorsFilters(t), this.createCODFilter(e)]
            }

            createBrandsFilters(t) {
                var e, i = [];
                for (e of t) {
                    var n = {
                        type: h.BRAND,
                        brand: e.brand,
                        value: e.price,
                        elementId: "BPFilter" + e.brand,
                        checked: e.checked
                    };
                    i.push(n)
                }
                return i
            }

            createOperatorsFilters(t) {
                var e, i = [];
                for (e of t) {
                    var n = {
                        type: h.OPERATOR,
                        operator: e.operator,
                        value: e.price,
                        elementId: "BPFilter" + e.operator,
                        checked: e.checked
                    };
                    i.push(n)
                }
                return i
            }

            createCODFilter(t) {
                return {
                    value: t.filterValue,
                    show: null == t.showFilter || t.showFilter,
                    type: h.COD,
                    elementId: "BPFilterCOD"
                }
            }

            tryCreateExpandFiltersButton() {
                var t = this.filtersElement.querySelector("#BPWidgetFiltersButtons");
                if (t) {
                    const e = document.createElement("button");
                    e.id = "BPWidgetExpandFiltersButton", e.textContent = i18n.t("filters.operators_expand"), e.addEventListener("click", () => this.toggleFiltersExpansion(e)), t.append(e)
                }
            }

            findFilterElement(t) {
                t = t.elementId;
                return document.getElementById(t)
            }

            forEachFilter(t) {
                for (var e of this.filters) t(e)
            }

            findCodFilterElement() {
                return document.getElementById("BPFilterCOD")
            }

            forEachFilterElement(e) {
                this.forEachFilter(t => e(this.findFilterElement(t)))
            }

            expandFilters() {
                var t;
                this.changeFiltersPositionState ? r("active", "bp-pos-info") : r("active", "switchable"), o(this.filtersButtonElement, "active"), o(this.filtersElement, "active"), this.filtersButtonElement && (t = i18n.t("filters.collapse_text"), this.filtersButtonElement.title = t), this.processFiltersInsetShadow()
            }

            collapseFilters() {
                var t;
                this.isCollapsed() || (s(this.filtersButtonElement, "active"), s(this.filtersElement, "active")), this.filtersButtonElement && (t = i18n.t("filters.expand_text"), this.filtersButtonElement.title = t), this.processFiltersInsetShadow()
            }

            isCollapsed() {
                return -1 === this.filtersElement.className.indexOf("active")
            }

            toggleFiltersExpansion(t) {
                var e = this.filtersElement.classList.toggle("expanded");
                t.textContent = e ? i18n.t("filters.operators_collapse") : i18n.t("filters.operators_expand")
            }

            get filtersElement() {
                return document.getElementById("BPWidgetFilters")
            }

            get filtersButtonElement() {
                return document.getElementById("BPWidgetFiltersButton")
            }

            get filtersContent() {
                return document.getElementById("BPWidgetFiltersContent")
            }

            get closeButton() {
                return document.getElementById("closeFilters")
            }

            display() {
                var t = c.asset("images/icons/icon_close.svg"), e = this.createFiltersDisplay();
                return `
                  <div class="bp-filters-content" id="BPWidgetFiltersContent">
                    <div class="filter-header">
                      <div class="title">${i18n.t("filters.label")}</div>
                      <div id="closeFilters"><img src="${t}"></div>
                    </div>
                    <div class="bp-filters-wrapper">
                      <div id="BPWidgetFiltersButtons">
                        ${e.cod}
                      </div>
                      <ul class="checkbox-filter">${e.operators}</ul>
                    </div>
                  </div>
                `
            }

            createFiltersDisplay() {
                var e, i = [];
                let n = "";
                for (e of this.filters) {
                    let t = "";
                    var o, s = e.elementId, r = "bp-filter";
                    e.operator || e.brand ? (r += e.operator ? " operator" : " brand", o = e.operator ? c.operatorLogo(e.operator) : c.brandLogo(e.brand || ""), t = `
                            <li>
                                <label class="${r}">
                                    <input id="${s}" type="checkbox" name="${e.operator || e.brand}" />
                                    <span class="widget-checkbox" tabindex="0">
                                        <div class="filter-checkbox-content">
                                            ${o}
                                        </div>
                                    </span>
                                </label>
                            </li>
                        `) : e.show && (r = e.show && e.value ? " disabled " : "", o = i18n.t("filters.cod_only"), n = `
                            <label class="cod-only">
                                <input type="checkbox" id="${s}" name="codFilter" ${r} />
                                <span class="switch" tabindex="0"></span> 
                                <span class="checkbox-desc ${r}">${o}</span>
                            </label>
                        `), "" != t && i.push(t)
                }
                return {operators: i.join(""), cod: n}
            }
        }

        class p {
            constructor() {
                this.MARKER_ICON_OPTIONS = {
                    iconSize: [33, 48],
                    iconAnchor: [15, 40]
                }, this.POS_AVAILABLE_HANDLING_OPERATORS = ["FEDEX"], BPWidget.options.alias ? (this.DEFAULT_MARKER_ICON_PATH = "images/markers/marker_a.png", this.DEFAULT_MARKER_ICON_PATH_ACTIVE = "images/markers/marker_a_active.png", this.DEFAULT_MARKER_ICON_PATH_DISABLED = "images/markers/marker_a_disabled.png") : (this.DEFAULT_MARKER_ICON_PATH = "images/markers/marker.png", this.DEFAULT_MARKER_ICON_PATH_ACTIVE = "images/markers/marker_active.png", this.DEFAULT_MARKER_ICON_PATH_DISABLED = "images/markers/marker_disabled.png"), this.operatorMarkers = !!BPWidget.options.operatorMarkers
            }

            init(t, e, i, n, o) {
                this.map = t, this.operators = e, this.selectPointCallback = i, this.submitPointCallback = n, this.unselectPointCallback = o, null != this.markersCluster && t.removeLayer(this.markersCluster), t.on("click", () => {
                    this.selectPointCallback(void 0)
                }), this.posListElement.innerHTML = p.displayPointDescription(), this.markersCluster = L.markerClusterGroup({
                    disableClusteringAtZoom: 20,
                    spiderfyOnMaxZoom: !0
                }), t.addLayer(this.markersCluster), this.markers = [], this.markersMapByCode = new Map
            }

            clearMarkers() {
                this.markers = [], this.markersCluster.clearLayers()
            }

            updateMarkers(t) {
                for (var e of t) {
                    var i;
                    e.latitude && e.longitude && (i = e.operator + "/" + e.code, e = this.createMarker(e), this.markersMapByCode.set(i, e), this.markers.push(e))
                }
            }

            findMarkerByRecordId(t) {
                t = this.markersMapByCode.get(t);
                return t || null
            }

            selectMarker(t, e, i) {
                t && e && (i && (i = t.getLatLng(), this.map.setView(i, this.map.getZoom())), this.isPosAvailable(e) && (this.currentMarker && this.currentMarker.setIcon(new L.Icon(this.setMarkerIconOptions(this.getMarkerIcon(this.currentMarker.pos.operator)))), this.currentMarker = t, this.currentMarker.setIcon(new L.Icon(this.setMarkerIconOptions(this.getMarkerIconActive(e.operator))))), this.updateMarkerDescription(e))
            }

            unselectMarker() {
                var t;
                this.currentMarker && (null != (t = this.findMarkerByRecordId(this.currentMarker.pos.operator + "/" + this.currentMarker.pos.code)) && t.setIcon(new L.Icon(this.setMarkerIconOptions(this.getMarkerIcon(this.currentMarker.pos.operator)))), this.currentMarker.setIcon(new L.Icon(this.setMarkerIconOptions(this.getMarkerIcon(this.currentMarker.pos.operator))))), this.currentMarker = null, this.unselectPointCallback(), this.updateMarkerDescription(null)
            }

            errorMarker(t, e) {
                console.error(e), this.currentMarker && this.currentMarker.setIcon(new L.Icon(this.setMarkerIconOptions(this.getMarkerIcon(this.currentMarker.pos.operator)))), this.currentMarker = t, this.currentMarker.setIcon(new L.Icon(this.setMarkerIconOptions(this.getMarkerIconActive(this.currentMarker.pos.operator)))), this.updateErrorDescription(t.pos.operatorPretty, t.pos.code, t.pos.brandPretty)
            }

            filterMarkers(t, e, i) {
                var n, o, s = [];
                this.markersCluster.clearLayers();
                let r = 0;
                for (o of this.markers) for (const a of t) o.pos[i] != a || e && 1 != o.pos.cod || (o.pos.posId === (null == (n = this.currentMarker) ? void 0 : n.pos.posId) && o.setIcon(new L.Icon(this.setMarkerIconOptions(this.getMarkerIconActive(o.pos.operator)))), s.push(o), r++);
                return this.markersCluster.addLayers(s), this.selectPointCallback(this.currentMarker || void 0), t.length && 0 == s.length ? -1 : r
            }

            setMarkerIconOptions(t) {
                var e = this.MARKER_ICON_OPTIONS;
                return e.iconUrl = c.asset(t), e
            }

            createMarker(e) {
                let i = L.marker([e.latitude, e.longitude]);
                i.bindPopup(p.createMarkerShortDescription(e), {offset: [0, -30], closeButton: !1});
                var t = this.setMarkerIconOptions(this.isPosAvailable(e) ? this.getMarkerIcon(e.operator) : this.getMarkerIconDisabled(e.operator));
                return i.setIcon(new L.Icon(t)), i.pos = {
                    posId: e.operator + "/" + e.code,
                    operator: e.operator,
                    operatorPretty: e.operatorPretty,
                    brandPretty: e.brandPretty,
                    brand: e.brand,
                    code: e.code,
                    cod: e.cod
                }, i.on("click", t => {
                    var e;
                    t.target.pos.posId != (null == (e = this.currentMarker) ? void 0 : e.pos.posId) && (r("active", "switchable"), r("opened-side-panel", "bp-filters-content"), this.selectPointCallback(t.target))
                }), "ontouchstart" in document.documentElement || (i.on("mouseover", () => {
                    var t;
                    this.isPosAvailable(e) && ((t = this.MARKER_ICON_OPTIONS).iconUrl = c.asset(this.getMarkerIconActive(e.operator)), i.setIcon(new L.Icon(t))), i.openPopup(), setTimeout(() => {
                        o(document.getElementsByClassName("si-wrapper-right")[0], "active")
                    }, 50)
                }), i.on("mouseout", () => {
                    var t;
                    i != this.currentMarker && this.isPosAvailable(e) && ((t = this.MARKER_ICON_OPTIONS).iconUrl = c.asset(this.getMarkerIcon(e.operator)), i.setIcon(new L.Icon(t))), i.closePopup()
                })), i
            }

            static createMarkerShortDescription(t) {
                return `
                            <div class="bp-marker-desc">
                                <div class="bp-brand-logo-wrapper">
                                    <div class="bp-brand-logo">${c.getPointLogo(t)}</div>
                                </div>
                                <div class="bp-marker-desc-operator-block-wrapper">
                                    <div class="bp-marker-desc-operator-block">
                                            <div class="bp-marker-desc-brand">${c.getPointName(t)}</div>
                                    </div>
                                </div>
                            </div>
                    `
            }

            static createErrorDescription(t, e, i) {
                var n = c.asset("images/icons/icon_close.svg"), o = c.submitButton(!1);
                return `
                            <div class="bp-point-desc">
                                <div class="bp-point-desc-header">
                                    <div class="bp-point-desc-header-top">
                                        <div class="bp-point-desc-header-top-button">
                                        </div>
                                    </div>
                                    <div class="bp-point-desc-point-block">
                                        <div class="bp-point-desc-point-block-brand">
                                            ${i}
                                        </div>
                                        <div class="bp-point-desc-point-block-code">
                                            ${e}
                                        </div>
                                    </div>
                                    <div class="bp-point-desc-point-block-close">
                                            <img src="${n}">
                                    </div>
                                </div>
                                <div class="bp-point-desc-description-row">
                                    <div class="bp-point-desc-description-row-content">
                                        <span>${i18n.t("markers.not_available")}</span>
                                    </div>
                                </div>
                                <div class="bp-point-desc-submit-row">
                                    <div class="bp-point-desc-submit-row-submit-button centered">
                                        ${o}
                                    </div>
                                </div>
                                <div class="bp-point-desc-operator-row">
                                    ${i18n.t("markers.operator")} ${c.getOperatorName(t)}
                                </div>
                            </div>
                    `
            }

            createMarkerDescription(e) {
                var t = c.getPointLogo(e), i = c.getPointName(e), n = e.operatorPretty,
                    o = e.description ? `<div class="bp-point-desc-description-row-content">${e.description}</div>` : "",
                    s = c.posTags(e), r = c.addressDescription(e),
                    a = c.parcelPrice(u(this.operators, t => t.operator == e.operator)),
                    l = c.openingHoursDescription(e), h = "" != a, h = c.submitButtonOrText(h, this.isPosAvailable(e));
                return `
                            <div class="bp-point-desc">
                                <div class="bp-point-desc-header">
                                    <div class="bp-point-desc-header-top">
                                        <div class="bp-point-desc-header-top-button">
                                        </div>
                                    </div>
                                    <div class="bp-point-desc-point-block">
                                        <div class="bp-point-desc-point-block-brand">
                                            ${i}
                                        </div>
                                    </div>
                                    <div class="bp-point-desc-point-block-close">
                                            <img src="${c.asset("images/icons/icon_close.svg")}">
                                    </div>
                                </div>
                                <div class="bp-point-desc-address-row">
                                    <div class="bp-point-desc-address-row-left">
                                        <div class="bp-point-desc-address-row-code">
                                            ${e.code}
                                        </div>
                                        <div class="bp-point-desc-address-row-address">
                                            ${r}
                                        </div>
                                    </div>
                                    <div class="bp-point-desc-address-row-brand">
                                        ${t}
                                    </div>
                                </div>
                                <div class="bp-point-desc-submit-row">
                                    <div class="bp-point-desc-submit-row-submit-button">
                                        ${h}
                                    </div>
                                    <div class="bp-point-desc-submit-row-price">
                                        ${a}
                                    </div>
                                </div>
                                <div class="bp-point-desc-description-row">
                                    ${o}
                                </div>
                                <div class="bp-point-desc-opening-hours-row">
                                    ${l}
                                </div>
                                <div class="bp-point-desc-tags-row">
                                    ${s}
                                </div>
                                <div class="bp-point-desc-operator-row">
                                    ${i18n.t("markers.operator")} ${c.getOperatorName(n)}
                                </div>
                            </div>
                    `
            }

            showMarkerDescription() {
                o(this.posListElement, "active")
            }

            hideMarkerDescription() {
                s(this.posListElement, "active")
            }

            static displayPointDescription() {
                return `
                        <div id="BPWidgetPOSInfoContent" class="bp-pos-info-content"></div>
                    `
            }

            updateMarkerDescription(t) {
                var e;
                t ? (e = this.createMarkerDescription(t), this.updateMarkerDescriptionWithTemplate(e, t)) : (this.hideMarkerDescription(), this.cleanup())
            }

            updateErrorDescription(t, e, i) {
                t = p.createErrorDescription(t, e, i);
                this.updateMarkerDescriptionWithTemplate(t, null), p.submitButton().disabled = !0
            }

            updateMarkerDescriptionWithTemplate(t, e) {
                this.showMarkerDescription();
                var i = document.createElement("DIV");
                i.className = "bp-pos-info-element", i.id = "BPWidgetPOSInfoElement", i.innerHTML = t, e && this.isPosAvailable(e) && ((t = i.getElementsByClassName("bp-map-submit-button")[0]).setAttribute("data-test", "pos-submit-button"), t.addEventListener("click", t => {
                    t.stopPropagation(), t.cancelBubble = !0, this.submitPointCallback(e)
                })), i.getElementsByClassName("bp-point-desc-point-block-close")[0].addEventListener("click", t => {
                    t.stopPropagation(), t.cancelBubble = !0, this.unselectMarker(), s(this.posListElement, "open")
                }), i.getElementsByClassName("bp-point-desc-header")[0].addEventListener("click", t => {
                    t.stopPropagation(), t.cancelBubble = !0, (n(this.posListElement, "open") ? s : o)(this.posListElement, "open")
                }), this.hammerTime = new Hammer(i.getElementsByClassName("bp-point-desc-header")[0]), this.hammerTime.get("swipe").set({direction: Hammer.DIRECTION_VERTICAL}), this.hammerTime.on("swipeup", () => {
                    n(this.posListElement, "open") || o(this.posListElement, "open")
                }), this.hammerTime.on("swipedown", () => {
                    n(this.posListElement, "open") && s(this.posListElement, "open")
                }), this.findPosElement() ? this.posListContentElement.replaceChild(i, this.findPosElement()) : this.posListContentElement.appendChild(i)
            }

            cleanup() {
                this.findPosElement() && setTimeout(() => {
                    this.findPosElement().outerHTML = ""
                }, 200)
            }

            get posListElement() {
                return document.getElementById("BPWidgetPOSInfo")
            }

            get posListContentElement() {
                return document.getElementById("BPWidgetPOSInfoContent")
            }

            findPosElement() {
                return document.getElementById("BPWidgetPOSInfoElement")
            }

            static submitButton() {
                return document.getElementsByClassName("bp-map-submit-button").item(0)
            }

            isPosAvailable(t) {
                return t.available || !this.posAvailableHandling(t)
            }

            posAvailableHandling(e) {
                return this.POS_AVAILABLE_HANDLING_OPERATORS.some(t => t === e.operator)
            }

            getMarkerIcon(t) {
                return this.operatorMarkers ? `images/markers/marker_${t}.png` : this.DEFAULT_MARKER_ICON_PATH
            }

            getMarkerIconActive(t) {
                return this.operatorMarkers ? `images/markers/marker_active_${t}.png` : this.DEFAULT_MARKER_ICON_PATH_ACTIVE
            }

            getMarkerIconDisabled(t) {
                return this.operatorMarkers ? `images/markers/marker_disabled_${t}.png` : this.DEFAULT_MARKER_ICON_PATH_DISABLED
            }
        }

        class f {
            constructor() {
                this.findMe = () => {
                    this.map.locate({setView: !0})
                }
            }

            init(t) {
                this.map = t, this.getSearchElement().innerHTML = this.display(), this.initButtons()
            }

            initButtons() {
                navigator.geolocation && this.secureLocation() ? document.getElementById("BPFindMe").addEventListener("click", this.findMe) : document.getElementById("BPFindMe").style.display = "none"
            }

            getSearchElement() {
                return document.getElementById("BPWidgetSearch")
            }

            display() {
                var t = i18n.t("menubar.find_me"), e = i18n.t("menubar.filters");
                return `
                        <div class="bp-search-wrapper">
                            <div class="bp-search-buttons">
                                <div class="bp-search-buttons-switchable-block">
                                    <div class="bp-search-panel-button switchable" id="BPWidgetListButton" data-test="list">
                                        <svg class="bp-search-panel-button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.25 5C6.25 4.83424 6.31585 4.67527 6.43306 4.55806C6.55027 4.44085 6.70924 4.375 6.875 4.375H16.875C17.0408 4.375 17.1997 4.44085 17.3169 4.55806C17.4342 4.67527 17.5 4.83424 17.5 5C17.5 5.16576 17.4342 5.32473 17.3169 5.44194C17.1997 5.55915 17.0408 5.625 16.875 5.625H6.875C6.70924 5.625 6.55027 5.55915 6.43306 5.44194C6.31585 5.32473 6.25 5.16576 6.25 5ZM16.875 9.375H6.875C6.70924 9.375 6.55027 9.44085 6.43306 9.55806C6.31585 9.67527 6.25 9.83424 6.25 10C6.25 10.1658 6.31585 10.3247 6.43306 10.4419C6.55027 10.5592 6.70924 10.625 6.875 10.625H16.875C17.0408 10.625 17.1997 10.5592 17.3169 10.4419C17.4342 10.3247 17.5 10.1658 17.5 10C17.5 9.83424 17.4342 9.67527 17.3169 9.55806C17.1997 9.44085 17.0408 9.375 16.875 9.375ZM16.875 14.375H6.875C6.70924 14.375 6.55027 14.4408 6.43306 14.5581C6.31585 14.6753 6.25 14.8342 6.25 15C6.25 15.1658 6.31585 15.3247 6.43306 15.4419C6.55027 15.5592 6.70924 15.625 6.875 15.625H16.875C17.0408 15.625 17.1997 15.5592 17.3169 15.4419C17.4342 15.3247 17.5 15.1658 17.5 15C17.5 14.8342 17.4342 14.6753 17.3169 14.5581C17.1997 14.4408 17.0408 14.375 16.875 14.375ZM3.4375 4.0625C3.25208 4.0625 3.07082 4.11748 2.91665 4.2205C2.76248 4.32351 2.64232 4.46993 2.57136 4.64123C2.50041 4.81254 2.48184 5.00104 2.51801 5.1829C2.55419 5.36475 2.64348 5.5318 2.77459 5.66291C2.9057 5.79402 3.07275 5.88331 3.2546 5.91949C3.43646 5.95566 3.62496 5.93709 3.79627 5.86614C3.96757 5.79518 4.11399 5.67502 4.217 5.52085C4.32002 5.36668 4.375 5.18542 4.375 5C4.375 4.75136 4.27623 4.5129 4.10041 4.33709C3.9246 4.16127 3.68614 4.0625 3.4375 4.0625ZM3.4375 9.0625C3.25208 9.0625 3.07082 9.11748 2.91665 9.2205C2.76248 9.32351 2.64232 9.46993 2.57136 9.64123C2.50041 9.81254 2.48184 10.001 2.51801 10.1829C2.55419 10.3648 2.64348 10.5318 2.77459 10.6629C2.9057 10.794 3.07275 10.8833 3.2546 10.9195C3.43646 10.9557 3.62496 10.9371 3.79627 10.8661C3.96757 10.7952 4.11399 10.675 4.217 10.5208C4.32002 10.3667 4.375 10.1854 4.375 10C4.375 9.75136 4.27623 9.5129 4.10041 9.33709C3.9246 9.16127 3.68614 9.0625 3.4375 9.0625ZM3.4375 14.0625C3.25208 14.0625 3.07082 14.1175 2.91665 14.2205C2.76248 14.3235 2.64232 14.4699 2.57136 14.6412C2.50041 14.8125 2.48184 15.001 2.51801 15.1829C2.55419 15.3648 2.64348 15.5318 2.77459 15.6629C2.9057 15.794 3.07275 15.8833 3.2546 15.9195C3.43646 15.9557 3.62496 15.9371 3.79627 15.8661C3.96757 15.7952 4.11399 15.675 4.217 15.5208C4.32002 15.3667 4.375 15.1854 4.375 15C4.375 14.7514 4.27623 14.5129 4.10041 14.3371C3.9246 14.1613 3.68614 14.0625 3.4375 14.0625Z"/>
                                        </svg>
                                        <div class="bp-search-button-label">
                                            ${i18n.t("menubar.point_list")}
                                        </div>
                                    </div>
                                    <div class="bp-search-panel-button switchable" id="BPWidgetFiltersButton" data-test="filters">
                                        <svg class="bp-search-panel-button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.625 10C15.625 10.1658 15.5592 10.3247 15.4419 10.4419C15.3247 10.5592 15.1658 10.625 15 10.625H5C4.83424 10.625 4.67527 10.5592 4.55806 10.4419C4.44085 10.3247 4.375 10.1658 4.375 10C4.375 9.83424 4.44085 9.67527 4.55806 9.55806C4.67527 9.44085 4.83424 9.375 5 9.375H15C15.1658 9.375 15.3247 9.44085 15.4419 9.55806C15.5592 9.67527 15.625 9.83424 15.625 10ZM18.125 5.625H1.875C1.70924 5.625 1.55027 5.69085 1.43306 5.80806C1.31585 5.92527 1.25 6.08424 1.25 6.25C1.25 6.41576 1.31585 6.57473 1.43306 6.69194C1.55027 6.80915 1.70924 6.875 1.875 6.875H18.125C18.2908 6.875 18.4497 6.80915 18.5669 6.69194C18.6842 6.57473 18.75 6.41576 18.75 6.25C18.75 6.08424 18.6842 5.92527 18.5669 5.80806C18.4497 5.69085 18.2908 5.625 18.125 5.625ZM11.875 13.125H8.125C7.95924 13.125 7.80027 13.1908 7.68306 13.3081C7.56585 13.4253 7.5 13.5842 7.5 13.75C7.5 13.9158 7.56585 14.0747 7.68306 14.1919C7.80027 14.3092 7.95924 14.375 8.125 14.375H11.875C12.0408 14.375 12.1997 14.3092 12.3169 14.1919C12.4342 14.0747 12.5 13.9158 12.5 13.75C12.5 13.5842 12.4342 13.4253 12.3169 13.3081C12.1997 13.1908 12.0408 13.125 11.875 13.125Z"/>
                                        </svg>
                                        <div class="bp-search-button-label">
                                            ${e}
                                        </div>
                                    </div>
                                </div>
                                <div class="bp-search-panel-button" id="BPFindMe" data-test="find-me">
                                    <svg class="bp-search-panel-button-icon" width="20" height="20" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                         <path d="M8.96289 4C8.46844 4 7.98509 4.14662 7.57397 4.42133C7.16284 4.69603 6.84241 5.08648 6.65319 5.54329C6.46397 6.00011 6.41446 6.50277 6.51093 6.98773C6.60739 7.47268 6.84549 7.91814 7.19512 8.26777C7.54475 8.6174 7.99021 8.8555 8.47516 8.95196C8.96012 9.04843 9.46278 8.99892 9.9196 8.8097C10.3764 8.62048 10.7669 8.30005 11.0416 7.88893C11.3163 7.4778 11.4629 6.99445 11.4629 6.5C11.4629 5.83696 11.1995 5.20107 10.7307 4.73223C10.2618 4.26339 9.62593 4 8.96289 4ZM8.96289 8C8.66622 8 8.37621 7.91203 8.12954 7.7472C7.88286 7.58238 7.6906 7.34811 7.57707 7.07403C7.46354 6.79994 7.43383 6.49834 7.49171 6.20736C7.54959 5.91639 7.69245 5.64912 7.90223 5.43934C8.11201 5.22956 8.37928 5.0867 8.67026 5.02882C8.96123 4.97094 9.26283 5.00065 9.53692 5.11418C9.81101 5.22771 10.0453 5.41997 10.2101 5.66664C10.3749 5.91332 10.4629 6.20333 10.4629 6.5C10.4629 6.89782 10.3049 7.27936 10.0236 7.56066C9.74225 7.84196 9.36072 8 8.96289 8ZM8.96289 1C7.50471 1.00165 6.10672 1.58165 5.07563 2.61274C4.04454 3.64383 3.46454 5.04182 3.46289 6.5C3.46289 8.4625 4.36977 10.5425 6.08789 12.5156C6.8599 13.4072 7.7288 14.2101 8.67852 14.9094C8.76259 14.9683 8.86274 14.9999 8.96539 14.9999C9.06804 14.9999 9.1682 14.9683 9.25227 14.9094C10.2002 14.2098 11.0674 13.4069 11.8379 12.5156C13.5535 10.5425 14.4629 8.4625 14.4629 6.5C14.4612 5.04182 13.8812 3.64383 12.8502 2.61274C11.8191 1.58165 10.4211 1.00165 8.96289 1ZM8.96289 13.875C7.92977 13.0625 4.46289 10.0781 4.46289 6.5C4.46289 5.30653 4.937 4.16193 5.78091 3.31802C6.62482 2.47411 7.76942 2 8.96289 2C10.1564 2 11.301 2.47411 12.1449 3.31802C12.9888 4.16193 13.4629 5.30653 13.4629 6.5C13.4629 10.0769 9.99602 13.0625 8.96289 13.875Z"/>
                                    </svg>
                                    <div class="bp-search-button-label">
                                        ${t}
                                    </div>
                                </div>
                            </div>
                            <div id="BPWidgetCodeAutocomplete" class="bp-search-box"></div>
                        </div>
                    `
            }

            secureLocation() {
                return "https:" === location.protocol || "localhost" === location.hostname || "127.0.0.1" === location.hostname
            }
        }

        var m = this && this.__awaiter || function (t, r, a, l) {
            return new (a = a || Promise)(function (i, e) {
                function n(t) {
                    try {
                        s(l.next(t))
                    } catch (t) {
                        e(t)
                    }
                }

                function o(t) {
                    try {
                        s(l.throw(t))
                    } catch (t) {
                        e(t)
                    }
                }

                function s(t) {
                    var e;
                    t.done ? i(t.value) : ((e = t.value) instanceof a ? e : new a(function (t) {
                        t(e)
                    })).then(n, o)
                }

                s((l = l.apply(t, r || [])).next())
            })
        };

        class _ {
            constructor(t) {
                this.http = t
            }

            init(t, e, i, n) {
                this.selectPointCallback = t, this.map = e, this.operatorsOrBrands = i, this.options = n, this.searchElement.innerHTML = this.display()
            }

            setInitValue(t) {
                document.getElementById("BPWidgetCodeSearch").value = t.code, this.selectedValue = t.code
            }

            autocomplete(t) {
                this.addWrapper(t), t.addEventListener("input", a(t => this.handleInput(t), 500)), t.addEventListener("keydown", t => this.handleKeydown(t)), t.addEventListener("focus", t => this.handleInput(t, !0)), t.addEventListener("blur", () => this.handleBlur(t))
            }

            handleBlur(t) {
                this.closeAllLists(t), this.selectedValue || (t.value = "")
            }

            handleInput(t, e) {
                e || (this.selectedValue = ""), this.targetInput = t.target;
                const n = this.targetInput.value;
                if (this.closeAllLists(this.targetInput), n && !(n.length < 3)) {
                    const o = this.createBox(this.targetInput), i = document.createElement("DIV"),
                        s = (i.setAttribute("id", "point-list"), document.createElement("DIV"));
                    s.setAttribute("id", "localization-list"), this.http.findLocalizationsByText(n, this.options.countryCodes || "pl", i => {
                        i.map(t => (t.display_name = this.normalizeDisplayName(t), t)).filter((e, t) => i.findIndex(t => e.display_name === t.display_name) === t).filter(t => {
                            return t.display_name.toLowerCase().includes(n.split(" ")[0].toLowerCase()) || (null == (t = t.address.postcode) ? void 0 : t.toLowerCase()) === n.toLowerCase()
                        }).forEach(t => {
                            s.appendChild(this.createLocationItem(t, n))
                        }), o.removeAttribute("style")
                    }), this.http.autocompletePosFilter(n, this.options, this.operatorsOrBrands(), t => {
                        t.forEach(t => {
                            var e = this.createItem(t, n);
                            this.evalAddressAlignment(e), i.appendChild(this.createItem(t, n))
                        }), o.removeAttribute("style")
                    }), o.appendChild(s), o.appendChild(i), this.currentFocus = -1
                }
            }

            normalizeDisplayName(t) {
                return t.address ? (t.address.road ? i18n.t("partials.st") + " " + t.address.road + ", " : "") + (t.address.hamlet ? t.address.hamlet + ", " : "") + (t.address.village ? t.address.village + ", " : "") + (t.address.suburb ? t.address.suburb + ", " : "") + (t.address.neighbourhood ? t.address.neighbourhood + ", " : "") + (t.address.city ? t.address.city + ", " : t.address.town ? t.address.town + ", " : "") + (t.address.county && t.address.county != t.address.city ? t.address.county + ", " : "") + (t.address.state ? t.address.state + ", " : "") + (t.address.country || "") : t.display_name
            }

            evalAddressAlignment(t) {
                var e = t.getElementsByTagName("span").item(0), i = t.getElementsByTagName("span").item(1);
                t.scrollWidth > t.clientWidth && (e.classList.add("block", "wrap-text"), i.classList.add("block", "wrap-text"))
            }

            handleKeydown(t) {
                var e = t.target, i = document.getElementById(e.id + "-autocomplete-list"),
                    i = i ? Array.prototype.slice.call(i.getElementsByClassName("pac-item")) : null;
                i && i.length && this.controlItemFocus(t, i), this.submitItem(t, i), i && !i.length && document.getElementById(e.id + "-autocomplete-list").setAttribute("style", "display: none")
            }

            submitItem(t, e) {
                "Enter" === t.code && (t.preventDefault(), -1 < this.currentFocus) && e && this.handlePointClick(e[this.currentFocus]), "Tab" === t.code && (t.preventDefault(), this.currentFocus += 1, this.handlePointClick(e[this.currentFocus]))
            }

            addWrapper(t) {
                var e = t.parentNode, i = document.createElement("div");
                i.setAttribute("class", "code-search-autocomplete-container"), e.replaceChild(i, t), i.appendChild(t)
            }

            controlItemFocus(t, e) {
                "ArrowDown" === t.code && (this.currentFocus++, this.addActive(e)), "ArrowUp" === t.code && (this.currentFocus--, this.addActive(e))
            }

            handlePointClick(t) {
                this.selectedValue = t.dataset.code, this.targetInput.value = t.dataset.code, this.selectPointCallback(t.dataset.operator + "/" + t.dataset.code, !0), this.closeAllLists(this.targetInput)
            }

            handlePlaceClick(t) {
                this.map.setView(new L.LatLng(Number(t.dataset.lat), Number(t.dataset.lon)), c.correctMapZoom(this.map.getZoom())), this.closeAllLists(this.targetInput)
            }

            createBox(t) {
                var e = document.createElement("DIV");
                return e.setAttribute("id", t.id + "-autocomplete-list"), e.setAttribute("class", "pac-container pac-logo code-search-autocomplete-items"), t.parentNode.appendChild(e), e
            }

            createItem(t, e) {
                var i = document.createElement("DIV"), n = c.getPointLogo(t), o = document.createElement("DIV");
                return i.appendChild(o), i.setAttribute("class", "pac-item"), i.setAttribute("data-operator", t.operator), i.setAttribute("data-code", t.code), o.innerHTML += this.boldInterestingPart(t.code, e), o.innerHTML += `<div><span>${this.boldInterestingPart(t.street, e)}</span> <span>${this.boldInterestingPart(t.city, e)}</span></div>`, i.innerHTML += `<div class="bp-brand-logo">${n}</div>`, i.addEventListener("mousedown", ({currentTarget: t}) => this.handlePointClick(t)), i
            }

            createLocationItem(t, e) {
                var i = document.createElement("DIV"), n = document.createElement("DIV");
                return i.appendChild(n), i.setAttribute("class", "pac-item"), i.setAttribute("data-lat", t.lat), i.setAttribute("data-lon", t.lon), n.innerHTML = this.boldInterestingPart(t.display_name, e), i.addEventListener("mousedown", ({currentTarget: t}) => this.handlePlaceClick(t)), i
            }

            addActive(t) {
                t && (this.removeActive(t), this.currentFocus >= t.length && (this.currentFocus = 0), this.currentFocus < 0 && (this.currentFocus = t.length - 1), t[this.currentFocus].classList.add("code-search-autocomplete-active"))
            }

            removeActive(t) {
                t.forEach(t => t.classList.remove("code-search-autocomplete-active"))
            }

            closeAllLists(e, i) {
                Array.prototype.slice.call(document.getElementsByClassName("code-search-autocomplete-items")).forEach(t => i != t && i != e && t.parentNode.removeChild(t))
            }

            get searchElement() {
                return document.getElementById("BPWidgetCodeAutocomplete")
            }

            boldInterestingPart(t, e) {
                e = e.split(" ");
                let i = t;
                return e.forEach(t => {
                    var t = t.toLowerCase(), e = i.toLowerCase().indexOf(t);
                    t && -1 !== e && (t = t.length, i = i.substr(0, e) + "<b>" + i.substr(e, t) + "</b>" + i.substr(e + t))
                }), i
            }

            display() {
                return `
                  <input
                    class="bp-search-input bp-search-input-code-search"
                    id="BPWidgetCodeSearch"
                    data-test="map-code-search"
                    type="text"
                    name="BPWidgetCodeSearch"
                    placeholder="${i18n.t("menubar.code_search_placeholder")}"
                    autocomplete="off"
                  >
                `
            }
        }

        class g {
            constructor() {
                this.changeFiltersPositionState = !1, this.itemsPerLoad = 100, this.visiblePointsCounter = 0, this.allFetchedPointsForView = [], this.observer = new IntersectionObserver(t => {
                    t.forEach(t => {
                        t.isIntersecting && (this.appendElementsAndResetObserver(), this.observer.unobserve(t.target))
                    })
                }), this.display()
            }

            init(t, e) {
                this.selectPointCallback = t, this.listButtonElement.addEventListener("click", () => {
                    this.isCollapsed() ? this.expandList() : this.collapseList()
                }), this.closeButton.addEventListener("click", () => {
                    this.collapseList()
                }), this.changeFiltersPositionState = e && !!document.querySelector(".bp-media-lg")
            }

            updateList(t) {
                this.listOfElements.replaceChildren(), this.visiblePointsCounter = 0, this.allFetchedPointsForView = t, this.posListElementWrapper.scrollTop = 0, this.appendElementsAndResetObserver()
            }

            appendElementsAndResetObserver() {
                this.allFetchedPointsForView.slice(this.visiblePointsCounter, this.visiblePointsCounter + this.itemsPerLoad).forEach((t, e) => {
                    t = this.createPosItem(t);
                    0 === e && t.setAttribute("data-test", "pos-first-item"), this.listOfElements.appendChild(t), this.visiblePointsCounter++
                }), this.listOfElements.lastElementChild && this.observer.observe(this.listOfElements.lastElementChild)
            }

            display() {
                var t = c.asset("images/icons/icon_close.svg"),
                    e = (this.listOfElements = document.createElement("DIV"), this.listOfElements.setAttribute("class", "bp-list-elements"), i18n.t("list.label")),
                    i = document.createElement("DIV");
                i.setAttribute("class", "bp-list-content"), i.innerHTML = `
                  <div class="list-header">
                    <div class="title">${e}</div>
                    <div id="closeList">
                      <img src="${t}">
                    </div>
                  </div>`, i.appendChild(this.listOfElements), this.posListElementWrapper.appendChild(i)
            }

            createPosItem(t) {
                var e = document.createElement("DIV"), i = c.getPointLogo(t), n = document.createElement("DIV"),
                    o = c.getPointName(t);
                return e.setAttribute("data-code", t.code), e.setAttribute("data-operator", t.operator), e.appendChild(n), e.setAttribute("class", "item"), n.innerHTML = `
                  <div class="flex">
                    <div>
                      <p class="bp-list-item-name">${o}</p><p class="bp-list-item-code">${t.code}</p>
                    </div>
                    <div class="bp-brand-logo">${i}</div>
                  </div>
                  <p>${i18n.t("partials.st")} ${t.street}</p>
                  <p>${t.postalCode} ${t.city}</p>`, e.addEventListener("mousedown", ({currentTarget: t}) => this.handleClick(t)), e
            }

            handleClick(t) {
                r("active", "switchable"), s(this.filtersContent, "opened-side-panel"), this.selectPointCallback(t.dataset.operator + "/" + t.dataset.code, !0)
            }

            expandList() {
                this.changeFiltersPositionState || r("active", "switchable"), o(this.listButtonElement, "active"), o(this.posListElementWrapper, "active"), o(this.filtersContent, "opened-side-panel"), this.selectPointCallback(void 0, !1)
            }

            collapseList() {
                this.isCollapsed() || (s(this.listButtonElement, "active"), s(this.posListElementWrapper, "active"), s(this.filtersContent, "opened-side-panel"))
            }

            isCollapsed() {
                return -1 === this.posListElementWrapper.className.indexOf("active")
            }

            get closeButton() {
                return document.getElementById("closeList")
            }

            get posListElementWrapper() {
                return document.getElementById("BPWidgetList")
            }

            get listButtonElement() {
                return document.getElementById("BPWidgetListButton")
            }

            get filtersContent() {
                return document.getElementById("BPWidgetFiltersContent")
            }
        }

        return new class {
            constructor() {
                this.TILE_LAYER_URL_TEMPLATE = "https://osm-eu.apaczka.pl/tile/{z}/{x}/{y}.png", this.TILE_LAYER_ATTRIBUTION = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>', this.DEFAULT_MAP_OPTIONS = {
                    center: {
                        lat: 52.226376,
                        lng: 21.009979
                    }, globalZoom: c.DEFAULT_GLOBAL_ZOOM, pointZoom: c.DEFAULT_POINT_ZOOM, gestureHandling: !0
                }, this.DEFAULT_LANG = "pl", this.submit = t => {
                    this.http.countPointSelection(t.operator, t.code), this.options.callback && this.options.callback({
                        code: t.code,
                        operator: t.operator,
                        street: t.street,
                        postalCode: t.postalCode,
                        city: t.city,
                        province: t.province,
                        description: t.description,
                        latitude: t.latitude,
                        longitude: t.longitude,
                        openingHoursMap: t.openingHoursMap,
                        cod: t.cod,
                        brand: t.brand,
                        brandPretty: t.brandPretty,
                        pointTypes: t.pointTypes
                    })
                }, this.updateRwd = () => {
                    var t = this.rootElement;
                    let e = "bp-media-lg";
                    t.offsetWidth <= 450 ? e = "bp-media-xs" : 450 < t.offsetWidth && t.offsetWidth < 992 && (e = "bp-media-md"), t.className = t.className.replace(/bp-media-(xs|md|lg)/, e)
                }, this.selectPointByCode = (i, n) => {
                    var t;
                    null == i ? (this.currentlySelectedPoint = void 0, this.markers.unselectMarker()) : (null == (t = this.currentlySelectedPoint) ? void 0 : t.code) != i ? this.http.getPos(i, t => {
                        let e = this.markers.findMarkerByRecordId(i);
                        e = e || this.markers.createMarker(t), this.markers.selectMarker(e, t, n), this.currentlySelectedPoint = t
                    }, t => this.markers.errorMarker(this.markers.createMarker({}), t)) : this.currentlySelectedPoint && this.markers.selectMarker(this.markers.findMarkerByRecordId((null == (t = this.currentlySelectedPoint) ? void 0 : t.operator) + "/" + (null == (t = this.currentlySelectedPoint) ? void 0 : t.code)), this.currentlySelectedPoint, !1)
                }, this.selectPoint = (e, i) => {
                    var t;
                    e ? (null == (t = this.currentlySelectedPoint) ? void 0 : t.code) == e.pos.code ? this.markers.selectMarker(e, this.currentlySelectedPoint, !1) : (t = e.pos.posId, this.http.getPos(t, t => {
                        this.markers.selectMarker(e, t, i), this.currentlySelectedPoint = t
                    }, t => this.markers.errorMarker(e, t))) : (this.currentlySelectedPoint = void 0, this.markers.unselectMarker())
                }, this.unselectPoint = () => {
                    this.currentlySelectedPoint = void 0
                }
            }

            init(t, e) {
                this.initTranslations(e.language || this.DEFAULT_LANG).then(() => {
                    this.initWidget(t, e)
                })
            }

            initWidget(t, e) {
                this.options = e, this.options.operators = this.options.operators || [{operator: "RUCH"}, {operator: "INPOST"}, {operator: "POCZTA"}, {operator: "DPD"}, {operator: "UPS"}, {operator: "FEDEX"}, {operator: "DHL"}], this.updatePointsTimeout = 0, this.currentlySelectedPoint = void 0, this.http = new i(e.testMode), e.alias && this.http.loadConfiguration(e.alias, t => {
                    this.brandColor = null == t ? void 0 : t.mainColorHex, this.customLogoUrl = null == t ? void 0 : t.logoUrl, this.brandUrl = null == t ? void 0 : t.shopUrl
                }, t => console.error(t)), /*console.log('BL WIDGET OBJECT:'), console.log(t),*/ t.innerHTML = this.display(), this.updateRwd(), BPWidget.ResizeSensor(this.rootElement, this.updateRwd), this.createModules(), this.initMap(), this.options.callback || (this.rootElement.className += " bp-no-callback"), this.options.mapOnly && o(this.rootElement, "map-only"), this.options.changeFiltersPosition && o(this.rootElement, "changed-filters-position"), this.options.codeSearch && o(this.rootElement, "map-with-code-search")
            }

            initTranslations(e) {
                return m(this, void 0, void 0, function* () {
                    var t = yield(yield fetch(`https://widget.bliskapaczka.pl/v8.2/translations/${e}.json`)).json();
                    i18n.locale = e, i18n.store(t)
                })
            }

            initMap() {
                var i;
                return m(this, void 0, void 0, function* () {
                    if (this.options.brandMode && !this.options.brands) {
                        this.options.brands = [];
                        var t = yield this.http.getBrandsSync();
                        if (!t) return void console.error("Couldn't fetch brands for brand mode");
                        t.forEach(t => this.options.brands.push({brand: t}))
                    }
                    null != (i = this.options.selectedPos) && i.code && null != (i = this.options.selectedPos) && i.operator && ((t = yield this.http.getPosSync(this.options.selectedPos.operator + "/" + this.options.selectedPos.code)) ? this.currentlySelectedPoint = t : console.error("Couldn't fetch point for selectedPos: " + this.options.selectedPos.operator + "/" + this.options.selectedPos.code));
                    var t = this.createMapOptions(this.options.mapOptions), e = new GeoSearch.OpenStreetMapProvider;
                    console.log('GeoSearch.OpenStreetMapProvider:');
                    console.log(e[0]);
                    console.log(typeof e[0]);
                    if ( 'undefined' == typeof e[0] ) {
                        console.log('GeoSearch.OpenStreetMapProvider == undefined');
                        let e = [];
                        e[0] = {};
                        e[0].y = bliskapaczka_alsendo_y;
                        e[0].x = bliskapaczka_alsendo_x;
                    }
                    this.options.initialAddress && !this.options.selectedPos ? (e = yield e.search({query: this.options.initialAddress}), this.map = L.map("BPWidgetMap", {zoomControl: !1}).setView(e && e[0] && e[0].y !== undefined && e[0].x !== undefined
                        ? [e[0].y, e[0].x]
                        : [bliskapaczka_alsendo_y, bliskapaczka_alsendo_x], (null == (i = this.options.mapOptions) ? void 0 : i.zoom) || c.DEFAULT_GLOBAL_ZOOM)) : this.map = L.map("BPWidgetMap", {zoomControl: !1}).setView([null == (i = t.center) ? void 0 : i.lat, null == (i = t.center) ? void 0 : i.lng], t.zoom), L.control.zoom({position: "bottomright"}).addTo(this.map), L.tileLayer(this.TILE_LAYER_URL_TEMPLATE, {
                        attribution: this.TILE_LAYER_ATTRIBUTION,
                        maxZoom: 19
                    }).addTo(this.map), this.options.readyCallback && this.map.on("load", this.options.readyCallback), this.search && this.search.init(this.map), this.options.mapState = {
                        coordinates: (null == (i = this.options.mapOptions) ? void 0 : i.center) || this.DEFAULT_MAP_OPTIONS.center,
                        zoom: (null == (i = this.options.mapOptions) ? void 0 : i.zoom) || this.DEFAULT_MAP_OPTIONS.globalZoom,
                        radius: 0
                    }, this.map.on("zoomend moveend", this.checkPointsUpdate.bind(this)), this.markers.init(this.map, this.options.operators, this.selectPoint, this.submit, this.unselectPoint), this.filters && (e = {
                        showFilter: this.options.showCod,
                        filterValue: this.options.codOnly
                    }, this.brandMode ? (this.filters.initWithBrands(this.options.brands, e, !!this.options.hideFilters, !!this.options.changeFiltersPosition), o(document.getElementById("BPWidgetMap"), "brands"), this.updateMarkersPointsVisibility()) : this.filters.initWithOperators(this.options.operators, e, !!this.options.hideFilters, !!this.options.changeFiltersPosition), this.filters.onChange(a(() => this.updatePoints(this.updatePointsCallback.bind(this)), 1e3))), this.isCodeSearch() && (this.codeSearch.init(this.selectPointByCode, this.map, () => this.getOperatorsOrBrandsToUpdate(), this.options), this.codeSearch.autocomplete(document.getElementById("BPWidgetCodeSearch"))), this.list.init(this.selectPointByCode, !!this.options.changeFiltersPosition), this.updatePoints(this.updatePointsCallback.bind(this)), setTimeout(() => {
                        this.map.invalidateSize()
                    }, 100)
                })
            }

            updatePointsCallback() {
                this.currentlySelectedPoint && this.markers.selectMarker(this.markers.findMarkerByRecordId(this.currentlySelectedPoint.operator + "/" + this.currentlySelectedPoint.code), this.currentlySelectedPoint, !1), this.updateMarkersPointsVisibility()
            }

            isCodeSearch() {
                return this.codeSearch && this.options.codeSearch
            }

            createMapOptions(t = {}) {
                return {
                    center: (this.currentlySelectedPoint ? {
                        lat: this.currentlySelectedPoint.latitude,
                        lng: this.currentlySelectedPoint.longitude
                    } : t.center) || this.DEFAULT_MAP_OPTIONS.center,
                    zoom: void 0 !== t.zoom ? t.zoom : this.currentlySelectedPoint ? this.DEFAULT_MAP_OPTIONS.pointZoom : this.DEFAULT_MAP_OPTIONS.globalZoom,
                    gestureHandling: (void 0 !== t.gestureHandling ? t : this.DEFAULT_MAP_OPTIONS).gestureHandling
                }
            }

            schedulePointsUpdate(t) {
                window.clearTimeout(this.updatePointsTimeout), this.updatePointsTimeout = window.setTimeout(this.updatePoints.bind(this, t), 1e3)
            }

            checkPointsUpdate() {
                var t = this.options.mapState.zoom;
                if (this.options.mapState.coordinates = this.map.getCenter(), this.options.mapState.zoom = this.map.getZoom(), t && this.map.getZoom() > t && !this.options.mapState.isZoomWarningVisible) return !1;
                var e = this.map.getCenter(), i = this.map.getZoom(), n = this.http.getLastPosListParams();
                if (t == this.map.getZoom() && (null == n ? void 0 : n.coordinates.lat) == e.lat && (null == n ? void 0 : n.coordinates.lng) == e.lng) return !1;
                if (null != n && (t = L.latLng(null == n ? void 0 : n.coordinates.lat, null == n ? void 0 : n.coordinates.lng).distanceTo(L.latLng(e.lat, e.lng)) / 1e3, e = this.calculatePixelDistanceInKilometers(.5 * (this.rootElement.offsetHeight + this.rootElement.offsetWidth), e.lat, i), t + (this.options.mapState.radius = e) < n.radius)) return !1;
                return this.schedulePointsUpdate(this.updatePointsCallback.bind(this)), !0
            }

            calculatePixelDistanceInKilometers(t, e, i) {
                return t && e && i ? t * (40075.016 * Math.cos(Math.PI * e / 180) / Math.pow(2, Math.floor(i) + 8)) : 0
            }

            createModules() {
                this.markers = new p, this.filters = new d, this.search = new f, this.codeSearch = new _(this.http), this.list = new g
            }

            updatePoints(e) {
                var t;
                this.options.mapState.zoom < c.MIN_MAP_ZOOM ? (this.showZoomInRequirement(!0), this.markers.clearMarkers(), this.options.mapState.isZoomWarningVisible = !0) : (this.options.mapState.isZoomWarningVisible = !1, this.showZoomInRequirement(!1), t = this.getOperatorsOrBrandsToUpdate(), this.options.mapState.coordinates = this.map.getCenter(), this.options.mapState.radius = this.calculatePixelDistanceInKilometers(.5 * (this.rootElement.offsetHeight + this.rootElement.offsetWidth), this.map.getCenter().lat, this.map.getZoom()), this.http.listPos(this.options, t, this.getCodFilter(), t => {
                    this.markers.clearMarkers(), this.markers.updateMarkers(t), this.list.updateList(t), e()
                }, t => {
                    console.error(t), this.markers.clearMarkers()
                }))
            }

            updateMarkersPointsVisibility() {
                var t = this.getOperatorsOrBrandsToUpdate(), e = this.getCodFilter();
                this.markers.filterMarkers(t, e, this.brandMode ? "brand" : "operator")
            }

            get brandMode() {
                return !!this.options.brandMode
            }

            getOperatorsOrBrandsToUpdate() {
                return this.filters ? this.filters.getValues() : this.brandMode ? t(this.options.brands, t => t.brand) : t(this.options.operators, t => t.operator)
            }

            getCodFilter() {
                return this.filters.getCod()
            }

            showZoomInRequirement(t) {
                var e = document.getElementById("BPWidgetOverlayShadow"),
                    i = document.getElementById("BPWidgetZoomWarning");
                (t ? (s(e, "hidden"), s) : (o(e, "hidden"), o))(i, "hidden")
            }

            get rootElement() {
                return document.getElementById("BPWidget")
            }

            display() {
                var t = c.footer(!!this.options.alias, this.customLogoUrl, this.brandUrl);
                let e;
                return e = this.options.alias ? this.brandColor || "#6D3ADF" : "#282828", `
                  <div id="BPWidget" class="bp-media-lg">
                    <div id="BPWidgetSearch" class="bp-search-panel"></div>
                    <div id="BPWidgetFilters" class="bp-filters switchable"></div>
                    <div id="BPWidgetMap" class="bp-map" data-test="map"></div>
                    <div id="BPWidgetPOSInfo" class="bp-pos-info switchable"></div>
                    <div id="BPWidgetOverlayShadow" class="hidden"></div>
                    <div id="BPWidgetZoomWarning" class="hidden">${i18n.t("zoom_to_see_points")}</div>
                    <div id="BPWidgetList" class="bp-list switchable"></div>
                    <div id="BPWidgetRWDButtons" class="bp-rwd-buttons">

                    </div>
                    <div id="BPWidgetFooter" class="bp-footer" style="background-color:  ${e}">
                      ${t}
                    </div>
                  </div>
              `
            }
        }
    }(), function () {
        mt = this, yt = function () {
            var g, o;
            return "undefined" == typeof window ? null : (g = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (t) {
                return window.setTimeout(t, 20)
            }, (o = function (e, i) {
                function _() {
                    var i, n, o = [];
                    this.add = function (t) {
                        o.push(t)
                    }, this.call = function () {
                        for (i = 0, n = o.length; i < n; i++) o[i].call()
                    }, this.remove = function (t) {
                        var e = [];
                        for (i = 0, n = o.length; i < n; i++) o[i] !== t && e.push(o[i]);
                        o = e
                    }, this.length = function () {
                        return o.length
                    }
                }

                function n(t, e) {
                    if (t.resizedAttached) {
                        if (t.resizedAttached) return void t.resizedAttached.add(e)
                    } else t.resizedAttached = new _, t.resizedAttached.add(e);
                    t.resizeSensor = document.createElement("div"), t.resizeSensor.className = "resize-sensor";

                    function i() {
                        d.style.width = "100000px", d.style.height = "100000px", c.scrollLeft = 1e5, c.scrollTop = 1e5, p.scrollLeft = 1e5, p.scrollTop = 1e5
                    }

                    function n() {
                        a = 0, r && (f = l, m = h, t.resizedAttached) && t.resizedAttached.call()
                    }

                    function o() {
                        l = t.offsetWidth, h = t.offsetHeight, (r = l != f || h != m) && !a && (a = g(n)), i()
                    }

                    function s(t, e, i) {
                        t.attachEvent ? t.attachEvent("on" + e, i) : t.addEventListener(e, i)
                    }

                    var r, a, l, h,
                        e = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;",
                        u = "position: absolute; left: 0; top: 0; transition: 0s;",
                        c = (t.resizeSensor.style.cssText = e, t.resizeSensor.innerHTML = '<div class="resize-sensor-expand" style="' + e + '"><div style="' + u + '"></div></div><div class="resize-sensor-shrink" style="' + e + '"><div style="' + u + ' width: 200%; height: 200%"></div></div>', t.appendChild(t.resizeSensor), "static" == (e = "position", (u = t).currentStyle ? u.currentStyle[e] : window.getComputedStyle ? window.getComputedStyle(u, null).getPropertyValue(e) : u.style[e]) && (t.style.position = "relative"), t.resizeSensor.childNodes[0]),
                        d = c.childNodes[0], p = t.resizeSensor.childNodes[1], f = t.offsetWidth, m = t.offsetHeight;
                    i();
                    s(c, "scroll", o), s(p, "scroll", o)
                }

                s(e, function (t) {
                    n(t, i)
                }), this.detach = function (t) {
                    o.detach(e, t)
                }
            }).detach = function (t, e) {
                s(t, function (t) {
                    t.resizedAttached && "function" == typeof e && (t.resizedAttached.remove(e), t.resizedAttached.length()) || t.resizeSensor && (t.contains(t.resizeSensor) && t.removeChild(t.resizeSensor), delete t.resizeSensor, delete t.resizedAttached)
                })
            }, o);

            function s(t, e) {
                var i = Object.prototype.toString.call(t),
                    i = "[object Array]" === i || "[object NodeList]" === i || "[object HTMLCollection]" === i || "[object Object]" === i || "undefined" != typeof jQuery && t instanceof jQuery || "undefined" != typeof Elements && t instanceof Elements,
                    n = 0, o = t.length;
                if (i) for (; n < o; n++) e(t[n]); else e(t)
            }
        }, "object" == typeof exports ? module.exports = yt() : mt.ResizeSensor = yt();
        var o = window, N = document, y = void 0;

        function Z(t, e, i) {
            return setTimeout(D(t, i), e)
        }

        function i(t, e, i) {
            return Array.isArray(t) && (r(t, i[e], i), 1)
        }

        function r(t, e, i) {
            if (t) if (t.forEach) t.forEach(e, i); else if (t.length !== y) for (n = 0; n < t.length;) e.call(i, t[n], n, t), n++; else for (var n in t) t.hasOwnProperty(n) && e.call(i, t[n], n, t)
        }

        function R(i, t, e) {
            var n = "DEPRECATED METHOD: " + t + "\n" + e + " AT \n";
            return function () {
                var t = new Error("get-stack-trace"),
                    t = t && t.stack ? t.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
                    e = o.console && (o.console.warn || o.console.log);
                return e && e.call(o.console, n, t), i.apply(this, arguments)
            }
        }

        function t(t, e, i) {
            var e = e.prototype, n = t.prototype = Object.create(e);
            n.constructor = t, n._super = e, i && x(n, i)
        }

        function D(t, e) {
            return function () {
                return t.apply(e, arguments)
            }
        }

        function j(t, e) {
            return typeof t == _t ? t.apply(e && e[0] || y, e) : t
        }

        function F(t, e) {
            return t === y ? e : t
        }

        function e(e, t, i) {
            r(s(t), function (t) {
                e.addEventListener(t, i, !1)
            })
        }

        function n(e, t, i) {
            r(s(t), function (t) {
                e.removeEventListener(t, i, !1)
            })
        }

        function U(t, e) {
            for (; t;) {
                if (t == e) return !0;
                t = t.parentNode
            }
            return !1
        }

        function l(t, e) {
            return -1 < t.indexOf(e)
        }

        function s(t) {
            return t.trim().split(/\s+/g)
        }

        function a(t, e, i) {
            if (t.indexOf && !i) return t.indexOf(e);
            for (var n = 0; n < t.length;) {
                if (i && t[n][i] == e || !i && t[n] === e) return n;
                n++
            }
            return -1
        }

        function h(t) {
            return Array.prototype.slice.call(t, 0)
        }

        function H(t, i, e) {
            for (var n = [], o = [], s = 0; s < t.length;) {
                var r = i ? t[s][i] : t[s];
                a(o, r) < 0 && n.push(t[s]), o[s] = r, s++
            }
            return n = e ? i ? n.sort(function (t, e) {
                return t[i] > e[i]
            }) : n.sort() : n
        }

        function u(t, e) {
            for (var i, n = e[0].toUpperCase() + e.slice(1), o = 0; o < ft.length;) {
                if ((i = (i = ft[o]) ? i + n : e) in t) return i;
                o++
            }
            return y
        }

        function W(t) {
            t = t.ownerDocument || t;
            return t.defaultView || t.parentWindow || o
        }

        function c(e, t) {
            var i = this;
            this.manager = e, this.callback = t, this.element = e.element, this.target = e.options.inputTarget, this.domHandler = function (t) {
                j(e.options.enable, [e]) && i.handler(t)
            }, this.init()
        }

        function G(t, e, i) {
            var n, o, s, r, a, l, h, u = i.pointers.length, c = i.changedPointers.length, d = e & P && u - c == 0,
                u = e & (C | E) && u - c == 0,
                p = (i.isFirst = !!d, i.isFinal = !!u, d && (t.session = {}), i.eventType = e, c = i, d = (u = t).session, e = c.pointers, o = e.length, d.firstInput || (d.firstInput = V(c)), 1 < o && !d.firstMultiple ? d.firstMultiple = V(c) : 1 === o && (d.firstMultiple = !1), o = d.firstInput, s = d.firstMultiple, r = (s || o).center, p = c.center = q(e), c.timeStamp = gt(), c.deltaTime = c.timeStamp - o.timeStamp, c.angle = K(r, p), c.distance = b(r, p), d),
                f = c, m = f.center, _ = p.offsetDelta || {}, g = p.prevDelta || {}, v = p.prevInput || {},
                v = (f.eventType !== P && v.eventType !== C || (g = p.prevDelta = {
                    x: v.deltaX || 0,
                    y: v.deltaY || 0
                }, _ = p.offsetDelta = {
                    x: m.x,
                    y: m.y
                }), f.deltaX = g.x + (m.x - _.x), f.deltaY = g.y + (m.y - _.y), c.offsetDirection = Y(c.deltaX, c.deltaY), o = $(c.deltaTime, c.deltaX, c.deltaY), c.overallVelocityX = o.x, c.overallVelocityY = o.y, c.overallVelocity = L(o.x) > L(o.y) ? o.x : o.y, c.scale = s ? function (t, e) {
                    return b(e[0], e[1], Mt) / b(t[0], t[1], Mt)
                }(s.pointers, e) : 1, c.rotation = s ? function (t, e) {
                    return K(e[1], e[0], Mt) + K(t[1], t[0], Mt)
                }(s.pointers, e) : 0, c.maxPointers = !d.prevInput || c.pointers.length > d.prevInput.maxPointers ? c.pointers.length : d.prevInput.maxPointers, d),
                p = c, f = v.lastInterval || p, g = p.timeStamp - f.timeStamp;
            p.eventType != E && (Pt < g || f.velocity === y) ? (n = p.deltaX - f.deltaX, m = p.deltaY - f.deltaY, g = $(g, n, m), l = g.x, h = g.y, a = L(g.x) > L(g.y) ? g.x : g.y, n = Y(n, m), v.lastInterval = p) : (a = f.velocity, l = f.velocityX, h = f.velocityY, n = f.direction), p.velocity = a, p.velocityX = l, p.velocityY = h, p.direction = n, r = u.element, U(c.srcEvent.target, r) && (r = c.srcEvent.target), c.target = r, t.emit("hammer.input", i), t.recognize(i), t.session.prevInput = i
        }

        function V(t) {
            for (var e = [], i = 0; i < t.pointers.length;) e[i] = {
                clientX: v(t.pointers[i].clientX),
                clientY: v(t.pointers[i].clientY)
            }, i++;
            return {timeStamp: gt(), pointers: e, center: q(e), deltaX: t.deltaX, deltaY: t.deltaY}
        }

        function q(t) {
            var e = t.length;
            if (1 === e) return {x: v(t[0].clientX), y: v(t[0].clientY)};
            for (var i = 0, n = 0, o = 0; o < e;) i += t[o].clientX, n += t[o].clientY, o++;
            return {x: v(i / e), y: v(n / e)}
        }

        function $(t, e, i) {
            return {x: e / t || 0, y: i / t || 0}
        }

        function Y(t, e) {
            return t === e ? Ct : L(t) >= L(e) ? t < 0 ? T : M : e < 0 ? S : k
        }

        function b(t, e, i) {
            var n = e[(i = i || Tt)[0]] - t[i[0]], e = e[i[1]] - t[i[1]];
            return Math.sqrt(n * n + e * e)
        }

        function K(t, e, i) {
            var n = e[(i = i || Tt)[0]] - t[i[0]], e = e[i[1]] - t[i[1]];
            return 180 * Math.atan2(e, n) / Math.PI
        }

        function d() {
            this.evEl = "mousedown", this.evWin = "mousemove mouseup", this.pressed = !1, c.apply(this, arguments)
        }

        function X() {
            this.evEl = At, this.evWin = It, c.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
        }

        function J() {
            this.evTarget = "touchstart", this.evWin = "touchstart touchmove touchend touchcancel", this.started = !1, c.apply(this, arguments)
        }

        function p() {
            this.evTarget = "touchstart touchmove touchend touchcancel", this.targetIds = {}, c.apply(this, arguments)
        }

        function Q() {
            c.apply(this, arguments);
            var t = D(this.handler, this);
            this.touch = new p(this.manager, t), this.mouse = new d(this.manager, t), this.primaryTouch = null, this.lastTouches = []
        }

        function tt(t) {
            var e, i, t = t.changedPointers[0];
            t.identifier === this.primaryTouch && (e = {
                x: t.clientX,
                y: t.clientY
            }, this.lastTouches.push(e), i = this.lastTouches, setTimeout(function () {
                var t = i.indexOf(e);
                -1 < t && i.splice(t, 1)
            }, Nt))
        }

        function et(t, e) {
            this.manager = t, this.set(e)
        }

        function f(t) {
            this.options = x({}, this.defaults, t || {}), this.id = bt++, this.manager = null, this.options.enable = F(this.options.enable, !0), this.state = 1, this.simultaneous = {}, this.requireFail = []
        }

        function it(t) {
            return 16 & t ? "cancel" : 8 & t ? "end" : 4 & t ? "move" : 2 & t ? "start" : ""
        }

        function nt(t) {
            return t == k ? "down" : t == S ? "up" : t == T ? "left" : t == M ? "right" : ""
        }

        function m(t, e) {
            e = e.manager;
            return e ? e.get(t) : t
        }

        function _() {
            f.apply(this, arguments)
        }

        function ot() {
            _.apply(this, arguments), this.pX = null, this.pY = null
        }

        function st() {
            _.apply(this, arguments)
        }

        function rt() {
            f.apply(this, arguments), this._timer = null, this._input = null
        }

        function at() {
            _.apply(this, arguments)
        }

        function lt() {
            _.apply(this, arguments)
        }

        function ht() {
            f.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
        }

        function g(t, e) {
            return (e = e || {}).recognizers = F(e.recognizers, g.defaults.preset), new ut(t, e)
        }

        function ut(t, e) {
            this.options = x({}, g.defaults, e || {}), this.options.inputTarget = this.options.inputTarget || t, this.handlers = {}, this.session = {}, this.recognizers = [], this.oldCssProps = {}, this.element = t, this.input = new ((e = this).options.inputClass || (xt ? X : wt ? p : Lt ? Q : d))(e, G), this.touchAction = new et(this, this.options.touchAction), ct(this, !0), r(this.options.recognizers, function (t) {
                var e = this.add(new t[0](t[1]));
                t[2] && e.recognizeWith(t[2]), t[3] && e.requireFailure(t[3])
            }, this)
        }

        function ct(i, n) {
            var o, s = i.element;
            s.style && (r(i.options.cssProps, function (t, e) {
                o = u(s.style, e), n ? (i.oldCssProps[o] = s.style[o], s.style[o] = t) : s.style[o] = i.oldCssProps[o] || ""
            }), n || (i.oldCssProps = {}))
        }

        var dt, pt, ft = ["", "webkit", "Moz", "MS", "ms", "o"], mt = N.createElement("div"), _t = "function",
            v = Math.round, L = Math.abs, gt = Date.now, x = "function" != typeof Object.assign ? function (t) {
                if (t === y || null === t) throw new TypeError("Cannot convert undefined or null to object");
                for (var e = Object(t), i = 1; i < arguments.length; i++) {
                    var n = arguments[i];
                    if (n !== y && null !== n) for (var o in n) n.hasOwnProperty(o) && (e[o] = n[o])
                }
                return e
            } : Object.assign, vt = R(function (t, e, i) {
                for (var n = Object.keys(e), o = 0; o < n.length;) i && t[n[o]] !== y || (t[n[o]] = e[n[o]]), o++;
                return t
            }, "extend", "Use `assign`."), yt = R(function (t, e) {
                return vt(t, e, !0)
            }, "merge", "Use `assign`."), bt = 1, Lt = "ontouchstart" in o, xt = u(o, "PointerEvent") !== y,
            wt = Lt && /mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent), w = "touch", Pt = 25, P = 1,
            C = 4, E = 8, Ct = 1, T = 2, M = 4, S = 8, k = 16, O = T | M, A = S | k, Et = O | A, Tt = ["x", "y"],
            Mt = ["clientX", "clientY"], St = (c.prototype = {
                handler: function () {
                }, init: function () {
                    this.evEl && e(this.element, this.evEl, this.domHandler), this.evTarget && e(this.target, this.evTarget, this.domHandler), this.evWin && e(W(this.element), this.evWin, this.domHandler)
                }, destroy: function () {
                    this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), this.evWin && n(W(this.element), this.evWin, this.domHandler)
                }
            }, {mousedown: P, mousemove: 2, mouseup: C}), kt = (t(d, c, {
                handler: function (t) {
                    var e = St[t.type];
                    e & P && 0 === t.button && (this.pressed = !0), 2 & e && 1 !== t.which && (e = C), this.pressed && (e & C && (this.pressed = !1), this.callback(this.manager, e, {
                        pointers: [t],
                        changedPointers: [t],
                        pointerType: "mouse",
                        srcEvent: t
                    }))
                }
            }), {pointerdown: P, pointermove: 2, pointerup: C, pointercancel: E, pointerout: E}),
            Ot = {2: w, 3: "pen", 4: "mouse", 5: "kinect"}, At = "pointerdown",
            It = "pointermove pointerup pointercancel",
            zt = (o.MSPointerEvent && !o.PointerEvent && (At = "MSPointerDown", It = "MSPointerMove MSPointerUp MSPointerCancel"), t(X, c, {
                handler: function (t) {
                    var e = this.store, i = !1, n = t.type.toLowerCase().replace("ms", ""), n = kt[n],
                        o = Ot[t.pointerType] || t.pointerType, s = o == w, r = a(e, t.pointerId, "pointerId");
                    n & P && (0 === t.button || s) ? r < 0 && (e.push(t), r = e.length - 1) : n & (C | E) && (i = !0), r < 0 || (e[r] = t, this.callback(this.manager, n, {
                        pointers: e,
                        changedPointers: [t],
                        pointerType: o,
                        srcEvent: t
                    }), i && e.splice(r, 1))
                }
            }), {touchstart: P, touchmove: 2, touchend: C, touchcancel: E}), Bt = (t(J, c, {
                handler: function (t) {
                    var e, i = zt[t.type];
                    i === P && (this.started = !0), this.started && (e = function (t, e) {
                        var i = h(t.touches), t = h(t.changedTouches);
                        return [i = e & (C | E) ? H(i.concat(t), "identifier", !0) : i, t]
                    }.call(this, t, i), i & (C | E) && e[0].length - e[1].length == 0 && (this.started = !1), this.callback(this.manager, i, {
                        pointers: e[0],
                        changedPointers: e[1],
                        pointerType: w,
                        srcEvent: t
                    }))
                }
            }), {touchstart: P, touchmove: 2, touchend: C, touchcancel: E}), Nt = (t(p, c, {
                handler: function (t) {
                    var e = Bt[t.type], i = function (t, e) {
                        var i = h(t.touches), n = this.targetIds;
                        if (e & (2 | P) && 1 === i.length) return n[i[0].identifier] = !0, [i, i];
                        var o, s = h(t.changedTouches), r = [], a = this.target, l = i.filter(function (t) {
                            return U(t.target, a)
                        });
                        if (e === P) for (o = 0; o < l.length;) n[l[o].identifier] = !0, o++;
                        for (o = 0; o < s.length;) n[s[o].identifier] && r.push(s[o]), e & (C | E) && delete n[s[o].identifier], o++;
                        return r.length ? [H(l.concat(r), "identifier", !0), r] : void 0
                    }.call(this, t, e);
                    i && this.callback(this.manager, e, {
                        pointers: i[0],
                        changedPointers: i[1],
                        pointerType: w,
                        srcEvent: t
                    })
                }
            }), 2500), Zt = (t(Q, c, {
                handler: function (t, e, i) {
                    var n = i.pointerType == w, o = "mouse" == i.pointerType;
                    if (!(o && i.sourceCapabilities && i.sourceCapabilities.firesTouchEvents)) {
                        if (n) !function (t, e) {
                            t & P ? (this.primaryTouch = e.changedPointers[0].identifier, tt.call(this, e)) : t & (C | E) && tt.call(this, e)
                        }.call(this, e, i); else if (o && function (t) {
                            for (var e = t.srcEvent.clientX, i = t.srcEvent.clientY, n = 0; n < this.lastTouches.length; n++) {
                                var o = this.lastTouches[n], s = Math.abs(e - o.x), o = Math.abs(i - o.y);
                                if (s <= 25 && o <= 25) return !0
                            }
                            return !1
                        }.call(this, i)) return;
                        this.callback(t, e, i)
                    }
                }, destroy: function () {
                    this.touch.destroy(), this.mouse.destroy()
                }
            }), u(mt.style, "touchAction")), Rt = Zt !== y, Dt = "manipulation", I = "none", z = "pan-x", B = "pan-y",
            jt = Rt && (dt = {}, pt = o.CSS && o.CSS.supports, ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function (t) {
                dt[t] = !pt || o.CSS.supports("touch-action", t)
            }), dt);
        et.prototype = {
            set: function (t) {
                "compute" == t && (t = this.compute()), Rt && this.manager.element.style && jt[t] && (this.manager.element.style[Zt] = t), this.actions = t.toLowerCase().trim()
            }, update: function () {
                this.set(this.manager.options.touchAction)
            }, compute: function () {
                var t, e, i, n = [];
                return r(this.manager.recognizers, function (t) {
                    j(t.options.enable, [t]) && (n = n.concat(t.getTouchAction()))
                }), l(t = n.join(" "), I) || (e = l(t, z), i = l(t, B), e && i) ? I : e || i ? e ? z : B : l(t, Dt) ? Dt : "auto"
            }, preventDefaults: function (t) {
                var e = t.srcEvent, i = t.offsetDirection;
                if (!this.manager.session.prevented) {
                    var n = this.actions, o = l(n, I) && !jt.none, s = l(n, B) && !jt[B], n = l(n, z) && !jt[z];
                    if (o) {
                        var r = 1 === t.pointers.length, a = t.distance < 2, t = t.deltaTime < 250;
                        if (r && a && t) return
                    }
                    return (!n || !s) && (o || s && i & O || n && i & A) ? this.preventSrc(e) : void 0
                }
                e.preventDefault()
            }, preventSrc: function (t) {
                this.manager.session.prevented = !0, t.preventDefault()
            }
        }, f.prototype = {
            defaults: {}, set: function (t) {
                return x(this.options, t), this.manager && this.manager.touchAction.update(), this
            }, recognizeWith: function (t) {
                var e;
                return i(t, "recognizeWith", this) || (e = this.simultaneous)[(t = m(t, this)).id] || (e[t.id] = t).recognizeWith(this), this
            }, dropRecognizeWith: function (t) {
                return i(t, "dropRecognizeWith", this) || (t = m(t, this), delete this.simultaneous[t.id]), this
            }, requireFailure: function (t) {
                var e;
                return i(t, "requireFailure", this) || -1 === a(e = this.requireFail, t = m(t, this)) && (e.push(t), t.requireFailure(this)), this
            }, dropRequireFailure: function (t) {
                return i(t, "dropRequireFailure", this) || (t = m(t, this), -1 < (t = a(this.requireFail, t)) && this.requireFail.splice(t, 1)), this
            }, hasRequireFailures: function () {
                return 0 < this.requireFail.length
            }, canRecognizeWith: function (t) {
                return !!this.simultaneous[t.id]
            }, emit: function (e) {
                function t(t) {
                    i.manager.emit(t, e)
                }

                var i = this, n = this.state;
                n < 8 && t(i.options.event + it(n)), t(i.options.event), e.additionalEvent && t(e.additionalEvent), 8 <= n && t(i.options.event + it(n))
            }, tryEmit: function (t) {
                return this.canEmit() ? this.emit(t) : void (this.state = 32)
            }, canEmit: function () {
                for (var t = 0; t < this.requireFail.length;) {
                    if (!(33 & this.requireFail[t].state)) return !1;
                    t++
                }
                return !0
            }, recognize: function (t) {
                t = x({}, t);
                return j(this.options.enable, [this, t]) ? (56 & this.state && (this.state = 1), this.state = this.process(t), void (30 & this.state && this.tryEmit(t))) : (this.reset(), void (this.state = 32))
            }, process: function (t) {
            }, getTouchAction: function () {
            }, reset: function () {
            }
        }, t(_, f, {
            defaults: {pointers: 1}, attrTest: function (t) {
                var e = this.options.pointers;
                return 0 === e || t.pointers.length === e
            }, process: function (t) {
                var e = this.state, i = t.eventType, n = 6 & e, t = this.attrTest(t);
                return n && (i & E || !t) ? 16 | e : n || t ? i & C ? 8 | e : 2 & e ? 4 | e : 2 : 32
            }
        }), t(ot, _, {
            defaults: {event: "pan", threshold: 10, pointers: 1, direction: Et}, getTouchAction: function () {
                var t = this.options.direction, e = [];
                return t & O && e.push(B), t & A && e.push(z), e
            }, directionTest: function (t) {
                var e = this.options, i = !0, n = t.distance, o = t.direction, s = t.deltaX, r = t.deltaY;
                return o & e.direction || (n = e.direction & O ? (o = 0 === s ? Ct : s < 0 ? T : M, i = s != this.pX, Math.abs(t.deltaX)) : (o = 0 === r ? Ct : r < 0 ? S : k, i = r != this.pY, Math.abs(t.deltaY))), t.direction = o, i && n > e.threshold && o & e.direction
            }, attrTest: function (t) {
                return _.prototype.attrTest.call(this, t) && (2 & this.state || !(2 & this.state) && this.directionTest(t))
            }, emit: function (t) {
                this.pX = t.deltaX, this.pY = t.deltaY;
                var e = nt(t.direction);
                e && (t.additionalEvent = this.options.event + e), this._super.emit.call(this, t)
            }
        }), t(st, _, {
            defaults: {event: "pinch", threshold: 0, pointers: 2}, getTouchAction: function () {
                return [I]
            }, attrTest: function (t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.scale - 1) > this.options.threshold || 2 & this.state)
            }, emit: function (t) {
                var e;
                1 !== t.scale && (e = t.scale < 1 ? "in" : "out", t.additionalEvent = this.options.event + e), this._super.emit.call(this, t)
            }
        }), t(rt, f, {
            defaults: {event: "press", pointers: 1, time: 251, threshold: 9}, getTouchAction: function () {
                return ["auto"]
            }, process: function (t) {
                var e = this.options, i = t.pointers.length === e.pointers, n = t.distance < e.threshold,
                    o = t.deltaTime > e.time;
                if (this._input = t, !n || !i || t.eventType & (C | E) && !o) this.reset(); else if (t.eventType & P) this.reset(), this._timer = Z(function () {
                    this.state = 8, this.tryEmit()
                }, e.time, this); else if (t.eventType & C) return 8;
                return 32
            }, reset: function () {
                clearTimeout(this._timer)
            }, emit: function (t) {
                8 === this.state && (t && t.eventType & C ? this.manager.emit(this.options.event + "up", t) : (this._input.timeStamp = gt(), this.manager.emit(this.options.event, this._input)))
            }
        }), t(at, _, {
            defaults: {event: "rotate", threshold: 0, pointers: 2}, getTouchAction: function () {
                return [I]
            }, attrTest: function (t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.rotation) > this.options.threshold || 2 & this.state)
            }
        }), t(lt, _, {
            defaults: {event: "swipe", threshold: 10, velocity: .3, direction: O | A, pointers: 1},
            getTouchAction: function () {
                return ot.prototype.getTouchAction.call(this)
            },
            attrTest: function (t) {
                var e, i = this.options.direction;
                return i & (O | A) ? e = t.overallVelocity : i & O ? e = t.overallVelocityX : i & A && (e = t.overallVelocityY), this._super.attrTest.call(this, t) && i & t.offsetDirection && t.distance > this.options.threshold && t.maxPointers == this.options.pointers && L(e) > this.options.velocity && t.eventType & C
            },
            emit: function (t) {
                var e = nt(t.offsetDirection);
                e && this.manager.emit(this.options.event + e, t), this.manager.emit(this.options.event, t)
            }
        }), t(ht, f, {
            defaults: {
                event: "tap",
                pointers: 1,
                taps: 1,
                interval: 300,
                time: 250,
                threshold: 9,
                posThreshold: 10
            }, getTouchAction: function () {
                return [Dt]
            }, process: function (t) {
                var e = this.options, i = t.pointers.length === e.pointers, n = t.distance < e.threshold,
                    o = t.deltaTime < e.time;
                if (this.reset(), t.eventType & P && 0 === this.count) return this.failTimeout();
                if (n && o && i) {
                    if (t.eventType != C) return this.failTimeout();
                    n = !this.pTime || t.timeStamp - this.pTime < e.interval, o = !this.pCenter || b(this.pCenter, t.center) < e.posThreshold;
                    if (this.pTime = t.timeStamp, this.pCenter = t.center, o && n ? this.count += 1 : this.count = 1, this._input = t, 0 == this.count % e.taps) return this.hasRequireFailures() ? (this._timer = Z(function () {
                        this.state = 8, this.tryEmit()
                    }, e.interval, this), 2) : 8
                }
                return 32
            }, failTimeout: function () {
                return this._timer = Z(function () {
                    this.state = 32
                }, this.options.interval, this), 32
            }, reset: function () {
                clearTimeout(this._timer)
            }, emit: function () {
                8 == this.state && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
            }
        }), g.VERSION = "2.0.7", g.defaults = {
            domEvents: !1,
            touchAction: "compute",
            enable: !0,
            inputTarget: null,
            inputClass: null,
            preset: [[at, {enable: !1}], [st, {enable: !1}, ["rotate"]], [lt, {direction: O}], [ot, {direction: O}, ["swipe"]], [ht], [ht, {
                event: "doubletap",
                taps: 2
            }, ["tap"]], [rt]],
            cssProps: {
                userSelect: "none",
                touchSelect: "none",
                touchCallout: "none",
                contentZooming: "none",
                userDrag: "none",
                tapHighlightColor: "rgba(0,0,0,0)"
            }
        }, ut.prototype = {
            set: function (t) {
                return x(this.options, t), t.touchAction && this.touchAction.update(), t.inputTarget && (this.input.destroy(), this.input.target = t.inputTarget, this.input.init()), this
            }, stop: function (t) {
                this.session.stopped = t ? 2 : 1
            }, recognize: function (t) {
                var e = this.session;
                if (!e.stopped) {
                    this.touchAction.preventDefaults(t);
                    var i, n = this.recognizers, o = e.curRecognizer;
                    (!o || 8 & o.state) && (o = e.curRecognizer = null);
                    for (var s = 0; s < n.length;) i = n[s], 2 === e.stopped || o && i != o && !i.canRecognizeWith(o) ? i.reset() : i.recognize(t), !o && 14 & i.state && (o = e.curRecognizer = i), s++
                }
            }, get: function (t) {
                if (t instanceof f) return t;
                for (var e = this.recognizers, i = 0; i < e.length; i++) if (e[i].options.event == t) return e[i];
                return null
            }, add: function (t) {
                var e;
                return i(t, "add", this) ? this : ((e = this.get(t.options.event)) && this.remove(e), this.recognizers.push(t), (t.manager = this).touchAction.update(), t)
            }, remove: function (t) {
                var e;
                return i(t, "remove", this) || (t = this.get(t)) && -1 !== (t = a(e = this.recognizers, t)) && (e.splice(t, 1), this.touchAction.update()), this
            }, on: function (t, e) {
                var i;
                if (t !== y && e !== y) return i = this.handlers, r(s(t), function (t) {
                    i[t] = i[t] || [], i[t].push(e)
                }), this
            }, off: function (t, e) {
                var i;
                if (t !== y) return i = this.handlers, r(s(t), function (t) {
                    e ? i[t] && i[t].splice(a(i[t], e), 1) : delete i[t]
                }), this
            }, emit: function (t, e) {
                this.options.domEvents && (i = t, n = e, (o = N.createEvent("Event")).initEvent(i, !0, !0), (o.gesture = n).target.dispatchEvent(o));
                var i, n, o, s = this.handlers[t] && this.handlers[t].slice();
                if (s && s.length) {
                    e.type = t, e.preventDefault = function () {
                        e.srcEvent.preventDefault()
                    };
                    for (var r = 0; r < s.length;) s[r](e), r++
                }
            }, destroy: function () {
                this.element && ct(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
            }
        }, x(g, {
            INPUT_START: P,
            INPUT_MOVE: 2,
            INPUT_END: C,
            INPUT_CANCEL: E,
            STATE_POSSIBLE: 1,
            STATE_BEGAN: 2,
            STATE_CHANGED: 4,
            STATE_ENDED: 8,
            STATE_RECOGNIZED: 8,
            STATE_CANCELLED: 16,
            STATE_FAILED: 32,
            DIRECTION_NONE: Ct,
            DIRECTION_LEFT: T,
            DIRECTION_RIGHT: M,
            DIRECTION_UP: S,
            DIRECTION_DOWN: k,
            DIRECTION_HORIZONTAL: O,
            DIRECTION_VERTICAL: A,
            DIRECTION_ALL: Et,
            Manager: ut,
            Input: c,
            TouchAction: et,
            TouchInput: p,
            MouseInput: d,
            PointerEventInput: X,
            TouchMouseInput: Q,
            SingleTouchInput: J,
            Recognizer: f,
            AttrRecognizer: _,
            Tap: ht,
            Pan: ot,
            Swipe: lt,
            Pinch: st,
            Rotate: at,
            Press: rt,
            on: e,
            off: n,
            each: r,
            merge: yt,
            extend: vt,
            assign: x,
            inherit: t,
            bindFn: D,
            prefixed: u
        }), (void 0 !== o ? o : "undefined" != typeof self ? self : {}).Hammer = g, "function" == typeof define && define.amd ? define(function () {
            return g
        }) : "undefined" != typeof module && module.exports ? module.exports = g : o.Hammer = g
    }.bind(BPWidget)()) : console.error("BPWidget already defined")
}();