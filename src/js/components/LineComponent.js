import { GameComponent, Types } from 'elixr';

export class LineComponent extends GameComponent {}

LineComponent.schema = {
	boundingBox3: { type: Types.Ref },
};
