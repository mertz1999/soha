/* Demo data and rules for the SOHA × Biletino proposal, in English and Turkish.
   Everything here is fictional and local: sample events, a 33-event demo
   catalogue for the suggestions phone, and the rule-based reader that turns
   an organizer's description into a draft event page. No API is called.
   Event, venue and area names are Turkish proper names in both languages. */
(() => {
  'use strict';
  const pad = (n) => String(n).padStart(2, '0');
  const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const roundPrice = (n) => Math.max(0, Math.round(n / 10) * 10);
  // Lowercase and strip Turkish diacritics, so "İzmir", "Izmir" and "izmir" all match.
  const fold = (s) => String(s).toLocaleLowerCase('tr-TR').replace(/\u0307/g, '').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/[âà]/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u');

  /* ------------------------------------------------------------ language tables */
  const L10N = {
    tr: {
      months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
      days: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
      seasons: ['Kış', 'Kış', 'Bahar', 'Bahar', 'Bahar', 'Yaz', 'Yaz', 'Yaz', 'Sonbahar', 'Sonbahar', 'Sonbahar', 'Kış'],
      cities: { istanbul: 'İstanbul', ankara: 'Ankara', izmir: 'İzmir' },
      cityIn: { istanbul: "İstanbul'da", ankara: "Ankara'da", izmir: "İzmir'de" },
      sep: '.', free: 'Ücretsiz', numLocale: 'tr-TR',
      tl: (n) => n.toFixed(2).replace('.', ','),
      dateLine: (d, M, D) => `${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()} - ${D[d.getDay()]}`,
      dateLong: (d, M, D) => `${d.getDate()} ${M[d.getMonth()]} ${D[d.getDay()]}`,
    },
    en: {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      seasons: ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Autumn', 'Autumn', 'Autumn', 'Winter'],
      cities: { istanbul: 'Istanbul', ankara: 'Ankara', izmir: 'Izmir' },
      cityIn: { istanbul: 'in Istanbul', ankara: 'in Ankara', izmir: 'in Izmir' },
      sep: ':', free: 'Free', numLocale: 'en-US',
      tl: (n) => n.toFixed(2),
      dateLine: (d, M, D) => `${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()} - ${D[d.getDay()]}`,
      dateLong: (d, M, D) => `${D[d.getDay()]} ${d.getDate()} ${M[d.getMonth()]}`,
    },
  };
  let LANG = 'tr'; let LX = L10N.tr;
  // Exported arrays are refilled in place by setLang(), so references stay valid.
  const MONTHS = [...L10N.tr.months]; const DAYS = [...L10N.tr.days];
  const CITY_NAMES = { ...L10N.tr.cities };
  const fmtTL = (n) => LX.tl(n);
  const fmtLira = (n) => (n === 0 ? LX.free : `₺${n.toLocaleString(LX.numLocale)}`);
  const addMin = (hhmm, min) => { const [h, m] = hhmm.split(/[.:]/).map(Number); const t = (((h * 60 + m + min) % 1440) + 1440) % 1440; return `${pad(Math.floor(t / 60))}${LX.sep}${pad(t % 60)}`; };
  const dateShort = (iso) => LX.dateLong(fromIso(iso), LX.months, LX.days);

  /* ------------------------------------------------------------ categories */
  // [label, event-page category, poster kicker, interest phrase]
  const CAT_TXT = {
    electronic: { style: 'electronic', tr: ['Elektronik müzik', 'Elektronik Müzik', 'Elektronik Gece', 'elektronik müzik'], en: ['Electronic music', 'Electronic Music', 'Electronic Night', 'electronic music'] },
    jazz: { style: 'jazz', tr: ['Caz', 'Caz', 'Caz & Kültür', 'caz'], en: ['Jazz', 'Jazz', 'Jazz & Culture', 'jazz'] },
    theatre: { style: 'jazz', tr: ['Tiyatro', 'Tiyatro', 'Tiyatro', 'tiyatro'], en: ['Theatre', 'Theatre', 'Theatre', 'theatre'] },
    workshop: { style: 'workshop', tr: ['Atölye', 'Atölye', 'Yaratıcı Atölye', 'atölye'], en: ['Workshop', 'Workshop', 'Creative Workshop', 'workshops'] },
    festival: { style: 'electronic', tr: ['Festival', 'Festival', 'Festival', 'festival'], en: ['Festival', 'Festival', 'Festival', 'festivals'] },
    comedy: { style: 'workshop', tr: ['Komedi', 'Stand-up', 'Stand-up & Komedi', 'komedi'], en: ['Comedy', 'Stand-up', 'Stand-up & Comedy', 'comedy'] },
  };
  const CATS = {};
  Object.entries(CAT_TXT).forEach(([k, v]) => { CATS[k] = { style: v.style }; });

  /* ------------------------------------------------------------ the three sample events */
  // Shared by the event studio, the poster studio and the connected flow.
  const SAMPLES = [
    {
      id: 'sinyal', cat: 'electronic', title: 'Sinyal', date: '2026-12-15', time: '21:00',
      venue: 'Liman Depo', district: 'Karaköy', cityKey: 'istanbul', org: 'Liman Kolektif', price: 650, capacity: 400,
      tabs: { tr: 'Elektronik gece', en: 'Club night' },
      texts: {
        tr: "İstanbul'da, 15 Aralık'ta, elektronik müzik temalı bir gece düzenliyorum. Etkinlik saat 21.00'de başlayacak. Karaköy'de eski bir depoda, yerel DJ'lerle sabaha kadar sürecek. Yaklaşık 400 kişilik bir kapasitemiz var.",
        en: "I'm organising an electronic music night in Istanbul on 15 December. It starts at 21:00. It's in an old warehouse in Karaköy, with local DJs playing until morning. We have a capacity of about 400 people.",
      },
      poster: { style: 'electronic', variant: 0 },
    },
    {
      id: 'mavi-saat', cat: 'jazz', title: 'Mavi Saat', date: '2026-12-19', time: '20:30',
      venue: 'Arka Bahçe Sahne', district: 'Alsancak', cityKey: 'izmir', org: 'Arka Bahçe Kültür', price: 450, capacity: 120,
      tabs: { tr: 'Caz akşamı', en: 'Jazz evening' },
      texts: {
        tr: "İzmir Alsancak'ta küçük bir sahnede caz akşamı yapmak istiyoruz. 19 Aralık Cumartesi, saat 20.30'da başlayacak. Bir kuartet çalacak, aralarda kısa bir söyleşi olacak. 120 kişilik, masa düzeninde.",
        en: "We'd like to host a jazz evening on a small stage in Alsancak, Izmir. Saturday 19 December, starting at 20:30. A quartet will play, with a short talk between sets. Table seating for 120 people.",
      },
      poster: { style: 'jazz', variant: 0 },
    },
    {
      id: 'bicim', cat: 'workshop', title: 'Biçim Atölyesi', date: '2027-01-09', time: '13:00',
      venue: 'Kare Stüdyo', district: 'Kavaklıdere', cityKey: 'ankara', org: 'Kare Tasarım Okulu', price: 900, capacity: 24,
      tabs: { tr: 'Tasarım atölyesi', en: 'Workshop' },
      texts: {
        tr: "Ankara'da 9 Ocak'ta grafik tasarımcılar ve öğrenciler için bir afiş tasarımı atölyesi düzenliyoruz. Saat 13.00'te başlıyor, yaklaşık dört saat sürecek. Malzemeler bizden. Kontenjan 24 kişi.",
        en: "We're running a poster design workshop for graphic designers and students in Ankara on 9 January. It starts at 13:00 and lasts about four hours. Materials are provided. Places for 24 people.",
      },
      poster: { style: 'workshop', variant: 0 },
    },
  ];

  /* ------------------------------------------------------------ rule-based reader (Turkish and English) */
  const CITY = [['istanbul', 'istanbul'], ['ankara', 'ankara'], ['izmir', 'izmir'], ['antalya', 'Antalya'], ['bursa', 'Bursa'], ['eskisehir', 'Eskişehir'], ['mugla', 'Muğla'], ['bodrum', 'Muğla'], ['mardin', 'Mardin'], ['trabzon', 'Trabzon'], ['adana', 'Adana'], ['kapadokya', 'Nevşehir'], ['cappadocia', 'Nevşehir'], ['nevsehir', 'Nevşehir']];
  const DISTRICTS = {
    karakoy: ['Karaköy', 'istanbul'], kadikoy: ['Kadıköy', 'istanbul'], beyoglu: ['Beyoğlu', 'istanbul'], besiktas: ['Beşiktaş', 'istanbul'], moda: ['Moda', 'istanbul'], cihangir: ['Cihangir', 'istanbul'], sisli: ['Şişli', 'istanbul'], sariyer: ['Sarıyer', 'istanbul'],
    alsancak: ['Alsancak', 'izmir'], karsiyaka: ['Karşıyaka', 'izmir'], bornova: ['Bornova', 'izmir'], urla: ['Urla', 'izmir'],
    kavaklidere: ['Kavaklıdere', 'ankara'], cankaya: ['Çankaya', 'ankara'], tunali: ['Tunalı', 'ankara'], kizilay: ['Kızılay', 'ankara'], bahcelievler: ['Bahçelievler', 'ankara'],
  };
  const CAT_WORDS = [
    ['electronic', /elektronik|electronic|techno|tekno|\bhouse\b|\bdj|rave/], ['jazz', /\bcaz|jazz|kuartet|quartet|swing|blues/],
    ['workshop', /atolye|workshop|egitim|\bkurs|\bclass|seramik|ceramic|kaligrafi|calligraphy/],
    ['theatre', /tiyatro|theatre|theater|\bplay\b|oyun|monolog|drama/], ['comedy', /stand-?up|komedi|comedy|dogaclama|improv/], ['festival', /festival|senlik/],
  ];
  const MONTH_KEYS = [
    ['ocak', 'january', 'jan'], ['subat', 'february', 'feb'], ['mart', 'march', 'mar'], ['nisan', 'april', 'apr'], ['mayis', 'may'], ['haziran', 'june', 'jun'],
    ['temmuz', 'july', 'jul'], ['agustos', 'august', 'aug'], ['eylul', 'september', 'sept', 'sep'], ['ekim', 'october', 'oct'], ['kasim', 'november', 'nov'], ['aralik', 'december', 'dec'],
  ];
  const MONTH_RE = MONTH_KEYS.flat().sort((a, b) => b.length - a.length).join('|');
  const monthIndex = (w) => MONTH_KEYS.findIndex((ks) => ks.includes(w));
  const NUMW = { bir: 1, iki: 2, uc: 3, dort: 4, bes: 5, alti: 6, yedi: 7, sekiz: 8, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 };
  const cityFromKey = (k) => (L10N[LANG].cities[k] || k);

  function parse(text, today = new Date()) {
    const t = fold(text || '');
    const out = {};
    const dm = t.match(new RegExp(`(\\d{1,2})(?:st|nd|rd|th)?\\s*(?:of\\s+)?(${MONTH_RE})\\b`)) || t.match(new RegExp(`\\b(${MONTH_RE})\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b`));
    if (dm) {
      const [day, mw] = /\d/.test(dm[1]) ? [+dm[1], dm[2]] : [+dm[2], dm[1]];
      const mon = monthIndex(mw);
      if (mon >= 0 && day >= 1 && day <= 31) {
        let y = today.getFullYear(); let d = new Date(y, mon, day);
        const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (d < t0) { y += 1; d = new Date(y, mon, day); }
        if (d.getMonth() === mon) out.date = isoOf(d);
      }
    }
    let tm = t.match(/saat\s*(\d{1,2})[.:](\d{2})/) || t.match(/\bat\s*(\d{1,2})(?:[.:](\d{2}))?\s*(am|pm)\b/) || t.match(/\bat\s*(\d{1,2})[.:](\d{2})\b/) || t.match(/\b(\d{1,2})[.:](\d{2})\b/) || t.match(/\b(\d{1,2})\s*(am|pm)\b/);
    if (tm) {
      let h = +tm[1]; let m = tm[2] && /^\d+$/.test(tm[2]) ? +tm[2] : 0; const ap = tm[3] || (/^(am|pm)$/.test(tm[2] || '') ? tm[2] : null);
      if (ap === 'pm' && h < 12) h += 12; if (ap === 'am' && h === 12) h = 0;
      if (h < 24 && m < 60) out.time = `${pad(h)}:${pad(m)}`;
    }
    for (const [k, [dist, city]] of Object.entries(DISTRICTS)) { if (new RegExp(`(^|[^a-z])${k}`).test(t)) { out.district = dist; out.cityKey = city; break; } }
    for (const [k, v] of CITY) { if (t.includes(k)) { if (CITY_NAMES[v] || L10N.tr.cities[v]) out.cityKey = v; else { out.cityKey = null; out.cityName = v; } break; } }
    if (out.cityKey) out.city = cityFromKey(out.cityKey); else if (out.cityName) out.city = out.cityName;
    for (const [cat, re] of CAT_WORDS) { if (re.test(t)) { out.cat = cat; break; } }
    const cap = t.match(/(\d{2,5})\s*(?:kisi|people|guests|seats|person)/) || t.match(/(?:kontenjan[ıi]?|capacity(?:\s+of)?(?:\s+about)?)\s*(\d{1,5})/); if (cap) out.capacity = +cap[1];
    const pr = t.match(/(\d{2,5})\s*(?:tl|₺|lira)/) || t.match(/₺\s*(\d{2,5})/); if (pr) out.price = +pr[1];
    const du = t.match(/(\d{1,2}|bir|iki|uc|dort|bes|alti|yedi|sekiz|one|two|three|four|five|six|seven|eight)\s*(?:saat|hours?)(?!\s*\d)/); if (du) out.hours = /\d/.test(du[1]) ? +du[1] : NUMW[du[1]];
    out.materials = /malzeme|material/.test(t);
    out.topic = /afis|poster/.test(t) ? 'poster' : /seramik|ceramic/.test(t) ? 'ceramic' : /kaligrafi|calligraphy/.test(t) ? 'calligraphy' : /fotograf|photo/.test(t) ? 'photo' : null;
    return out;
  }

  /* ------------------------------------------------------------ draft templates */
  const NUM_TR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on'];
  const NUM_EN = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const where = (p) => `${p.venue}${p.district ? `, ${p.district}` : ''}`;
  const capTr = (p, start) => (p.capacity ? `${p.capacity} kişilik` : start ? 'Sınırlı kapasiteli' : 'sınırlı kapasiteli');
  const seatsEn = (p) => (p.capacity ? `The ${p.capacity}-seat` : 'The small');
  const TEMPLATES = {
    electronic: {
      names: ['Sinyal', 'Frekans', 'Derin Hat', 'Gece Akışı'],
      tr: {
        tail: (p) => `Elektronik ${p.season} Gecesi`,
        desc: (p) => [
          `${p.name}, ${p.dateLong} akşamı elektronik müziğin güncel seslerini ${p.city} gece hayatının kalbinde bir araya getiriyor.`,
          `Saat ${p.time} itibarıyla başlayan gecede yerel DJ'ler sabaha kadar sahnede. Güçlü bir ses sistemi, loş ışıklar ve ${capTr(p)} samimi bir kalabalık seni bekliyor.`,
        ],
        tags: (p) => ['Elektronik', 'Techno', 'Gece', p.district || p.city, '18+'],
        schedule: (p) => [[p.time, 'Kapılar açılır'], [addMin(p.time, 60), 'Açılış seti'], [addMin(p.time, 180), 'Ana set'], [addMin(p.time, 330), 'Kapanış seti']],
        tickets: [['Erken Kayıt', 'İlk 100 bilet', 0.8], ['Genel Giriş', 'Tüm gece geçerli', 1], ['Backstage', 'Ayrı giriş ve bar alanı', 2]],
        faq: (p) => [
          ['Yaş sınırı var mı?', 'Etkinlik 18 yaş ve üzeri katılımcılar içindir; girişte kimlik kontrolü yapılır.'],
          ['Kapılar ne zaman açılıyor?', `Kapılar saat ${p.time} itibarıyla açılır. Son giriş: ${addMin(p.time, 150)}.`],
          ['Bilet iadesi mümkün mü?', 'İade ve değişim koşullarını organizatör belirler; koşullar bilet sayfasında yer alır.'],
          ['Mekâna nasıl ulaşırım?', `Mekân: ${where(p)}. Toplu taşımayla kolayca ulaşılabilir.`],
        ],
      },
      en: {
        tail: (p) => `Electronic ${p.season} Night`,
        desc: (p) => [
          `${p.name} brings the newest sounds in electronic music to the heart of ${p.city}'s nightlife on the evening of ${p.dateLong}.`,
          `Doors open at ${p.time}, and local DJs play until morning. Expect a powerful sound system, low lights and ${p.capacity ? `an intimate crowd of ${p.capacity}` : 'an intimate crowd'}.`,
        ],
        tags: (p) => ['Electronic', 'Techno', 'Night', p.district || p.city, '18+'],
        schedule: (p) => [[p.time, 'Doors open'], [addMin(p.time, 60), 'Opening set'], [addMin(p.time, 180), 'Main set'], [addMin(p.time, 330), 'Closing set']],
        tickets: [['Early Bird', 'First 100 tickets', 0.8], ['General Admission', 'Valid all night', 1], ['Backstage', 'Separate entrance and bar', 2]],
        faq: (p) => [
          ['Is there an age limit?', 'The event is for guests aged 18 and over; ID is checked at the door.'],
          ['When do the doors open?', `Doors open at ${p.time}. Last entry: ${addMin(p.time, 150)}.`],
          ['Can I get a refund?', 'The organizer sets the refund and exchange terms; they are shown on the ticket page.'],
          ['How do I get to the venue?', `Venue: ${where(p)}. It is easy to reach by public transport.`],
        ],
      },
    },
    jazz: {
      names: ['Mavi Saat', 'Gece Notaları', 'Kırmızı Perde'],
      tr: {
        tail: (p) => `${p.season} Caz Akşamları`,
        desc: (p) => [
          `${p.name}, ${p.dateLong} akşamı caz severleri sıcak ve samimi bir salonda buluşturuyor.`,
          `Saat ${p.time} itibarıyla başlayan konserde standartlardan özgün bestelere uzanan bir repertuvar var. ${capTr(p, true)} salon, sahneye yakın bir dinleme deneyimi sunuyor.`,
        ],
        tags: (p) => ['Caz', 'Canlı müzik', 'Konser', p.district || p.city, 'Masa düzeni'],
        schedule: (p) => [[addMin(p.time, -30), 'Kapılar açılır'], [p.time, 'Birinci set'], [addMin(p.time, 60), 'Ara ve söyleşi'], [addMin(p.time, 90), 'İkinci set']],
        tickets: [['Bar Ayakta', 'Bar çevresinde ayakta', 0.7], ['Salon', 'Numarasız oturma', 1], ['Ön Masa', 'Sahneye en yakın masalar', 1.8]],
        faq: (p) => [
          ['Oturma düzeni nasıl?', 'Oturma düzeni numarasızdır; masalar geliş sırasına göre doldurulur.'],
          ['Yiyecek ve içecek servisi var mı?', 'Mekânda servis vardır; dışarıdan yiyecek ve içecek getirilmez.'],
          ['Yaş sınırı var mı?', 'Etkinlik 12 yaş ve üzeri için uygundur; 18 yaş altı katılımcılar velisiyle gelmelidir.'],
          ['Mekâna nasıl ulaşırım?', `Mekân: ${where(p)}. Toplu taşımayla kolayca ulaşılabilir.`],
        ],
      },
      en: {
        tail: (p) => `${p.season} Jazz Evenings`,
        desc: (p) => [
          `${p.name} brings jazz lovers together in a warm, intimate room on the evening of ${p.dateLong}.`,
          `The concert starts at ${p.time}, with a repertoire that runs from standards to original compositions. ${seatsEn(p)} room keeps every seat close to the stage.`,
        ],
        tags: (p) => ['Jazz', 'Live music', 'Concert', p.district || p.city, 'Table seating'],
        schedule: (p) => [[addMin(p.time, -30), 'Doors open'], [p.time, 'First set'], [addMin(p.time, 60), 'Break and talk'], [addMin(p.time, 90), 'Second set']],
        tickets: [['Bar Standing', 'Standing around the bar', 0.7], ['Hall', 'Unreserved seating', 1], ['Front Table', 'Tables closest to the stage', 1.8]],
        faq: (p) => [
          ['How is the seating arranged?', 'Seating is unreserved; tables fill on a first-come basis.'],
          ['Is food and drink served?', 'Yes, the venue has table service; outside food and drink are not allowed.'],
          ['Is there an age limit?', 'The event suits ages 12 and over; under-18s must come with a parent or guardian.'],
          ['How do I get to the venue?', `Venue: ${where(p)}. It is easy to reach by public transport.`],
        ],
      },
    },
    workshop: {
      names: ['Biçim', 'Harf & Renk', 'Kare'],
      tr: {
        tail: (p) => ({ poster: 'Afiş Tasarımı Atölyesi', ceramic: 'Seramik Atölyesi', calligraphy: 'Kaligrafi Atölyesi', photo: 'Fotoğraf Atölyesi' }[p.topic] || 'Yaratıcı Tasarım Atölyesi'),
        desc: (p) => [
          `${p.name}, ${p.dateLong} günü tasarıma meraklı herkes için uygulamalı bir atölye.`,
          `Saat ${p.time} itibarıyla başlayan yaklaşık ${NUM_TR[p.hours] || p.hours} saatlik programda temel ilkelerden kendi işini üretmeye adım adım ilerleyeceksin.${p.materials ? ' Tüm malzemeler organizatör tarafından sağlanır.' : ''}${p.capacity ? ` Kontenjan ${p.capacity} kişiyle sınırlıdır.` : ''}`,
        ],
        tags: (p) => ['Atölye', 'Tasarım', 'Uygulamalı', p.district || p.city, 'Sınırlı kontenjan'],
        schedule: (p) => [[p.time, 'Tanışma ve kısa sunum'], [addMin(p.time, 30), 'Temel ilkeler'], [addMin(p.time, 90), 'Uygulama'], [addMin(p.time, p.hours * 60 - 30), 'Paylaşım ve kapanış']],
        tickets: [['Öğrenci', 'Öğrenci belgesiyle', 0.7], ['Katılımcı', 'Tüm malzemeler dahil', 1], ['Katılımcı + Kitap', 'Atölye kitabı hediye', 1.4]],
        faq: (p) => [
          ['Ön bilgi gerekiyor mu?', 'Hayır; atölye her seviyeden katılımcıya uygundur.'],
          ['Malzeme getirmem gerekiyor mu?', p.materials ? 'Hayır; tüm malzemeler atölyede sağlanır.' : 'Gerekli malzeme listesi kayıttan sonra paylaşılır.'],
          ['Kontenjan ne kadar?', p.capacity ? `Kontenjan ${p.capacity} kişiyle sınırlıdır.` : 'Kontenjan sınırlıdır; kayıtlar geliş sırasına göre alınır.'],
          ['Katılım belgesi verilecek mi?', 'Atölye sonunda katılımcılara dijital katılım belgesi gönderilir.'],
        ],
      },
      en: {
        tail: (p) => ({ poster: 'Poster Design Workshop', ceramic: 'Ceramics Workshop', calligraphy: 'Calligraphy Workshop', photo: 'Photography Workshop' }[p.topic] || 'Creative Design Workshop'),
        desc: (p) => [
          `${p.name} is a hands-on workshop for anyone curious about design, on ${p.dateLong}.`,
          `It starts at ${p.time} and runs for ${p.hours === 1 ? 'about an hour' : `about ${NUM_EN[p.hours] || p.hours} hours`}, taking you step by step from the basics to making your own piece.${p.materials ? ' All materials are provided by the organizer.' : ''}${p.capacity ? ` Places are limited to ${p.capacity}.` : ''}`,
        ],
        tags: (p) => ['Workshop', 'Design', 'Hands-on', p.district || p.city, 'Limited places'],
        schedule: (p) => [[p.time, 'Welcome and short talk'], [addMin(p.time, 30), 'Core principles'], [addMin(p.time, 90), 'Hands-on practice'], [addMin(p.time, p.hours * 60 - 30), 'Show and tell']],
        tickets: [['Student', 'With a student ID', 0.7], ['Participant', 'All materials included', 1], ['Participant + Book', 'Includes the workshop book', 1.4]],
        faq: (p) => [
          ['Do I need any experience?', 'No; the workshop suits every level.'],
          ['Do I need to bring materials?', p.materials ? 'No; all materials are provided at the workshop.' : 'A list of materials is shared after you register.'],
          ['How many places are there?', p.capacity ? `Places are limited to ${p.capacity}.` : 'Places are limited and given on a first-come basis.'],
          ['Will I get a certificate?', 'Participants receive a digital certificate of attendance after the workshop.'],
        ],
      },
    },
    theatre: {
      names: ['Sessiz Oda', 'Kâğıt Ev', 'Fısıltı'],
      tr: {
        tail: () => 'Tek Perdelik Oyun',
        desc: (p) => [
          `${p.name}, ${p.dateLong} akşamı seyirciyi yakın mesafeden izlenen, tek perdelik bir oyuna davet ediyor.`,
          `Oyun saat ${p.time} itibarıyla başlar ve yaklaşık 80 dakika sürer. ${capTr(p, true)} salonda her koltuktan sahne rahatça görülür.`,
        ],
        tags: (p) => ['Tiyatro', 'Tek perde', 'Sahne', p.district || p.city, '13+'],
        schedule: (p) => [[addMin(p.time, -30), 'Salon açılır'], [p.time, 'Oyun başlar'], [addMin(p.time, 80), 'Oyun sonu'], [addMin(p.time, 90), 'Seyirciyle söyleşi']],
        tickets: [['Öğrenci', 'Öğrenci belgesiyle', 0.6], ['Tam', 'Numaralı koltuk', 1], ['Ön Sıra', 'İlk üç sıra', 1.4]],
        faq: (p) => [
          ['Oyun kaç dakika?', 'Oyun aralıksız, yaklaşık 80 dakikadır.'],
          ['Geç gelirsem içeri alınır mıyım?', 'Oyun başladıktan sonra salona giriş yapılamaz.'],
          ['Yaş sınırı var mı?', 'Oyun 13 yaş ve üzeri seyirciler için uygundur.'],
          ['Mekâna nasıl ulaşırım?', `Mekân: ${where(p)}. Toplu taşımayla kolayca ulaşılabilir.`],
        ],
      },
      en: {
        tail: () => 'A One-Act Play',
        desc: (p) => [
          `${p.name} invites the audience to an intimate, one-act play on the evening of ${p.dateLong}.`,
          `The play starts at ${p.time} and runs for about 80 minutes. ${seatsEn(p)} hall gives every seat a clear view of the stage.`,
        ],
        tags: (p) => ['Theatre', 'One act', 'Stage', p.district || p.city, '13+'],
        schedule: (p) => [[addMin(p.time, -30), 'Doors open'], [p.time, 'Play begins'], [addMin(p.time, 80), 'Play ends'], [addMin(p.time, 90), 'Q&A with the cast']],
        tickets: [['Student', 'With a student ID', 0.6], ['Standard', 'Reserved seat', 1], ['Front Row', 'First three rows', 1.4]],
        faq: (p) => [
          ['How long is the play?', 'About 80 minutes, with no interval.'],
          ['Can I come in late?', 'Latecomers cannot be admitted once the play has started.'],
          ['Is there an age limit?', 'The play is suitable for ages 13 and over.'],
          ['How do I get to the venue?', `Venue: ${where(p)}. It is easy to reach by public transport.`],
        ],
      },
    },
    comedy: {
      names: ['Kısa Devre', 'Açık Mikrofon', 'Kahkaha Kulübü'],
      tr: {
        tail: () => 'Stand-up Gecesi',
        desc: (p) => [
          `${p.name}, ${p.dateLong} akşamı yeni ve tanıdık komedyenleri aynı sahnede buluşturuyor.`,
          `Gösteri saat ${p.time} itibarıyla başlar. ${capTr(p, true)} salonda, sahneye yakın ve bol kahkahalı bir gece seni bekliyor.`,
        ],
        tags: (p) => ['Stand-up', 'Komedi', 'Gece', p.district || p.city, '16+'],
        schedule: (p) => [[addMin(p.time, -30), 'Kapılar açılır'], [p.time, 'Açılış'], [addMin(p.time, 20), 'Konuk komedyenler'], [addMin(p.time, 75), 'Ana gösteri']],
        tickets: [['Erken Kayıt', 'Sınırlı sayıda', 0.8], ['Genel Giriş', 'Numarasız oturma', 1], ['Ön Masa', 'Sahneye en yakın', 1.6]],
        faq: (p) => [
          ['Yaş sınırı var mı?', 'Gösteri 16 yaş ve üzeri içindir.'],
          ['Oturma düzeni nasıl?', 'Oturma düzeni numarasızdır; erken gelen istediği yeri seçer.'],
          ['Gösteri kaydedilecek mi?', 'Gösteri sırasında izinsiz ses ve görüntü kaydı yapılamaz.'],
          ['Mekâna nasıl ulaşırım?', `Mekân: ${where(p)}. Toplu taşımayla kolayca ulaşılabilir.`],
        ],
      },
      en: {
        tail: () => 'Stand-up Night',
        desc: (p) => [
          `${p.name} brings new and familiar comedians to the same stage on the evening of ${p.dateLong}.`,
          `The show starts at ${p.time}. ${seatsEn(p)} room puts you close to the stage for a night full of laughs.`,
        ],
        tags: (p) => ['Stand-up', 'Comedy', 'Night', p.district || p.city, '16+'],
        schedule: (p) => [[addMin(p.time, -30), 'Doors open'], [p.time, 'Opening'], [addMin(p.time, 20), 'Guest comedians'], [addMin(p.time, 75), 'Headline show']],
        tickets: [['Early Bird', 'Limited number', 0.8], ['General Admission', 'Unreserved seating', 1], ['Front Table', 'Closest to the stage', 1.6]],
        faq: (p) => [
          ['Is there an age limit?', 'The show is for ages 16 and over.'],
          ['How is the seating arranged?', 'Seating is unreserved; early arrivals choose their spot.'],
          ['Will the show be recorded?', 'Recording audio or video without permission is not allowed.'],
          ['How do I get to the venue?', `Venue: ${where(p)}. It is easy to reach by public transport.`],
        ],
      },
    },
    festival: {
      names: ['Kış Işıkları', 'Rüzgâr', 'Sokak Sesleri'],
      tr: {
        tail: (p) => `${p.city} ${p.season} Festivali`,
        desc: (p) => [
          `${p.name}, ${p.dateLong} günü müziği, yemeği ve atölyeleri tek bir alanda buluşturuyor.`,
          `Kapılar saat ${p.time} itibarıyla açılıyor. Gün boyu iki sahne, yerel tasarımcıların stantları ve çocuklar için etkinlik alanı seni bekliyor.`,
        ],
        tags: (p) => ['Festival', 'Açık hava', 'Müzik', p.district || p.city, 'Aile dostu'],
        schedule: (p) => [[p.time, 'Kapılar açılır'], [addMin(p.time, 60), 'Atölyeler'], [addMin(p.time, 180), 'Gün batımı konseri'], [addMin(p.time, 300), 'Ana sahne']],
        tickets: [['Günlük', 'Tek gün geçerli', 1], ['Kombine', 'İki gün geçerli', 1.7], ['Destekçi', 'Hızlı giriş ve hediye', 2.4]],
        faq: (p) => [
          ['Çocuklar katılabilir mi?', '12 yaş altı çocuklar ebeveynleriyle ücretsiz katılabilir.'],
          ['Yiyecek alanı var mı?', 'Festival alanında yerel yiyecek ve içecek stantları bulunur.'],
          ['Hava koşulları kötü olursa?', 'Olası bir değişiklik organizatör tarafından bilet sahiplerine bildirilir.'],
          ['Alana nasıl ulaşırım?', `Alan: ${where(p)}. Toplu taşımayla ulaşım önerilir.`],
        ],
      },
      en: {
        tail: (p) => `${p.city} ${p.season} Festival`,
        desc: (p) => [
          `${p.name} brings music, food and workshops together in one place on ${p.dateLong}.`,
          `Gates open at ${p.time}. Expect two stages, stalls from local designers and an activity area for children, all day long.`,
        ],
        tags: (p) => ['Festival', 'Open air', 'Music', p.district || p.city, 'Family friendly'],
        schedule: (p) => [[p.time, 'Gates open'], [addMin(p.time, 60), 'Workshops'], [addMin(p.time, 180), 'Sunset concert'], [addMin(p.time, 300), 'Main stage']],
        tickets: [['Day Pass', 'Valid for one day', 1], ['Weekend Pass', 'Valid for both days', 1.7], ['Supporter', 'Fast entry and a gift', 2.4]],
        faq: (p) => [
          ['Can children come?', 'Children under 12 get in free with a parent.'],
          ['Is there food?', 'Local food and drink stalls are on site.'],
          ['What if the weather is bad?', 'The organizer tells ticket holders about any change.'],
          ['How do I get there?', `Site: ${where(p)}. Public transport is recommended.`],
        ],
      },
    },
  };

  const hashStr = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

  // Builds the draft page. sample: the selected sample (gives defaults for
  // anything the text does not mention). fields: venue, org, price.
  function draft(text, fields, sample, today = new Date()) {
    const found = parse(text, today);
    const cat = found.cat || sample.cat;
    const T = TEMPLATES[cat]; const TL = T[LANG];
    const date = found.date || sample.date; const d = fromIso(date);
    const time = found.time || sample.time;
    const city = found.city || sample.city;
    const sameCity = !found.cityKey || found.cityKey === sample.cityKey;
    const district = found.district || (sameCity ? sample.district : '');
    const unchanged = text.trim() === sample.text.trim();
    const name = unchanged && cat === sample.cat ? sample.title.replace(/ Atölyesi$/, '') : T.names[hashStr(`${cat}|${city}|${date}`) % T.names.length];
    const p = {
      name, city, district, time: time.replace(':', LX.sep), venue: fields.venue || sample.venue, season: LX.seasons[d.getMonth()],
      dateLong: LX.dateLong(d, LX.months, LX.days), capacity: found.capacity || null,
      hours: found.hours || (cat === 'workshop' ? 3 : 2), materials: !!found.materials, topic: found.topic,
    };
    const base = Number(fields.price) >= 0 && fields.price !== '' ? Number(fields.price) : (found.price || sample.price);
    const tickets = TL.tickets.map(([n, ds, k]) => ({ name: n, desc: ds, price: roundPrice(base * k) }));
    const prices = tickets.map((x) => x.price);
    return {
      found, cat, catPage: CATS[cat].page, kicker: CATS[cat].kicker, style: CATS[cat].style,
      title: `${name}: ${TL.tail(p)}`, shortTitle: name === 'Biçim' ? 'Biçim Atölyesi' : name,
      date, time, dateLine: LX.dateLine(d, LX.months, LX.days),
      city, district, venue: p.venue, org: fields.org || sample.org, capacity: p.capacity,
      desc: TL.desc(p), tags: TL.tags(p).filter(Boolean), schedule: TL.schedule(p), tickets, faq: TL.faq(p),
      priceRange: `${fmtTL(Math.min(...prices))} TRY - ${fmtTL(Math.max(...prices))} TRY`,
    };
  }

  /* ------------------------------------------------------------ demo catalogue for suggestions */
  // day = offset from the coming Saturday (Friday = -1, Sunday = 1, next week = 2…8).
  const EVENTS = [
    // Istanbul
    { id: 'derin-hat', t: 'Derin Hat', cat: 'electronic', city: 'istanbul', district: 'Kadıköy', venue: 'Yeldeğirmeni Garaj', day: 0, time: '23:00', price: 450, v: 1, p: 0, pop: 0.82 },
    { id: 'kuzey-isigi', t: 'Kuzey Işığı', cat: 'electronic', city: 'istanbul', district: 'Beşiktaş', venue: 'Akaretler Depo', day: 6, time: '22:00', price: 900, v: 2, p: 0, pop: 0.74 },
    { id: 'gece-yarisi-caz', t: 'Gece Yarısı Caz Kulübü', cat: 'jazz', city: 'istanbul', district: 'Beyoğlu', venue: 'Asmalı Bodrum', day: 1, time: '21:30', price: 400, v: 0, p: 1, pop: 0.7 },
    { id: 'pazar-cazi', t: 'Pazar Kahvaltısı Cazı', cat: 'jazz', city: 'istanbul', district: 'Cihangir', venue: 'Merdiven Kafe', day: 1, time: '12:00', price: 0, v: 1, p: 2, pop: 0.6 },
    { id: 'sessiz-oda', t: 'Sessiz Oda', cat: 'theatre', city: 'istanbul', district: 'Moda', venue: 'Küçük Salon', day: 4, time: '20:00', price: 350, v: 2, p: 2, pop: 0.66 },
    { id: 'son-perde', t: 'Son Perde', cat: 'theatre', city: 'istanbul', district: 'Beyoğlu', venue: 'Galata Oda Sahnesi', day: 0, time: '20:30', price: 550, v: 1, p: 2, pop: 0.71 },
    { id: 'kil-renk', t: 'Kil & Renk', cat: 'workshop', city: 'istanbul', district: 'Karaköy', venue: 'Çamur Atölye', day: 1, time: '14:00', price: 900, v: 0, p: 1, pop: 0.64 },
    { id: 'linol', t: 'Linol Baskı Atölyesi', cat: 'workshop', city: 'istanbul', district: 'Beyoğlu', venue: 'Baskı Evi', day: 7, time: '11:00', price: 750, v: 2, p: 0, pop: 0.58 },
    { id: 'acik-mikrofon', t: 'Açık Mikrofon Gecesi', cat: 'comedy', city: 'istanbul', district: 'Beşiktaş', venue: 'Kahkaha Bodrum', day: -1, time: '21:00', price: 0, v: 1, p: 1, pop: 0.69 },
    { id: 'dogaclama', t: 'Doğaçlama Sahne', cat: 'comedy', city: 'istanbul', district: 'Kadıköy', venue: 'Altıyol Sahne', day: 9, time: '20:30', price: 300, v: 1, p: 2, pop: 0.55 },
    { id: 'kis-isiklari', t: 'Kış Işıkları Festivali', cat: 'festival', city: 'istanbul', district: 'Haliç', venue: 'Tersane Meydanı', day: 0, time: '15:00', price: 1200, v: 2, p: 2, pop: 0.88 },
    { id: 'sokak-festivali', t: 'Sokak Sesleri Festivali', cat: 'festival', city: 'istanbul', district: 'Kadıköy', venue: 'Bahariye Caddesi', day: 8, time: '12:00', price: 0, v: 0, p: 1, pop: 0.77 },
    // Ankara
    { id: 'baskent-ritmi', t: 'Başkent Ritmi', cat: 'electronic', city: 'ankara', district: 'Çankaya', venue: 'Atölye 06', day: 0, time: '22:00', price: 400, v: 1, p: 1, pop: 0.79 },
    { id: 'tunali-seans', t: 'Tunalı Gece Seansı', cat: 'electronic', city: 'ankara', district: 'Tunalı', venue: 'Kat 4 Kulüp', day: 6, time: '23:00', price: 550, v: 0, p: 2, pop: 0.68 },
    { id: 'mavi-kapi', t: 'Mavi Kapı Caz Akşamları', cat: 'jazz', city: 'ankara', district: 'Kavaklıdere', venue: 'Mavi Kapı Sahne', day: 5, time: '20:30', price: 350, v: 1, p: 0, pop: 0.63 },
    { id: 'plak-gecesi', t: 'Plak Gecesi: Caz Klasikleri', cat: 'jazz', city: 'ankara', district: 'Bahçelievler', venue: 'Plakçı Kafe', day: -1, time: '20:00', price: 0, v: 0, p: 2, pop: 0.6 },
    { id: 'tek-kisilik', t: 'Tek Kişilik Hamlet', cat: 'theatre', city: 'ankara', district: 'Çankaya', venue: 'Oda Tiyatrosu', day: 1, time: '19:00', price: 450, v: 2, p: 0, pop: 0.72 },
    { id: 'kagit-ev', t: 'Kâğıt Ev', cat: 'theatre', city: 'ankara', district: 'Kızılay', venue: 'Sahne 9', day: 11, time: '20:00', price: 250, v: 1, p: 2, pop: 0.57 },
    { id: 'kis-senligi', t: 'Kış Şenliği', cat: 'festival', city: 'ankara', district: 'Çankaya', venue: 'Kuğulu Meydan', day: 7, time: '14:00', price: 0, v: 1, p: 2, pop: 0.75 },
    { id: 'kaligrafi', t: 'Kaligrafi Atölyesi', cat: 'workshop', city: 'ankara', district: 'Kavaklıdere', venue: 'Hat Evi', day: 0, time: '11:00', price: 500, v: 1, p: 0, pop: 0.61 },
    { id: 'fotograf-yuruyusu', t: 'Fotoğraf Yürüyüşü', cat: 'workshop', city: 'ankara', district: 'Ulus', venue: 'Hamamönü Buluşma', day: 1, time: '10:00', price: 0, v: 0, p: 2, pop: 0.59 },
    { id: 'kahkaha-kulubu', t: 'Kahkaha Kulübü', cat: 'comedy', city: 'ankara', district: 'Çankaya', venue: 'Bodrum Sahne', day: 0, time: '21:00', price: 350, v: 2, p: 1, pop: 0.73 },
    // Izmir
    { id: 'liman-gecesi', t: 'Liman Gecesi', cat: 'electronic', city: 'izmir', district: 'Alsancak', venue: 'Kordon Depo', day: 0, time: '23:00', price: 550, v: 2, p: 0, pop: 0.8 },
    { id: 'gece-kuslari', t: 'Gece Kuşları', cat: 'electronic', city: 'izmir', district: 'Bornova', venue: 'Vagon Kulüp', day: 6, time: '23:00', price: 400, v: 1, p: 0, pop: 0.67 },
    { id: 'kordon-caz', t: 'Kordon Caz Buluşması', cat: 'jazz', city: 'izmir', district: 'Alsancak', venue: 'Kordon Sahne', day: -1, time: '21:00', price: 600, v: 1, p: 2, pop: 0.71 },
    { id: 'ege-kuarteti', t: 'Ege Caz Kuarteti', cat: 'jazz', city: 'izmir', district: 'Urla', venue: 'Bağ Evi Sahne', day: 10, time: '20:30', price: 750, v: 0, p: 0, pop: 0.62 },
    { id: 'yaz-gecesi', t: 'Bir Yaz Gecesi Rüyası', cat: 'theatre', city: 'izmir', district: 'Karşıyaka', venue: 'Kent Tiyatrosu', day: 6, time: '20:00', price: 0, v: 2, p: 1, pop: 0.7 },
    { id: 'fisilti', t: 'Fısıltı', cat: 'theatre', city: 'izmir', district: 'Alsancak', venue: 'Küçük Sahne', day: 0, time: '20:30', price: 250, v: 1, p: 0, pop: 0.64 },
    { id: 'kahve-kaligrafi', t: 'Kahve & Kaligrafi', cat: 'workshop', city: 'izmir', district: 'Alsancak', venue: 'Mürekkep Atölye', day: 1, time: '11:00', price: 400, v: 1, p: 1, pop: 0.6 },
    { id: 'dijital-cizim', t: 'Dijital Çizim Atölyesi', cat: 'workshop', city: 'izmir', district: 'Bornova', venue: 'Piksel Lab', day: 5, time: '18:30', price: 1000, v: 0, p: 1, pop: 0.56 },
    { id: 'ege-komedi', t: 'Ege Komedi Turu', cat: 'comedy', city: 'izmir', district: 'Bornova', venue: 'Kahve Sahne', day: 7, time: '21:00', price: 300, v: 2, p: 0, pop: 0.66 },
    { id: 'ruzgar', t: 'Rüzgâr Festivali', cat: 'festival', city: 'izmir', district: 'Urla', venue: 'Zeytinlik Alanı', day: 7, time: '13:00', price: 900, v: 0, p: 1, pop: 0.84 },
    { id: 'kemeralti', t: 'Kemeraltı Sokak Festivali', cat: 'festival', city: 'izmir', district: 'Konak', venue: 'Kemeraltı Çarşısı', day: 1, time: '12:00', price: 0, v: 2, p: 0, pop: 0.76 },
  ];

  // Dates are relative to today, so "this weekend" always means the coming one.
  function weekendAnchor(today = new Date()) {
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()); const dow = t.getDay();
    const toSat = dow === 0 ? -1 : 6 - dow;
    return addDays(t, toSat);
  }
  function datedEvents(today = new Date()) {
    const sat = weekendAnchor(today); const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return EVENTS.map((e) => {
      const d = addDays(sat, e.day);
      return { ...e, date: isoOf(d), d, past: d < t0, label: LX.dateLong(d, LX.months, LX.days), window: e.day <= 1 ? 'weekend' : e.day <= 8 ? 'nextweek' : 'later' };
    }).filter((e) => !e.past);
  }

  const BUDGET = {
    free: { ok: (p) => p === 0, tr: ['Ücretsiz', 'Üstelik ücretsiz.'], en: ['Free', "And it's free."] },
    u500: { ok: (p) => p < 500, tr: ['₺500 altı', '₺500 altı bütçenize de uyuyor.'], en: ['Under ₺500', 'Also fits your under-₺500 budget.'] },
    mid: { ok: (p) => p >= 500 && p <= 1500, tr: ['₺500–₺1.500', 'Bütçe aralığınızda.'], en: ['₺500–₺1,500', 'Within your budget range.'] },
    any: { ok: () => true, tr: ['Fark etmez', ''], en: ['Any', ''] },
  };
  const WHEN = {
    weekend: { ok: (e) => e.window === 'weekend', tr: ['Bu hafta sonu', 'hafta sonu'], en: ['This weekend', 'weekend'] },
    nextweek: { ok: (e) => e.window === 'nextweek', tr: ['Gelecek hafta', 'gelecek hafta'], en: ['Next week', 'next-week'] },
    any: { ok: () => true, tr: ['Herhangi bir tarih', ''], en: ['Any date', ''] },
  };

  // Scores the catalogue against the preferences. City is a hard filter.
  // Interest, date and budget add to one score; a card that misses the date
  // or budget preference can still appear, and its reason says so.
  function recommend(prefs, today = new Date()) {
    const all = datedEvents(today).filter((e) => e.city === prefs.city);
    const ints = prefs.interests || []; const W = WHEN[prefs.when]; const B = BUDGET[prefs.budget];
    const soon = (e) => 1 - Math.min(1, (e.d - weekendAnchor(today)) / (14 * 864e5) + 0.1);
    const ranked = all.map((e) => {
      const w = W.ok(e); const b = B.ok(e.price); const hit = ints.length === 0 ? null : ints.includes(e.cat);
      const s = (hit === null ? 0.75 : hit ? 1 : 0) * 45 + (w ? 20 : 0) + (b ? 20 : 0) + e.pop * 10 + soon(e) * 5;
      return { e, s, w, b };
    }).sort((x, y) => y.s - x.s);
    const strictCount = ranked.filter((x) => x.w && x.b).length;
    return {
      total: all.length, strictCount,
      items: ranked.slice(0, 3).map((x) => ({ ...x.e, match: Math.round(Math.min(98, Math.max(40, x.s))), relaxed: !(x.w && x.b), reason: reasonFor(x, prefs) })),
    };
  }
  function reasonFor(x, prefs) {
    const e = x.e; const ints = prefs.interests || []; const W = WHEN[prefs.when]; const B = BUDGET[prefs.budget];
    const hit = ints.length > 0 && ints.includes(e.cat); const interest = CATS[e.cat].interest;
    const whenP = W.phrase; const budgetP = B.phrase; const cityIn = LX.cityIn[e.city];
    let s;
    if (LANG === 'en') {
      if (!(x.w && x.b)) {
        const miss = !x.w && !x.b ? 'outside your date and budget preferences' : !x.w ? `not on your chosen dates (${e.label})` : prefs.budget === 'free' ? 'a paid event' : 'outside your budget';
        s = `${miss}; ${hit ? `an alternative that matches your interest in ${interest}.` : `a standout alternative ${cityIn}.`}`;
      } else if (ints.length && !hit) {
        s = `${whenP ? `fits your ${whenP} preference; ` : ''}a good pick if you'd like to try something different.`;
        if (budgetP) s += ` ${budgetP}`;
      } else {
        const parts = [];
        if (hit) parts.push(`your interest in ${interest}`);
        if (whenP) parts.push(`your ${whenP} preference`);
        s = parts.length ? `matches ${parts.join(' and ')}.` : `one of the highlights ${cityIn} for these dates.`;
        if (budgetP) s += ` ${budgetP}`;
      }
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    const ilgi = `${interest} ilginize`;
    if (!(x.w && x.b)) {
      const miss = !x.w && !x.b ? 'tarih ve bütçe tercihinizin dışında' : !x.w ? `seçtiğiniz tarihlerde değil (${e.label})` : prefs.budget === 'free' ? 'ücretli bir etkinlik' : 'bütçe tercihinizin dışında';
      s = `${miss}; ${hit ? `${ilgi} uygun bir alternatif.` : `${cityIn} öne çıkan bir alternatif.`}`;
    } else if (ints.length && !hit) {
      s = `${whenP ? `${whenP} tercihinize uygun; ` : ''}farklı bir tür denemek isterseniz iyi bir seçenek.`;
      if (budgetP) s += ` ${budgetP}`;
    } else {
      const parts = [];
      if (hit) parts.push(ilgi);
      if (whenP) parts.push(`${whenP} tercihinize`);
      s = parts.length ? `${parts.join(' ve ')} uygun.` : `${cityIn} bu tarihlerin öne çıkanlarından.`;
      if (budgetP) s += ` ${budgetP}`;
    }
    return s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);
  }

  // Switches every label, template and reason to a language ('en' or 'tr').
  function setLang(lang) {
    LANG = L10N[lang] ? lang : 'tr'; LX = L10N[LANG];
    MONTHS.splice(0, 12, ...LX.months); DAYS.splice(0, 7, ...LX.days);
    Object.assign(CITY_NAMES, LX.cities);
    Object.entries(CAT_TXT).forEach(([k, v]) => { const [label, page, kicker, interest] = v[LANG]; Object.assign(CATS[k], { label, page, kicker, interest }); });
    SAMPLES.forEach((s) => { s.text = s.texts[LANG]; s.tab = s.tabs[LANG]; s.city = LX.cities[s.cityKey]; });
    Object.values(BUDGET).forEach((b) => { [b.label, b.phrase] = b[LANG]; });
    Object.values(WHEN).forEach((w) => { [w.label, w.phrase] = w[LANG]; });
  }
  setLang('tr');

  window.BiletinoDemo = { CATS, SAMPLES, TEMPLATES, EVENTS, CITY_NAMES, BUDGET, WHEN, MONTHS, DAYS, parse, draft, recommend, datedEvents, fmtLira, fmtTL, fromIso, isoOf, dateShort, setLang, lang: () => LANG, fold };
})();
