/* Düğün.com proposal · demo data and deterministic rules
   Catalogue items, an illustrative song dataset and the budget formula. No live AI, no real vendors,
   no audio and no current market prices: every figure here is an illustrative demo value. */
(function (g) {
  'use strict';
  const LANG = /^en/i.test(document.documentElement.lang || '') ? 'en' : 'tr';
  const L = (tr, en) => (LANG === 'en' ? en : tr);

  /* ------------------------------------------------------------ try-on catalogue (fictional demo boutique) */
  const OUTFITS = [
    { id: 'aurora', kind: 'gelinlik', model: 'a', vendor: 'vf', name: 'Aurora', type: L('A Kesim Tül Gelinlik', 'A-line tulle gown'), tag: L('A Kesim', 'A-line') },
    { id: 'selin', kind: 'gelinlik', model: 'a', vendor: 'vf', name: 'Selin', type: L('Saten Balık Gelinlik', 'Satin mermaid gown'), tag: L('Balık', 'Mermaid') },
    { id: 'lina', kind: 'gelinlik', model: 'a', vendor: 'vf', name: 'Lina', type: L('Dantel Bohem Gelinlik', 'Lace boho gown'), tag: L('Bohem', 'Boho') },
    { id: 'kenan', kind: 'damatlik', model: 'b', vendor: 'vm', name: 'Kenan', type: L('Saten Yaka Smokin', 'Satin-lapel tuxedo'), tag: L('Smokin', 'Tuxedo') },
    { id: 'deniz', kind: 'damatlik', model: 'b', vendor: 'vm', name: 'Deniz', type: L('Keten Takım Elbise', 'Linen suit'), tag: L('Keten', 'Linen') },
  ];
  const BOUTIQUE = { name: 'Atölye Beyaz', city: 'İstanbul · Nişantaşı', note: L('Kurgusal demo mağaza', 'Fictional demo boutique') };

  /* ------------------------------------------------------------ music: illustrative recommendation dataset
     t = title, a = artist, g = styles, md = moods, tr = Turkish wedding tradition, mo = fit per moment (0-3),
     n = what makes it work, tp = tempo. Titles and artists are facts; no audio is included or linked. */
  const SONGS = [
    { t: 'Canon in D', a: 'Johann Pachelbel', g: ['klasik'], md: ['zarif', 'romantik'], mo: { giris: 3, ilkdans: 1, pasta: 1 }, n: 'yaylı düzenlemesi', tp: 'yavaş' },
    { t: 'Air on the G String', a: 'J. S. Bach', g: ['klasik'], md: ['zarif'], mo: { giris: 3, ilkdans: 1 }, n: 'sakin yaylıları', tp: 'yavaş' },
    { t: 'Bridal Chorus', a: 'Richard Wagner', g: ['klasik'], md: ['zarif'], mo: { giris: 3 }, n: 'tanıdık melodisi', tp: 'yavaş' },
    { t: 'Wedding March', a: 'Felix Mendelssohn', g: ['klasik'], md: ['neseli', 'zarif'], mo: { giris: 2, pasta: 2, eglence: 1 }, n: 'görkemli girişi', tp: 'orta' },
    { t: L('Spring (Dört Mevsim)', 'Spring (The Four Seasons)'), a: 'Antonio Vivaldi', g: ['klasik'], md: ['neseli', 'zarif'], mo: { giris: 2, pasta: 2 }, n: 'canlı yaylıları', tp: 'orta' },
    { t: 'Clair de Lune', a: 'Claude Debussy', g: ['klasik'], md: ['romantik', 'zarif'], mo: { giris: 2, ilkdans: 2 }, n: 'piyano melodisi', tp: 'yavaş' },
    { t: 'River Flows in You', a: 'Yiruma', g: ['klasik', 'akustik'], md: ['romantik'], mo: { giris: 3, ilkdans: 2 }, n: 'piyano melodisi', tp: 'yavaş' },
    { t: 'Una Mattina', a: 'Ludovico Einaudi', g: ['klasik'], md: ['zarif'], mo: { giris: 2, pasta: 1 }, n: 'minimal piyanosu', tp: 'yavaş' },
    { t: 'Valse', a: 'Evgeny Grinko', g: ['klasik'], md: ['romantik', 'zarif'], mo: { ilkdans: 3, giris: 2 }, n: 'vals ritmi', tp: 'yavaş' },
    { t: 'Perfect', a: 'Ed Sheeran', g: ['pop'], md: ['romantik'], mo: { ilkdans: 3, giris: 1 }, n: 'sıcak vokali', tp: 'yavaş' },
    { t: 'All of Me', a: 'John Legend', g: ['pop'], md: ['romantik'], mo: { ilkdans: 3 }, n: 'piyano ve vokali', tp: 'yavaş' },
    { t: 'A Thousand Years', a: 'Christina Perri', g: ['pop'], md: ['romantik'], mo: { giris: 3, ilkdans: 2 }, n: 'yükselen nakaratı', tp: 'yavaş' },
    { t: "Can't Help Falling in Love", a: 'Elvis Presley', g: ['pop', 'caz'], md: ['romantik', 'zarif'], mo: { ilkdans: 3, giris: 1 }, n: 'zamansız melodisi', tp: 'yavaş' },
    { t: 'She', a: 'Elvis Costello', g: ['pop'], md: ['romantik'], mo: { ilkdans: 2, giris: 2 }, n: 'yumuşak orkestrası', tp: 'yavaş' },
    { t: 'Marry You', a: 'Bruno Mars', g: ['pop'], md: ['neseli'], mo: { giris: 2, pasta: 2, eglence: 2 }, n: 'neşeli nakaratı', tp: 'hızlı' },
    { t: 'Sugar', a: 'Maroon 5', g: ['pop'], md: ['neseli'], mo: { pasta: 3, eglence: 2 }, n: 'tatlı nakaratı', tp: 'orta' },
    { t: 'Cake by the Ocean', a: 'DNCE', g: ['pop'], md: ['neseli'], mo: { pasta: 3, eglence: 2 }, n: 'oyunbaz ritmi', tp: 'hızlı' },
    { t: 'Uptown Funk', a: 'Mark Ronson ft. Bruno Mars', g: ['pop'], md: ['neseli'], mo: { eglence: 3 }, n: 'funk ritmi', tp: 'hızlı' },
    { t: 'September', a: 'Earth, Wind & Fire', g: ['pop'], md: ['neseli'], mo: { eglence: 3, pasta: 1 }, n: 'disko ritmi', tp: 'hızlı' },
    { t: 'Happy', a: 'Pharrell Williams', g: ['pop'], md: ['neseli'], mo: { pasta: 2, eglence: 2 }, n: 'enerjik nakaratı', tp: 'hızlı' },
    { t: 'Lovely Day', a: 'Bill Withers', g: ['pop'], md: ['neseli', 'romantik'], mo: { pasta: 2, eglence: 1 }, n: 'sıcak soul tınısı', tp: 'orta' },
    { t: "Signed, Sealed, Delivered (I'm Yours)", a: 'Stevie Wonder', g: ['pop'], md: ['neseli'], mo: { eglence: 2, pasta: 2 }, n: 'bando girişi', tp: 'hızlı' },
    { t: 'Fly Me to the Moon', a: 'Frank Sinatra', g: ['caz'], md: ['neseli', 'zarif'], mo: { pasta: 2, ilkdans: 2 }, n: 'big band sesi', tp: 'orta' },
    { t: 'The Way You Look Tonight', a: 'Frank Sinatra', g: ['caz'], md: ['romantik', 'zarif'], mo: { ilkdans: 3 }, n: 'kadife vokali', tp: 'yavaş' },
    { t: 'At Last', a: 'Etta James', g: ['caz'], md: ['romantik'], mo: { ilkdans: 3 }, n: 'yaylıları ve güçlü vokali', tp: 'yavaş' },
    { t: 'L-O-V-E', a: 'Nat King Cole', g: ['caz'], md: ['neseli'], mo: { pasta: 3, giris: 1 }, n: 'swing ritmi', tp: 'orta' },
    { t: 'La Vie en Rose', a: 'Édith Piaf', g: ['caz'], md: ['romantik', 'zarif'], mo: { ilkdans: 2, giris: 2 }, n: 'şanson tınısı', tp: 'yavaş' },
    { t: 'Sway', a: 'Michael Bublé', g: ['caz'], md: ['neseli'], mo: { pasta: 2, eglence: 2 }, n: 'latin ritmi', tp: 'orta' },
    { t: 'Dance Me to the End of Love', a: 'Leonard Cohen', g: ['akustik', 'caz'], md: ['romantik', 'zarif'], mo: { ilkdans: 3 }, n: 'kemanı ve derin vokali', tp: 'orta' },
    { t: 'Bloom', a: 'The Paper Kites', g: ['akustik'], md: ['romantik'], mo: { ilkdans: 3, giris: 1 }, n: 'akustik gitarı', tp: 'yavaş' },
    { t: 'Make You Feel My Love', a: 'Adele', g: ['akustik', 'pop'], md: ['romantik'], mo: { ilkdans: 3 }, n: 'yalın piyanosu', tp: 'yavaş' },
    { t: 'Yellow', a: 'Coldplay', g: ['akustik', 'pop'], md: ['romantik'], mo: { ilkdans: 2, giris: 1 }, n: 'tanıdık nakaratı', tp: 'orta' },
    { t: 'Beni Çok Sev', a: 'Tarkan', g: ['trpop'], md: ['romantik'], mo: { ilkdans: 3 }, n: 'romantik sözleri', tp: 'yavaş' },
    { t: 'Fark Etmeden', a: 'Fikret Kızılok', g: ['trpop', 'akustik'], md: ['romantik', 'zarif'], mo: { ilkdans: 3, giris: 1 }, n: 'akustik dokusu', tp: 'yavaş' },
    { t: 'Hoş Geldin', a: 'Hüsnü Arıkan & Birsen Tezer', g: ['akustik', 'trpop'], md: ['romantik'], mo: { giris: 2, ilkdans: 2 }, n: 'iki sesli yorumu', tp: 'yavaş' },
    { t: 'Kalbimin Tek Sahibi', a: 'İrem Derici', g: ['trpop'], md: ['romantik'], mo: { ilkdans: 3 }, n: 'duygusal sözleri', tp: 'yavaş' },
    { t: 'Gülümse', a: 'Sezen Aksu', g: ['trpop'], md: ['romantik', 'zarif'], mo: { ilkdans: 2, pasta: 1 }, n: 'zamansız melodisi', tp: 'orta' },
    { t: 'Sevme Zamanı', a: 'Oya & Bora', g: ['trpop'], md: ['romantik', 'neseli'], mo: { ilkdans: 2, pasta: 2 }, n: 'nostaljik tınısı', tp: 'orta' },
    { t: 'Benimki', a: 'Yalın', g: ['trpop'], md: ['romantik', 'neseli'], mo: { ilkdans: 2, pasta: 1 }, n: 'samimi sözleri', tp: 'orta' },
    { t: 'Kutlama', a: 'Sezen Aksu', g: ['trpop'], md: ['neseli'], mo: { giris: 2, pasta: 2, eglence: 1 }, n: 'kutlama havası', tp: 'orta' },
    { t: 'Tencere Kapak', a: 'Kenan Doğulu', g: ['trpop'], md: ['neseli'], mo: { pasta: 2, eglence: 2, ilkdans: 1 }, n: 'eğlenceli sözleri', tp: 'hızlı' },
    { t: 'Bu Kız', a: 'Son Feci Bisiklet', g: ['trpop', 'akustik'], md: ['neseli'], mo: { pasta: 2, eglence: 2 }, n: 'neşeli gitarları', tp: 'hızlı' },
    { t: 'Şımarık', a: 'Tarkan', g: ['trpop'], md: ['neseli'], mo: { eglence: 3 }, n: 'herkesin bildiği nakaratı', tp: 'hızlı' },
    { t: 'Kuzu Kuzu', a: 'Tarkan', g: ['trpop'], md: ['neseli'], mo: { eglence: 3 }, n: 'oyun havası ritmi', tp: 'hızlı' },
    { t: 'Aşkın Olayım', a: 'Simge', g: ['trpop'], md: ['neseli'], mo: { eglence: 3 }, n: 'dans ritmi', tp: 'hızlı' },
    { t: 'Midnight City', a: 'M83', g: ['elektronik'], md: ['neseli'], mo: { giris: 2, eglence: 2 }, n: 'sinematik synth’leri', tp: 'orta' },
    { t: 'Intro', a: 'The xx', g: ['elektronik'], md: ['zarif', 'romantik'], mo: { giris: 3 }, n: 'minimal gitarı', tp: 'orta' },
    { t: 'Sunset Lover', a: 'Petit Biscuit', g: ['elektronik'], md: ['zarif'], mo: { pasta: 2, giris: 1 }, n: 'yumuşak elektronik dokusu', tp: 'orta' },
    { t: 'Wake Me Up', a: 'Avicii', g: ['elektronik'], md: ['neseli'], mo: { eglence: 3 }, n: 'folk ve elektronik karışımı', tp: 'hızlı' },
    { t: 'Titanium', a: 'David Guetta ft. Sia', g: ['elektronik'], md: ['neseli'], mo: { eglence: 2, giris: 1 }, n: 'yükselen drop’u', tp: 'hızlı' },
    { t: 'Harmandalı', a: L('Anonim · zeybek', 'Traditional · zeybek'), g: ['geleneksel'], md: ['zarif'], mo: { giris: 3, eglence: 1 }, n: 'zeybek ağırlığı', tp: 'yavaş', tr: true },
    { t: "Ankara'nın Bağları", a: L('Anonim · oyun havası', 'Traditional · folk dance'), g: ['geleneksel'], md: ['neseli'], mo: { eglence: 3 }, n: 'oyun havası ritmi', tp: 'hızlı', tr: true },
    { t: 'Hüdayda', a: L('Anonim · halay', 'Traditional · halay'), g: ['geleneksel'], md: ['neseli'], mo: { eglence: 3 }, n: 'halay ritmi', tp: 'hızlı', tr: true },
    { t: 'Wedding (Čoček)', a: 'Goran Bregović', g: ['geleneksel'], md: ['neseli'], mo: { eglence: 3, giris: 1 }, n: 'Balkan bandosu', tp: 'hızlı', tr: true },
    { t: 'Moliendo Café', a: 'Fanfare Ciocărlia', g: ['geleneksel'], md: ['neseli'], mo: { eglence: 3, pasta: 1 }, n: 'bando enerjisi', tp: 'hızlı', tr: true },
  ];
  const STYLE_LABEL = L({ trpop: 'Türkçe pop', pop: 'yabancı pop', klasik: 'klasik', caz: 'caz', akustik: 'akustik', elektronik: 'elektronik', geleneksel: 'geleneksel' },
    { trpop: 'Turkish pop', pop: 'international pop', klasik: 'classical', caz: 'jazz', akustik: 'acoustic', elektronik: 'electronic', geleneksel: 'traditional' });
  const MOOD_LABEL = L({ romantik: 'romantik', zarif: 'zarif', neseli: 'neşeli' }, { romantik: 'romantic', zarif: 'elegant', neseli: 'joyful' });
  const MOMENT = L({
    giris: { label: 'Gelin Girişi', does: 'gelin girişine zarif bir açılış yapar' },
    ilkdans: { label: 'İlk Dans', does: 'ilk dansta adımları kolaylaştırır' },
    pasta: { label: 'Pasta Kesimi', does: 'pasta kesimine tatlı bir an katar' },
    eglence: { label: 'Eğlence', does: 'dans pistini doldurur' },
  }, {
    giris: { label: 'Bridal Entrance', does: 'open the bridal entrance gracefully' },
    ilkdans: { label: 'First Dance', does: 'make the first-dance steps easy' },
    pasta: { label: 'Cake Cutting', does: 'add a sweet moment to the cake cutting' },
    eglence: { label: 'Party', does: 'fill the dance floor' },
  });
  // English wording for each song's "what makes it work" note and tempo.
  const N_EN = {
    'yaylı düzenlemesi': 'string arrangement', 'sakin yaylıları': 'calm strings', 'tanıdık melodisi': 'familiar melody', 'görkemli girişi': 'grand opening',
    'canlı yaylıları': 'lively strings', 'piyano melodisi': 'piano melody', 'minimal piyanosu': 'minimal piano', 'vals ritmi': 'waltz rhythm',
    'sıcak vokali': 'warm vocals', 'piyano ve vokali': 'piano and vocals', 'yükselen nakaratı': 'soaring chorus', 'zamansız melodisi': 'timeless melody',
    'yumuşak orkestrası': 'soft orchestra', 'neşeli nakaratı': 'cheerful chorus', 'tatlı nakaratı': 'sweet chorus', 'oyunbaz ritmi': 'playful beat',
    'funk ritmi': 'funk groove', 'disko ritmi': 'disco groove', 'enerjik nakaratı': 'upbeat chorus', 'sıcak soul tınısı': 'warm soul sound',
    'bando girişi': 'brass intro', 'big band sesi': 'big-band sound', 'kadife vokali': 'velvet vocals', 'yaylıları ve güçlü vokali': 'strings and powerful vocals',
    'swing ritmi': 'swing rhythm', 'şanson tınısı': 'chanson feel', 'latin ritmi': 'Latin rhythm', 'kemanı ve derin vokali': 'violin and deep vocals',
    'akustik gitarı': 'acoustic guitar', 'yalın piyanosu': 'simple piano', 'tanıdık nakaratı': 'familiar chorus', 'romantik sözleri': 'romantic lyrics',
    'akustik dokusu': 'acoustic texture', 'iki sesli yorumu': 'duet vocals', 'duygusal sözleri': 'heartfelt lyrics', 'nostaljik tınısı': 'nostalgic sound',
    'samimi sözleri': 'sincere lyrics', 'kutlama havası': 'celebratory mood', 'eğlenceli sözleri': 'fun lyrics', 'neşeli gitarları': 'cheerful guitars',
    'herkesin bildiği nakaratı': 'sing-along chorus', 'oyun havası ritmi': 'folk-dance rhythm', 'dans ritmi': 'dance beat', 'sinematik synth’leri': 'cinematic synths',
    'minimal gitarı': 'minimal guitar', 'yumuşak elektronik dokusu': 'soft electronic texture', 'folk ve elektronik karışımı': 'folk-meets-electronic sound',
    'yükselen drop’u': 'soaring drop', 'zeybek ağırlığı': 'stately zeybek steps', 'halay ritmi': 'halay rhythm', 'Balkan bandosu': 'Balkan brass band', 'bando enerjisi': 'brass-band energy',
  };
  const TP_EN = { 'yavaş': 'slow', 'orta': 'medium', 'hızlı': 'fast' };
  const cap = (s) => s.charAt(0).toLocaleUpperCase(L('tr-TR', 'en-US')) + s.slice(1);
  const list = (arr) => (arr.length < 2 ? arr.join('') : `${arr.slice(0, -1).join(', ')} ${L('ve', 'and')} ${arr[arr.length - 1]}`);

  /* Score every song for one moment and return the best three, each with a reason. */
  function recommend(prefs) {
    const { styles = [], mood = 'romantik', trad = 'karma', moment = 'giris' } = prefs;
    const scored = SONGS.map((s, i) => {
      const fit = s.mo[moment] || 0; if (!fit) return null;
      const gHit = s.g.filter((x) => styles.includes(x));
      let sc = fit * 10 + (gHit.length ? 9 : 0) + (s.md.includes(mood) ? 6 : 0);
      if (s.tr) sc += trad === 'geleneksel' ? 14 : trad === 'karma' ? 6 : -8;
      else if (trad === 'geleneksel') sc -= 2;
      return { s, sc: sc - i * 0.001, gHit, moodHit: s.md.includes(mood) };
    }).filter(Boolean).sort((a, b) => b.sc - a.sc).slice(0, 3);
    return scored.map(({ s, gHit, moodHit }) => {
      const why = [];
      let lead, tail;
      if (LANG === 'en') {
        if (gHit.length) why.push(`your taste for ${list(gHit.map((x) => STYLE_LABEL[x]))}`);
        if (moodHit) why.push(`your ${MOOD_LABEL[mood]} mood`);
        if (s.tr && trad !== 'modern') why.push('the wedding tradition');
        lead = `Its ${N_EN[s.n] || s.n} and ${TP_EN[s.tp]} tempo ${MOMENT[moment].does}.`;
        tail = why.length ? ` Matches ${list(why)}.` : ' A close alternative to your choices.';
      } else {
        if (gHit.length) why.push(list(gHit.map((x) => STYLE_LABEL[x])));
        if (moodHit) why.push(`${MOOD_LABEL[mood]} atmosfer`);
        if (s.tr && trad !== 'modern') why.push('düğün geleneği');
        lead = `${cap(s.n)} ve ${s.tp} temposuyla ${MOMENT[moment].does}.`;
        tail = why.length ? ` ${cap(list(why))} tercihinize uyuyor.` : ' Tercihlerinize yakın bir alternatif.';
      }
      return { title: s.t, artist: s.a, tags: s.g.map((x) => STYLE_LABEL[x]), reason: lead + tail };
    });
  }

  /* ------------------------------------------------------------ budget: illustrative, deterministic rules */
  const CITIES = [
    { id: 'istanbul', name: 'İstanbul', k: 1.3 }, { id: 'ankara', name: 'Ankara', k: 1.0 }, { id: 'izmir', name: 'İzmir', k: 1.12 },
    { id: 'antalya', name: 'Antalya', k: 1.08 }, { id: 'bursa', name: 'Bursa', k: 0.95 }, { id: 'diger', name: L('Diğer şehirler', 'Other cities'), k: 0.85 },
  ];
  const VENUES = [
    { id: 'salon', name: L('Düğün Salonu', 'Wedding hall'), pp: 950, fixed: 60000 },
    { id: 'otel', name: L('Otel', 'Hotel'), pp: 1750, fixed: 90000 },
    { id: 'kir', name: L('Kır Bahçesi', 'Garden'), pp: 1300, fixed: 110000 },
    { id: 'tarihi', name: L('Tarihi Mekân', 'Historic venue'), pp: 2000, fixed: 180000 },
    { id: 'tekne', name: L('Tekne', 'Boat'), pp: 2300, fixed: 140000 },
  ];
  const STYLES = [{ id: 'sade', name: L('Sade', 'Simple'), k: 0.8 }, { id: 'klasik', name: L('Klasik', 'Classic'), k: 1.0 }, { id: 'luks', name: L('Lüks', 'Luxury'), k: 1.55 }];
  const CATS = [
    { id: 'mekan', name: L('Mekân', 'Venue'), color: '#E21B71' },
    { id: 'yemek', name: L('Yemek & ikram', 'Food & drinks'), color: '#B8935A' },
    { id: 'dekor', name: L('Dekorasyon & çiçek', 'Decor & flowers'), color: '#098483' },
    { id: 'foto', name: L('Fotoğraf & video', 'Photo & video'), color: '#C77D8E' },
    { id: 'kiyafet', name: L('Gelinlik & damatlık', 'Dress & suit'), color: '#8C9A7A' },
    { id: 'muzik', name: L('Müzik', 'Music'), color: '#7B6A92' },
    { id: 'diger', name: L('Diğer', 'Other'), color: '#B9AFA6' },
  ];
  const r1k = (n) => Math.round(n / 1000) * 1000;
  function estimate(o) {
    const c = CITIES.find((x) => x.id === o.city) || CITIES[0]; const v = VENUES.find((x) => x.id === o.venue) || VENUES[0];
    const st = STYLES.find((x) => x.id === o.style) || STYLES[1]; const gu = Math.max(20, +o.guests || 200);
    const parts = {
      mekan: v.fixed * c.k * st.k,
      yemek: gu * v.pp * c.k * st.k,
      dekor: (35000 + gu * 90) * c.k * Math.pow(st.k, 1.25),
      foto: 42000 * Math.pow(c.k, 0.6) * Math.pow(st.k, 0.9),
      kiyafet: 65000 * Math.pow(st.k, 1.1),
      muzik: 28000 * Math.pow(c.k, 0.7) * st.k,
    };
    const sub = Object.values(parts).reduce((a, b) => a + b, 0);
    parts.diger = sub * 0.07 + gu * 45;
    const rows = CATS.map((k) => ({ ...k, value: r1k(parts[k.id]) }));
    const total = rows.reduce((a, b) => a + b.value, 0);
    const perGuest = v.pp * c.k * st.k + 90 * c.k * Math.pow(st.k, 1.25) + 45 + (v.pp * c.k * st.k + 90 * c.k * Math.pow(st.k, 1.25)) * 0.07;
    return { rows, total, low: r1k(total * 0.88), high: r1k(total * 1.12), perGuest: r1k(perGuest * 50) / 50, city: c, venue: v, style: st, guests: gu };
  }
  const tl = (n) => `₺${Math.round(n).toLocaleString(L('tr-TR', 'en-US'))}`;

  g.DData = { LANG, L, OUTFITS, BOUTIQUE, SONGS, MOMENT, STYLE_LABEL, recommend, CITIES, VENUES, STYLES, CATS, estimate, tl };
})(window);
