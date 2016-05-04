/**
 * Colors utility class. Provides scales for each color palette.
 */
class Colors {

  static category1() {
    return d3.scale.ordinal().range(palette_category1);
  }

  static category2() {
    return d3.scale.ordinal().range(palette_category2);
  }

  static category3() {
    return d3.scale.ordinal().range(palette_category3);
  }

  static category4() {
    return d3.scale.ordinal().range(palette_category4);
  }

  static category5() {
    return d3.scale.ordinal().range(palette_category5);
  }

  static category6() {
    return d3.scale.ordinal().range(palette_category6);
  }

  static category7() {
    return d3.scale.ordinal().range(palette_category7);
  }

  static category8() {
    return d3.scale.ordinal().range(palette_category8);
  }

  static sequentialYellow() {
    return d3.scale.linear().range(palette_sequential_yellow);
  }

  static sequentialRedOrange() {
    return d3.scale.linear().range(palette_sequential_red_orange);
  }

  static sequentialRed() {
    return d3.scale.linear().range(palette_sequential_red);
  }

  static sequentialPink() {
    return d3.scale.linear().range(palette_sequential_pink);
  }

  static sequentialPurplePink() {
    return d3.scale.linear().range(palette_sequential_purple_pink);
  }

  static sequentialPurple() {
    return d3.scale.linear().range(palette_sequential_purple);
  }

  static sequentialBlue() {
    return d3.scale.linear().range(palette_sequential_blue);
  }

  static sequentialLightBlue() {
    return d3.scale.linear().range(palette_sequential_lightBlue);
  }

  static sequentialBlueViolet() {
    return d3.scale.linear().range(palette_sequential_blue_violet);
  }

  static sequentialTurquoise() {
    return d3.scale.linear().range(palette_sequential_turquoise);
  }

  static sequentialLightGreen() {
    return d3.scale.linear().range(palette_sequential_lightGreen);
  }

  static sequentialDarkGreen() {
    return d3.scale.linear().range(palette_sequential_darkGreen);
  }

  static sequentialGreenBrown() {
    return d3.scale.linear().range(palette_sequential_green_brown);
  }

  static sequentialBrown() {
    return d3.scale.linear().range(palette_sequential_brown);
  }

  static sequentialGrey() {
    return d3.scale.linear().range(palette_sequential_grey);
  }

  static sequentialVioletCb() {
    return d3.scale.linear().range(palette_sequential_violet_cb);
  }

  static sequentialPinkCb() {
    return d3.scale.linear().range(palette_sequential_pink_cb);
  }

  static sequentialBlueCb() {
    return d3.scale.linear().range(palette_sequential_blue_cb);
  }

  static sequentialGreenCb() {
    return d3.scale.linear().range(palette_sequential_green_cb);
  }

  static sequentialGreenBrownCb() {
    return d3.scale.linear().range(palette_sequential_green_brown_cb);
  }
}

/**
 * List of color palettes
 */

const palette_category1 = [
  '#e1c8df',
  '#9ecd9d',
  '#acd9d6',
  '#e4e36b',
  '#bfa1c5',
  '#e4d3b8',
  '#facba8',
  '#ced4ea',
  '#acd9d6'
];

const palette_category2 = [
  '#b6dde2',
  '#6394af',
  '#e4e9ab',
  '#8ea876',
  '#f7dce1',
  '#cc878f',
  '#fadaac',
  '#f29a83',
  '#8d7e9e'
];

const palette_category3 = [
  '#6b68a9',
  '#8cc590',
  '#b9487d',
  '#bfa1c5',
  '#4e6936',
  '#71bbc3',
  '#484156',
  '#ccaf44',
  '#d0553c'
];

const palette_category4 = [
  '#f1a30d',
  '#1d4763',
  '#84c7bc',
  '#c1212d',
  '#8fbe46',
  '#076837',
  '#563a2d',
  '#563a2d',
  '#87325d'
];

