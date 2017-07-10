export default class Injector {

    /**
     * Maps values by their injectionKey.
     *
     * @type {{ string: * }}
     */
    private valuesByInjectionKey: { [injectionKey: string]: any } = {};

    /**
     * Associate an injectionKey with a value so that when Injector#instantiate is
     * invoked the supplied value will be injected into properties of the target Class
     * decorated with the `@inject` decorator.
     *
     * @param {string} injectionKey - Key of the injected value
     * @param {*} value - Value to be injected
     * @returns {void}
     */
    public mapValue(injectionKey: string, value: any): void {
        this.valuesByInjectionKey[injectionKey] = value;
    }

    /**
     * Create a new instance of the supplied Class fulfilling any property injections
     * which are present in the injectionRules map.
     *
     * @param {function} clazz - Class to be instanciated
     * @returns {T} Instance of the Class
     */
    // instantiate<T extends Injectable>(clazz: { new (...args: any[]): T }): T {
    public instantiate<T>(clazz: { new (...args: any[]): T }): T {

        // Start by creating a new instance of the target clazz.
        const instance: any = new clazz();

        // Loop through all properties decorated with `@inject()` in this clazz and
        // try to satisfy them if there is a mapped value.
        for (let injectionPoint of this.getInjectionPoints(clazz)) {
            const injectionValue: any = this.valuesByInjectionKey[injectionPoint.injectionKey];

            // Perform the injection if we have a value assigned to this injectionKey.
            if (injectionValue) {
                instance[injectionPoint.propertyName] = injectionValue;
            }

        }
        return instance;
    }

    private getInjectionPoints<T>(clazz: { __inject__?: { [prop: string]: string } }): Array<InjectionPoint> {
        let result: Array<InjectionPoint> = [];

        // Retrieve the `__inject__` hash created by the @inject decorator from the
        // target Class.
        if (clazz.hasOwnProperty('__inject__')) {
            result = Object.keys(clazz.__inject__)
                .map((propertyName: string) => {
                    return {
                        propertyName: propertyName,
                        injectionKey: clazz.__inject__[propertyName]
                    };
                });
        }

        return result;
    }
}

interface InjectionPoint {
    propertyName: string;
    injectionKey: string;
}
