import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getEngineState } from "../../stores";
import _ from "lodash";

export const GetAbsorbsValue = (playerId) => {
  const engineState = useSelector(getEngineState);

  const [activeShields, setActiveShields] = useState(0);
  const [absorbSpells, setAbsorbSpells] = useState([]);

  useEffect(() => {
    const playerAbsorbSpells = _.filter(engineState.absorbShields.data, function (value, key) {
       return value.ownerId === playerId;
    });
    setAbsorbSpells(new Array(...playerAbsorbSpells));
 }, [engineState.absorbShields.data, playerId]);

 useEffect(() => {
    if (absorbSpells.length) {
       absorbSpells.forEach((key) => {
          setActiveShields(key.value);
       });
    } else {
       setActiveShields(0);
    }
 }, [absorbSpells]);

 return activeShields;
}