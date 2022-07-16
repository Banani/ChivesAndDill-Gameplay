import React, { useCallback } from 'react';
import { CastBar } from '../mapContent/CastBar';
import _ from 'lodash';

export const CastBarsManager = ({ location, spellChannels }) => {
   const renderCastBars = _.map(spellChannels, (_, i) => <CastBar playerId={i} location={location} castBarData={spellChannels[i]} />);

   return <>{renderCastBars}</>;
};
