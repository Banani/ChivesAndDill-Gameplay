import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectAreaSpellsEffects } from "../../stores";
import _ from "lodash";
import { Graphics } from "@inlet/react-pixi";

export const AreasSpellsEffectsManager = () => {
  const areaSpellsEffects = useSelector(selectAreaSpellsEffects);

  const drawAreasSpellsEffects = useCallback(
    (g) => {
      g.clear();
      _.map(areaSpellsEffects, (areaSpellEffect: any, index) => {
        g.beginFill(0x333333);
        g.drawCircle(areaSpellEffect.location.x, areaSpellEffect.location.y, areaSpellEffect.effect.radius);
        g.endFill();
      });
    },
    [areaSpellsEffects]
  );

  return <Graphics draw={drawAreasSpellsEffects} />
}