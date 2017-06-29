export function sortByField (array: Array<any>, field: string): void {
    array.sort((e1, e2) => {
        let a = e1[field];
        let b = e2[field];
        return (a < b) ? -1 : (a > b) ? 1 : 0;   
    });
}
