
export const Utils = {
    determineOrigin: function (url: string): string {
        const a = document.createElement('a');
        a.href = url;
        const protocol = a.protocol;
        let host = a.host;
        if ('http:' === protocol) {
            host = host.replace(/:80$/, '');
        } else if ('https:' === protocol) {
            host = host.replace(/:443$/, '');
        }
        return protocol + '//' + host;
    },

    urlEncodeQueryString: function (
        o: any,
        name?: string
    ): string {
        const queryParts = [] as string[];
        Object.keys(o).forEach(key => {
            const val = o[key];
            const nested = name ? name + '[' + key + ']' : key;
            if (val) {
                if (typeof val === 'object') {
                    const encoded = this.urlEncodeQueryString(val, nested);
                    if (encoded !== '') {
                        queryParts.push(encoded);
                    }
                } else {
                    queryParts.push(nested + '=' + encodeURIComponent(String(val)));
                }
            }
        });
        return queryParts.join('&').replace(/%20/g, '+');
    },

    compareOrigins: function (
        url1: string,
        url2?: string
    ): boolean {
        const o1 = this.determineOrigin(url1);
        const o2 = url2 && this.determineOrigin(url2);
        return o1 && o2 && o1 === o2;
    },

    filterProperties: function (
        source: any,
        filter: string[],
        remove?: boolean
    ): any {
        const target = {} as any;

        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                const index = filter.indexOf(key);
                if (!remove ? (index >= 0) : (index < 0)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    },

    getFrameByName: function (
        window: Window,
        name: string
    ): HTMLIFrameElement {
        return (window.frames as any)[name] as HTMLIFrameElement;
    },

    getWindowByName(
        window: Window,
        name: string
    ): Window {
        return (window.frames as any)[name] as Window;
    },


    applyClasses: function (
        el: HTMLElement,
        classes: [ string, boolean ][]
    ): void {
        const classesMap: { [key: string]: boolean } = {};
        classes.forEach(cls => cls[0].split(/\s+/).forEach(cl => cl && (classesMap[cl] = classesMap[cl] || cls[1])));
        el.className = this.mergeClassNames(el.className, classesMap);
    },

    mergeClassNames: function (...cls: any[]): string {
        const classesMap = this.mergeClassesArray({}, cls);
        const classes = [];
        for (let key in classesMap) {
            classesMap[key] && classes.push(key);
        }
        return classes.join(' ');
    },


    mergeClassesArray: function (
        map: any,
        classes: any[]
    ): { [key: string]: boolean } {
        for (let len = classes.length, i = 0; i < len; ++i) {
            const c = classes[i];
            if (c) {
                if (typeof c == 'string') {
                    for (let cl = c.split(/\s+/), len = cl.length, i = 0; i < len; i++) {
                        map[cl[i]] = true;
                    }
                } else if (Array.isArray(c)) {
                    this.mergeClassesArray(map, c);
                } else if (typeof c == 'object') {
                    for (let key in c) {
                        c.hasOwnProperty(key) && (map[key] = !!c[key]);
                    }
                } else if (typeof c == 'number') {
                    map[c] = true;
                }
            }
        }

        return map;
    },


    parseFloatFixed: function (value: number): number {
        return parseFloat(value.toFixed(1))
    },
     equals: function (left: any, right: any): boolean {
        if ((typeof left != 'object') || (typeof right != 'object')) {
            return left === right;
        }

        if (null === left || null === right) {
            return left === right;
        }

        const leftisArray = Array.isArray(left);
        if (leftisArray !== Array.isArray(right)) {
            return false;
        }

        const leftIsObject = '[object Object]' === Object.prototype.toString.call(left);
        if (leftIsObject !== ('[object Object]' === Object.prototype.toString.call(right))) {
            return false;
        }
        if (!leftIsObject && !leftisArray) {
            return false;
        }

        const leftKeys = Object.keys(left);
        const rightKeys = Object.keys(right);
        if (leftKeys.length !== rightKeys.length) {
            return false;
        }

        let union = {} as any;
        for (let i = 0; i < leftKeys.length; i++) {
            union[leftKeys[i]] = true;
        }
        for (let i = 0; i < rightKeys.length; i++) {
            union[rightKeys[i]] = true;
        }
        const unionKeys = Object.keys(union);
        if (unionKeys.length !== leftKeys.length) {
            return false;
        }
        return unionKeys.every(key => Utils.equals(left[key], right[key]));
    },


    /**
     * Simple object check.
     * @param item
     * @returns {boolean}
     */
    isObject: function (item: any) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    },

    /**
     * Deep merge two objects.
     * @param target
     * @param ...sources
     */
     mergeObjectsDeep: function (target: any, ...sources: any): any {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeObjectsDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return this.mergeObjectsDeep(target, ...sources);
    }
}
