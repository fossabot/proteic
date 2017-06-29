export default class GlobalInjector {

    private static registery: { [key: string]: any } = {};

    public static getRegistered(key: string) {
        let registered = GlobalInjector.registery[key];
        if (registered) {
            return registered;
        } else {
            throw new Error(`Error: ${key} was not registered.`);
        }
    }

    public static register(key: string, value: any) {
        let registered = GlobalInjector.registery[key];
        GlobalInjector.registery[key] = value;
    }
}

function injectMethod(...keys: string[]) {
    return (target: any, key: string, descriptor: any) => {
        let originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            let add = keys.map((k: string) => GlobalInjector.getRegistered(k));
            args = args.concat(add);

            let result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
}

function injectProperty(...keys: string[]) {
    return (target: any, key: string) => {
        target[key] = GlobalInjector.getRegistered(keys[0]);
    };
}

export function inject(...keys: string[]) {
    return (...args: any[]) => {
        let params = [];
        for (let i = 0; i < args.length; i++) {
            if (args[i]) {
                params.push(args[i]);
            }
        }
        switch (params.length) {
            case 2:
                return injectProperty(keys[0]).apply(this, args);
            case 3:
                return injectMethod(...keys).apply(this, args);
            default:
                throw new Error('Decorators are not valid here!');
        }
    };
}
