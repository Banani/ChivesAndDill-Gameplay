import React, { useCallback } from "react";
import { CastBar } from '../mapContent/CastBar';
import { useSelector } from "react-redux";
import { selectActiveSpellsCasts } from "../../stores";
import _ from "lodash";

export const CastBarsManager = () => {
  const activeSpellsCasts = useSelector(selectActiveSpellsCasts);

  const renderCastBars = useCallback(
    () => _.map(activeSpellsCasts, (spellCast, i) => <CastBar playerId={i} />),
    [activeSpellsCasts]
  );

  return <>
    {renderCastBars()}
  </>

}