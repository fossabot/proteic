export default class Injector {

    private static registery: { [key: string]: any } = {};

    static getRegistered(key: string) {
        let registered = Injector.registery[key];
        if (registered) {
            return registered;
        } else {
            throw new Error(`Error: ${key} was not registered.`);
        }
    }

    static register(key: string, value: any) {
        let registered = Injector.registery[key];
        Injector.registery[key] = value;
    }
}

function injectMethod(...keys: string[]) {
    return (target: any, key: string, descriptor: any) => {
        let originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            let add = keys.map((key: string) => Injector.getRegistered(key));
            args = args.concat(add);

            let result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
}

function injectProperty(...keys: string[]) {
    return (target: any, key: string) => {
        target[key] = Injector.getRegistered(keys[0]);
    };
}

export function inject(...keys: string[]) {
    return (...args: any[]) => {
        let params = [];
        for (let i = 0; i < args.length; i++) {
            args[i] ? params.push(args[i]) : null
        }
        switch (params.length) {
            case 2:
                return injectProperty(keys[0]).apply(this, args);
            case 3:
                return injectMethod(...keys).apply(this, args);
            default:
                throw new Error("Decorators are not valid here!");
        }
    };
}