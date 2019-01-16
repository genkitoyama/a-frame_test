if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

AFRAME.registerShader('red-shader', {
    vertexShader: [
        'varying vec2 vUV;',
        'void main(void) {',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '  vUV = uv;',
        '}'
    ].join('\n'),

    fragmentShader: [
        'void main(void) {',
        '    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); //(Red, Green, Blue, Alpha)',
        '}'
    ].join('\n')
})

AFRAME.registerShader('test-shader', {
    schema: {
        time: { type: 'float', default: 0.0, is: 'uniform' }
    },
    vertexShader: [
        'varying vec2 vUV;',
        'void main(void) {',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '  vUV = uv;',
        '}'
    ].join('\n'),

    fragmentShader: [
        'varying vec2 vUV; // [0.0, 0.0] ~ [1.0, 1.0]',
        'uniform float time;',

        'const float PI = 3.14159265359;',

        'float rand(vec2 co){',
        '    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);',
        '}',

        'float usin(float t){',
        'return 0.5 + 0.5*sin(t);',
        '}',

        'void main(void) {',
        '   vec2 p = (vUV * 2.0) - vec2(1.0, 1.0); // [-1.0, 1.0] ~ [1.0, 1.0]',
        '    vec3 v = vec3(p, 1.0 - length(p) * 0.2);',

        '   float ta = time * 0.1;',

        ' float a = (atan(v.y, v.x) / (PI * 2.0) );',
        '    float slice = floor(a * 500.0);',
        '    float phase = rand(vec2(slice, 0.0));',
        '    float dist = rand(vec2(slice, 1.0)) * (usin(time*2.0)+1.0)*2.0;',

        '    float z = dist / length(v.xy) * v.z;',
        '    float Z = mod(z + phase + time * 0.5, 1.0);',
        '    float d = sqrt(z * z + dist * dist);',

        '   float c = exp(-Z * 10.0 + 0.3) / (d * d + 1.0);',
        '    gl_FragColor = vec4(vec3(c), 1.0);',
        '}'
    ].join('\n')
})