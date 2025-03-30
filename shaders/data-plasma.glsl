uniform float time;
uniform float intensity;
uniform float dataFlowSpeed;
uniform vec3 colorPrimary;
uniform vec3 colorSecondary;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  
  // Apply subtle vertex displacement based on time
  float displacement = sin(position.x * 5.0 + time) * 
                      sin(position.y * 5.0 + time) * 
                      sin(position.z * 5.0 + time) * 0.1 * intensity;
  
  vec3 newPosition = position + normal * displacement;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}

// Fragment shader
uniform float time;
uniform float intensity;
uniform float dataFlowSpeed;
uniform vec3 colorPrimary;
uniform vec3 colorSecondary;
uniform float upvotes;
uniform sampler2D dataSampler;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// Noise functions
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  // Smooth interpolation
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) +
          (c - a) * u.y * (1.0 - u.x) +
          (d - b) * u.x * u.y;
}

// Fractal Brownian Motion
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 0.0;
  
  // Loop of octaves
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(st);
    st *= 2.0;
    amplitude *= 0.5;
  }
  
  return value;
}

// Create data flow effect
vec3 dataFlow(vec2 uv, float time, float speed) {
  // Sample data texture if available, otherwise use procedural pattern
  vec4 dataColor = texture2D(dataSampler, uv);
  
  // Create flowing data patterns
  float flowPattern = fbm(uv * 5.0 + time * speed * 0.1);
  
  // Create data "veins"
  float veins = max(0.0, 1.0 - abs(sin(uv.x * 20.0 + flowPattern * 5.0) * 
                                   sin(uv.y * 20.0 + time * speed)));
  veins = smoothstep(0.7, 1.0, veins) * 0.5;
  
  // Create data "pulses"
  float pulse = sin(time * speed + flowPattern * 10.0) * 0.5 + 0.5;
  
  // Combine effects
  float dataEffect = flowPattern * 0.5 + veins * pulse;
  
  // Mix colors based on data effect
  vec3 finalColor = mix(colorSecondary, colorPrimary, dataEffect);
  
  // Add glow based on data intensity
  float glow = sin(time * speed * 0.5) * 0.5 + 0.5;
  finalColor += colorPrimary * glow * 0.2;
  
  // Apply upvote supernova effect
  if (upvotes > 50.0) {
    float supernovaSize = min(1.0, upvotes / 200.0);
    float distFromCenter = length(uv - vec2(0.5));
    float supernova = smoothstep(supernovaSize, 0.0, distFromCenter) * 
                      (sin(time * 2.0) * 0.5 + 0.5);
    
    finalColor += colorPrimary * supernova * 2.0;
  }
  
  return finalColor;
}

// Edge detection for circuit-like patterns
float edgeDetection(vec2 uv, float time) {
  float edge = 0.0;
  float cellSize = 0.1;
  
  // Create grid
  vec2 grid = fract(uv / cellSize);
  
  // Create edges
  edge = max(edge, (1.0 - abs(grid.x - 0.5) * 2.0) * (1.0 - abs(grid.y - 0.5) * 2.0));
  
  // Animate edges
  edge *= sin(time + uv.x * 10.0 + uv.y * 10.0) * 0.5 + 0.5;
  
  return smoothstep(0.9, 1.0, edge);
}

void main() {
  // Calculate rim lighting for holographic effect
  float rimLight = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
  rimLight = pow(rimLight, 3.0) * intensity;
  
  // Generate data plasma effect
  vec3 dataPlasma = dataFlow(vUv, time, dataFlowSpeed);
  
  // Add circuit patterns
  float circuits = edgeDetection(vUv, time * 0.2) * 0.5;
  
  // Combine effects
  vec3 finalColor = dataPlasma + colorPrimary * rimLight + colorSecondary * circuits;
  
  // Add subtle pulsing glow
  float pulse = sin(time * 0.5) * 0.5 + 0.5;
  finalColor += colorPrimary * pulse * 0.1;
  
  // Apply final intensity
  finalColor *= intensity;
  
  // Output final color with alpha
  gl_FragColor = vec4(finalColor, 0.9);
}

