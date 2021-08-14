import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { getEngineState } from "../../stores";
import _ from "lodash";
import { Graphics } from "@inlet/react-pixi";

export const AreasSpellsEffectsManager = () => {
  const engineState = useSelector(getEngineState);
  const areaSpellsEffects = engineState.areaTimeEffects.data;

  const drawAreasSpellsEffects = useCallback(
    (g) => {
      g.clear();
      _.map(areaSpellsEffects, (areaSpellEffect: any, index) => {
        g.beginFill(0x333333);
        g.drawCircle(areaSpellEffect.location.x, areaSpellEffect.location.y, areaSpellEffect.radius);
        g.endFill();
      });
    },
    [areaSpellsEffects]
  );

  return <Graphics draw={drawAreasSpellsEffects} />
}