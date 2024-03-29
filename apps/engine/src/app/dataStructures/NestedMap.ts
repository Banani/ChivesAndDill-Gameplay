import { keyBy, map, mapValues, pickBy } from 'lodash';

export class NestedMap<NavigationObject> {
    private increment = 0;
    private prefix = '';
    private navigationObjectsMap: Record<string, NavigationObject> = {};
    private pathToObjects: any = {};
    private navigationProperties: string[];

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    private buildID = () => {
        return `${this.prefix}_${++this.increment}`;
    };

    getElement = (navigationObject: NavigationObject) => {
        let currentParent = this.pathToObjects;

        if (!this.navigationProperties) {
            return null;
        }

        for (const navigationProp of this.navigationProperties) {
            const navigationValue = navigationObject[navigationProp];
            if (!currentParent[navigationValue]) {
                return null;
            }

            currentParent = currentParent[navigationValue];
        }

        return currentParent;
    };

    getOrCreateElement = (navigationObject: NavigationObject, value: any) => {
        if (!this.navigationProperties) {
            this.navigationProperties = Object.keys(navigationObject);
        }

        const element = this.getElement(navigationObject);

        if (!element) {
            this.createElement(navigationObject, value);
            return this.getElement(navigationObject);
        }

        return element;
    };

    updateElementById = (id: string, value: any) => {
        this.updateElement(this.navigationObjectsMap[id], value);
    };

    updateElement = (navigationObject: NavigationObject, value: any) => {
        const element = this.getElement(navigationObject);
        element.value = value;
    };

    createElement = (navigationObject: NavigationObject, value: any) => {
        if (!this.navigationProperties) {
            this.navigationProperties = Object.keys(navigationObject);
        }

        const id = this.buildID();
        this.navigationObjectsMap[id] = navigationObject;

        let currentParent = this.getElement(navigationObject);
        if (currentParent) {
            this.removeElementById(currentParent.id);
        }

        currentParent = this.pathToObjects;
        for (const navigationProp of this.navigationProperties) {
            const navigationValue = navigationObject[navigationProp];
            if (!currentParent[navigationValue]) {
                currentParent[navigationValue] = {};
            }

            currentParent = currentParent[navigationValue];
        }
        currentParent.id = id;
        currentParent.value = value;

        return currentParent;
    };

    removeElementById = (id: string) => {
        const objectsToClear = [];

        let current = this.pathToObjects
        for (let navigationProperty of this.navigationProperties.slice(0, this.navigationProperties.length - 1)) {
            // Zapisuje sobie droge do wyczyszczenia, jesli jakis obiekt nie ma dzieci to go usuwam
            objectsToClear.push({
                object: current,
                key: this.navigationObjectsMap[id][navigationProperty]
            })
            current = current[this.navigationObjectsMap[id][navigationProperty]];
        }

        // kasuje element
        delete current[this.navigationObjectsMap[id][this.navigationProperties[this.navigationProperties.length - 1]]]

        // czyszcze jego rodzicow jesli jest taka potrzeba
        for (let i = objectsToClear.length - 1; i >= 0; i--) {
            if (Object.keys(objectsToClear[i].object[objectsToClear[i].key]).length === 0) {
                delete objectsToClear[i].object[objectsToClear[i].key];
            } else {
                break;
            }
        }

        delete this.navigationObjectsMap[id];
    };

    getElementsByCriteriaMatchAll = (criteria: Partial<NavigationObject>) => {
        let navigationObjects = this.navigationObjectsMap;
        for (let i in criteria) {
            navigationObjects = pickBy(navigationObjects, (navObj) => navObj[i] === criteria[i]);
        }

        return mapValues(keyBy(map(navigationObjects, this.getElement), 'id'), 'value');
    };
}
