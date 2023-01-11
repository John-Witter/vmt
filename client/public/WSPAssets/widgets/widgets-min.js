Array.prototype.includes ||
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(e, t) {
      function n(e, t) {
        return (
          e === t ||
          ('number' == typeof e && 'number' == typeof t && isNaN(e) && isNaN(t))
        );
      }
      if (null === this) throw new TypeError('"this" is null or not defined');
      var o = Object(this),
        a = o.length >>> 0;
      if (0 === a) return !1;
      for (
        var i = 0 | t, l = Math.max(i >= 0 ? i : a - Math.abs(i), 0);
        a > l;

      ) {
        if (n(o[l], e)) return !0;
        l++;
      }
      return !1;
    },
  }),
  String.prototype.endsWith ||
    Object.defineProperty(String.prototype, 'endsWith', {
      value: function(e, t) {
        return (
          (void 0 === t || t > this.length) && (t = this.length),
          this.substring(t - e.length, t) === e
        );
      },
    }),
  String.prototype.includes ||
    (String.prototype.includes = function(e, t) {
      return (
        'number' != typeof t && (t = 0),
        t + e.length > this.length ? !1 : -1 !== this.indexOf(e, t)
      );
    });
var PREF = (function() {
    function e(e, t, n) {
      function o(e) {
        var o = a[e],
          i = o.category,
          l = o.name,
          s = o.sketches,
          r = o.pages;
        if (i && i[0] !== n && 'all' !== i[0]) {
          if ('none' === i[0]) return 'none';
        } else if ('all' === l[0] || l.includes(t)) {
          if (!s || s.includes(c) || s.includes(d) || 'all' === s[0]) {
            if ('string' == typeof r) {
              r = r.split(',');
              for (var u = 0; u < r.length; u++) r[u] = r[u].trim();
            }
            return r;
          }
          if ('none' === s[0]) return 'none';
        } else if ('none' === l[0]) return 'none';
      }
      var i,
        l,
        s = e.focusPage.anchorNode,
        c = s.context.id,
        r = s.data('url') || s.data('delayed-url') || '',
        d = r.match(/([\w\d_-]*)\.?[^\\\/]*$/i)[1];
      n || (n = ''),
        (n = n.toLowerCase()),
        (t = t.toLowerCase()),
        (l = e.getAuthorPreference(t + n));
      for (var u = 0; u < a.length; u++)
        (i = o(u)), 'none' === i ? (l = void 0) : i && (l = i);
      return l;
    }
    function t(e, t, n) {
      var o, a;
      if (!e) return [t];
      for (a = e.toLowerCase().split(','), o = 0; o < a.length; o += 1)
        a[o] = a[o].trim();
      if (1 === a.length && ['all', 'none'].includes(a[0])) return a;
      if (n) for (o = 0; o < a.length; o += 1) a[o] = parseInt(a[o], 10);
      return a;
    }
    function n(e, n, o, a) {
      try {
        (this.category = t(e, 'all')),
          'all' === this.category[0] && (this.category = ['widget, util']),
          (this.name = t(n, 'all')),
          (this.pages = t(a, 'all', !0)),
          (this.sketches = t(o, 'all'));
      } catch (e) {
        throw GSP.createError('bad arguments to WSPPref constructor');
      }
    }
    function o(e) {
      var t, o;
      if (e.constructor === Array)
        for (var i = 0; i < e.length; i++) {
          var l = e[i];
          (t = l.category ? l.category : 'widget, util'),
            (o = l.name ? l.name : 'all'),
            l.widget && ((t = 'widget'), (o = l.widget)),
            a.push(new n(t, o, l.sketches, l.pages));
        }
    }
    var a = [];
    return {
      setWebPagePrefs: function(e) {
        o(e);
      },
      shouldEnableForCurrentPage: function(t, n, o) {
        var a = parseInt(o.metadata.id, 10),
          i = e(o.document, n, t);
        return (
          i === !0 || (Array.isArray(i) && ('all' === i[0] || i.includes(a)))
        );
      },
      getPref: function(t, n, o) {
        return e(t, n, o);
      },
    };
  })(),
  WIDGETS = (function() {
    function e(e, t) {
      return (
        (e.prototype = Object.create(t.prototype)),
        (e.prototype.constructor = e),
        t.prototype
      );
    }
    function t(e, n) {
      if (e === n) return !0;
      if (e && n && 'object' == typeof e && 'object' == typeof n) {
        if (Object.keys(e).length !== Object.keys(n).length) return !1;
        for (var o in e)
          if (e.hasOwnProperty(o) && n.hasOwnProperty(o) && !t(e[o], n[o]))
            return !1;
      }
      return !0;
    }
    function n() {
      return fe ? ge.data('document').sQuery.sketch : void 0;
    }
    function o(e) {
      return $(e).closest('.sketch_canvas')[0];
    }
    function a(e, t) {
      (this.name = e),
        (this.eventName = t),
        (this.domButtonSelector = '#widget_' + e + 'ButtonID'),
        (this.enabled = !0);
    }
    function i(e, t) {
      a.call(this, e, t);
    }
    function l(e) {
      arguments.length && !e
        ? s()
        : (ue.tinyDraggable({ exclude: '.dragExclude' }),
          ue.toggle(!0),
          $('.widget_button').removeClass('widget_button_active'),
          ge
            .parent()
            .find('.widget_button')
            .addClass('widget_button_active'));
    }
    function s() {
      ue && ue.toggle(!1),
        $('.widget_button').removeClass('widget_button_active');
    }
    function c() {
      var e,
        t = $('.sketch_canvas');
      ($e.objectColorBox = $('#objectColorCheckbox')[0]),
        ($e.textColorBox = $('#textColorCheckbox')[0]),
        t.on('LoadDocument.WSP', function(e, t) {
          w(t.document.canvasNode[0]), S(t.document);
        }),
        t.on('UnloadDocument.WSP', function(e, t) {
          he && n() === t.document.focusPage && he.deactivate();
        }),
        t.on('WillUndoRedo.WSP', y),
        t.on('UndoRedo.WSP', m),
        t.on('WillChangeCurrentPage.WSP', y),
        t.on('DidChangeCurrentPage.WSP', m),
        t.each(function(t, n) {
          var o = $(n).data('document');
          w(n), o && (S(o), e || (e = o));
        }),
        e && m({}, { document: e }),
        t.on('keyup', function(e) {
          return 27 === e.keyCode && he ? (he.deactivate(), !0) : void 0;
        });
    }
    function r() {
      var e = $('.wCharDropdownContent .column div');
      $._data(e[0], 'events') ||
        $('.wCharDropdownContent .column div').click(function() {
          te(this.innerText);
        });
    }
    function d(e) {
      var t = e.parentNode,
        n = $(t).find('.widget_button');
      return 1 === n.length ? n : void 0;
    }
    function u(e, t) {
      var a = o(e),
        i = $(a),
        c = i.find('.wsp-tool-column'),
        u = i.data('document'),
        p = u.sQuery.sketch,
        f = d(e),
        g = PREF.getPref(u, 'showWidgetPanelOnPageStart');
      if ('none' === i.css('display') || p === be) return he;
      var b = !1;
      return (
        Fe.forEach(function(e) {
          e.checkEnablingForCurrentPage(p) && (b = !0);
        }),
        f && f.toggle(b),
        b
          ? (he && ((me = he), he.deactivate()),
            Fe.forEach(function(e) {
              e.setEnablingForCurrentPage(p, e);
            }),
            (a !== fe || t) &&
              (fe &&
                (ge.off('WillPlayTool.WSP'),
                ge.off('ToolPlayed.WSP'),
                ge.off('ToolAborted.WSP')),
              (fe = a),
              (ge = $(fe)),
              (be = p),
              pe.detach(),
              i.prepend(pe),
              r(),
              l(),
              ue.css({ top: i.height() - ue.height() + 1 }),
              ue.css(
                c.length
                  ? { left: c[0].offsetWidth - ue[0].offsetWidth + 4 }
                  : { left: -1 }
              ),
              ge.on('WillPlayTool.WSP', function() {
                $('#widget').css({ opacity: 0.25, 'z-index': -1 }),
                  he && ((me = he), WIDGETS.confirmModality());
              }),
              ge.on('ToolPlayed.WSP', function() {
                $('#widget').css({ opacity: 1, 'z-index': 'none' }),
                  me && (me.activate(n()), (me = null));
              }),
              ge.on('ToolAborted.WSP', function() {
                $('#widget').css({ opacity: 1, 'z-index': 'none' });
              }),
              Ee.setVisColor(p),
              l(g)),
            f.show(),
            g && me && me.enabled && me.activate(p, me),
            (me = null),
            b && he)
          : ((fe && a !== fe) || (me || (me = he), he && he.deactivate(), s()),
            !1)
      );
    }
    function p(e) {
      n() !== e && u(e.canvasNode[0]),
        n() === e &&
          he &&
          he.preProcessGobj &&
          (e.sQuery('*').each(function(e, t) {
            he.preProcessGobj(t);
          }),
          (e.isDirty = !0),
          e.setNeedsDisplay());
    }
    function f(e, t) {
      var o = t ? t.sketch : n();
      return p(o), !0;
    }
    function g() {
      return he && he.postProcessSketch && he.postProcessSketch(n()), !0;
    }
    function b() {
      return parseFloat(getComputedStyle($('#widget')[0]).fontSize) / 16;
    }
    function v(e, t) {
      (e.checked = t), (e.src = t ? de + 'checked.png' : de + 'unchecked.png');
    }
    function h(e) {
      return (
        (e.checked = e.checked ? !1 : !0),
        (e.src = e.checked ? de + 'checked.png' : de + 'unchecked.png'),
        e.checked
      );
    }
    function m(e, t) {
      var n = t.document;
      u(n.canvasNode[0], !0);
    }
    function y() {
      he && ((me = he), he.deactivate());
    }
    function w(e) {
      var t,
        n = d(e);
      n &&
        ((t =
          '<button class="widget_button" onclick="WIDGETS.toggleWidgets(this);">Widgets</button>'),
        n.replaceWith(t));
    }
    function S(e) {
      var t, n, o, a;
      (t = e.canvasNode),
        (n = t.parent()),
        n.hasClass('sketch_container') &&
          ((o = t.find('.wsp-base-node')),
          (a = n.find('.wsp-base-node').width()),
          a &&
            (a +=
              parseInt(n.css('border-left-width'), 10) +
              parseInt(n.css('border-right-width'), 10)),
          n.outerWidth(a));
    }
    function k(e) {
      ve && ve && ve !== e && (ve.setRenderState('none'), (ve = null)),
        e && ((ve = e), ve.setRenderState(ye));
    }
    function P(e, t) {
      var n = ge.find("[wsp-id='" + t.id + "']").not('.wsp-sr-only');
      n[0] && (n.css({ color: e }), n.find('*').css({ color: e }));
    }
    function T(e, t) {
      var n = !1,
        o = t || ve;
      if (!o) return !1;
      if (o.isOfKind('Text'))
        (n = o.style.color !== e), n && (o.style.color = e);
      else if (o.isOfKind('Button'))
        (n = o.style.label.color !== e), n && (o.style.label.color = e);
      else if (
        o.style.label &&
        o.style.label.showLabel &&
        (n = o.style.label.color !== e)
      )
        return (
          (o.style.label.color = e),
          (o.sQuery.sketch.renderRefCon.label[o.id].color = e),
          !0
        );
      return n && P(e, o), V(o), n;
    }
    function C() {
      var e,
        t,
        n = ve;
      if (n.oldStyle)
        if (n.isOfKind('Button') || n.isOfKind('Text'))
          (e = n.isOfKind('Text') ? n.oldStyle.color : n.oldStyle.label.color),
            (t = n.isOfKind('Text') ? n.style.color : n.style.label.color);
        else if (n.style.label && n.style.label.showLabel)
          return (
            (n.sQuery.sketch.renderRefCon.label[n.id].color =
              n.style.label.color),
            void n.invalidateAppearance()
          );
      e && t !== e && T(e);
    }
    function L() {
      var e,
        t = Math.floor(Pe / 3);
      switch (Pe - 3 * t) {
        case 0:
          e = 'a';
          break;
        case 1:
          e = 'b';
          break;
        case 2:
          e = 'c';
      }
      return $('.block' + t + e).css('background-color');
    }
    function E(e, t) {
      var n = !1,
        o = t || ve;
      return (
        o &&
          $e.objectColorBox.checked &&
          (o.isOfKind('Text')
            ? (n = T(e, o))
            : (o.setRenderState('none'),
              (n = o.style.color !== e),
              n && ((o.style.color = e), o.invalidateAppearance()),
              o.setRenderState(ye))),
        n
      );
    }
    function x(e) {
      var t = ve;
      (we = e),
        t &&
          t.style.radius &&
          we >= 0 &&
          (t.setRenderState('none'),
          (t.style.radius = Te[we]),
          t.setRenderState(ye),
          t.invalidateAppearance());
    }
    function O(e, t) {
      var n = ve;
      (ke = e),
        (Se = t),
        n &&
          (n.setRenderState('none'),
          n.isOfGenus('Path') && ke >= 0 && (n.style['line-style'] = Ce[ke]),
          n.style.width && Se >= 0 && (n.style.width = Le[Se]),
          n.setRenderState(ye),
          n.invalidateAppearance());
    }
    function _(e) {
      var t = L(e);
      $e.objectColorBox.checked && E(t), $e.textColorBox.checked && T(t);
    }
    function F(e, t) {
      var n = $('#lineStyleCheckbox')[0],
        o = $('#widget_lineStyleSelector')[0].style;
      if (0 > e && 0 > t) v(n, !1), (o.display = 'none');
      else {
        ($e.defaultLineThickness = e), ($e.defaultLineStyle = t), v(n, !0);
        var a = 1.25 * e + 1.31,
          i = 3.2 * t + 0.31;
        (o.top = a + 'rem'), (o.left = i + 'rem'), (o.display = 'block');
      }
      O(t, e);
    }
    function W(e) {
      var t = $('#pointStyleCheckbox')[0],
        n = $('#pointStyleSelector')[0].style;
      if (0 > e) v(t, !1), (n.display = 'none');
      else {
        ($e.defaultPointStyle = e), v(t, !0);
        var o = 1.25 * e + 1.31;
        (n.top = o + 'rem'), (n.display = 'block');
      }
      x(e);
    }
    function j(e, t) {
      var n = $('#widget_colorSelector')[0].style;
      0 > e
        ? ((n.display = 'none'),
          v($e.objectColorBox, !1),
          v($e.textColorBox, !1),
          (Pe = -1))
        : ((Pe = 3 * e + t),
          (n.top = 1.56 * t + 0.13 + 'rem'),
          (n.left = 1.69 * e + 0.1 + 'rem'),
          (n.display = 'block'),
          ($e.defaultColor = { row: t, column: e }),
          $e.textColorBox.checked || v($e.objectColorBox, !0),
          ve && _(Pe));
    }
    function G(e) {
      var t = e.style;
      (t.originalColor = t.color),
        t.label && t.label.color && (t.label.originalColor = t.label.color);
    }
    function D(e) {
      var t = e.style;
      if (t.faded)
        throw GSP.createError(
          'visibilityWidget deleteFadeCache() called for a faded object.'
        );
      t.originalColor &&
        (delete t.originalColor,
        t.label && t.label.color && delete t.label.originalColor,
        delete t.faded);
    }
    function B(e) {
      var t = e.style;
      if (t.faded)
        throw GSP.createError(
          'visibilityWidget fade() called for an already-faded object.'
        );
      e.style.originalColor || G(e),
        t.faded ||
          ((t.color = Ee.visColor),
          t.label && t.label.color && (t.label.color = Ee.visColor),
          P(t.color, e),
          (t.faded = !0),
          e.invalidateAppearance());
    }
    function I(e) {
      var t = e.style;
      if (!t.originalColor || !t.faded)
        throw GSP.createError(
          "visibilityWidget unfade() called for an object that isn't faded."
        );
      (t.color = t.originalColor),
        t.label && t.label.color && (t.label.color = t.label.originalColor),
        P(t.color, e),
        (t.faded = !1),
        e.invalidateAppearance();
    }
    function M() {
      n().labelPool.saveState(), (xe.labelPoolSaved = !0);
    }
    function N() {
      xe.labelPoolSaved &&
        (n().labelPool.restoreSavedState(), (xe.labelPoolSaved = !1));
    }
    function R() {
      xe.labelPoolSaved &&
        (ve.sQuery.sketch.labelPool.forgetSavedState(),
        (xe.labelPoolSaved = !1));
    }
    function U(e) {
      var t = xe.inputElt;
      'string' == typeof e && t.val(e),
        t.focus(),
        t[0].setSelectionRange(0, t.val().length);
    }
    function A(e) {
      var t;
      M(),
        (t = n().labelPool.generateLabel(e.kind, e.genus)),
        e.hasLabel
          ? e.setLabel(t, { showLabel: !0, wasUserInitiated: !0 })
          : (e.label = t),
        U(t);
    }
    function z(e) {
      var t = e.sQuery.sketch,
        n = q(e),
        o = n['font-family'];
      return (
        'number' == typeof o &&
          (o >= t.document.resources.fontList.length && (o = 0),
          (o = t.document.resources.fontList[o]),
          (n['font-family'] = o)),
        o
      );
    }
    function K(e) {
      var t = '';
      return (
        e.genus.includes('Measure')
          ? (t = 'measure')
          : e.genus.includes('Parameter')
          ? (t = 'param')
          : e.useTransformLabel && e.useTransformLabel() && (t = 'transImage'),
        t
      );
    }
    function V(e) {
      var t,
        n,
        o = ge.find("[wsp-id='" + e.id + "']"),
        a = q(e)['font-family'],
        i = q(e)['font-size'],
        l = q(e).color,
        s = e.sQuery.sketch,
        c = s.renderRefCon,
        r = e.hasLabel ? c.label[e.id] : c.gobj[e.id];
      (e.parsedMFS = null),
        e.hasLabel
          ? (J(
              r,
              'invalidateLabel passed a labeled gobj with no renderRefCon.label'
            ),
            (r['font-family'] = a),
            (r['font-size'] = i),
            (n = c.labelBounds[e.id]),
            n && s.invalidateRect(n),
            (e.state.labelPreRenderJITPrepareDone = !1),
            e.labelPreRenderJITPrepare(
              s.dcForGObjLabel(e, 'normal'),
              s.renderRefCon.label[e.id]
            ))
          : ((t = r.css),
            (r = r.baseStyles),
            J(
              1 === o.length,
              'invalidateLabel should find a single matching node.'
            ),
            (t['font-family'] = a),
            (t['font-size'] = i),
            (t.color = l),
            (r['font-family'] = a),
            (r['font-size'] = i),
            (r.color = l),
            o.css({ 'font-size': i, 'font-family': a }),
            $(o)
              .find('[style*="font-family"]')
              .css('font-family', a),
            (e.state.forceDomParse = !0),
            e.descendantLabelGraphHasChanged(),
            xe.showLabelElt.prop(
              'checked',
              'noVisibleName' !== e.style.nameOrigin
            )),
        e.invalidateAppearance();
    }
    function Q(e, t) {
      function n() {
        J(!t, "A button or function shouldn't have a nameOrigin."),
          a.shouldAutogenerateLabel && (a.shouldAutogenerateLabel = !1),
          i && ((e = ' '), U(e)),
          (a.label = e),
          a.messages && (a.messages = []);
      }
      function o() {
        (a.label = e),
          (e = e.replace(/'/g, "\\'")),
          (a.textMFS = "<VL<T'" + e + "'>>");
      }
      var a = ve,
        i = !e || '' === e,
        l = void 0 === a.style.nameOrigin || t === a.style.nameOrigin;
      return (
        e || (e = ''),
        ve.label === e && l
          ? e
          : (i && N(),
            t && (a.style.nameOrigin = t),
            a.hasLabel
              ? ((a.shouldAutogenerateLabel = [
                  'namedByPrime',
                  'namedByShortFn',
                  'namedByFullFn',
                  'namedFromTemplate',
                ].includes(t)),
                i && (e = a.label),
                a.setLabel(e, { showLabel: i ? !1 : !0, wasUserIntiated: !0 }),
                (xe.showLabelElt[0].checked = i ? !1 : !0),
                (e = a.label))
              : a.isOfKind('Button') || a.isOfGenus('Function')
              ? n()
              : 'Caption' === a.genus
              ? o()
              : 'namedFromLabel' === t &&
                (i ? (A(a), (e = a.label)) : (a.label = e)),
            V(a),
            e)
      );
    }
    function H() {
      $('#wLabelPrompt').css('display', 'none'),
        $('#wLabelPane').css('display', 'block');
    }
    function J(e, t) {
      e || t || (t = 'Unidentified error');
    }
    function Y(e) {
      var t = ve,
        n = {},
        o = xe.touchPos,
        a = t.style.label,
        i = a && a.showLabel;
      t.hasLabel && !t.label && A(t),
        void 0 === e &&
          (t.hasLabel
            ? (e = !a.showLabel)
            : xe.nameClass &&
              t.style.nameOrigin &&
              (e = 'noVisibleName' !== t.style.nameOrigin)),
        t.hasLabel
          ? ((a.showLabel = e),
            e &&
              !i &&
              (t.isAPath() &&
                (t.labelRenderBounds ||
                  (t.labelRenderBounds = X(
                    t.sQuery.sketch.renderRefCon.labelBounds[t.id]
                  )),
                xe.isTap &&
                  ((n.x = o.x - t.labelRenderBounds.left),
                  (n.y = o.y - t.labelRenderBounds.top))),
              xe.isTap &&
                ((n = a.labelOffsetX
                  ? {
                      x: -a.labelOffsetX + o.x - t.labelSpec.location.x,
                      y: -a.labelOffsetY + o.y - t.labelSpec.location.y,
                    }
                  : { x: a['font-size'], y: +a['font-size'] / 2 }),
                t.setLabelPosition(o, n)),
              '' === xe.inputElt[0].innerText && U(t.label)))
          : xe.nameClass &&
            t.style.nameOrigin &&
            LabelControls.labelChanged(e ? t.label : ''),
        xe.showLabelElt.prop('checked', e),
        V(t);
    }
    function X(e, t) {
      return (
        t || (t = {}),
        (t.top = e.top),
        (t.bottom = e.bottom),
        (t.left = e.left),
        (t.right = e.right),
        t
      );
    }
    function q(e) {
      var t = e.style.label;
      return (!t || $.isEmptyObject(t)) && (t = e.style), t;
    }
    function Z(e) {
      var t,
        n = z(e);
      return (
        (t = n.substring(0, 1)),
        '"' === t || "'" === t
          ? (n = n.split(t)[1])
          : n.indexOf(',') && (n = n.split(',')[0]),
        n
      );
    }
    function ee() {
      var e,
        t,
        n,
        o = $.makeArray($('script[src]'));
      for (e = 0; e < o.length; e++)
        if (((t = o[e]), t.src && t.src.endsWith('/widgets.js')))
          return (n =
            t.src
              .split('?')[0]
              .split('/')
              .slice(0, -1)
              .join('/') + '/');
    }
    function te(e) {
      var t = '',
        n = '',
        o = xe.inputElt[0],
        a = o.selectionStart,
        i = o.selectionEnd,
        l = o.value;
      a > 0 && (t = l.slice(0, a)),
        i < l.length && (n = l.slice(i)),
        (l = t + e + n),
        WIDGETS.labelChanged(l),
        (o.value = l),
        (i = t.length + e.length),
        o.focus(),
        o.setSelectionRange(i, i);
    }
    function ne(e) {
      return !(
        e.isOfKind('Text') ||
        e.isOfKind('AngleMarker') ||
        e.isOfKind('PathMarker') ||
        e.isOfKind('Button') ||
        e.isOfKind('CoordSys') ||
        e.isOfKind('DOMKind') ||
        e.isOfKind('IterateImage') ||
        e.isOfKind('Map') ||
        e.isOfKind('Picture')
      );
    }
    function oe() {
      var e,
        t,
        n = be.MotionManager.motionList;
      for (e = 0; e < n.length; e++)
        if (((t = be.MotionManager.motionSet[n[e]]), t && 'active' === t.state))
          return !1;
      return !0;
    }
    function ae(e) {
      n()
        .sQuery('*')
        .each(function(t, n) {
          n.style.traced && !n.style.hidden && n.setRenderState(e);
        });
    }
    function ie() {
      !Oe.glowBox.checked || (!oe() && $('#wTraceEnabled')[0].checked)
        ? le('force')
        : ae('unmatchedGiven');
    }
    function le(e) {
      var t = $('#wTraceEnabled')[0].checked,
        n = 'force' === e;
      (t || n) && ae('none');
    }
    function se() {
      ge.on('StartDrag.WSP', le),
        ge.on('EndDrag.WSP', ie),
        ge.on('StartAnimate.WSP', le),
        ge.on('EndAnimate.WSP', ie),
        ge.on('StartMove.WSP', le),
        ge.on('EndMove.WSP', ie);
    }
    function ce() {
      ge.off('StartDrag.WSP'),
        ge.off('EndDrag.WSP'),
        ge.off('StartAnimate.WSP'),
        ge.off('EndAnimate.WSP'),
        ge.off('StartMove.WSP'),
        ge.off('EndMove.WSP');
    }
    function re(e, t) {
      $.each(e, function(e, n) {
        n.setRenderState(t);
      });
    }
    var de,
      ue,
      pe,
      fe,
      ge,
      be,
      ve,
      he,
      me,
      ye = 'fadeInOut',
      we = -1,
      Se = -1,
      ke = -1,
      Pe = -1,
      Te = [1.5, 2, 4, 6],
      Ce = ['solid', 'dashed', 'dotted'],
      Le = [0.5, 1, 3, 5];
    (a.prototype.activate = function(e, t) {
      return (
        he && he !== t && he.deactivate(),
        e.document.isCurrentlyInToolplay()
          ? !1
          : ((he = t),
            (this.active = !0),
            (this.sketch = e),
            $(t.domButtonSelector).addClass('widget_active'),
            $('.widgetPane').on('keyup', function(e) {
              27 === e.keyCode && he.deactivate();
            }),
            !0)
      );
    }),
      (a.prototype.deactivate = function(e) {
        e === he && (he = null),
          (this.active = !1),
          (this.sketch = null),
          $(e.domButtonSelector).removeClass('widget_active'),
          $('.widgetPane').off('keyup');
      }),
      (a.prototype.toggle = function(e, t) {
        this === he ? this.deactivate(t) : this.activate(e, t);
      }),
      (a.prototype.checkEnablingForCurrentPage = function(e) {
        var t;
        return (
          (t = PREF.shouldEnableForCurrentPage('widget', this.name, e)),
          'trace' === this.name && (t = t && e.preferences.tracesEnabled),
          t
        );
      }),
      (a.prototype.setEnablingForCurrentPage = function(e, t) {
        var n = this.checkEnablingForCurrentPage(e);
        return (
          (t.enabled = n),
          n
            ? $(t.domButtonSelector).show()
            : (this === he && t.deactivate(),
              ue.find(t.domButtonSelector).hide()),
          n
        );
      }),
      e(i, a),
      (i.prototype.preProcessGobj = function(e) {}),
      (i.prototype.postProcessGobj = function(e) {}),
      (i.prototype.activate = function(e, t) {
        var n = $('.sketch_canvas'),
          o = e.hasTouchRegimes() && e.currentTouchRegime();
        return Object.getPrototypeOf(this).activate(e, t)
          ? ((n = $('.sketch_canvas')),
            n.on('Tap.WSP', t.handleTap),
            o && 'DisplayRegime' === o.name && o.allowUnselectableTap(!0),
            p(e),
            !0)
          : !1;
      }),
      (i.prototype.deactivate = function(e) {
        var t = n(),
          o = $('.sketch_canvas'),
          a = t.hasTouchRegimes() && t.currentTouchRegime();
        o.off('Tap.WSP', e.handleTap),
          o.off('WillUndoRedo.WSP', g),
          o.off('UndoRedo.WSP', f),
          he && he.postProcessSketch && he.postProcessSketch(this.sketch),
          a && 'DisplayRegime' === a.name && a.allowUnselectableTap(!1),
          Object.getPrototypeOf(this).deactivate(e);
      }),
      (i.prototype.handleTap = function(e, t) {
        var n = o(t.document.canvasNode[0]);
        return n === fe || u(n) ? t.gobj : null;
      });
    var $e = new i('style', 'ChangeStyle');
    ($e.cancelOnExit = !1),
      ($e.defaultColor = { row: 0, column: 1 }),
      ($e.defaultPointStyle = 2),
      ($e.defaultLineThickness = 2),
      ($e.defaultLineStyle = 0);
    var Ee = new i('visibility', 'ChangeVisibility'),
      xe = new i('label', 'ChangeLabel');
    (xe.labelPoolSaved = !1),
      (xe.touchPos = GSP.GeometricPoint(0, 0)),
      (xe.textRule = null);
    var Oe = new i('trace', 'ChangeTraceStatus'),
      _e = new i('delete', 'DeleteGObjs'),
      Fe = [$e, Oe, xe, Ee, _e];
    return (
      (i.prototype.postProcessSketch = function(e) {
        var t = [];
        return (
          he &&
            he.postProcessGobj &&
            (e.sQuery('*').each(function(e, n) {
              he.postProcessGobj(n) && t.push(n);
            }),
            t.length && this.sketch.event(he.eventName, { gobjArr: t }, {}),
            (e.isDirty = !0)),
          !0
        );
      }),
      ($e.activate = function(e) {
        return Object.getPrototypeOf(this).activate(e, this)
          ? ((this.cancelOnExit = !1),
            $('#wStylePane').css('display', 'block'),
            !0)
          : !1;
      }),
      ($e.deactivate = function() {
        Object.getPrototypeOf(this).deactivate(this),
          $('#wStylePane').css('display', 'none'),
          (this.cancelOnExit = !1),
          k(null);
      }),
      ($e.postProcessGobj = function(e) {
        var n = !1,
          o = $e.cancelOnExit;
        return (
          e.oldStyle &&
            (o
              ? ((e.style = jQuery.extend(!0, {}, e.oldStyle)),
                C(),
                e.sQuery.sketch.invalidateAppearance(e))
              : (n = !t(e.oldStyle, e.style)),
            delete e.oldStyle),
          Object.getPrototypeOf($e).postProcessGobj(e),
          n
        );
      }),
      ($e.handleTap = function(e, t) {
        var n;
        (n = Object.getPrototypeOf($e).handleTap(e, t)),
          n &&
            (k(n),
            n.oldStyle || (n.oldStyle = jQuery.extend(!0, {}, n.style)),
            x(we),
            O(ke, Se),
            Pe >= 0 && _(Pe));
      }),
      (Ee.activate = function(e) {
        return Object.getPrototypeOf(this).activate(e, this)
          ? ($('#wVisibilityPrompt').css('display', 'block'), !0)
          : !1;
      }),
      (Ee.deactivate = function() {
        $('#wVisibilityPrompt').css('display', 'none'),
          Object.getPrototypeOf(this).deactivate(this);
      }),
      (Ee.preProcessGobj = function(e) {
        'byUser' === e.style.hidden &&
          (e.show(),
          e.sQuery.sketch.constrainAndRedraw(),
          B(e),
          (e.wasHidden = !0)),
          Object.getPrototypeOf(Ee).preProcessGobj(e);
      }),
      (Ee.postProcessGobj = function(e) {
        var t,
          n,
          o = e.style;
        return (
          o.faded && (e.hide('byUser'), I(e), (t = !0)),
          D(e),
          (n =
            (e.style.hidden && !e.wasHidden) ||
            (!e.style.hidden && e.wasHidden)),
          Object.getPrototypeOf(Ee).postProcessGobj(e),
          e.wasHidden && delete e.wasHidden,
          n
        );
      }),
      (Ee.handleTap = function(e, t) {
        var n = Object.getPrototypeOf(Ee).handleTap(e, t);
        n &&
          (n.style.faded ? I(n) : B(n),
          $('#wVisibilityPrompt').css('display', 'none'));
      }),
      (Ee.setVisColor = function(e) {
        var t = 'rgb(192,192,192)',
          n = e.preferences.colorableComponents.Background.color;
        if (n) {
          var o = document.createElement('div');
          o.style.color = n;
          var a = window.getComputedStyle(o).color;
          if ('rgb' === a.substring(0, 3)) {
            var i = a.split('(')[1].split(')')[0];
            (i = i.split(',')), (t = 'rgb(');
            for (var l = 0; 3 > l; l++)
              (t += i[l] < 128 ? i[l] + 64 : i[l] - 32), 2 > l && (t += ',');
            t += ')';
          }
        }
        Ee.visColor = t;
      }),
      (xe.cacheProperties = function(e) {
        (this.oldLabel = 'Caption' === e.genus ? e.textMFS : e.label),
          (this.oldAutoGenerate = e.shouldAutogenerateLabel),
          z(e),
          (this.oldStyle = $.extend(!0, {}, e.style));
      }),
      (xe.emptyCache = function() {
        (this.oldLabel = null), (this.oldStyle = null);
      }),
      (xe.clear = function(e) {
        this.emptyCache(),
          R(),
          U(''),
          $('#measureButtons, #transImageButtons, #paramButtons').toggle(!1),
          e !== !1 &&
            (xe.sizeElt.val(''),
            xe.fontElt.val(''),
            xe.showLabelElt.prop('checked', !1));
      }),
      (xe.finalizeLabel = function() {
        function e(e) {
          var n = 'Caption' === e.genus ? e.textMFS : e.label,
            a =
              n !== o.oldLabel ||
              o.oldAutoGenerate !== e.shouldAutogenerateLabel ||
              !t(o.oldStyle, e.style);
          a && o.sketch.event(o.eventName, { gobj: e }, {});
        }
        var n,
          o = this;
        ve &&
          (e(ve),
          ve.hasLabel &&
            ve.style.nameOrigin &&
            ((n = LabelControls.originFromText(ve.label)),
            n && ve.style.nameOrigin !== n && (ve.style.nameOrigin = n)),
          delete this.oldLabel,
          delete this.oldAutoGenerate,
          delete this.oldStyle);
      }),
      (xe.restoreLabel = function(e) {
        e &&
          (e.style && (e.style = $.extend(!0, {}, xe.oldStyle)),
          'Caption' === e.genus
            ? ((e.textMFS = xe.oldLabel), delete e.label)
            : xe.oldLabel
            ? ((e.label = xe.oldLabel ? '' : ' '),
              Q(xe.oldLabel, e.style.nameOrigin),
              (e.shouldAutogenerateLabel = xe.oldAutoGenerate))
            : (delete e.label,
              (e.shouldAutogenerateLabel = xe.oldAutoGenerate)),
          N(),
          V(e)),
          this.emptyCache();
      }),
      (xe.handleTap = function(e, t) {
        function n() {
          function e() {
            function e() {
              function e(e) {
                var t = { init: !0 };
                return (
                  (s.style.nameOrigin === e ||
                    (!l.label && 'namedFromLabel' !== s.style.nameOrigin)) &&
                    (t.create = !0),
                  s.makeParentalLabel(e, t)
                );
              }
              var t, n, o, l;
              (s.isTransformationConstraint || s.state.labelParent) &&
                ((l = s.isTransformationConstraint
                  ? s.parents.source
                  : s.state.labelParent),
                (t = e('namedByPrime')),
                (n = e('namedByShortFn')),
                (o = e('namedByFullFn'))),
                (i[t] = 'namedByPrime'),
                (i[n] = 'namedByShortFn'),
                (i[o] = 'namedByFullFn'),
                (i['*'] = s.label ? 'namedFromLabel' : 'namedByPrime'),
                (a.namedByPrime = t),
                (a.namedByShortFn = n),
                (a.namedByFullFn = o),
                (a.namedFromLabel = s.label ? s.label : t),
                s.label
                  ? (s.style.nameOrigin = i[s.label] || 'namedFromLabel')
                  : ((s.label = t), (s.style.nameOrigin = 'namedByPrime'));
            }
            function t() {
              (a = {
                namedFromTemplate: '',
                noVisibleName: '',
                namedFromLabel: '*',
              }),
                (i = { ' ': 'noVisibleName', '*': 'namedFromLabel' });
            }
            var n,
              o = xe.nameClass,
              a = {},
              i = {};
            if (
              ((n = p && K(d) === o ? d : s), $('.wLabelRadios').toggle(!1), o)
            ) {
              switch (($('#' + o + 'Buttons').toggle(!0), o)) {
                case 'transImage':
                  e(),
                    xe.handleTap &&
                      n &&
                      K(n) === o &&
                      'namedFromLabel' !== n.style.nameOrigin &&
                      (s.style.nameOrigin = n.style.nameOrigin);
                  break;
                case 'measure':
                case 'param':
                  t();
              }
              LabelControls.init(
                o,
                ve,
                WIDGETS.controlCallback,
                a,
                i,
                '#wLabelEditText',
                '#' + o + "Buttons input[type='radio']",
                '#wLabelShow'
              );
            } else LabelControls.terminate();
          }
          function t() {
            var e = c.val();
            e && xe.setFontSize(e), (e = r.val()), e && xe.setFont(e);
          }
          function n(e) {
            var t,
              n = !1;
            for (t = 0; t < r[0].length; t++)
              if (r[0][t].innerText === e) {
                (r[0].selectedIndex = t), (n = !0);
                break;
              }
            return n;
          }
          function o(e, t) {
            var n,
              o,
              a,
              i = $('#wLabelFont optgroup'),
              l = "<option value='" + e + "'>" + t + '</option>',
              s = i.filter('[label="Sans Serif"]'),
              c = i.filter('[label="Serif"]'),
              d = i.filter('[label="Mono-spaced"]'),
              u = i.filter('[label="Other"]'),
              p = !1;
            for (
              o = e.search(/sans-serif/i)
                ? s
                : e.search(/serif/i)
                ? c
                : e.search(/monospace/i)
                ? d
                : u.length
                ? u
                : r.append('<optgroup label="Other"></optgroup>'),
                a = $(o).find('option'),
                n = 0;
              n < a.length;
              n++
            )
              if (-1 === t.localeCompare(a[n].innerText)) {
                $(a[n]).before($(l)), (p = !0);
                break;
              }
            p || o.append(l);
          }
          function a() {
            var e = q(ve),
              t = e['font-size'];
            if ((c.val(t), (r[0].selectedIndex = -1), (t = Z(ve, !1)), !t))
              throw GSP.createError(
                'WIDGETS.copyGObjToStyles() found a gobj without a font family.'
              );
            n(t) || (o(e['font-family'], t), n(t));
          }
          function i(e, t) {
            var n;
            return (
              (n = e && t && e.hasLabel === t.hasLabel),
              (n =
                n &&
                (t.hasLabel ||
                  e.kind === t.kind ||
                  (e.isOfKind('Measure') && t.isOfKind('Measure')))),
              (n = n && (xe.isTap || !t.hasLabel || !t.style.label.showLabel))
            );
          }
          function l() {
            var e,
              t = u.textMFS,
              n = t.match(/<T\'[^\'\r\n]+\'>/g),
              o = '';
            for (e = 0; e < n.length; e++)
              o && (o += ' '), (o += n[e].replace(/<T\'([^\'\r\n]+)\'>/, '$1'));
            return o;
          }
          var s, d, p, f;
          (f = !1),
            'Caption' !== u.genus || u.label
              ? 'CompositeText' === u.genus && (f = !0)
              : (u.label = l()),
            $('#wLabelEditText').prop('disabled', f),
            $('#wLabelEditLabel').prop('disabled', f),
            u.hasLabel || u.style.nameOrigin
              ? $('#wShowLabelButton label').show()
              : $('#wShowLabelButton label').hide(),
            (s = u),
            (d = ve),
            (p = i(d, s)),
            xe.clear(!1),
            ve && ve.setRenderState('none'),
            u.setRenderState('targetHighlit'),
            (this.prevGobj = ve),
            (ve = u),
            (xe.nameClass = K(ve)),
            xe.cacheProperties(ve),
            s.hasLabel &&
              !s.style.label.showLabel &&
              ((s.labelRenderBounds = X(
                s.sQuery.sketch.renderRefCon.labelBounds[s.id]
              )),
              s.setLabelPosition(xe.touchPos, { x: 0, y: 0 })),
            U(ve.label),
            p ? t() : a(),
            e();
        }
        function o() {
          s.prop('disabled', !1), Y(!0), s.prop('checked', !0);
        }
        function a() {
          var e = ve.style.nameOrigin,
            t = ve.isOfKind('Button'),
            n = 'measure' === xe.nameClass || 'param' === xe.nameClass,
            o = t || 'undefined' == typeof e,
            a = o || 'namedFromLabel' === e;
          t
            ? (s.prop('checked', a), s.prop('disabled', o))
            : n &&
              ($('#wLabelPane .radio-inline input').prop('checked', !1),
              $("#wLabelPane .radio-inline input[value='" + e + "']").prop(
                'checked',
                !0
              ),
              s.prop('checked', 'noVisibleName' !== e),
              s.prop('disabled', !1));
        }
        function i(e) {
          var t = e.match(/<VL<T\'.*\'>>/);
          return t || (t = e.match(/<T\'.*\'>/)), t ? !0 : !1;
        }
        var l = xe.inputElt,
          s = xe.showLabelElt,
          c = xe.sizeElt,
          r = xe.fontElt,
          d = GSP.GeometricPoint(t.position.x, t.position.y),
          u = Object.getPrototypeOf(xe).handleTap(e, t);
        if (
          ((xe.touchPos = d),
          (xe.isTap = !0),
          u.canEditLabel() || ('Caption' === u.genus && i(u.textMFS)))
        ) {
          if ((H(), u === ve))
            return ve.hasLabel && (Y(), U(ve.label)), void (xe.isTap = !1);
          xe.finalizeLabel(),
            n(),
            ve.hasLabel ? o() : a(),
            l.on('keyup', function(e) {
              if ((e.stopPropagation(), 13 === e.keyCode)) xe.deactivate();
              else if (27 === e.keyCode)
                (xe.cancelOnExit = !0), xe.deactivate();
              else {
                var t = l.val();
                t.length > 0 ? Q(t) : ve.isOfKind('Button') && U(' ');
              }
            }),
            (xe.isTap = !1);
        }
      }),
      (xe.activate = function(e) {
        return Object.getPrototypeOf(this).activate(e, this)
          ? ((this.cancelOnExit = !1),
            (ve = null),
            (this.prevGobj = null),
            $('#wLabelPane').css('display', 'none'),
            $('#wLabelPrompt').css('display', 'block'),
            this.inputElt ||
              ((this.inputElt = $('#wLabelEditText')),
              (this.showLabelElt = $('#wLabelShow')),
              (this.sizeElt = $('#wLabelFontSize')),
              (this.fontElt = $('#wLabelFont'))),
            this.inputElt.on('click', function() {
              $(this).focus();
            }),
            this.clear(),
            !0)
          : !1;
      }),
      (xe.deactivate = function() {
        ve &&
          (ve.setRenderState('none'),
          this.cancelOnExit ? this.restoreLabel(ve) : this.confirmLabel()),
          this.clear(),
          Object.getPrototypeOf(this).deactivate(this),
          $('#wLabelContent').css('display', 'none'),
          $('#wLabelPane').css('display', 'none'),
          $('#wLabelPrompt').css('display', 'none'),
          (this.cancelOnExit = !1);
      }),
      (xe.confirmLabel = function() {
        this.finalizeLabel(), this.clear();
      }),
      (xe.setFontSize = function(e) {
        var t = q(ve);
        (e = +e), t['font-size'] !== e && ((t['font-size'] = e), V(ve));
      }),
      (xe.setFont = function(e) {
        var t = q(ve),
          n = t['font-family'];
        n !== e && ((t['font-family'] = e), V(ve));
      }),
      (xe.postProcessSketch = function(e) {
        xe.clear(),
          $('#wLabelPane').css('display', 'none'),
          $('#wLabelPrompt').css('display', 'block'),
          (ve = null),
          Object.getPrototypeOf(xe).postProcessSketch(e);
      }),
      (Oe.setGlowing = function() {
        Oe.glowBox.checked ? (se(), ie()) : (ce(), le('force'));
      }),
      (Oe.toggleEnabling = function(e) {
        var t = void 0 !== e ? e : $('#wTraceEnabled')[0].checked;
        (n().preferences.tracesEnabled = t),
          $('#wTraceEnabled').prop('checked', t),
          $('#wTracePrompt').css('display', 'none'),
          ie();
      }),
      (Oe.toggleFading = function() {
        var e = n(),
          t = e.preferences,
          o = $('#wTraceFading')[0].checked;
        (t.fadeTraces = o),
          o
            ? ((e.traces.fadeStartTime = Date.now()), e.startFadeJob())
            : e.stopFadeJob(),
          $('#wTracePrompt').css('display', 'none');
      }),
      (Oe.activate = function(e) {
        return (
          (Oe.glowBox = $('#wTracesGlowing')[0]),
          Object.getPrototypeOf(this).activate(e, this)
            ? ($('#wTracePrompt').css('display', 'block'),
              $('#wTraceEnabled').prop(
                'checked',
                n().preferences.tracesEnabled
              ),
              $('#wTraceFading').prop('checked', n().preferences.fadeTraces),
              (this.cancelOnExit = !1),
              $('#wTracePane').css('display', 'block'),
              Oe.setGlowing(),
              (Oe.autoEnabled = !1),
              !0)
            : !1
        );
      }),
      (Oe.deactivate = function() {
        Oe.glowBox.checked && le('force'),
          Object.getPrototypeOf(this).deactivate(this),
          $('#wTracePane').css('display', 'none'),
          (this.cancelOnExit = !1);
      }),
      (Oe.signalChangedTraceState = function(e) {
        function t() {
          var e = n().canvasNode.css('backgroundColor'),
            t = e.match(/rgba\(.*,.*,.*,\s*(.*)\)/);
          return t && t[1] && '0' === t[1] ? 'white' : e;
        }
        var o = e.state.renderState,
          a = e.style.color;
        e.style.traced
          ? (e.setRenderState('targetHighlit'),
            setTimeout(function() {
              e.setRenderState(o);
            }, 500))
          : e.isOfKind('Point')
          ? (e.hide(),
            setTimeout(function() {
              e.show();
            }, 500))
          : ((e.style.color = t()),
            e.style.width && (e.style.width += 1),
            e.invalidateAppearance(),
            setTimeout(function() {
              (e.style.color = a),
                e.style.width && (e.style.width -= 1),
                e.invalidateAppearance();
            }, 500));
      }),
      (Oe.handleTap = function(e, t) {
        var n,
          o,
          a = Object.getPrototypeOf(Oe).handleTap(e, t);
        ne(a) &&
          a &&
          ((n = a.style),
          (n.traced = !n.traced),
          (o = 'tracing ' + (n.traced ? 'on' : 'off')),
          Oe.sketch.event(Oe.eventName, { gobj: a }, { 'new status': o }),
          n.traced
            ? (Oe.autoEnabled || (Oe.toggleEnabling(!0), (Oe.autoEnabled = !0)),
              Oe.glowBox.checked && a.setRenderState('unmatchedGiven'))
            : a.setRenderState('none'),
          $('#wTracePrompt').css('display', 'none'),
          Oe.glowBox.checked || Oe.signalChangedTraceState(a));
      }),
      (_e.deleteProgeny = function() {
        var e,
          t = this.sketch,
          n = t.document.getRecentChangesDelta();
        t.gobjList.removeGObjects(_e.progenyList, t),
          (e = t.document.pushConfirmedSketchOpDelta(n)),
          t.document.changedUIMode(),
          this.sketch.event(
            this.eventName,
            { 'deleted gobjs': _e.progenyList },
            { delta: e }
          );
      }),
      (_e.activate = function(e) {
        return Object.getPrototypeOf(this).activate(e, this)
          ? ((this.cancelOnExit = !1),
            $('#wDeletePrompt').css('display', 'block'),
            !0)
          : !1;
      }),
      (_e.deactivate = function() {
        Object.getPrototypeOf(this).deactivate(this),
          $('#wDeletePrompt').css('display', 'none'),
          (this.cancelOnExit = !1);
      }),
      (_e.handleTap = function(e, t) {
        var n = Object.getPrototypeOf(_e).handleTap(e, t),
          o = $('#delete-confirm-modal'),
          a = o.find('.util-popup-content');
        n &&
          ((_e.progenyList = n.sQuery.sketch.gobjList.compileDescendants(n)),
          re(_e.progenyList, 'targetHighlit'),
          o.css('display', 'block'),
          a.tinyDraggable({ exclude: '.dragExclude' }),
          $('#deleteCancel').focus());
      }),
      (_e.deleteConfirm = function() {
        $('#delete-confirm-modal').css('display', 'none'),
          _e.deleteProgeny(),
          delete _e.progenyList;
      }),
      (_e.deleteCancel = function() {
        $('#delete-confirm-modal').css('display', 'none'),
          re(_e.progenyList, 'none'),
          delete _e.progenyList;
      }),
      {
        initWidget: function() {
          function e(e) {
            $('#widget') && $('#widget').remove(),
              $('body').append(e),
              (pe = $(
                "<div style='position: relative; height:0; width:100%;'></div>"
              )),
              $('body').append(pe),
              (ue = $('#widget')),
              ue.detach(),
              pe.append(ue),
              ue.css('display', 'none'),
              c(),
              $('#widget img').attr('src', function(e, t) {
                var n = t.match(/[^\/]+$/);
                return de + n;
              });
          }
          (de = ee()),
            e(
              '<div id="widget" class="clearfix">		<div id="widget_control" class="widget_controlWidth">			<div class="widget_handle"></div>			<button id="widget_styleButtonID" class="widget_controlButton widgettip" onclick="WIDGETS.toggleStyleModality();"><span class="widgettiptext">Style Widget</span><img class="widget_controlIcon" src="./widgets/style-icon.png"></button>			<button id="widget_traceButtonID" class="widget_controlButton widgettip" onclick="WIDGETS.toggleTraceModality();"><span class="widgettiptext">Trace Widget</span><img class="widget_controlIcon" src="./widgets/trace-icon.png"></button>			<button id="widget_labelButtonID" class="widget_controlButton widgettip" onclick="WIDGETS.toggleLabelModality();"><span class="widgettiptext">Label Widget</span><img class="widget_controlIcon" src="./widgets/label-icon.png"></button>			<button id="widget_visibilityButtonID" class="widget_controlButton widgettip" onclick="WIDGETS.toggleVisibilityModality();"><span class="widgettiptext">Visibility Widget</span><img class="widget_controlIcon" src="./widgets/visibility-icon.png"></button>			<button id="widget_deleteButtonID" class="widget_controlButton widgettip" onclick="WIDGETS.toggleObjectModality();"><span class="widgettiptext">Delete Widget</span><img class="widget_controlIcon" src="./widgets/delete-icon.png"></button>		</div>		<div id="wStylePane">			<div class="widgetPane widget_pointPaneWidth">				<img id="pointStyleCheckbox" class="style_paneCheckbox" onclick="WIDGETS.pointCheckClicked(event);" src="./widgets/unchecked.png">				<div class="style_paneBackground  widget_pointImgWidth"></div>				<img class="style_paneContent widget_pointImgWidth" onclick="WIDGETS.pointGridClicked(event);" src="./widgets/pointstyle-grid.png">				<div id="pointStyleSelector" class="style_paneSelector">&nbsp;</div>			</div>			<div id="widget_lineStylePane" class="widgetPane">				<img id="lineStyleCheckbox" class="style_paneCheckbox" onclick="WIDGETS.lineCheckClicked(event);" src="./widgets/unchecked.png">				<div class="style_paneBackground widget_lineStyleWidth"></div>				<img class="style_paneContent widget_lineStyleWidth" onclick="WIDGETS.lineGridClicked(event);" src="./widgets/linestyle-grid.png">				<div id="widget_lineStyleSelector" class="style_paneSelector">&nbsp;</div>			</div>			<div id="widget_colorPane" class="widgetPane">				<img id="objectColorCheckbox" class="style_paneCheckbox" onclick="WIDGETS.colorCheckClicked(event);" src="./widgets/unchecked.png">				<img class="widget_colorIcon" src="./widgets/object-icon.png">				<img id="textColorCheckbox" class="style_paneCheckbox" onclick="WIDGETS.labelCheckClicked(event);" src="./widgets/unchecked.png">				<img class="widget_colorIcon" src="./widgets/text-icon.png">				<div id="widget_colorGrid" class="style_paneBackground" onclick="WIDGETS.colorGridClicked(event);">					<div class="widget_color_column" style="left:0px;">						<div class="block0a"></div>						<div class="block0b"></div>						<div class="block0c"></div>					</div>					<div class="widget_color_column" style="left:27px;">						<div class="block1a"></div>						<div class="block1b"></div>						<div class="block1c"></div>					</div>					<div class="widget_color_column" style="left:54px;">						<div class="block2a"></div>						<div class="block2b"></div>						<div class="block2c"></div>					</div>					<div class="widget_color_column" style="left:81px;">						<div class="block3a"></div>						<div class="block3b"></div>						<div class="block3c"></div>					</div>					<div class="widget_color_column" style="left:108px;">						<div class="block4a"></div>						<div class="block4b"></div>						<div class="block4c"></div>					</div>					<div class="widget_color_column" style="left:135px;">						<div class="block5a"></div>						<div class="block5b"></div>						<div class="block5c"></div>					</div>					<div class="widget_color_column" style="left:162px;">						<div class="block6a"></div>						<div class="block6b"></div>						<div class="block6c"></div>					</div>					<div class="widget_color_column" style="left:189px;">						<div class="block7a"></div>						<div class="block7b"></div>						<div class="block7c"></div>					</div>					<div class="widget_color_column" style="left:216px;">						<div class="block8a"></div>						<div class="block8b"></div>						<div class="block8c"></div>					</div>					<div id="widget_colorSelector" class="style_paneSelector">&nbsp;					</div>				</div>			</div>			<div class="widgetPane wDismissPane">				<img class="wDismissButton confirm_button" onclick="WIDGETS.confirmModality();" src="./widgets/confirm.png">				<img class="wDismissButton cancel_button" onclick="WIDGETS.cancelModality();" src="./widgets/cancel.png">			</div>		</div>				<div id="wTracePane">			<div class="wTraceControls widgetPane">				Tracing:<br>				<label>					<input type="checkbox" id="wTraceEnabled" value="off" onClick="WIDGETS.toggleTraceEnabling ()"> Enabled				</label>				<label>					<input type="checkbox" id="wTraceFading" value="off" onClick="WIDGETS.toggleTraceFading ();"> Fading				</label><br>				<button type="button" id="wEraseTraces" onClick="WIDGETS.clearTraces();">Erase Traces</button><br>				<label>					<input type="checkbox" id="wTracesGlowing" onClick="WIDGETS.setTraceGlowing ();"> Traced Objects Glow				</label>			</div>			<div id="wTracePrompt" class="widgetPane wPrompt" onclick="this.style.display = \'none\';">				Tap an object to turn its tracing on<br>				or off. Check <em>Traced Objects Glow</em><br>				to show what is being traced.			</div>		</div>				<div id="wLabelPane">			<div class="wLabelControls widgetPane">				<div>					<div class="labelCombo labelSizeCombo">						<select class="labelFontSize dragExclude" onchange="this.nextElementSibling.value=this.value; WIDGETS.labelSetFontSize (this.value);">								<option value=""> </option>								<option value="9">9</option>								<option value="10">10</option>								<option value="12">12</option>								<option value="14">14</option>								<option value="16">16</option>								<option value="18">18</option>								<option value="24">24</option>								<option value="36">36</option>						</select>						<input id="wLabelFontSize" class="labelFontSize dragExclude" type="text" name="labelFontSize" value="" oninput="WIDGETS.labelSetFontSize (this.value);" onchange="WIDGETS.labelSetFontSize (this.value);"/>					</div>					<div class="labelCombo labelFontCombo">						<select id="wLabelFont" class="input labelFont dragExclude"  onchange="WIDGETS.labelSetFont (this.value);">							<optgroup label="Sans Serif">								<option value="Arial, Helvetica, sans-serif">Arial</option>								<option value="\'Comic Sans MS\', cursive, sans-serif">Comic Sans MS</option>								<option value="Impact, Charcoal, sans-serif">Impact</option>								<option value="\'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif">Lucida Sans Unicode</option>								<option value="Tahoma, Geneva, sans-serif">Tahoma</option>								<option value="\'Trebuchet MS\', Helvetica, sans-serif">Trebuchet MS</option>								<option value="Verdana, Geneva, sans-serif">Verdana</option>							</optgroup>							<optgroup label="Serif">								<option value="Garamond, serif">Garamond</option>								<option value="Georgia, serif">Georgia</option>								<option value="Palatino, \'Palatino Linotype\', \'Book Antiqua\', serif">Palatino</option>								<option value="\'Times New Roman\', Times, serif">Times New Roman</option>							</optgroup>							<optgroup label="Mono-spaced">								<option value="Courier, \'Courier New\', monospace">Courier</option>								<option value="Monaco, \'Lucida Console\', monospace">Monaco</option>							</optgroup>						</select>										</div>									<div class="wCharDropdown">						<div class="wCharDropbtn">							<span class="caret"></span> 						</div>						<div class="wCharDropdownContent dragExclude">							<div class="column">								<div>△</div>								<div>⟂</div>								<div>‖</div>								<div>∠</div>								<div>⊙</div>								<div>°</div>								<div>≅</div>								<div>≈</div>								<div>≠</div>								<div>≤</div>								<div>≥</div>								<div>∼</div>							</div>							<div class="column">								<div>&pi;</div>								<div>&theta;</div>								<div>&alpha;</div>								<div>&beta;</div>								<div>&gamma;</div>								<div>&delta;</div>								<div>&epsilon;</div>								<div>&phi;</div>								<div>&tau;</div>								<div>Δ</div>								<div>&Sigma;</div>								<div>&Pi;</div>							</div>							<div class="column">								<div>–</div>								<div>·</div>								<div>±</div>								<div>÷</div>								<div>∫</div>								<div>•</div>								<div>→</div>								<div>⇒</div>								<div>∴</div>								<div>∃</div>								<div>∀</div>								<div>∞</div>							</div>						</div>					</div>				</div>				<div>					<span id="wLabelEditLabel">Label: </span><br>					<input id="wLabelEditText" class="dragExclude" oninput="WIDGETS.labelChanged (this.value);"><br>				</div>				<div id="wShowLabelButton">					<label><input id="wLabelShow" type="checkbox" onclick="WIDGETS.labelToggled(this.checked);"> Show Label</label> &nbsp; &nbsp;				</div>			</div>						<div id="measureButtons" class="widgetPane wNameOrigin3 wLabelRadios">				<label class="radio-inline " >					<input type="radio" name="measureStyle" value="namedFromTemplate"> Auto				</label>				<br>				<label class="radio-inline" >					<input type="radio" name="measureStyle" value="namedFromLabel"> Manual				</label>				<br>				<label class="radio-inline" >					<input type="radio" name="measureStyle" value="noVisibleName"> None				</label>			</div>			<div id="paramButtons" class="widgetPane wNameOrigin2 wLabelRadios">				<label class="radio-inline" >					<input type="radio" name="measureStyle" value="namedFromLabel"> Manual				</label>				<br>				<label class="radio-inline" >					<input type="radio" name="measureStyle" value="noVisibleName"> None				</label>			</div>			<div id="transImageButtons" class="widgetPane wNameOrigin4 wLabelRadios">				<label class="radio-inline">					<input type="radio" name="notationStyle" value="namedByPrime"> Prime				</label>				<br>				<label class="radio-inline">					<input type="radio" name="notationStyle" value="namedByShortFn"> Short				</label>				<br>				<label class="radio-inline">					<input type="radio" name="notationStyle" value="namedByFullFn"> Full				</label>				<br>				<label class="radio-inline">					<input type="radio" name="notationStyle" value="namedFromLabel"> Manual				</label>			</div>			<div class="widgetPane wDismissPane">				<img class="wDismissButton confirm_button" onclick="WIDGETS.confirmModality();" src="./widgets/confirm.png">				<img class="wDismissButton cancel_button" onclick="WIDGETS.cancelModality();" src="./widgets/cancel.png">			</div>		</div>		<div id="wLabelPrompt" class="widgetPane wPrompt">Tap an object or label to show or change			<br>the label. Tap again to hide the label.			<br>Tap one label, then another, to copy the style.		</div>			<div id="wVisibilityPrompt" class="widgetPane wPrompt" onclick="this.style.display = \'none\';">				Hidden objects appear faded (gray).<br>				Tap an object to change its visibility.<br>				Tap the visibility icon (<img src="./widgets/visibility-icon.png" id="wVisIcon">) when done.			</div>		<div id="wDeletePrompt" class="widgetPane wPrompt">Tap an object to delete it			<br>along with all the objects			<br>that depend on it.		</div>	</div>	<div class="util-popup" id="delete-confirm-modal">	<div class="util-popup-content">		<div class="util-popup-title">Delete Highlighted Objects?</div>		<div class = "util-popup-legend">All highlighted objects will be deleted.</div>		<div class="clearfix"></div>		<input type="button" id="deleteConfirm" class="close util-popup-button dragExclude" onclick="WIDGETS.deleteConfirm();" value="Delete" />		<input type="button" id="deleteCancel" class="close util-popup-button dragExclude" onclick="WIDGETS.deleteCancel();" value="Cancel" />		<div class="clearfix"></div>	</div></div><div class="util-popup" id="download-modal">	<div class="util-popup-content clearfix">		<div class="util-popup-title">Download Sketch File</div>		<p class = "util-popup-legend">The file will be stored with your Downloads.</p>		<p class = "util-popup-legend">The filename must end with ".json" or "-json.js".</p>		<div class="util-div-fname">			<label for="util-fname">Name: </label>			<input id = "util-fname" type="text" placeholder="file name (no spaces)" required         pattern="^[a-zA-Z0-9](?:[a-zA-Z0-9-\\._]*)(-json\\.js|\\.json)$" title="Must end with \'.json\' or \'-json.js\'        oninput="UTILMENU.checkFName(this.validity);"/>			<span class="validity"></span>		</div>		<input type="button" id="downloadOK" class="close util-popup-button" value="OK" disabled />		<input type="button" class="close util-popup-button" value="Cancel" onclick="UTILMENU.closeModal (\'download-modal\', \'cancel\');" />	</div></div><div class="util-popup" id="upload-modal">	<div class="util-popup-content">		<div class="util-popup-title">Upload New Sketch</div>		<p class = "util-popup-legend">Your sketch has unsaved changes. Do you want to download it first, before uploading a new sketch?</p><br>		<div class="util-popup-button">			<input type="button" id="downloadBeforeUpload" class="close util-popup-button" value="Download this sketch" onclick="UTILMENU.closeModal (\'upload-modal\', \'save\');"/>			<input type="button" class="close util-popup-button" value="Upload new sketch" onclick="UTILMENU.closeModal (\'upload-modal\', \'dont-save\');" />			<input type="button" class="close util-popup-button" value="Cancel" onclick="UTILMENU.closeModal (\'upload-modal\', \'cancel\');" />		</div>	</div></div><input type="file" id="file-name-input" accept=".json,.js" /><br><a id="downloadLink" href="" download="">Download</a><br>'
            );
        },
        showWidgets: function(e, t) {
          if (!ue && e)
            throw GSP.createError('showWidgets called before loading $widget.');
          return e
            ? void (
                (t && (u(t), fe !== t)) ||
                ((fe || !e) &&
                  (e
                    ? (l(), me && (me.activate(n(), me), (me = null)))
                    : (he && ((me = he), he.deactivate()), s())))
              )
            : void s();
        },
        relatedSketchNode: function(e, t) {
          for (var n = $(e), o = n.filter(t); n.length && !o.length; )
            (o = n.prevAll(t)), (n = n.parent());
          if (!o.length)
            throw GSP.createError(
              "relatedSketchNode() couldn't find the target: " + t
            );
          return o[0];
        },
        toggleWidgets: function(e) {
          var t = 'none' === ue.css('display'),
            n = WIDGETS.relatedSketchNode(e, '.sketch_canvas');
          if (!n)
            throw GSP.createError(
              "toggleWidgets called for an element that's neither a sketch_canvas nor a widget_button"
            );
          return n !== fe && (t = !0), WIDGETS.showWidgets(t, n), t;
        },
        confirmModality: function() {
          he && ((he.cancelOnExit = !1), he.deactivate());
        },
        cancelModality: function() {
          he && ((he.cancelOnExit = !0), he.deactivate());
        },
        toggleStyleModality: function() {
          he === $e ? $e.deactivate(this) : $e.activate(n(), $e);
        },
        toggleVisibilityModality: function() {
          he === Ee
            ? Ee.deactivate(Ee)
            : fe && ge.data('document') && Ee.activate(n(), Ee);
        },
        toggleLabelModality: function() {
          he === xe
            ? xe.deactivate(xe)
            : fe && ge.data('document') && xe.activate(n(), xe);
        },
        toggleObjectModality: function() {
          he === _e
            ? _e.deactivate(_e)
            : fe && ge.data('document') && _e.activate(n(), _e);
        },
        toggleTraceModality: function() {
          he === Oe
            ? Oe.deactivate(Oe)
            : fe && ge.data('document') && Oe.activate(n(), Oe);
        },
        setTraceGlowing: function() {
          Oe.setGlowing(), $('#wTracePrompt').css('display', 'none');
        },
        toggleTraceFading: function() {
          Oe.toggleFading();
        },
        toggleTraceEnabling: function() {
          Oe.toggleEnabling();
        },
        clearTraces: function() {
          n().clearTraces(), $('#wTracePrompt').css('display', 'none');
        },
        pointCheckClicked: function() {
          W(0 > we ? $e.defaultPointStyle : -1);
        },
        pointGridClicked: function(e) {
          var t = b();
          W(Math.floor(e.offsetY / (20 * t)));
        },
        lineCheckClicked: function() {
          0 > ke && 0 > Se
            ? F($e.defaultLineThickness, $e.defaultLineStyle)
            : F(-1, -1);
        },
        lineGridClicked: function(e) {
          var t = b();
          F(Math.floor(e.offsetY / (20 * t)), Math.floor(e.offsetX / (51 * t)));
        },
        colorCheckClicked: function() {
          var e = h($e.objectColorBox);
          e || $e.textColorBox.checked
            ? 0 > Pe && j($e.defaultColor.column, $e.defaultColor.row)
            : j(-1, 0);
        },
        labelCheckClicked: function() {
          var e = h($e.textColorBox);
          e || $e.objectColorBox.checked
            ? 0 > Pe && j($e.defaultColor.column, $e.defaultColor.row)
            : j(-1, 0);
        },
        labelSetFontSize: function(e) {
          ve && xe.setFontSize(+e);
        },
        labelSetFont: function(e) {
          ve && xe.setFont(e);
        },
        colorGridClicked: function(e) {
          var t = b(),
            n = e.pageX - $('#widget_colorGrid').offset().left,
            o = e.pageY - $('#widget_colorGrid').offset().top,
            a = Math.min(8, Math.floor(n / (27.2 * t))),
            i = Math.floor(o / (27 * t));
          j(a, i);
        },
        labelChanged: function(e) {
          LabelControls.labelChanged(e) || Q(e);
        },
        controlCallback: function(e, t) {
          return (e = Q(e, t));
        },
        labelToggled: function() {
          Y(xe.showLabelElt.prop('checked'));
        },
        deleteConfirm: function() {
          _e.deleteConfirm(this);
        },
        deleteCancel: function() {
          _e.deleteCancel(this);
        },
        setWidgetsPrefs: function(e) {
          PREF.setWebPagePrefs(e);
        },
        getScriptPath: function() {
          return de;
        },
        resizeSketchFrame: function(e) {
          S(e);
        },
      }
    );
  })(),
  LabelControls = (function() {
    function e(e, t) {
      var n = { namedFromTemplate: o, namedFromLabel: a, noVisibleName: i },
        r = {
          namedByPrime: l,
          namedByShortFn: s,
          namedByFullFn: c,
          namedFromLabel: a,
          noVisibleName: i,
        };
      switch (e) {
        case 'measure':
        case 'param':
          return n[t];
        case 'transImage':
          return r[t];
      }
    }
    function t(t, n, o, a, i, l, s, c) {
      (this.mode = t),
        (this.oldText = n.label),
        (this.oldOrigin = n.style.nameOrigin),
        (this.lastOrigin = ''),
        (this.labelText = n.label),
        $(l).prop('value', n.label),
        (this.callback = o),
        (this.textRule = a),
        (this.originRule = i),
        (this.radioSelector = s),
        (this.inputSelector = l),
        (this.showSelector = c),
        (this.tappedGobj = n),
        (this.radioPressed = function(t) {
          var n,
            o,
            a = this.textRule[t],
            i = this.tappedGobj;
          'namedFromLabel' === t && '' === a && (a = i.label),
            (t !== i.style.nameOrigin || a !== i.label) &&
              ((n = e(this.mode, t)), (this.state = new n(this))),
            'namedFromLabel' === t &&
              ((o = $(this.inputSelector)[0]),
              o.focus(),
              o.setSelectionRange(0, o.value.length));
        }),
        (this.originFromText = function(e) {
          var t;
          return (
            '' === e
              ? (t = 'noVisibleName')
              : ((t = this.originRule[e]),
                t ||
                  (t =
                    'transImage' === this.mode
                      ? 'namedFromLabel'
                      : this.originRule['*'])),
            t
          );
        }),
        (this.labelChanged = function(t, n) {
          var o = e(this.mode, n);
          (this.labelText = t),
            this.state instanceof o
              ? this.callback(t, n)
              : (this.state = new o(this));
        }),
        (this.state = null);
    }
    function n(e) {
      (this.nameOrigin = e),
        (this.init = function(t, n, o) {
          var a,
            i = n,
            l = 'noVisibleName' === e && 'transImage' === t.mode;
          (this.machine = t),
            e !== t.lastOrigin && (i = t.callback(n, e)),
            '' !== n && $(t.inputSelector).val(i),
            (a = $(this.machine.radioSelector + '[value=' + e + ']')),
            a.prop('checked') || a.prop('checked', !0),
            l
              ? $(t.radioSelector).prop('checked', !1)
              : i !== n &&
                ((this.machine.labelText = i),
                delete this.machine.originRule[n],
                (this.machine.originRule[i] = e),
                (this.machine.textRule[e] = i)),
            $(t.showSelector).prop('checked', o),
            (t.lastOrigin = e);
        });
    }
    function o(e) {
      this.init(e, '', !0);
    }
    function a(e) {
      this.init(e, e.labelText, !0);
    }
    function i(e) {
      this.init(e, '', !1), WIDGETS.labelToggled();
    }
    function l(e) {
      this.init(e, e.textRule.namedByPrime, !0);
    }
    function s(e) {
      this.init(e, e.textRule.namedByShortFn, !0);
    }
    function c(e) {
      this.init(e, e.textRule.namedByFullFn, !0);
    }
    var r;
    return (
      (o.prototype = new n('namedFromTemplate')),
      (o.prototype.constructor = o),
      (a.prototype = new n('namedFromLabel')),
      (a.prototype.constructor = a),
      (i.prototype = new n('noVisibleName')),
      (i.prototype.constructor = i),
      (l.prototype = new n('namedByPrime')),
      (l.prototype.constructor = l),
      (s.prototype = new n('namedByShortFn')),
      (s.prototype.constructor = s),
      (c.prototype = new n('namedByFullFn')),
      (c.prototype.constructor = c),
      {
        init: function(n, o, a, i, l, s, c, d) {
          var u = e(n, o.style.nameOrigin);
          (r = new t(n, o, a, i, l, s, c, d)),
            (r.state = new u(r)),
            $('.wLabelRadios label').click(function(e) {
              LabelControls.transition(e);
            });
        },
        terminate: function() {
          r && (r = null);
        },
        transition: function(e) {
          var t = e.target.value || e.target.children[0].value;
          t && r.radioPressed(t);
        },
        labelChanged: function(e) {
          return r ? (r.labelChanged(e, this.originFromText(e)), !0) : !1;
        },
        originFromText: function(e) {
          return r ? r.originFromText(e) : null;
        },
      }
    );
  })(),
  PAGENUM = (function() {
    function e(e, t) {
      return $(e)
        .parent()
        .find(t);
    }
    function t(e) {
      return $(e).data('document');
    }
    function n(e) {
      function t(e) {
        if (!Number.isInteger(e))
          throw GSP.createError(
            'bad argument to setToolEnabling enableThisPage.'
          );
        o.addClass('p_' + e);
      }
      var n,
        o,
        a,
        i,
        l = e.canvasNode[0],
        s = $(l).find('div.wsp-tool');
      for (n = 0; n < s.length; n++)
        (o = $(s[n])),
          (a = o.find('[title]').attr('title')),
          a || (a = o[0].textContent),
          a &&
            ((a = a.replace(/\s+/g, '')),
            (i = PREF.getPref(e, a, 'tool')),
            i &&
              'all' !== i[0] &&
              (o.addClass('page_toggle'), 'none' !== i[0] && i.forEach(t)));
    }
    function o(t) {
      var n,
        o,
        a = t.canvasNode[0],
        i = e(a, '.page_buttons'),
        l = e(a, '.button_area'),
        s = PREF.getPref(t, 'pagecontrol'),
        d = PREF.getPref(t, 'resetbutton'),
        u = PREF.getPref(t, 'wsplogo');
      1 === i.length &&
        s &&
        (t.docSpec.pages.length < 2
          ? (i.removeClass('page_buttonsActive'), i.empty())
          : ((n =
              '<span class="page_btn page_prevBtn">&nbsp;</span><div style="display:inline-block; position:relative;"><span class="page_num"></span></div><span class="page_btn page_nextBtn">&nbsp;</span></span>'),
            i.html(n),
            i.addClass('page_buttonsActive'),
            i.find('.page_num').on('click', { node: a }, function(e) {
              return r(e.data.node), !1;
            }),
            i.find('.page_prevBtn').on('click', { node: a }, function(e) {
              return c(e.data.node, -1, !0), !1;
            }),
            i.find('.page_nextBtn').on('click', { node: a }, function(e) {
              return c(e.data.node, 1, !0), !1;
            }),
            c(a, +t.metadata['start-page']))),
        1 === l.length &&
          (d.length &&
            'none' !== d[0] &&
            0 === e(a, '.reset_button').length &&
            ((n = '<button class="reset_button'),
            'all' !== d[0] &&
              ((n += ' page_toggle'),
              d.forEach(function(e) {
                n += ' p_' + e;
              })),
            (n += '" onclick="PAGENUM.resetPage(this);">Reset</button>'),
            l.append(n)),
          u &&
            0 === e(a, '.wsp_logo').length &&
            ((n = '<div class="wsp_logo"></div>'),
            (o = l.find('.util-menu-btn')),
            o.length > 0 ? o.after(n) : l.prepend(n)));
    }
    function a(e) {
      var t = e.focusPage.metadata.id,
        n = $(e.canvasNode)
          .parent()
          .find('.page_popupNum');
      n.length > 0 &&
        ($(n).css('background-color', '#fff'),
        $(n[t - 1]).css('background-color', '#ccc'));
    }
    function i(e, t) {
      var n = $(e)
        .closest('.sketch_container')
        .find('.page_toggle');
      n.length && (n.hide(), n.filter('.p_' + t).show());
    }
    function l(e, t) {
      var n = e.focusPage,
        o = n.metadata.id,
        l = e.docSpec.pages.length,
        s = $(e.canvasNode)
          .parent()
          .find('.page_buttons');
      u && n.restoreTraces(),
        s &&
          (s.find('.page_num').html('&nbsp;' + o + '&nbsp;'),
          s.find('.page_nextBtn').css('opacity', l > o ? '1' : '0.4'),
          s.find('.page_prevBtn').css('opacity', o > 1 ? '1' : '0.4'),
          a(e)),
        i(t, o);
    }
    function s() {
      var e = $('.sketch_canvas');
      e.on('LoadDocument.WSP', function(e, t) {
        o(t.document), n(t.document);
      }),
        e.on('DidChangeCurrentPage.WSP', function(e, t) {
          l(t.document, e.target);
        });
    }
    function c(e, n, o) {
      var a = t(e),
        i = a.focusPage,
        l = +a.focusPage.metadata.id;
      o && (n += l),
        n > 0 &&
          n <= a.docSpec.pages.length &&
          n !== l &&
          (u && !i.preferences.fadeTraces && i.saveTraces(), a.switchPage(n));
    }
    function r(n) {
      function o(e) {
        return '<span class="page_popupNum">&nbsp;' + e + '&nbsp;</span>';
      }
      var i = e(n, '.page_buttons');
      if (i.find('.page_popup').length > 0) return void d(n);
      for (
        var l = t(n), s = l.docSpec.pages.length, r = o(1), u = 2;
        s >= u;
        u += 1
      )
        r += '<br>' + o(u);
      var p = $.parseHTML(
        '<div class="page_popup" style="line-height:1.1rem;">' + r + '</div>'
      );
      i.find('.page_num').after(p[0]);
      var f = $(p).outerHeight() + 1;
      $(p).css({ top: -f + 'px' }),
        a(l),
        i.find('.page_popupNum').on('mouseover', { node: n }, function(e) {
          c(e.data.node, this.innerText.trim());
        }),
        i.find('.page_popupNum').on('click', { node: n }, function(e) {
          return c(e.data.node, this.innerText.trim()), d(e.data.node), !1;
        }),
        $(window).one('click', { node: n }, function(e) {
          return $(e.target).hasClass('page_num')
            ? void 0
            : (d(e.data.node), !1);
        }),
        $(window).off('keydown'),
        $(window).on('keydown', { node: n }, function(e) {
          var t = e.which;
          return t >= 37 && 40 >= t
            ? (38 >= t ? c(e.data.node, -1, !0) : c(e.data.node, 1, !0), !1)
            : void 0;
        });
    }
    function d(t) {
      var n = e(t, '.page_buttons');
      n.find('.page_popupNum').off('mouseover'),
        n.find('.page_popupNum').off('click'),
        n.find('.page_popup').remove(),
        $(window).off('keydown');
    }
    var u = !0;
    return {
      initPageControls: function() {
        s();
      },
      resetPage: function(e) {
        var n = WIDGETS.relatedSketchNode(e, '.sketch_canvas');
        t(n).resetActivePage();
      },
      gotoPage: function(e, n) {
        var o = WIDGETS.relatedSketchNode(e, '.sketch_canvas');
        t(o).switchPage(n);
      },
    };
  })(),
  UTILMENU = (function() {
    function e(e) {
      function t(e) {
        s.find(e).show(), r++;
      }
      var n,
        o,
        a,
        i = PREF.getPref(e, 'upload', 'util'),
        l = PREF.getPref(e, 'download', 'util'),
        s = $(e.canvasNode)
          .parent()
          .find('.util-menu-btn'),
        c = i || l,
        r = 0;
      c
        ? (s.show(),
          $(s.find('.util-menu-item')).hide(),
          i && t('.util-upload'),
          l && t('.util-download'),
          (n = s.find('.util-menu-content')),
          (o = 0.25 + 1.45 * r),
          (a = -o - 0.4),
          n.css('height', o + 'rem'),
          n.css('top', a + 'rem'))
        : s.hide();
    }
    function t() {
      $('.util-menu-content').hide(), $(window).off('click', n);
    }
    function n(e) {
      return $(e.target).hasClass('util-menu') ? void 0 : (t(), !1);
    }
    function o(e, t) {
      var n,
        o,
        a,
        i,
        l,
        s = e.pageData;
      if ($('#util-fname')[0].validity.valid) {
        (n = '.js' === t.slice(-3) || '-json' === t.slice(-5)),
          n
            ? ((t = t.split(/.js$/)[0].split(/-json$/)[0]),
              (o = GSP.normalizeSketchName(t)),
              (t = o + '-json.js'))
            : '.json' !== t.slice(-5) && (t += '.json');
        var r = $('#downloadLink')[0];
        $.each(e.docSpec.pages, function(e, t) {
          var n = t.metadata.id;
          s[n].session.traceData && (t.traceData = s[n].session.traceData);
        }),
          (a = e.sQuery().getSketchJSON()),
          n && (a = 'var ' + o + ' = ' + a + ';'),
          (i = new Blob([a], { type: 'text/plain' })),
          (l = URL.createObjectURL(i)),
          (r.href = l),
          (r.download = t),
          r.click(),
          e.event('DownloadDocument', { document: e }, { fileName: t }),
          c(e),
          UTILMENU.closeModal('download-modal', 'save');
      }
    }
    function a() {
      var e = $('#download-modal');
      e.css('display', 'block'),
        e
          .find('.util-popup-content')
          .tinyDraggable({ exclude: '.dragExclude' }),
        $('#util-fname').select();
    }
    function i() {
      t(),
        $('#upload-modal').data('sketchNode', u),
        $('#file-name-input').attr(
          'onchange',
          'UTILMENU.loadSketch(this.files[0]);'
        );
    }
    function l() {
      function e() {
        o($(u).data('document'), $('#util-fname')[0].value);
      }
      t(), $('#download-modal').data('sketchNode', u);
      var n = $('#downloadOK');
      n.focus(),
        n.on('click', function() {
          e();
        }),
        $('#util-fname').on('keyup', function(t) {
          var n = $('#util-fname')[0].validity.valid;
          27 === t.keyCode
            ? UTILMENU.closeModal('download-modal', 'cancel')
            : 13 === t.keyCode && n && e();
        });
    }
    function s(e) {
      var t,
        n = $('#upload-modal');
      (u = e),
        (t =
          r(e) &&
          PREF.shouldEnableForCurrentPage(
            'util',
            'download',
            $(e).data('document').focusPage
          )),
        i(),
        t
          ? (l(),
            n.css('display', 'block'),
            n
              .find('.util-popup-content')
              .tinyDraggable({ exclude: '.dragExclude' }),
            $('#downloadBeforeUpload').focus(),
            n.on('keyup', function(e) {
              27 === e.keyCode && UTILMENU.closeModal('upload-modal', 'cancel');
            }))
          : $('#file-name-input').click();
    }
    function c(e) {
      var t = e.canvasNode[0].id,
        n = b64_md5(JSON.stringify(e.getCurrentSpecObject()));
      $('#' + t).data('prevChecksum', n);
    }
    function r(e) {
      var t = $(e).data('document'),
        n = t.getCurrentSpecObject(),
        o = b64_md5(JSON.stringify(n)),
        a = $(e).data('prevChecksum');
      return o !== a;
    }
    function d(e) {
      function t(e) {
        return (
          e &&
            e.includes('Times') &&
            e.includes('sans-serif') &&
            (e = e.replace('sans-serif', 'serif')),
          e
        );
      }
      function n(e) {
        var n;
        for (n = 0; n < e.length; ++n) e[n] = t(e[n]);
      }
      function o(e) {
        $.each(e, function(e, n) {
          var o = n['font-family'];
          o
            ? (n['font-family'] = t(o))
            : n.label &&
              ((o = n.label['font-family']),
              o && (n.label['font-family'] = t(o)));
        });
      }
      function a(e) {
        n(e.resources.fontList),
          e.pageData
            ? $.each(e.pageData, function(e, t) {
                o(t.spec.preferences.text.textTypes);
              })
            : $.each(e.pages, function(e, t) {
                o(t.preferences.text.textTypes);
              });
      }
      var i = ['"Times New Roman", serif', '"Arial", sans-serif'];
      e.resources
        ? e.resources.fontList
          ? a(e)
          : (e.resources.fontList = i)
        : (e.resources = { fontList: i }),
        e.docSpec.resources
          ? e.docSpec.resources.fontList
            ? a(e.docSpec)
            : (e.docSpec.resources.fontList = i)
          : (e.docSpec.resources = { fontList: i }),
        o(e.focusPage.preferences.text.textTypes),
        c(e);
    }
    var u;
    return {
      checkFName: function(e) {
        $('#downloadOK').prop('disabled', !e.valid);
      },
      closeModal: function(e, t) {
        if (($('#' + e).css('display', 'none'), 'download-modal' === e))
          $('#util-fname').off('keyup'), $('#downloadOK').off('click');
        else if ('upload-modal' === e)
          switch (t) {
            case 'save':
              a($(this).parents('.util-menu-btn'));
              break;
            case 'dont-save':
              $('#file-name-input').click();
          }
      },
      download: function(e) {
        (u = WIDGETS.relatedSketchNode(e.target, '.sketch_canvas')),
          $('#download-modal').data('callSave') &&
            $('#download-modal').removeData('callSave'),
          l(u),
          a();
      },
      loadSketch: function(e) {
        var t, n, o, a;
        if (e) {
          if (
            ((t = new FileReader()),
            (n = $(u)),
            (o = e.name),
            (a = o.endsWith('-json.js')))
          )
            o = o.replace(/\.js$/, '');
          else if (!o.endsWith('.json')) return;
          (o = o.replace(/[\.\-]json/, '')),
            (t.onload = function(e) {
              var t,
                i = e.target.result;
              a &&
                ((t = i.indexOf('{')),
                (i = i.substring(t)),
                (t = i.match(/}\s*;\s*$/).index),
                (i = i.substring(0, t + 1))),
                n.data('sourceDocument', i),
                n.data('fileName', o),
                n.WSP('loadSketch'),
                n.removeData('sourceDocument');
            }),
            t.readAsText(e);
        }
      },
      upload: function(e) {
        s(WIDGETS.relatedSketchNode(e.target, '.sketch_canvas'));
      },
      menuBtnClicked: function(e) {
        var t = $(e.parentNode).find('.util-menu-content');
        t.toggle(), 'block' === t.css('display') && $(window).on('click', n);
      },
      addUtilMenu: function(e) {
        var t = WIDGETS.getScriptPath(),
          n = '<div class="util-menu-btn util-menu">';
        return (
          (n +=
            '<img class = "util-menu" src="' +
            t +
            'utility-icon.png" onclick="UTILMENU.menuBtnClicked(this);" />'),
          (n += '<div class="util-menu-content util-menu">'),
          (n +=
            '<div class="util-menu-item util-menu util-download" onclick="UTILMENU.download(event)">Download...</div>'),
          (n +=
            '<div class="util-menu-item util-menu util-upload" onclick="UTILMENU.upload(event);">Upload...</div>'),
          (n += '</div>'),
          (n += '</div>'),
          e.replaceWith(n),
          n
        );
      },
      initUtils: function() {
        var t = $('.sketch_canvas');
        t.on('LoadDocument.WSP', function(t, n) {
          d(n.document), e(n.document);
        }),
          $.each(t, function(e, t) {
            var n = $(t).parent(),
              o = n.find('.util-menu-btn'),
              a = $(t).data('document');
            1 !== o.length || o[0].firstElementChild || UTILMENU.addUtilMenu(o),
              a && d(a);
          });
      },
    };
  })();
$(function() {
  WIDGETS.initWidget(), PAGENUM.initPageControls(), UTILMENU.initUtils();
});
