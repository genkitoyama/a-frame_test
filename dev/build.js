(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
console.warn = () => {}

require('./components.js')
require('./shaders.js')


},{"./components.js":2,"./shaders.js":7}],2:[function(require,module,exports){
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

AFRAME.registerComponent('time-counter', {
    schema: {},
    init: function () {
        this.data.count = 0
    },
    tick: function () {
        this.data.count += 1
        this.el.setAttribute('material', 'time', this.data.count * 0.01)
    }
})


},{}],3:[function(require,module,exports){
module.exports = function parse(params){
      var template = "varying vec2 vUV; \n" +
" \n" +
"void main(void) { \n" +
"  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); \n" +
"  vUV = uv; \n" +
"} \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],4:[function(require,module,exports){
module.exports = function parse(params){
      var template = "varying vec2 vUV; // [0.0, 0.0] ~ [1.0, 1.0] \n" +
" \n" +
"void main(void) { \n" +
"	float x = vUV[0]; \n" +
"	float y = vUV[1]; \n" +
"    gl_FragColor = vec4(x, y, 0.5, 1.0); //(Red, Green, Blue, Alpha) \n" +
"} \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],5:[function(require,module,exports){
module.exports = function parse(params){
      var template = "varying vec2 vUV; // [0.0, 0.0] ~ [1.0, 1.0] \n" +
"uniform float time; \n" +
" \n" +
"void main(void) { \n" +
"	vec2 p = (vUV * 2.0) - vec2(1.0, 1.0); // [-1.0, 1.0] ~ [1.0, 1.0] \n" +
"	float x = p[0]; \n" +
"	float y = p[1]; \n" +
"    gl_FragColor = vec4(abs(x), abs(y), sin(time) * 0.5 + 0.5, 0.9); //(Red, Green, Blue, Alpha) \n" +
"} \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],6:[function(require,module,exports){
module.exports = function parse(params){
      var template = "varying vec2 vUV; \n" +
"uniform float time; \n" +
" \n" +
"void main(void) { \n" +
"	// position: vec3([-0.5 ~ 0.5], [-0.5 ~ 0.5], [-0.5 ~ 0.5]) \n" +
"	float Pi = 3.141592; \n" +
"	float tx = position.x * (abs(sin(position.y * Pi + time)) * 0.7 + 0.3); \n" +
"	float ty = position.y; \n" +
"	float tz = position.z * (abs(sin(position.y * Pi + time)) * 0.7 + 0.3); \n" +
"	vec3 transform = vec3(tx, ty, tz); \n" +
"    gl_Position = projectionMatrix * modelViewMatrix * vec4(transform, 1.0); \n" +
"    vUV = uv; \n" +
"} \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],7:[function(require,module,exports){
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

AFRAME.registerShader('red-shader', {
    vertexShader: [
        'varying vec2 vUV;',
        'void main(void) {',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
    ].join('\n'),

    fragmentShader: [
        'void main(void) {',
        '    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); //(Red, Green, Blue, Alpha)',
        '}'
    ].join('\n')
})

AFRAME.registerShader('gradation-shader', {
    vertexShader: require('./shader/default.vert')(),
    fragmentShader: require('./shader/gradation.frag')()
})

AFRAME.registerShader('time-gradation-shader', {
    schema: {
        time: { type: 'float', default: 0.0, is: 'uniform' }
    },
    vertexShader: require('./shader/default.vert')(),
    fragmentShader: require('./shader/time-gradation.frag')()
})

AFRAME.registerShader('time-transform-shader', {
    schema: {
        time: { type: 'float', default: 0.0, is: 'uniform' }
    },
    vertexShader: require('./shader/time-transform.vert')(),
    fragmentShader: require('./shader/time-gradation.frag')()
})


},{"./shader/default.vert":3,"./shader/gradation.frag":4,"./shader/time-gradation.frag":5,"./shader/time-transform.vert":6}]},{},[1]);
