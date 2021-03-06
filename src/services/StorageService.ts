class StorageService {

    private storage: Storage;

    constructor(serviceLevel: string) {
        if (serviceLevel !== 'session' && serviceLevel !== 'local') {
            throw new Error(`Storage service level should be \'session\' or \'local\'. ${serviceLevel}
             is not a valid identifier`);
        }

        this.storage = serviceLevel === 'local' ? window.localStorage : window.sessionStorage;
    }


    /**
     * Check if localStorage has an Item / exists with the give key
     * @param key the key of the Item
     */
    hasItem(key: string): boolean {
        return this.storage.getItem(key) !== null;
    }

    put(key: string, value: any) {
        this.storage.setItem(key, value);
    }

    add(key: string, value: any) {
        let array: Array<any> = this.getArray(key);
        array.push(value);
        this.storage.setItem(key, JSON.stringify(array));
    }

    addAll(key: string, values: Array<any>) {
        let array: Array<any> = this.getArray(key);
        array = array.concat((values));
        this.storage.setItem(key, JSON.stringify(array));
    }

    setArray(key: string, values: Array<any>) {
        this.storage.setItem(key, JSON.stringify(values));
    }


    getArray(key: string) {
        let item = this.storage.getItem(key);
        if (!item) {
            return [];
        } else {
            return JSON.parse(item);
        }
    }
}
export default StorageService;

