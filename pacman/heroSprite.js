// Pixel-Art Sprite Builder: USA Cap Hero, Princess, and Zombie Boss
(function() {
  const PALETTE = {
    'K': '#000000', // Black outline
    'B': '#172a88', // USA Flag Royal Blue
    'W': '#ffffff', // Pure White
    'R': '#dc141f', // Bright Red
    'D': '#9e0b14', // Dark Red
    'S': '#eac096', // Hero/Princess Skin
    'T': '#c89970', // Shaded Skin
    'N': '#8c583a', // Brown / Neck Shadow
    'G': '#2f3e40', // Dark Sunglasses
    'L': '#c8dce0', // Sunglasses Glare
    'M': '#c84b59', // Lips / Mouth
    'O': '#d96b27', // Orange Drawstrings
    'A': '#8c8c8c', // Grey
    'J': '#1e293b', // Dark Jeans / Boots
    'Z': '#dc2626', // Red Sneakers
    // Princess & Zombie Colors
    'Y': '#facc15', // Gold Crown
    'H': '#eab308', // Blonde Hair Shade
    'P': '#ec4899', // Princess Dress Pink / Zombie Brain Pink
    'F': '#f472b6', // Light Pink Highlight
    'C': '#38bdf8', // Cyan Gem / Eyes
    'V': '#65a30d', // Zombie Rotten Green Skin
    'U': '#3f6212', // Zombie Dark Green Shadow
    'Q': '#581c87'  // Zombie Tattered Purple Shirt
  };

  // 1. USA CAP HERO (24x25 Upper + 24x6 Legs)
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

  // 2. PIXEL PRINCESS SPRITE (24x31)
  const PRINCESS_GRID = [
    ".......KK..KK..KK.......",
    "......KYYKKYYKKYYK......",
    "......KYYYYCYYYYYK......",
    ".....KKKKKKKKKKKKKK.....",
    "....KYYYYYYYYYYYYYYK....",
    "...KYYHHHHHHHHHHHHYYK...",
    "...KYHSSSSSSSSSSSSHYK...",
    "..KYHSSSSSSSSSSSSSSHYK..",
    "..KYHSSKCKSSSSKCKSSHYK..",
    "..KYHSSKWKSSSSKWKSSHYK..",
    "..KYHSSFSSSSSSSSFSSHYK..",
    "..KYHSSSSSMMMSSSSSSHYK..",
    "...KYHTSSSSSSSSSSTHYK...",
    "...KYYHKKKKKKKKKKHYYK...",
    "...KYYHPPPWWWWPPPHYYK...",
    "....KKPPPPFFFFPPPPKK....",
    "....KPPPPFFFFFFPPPPK....",
    "...KSSSSKPPPPPPKSSSSK...",
    "...KKKK.KPPPPPPK.KKKK...",
    ".......KPPPPPPPPK.......",
    "......KPPPPFFFFFFK......",
    ".....KPPPPFFFFFFFFK.....",
    "....KPPPPFFFFFFFFFFK....",
    "....KPPPPPPPPPPPPPPK....",
    "...KPPPPFFFFFFFFPPPPK...",
    "...KPPPPPPPPPPPPPPPPK...",
    "..KWWWWWWWWWWWWWWWWWWK..",
    "..KKKKKKKKKKKKKKKKKKKK..",
    ".....KWWWWK..KWWWWK.....",
    ".....KPPPPK..KPPPPK.....",
    ".....KKKKKK..KKKKKK....."
  ];

  // 3. PIXEL ZOMBIE BOSS SPRITE (24x31)
  const ZOMBIE_GRID = [
    "......KKKKKKKKKKKK......",
    "....KKVVVVVKKPPFFPKK....",
    "...KVVVVVVVKPFFPPFFPK...",
    "..KVVVVVVVVKKKKKKKKKK...",
    "..KUVVVVVVVVVVVVVVVVK...",
    "..KUVVKKKKVVVVKKKKVVK...",
    "..KUVVKRRKVVVVKRRKVVK...",
    "..KUVVKRYKVVVVKRYKVVK...",
    "..KUVVKKKKVVVVKKKKVVK...",
    "..KUVVVVVVVUUVVVVVVVK...",
    "...KUVVVKKKKKKKKVVVK....",
    "...KUVVVKWKWKWKWKVVK....",
    "...KUVVVKRRRRRRRRVVK....",
    "....KUVVVKKKKKKKKVK.....",
    ".....KKKKUUUUUUKKK......",
    "..KKKKQQQQQQQQQQQQKKKK..",
    ".KVVVVQQQQRRRRQQQQVVVVK.",
    "KVVVVUKQQQRRRRQQQKUVVVVK",
    "KVVVUK.KQQQQQQQQK.KUVVVK",
    ".KKKK..KQQQAAQQQK..KKKK.",
    ".......KQQAAAAQQK.......",
    "......KJJJJJJJJJJK......",
    "......KJJJJKKJJJJK......",
    ".....KJJJJK..KJJJJK.....",
    ".....KJJJJK..KJJJJK.....",
    ".....KUVVUK..KJJJJK.....",
    ".....KJJJJK..KUVVUK.....",
    ".....KJJJJK..KJJJJK.....",
    "....KNNNNNK..KNNNNNK....",
    "....KNNNNNK..KNNNNNK....",
    "....KKKKKKK..KKKKKKK...."
  ];

  function bakeGrid(grid) {
    const c = document.createElement('canvas');
    c.width = 24;
    c.height = grid.length;
    const cx = c.getContext('2d');
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (PALETTE[ch]) {
          cx.fillStyle = PALETTE[ch];
          cx.fillRect(x, y, 1, 1);
        }
      }
    }
    return c;
  }

  window.spriteCache = {};

  ['idle', 'run1', 'run2'].forEach(pose => {
    window.spriteCache[pose] = bakeGrid(HERO_UPPER_GRID.concat(LEGS_FRAMES[pose]));
  });

  window.spriteCache.princess = bakeGrid(PRINCESS_GRID);
  window.spriteCache.zombie = bakeGrid(ZOMBIE_GRID);
})();
