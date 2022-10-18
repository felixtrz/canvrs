import * as THREE from 'three';

import { BUTTONS } from 'gamepad-wrapper';
import { LineComponent } from './components/LineComponent';
import { MultiToolComponent } from './components/MultiToolComponent';
import { XRGameSystem } from 'elixr';

export class EraseToolSystem extends XRGameSystem {
	update() {
		const primaryController = this.core.controllers['right'];
		if (!primaryController || !primaryController.gamepad.gamepad.buttons[7])
			return;

		this.queryGameObjects('multiTool').forEach((gameObject) => {
			const multiToolComponent = gameObject.getMutableComponent(
				MultiToolComponent,
			);

			multiToolComponent.eraser.visible =
				multiToolComponent.mode == MultiToolComponent.MODES.ERASE;

			if (!multiToolComponent.eraser.visible) return;

			if (
				primaryController.gamepad.getButtonDown(BUTTONS.XR_STANDARD.BUTTON_1)
			) {
				let sizeIndex = MultiToolComponent.ERASER_SIZES.indexOf(
					multiToolComponent.eraserSize,
				);
				sizeIndex = (sizeIndex + 1) % MultiToolComponent.ERASER_SIZES.length;
				multiToolComponent.eraserSize =
					MultiToolComponent.ERASER_SIZES[sizeIndex];
				multiToolComponent.eraser.scale.setScalar(
					multiToolComponent.eraserSize /
						multiToolComponent.eraser.userData.baseSize,
				);
			}

			const pressure = primaryController.gamepad.getButtonValueByIndex(7);
			if (pressure > 0.02) {
				const currentPoint = multiToolComponent.tip.getWorldPosition(
					new THREE.Vector3(),
				);
				const tempVec = new THREE.Vector3();
				this.queryGameObjects('lines').forEach((gameObject) => {
					const lineComponent = gameObject.getComponent(LineComponent);
					if (lineComponent.boundingBox3.containsPoint(currentPoint)) {
						const lineMesh = gameObject.children[0];
						for (let i = 0; i < lineMesh.geometry.drawRange.count; i++) {
							const positions = lineMesh.geometry.attributes.position.array;
							tempVec.x = positions[i * 3];
							tempVec.y = positions[i * 3 + 1];
							tempVec.z = positions[i * 3 + 2];
							if (
								currentPoint.distanceTo(tempVec) <=
								multiToolComponent.eraserSize
							) {
								gameObject.destroy();
								break;
							}
						}
					}
				});
			}
		});
	}
}

EraseToolSystem.queries = {
	multiTool: { components: [MultiToolComponent] },
	lines: { components: [LineComponent] },
};
