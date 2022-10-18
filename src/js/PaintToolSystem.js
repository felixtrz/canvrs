import * as THREE from 'three';

import { BUTTONS } from 'gamepad-wrapper';
import { LineComponent } from './components/LineComponent';
import { MultiToolComponent } from './components/MultiToolComponent';
import { XRGameSystem } from 'elixr';

const BUFFER_VEC = new THREE.Vector3(0.002, 0.002, 0.002);

export class PaintToolSystem extends XRGameSystem {
	update() {
		const primaryController = this.core.controllers['right'];
		if (!primaryController || !primaryController.gamepad.gamepad.buttons[7])
			return;

		this.queryGameObjects('multiTool').forEach((gameObject) => {
			const multiToolComponent = gameObject.getMutableComponent(
				MultiToolComponent,
			);

			multiToolComponent.tip.visible =
				multiToolComponent.mode == MultiToolComponent.MODES.PAINT;

			if (!multiToolComponent.tip.visible) return;

			if (
				primaryController.gamepad.getButtonDown(BUTTONS.XR_STANDARD.BUTTON_1)
			) {
				let colorIndex = MultiToolComponent.COLORS.indexOf(
					multiToolComponent.color,
				);
				colorIndex = (colorIndex + 1) % MultiToolComponent.COLORS.length;
				multiToolComponent.color = MultiToolComponent.COLORS[colorIndex];
				multiToolComponent.tip.material.color.setHex(multiToolComponent.color);
			}

			const pressure = primaryController.gamepad.getButtonValueByIndex(7);
			if (pressure > 0.02) {
				const currentPoint = multiToolComponent.tip.getWorldPosition(
					new THREE.Vector3(),
				);
				if (multiToolComponent.lastPoint) {
					if (!multiToolComponent.currentLine) {
						this._createNewLine(multiToolComponent);
					}
					this._updatePoints(multiToolComponent, currentPoint);
				}
				multiToolComponent.lastPoint = currentPoint;
			} else {
				multiToolComponent.currentLine = null;
			}
		});
	}

	_createNewLine(multiToolComponent) {
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(
			MultiToolComponent.MAX_POINTS_PER_LINE * 3,
		); // 3 vertices per point
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.setDrawRange(0, 0);
		const material = multiToolComponent.tip.material.clone();
		const lineMesh = new THREE.Line(geometry, material);
		multiToolComponent.currentLine = this.core.createGameObject(lineMesh);
		multiToolComponent.currentLine.addComponent(LineComponent);
		lineMesh.frustumCulled = false;
	}

	_updatePoints(multiToolComponent, newPoint) {
		const lineMesh = multiToolComponent.currentLine.children[0];
		const drawCount = lineMesh.geometry.drawRange.count;
		if (drawCount >= MultiToolComponent.MAX_POINTS_PER_LINE) {
			this._createNewLine(multiToolComponent);
		}

		if (
			newPoint.distanceTo(multiToolComponent.lastPoint) >=
			MultiToolComponent.POINTS_MIN_DISTANCE
		) {
			const lineComponent = multiToolComponent.currentLine.getMutableComponent(
				LineComponent,
			);
			if (!lineComponent.boundingBox3) {
				lineComponent.boundingBox3 = new THREE.Box3(
					newPoint.clone(),
					newPoint.clone(),
				);
			} else {
				lineComponent.boundingBox3.expandByPoint(
					new THREE.Vector3().addVectors(newPoint, BUFFER_VEC),
				);
				lineComponent.boundingBox3.expandByPoint(
					new THREE.Vector3().subVectors(newPoint, BUFFER_VEC),
				);
			}
			const positions = lineMesh.geometry.attributes.position.array;
			let index = lineMesh.geometry.drawRange.count * 3;
			positions[index++] = newPoint.x;
			positions[index++] = newPoint.y;
			positions[index++] = newPoint.z;
			lineMesh.geometry.attributes.position.needsUpdate = true;
			lineMesh.geometry.setDrawRange(0, drawCount + 1);
		}
	}
}

PaintToolSystem.queries = {
	multiTool: { components: [MultiToolComponent] },
};
