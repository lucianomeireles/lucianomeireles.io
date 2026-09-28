export const FULLSCREEN_VERT = `#version 300 es
precision highp float;
const vec2 p[4]=vec2[4](vec2(-1,-1),vec2(1,-1),vec2(-1,1),vec2(1,1));
out vec2 vUv;
void main(){ vUv=p[gl_VertexID].xy*.5+.5; gl_Position=vec4(p[gl_VertexID],0.,1.); }`;

export const SKY_GEN_FRAG = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform float uSeed;
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  f=f*f*(3.-2.*f);
  float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float fbm(vec2 p){
  float v=0., a=.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.1; a*=.5; }
  return v;
}
void main(){
  vec2 uv=vUv*2.-1.;
  float n=fbm(uv*1.8+uSeed);
  float n2=fbm(uv*3.5+vec2(uSeed,1.7));
  vec3 col=vec3(0.094,0.094,0.094);
  col+=vec3(0.055,0.03,0.09)*smoothstep(0.58,0.92,n);
  col+=vec3(0.02,0.045,0.09)*smoothstep(0.55,0.9,n2);
  col+=vec3(0.08,0.03,0.035)*smoothstep(0.66,0.97,n*n2)*0.6;
  col+=vec3(0.008,0.01,0.016)*fbm(uv*8.+uSeed)*0.5;
  o=vec4(col,1.);
}`;

export const STAR_VERT = `#version 300 es
precision highp float;
in float aSeed;
in float aLayer;
uniform vec2 uResolution;
uniform float uTime;
uniform float uDrift;
uniform float uReduced;
out float vBright;
out float vSize;
out vec3 vColor;
float hash(float n){ return fract(sin(n)*43758.5453); }
void main(){
  float layer=aLayer;
  float speed=mix(0.004,0.02,layer);
  float x=hash(aSeed)*2.-1.;
  float y=fract(hash(aSeed+1.7)+uTime*speed*(1.-uReduced*0.95)+uDrift*speed);
  y=y*2.2-1.1;
  vec2 pos=vec2(x*1.02,y);
  float rate=1.2+hash(aSeed+9.3)*2.5;
  float tw=0.78+0.22*sin(uTime*rate+aSeed*40.);
  float mag=hash(aSeed+5.1);
  vBright=mix(0.4,1.,layer)*tw*(0.45+0.55*mag);
  float big=hash(aSeed+3.3);
  big=big*big*big*big;
  vSize=mix(0.9,1.5,layer)+big*mix(1.6,3.2,layer);
  float tint=hash(aSeed+7.7);
  vColor=mix(vec3(1.,0.96,0.9),vec3(0.86,0.91,1.),tint);
  gl_Position=vec4(pos,0.,1.);
  gl_PointSize=vSize*max(1.,uResolution.y/900.);
}`;

export const STAR_FRAG = `#version 300 es
precision highp float;
in float vBright;
in float vSize;
in vec3 vColor;
out vec4 o;
void main(){
  vec2 p=gl_PointCoord-0.5;
  float d=length(p);
  float core=smoothstep(0.5,0.1,d);
  float haloAmt=smoothstep(1.8,3.2,vSize);
  float halo=exp(-d*d*10.)*0.3*haloAmt;
  float a=clamp((core+halo)*vBright,0.,1.);
  o=vec4(vColor,a);
}`;

export const COMPOSITE_FRAG = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uSky;
uniform sampler2D uStars;
uniform vec2 uSkyOffset;
void main(){
  vec2 skyUv=vUv*0.92+uSkyOffset;
  vec3 sky=texture(uSky,skyUv).rgb;
  vec3 stars=texture(uStars,vUv).rgb;
  o=vec4(sky+stars,1.);
}`;
