export function throwError(e: any) {
    let i, message;
    for (i in e) {
        message += i + ':' + e[i] +'\n';
    }
    alert(message);
    throw new Error('Error: ' + e);
}
