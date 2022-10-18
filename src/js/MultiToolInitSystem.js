import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GameSystem } from 'elixr';
import { MultiToolComponent } from './components/MultiToolComponent';

export class MultiToolInitSystem extends GameSystem {
	init() {
		this.assetLoaded = false;
		this.multiToolGameObject = null;
	}

	update() {
		if (!this.assetLoaded) {
			new GLTFLoader().load(
				// resource URL
				'assets/pen.glb',
				// called when the resource is loaded
				(gltf) => {
					const rootObject = gltf.scene.children[0];
					const color = MultiToolComponent.COLORS[0];
					const eraserSize = MultiToolComponent.ERASER_SIZES[0];
					const tip = rootObject.getObjectByName('tip');
					tip.material = new THREE.MeshBasicMaterial({ color });
					const colorIndicator = rootObject.getObjectByName('color_indicator');
					colorIndicator.material = tip.material;
					const button = rootObject.getObjectByName('button');
					button.userData.minVec = rootObject.getObjectByName(
						'button_min',
					).position;
					button.userData.maxVec = rootObject.getObjectByName(
						'button_max',
					).position;

					const stick = rootObject.getObjectByName('stick');
					stick.userData.minVec = rootObject.getObjectByName(
						'stick_min',
					).position;
					stick.userData.maxVec = rootObject.getObjectByName(
						'stick_max',
					).position;
					const eraser = new THREE.Mesh(
						new THREE.SphereGeometry(eraserSize, 8, 6),
						new THREE.MeshBasicMaterial({ color: 0xffffff }),
					);
					eraser.position.copy(tip.position);
					eraser.userData.baseSize = eraserSize;
					rootObject.add(eraser);
					this.multiToolGameObject = this.core.createGameObject(rootObject);
					this.multiToolGameObject.addComponent(MultiToolComponent, {
						tip,
						eraser,
						colorIndicator,
						button,
						stick,
						mode: MultiToolComponent.MODES.PAINT,
						color,
						eraserSize,
					});
				},
			);
			this.assetLoaded = true;
		}

		const primaryController = this.core.controllers['right'];
		if (primaryController && this.multiToolGameObject) {
			primaryController.gripSpace.add(this.multiToolGameObject);
			primaryController.model.visible = false;
			this.stop();
		}
	}
}