const palette_category5 = [
  '#f1a30d',
  '#0c3183',
  '#acd9d6',
  '#c1212d',
  '#8fbe46',
  '#076837',
  '#8a6338',
  '#8d2d84',
  '#f09bbc'
];

const palette_category6 = [
  '#71bbc3',
  '#1d4763',
  '#8fbe46',
  '#4e6936',
  '#ee8998',
  '#c1212d',
  '#f5af3c',
  '#e95e2e',
  '#634484'
];

const palette_category7 = [
  '#ea671e',
  '#684592',
  '#84b92a',
  '#cd131c',
  '#3c5ba2',
  '#5baddc',
  '#ffde06',
  '#5db68b',
  '#775e47'
];

const palette_category8 = [
  '#ebd646',
  '#a50f38',
  '#00a096',
  '#f09bbc',
  '#065b78',
  '#72722a',
  '#005231',
  '#4d4e98',
  '#7c4d25'
];

const palette_sequential_yellow = [
  '#fff1c6',
  '#fee5a7',
  '#fcda87',
  '#face64',
  '#f8bf4b',
  '#f6b030',
  '#f4a009',
  '#d28514',
  '#b36c17',
  '#955618',
  '#7a4317',
  '#613214',
  '#49230f'
];

const palette_sequential_red_orange = [
  '#ffecb8',
  '#fbd68b',
  '#f7bf5e',
  '#f3a82f',
  '#df7520',
  '#cd4925',
  '#be0a26',
  '#a81023',
  '#941320',
  '#80141d',
  '#6d1419',
  '#5a1215',
  '#470f0f'
];

const palette_sequential_red = [
  '#fde4d4',
  '#f1c4af',
  '#f7bf5e',
  '#db826a',
  '#d0614d',
  '#c73e36',
  '#be0a26',
  '#a81023',
  '#941320',
  '#80141d',
  '#6d1419',
  '#5a1215',
  '#470f0f'
];

const palette_sequential_pink = [
  '#fbe3e3',
  '#f9cfcc',
  '#f0aaa9',
  '#ed7e7e',
  '#ea647b',
  '#e74576',
  '#e41270',
  '#c70f65',
  '#aa105c',
  '#8d1253',
  '#731448',
  '#5a123c',
  '#420e30'
];

const palette_sequential_purple_pink = [
  '#f9d8e6',
  '#ebbed7',
  '#dda4c7',
  '#c890bb',
  '#b27daf',
  '#8a4c94',
  '#622181',
  '#622181',
  '#50216b',
  '#472060',
  '#3e1f55',
  '#361e4b',
  '#2d1c41'
];

const palette_sequential_purple = [
  '#f6e8f1',
  '#dcc5de',
  '#c2a3c9',
  '#a980b3',
  '#905e9f',
  '#793f8e',
  '#622181',
  '#592175',
  '#4f216b',
  '#462060',
  '#3d1f55',
  '#351e4b',
  '#2c1c41'
];

const palette_sequential_blue = [
  '#e5f2f9',
  '#d1e5f5',
  '#afd3ed',
  '#91afd7',
  '#738bbf',
  '#3c5a9e',
  '#0c3183',
  '#132a68',
  '#10204c',
  '#0b193b',
  '#06142f',
  '#051228',
  '#061020'
];

const palette_sequential_lightBlue = [
  '#eff8fd',
  '#d9eff6',
  '#c2e5ef',
  '#a8dae8',
  '#90cbe4',
  '#76b8e1',
  '#5baddc',
  '#4d96cc',
  '#427ebc',
  '#3a67ab',
  '#324c88',
  '#29366b',
  '#1e2354'
];

const palette_sequential_blue_violet = [
  '#edf7e7',
  '#c8e3d2',
  '#91cdbf',
  '#41b5ab',
  '#218ba4',
  '#145d94',
  '#0c3183',
  '#0d2d76',
  '#0d2a6a',
  '#0e265e',
  '#0d2253',
  '#0c1e47',
  '#0b1a3c'
];

