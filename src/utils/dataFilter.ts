export function filterByPropAndBBox(data: any, prop: any, range: any) {
  let array = Array();
  for (let i = 0; i < data.length; i++) {
    if (data[i][prop] >= range[0] && data[i][prop] <= range[1]) {
      array.push(data[i]);
    }
  }
  return array;
}
