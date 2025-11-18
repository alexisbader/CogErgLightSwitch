import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function STLViewer({ stlFile, isVisible }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const meshRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(-10, -10, -5);
    scene.add(pointLight);

    // Add a hemisphere light for better overall illumination
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    scene.add(hemisphereLight);


    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controlsRef.current = controls;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!stlFile || !sceneRef.current) return;

    setLoading(true);
    setError(null);

    // Remove existing mesh
    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      meshRef.current.material.dispose();
    }

    const loader = new STLLoader();
    const stlUrl = `/stl/${stlFile.name}`;

    loader.load(
      stlUrl,
      (geometry) => {
        // Compute normals for proper lighting
        geometry.computeVertexNormals();
        
        // Create material
        const material = new THREE.MeshLambertMaterial({
          color: 0x4ecdc4,
          transparent: false,
          opacity: 1.0
        });

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Center the geometry
        geometry.computeBoundingBox();
        const center = geometry.boundingBox.getCenter(new THREE.Vector3());
        geometry.translate(-center.x, -center.y, -center.z);
        
        // Scale to fit in view
        const size = geometry.boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        mesh.scale.setScalar(scale);

        // Reset camera to look at the new mesh
        if (cameraRef.current) {
          cameraRef.current.position.set(5, 5, 5);
          cameraRef.current.lookAt(0, 0, 0);
        }

        sceneRef.current.add(mesh);
        meshRef.current = mesh;
        setLoading(false);
      },
      (progress) => {
        // Progress callback - can be used for loading indicators
      },
      (error) => {
        console.error('Error loading STL:', error);
        setError('Failed to load STL file');
        setLoading(false);
      }
    );
  }, [stlFile]);

  if (!isVisible) {
    return (
      <div className="flex-1 bg-gray-50 rounded-lg border-2 border-gray-200 p-5 flex flex-col min-h-[500px]">
        <h3 className="m-0 mb-4 text-gray-800 text-base font-semibold">3D Viewer</h3>
        <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-md border-2 border-dashed border-gray-300 text-gray-600 text-center p-10 min-h-[400px]">
          <p className="my-1 text-sm">🔧 3D STL Viewer</p>
          <p className="my-1 text-sm">Select an STL file to view it in 3D</p>
        </div>
      </div>
    );
  }

  // Show placeholder when no STL file is selected
  if (!stlFile) {
    return (
      <div className="flex-1 bg-gray-50 rounded-lg border-2 border-gray-200 p-5 flex flex-col min-h-[500px]">
        <h3 className="m-0 mb-4 text-gray-800 text-base font-semibold">3D Room Layout Reference</h3>
        <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-md border-2 border-dashed border-gray-300 text-gray-600 text-center p-10 min-h-[400px]">
          <p className="my-1 text-sm">🏠 3D Room Layout</p>
          <p className="my-1 text-sm">Loading room layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 rounded-lg border-2 border-gray-200 p-5 flex flex-col min-h-[500px]">
      <h3 className="m-0 mb-4 text-gray-800 text-base font-semibold">
        3D Viewer{stlFile ? ` - ${stlFile.name}` : ''}
      </h3>
      <div className="flex-1 bg-white rounded-md border-2 border-gray-300 overflow-hidden relative min-h-[400px]">
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/90 flex flex-col justify-center items-center z-10">
            <div className="inline-block w-5 h-5 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mr-2.5"></div>
            <p className="text-sm">Loading STL file...</p>
          </div>
        )}
        {error && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/90 flex justify-center items-center z-10 text-red-500 font-semibold">
            <p>❌ {error}</p>
          </div>
        )}
        <div ref={mountRef} className="w-full h-[400px] relative"></div>
      </div>
      {stlFile && (
        <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
          <p className="my-1 text-sm text-gray-800"><strong>File:</strong> {stlFile.name}</p>
          <p className="my-1 text-sm text-gray-800"><strong>Description:</strong> {stlFile.description}</p>
          <div className="mt-2.5 pt-2.5 border-t border-gray-200">
            <small className="text-gray-600 text-xs">
              🖱️ Left click + drag to rotate • Scroll to zoom • Right click + drag to pan
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

export default STLViewer;
