import * as THREE from 'three';

import {
	acceleratedRaycast,
	computeBoundsTree,
	disposeBoundsTree,
} from 'three-mesh-bvh';

import { Core } from 'elixr';
import { EraseToolSystem } from './js/EraseToolSystem';
import { LineComponent } from './js/components/LineComponent';
import { MultiToolAnimationSystem } from './js/MultiToolAnimationSystem';
import { MultiToolComponent } from './js/components/MultiToolComponent';
import { MultiToolInitSystem } from './js/MultiToolInitSystem';
import { PaintToolSystem } from './js/PaintToolSystem';

// three-mesh-bvh initialization
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const core = new Core(document.getElementById('scene-container'), {}, true);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
core.scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
core.scene.add(directionalLight);

core.registerGameComponent(MultiToolComponent);
core.registerGameComponent(LineComponent);
core.registerGameSystem(MultiToolInitSystem);
core.registerGameSystem(MultiToolAnimationSystem);
core.registerGameSystem(PaintToolSystem);
core.registerGameSystem(EraseToolSystem);
// document.body.append(core.vrButton);
document.body.append(core.arButton);
