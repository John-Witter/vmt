/* *** The Desmos javascript source is a commercially licensed product. If you'd like to include it in your product, please email partnerships@desmos.com *** */
;(function (global) {
  
  

  var _exports = (function () {
    var module = undefined;
    var exports = undefined;
    return requirejs('core/analysis-engine/analysis-engine');
  }).call(global);
  if ( typeof module === "object" && typeof module.exports === "object" ) {
    module.exports = _exports;
  } else {
    global.AnalysisEngine = _exports;
  }
})(typeof window !== 'undefined' ? window : this || {});