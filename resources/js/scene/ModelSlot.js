import * as THREE from 'three';
import { palette } from '../config/palette';

/**
 * Hook for swapping in real .glb models later (place files in public/models/).
 * GLTFLoader is imported on demand, so it costs nothing until a model is used.
 *
 * Usage (e.g. in Experience.init):
 *   const tree = await loadModel('/models/tree.glb', { parent: this.scene, scale: 2, position: [4, 0, -6] });
 *
 * @param {string} url
 * @param {{ parent: THREE.Object3D, scale?: number, position?: [number, number, number], brandTint?: boolean }} options
 * @returns {Promise<THREE.Group>}
 */
export async function loadModel(url, { parent, scale = 1, position = [0, 0, 0], brandTint = false }) {
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    const gltf = await new GLTFLoader().loadAsync(url);
    const model = gltf.scene;

    model.scale.setScalar(scale);
    model.position.set(...position);

    if (brandTint) {
        // Optional: pull model materials toward the brand palette so it sits in the scene.
        const tint = new THREE.Color(palette.green);
        model.traverse((child) => {
            if (child.isMesh && child.material?.color) child.material.color.lerp(tint, 0.35);
        });
    }

    parent.add(model);
    return model;
}

/** Free a model's GPU resources when it is removed. */
export function disposeModel(model) {
    model.removeFromParent();
    model.traverse((child) => {
        if (!child.isMesh) return;
        child.geometry.dispose();
        [child.material].flat().forEach((material) => {
            Object.values(material).forEach((value) => value?.isTexture && value.dispose());
            material.dispose();
        });
    });
}
