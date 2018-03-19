/**
 * GMultiSelect
 * Multiple Dropdown Select
 *
 * @filesource js/multiselect.js
 * @link http://www.kotchasan.com/
 * @copyright 2016 Goragod.com
 * @license http://www.kotchasan.com/license/
 */
(function () {
  'use strict';
  window.GMultiSelect = GClass.create();
  GMultiSelect.prototype = {
    initialize: function (selects, o) {
      var loading = true;
      this.selects = new Object();
      this.req = new GAjax();
      var self = this;
      var _dochanged = function () {
        var a = false;
        var temp = this;
        if (!loading && this.selectedIndex == 0) {
          loading = false;
          forEach(selects, function (item) {
            if (a) {
              var obj = self.selects[item];
              for (var i = obj.options.length - 1; i > 0; i--) {
                obj.removeChild(obj.options[i]);
              }
            }
            a = !a && item == temp.id ? true : a;
          });
        } else {
          var qs = new Array();
          qs.push('srcItem=' + this.id);
          for (var prop in o) {
            if (prop != 'action' && prop != 'onchanged') {
              qs.push(prop + '=' + o[prop]);
            }
          }
          for (var sel in self.selects) {
            var select = self.selects[sel];
            qs.push(select.id + '=' + encodeURIComponent(select.value));
          }
          temp.addClass('wait');
          self.req.send(o.action, qs.join('&'), function (xhr) {
            temp.removeClass('wait');
            var items = xhr.responseText.toJSON();
            if (items) {
              for (var prop in items) {
                if ($E(prop)) {
                  $G(prop).setOptions(items[prop], $E(prop).value);
                }
              }
            }
          });
        }
      };
      for (var prop in o) {
        if (prop == 'onchanged') {
          this.onchanged = o[prop];
        }
      }
      var l = selects.length - 1;
      forEach(selects, function (item, index) {
        var select = $G(item);
        if (index < l || l == 0) {
          select.addEvent('change', _dochanged);
        } else if (Object.isFunction(self.onchanged)) {
          select.addEvent('change', self.onchanged);
        }
        self.selects[item] = select;
      });
      _dochanged.call($E(selects[0]));
    }
  };
}());