(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

console.warn = function () {};

require('./components.js');
require('./shaders.js');

},{"./components.js":2,"./shaders.js":9}],2:[function(require,module,exports){
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
      var template = "varying vec2 vUV; // [0.0, 0.0] ~ [1.0, 1.0] \n" +
"uniform float time; \n" +
" \n" +
"mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);} \n" +
" \n" +
"mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534); \n" +
" \n" +
"float tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);} \n" +
" \n" +
"vec2 tri2(in vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));} \n" +
" \n" +
"float triNoise2d(in vec2 p, float spd) \n" +
"{ \n" +
"    float z=1.8; \n" +
"    float z2=2.5; \n" +
"	float rz = 0.; \n" +
"    p *= mm2(p.x*0.06); \n" +
"    vec2 bp = p; \n" +
"	for (float i=0.; i<5.; i++) \n" +
"	{ \n" +
"        vec2 dg = tri2(bp*1.85)*.75; \n" +
"        dg *= mm2(time*spd); \n" +
"        p -= dg/z2; \n" +
" \n" +
"        bp *= 1.3; \n" +
"        z2 *= .45; \n" +
"        z *= .42; \n" +
"        p *= 1.21 + (rz-1.0)*.02; \n" +
" \n" +
"        rz += tri(p.x+tri(p.y))*z; \n" +
"        p*= -m2; \n" +
"	} \n" +
"    return clamp(1./pow(rz*29., 1.3),0.,.55); \n" +
"} \n" +
" \n" +
"float hash21(in vec2 n){ return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); } \n" +
" \n" +
"vec4 aurora(vec3 ro, vec3 rd) \n" +
"{ \n" +
"    vec4 col = vec4(0); \n" +
"    vec4 avgCol = vec4(0); \n" +
" \n" +
"    for(float i=0.;i<30.;i++) \n" +
"    { \n" +
"      float of = 0.006*hash21(gl_FragCoord.xy)*smoothstep(0.,15., i); \n" +
"      float pt = ((.8+pow(i,1.4)*.002)-ro.y)/(rd.y*2.+0.3); \n" +
"      pt -= of; \n" +
"    	vec3 bpos = ro + pt*rd; \n" +
"      vec2 p = bpos.zx; \n" +
"      float rzt = triNoise2d(p, 0.25); \n" +
"      vec4 col2 = vec4(0,0,0, rzt); \n" +
"      col2.rgb = (sin(1.-vec3(2.15,-.5, 1.2)+i*0.043)*0.5+0.5)*rzt; \n" +
"      avgCol =  mix(avgCol, col2, .5); \n" +
"      col += avgCol * exp2(-i*0.05 - 2.) * smoothstep(0.,5., i); \n" +
"    } \n" +
" \n" +
"    col *= (clamp(rd.y*15.+.5,0.,1.)); \n" +
" \n" +
" \n" +
"    // return clamp(pow(col,vec4(1.3))*1.5,0.,1.); \n" +
"    // return clamp(pow(col,vec4(1.7))*2.,0.,1.); \n" +
"    // return clamp(pow(col,vec4(1.5))*2.5,0.,1.); \n" +
"    // return clamp(pow(col,vec4(1.8))*1.5,0.,1.); \n" +
" \n" +
"    // return smoothstep(0.,1.1,pow(col,vec4(1.))*1.5); \n" +
"    return col*1.8; \n" +
"    //return pow(col,vec4(1.))*2. \n" +
"} \n" +
" \n" +
" \n" +
"//-------------------Background and Stars-------------------- \n" +
" \n" +
"//From Dave_Hoskins (https://www.shadertoy.com/view/4djSRW) \n" +
"vec3 hash33(vec3 p) \n" +
"{ \n" +
"    p = fract(p * vec3(443.8975,397.2973, 491.1871)); \n" +
"    p += dot(p.zxy, p.yxz+19.27); \n" +
"    return fract(vec3(p.x * p.y, p.z*p.x, p.y*p.z)); \n" +
"} \n" +
"// https://www.shadertoy.com/view/MlSfzz \n" +
"vec3 stars(in vec3 p) \n" +
"{ \n" +
"    vec3 c = vec3(0.); \n" +
"    float res = vUV.x * 2.; \n" +
" \n" +
"	for (float i=0.;i<2.;i++) \n" +
"    { \n" +
"        vec3 q = fract(p*(.15*res))-.5; \n" +
"        vec3 id = floor(p*(.15*res)); \n" +
"        vec2 rn = hash33(id).xy; \n" +
"        float c2 = 1.-smoothstep(0.,.6,length(q)); \n" +
"        c2 *= step(rn.x,.0005+i*i*0.001); \n" +
"        c += c2*(mix(vec3(1.0,0.49,0.1),vec3(0.75,0.9,1.),rn.y)*0.1+0.9); \n" +
"        p *= 1.3; \n" +
"    } \n" +
"    return c*c*.8; \n" +
"} \n" +
" \n" +
"vec3 bg(in vec3 rd) \n" +
"{ \n" +
"    float sd = dot(normalize(vec3(-0.5, -0.6, 0.9)), rd)*0.5+0.5; \n" +
"    sd = pow(sd, 5.); \n" +
"    vec3 col = mix(vec3(0.05,0.1,0.2), vec3(0.1,0.05,0.2), sd); \n" +
"    return col*.63; \n" +
"} \n" +
" \n" +
"float usin(float t){ \n" +
"  return 0.5 + 0.5 * sin(t); \n" +
"} \n" +
"//----------------------------------------------------------- \n" +
" \n" +
"void main() \n" +
"{ \n" +
"	// vec2 q = gl_FragCoord.xy / vUV.xy; \n" +
"    // vec2 p = q - 0.5; \n" +
"// 	p.x *= resolution.x / resolution.y; \n" +
" \n" +
"    vec2 p = (vUV * 2.0) - vec2(1.0, 1.75); \n" +
"    //p.x *= vUV.x / vUV.y; \n" +
"    //p.y *= -1.0; \n" +
" \n" +
"    p *= 2.0; \n" +
" \n" +
"    vec3 ro = vec3(0, 0, -2.7); \n" +
"    vec3 rd = normalize(vec3(p,2.5)); \n" +
" \n" +
"    vec2 mouse = vec2(0.0,20.0); \n" +
" \n" +
"    vec2 mo = mouse / vec2(1.0, 1.0) - .5; \n" +
"    // mo = (mo==vec2(-0.5)) ? mo = vec2(-0.1,0.1) : mo; \n" +
"    // mo.x *= resolution.x / resolution.y; \n" +
"    mo.x *= vUV.x / vUV.y; \n" +
"    rd.yz *= mm2(mo.y); \n" +
"    // rd.xz *= mm2(mo.x + sin(time*0.05)*0.5); \n" +
" \n" +
"    vec3 col = vec3(0.); \n" +
"    vec3 brd = rd; \n" +
"    float fade = smoothstep(0.,0.01,abs(brd.y))*0.3 + 0.9; \n" +
" \n" +
"    col = bg(rd)*fade; \n" +
" \n" +
"    if (rd.y > 0.){ \n" +
"        vec4 aur = smoothstep(0.,1.25,aurora(ro,rd))*fade; \n" +
"        col += stars(rd); \n" +
"        col = col*(1.-aur.a) + aur.rgb; \n" +
"   } \n" +
"    else //Reflections \n" +
"    { \n" +
"        rd.y = abs(rd.y); \n" +
"        col = bg(rd)*fade*0.6; \n" +
"        vec4 aur = smoothstep(0.0,2.5,aurora(ro,rd)); \n" +
"        col += stars(rd)*0.1; \n" +
"        col = col*(1.-aur.a) + aur.rgb; \n" +
"       vec3 pos = ro + ((0.5-ro.y)/rd.y)*rd; \n" +
"        float nz2 = triNoise2d(pos.xz*vec2(.5,.7), 0.); \n" +
"        col += mix(vec3(0.2,0.25,0.5)*0.08,vec3(0.3,0.3,0.5)*0.7, nz2*0.4); \n" +
"    } \n" +
" \n" +
"	gl_FragColor = vec4(col, 1.); \n" +
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

AFRAME.registerShader('aurora-shader', {
    schema: {
        time: { type: 'float', default: 0.0, is: 'uniform' }
    },
    vertexShader: require('./shader/default.vert')(),
    fragmentShader: require('./shader/aurora.frag')()
});

},{"./shader/aurora.frag":3,"./shader/default.vert":4,"./shader/gradation.frag":5,"./shader/test.frag":6,"./shader/time-gradation.frag":7,"./shader/time-transform.vert":8}]},{},[1]);
