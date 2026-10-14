// Built-in transparent pixel sprite generator for the Hero
(function() {
  const PALETTE = {
    'K': '#000000',
    'B': '#172a88',
    'W': '#ffffff',
    'R': '#dc141f',
    'D': '#9e0b14',
    'S': '#eac096',
    'T': '#c89970',
    'N': '#8c583a',
    'G': '#2f3e40',
    'L': '#c8dce0',
    'M': '#c84b59',
    'O': '#d96b27',
    'A': '#8c8c8c',
    'J': '#1e293b',
    'Z': '#dc2626'
  };

  const HERO_UPPER_GRID = [
    "........KKKKKKKK........",
    "......KKBBBBWWWWKK......",
    ".....KBWBBWBRRRRRRK.....",
    "....KBBWBBBWSSSSSSWK....",
    "..KKKWBWBBBWSSSSSSSRK...",
    ".KWWWKBBWBBBRRRRRRRRK...",
    ".KRRRKBBBBBBSSSSSSSSK...",
    "..KKKKTTTSSSSSSSSSSSKK..",
    "....KTKKKKKKKKKKKKKKK...",
    "....KTKKKKGGLGGKKGGLGGK.",
    "....KTTSSKGGLGGKKGGLGGK.",
    "....KTTSSSKKKKKSSKKKKK..",
    ".....KSSSSSSSSSSSSSK....",
    ".....KTSSSSSSSSMMMMK....",
    "....KKRTSSSSSSSSSSSK....",
    "...KRRRTKKKKKKKKKKK.....",
    "..KRRRRTSNNSSKDRRRK.....",
    "..KRRRRRKKKKKKRRRRRK....",
    ".KBBDRRRRRRRRRRRRRK.....",
    ".KBBBBKWWOWWWOWWWWWK....",
    "KBBBBBKRRORRRORRRRRK....",
    "KBBBBBKWWOWWWOWWWWWK....",
    "KBBBBBKRRORRRORRRRRK....",
    "KBBBBBKWWAGGWAWWWWWK....",
    ".KKKKKKKKKKKKKKKKKKK...."
  ];

  const LEGS_FRAMES = {
    idle: [
      "....KJJJJJJJJJJJK.......",
      "....KJJJJJKKJJJJJK......",
      "....KJJJJJK.KJJJJJK.....",
      "....KZZZZZK.KZZZZZK.....",
      "....KWWWWWK.KWWWWWK.....",
      "....KKKKKKK.KKKKKKK....."
    ],
    run1: [
      "...KJJJJJJJJJJJK........",
      "..KJJJJJK...KJJJJJK.....",
      ".KZZZZZK.....KZZZZZK....",
      ".KWWWWWK.....KWWWWWK....",
      ".KKKKKKK.....KKKKKKK....",
      "........................"
    ],
    run2: [
      "....KJJJJJJJJJJJK.......",
      ".....KJJJJJKKJJJJJK.....",
      "....KJJJJJK.KJJJJJK.....",
      "....KZZZZZK..KZZZZZK....",
      "....KWWWWWK..KWWWWWK....",
      "....KKKKKKK..KKKKKKK...."
    ]
  };

  window.spriteCache = {};

  ['idle', 'run1', 'run2'].forEach(pose => {
    const c = document.createElement('canvas');
    c.width = 24;
    c.height = 31;
    const cx = c.getContext('2d');
    const fullGrid = HERO_UPPER_GRID.concat(LEGS_FRAMES[pose]);
    for (let y = 0; y < fullGrid.length; y++) {
      const row = fullGrid[y];
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (PALETTE[ch]) {
          cx.fillStyle = PALETTE[ch];
          cx.fillRect(x, y, 1, 1);
        }
      }
    }
    window.spriteCache[pose] = c;
  });
})();
