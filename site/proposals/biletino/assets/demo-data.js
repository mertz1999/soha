/* Demo data and rules for the SOHA × Biletino proposal.
   Everything here is fictional and local: sample events, a 32-event demo
   catalogue for the suggestions phone, and the rule-based reader that turns
   an organizer's description into a draft event page. No API is called. */
(() => {
  'use strict';
  const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const SEASONS = ['Kış', 'Kış', 'Bahar', 'Bahar', 'Bahar', 'Yaz', 'Yaz', 'Yaz', 'Sonbahar', 'Sonbahar', 'Sonbahar', 'Kış'];
  const pad = (n) => String(n).padStart(2, '0');
  const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const fmtTL = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtLira = (n) => (n === 0 ? 'Ücretsiz' : `₺${n.toLocaleString('tr-TR')}`);
  const roundPrice = (n) => Math.max(0, Math.round(n / 10) * 10);
  const addMin = (hhmm, min) => { const [h, m] = hhmm.split(/[.:]/).map(Number); const t = (((h * 60 + m + min) % 1440) + 1440) % 1440; return `${pad(Math.floor(t / 60))}.${pad(t % 60)}`; };

  /* ------------------------------------------------------------ categories */
  const CATS = {
    electronic: { label: 'Elektronik müzik', page: 'Elektronik Müzik', kicker: 'Elektronik Gece', style: 'electronic', interest: 'Elektronik müzik' },
    jazz: { label: 'Caz', page: 'Caz', kicker: 'Caz & Kültür', style: 'jazz', interest: 'Caz' },
    theatre: { label: 'Tiyatro', page: 'Tiyatro', kicker: 'Tiyatro', style: 'jazz', interest: 'Tiyatro' },
    workshop: { label: 'Atölye', page: 'Atölye', kicker: 'Yaratıcı Atölye', style: 'workshop', interest: 'Atölye' },
    festival: { label: 'Festival', page: 'Festival', kicker: 'Festival', style: 'electronic', interest: 'Festival' },
    comedy: { label: 'Komedi', page: 'Stand-up', kicker: 'Stand-up & Komedi', style: 'workshop', interest: 'Komedi' },
  };

  /* ------------------------------------------------------------ the three sample events */
  // Shared by the event studio, the poster studio and the connected flow.
  const SAMPLES = [
    {
      id: 'sinyal', tab: 'Elektronik gece', cat: 'electronic', title: 'Sinyal', date: '2026-12-15', time: '21:00',
      venue: 'Liman Depo', district: 'Karaköy', city: 'İstanbul', org: 'Liman Kolektif', price: 650, capacity: 400,
      text: "İstanbul'da, 15 Aralık'ta, elektronik müzik temalı bir gece düzenliyorum. Etkinlik saat 21.00'de başlayacak. Karaköy'de eski bir depoda, yerel DJ'lerle sabaha kadar sürecek. Yaklaşık 400 kişilik bir kapasitemiz var.",
      poster: { style: 'electronic', variant: 0 },
    },
    {
      id: 'mavi-saat', tab: 'Caz akşamı', cat: 'jazz', title: 'Mavi Saat', date: '2026-12-19', time: '20:30',
      venue: 'Arka Bahçe Sahne', district: 'Alsancak', city: 'İzmir', org: 'Arka Bahçe Kültür', price: 450, capacity: 120,
      text: "İzmir Alsancak'ta küçük bir sahnede caz akşamı yapmak istiyoruz. 19 Aralık Cumartesi, saat 20.30'da başlayacak. Bir kuartet çalacak, aralarda kısa bir söyleşi olacak. 120 kişilik, masa düzeninde.",
      poster: { style: 'jazz', variant: 0 },
    },
    {
      id: 'bicim', tab: 'Tasarım atölyesi', cat: 'workshop', title: 'Biçim Atölyesi', date: '2027-01-09', time: '13:00',
      venue: 'Kare Stüdyo', district: 'Kavaklıdere', city: 'Ankara', org: 'Kare Tasarım Okulu', price: 900, capacity: 24,
      text: "Ankara'da 9 Ocak'ta grafik tasarımcılar ve öğrenciler için bir afiş tasarımı atölyesi düzenliyoruz. Saat 13.00'te başlıyor, yaklaşık dört saat sürecek. Malzemeler bizden. Kontenjan 24 kişi.",
      poster: { style: 'workshop', variant: 0 },
    },
  ];

  /* ------------------------------------------------------------ rule-based reader */
  const CITY = [['istanbul', 'İstanbul'], ['ankara', 'Ankara'], ['izmir', 'İzmir'], ['antalya', 'Antalya'], ['bursa', 'Bursa'], ['eskişehir', 'Eskişehir'], ['muğla', 'Muğla'], ['bodrum', 'Muğla'], ['mardin', 'Mardin'], ['trabzon', 'Trabzon'], ['adana', 'Adana'], ['kapadokya', 'Nevşehir'], ['nevşehir', 'Nevşehir']];
  const DISTRICTS = {
    karaköy: ['Karaköy', 'İstanbul'], kadıköy: ['Kadıköy', 'İstanbul'], beyoğlu: ['Beyoğlu', 'İstanbul'], beşiktaş: ['Beşiktaş', 'İstanbul'], moda: ['Moda', 'İstanbul'], cihangir: ['Cihangir', 'İstanbul'], şişli: ['Şişli', 'İstanbul'], sarıyer: ['Sarıyer', 'İstanbul'],
    alsancak: ['Alsancak', 'İzmir'], karşıyaka: ['Karşıyaka', 'İzmir'], bornova: ['Bornova', 'İzmir'], urla: ['Urla', 'İzmir'],
    kavaklıdere: ['Kavaklıdere', 'Ankara'], çankaya: ['Çankaya', 'Ankara'], tunalı: ['Tunalı', 'Ankara'], kızılay: ['Kızılay', 'Ankara'], bahçelievler: ['Bahçelievler', 'Ankara'],
  };
  const CAT_WORDS = [
    ['electronic', /elektronik|techno|tekno|house|\bdj|rave/], ['jazz', /\bcaz|jazz|kuartet|swing|blues/], ['workshop', /atölye|workshop|eğitim|kurs|seramik|kaligrafi/],
    ['theatre', /tiyatro|oyun|sahne(?:leme)?si|monolog|drama/], ['comedy', /stand-?up|komedi|doğaçlama|güldür/], ['festival', /festival|şenlik/],
  ];
  const NUMW = { bir: 1, iki: 2, üç: 3, dört: 4, beş: 5, altı: 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10 };
  const NUM_TR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on'];
  const lower = (s) => s.toLocaleLowerCase('tr-TR');

  function parse(text, today = new Date()) {
    const t = lower(text || '');
    const out = {};
    const dm = t.match(/(\d{1,2})\s*(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)/);
    if (dm) {
      const day = +dm[1]; const mon = MONTHS.findIndex((m) => lower(m) === dm[2]);
      if (day >= 1 && day <= 31) {
        let y = today.getFullYear(); let d = new Date(y, mon, day);
        const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (d < t0) { y += 1; d = new Date(y, mon, day); }
        if (d.getMonth() === mon) out.date = isoOf(d);
      }
    }
    const tm = t.match(/saat\s*(\d{1,2})[.:](\d{2})/) || t.match(/\b(\d{1,2})[.:](\d{2})\b/);
    if (tm && +tm[1] < 24 && +tm[2] < 60) out.time = `${pad(+tm[1])}:${tm[2]}`;
    for (const [k, [dist, city]] of Object.entries(DISTRICTS)) { if (new RegExp(`(^|[^a-zçğıöşü])${k}`).test(t)) { out.district = dist; out.city = city; break; } }
    for (const [k, v] of CITY) { if (t.includes(k)) { out.city = v; break; } }
    for (const [cat, re] of CAT_WORDS) { if (re.test(t)) { out.cat = cat; break; } }
    const cap = t.match(/(\d{2,5})\s*kişi/) || t.match(/kontenjan[ıi]?\s*(\d{1,5})/); if (cap) out.capacity = +cap[1];
    const pr = t.match(/(\d{2,5})\s*(?:tl|₺|lira)/) || t.match(/₺\s*(\d{2,5})/); if (pr) out.price = +pr[1];
    const du = t.match(/(\d{1,2}|bir|iki|üç|dört|beş|altı|yedi|sekiz)\s*saat(?!\s*\d)/); if (du) out.hours = /\d/.test(du[1]) ? +du[1] : NUMW[du[1]];
    out.materials = /malzeme/.test(t);
    out.topic = /afiş/.test(t) ? 'afiş' : /seramik/.test(t) ? 'seramik' : /kaligrafi/.test(t) ? 'kaligrafi' : /fotoğraf/.test(t) ? 'fotoğraf' : null;
    return out;
  }

  /* ------------------------------------------------------------ draft templates */
  const capText = (p, start) => (p.capacity ? `${p.capacity} kişilik` : start ? 'Sınırlı kapasiteli' : 'sınırlı kapasiteli');
  const TEMPLATES = {
    electronic: {
      names: ['Sinyal', 'Frekans', 'Derin Hat', 'Gece Akışı'],
      tail: (p) => `Elektronik ${p.season} Gecesi`,
      desc: (p) => [
        `${p.name}, ${p.dateLong} akşamı elektronik müziğin güncel seslerini ${p.city} gece hayatının kalbinde bir araya getiriyor.`,
        `Saat ${p.time} itibarıyla başlayan gecede yerel DJ'ler sabaha kadar sahnede. Güçlü bir ses sistemi, loş ışıklar ve ${capText(p)} samimi bir kalabalık seni bekliyor.`,
      ],
      tags: (p) => ['Elektronik', 'Techno', 'Gece', p.district || p.city, '18+'],
      schedule: (p) => [[p.time, 'Kapılar açılır'], [addMin(p.time, 60), 'Açılış seti'], [addMin(p.time, 180), 'Ana set'], [addMin(p.time, 330), 'Kapanış seti']],
      tickets: [['Erken Kayıt', 'İlk 100 bilet', 0.8], ['Genel Giriş', 'Tüm gece geçerli', 1], ['Backstage', 'Ayrı giriş ve bar alanı', 2]],
      faq: (p) => [
        ['Yaş sınırı var mı?', 'Etkinlik 18 yaş ve üzeri katılımcılar içindir; girişte kimlik kontrolü yapılır.'],
        ['Kapılar ne zaman açılıyor?', `Kapılar saat ${p.time} itibarıyla açılır. Son giriş: ${addMin(p.time, 150)}.`],
        ['Bilet iadesi mümkün mü?', 'İade ve değişim koşullarını organizatör belirler; koşullar bilet sayfasında yer alır.'],
        ['Mekâna nasıl ulaşırım?', `Mekân: ${p.venue}${p.district ? `, ${p.district}` : ''}. Toplu taşımayla kolayca ulaşılabilir.`],
      ],
    },
    jazz: {
      names: ['Mavi Saat', 'Gece Notaları', 'Kırmızı Perde'],
      tail: (p) => `${p.season} Caz Akşamları`,
      desc: (p) => [
        `${p.name}, ${p.dateLong} akşamı caz severleri sıcak ve samimi bir salonda buluşturuyor.`,
        `Saat ${p.time} itibarıyla başlayan konserde standartlardan özgün bestelere uzanan bir repertuvar var. ${capText(p, true)} salon, sahneye yakın bir dinleme deneyimi sunuyor.`,
      ],
      tags: (p) => ['Caz', 'Canlı müzik', 'Konser', p.district || p.city, 'Masa düzeni'],
      schedule: (p) => [[addMin(p.time, -30), 'Kapılar açılır'], [p.time, 'Birinci set'], [addMin(p.time, 60), 'Ara ve söyleşi'], [addMin(p.time, 90), 'İkinci set']],
      tickets: [['Bar Ayakta', 'Bar çevresinde ayakta', 0.7], ['Salon', 'Numarasız oturma', 1], ['Ön Masa', 'Sahneye en yakın masalar', 1.8]],
      faq: (p) => [
        ['Oturma düzeni nasıl?', 'Oturma düzeni numarasızdır; masalar geliş sırasına göre doldurulur.'],
        ['Yiyecek ve içecek servisi var mı?', 'Mekânda servis vardır; dışarıdan yiyecek ve içecek getirilmez.'],
        ['Yaş sınırı var mı?', 'Etkinlik 12 yaş ve üzeri için uygundur; 18 yaş altı katılımcılar velisiyle gelmelidir.'],
        ['Mekâna nasıl ulaşırım?', `Mekân: ${p.venue}${p.district ? `, ${p.district}` : ''}. Toplu taşımayla kolayca ulaşılabilir.`],
      ],
    },
    workshop: {
      names: ['Biçim', 'Harf & Renk', 'Kare'],
      tail: (p) => ({ afiş: 'Afiş Tasarımı Atölyesi', seramik: 'Seramik Atölyesi', kaligrafi: 'Kaligrafi Atölyesi', fotoğraf: 'Fotoğraf Atölyesi' }[p.topic] || 'Yaratıcı Tasarım Atölyesi'),
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
    theatre: {
      names: ['Sessiz Oda', 'Kâğıt Ev', 'Fısıltı'],
      tail: () => 'Tek Perdelik Oyun',
      desc: (p) => [
        `${p.name}, ${p.dateLong} akşamı seyirciyi yakın mesafeden izlenen, tek perdelik bir oyuna davet ediyor.`,
        `Oyun saat ${p.time} itibarıyla başlar ve yaklaşık 80 dakika sürer. ${capText(p, true)} salonda her koltuktan sahne rahatça görülür.`,
      ],
      tags: (p) => ['Tiyatro', 'Tek perde', 'Sahne', p.district || p.city, '13+'],
      schedule: (p) => [[addMin(p.time, -30), 'Salon açılır'], [p.time, 'Oyun başlar'], [addMin(p.time, 80), 'Oyun sonu'], [addMin(p.time, 90), 'Seyirciyle söyleşi']],
      tickets: [['Öğrenci', 'Öğrenci belgesiyle', 0.6], ['Tam', 'Numaralı koltuk', 1], ['Ön Sıra', 'İlk üç sıra', 1.4]],
      faq: (p) => [
        ['Oyun kaç dakika?', 'Oyun aralıksız, yaklaşık 80 dakikadır.'],
        ['Geç gelirsem içeri alınır mıyım?', 'Oyun başladıktan sonra salona giriş yapılamaz.'],
        ['Yaş sınırı var mı?', 'Oyun 13 yaş ve üzeri seyirciler için uygundur.'],
        ['Mekâna nasıl ulaşırım?', `Mekân: ${p.venue}${p.district ? `, ${p.district}` : ''}. Toplu taşımayla kolayca ulaşılabilir.`],
      ],
    },
    comedy: {
      names: ['Kısa Devre', 'Açık Mikrofon', 'Kahkaha Kulübü'],
      tail: () => 'Stand-up Gecesi',
      desc: (p) => [
        `${p.name}, ${p.dateLong} akşamı yeni ve tanıdık komedyenleri aynı sahnede buluşturuyor.`,
        `Gösteri saat ${p.time} itibarıyla başlar. ${capText(p, true)} salonda, sahneye yakın ve bol kahkahalı bir gece seni bekliyor.`,
      ],
      tags: (p) => ['Stand-up', 'Komedi', 'Gece', p.district || p.city, '16+'],
      schedule: (p) => [[addMin(p.time, -30), 'Kapılar açılır'], [p.time, 'Açılış'], [addMin(p.time, 20), 'Konuk komedyenler'], [addMin(p.time, 75), 'Ana gösteri']],
      tickets: [['Erken Kayıt', 'Sınırlı sayıda', 0.8], ['Genel Giriş', 'Numarasız oturma', 1], ['Ön Masa', 'Sahneye en yakın', 1.6]],
      faq: (p) => [
        ['Yaş sınırı var mı?', 'Gösteri 16 yaş ve üzeri içindir.'],
        ['Oturma düzeni nasıl?', 'Oturma düzeni numarasızdır; erken gelen istediği yeri seçer.'],
        ['Gösteri kaydedilecek mi?', 'Gösteri sırasında izinsiz ses ve görüntü kaydı yapılamaz.'],
        ['Mekâna nasıl ulaşırım?', `Mekân: ${p.venue}${p.district ? `, ${p.district}` : ''}. Toplu taşımayla kolayca ulaşılabilir.`],
      ],
    },
    festival: {
      names: ['Kış Işıkları', 'Rüzgâr', 'Sokak Sesleri'],
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
        ['Alana nasıl ulaşırım?', `Alan: ${p.venue}${p.district ? `, ${p.district}` : ''}. Toplu taşımayla ulaşım önerilir.`],
      ],
    },
  };

  const hashStr = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

  // Builds the draft page. sample: the selected sample (gives defaults for
  // anything the text does not mention). fields: venue, org, price.
  function draft(text, fields, sample, today = new Date()) {
    const found = parse(text, today);
    const cat = found.cat || sample.cat;
    const T = TEMPLATES[cat];
    const date = found.date || sample.date; const d = fromIso(date);
    const time = (found.time || sample.time).replace('.', ':');
    const city = found.city || sample.city;
    const district = found.district || (found.city && found.city !== sample.city ? '' : sample.district);
    const unchanged = text.trim() === sample.text.trim();
    const name = unchanged && cat === sample.cat ? sample.title.replace(/ Atölyesi$/, '') : T.names[hashStr(`${cat}|${city}|${date}`) % T.names.length];
    const p = {
      name, city, district, time: time.replace(':', '.'), venue: fields.venue || sample.venue, season: SEASONS[d.getMonth()],
      dateLong: `${d.getDate()} ${MONTHS[d.getMonth()]} ${DAYS[d.getDay()]}`, capacity: found.capacity || null,
      hours: found.hours || (cat === 'workshop' ? 3 : 2), materials: !!found.materials, topic: found.topic,
    };
    const base = Number(fields.price) >= 0 && fields.price !== '' ? Number(fields.price) : (found.price || sample.price);
    const tickets = T.tickets.map(([n, ds, k]) => ({ name: n, desc: ds, price: roundPrice(base * k) }));
    const prices = tickets.map((t) => t.price);
    return {
      found, cat, catPage: CATS[cat].page, kicker: CATS[cat].kicker, style: CATS[cat].style,
      title: `${name}: ${T.tail(p)}`, shortTitle: name === 'Biçim' ? 'Biçim Atölyesi' : name,
      date, time, dateLine: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} - ${DAYS[d.getDay()]}`,
      city, district, venue: p.venue, org: fields.org || sample.org, capacity: p.capacity,
      desc: T.desc(p), tags: T.tags(p).filter(Boolean), schedule: T.schedule(p), tickets, faq: T.faq(p),
      priceRange: `${fmtTL(Math.min(...prices))} TRY - ${fmtTL(Math.max(...prices))} TRY`,
    };
  }

  /* ------------------------------------------------------------ demo catalogue for suggestions */
  // day = offset from the coming Saturday (Friday = -1, Sunday = 1, next week = 2…8).
  const EVENTS = [
    // İstanbul
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
    // İzmir
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
  const CITY_NAMES = { istanbul: 'İstanbul', ankara: 'Ankara', izmir: 'İzmir' };
  const CITY_LOC = { istanbul: "İstanbul'da", ankara: "Ankara'da", izmir: "İzmir'de" };

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
      return { ...e, date: isoOf(d), d, past: d < t0, label: `${d.getDate()} ${MONTHS[d.getMonth()]} ${DAYS[d.getDay()]}`, window: e.day <= 1 ? 'weekend' : e.day <= 8 ? 'nextweek' : 'later' };
    }).filter((e) => !e.past);
  }

  const BUDGET = {
    free: { label: 'Ücretsiz', ok: (p) => p === 0, phrase: 'Üstelik ücretsiz.' },
    u500: { label: '₺500 altı', ok: (p) => p < 500, phrase: '₺500 altı bütçenize de uyuyor.' },
    mid: { label: '₺500–₺1.500', ok: (p) => p >= 500 && p <= 1500, phrase: 'Bütçe aralığınızda.' },
    any: { label: 'Fark etmez', ok: () => true, phrase: '' },
  };
  const WHEN = {
    weekend: { label: 'Bu hafta sonu', ok: (e) => e.window === 'weekend', phrase: 'hafta sonu' },
    nextweek: { label: 'Gelecek hafta', ok: (e) => e.window === 'nextweek', phrase: 'gelecek hafta' },
    any: { label: 'Herhangi bir tarih', ok: () => true, phrase: '' },
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
    const interestHit = ints.length > 0 && ints.includes(e.cat);
    const ilgi = `${CATS[e.cat].interest.toLocaleLowerCase('tr-TR')} ilginize`;
    let s;
    if (!(x.w && x.b)) {
      const miss = !x.w && !x.b ? 'tarih ve bütçe tercihinizin dışında' : !x.w ? `seçtiğiniz tarihlerde değil (${e.label})` : prefs.budget === 'free' ? 'ücretli bir etkinlik' : 'bütçe tercihinizin dışında';
      s = `${miss}; ${interestHit ? `${ilgi} uygun bir alternatif.` : `${CITY_LOC[e.city]} öne çıkan bir alternatif.`}`;
    } else if (ints.length && !interestHit) {
      s = `${W.phrase ? `${W.phrase} tercihinize uygun; ` : ''}farklı bir tür denemek isterseniz iyi bir seçenek.`;
      if (B.phrase) s += ` ${B.phrase}`;
    } else {
      const parts = [];
      if (interestHit) parts.push(ilgi);
      if (W.phrase) parts.push(`${W.phrase} tercihinize`);
      s = parts.length ? `${parts.join(' ve ')} uygun.` : `${CITY_LOC[e.city]} bu tarihlerin öne çıkanlarından.`;
      if (B.phrase) s += ` ${B.phrase}`;
    }
    return s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);
  }

  window.BiletinoDemo = { CATS, SAMPLES, TEMPLATES, EVENTS, CITY_NAMES, BUDGET, WHEN, MONTHS, DAYS, parse, draft, recommend, datedEvents, fmtLira, fmtTL, fromIso, isoOf };
})();
