import { AXES, BUTTONS } from 'gamepad-wrapper';

import { MultiToolComponent } from './components/MultiToolComponent';
import { XRGameSystem } from 'elixr';

export class MultiToolAnimationSystem extends XRGameSystem {
	update() {
		const primaryController = this.core.controllers['right'];
		if (!primaryController) return;

		this.queryGameObjects('multiTool').forEach((gameObject) => {
			const multiToolComponent = gameObject.getMutableComponent(
				MultiToolComponent,
			);

			if (
				primaryController.gamepad.getButtonDown(BUTTONS.XR_STANDARD.BUTTON_2)
			) {
				multiToolComponent.mode = 1 - multiToolComponent.mode;
			}

			multiToolComponent.button.position.lerpVectors(
				multiToolComponent.button.userData.minVec,
				multiToolComponent.button.userData.maxVec,
				primaryController.gamepad.getButtonValue(BUTTONS.XR_STANDARD.BUTTON_1),
			);

			multiToolComponent.stick.position.lerpVectors(
				multiToolComponent.stick.userData.minVec,
				multiToolComponent.stick.userData.maxVec,
				(primaryController.gamepad.getAxis(AXES.XR_STANDARD.THUMBSTICK_X) + 1) /
					2,
			);
		});
	}
}

MultiToolAnimationSystem.queries = {
	multiTool: { components: [MultiToolComponent] },
};
