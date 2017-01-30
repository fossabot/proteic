
export function discardProperties(data: Array<any>, properties: string[]) {
    if (!properties || !properties.length) {
        return;
    }
    for (let i = 0; i < data.length; i++) {
        let register = data[i];
        discardPropertiesObject(register, properties);
    }
    console.log('result', data);
};

export function discardPropertiesObject(object: any, properties: string[]) {
    for (let p of properties) {
        console.log(object, p);
        delete object[p];
                console.log('new', object);

    }
}