const palette_sequential_turquoise = [
  '#e2ecf6',
  '#cadfe6',
  '#b1d3d6',
  '#94c6c6',
  '#74b9b6',
  '#4caca6',
  '#00a096',
  '#008d89',
  '#007b7c',
  '#006a6f',
  '#005963',
  '#004a57',
  '#063b4c'
];

const palette_sequential_lightGreen = [
  '#faf9de',
  '#e9efc3',
  '#d7e4a7',
  '#c5d989',
  '#b1ce6a',
  '#9cc34c',
  '#84b92a',
  '#6fa32b',
  '#5a8f2a',
  '#477c29',
  '#346b27',
  '#205b24',
  '#074d21'
];

const palette_sequential_darkGreen = [
  '#eaf3e5',
  '#c7d5be',
  '#a3ba9a',
  '#80a078',
  '#5c885a',
  '#357442',
  '#00632e',
  '#00592b',
  '#004e27',
  '#004423',
  '#033a1e',
  '#053019',
  '#052613'
];

const palette_sequential_green_brown = [
  '#f7eccd',
  '#d9cba6',
  '#bcad82',
  '#a29162',
  '#887946',
  '#716330',
  '#5b501f',
  '#51461d',
  '#483d1b',
  '#3f3418',
  '#362b15',
  '#2d2311',
  '#231a0d'
];

const palette_sequential_brown = [
  '#f7eccd',
  '#eed3ab',
  '#e4bb89',
  '#dba269',
  '#ad7446',
  '#834d2c',
  '#5e2f19',
  '#552a18',
  '#4c2516',
  '#432113',
  '#3a1c11',
  '#32180f',
  '#29130b'
];

const palette_sequential_grey = [
  '#e5e8ea',
  '#bdbfc3',
  '#999a9f',
  '#77797f',
  '#595c64',
  '#3e444c',
  '#253038',
  '#20282e',
  '#1a2024',
  '#15181b',
  '#0e1112',
  '#070808',
  '#000000'
];

const palette_sequential_violet_cb = [
  '#f4f3f9',
  '#e0dced',
  '#cbc6e0',
  '#b7b0d4',
  '#948cbf',
  '#706baa',
  '#4d4e98',
  '#484889',
  '#42427a',
  '#3d3c6c',
  '#37365e',
  '#313050',
  '#2c2a44'
];

const palette_sequential_pink_cb = [
  '#fbe5ee',
  '#f8ccd5',
  '#f4b2bc',
  '#f096a3',
  '#d56976',
  '#bc3f52',
  '#a50f38',
  '#951735',
  '#851b31',
  '#761d2e',
  '#671e2a',
  '#581d26',
  '#4a1c22'
];

const palette_sequential_blue_cb = [
  '#eaf6fc',
  '#cfe4f4',
  '#cfe4f4',
  '#91bfe3',
  '#6999bb',
  '#417797',
  '#065b78',
  '#11536b',
  '#174b5f',
  '#194354',
  '#1a3b49',
  '#1a343f',
  '#192d35'
];

const palette_sequential_green_cb = [
  '#fff7d0',
  '#e9e09b',
  '#d1ca62',
  '#b7b623',
  '#9e9e28',
  '#88872a',
  '#72722a',
  '#676726',
  '#5c5c23',
  '#51511f',
  '#47471b',
  '#3d3d17',
  '#333413'
];

const palette_sequential_green_brown_cb = [
  '#f2edde',
  '#d8d1c0',
  '#bfb699',
  '#a09778',
  '#837b5a',
  '#686141',
  '#4f4b2c',
  '#3e3e1f',
  '#2e3313',
  '#292d14',
  '#232613',
  '#1e2012',
  '#191a10'
];
