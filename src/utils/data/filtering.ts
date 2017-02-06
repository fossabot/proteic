
export function discardProperties(data: Array<any>, properties: string[]) {
    if (!properties || !properties.length) {
        return;
    }
    for (let i = 0; i < data.length; i++) {
        let register = data[i];
        discardPropertiesObject(register, properties);
    }
};

export function discardPropertiesObject(object: any, properties: string[]) {
    for (let p of properties) {
        delete object[p];
    }
}