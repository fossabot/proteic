export function fitArrayByOldAndNewValue(newData: Array<any>, oldData: Array<any>, size: number) {
    if (size < 0 || newData.length <= 0 || !oldData) {
        throw Error(`Invalid parameters: size  ${size}, newData: ${newData}, oldData: ${oldData}`);
    }

    let array = new Array<any>();
    while (array.length < size) {
        let value = newData.pop();
        if (value === undefined) {
            value = oldData.pop();
        }
        if (value === undefined) {
            break;
        } else {
            array.push(value);
        }
    }

    return array.reverse();
}
