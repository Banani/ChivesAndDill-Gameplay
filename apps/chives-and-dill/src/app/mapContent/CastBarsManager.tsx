import React, { useCallback } from 'react';
import { CastBar } from '../mapContent/CastBar';
import { useSelector } from 'react-redux';
import { selectSpellChannels } from "../../stores";
import _ from 'lodash';

export const CastBarsManager = () => {
   const spellChannels = useSelector(selectSpellChannels);

   const renderCastBars = useCallback(() => _.map(spellChannels, (_, i) => <CastBar playerId={i} castBarData={spellChannels[i]} />), [spellChannels]);

   return <>{renderCastBars()}</>;
};
