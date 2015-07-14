var musicPlaylists = {
    'A': [
        {'title': 'Dem Bach sein Song', 'file': 'music/test1.ogg', 'length': '9:59'},
        {'title': 'Hein Blöd und das Bielefelder Symphonieorchester', 'file': 'music/test2.mp3', 'length': '8:59'}
    ]
};

var speakerPlaylists = {
    '1': [{'title': 'Der Satz vom Grunde / Die Welt als Vorstellung', 'file': 'speaker/01_SatzVomGrunde_WeltAlsVorstellung.mp3', 'length': '9:59'}],
    '2': [{'title': 'Der Satz vom Grunde / Die Welt als Wille', 'file': 'speaker/02_SatzVomGrunde_WeltAlsWille.mp3', 'length': '9:59'}],
    '3': [{'title': 'Der Satz vom Grunde / Metaphysik des Schönen', 'file': 'speaker/03_SatzVomGrunde_MetaphysikDesSchoenen.mp3', 'length': '9:59'}],
    '4': [{'title': 'Der Satz vom Grunde / Bejahung & Verneinung', 'file': 'speaker/04_SatzVomGrunde_BejahungVerneinung.mp3', 'length': '9:59'}],
    '5': [{'title': 'Der Satz vom Grunde Gute & schlechte Musik', 'file': 'speaker/05_SatzVomGrunde_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    '6': [{'title': 'Der Satz vom Grunde / Entzweiung & Versöhnung', 'file': 'speaker/06_SatzVomGrunde_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '7': [{'title': 'Der Satz vom Grunde / Klassische & populäre Musik', 'file': 'speaker/07_SatzVomGrunde_KlassischePopulaereMusik.mp3', 'length': '9:59'}],
    '8': [{'title': 'Die Welt als Vorstellung / WeltAlsWille', 'file': 'speaker/08_WeltAlsVorstellung_WeltAlsWille.mp3', 'length': '9:59'}],
    '9': [{'title': 'Die Welt als Vorstellung / MetaphysikDesSchoenen', 'file': 'speaker/09_WeltAlsVorstellung_MetaphysikDesSchoenen.mp3', 'length': '9:59'}],
    '10': [{'title': 'Die Welt als Wille / Bejahung & Verneinung', 'file': 'speaker/10_WeltAlsVorstellung_BejahungVerneinung.mp3', 'length': '9:59'}],
    '11': [{'title': 'Die Welt als Vorstellung / GuteSchlechteMusik', 'file': 'speaker/11_WeltAlsVorstellung_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    '12': [{'title': 'Die Welt als Vorstellung / EntzweiungVersoehnung', 'file': 'speaker/12_WeltAlsVorstellung_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '13': [{
        'title': 'Die Welt als Vorstellung / KlassischePopulaereMusik',
        'file': 'speaker/13_WeltAlsVorstellung_KlassischePopulaereMusik.mp3',
        'length': '9:59'
    }],
    '14': [{'title': 'Die Welt als Wille_MetaphysikDesSchoenen', 'file': 'speaker/14_WeltAlsWille_MetaphysikDesSchoenen.mp3', 'length': '9:59'}],
    '15': [{'title': 'Die Welt als Wille_BejahungVerneinung', 'file': 'speaker/15_WeltAlsWille_BejahungVerneinung.mp3', 'length': '9:59'}],
    '16': [{'title': 'Die Welt als Wille_GuteSchlechteMusik', 'file': 'speaker/16_WeltAlsWille_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    '17': [{'title': 'Die Welt als Wille_EntzweiungVersoehnung', 'file': 'speaker/17_WeltAlsWille_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '18': [{'title': 'Die Welt als Wille_KlassischePopulaereMusik', 'file': 'speaker/18_WeltAlsWille_KlassischePopulaereMusik.mp3', 'length': '9:59'}],
    '19': [{'title': 'MetaphysikDesSchoenen_BejahungVerneinung', 'file': 'speaker/19_MetaphysikDesSchoenen_BejahungVerneinung.mp3', 'length': '9:59'}],
    '20': [{'title': 'MetaphysikDesSchoenen_GuteSchlechteMusik', 'file': 'speaker/20_MetaphysikDesSchoenen_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    '21': [{'title': 'MetaphysikDesSchoenen_EntzweiungVersoehnung', 'file': 'speaker/21_MetaphysikDesSchoenen_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '22': [{
        'title': 'MetaphysikDesSchoenen_KlassischePopulaereMusik',
        'file': 'speaker/22_MetaphysikDesSchoenen_KlassischePopulaereMusik.mp3',
        'length': '9:59'
    }],
    '23': [{'title': 'BejahungVerneinung_GuteSchlechteMusik', 'file': 'speaker/23_BejahungVerneinung_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    '24': [{'title': 'BejahungVerneinung_EntzweiungVersoehnung', 'file': 'speaker/24_BejahungVerneinung_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '25': [{'title': 'BejahungVerneinung_KlassischePopulaereMusik', 'file': 'speaker/25_BejahungVerneinung_KlassischePopulaereMusik.mp3', 'length': '9:59'}],
    '26': [{'title': 'GuteSchlechteMusik_EntzweiungVersoehnung', 'file': 'speaker/26_GuteSchlechteMusik_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '27': [{'title': 'GuteSchlechteMusik_KlassischePopulaereMusik', 'file': 'speaker/27_GuteSchlechteMusik_KlassischePopulaereMusik.mp3', 'length': '9:59'}],
    '28': [{
        'title': 'EntzweiungVersoehnung_KlassischePopulaereMusik',
        'file': 'speaker/28_EntzweiungVersoehnung_KlassischePopulaereMusik.mp3',
        'length': '9:59'
    }],
    'A': [{'title': 'A_SatzVomGrunde', 'file': 'speaker/A_SatzVomGrunde.mp3', 'length': '9:59'}],
    'B': [{'title': 'B_WeltAlsVorstellung', 'file': 'speaker/B_WeltAlsVorstellung.mp3', 'length': '9:59'}],
    'C': [{'title': 'C_WeltAlsWille', 'file': 'speaker/C_WeltAlsWille.mp3', 'length': '9:59'}],
    'D': [{'title': 'D_MetaphysikDesSchoenen', 'file': 'speaker/D_MetaphysikDesSchoenen.mp3', 'length': '9:59'}],
    'E': [{'title': 'E_BejahungVerneinung', 'file': 'speaker/E_BejahungVerneinung.mp3', 'length': '9:59'}],
    'F': [{'title': 'F_GuteSchlechteMusik', 'file': 'speaker/F_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    'G': [{'title': 'G_EntzweiungVersoehnung', 'file': 'speaker/G_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    'H': [{'title': 'H_KlassischePopulaereMusik', 'file': 'speaker/H_KlassischePopulaereMusik.mp3', 'length': '9:59'}]
};
