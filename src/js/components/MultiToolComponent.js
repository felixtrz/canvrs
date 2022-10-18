import { GameComponent, Types } from 'elixr';

export class MultiToolComponent extends GameComponent {}

MultiToolComponent.MODES = {
	PAINT: 0,
	ERASE: 1,
};

MultiToolComponent.COLORS = [
	0xffffff,
	0xff1616,
	0xff914d,
	0xffde59,
	0x7ed957,
	0x5271ff,
	0x8c52ff,
	0x7f00ff,
	0x000000,
];

MultiToolComponent.ERASER_SIZES = [0.002, 0.004, 0.008];

MultiToolComponent.MAX_POINTS_PER_LINE = 5000;

MultiToolComponent.POINTS_MIN_DISTANCE = 0.001;

MultiToolComponent.schema = {
	tip: { type: Types.Ref },
	eraser: { type: Types.Ref },
	colorIndicator: { type: Types.Ref },
	button: { type: Types.Ref },
	stick: { type: Types.Ref },
	mode: { type: Types.Number },
	color: { type: Types.Number },
	lastPoint: { type: Types.Ref },
	currentLine: { type: Types.Ref },
	eraserSize: { type: Types.Number },
};
