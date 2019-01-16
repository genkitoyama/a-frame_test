(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

console.warn = function () {};

require('./components.js');
require('./shaders.js');

},{"./components.js":2,"./shaders.js":8}],2:[function(require,module,exports){
'use strict';

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('time-counter', {
    schema: {},
    init: function init() {
        this.data.count = 0;
    },
    tick: function tick() {
        this.data.count += 1;
        this.el.setAttribute('material', 'time', this.data.count * 0.01);
    }
});

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
"const float PI = 3.14159265359; \n" +
" \n" +
"float usin(float x){ \n" +
"  return 0.5 + 0.5*sin(x); \n" +
"} \n" +
" \n" +
"float box(vec2 st, vec2 size){ \n" +
"    size = vec2(0.5) - size*0.5; \n" +
"    vec2 uv = smoothstep(size, \n" +
"                        size+vec2(0.001), \n" +
"                        st); \n" +
"    uv *= smoothstep(size, \n" +
"                    size+vec2(0.001), \n" +
"                    vec2(1.0)-st); \n" +
"    return uv.x*uv.y; \n" +
"} \n" +
" \n" +
"float seedRandom(vec2 texCoord, int Seed){ \n" +
"    return fract(sin(dot(texCoord.xy, vec2(12.9898, 78.233)) + float(Seed)) * 43758.5453); \n" +
"} \n" +
" \n" +
"float rand(float n){return fract(sin(n) * 43758.5453123);} \n" +
" \n" +
" \n" +
"void main(void) { \n" +
"	vec2 p = (vUV * 2.0) - vec2(1.0, 1.0); // [-1.0, 1.0] ~ [1.0, 1.0] \n" +
"	float x = p[0]; \n" +
"	float y = p[1]; \n" +
" \n" +
"    vec2 st = p.xy/vec2(1.0, 1.0); \n" +
" \n" +
"    float size = usin(time*1.0)*0.5; \n" +
"    float lineWidth = 0.3; \n" +
"     \n" +
"    vec3 color = vec3(0.0); \n" +
" \n" +
"    for(float i=0.0; i<30.0; i++){ \n" +
"        lineWidth = (0.01 + i*0.01)*max(size, 0.01); \n" +
"        float r = box(p+0.5, vec2(size*0.5+lineWidth)) - box(p+0.5, vec2(max(0.0, size*0.5))); \n" +
"        vec3 randColor = vec3(rand(0.2352479*i), rand(0.51925*i), rand(1.12468*i)); \n" +
"        color += vec3(r) * randColor; \n" +
"        size += lineWidth*2.0; \n" +
"    } \n" +
" \n" +
"	gl_FragColor = vec4(color, 1.0); \n" +
"} \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],6:[function(require,module,exports){
module.exports = function parse(params){
      var template = "varying vec2 vUV; // [0.0, 0.0] ~ [1.0, 1.0] \n" +
"uniform float time; \n" +
" \n" +
"void main(void) { \n" +
"	vec2 p = (vUV * 2.0) - vec2(1.0, 1.0); // [-1.0, 1.0] ~ [1.0, 1.0] \n" +
"	float x = p[0]; \n" +
"	float y = p[1]; \n" +
"    // gl_FragColor = vec4(abs(x), abs(y), sin(time) * 0.5 + 0.5, 0.9); //(Red, Green, Blue, Alpha) \n" +
"	gl_FragColor = vec4(x*0.5+0.5, 0.0, 0.0, 1.0); //(Red, Green, Blue, Alpha) \n" +
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

},{}],8:[function(require,module,exports){
'use strict';

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerShader('red-shader', {
    vertexShader: ['varying vec2 vUV;', 'void main(void) {', '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', '}'].join('\n'),

    fragmentShader: ['void main(void) {', '    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); //(Red, Green, Blue, Alpha)', '}'].join('\n')
});

AFRAME.registerShader('gradation-shader', {
    vertexShader: require('./shader/default.vert')(),
    fragmentShader: require('./shader/gradation.frag')()
});

AFRAME.registerShader('time-gradation-shader', {
    schema: {
        time: { type: 'float', default: 0.0, is: 'uniform' }
    },
    vertexShader: require('./shader/default.vert')(),
    fragmentShader: require('./shader/time-gradation.frag')()
});

AFRAME.registerShader('time-transform-shader', {
    schema: {
        time: { type: 'float', default: 0.0, is: 'uniform' }
    },
    vertexShader: require('./shader/time-transform.vert')(),
    fragmentShader: require('./shader/time-gradation.frag')()
});

AFRAME.registerShader('rect-animation-shader', {
    schema: {
        time: { type: 'float', default: 0.0, is: 'uniform' }
    },
    vertexShader: require('./shader/default.vert')(),
    fragmentShader: require('./shader/test.frag')()
});

},{"./shader/default.vert":3,"./shader/gradation.frag":4,"./shader/test.frag":5,"./shader/time-gradation.frag":6,"./shader/time-transform.vert":7}]},{},[1]);
