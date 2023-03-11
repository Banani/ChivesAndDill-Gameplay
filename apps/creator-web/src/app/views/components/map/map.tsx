import { Container, Stage } from '@inlet/react-pixi';
import _, { throttle } from 'lodash';
import * as PIXI from 'pixi.js';
import { Texture } from 'pixi.js';
import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { BLOCK_SIZE } from '../../../consts';
import { PackageContext } from '../../../contexts/packageContext';
import { MapSprite } from './mapSprite/mapSprite';

import { Text } from '@inlet/react-pixi';
import { TextStyle } from 'pixi.js';
import styles from './map.module.scss';
import { MapContext } from './MapContextProvider';

type MapActionStates = Record<
    string,
    {
        onClick?: (e: any) => void;
        onMouseMove?: (e: any) => void;
        onMouseLeave?: (e: any) => void;
    }
>;

interface MapProps {
    mapActionStates: MapActionStates;
    state: string;
}

export const Map: FunctionComponent<MapProps> = ({ mapActionStates, state, children }) => {
    const packageContext = useContext(PackageContext);
    const { setIsMouseDown, setMousePosition, setLastMouseDownPosition, setPreviousTranslation, texturesMap, setTexturesMap, translation, setMapSize } =
        useContext(MapContext);
    const [stage, setStage] = useState<null | HTMLDivElement>(null);
    const [textureLoaded, setTextureLoaded] = useState(false);


    useEffect(() => {
        if (packageContext?.backendStore?.sprites?.data && !textureLoaded) {
            setTextureLoaded(true);
            const output: Record<string, Texture> = {};

            const loader = new PIXI.Loader();
            loader.pre((resource, next) => {
                resource.loadType = PIXI.LoaderResource.LOAD_TYPE.XHR;
                next();
            });
            _.forEach(packageContext?.backendStore?.sprites?.data, (mapElement, key) => {
                const path = mapElement.spriteSheet.indexOf('https') === -1 ? '../../../assets/' + mapElement.spriteSheet : mapElement.spriteSheet;

                if (!loader.resources[mapElement.spriteSheet]) {
                    loader.add({
                        name: mapElement.spriteSheet,
                        url: path,
                        crossOrigin: 'no-cors',
                        loadType: PIXI.LoaderResource.LOAD_TYPE.XHR,
                    });
                }
            });

            loader.add({
                name: 'citizen',
                url: 'assets/citizen.png',
            });
            loader.add({
                name: 'orc',
                url: 'assets/orc.png',
            });

            loader.load((loader, resources) => {
                const citizen = resources['citizen']?.texture?.baseTexture;
                if (citizen) {
                    output['citizen'] = new PIXI.Texture(citizen, new PIXI.Rectangle(0, 0, 60, 60));
                }
                const orc = resources['orc']?.texture?.baseTexture;
                if (orc) {
                    output['orc'] = new PIXI.Texture(orc, new PIXI.Rectangle(0, 0, 60, 60));
                }
                _.forEach(packageContext?.backendStore?.sprites?.data, (mapElement, key) => {
                    const baseTexture = resources[mapElement.spriteSheet]?.texture?.baseTexture;
                    if (baseTexture) {
                        output[key] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(mapElement.x * BLOCK_SIZE + 1, mapElement.y * BLOCK_SIZE + 1, 30, 30));
                    }
                });
                setTexturesMap(output);
            });
        }

    }, [packageContext?.backendStore?.sprites?.data]);

    const mapClick = useCallback(
        (e) => {
            if (mapActionStates[state]) {
                mapActionStates[state].onClick?.(e);
            }
        },
        [state, mapActionStates]
    );

    const onMouseMove = useCallback(
        throttle((e) => {
            setMousePosition({
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY,
            });
            if (mapActionStates[state]) {
                mapActionStates[state].onMouseMove?.(e);
            }
        }, 25),
        [state, mapActionStates]
    );

    const onMouseLeave = useCallback((e) => {
        setMousePosition(null);
        if (mapActionStates[state]) {
            mapActionStates[state].onMouseLeave?.(e);
        }
    }, []);

    useEffect(() => {
        if (stage) {
            setMapSize({ width: stage?.clientWidth, height: stage?.clientHeight })
        }
    }, [stage?.clientWidth, stage?.clientHeight]);

    if (!Object.keys(texturesMap).length || !packageContext?.backendStore?.map || !packageContext.backendStore.npcs) {
        return <></>;
    }

    console.log(packageContext.backendStore.map.data);
    return (
        <div className={styles['stage']} ref={(newRef) => setStage(newRef)}>
            <Stage
                width={stage?.clientWidth ?? 900}
                height={(stage?.clientHeight ?? 600) - 10}
                options={{ backgroundColor: 0x000000, autoDensity: true }}
                onClick={mapClick}
                onMouseDown={(e) => {
                    setLastMouseDownPosition({ x: e.clientX, y: e.clientY });
                    setPreviousTranslation(translation);
                    setIsMouseDown(true);
                }}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
            >
                <Container position={[translation.x, translation.y]}>
                    {_.chain(packageContext.backendStore.map.data)
                        .filter(({ spriteId }) => texturesMap[spriteId])
                        .map(({ x, y, spriteId }, key) => {
                            return <MapSprite key={key} location={{ x, y }} texture={texturesMap[spriteId]} />;
                        })
                        .value()}

                    {_.chain(packageContext.backendStore.npcs.data)
                        .filter(() => texturesMap['citizen'])
                        .map(({ location, npcTemplateId }, key) => {
                            return (
                                <React.Fragment key={key}>
                                    <Text
                                        text={packageContext.backendStore.npcTemplates.data[npcTemplateId]?.name ?? ""}
                                        x={location.x * BLOCK_SIZE + BLOCK_SIZE / 2}
                                        y={location.y * BLOCK_SIZE - 12}
                                        anchor={0.5}
                                        style={
                                            new TextStyle({
                                                align: 'center',
                                                fontFamily: 'Segoe UI',
                                                fontSize: 14,
                                                fill: '#ff6030',
                                            })
                                        }
                                    />
                                    <MapSprite location={location} texture={texturesMap['citizen']} />
                                </React.Fragment>
                            );
                        })
                        .value()}

                    {_.chain(packageContext.backendStore.monsters.data)
                        .filter(() => texturesMap['orc'])
                        .map(({ location, monsterTemplateId }, key) => {
                            return (
                                <React.Fragment key={key}>
                                    <Text
                                        text={packageContext.backendStore.monsterTemplates.data[monsterTemplateId]?.name ?? ""}
                                        x={location.x * BLOCK_SIZE + BLOCK_SIZE / 2}
                                        y={location.y * BLOCK_SIZE - 12}
                                        anchor={0.5}
                                        style={
                                            new TextStyle({
                                                align: 'center',
                                                fontFamily: 'Segoe UI',
                                                fontSize: 14,
                                                fill: '#ff6030',
                                            })
                                        }
                                    />
                                    <MapSprite location={location} texture={texturesMap['orc']} />
                                </React.Fragment>
                            );
                        })
                        .value()}

                    {children}
                </Container>
            </Stage>
        </div>
    );
};
