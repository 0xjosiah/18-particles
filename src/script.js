import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/8.png')

/**
 * Particles
 */
// Geometry
// const particleGeometry = new THREE.SphereGeometry(1, 32, 32)
const particleGeometry = new THREE.BufferGeometry();
const count = 20000;

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - .5) * 10
    colors[i] = Math.random()
}

particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

particleGeometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(colors, 3)
)

// Material
const particleMaterial = new THREE.PointsMaterial({
    size: .1,
    sizeAttenuation: true, // adds perspective to particles, if close to cam - looks big, far - looks small
    // color: 0xff88cc,
    alphaMap: particleTexture,
    transparent: true,
    /**
     * these help with depth issues with particles
     */
    // alphaTest: .001,
    // depthTest: false, // typically only words with one color and one particle in scene, adding more colors/geometries will mess this up
    depthWrite: false,
    // blending: THREE.AdditiveBlending, // this can impact performance
    vertexColors: true,

})

// Points
const particles = new THREE.Points( particleGeometry, particleMaterial )
scene.add(particles)

// Test Box
// const box = new THREE.Mesh(
//     new THREE.BoxGeometry(),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(box)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Particles
    // particles.rotation.y = Math.sin(elapsedTime * .25)
    // particles.rotation.x = (elapsedTime * .5)
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particleGeometry.attributes.position.array[i3 + 0]
        particleGeometry.attributes.position.array[i3 + 1] = Math.cos(elapsedTime + x)
        const y = particleGeometry.attributes.position.array[i3 + 1]
        particleGeometry.attributes.position.array[i3 + 0] = Math.tan(elapsedTime + x)
    }
    particleGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()