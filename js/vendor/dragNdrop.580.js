
! function() {
    function a(a, b) {
        for (var c in b) a[c] = b[c];
        return a
    }
 
    function b(b, c) {
        this.element = "string" == typeof b ? document.querySelector(b) : b, this.$element = $(this.element), this.options = a({}, this.options), a(this.options, c), this._create()
    }
 
    function c(a, b) {
        a.x = void 0 !== b.pageX ? b.pageX : b.clientX, a.y = void 0 !== b.pageY ? b.pageY : b.clientY
    }
 
    function d(b, c) {
        this.element = "string" == typeof b ? document.querySelector(b) : b, this.$element = $(this.element), this.options = a({}, this.options), a(this.options, c), this._create()
    }
    for (var e, f = 0, g = "webkit moz ms o".split(" "), h = window.requestAnimationFrame, i = window.cancelAnimationFrame, j = 0; j < g.length && (!h || !i); j++) e = g[j], window.requestAnimationFrame = h || window[e + "RequestAnimationFrame"], window.cancelAnimationFrame = i || window[e + "CancelAnimationFrame"] || window[e + "CancelRequestAnimationFrame"];
    h && i && "undefined" != typeof h || (window.requestAnimationFrame = function(a) {
        var b = (new Date).getTime(),
            c = Math.max(0, 16 - (b - f)),
            d = window.setTimeout(function() {
                a(b + c)
            }, c);
        return f = b + c, d
    }, window.cancelAnimationFrame = function(a) {
        window.clearTimeout(a)
    });
    var k = getComputedStyle ? function(a) {
            return getComputedStyle(a, null)
        } : function(a) {
            return a.currentStyle
        },
        g = "Webkit Moz ms Ms O".split(" "),
        l = document.documentElement.style;
    window.getStyleProperty = function(a) {
        if (a) {
            if ("string" == typeof l[a]) return a;
            a = a.charAt(0).toUpperCase() + a.slice(1);
            for (var b, c = 0, d = g.length; c < d; c++)
                if (b = g[c] + a, "string" == typeof l[b]) return b
        }
    };
    var m = window.getStyleProperty("transform"),
        n = !!window.getStyleProperty("perspective");
    window.Draggables = {
        isDragging: null
    }, b.prototype.options = {
        helperShowDistance: 8
    }, b.prototype._create = function() {
        this.position = {}, this.size = {}, this._getPosition(), this.startPoint = {
            x: 0,
            y: 0
        }, this.dragPoint = {
            x: 0,
            y: 0
        }, this.startPosition = a({}, this.position), this.enable(), this.setHandles(), this.visible = !1
    }, b.prototype.setHandles = function() {
        this.handles = this.options.handle ? this.element.querySelectorAll(this.options.handle) : [this.element], this.addListenersToHandles()
    }, b.prototype.changeHandles = function(a) {
        this.removeHandlerListeners(), this._unbindEvents(), this.handles = a ? this.element.querySelectorAll(a) : [this.element], this.addListenersToHandles()
    }, b.prototype.addListenersToHandles = function() {
        for (var a, b = 0, c = this.handles.length; b < c; b++) a = this.handles[b], a.addEventListener("mousedown", this), a.addEventListener("touchstart", this), window.navigator.pointerEnabled ? (a.addEventListener("pointerdown", this), a.style.touchAction = "none") : navigator.msMaxTouchPoints && (a.addEventListener("MSPointerDown", this), a.style.msTouchAction = "none")
    }, b.prototype.removeHandlerListeners = function() {
        for (var a = 0, b = this.handles.length; a < b; a++) {
            var c = this.handles[a];
            c.removeEventListener("mousedown", this), c.removeEventListener("touchstart", this), c.removeEventListener("pointerdown", this), c.removeEventListener("MSPointerDown", this)
        }
    }, b.prototype._getPosition = function() {
        var a = k(this.element);
        if ("absolute" === a.position) this.position = {
            x: parseInt(a.left, 10),
            y: parseInt(a.top, 10)
        };
        else {
            var b = this.element.getBoundingClientRect();
            this.position = {
                x: b.left,
                y: b.top
            }
        }
    }, b.prototype._getHelperSize = function() {
        var a = k(this.helper),
            b = parseInt(a.width, 10),
            c = parseInt(a.height, 10);
        this.size.width = isNaN(b) ? 0 : b, this.size.height = isNaN(c) ? 0 : c
    }, b.prototype.handleEvent = function(a) {
        var b = "on" + a.type;
        this[b] && this[b](a)
    }, b.prototype.onmousedown = function(a) {
        var b = a.button;
        b && 0 !== b && 1 !== b || this.dragStart(a, a)
    }, b.prototype.ontouchstart = function(a) {
        this.isDragging || this.dragStart(a, a.changedTouches[0])
    }, b.prototype.onMSPointerDown = b.prototype.onpointerdown = function(a) {
        this.isDragging || this.dragStart(a, a)
    };
    var o = {
        mousedown: ["mousemove", "mouseup"],
        touchstart: ["touchmove", "touchend", "touchcancel"],
        pointerdown: ["pointermove", "pointerup", "pointercancel"],
        MSPointerDown: ["MSPointerMove", "MSPointerUp", "MSPointerCancel"]
    };
    b.prototype.dragStart = function(a, b) {
        if (null !== Draggables.isDragging) {
            if (!Draggables.isDragging.parentNode || Draggables.isDragging.parentNode.contains(Draggables.isDragging)) return;
            Draggables.isDragging = null
        }
        this.isEnabled && (a.preventDefault(), this.options.helper && (this.helper = null), this.isDragging = !0, Draggables.isDragging = this, this.isOver = !1, this.pointerIdentifier = void 0 !== b.pointerId ? b.pointerId : b.identifier, this._getPosition(), c(this.startPoint, b), this.startPosition.x = this.position.x, this.startPosition.y = this.position.y, !this.options.helper && this.options.helperShowDistance && (this.helper = this.element, this.helper.style.position = "absolute", this._getHelperSize(), this.helper.style.zIndex = this.options.zIndex ? this.options.zIndex.toString() : this.helper.style.zIndex, this.setLeftTop()), this.dragPoint.x = 0, this.dragPoint.y = 0, this._bindEvents({
            events: o[a.type],
            node: a.preventDefault ? window : document
        }), !this.options.helper && this.options.helperShowDistance && (this.$element.trigger("dragStart", [this]), $(".droppable").trigger("drag", [this]), this.animate()))
    }, b.prototype._bindEvents = function(a) {
        for (var b = 0, c = a.events.length; b < c; b++) a.node.addEventListener(a.events[b], this);
        this._boundEvents = a
    }, b.prototype._unbindEvents = function() {
        var a = this._boundEvents;
        if (a && a.events) {
            for (var b = 0, c = a.events.length; b < c; b++) a.node.removeEventListener(a.events[b], this, !1);
            this._boundEvents = null
        }
    }, b.prototype._getTouch = function(a) {
        for (var b = 0, c = a.changedTouches.length; b < c; b++)
            if (this.pointerIdentifier === a.changedTouches[b].identifier) return a.changedTouches[b]
    }, b.prototype.onmousemove = function(a) {
        this.dragMove(a, a)
    }, b.prototype.ontouchmove = function(a) {
        var b = this._getTouch(a);
        b && this.dragMove(a, b)
    }, b.prototype.onMSPointerMove = b.prototype.onpointermove = function(a) {
        this.pointerIdentifier === a.pointerId && this.dragMove(a, a)
    }, b.prototype.dragMove = function(a, b) {
        if (!this.isDragging) return !1;
        c(this.dragPoint, b);
        var d = this.dragPoint.x - this.startPoint.x,
            e = this.dragPoint.y - this.startPoint.y;
        this.options.helper && !this.visible && Math.sqrt(d * d + e * e) > this.options.helperShowDistance && (this.helper = this.options.helper ? this.options.helper() : this.element, this.helper.style.position = "absolute", this._getHelperSize(), this.position.x = this.startPosition.x, this.position.y = this.startPosition.y, this.setLeftTop(), this.helper.style.zIndex = this.options.zIndex ? this.options.zIndex.toString() : this.helper.style.zIndex, this.helper.style.display = "block", this.visible = !0, this.$element.trigger("dragStart", [this]), $(".droppable").trigger("drag", [this]), this.animate()), this.position.x = this.startPosition.x + d, this.position.y = this.startPosition.y + e, this.dragPoint.x = d, this.dragPoint.y = e, this.$element.trigger("dragMove", [this])
    }, b.prototype.onmouseup = function(a) {
        this.dragEnd(a, a)
    }, b.prototype.ontouchend = function(a) {
        var b = this._getTouch(a);
        b && this.dragEnd(a, b)
    }, b.prototype.onMSPointerUp = b.prototype.onpointerup = function(a) {
        this.pointerIdentifier === a.pointerId && this.dragEnd(a, a)
    }, b.prototype.dragEnd = function(a, b) {
        return Draggables.isDragging = null, this.isDragging = !1, this.visible = !1, this.pointerIdentifier = null, this._unbindEvents(), !(!this.helper || "none" === this.helper.style.display) && (m && (this.helper.style[m] = "", this.setLeftTop()), this.options.zIndex && this.options.initialZIndex && this.helper && "none" !== this.helper.style.display && (this.helper.style.zIndex = this.options.initialZIndex.toString()), this.options.removeHelper && this.helper.parentNode.removeChild(this.helper), void this.$element.trigger("dragEnd", [this]))
    }, b.prototype.onMSPointerCancel = b.prototype.onpointercancel = function(a) {
        a.pointerId === this.pointerIdentifier && this.dragEnd(a, a)
    }, b.prototype.ontouchcancel = function(a) {
        var b = this._getTouch(a);
        b && this.dragEnd(a, b)
    }, b.prototype.animate = function() {
        if (this.isDragging) {
            this.positionDrag();
            var a = this;
            window.requestAnimationFrame(function() {
                a.animate()
            })
        }
    };
    var p = n ? function(a, b) {
        return "translate3d( " + a + "px, " + b + "px, 0)"
    } : function(a, b) {
        return "translate( " + a + "px, " + b + "px)"
    };
    b.prototype.setLeftTop = function() {
        this.helper.style.left = this.position.x + "px", this.helper.style.top = this.position.y + "px"
    }, b.prototype.positionDrag = m ? function() {
        this.helper.style[m] = p(this.dragPoint.x, this.dragPoint.y)
    } : b.prototype.setLeftTop, b.prototype.enable = function() {
        this.isEnabled = !0
    }, b.prototype.disable = function() {
        this.isEnabled = !1, this.isDragging && this.dragEnd()
    }, b.prototype.destroy = function() {
        this.removeHandlerListeners(), this.$element.off()
    }, window.Draggable = b, window.Droppables = {
        isOverPtr: null
    }, d.prototype.options = {
        tolerance: "intersect"
    }, d.prototype._create = function() {
        this.position = {}, this.size = {}, this._getPosition(), this._getSize(), this.isOver = !1, this.blocker = null, this._listen(), this.element.className += " droppable", this.enabled = !0;
        var a = this;
        this.$element.on("resized", function(b) {
            a._getPosition(), a._getSize()
        })
    }, d.prototype._getPosition = function() {
        var a = k(this.element);
        if ("absolute" === a.position) this.position = {
            x: parseInt(a.left, 10),
            y: parseInt(a.top, 10)
        };
        else {
            var b = this.element.getBoundingClientRect();
            this.position = {
                x: b.left,
                y: b.top
            }
        }
    }, d.prototype._getSize = function() {
        var a = k(this.element),
            b = parseInt(a.width, 10),
            c = parseInt(a.height, 10);
        this.size.width = isNaN(b) ? 0 : b, this.size.height = isNaN(c) ? 0 : c
    }, d.prototype._listen = function() {
        var a = this;
        this.dragEnd = function(b, c) {
            d.prototype._onDragEnd.apply(a, [b, c])
        };
        var b = function(b, c) {
            d.prototype._onDragMove.apply(a, [c, b])
        };
        this.$element.on("drag", function(c, d) {
            return "undefined" != typeof d && "undefined" != typeof d.element && void(a.enabled && (null !== a.blocker && a.blocker === d.helper && (a.blocker = null), a._accept(d.element) && (d.$element.on("dragMove", b), d.$element.one("dragEnd", a.dragEnd))))
        }), this.$element.on("dragEnd", function(b, c) {
            a.element === c.element && a._getPosition()
        })
    }, d.prototype.startListeningToDrag = function(a) {
        var b = this,
            c = function(a, c) {
                d.prototype._onDragMove.apply(b, [c])
            };
        a.$element.on("dragMove", c), a.$element.one("dragEnd", this.dragEnd)
    }, d.prototype._onDragMove = function(a) {
        if (this.enabled) {
            if (null !== Droppables.isOverPtr && Droppables.isOverPtr !== this) return;
            var b = this._checkIntersection(a);
            b ? this._over(a) : this.isOver && this._out(a)
        } else this.destroy()
    }, d.prototype._onDragEnd = function(a, b) {
        if (b.$element.off("dragMove"), null !== this.dragEnd && b.$element.off("dragEnd", this.dragEnd), this.enabled) {
            if (0 == b.dragPoint.x && 0 == b.dragPoint.y) return;
            this.isOver && null === this.blocker && this._drop(b)
        } else this.destroy()
    }, d.prototype._accept = function(a) {
        return (!this.$element.data("ptr") || !this.$element.data("ptr").draggable.isDragging) && (null !== this.$element && (this.element !== a && (!this.options.acceptOne || null === this.blocker || (!this.element.parentNode.contains(this.blocker) || !this._checkIntersection($(this.blocker).data("ptr").draggable)) && (this.blocker = null, !0))))
    }, d.prototype._over = function(a) {
        this.isOver = !0, a.isOver = !0, Droppables.isOverPtr = this, this._trigger("droppableOver", a)
    }, d.prototype._out = function(a) {
        this.isOver = !1, a.isOver = !1, Droppables.isOverPtr = null, this.options.acceptOne && (this.blocker = null), this._trigger("droppableOut", a)
    }, d.prototype._drop = function(a) {
        this.options.acceptOne && (this.blocker = a.helper), Droppables.isOverPtr = null, this._trigger("droppableDrop", a)
    }, d.prototype._trigger = function(a, b) {
        null !== this.$element ? this.$element.trigger(a, [b]) : ($(document).trigger("draggableDroppedFix", [b]), this.destroy())
    }, d.prototype._checkIntersection = function(a) {
        var b = this.position.x,
            c = this.position.y,
            d = b + this.size.width,
            e = c + this.size.height,
            f = a.size.width,
            g = a.size.height,
            h = a.position.x,
            i = h + f,
            j = a.position.y,
            k = j + g;
        return "touch" === this.options.tolerance ? (j >= c && j <= e || k >= c && k <= e || j < c && k > e) && (h >= b && h <= d || i >= b && i <= d || h < b && i > d) : b < h + f / 2 && i - f / 2 < d && c < j + g / 2 && k - g / 2 < e
    }, d.prototype.destroy = function() {
        Droppables.isOverPtr === this && (Droppables.isOverPtr = null), this.enabled = !1, null !== this.$element && (this.$element.off("drag"), this.$element.off("dragMove"), this.$element.off("dragEnd"), this.$element.off("resized"), this.$element.off()), this.$element = null, this.dragEnd = null, this.blocker = null, this.element && this.element.parentNode.removeChild(this.element), this.element = null
    }, window.Droppable = d
}(window),
function() {
    this.templateEngine = function(a, b) {
        var c = "var p=[];with(obj){p.push('" + a.replace(/[\r\t\n]/g, " ").replace(/'(?=[^%]*%>)/g, "\t").split("'").join("\\'").split("\t").join("'").replace(/<%=(.+?)%>/g, "',$1,'").split("<%").join("');").split("%>").join("p.push('") + "');}return p.join('');",
            d = new Function("obj", c);
        return b ? d(b) : d
    }
}();
