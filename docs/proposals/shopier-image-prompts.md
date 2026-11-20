# Shopier proposal: photo prompts

> **Purpose:** photo-realistic replacements for the code-drawn illustrations on the Shopier proposal page (`site/proposals/shopier/`).
>
> **Status (2026-11-20):** none delivered yet. The page uses its illustrations until each photo exists.

The page works without these photos. Each photo replaces one illustration, and any missing photo keeps its illustration. Before/after pairs and product variations only line up if every edit starts from the same base image, so the order matters.

## How to make them

1. **Stage 1** images need no input image. Make them first.
2. **Stage 2** images are edits. Attach the listed input images in the order given.
3. Save each image under the exact file name below. Put the files in one folder (or a zip) and send them over. PNG, JPG or WebP all work.
4. I convert them to WebP, put them in `site/proposals/shopier/assets/photos/`, and list them in `PHOTOS` in `assets/proposal.js`.

**Sizes**
- Products and scenes: **1024 × 1024** (square). Keep the product inside the central half of the frame. The page crops to 1:1, 4:5, 9:16 and 16:9, and the product has to survive every crop.
- Cut-outs: **1024 × 1024**, **transparent background**.
- People and garments: **1024 × 1536** (portrait, 2:3).

**Rules for every image**
- Fictional products, brands and people only. No likeness to real or famous people. No real brand designs.
- No text, logos or watermarks anywhere, including on the product.
- The page labels these images "prepared examples". It never presents them as live output.

**Priority.** If time is short, make tier 1 first. The page looks complete with tier 1, and tiers 2 and 3 fill in the rest.

| Tier | Images | Count |
|---|---|---|
| 1 | Handbag: original, cut-out, 12 scenes · the three "before" models · the four garments · the four try-ons on Ada | 25 |
| 2 | Try-ons on Nil and Mira | 8 |
| 3 | Earrings and serum: original, cut-out, 12 scenes each | 28 |

---

## Shared lines

**Product style line.** Paste it at the end of every product and scene prompt:

> Professional commercial product photograph, photorealistic, true-to-life materials and reflections, sharp focus on the product, square 1:1 frame, no text, no logos, no watermark.

**Product preservation line.** Paste it at the start of every Stage 2 product edit:

> Edit image 1. Keep the product exactly as it is in image 1: the same shape, proportions, colour, material, stitching, hardware, label and every small detail. Do not redraw, restyle, resize or replace it. Change only the setting, surface, props and light around it. Keep the whole product inside the central half of the square frame, with generous empty space around it, so the image can be cropped to 9:16 or 16:9 without cutting the product.

**Fashion style line.** Paste it at the end of every people and garment prompt:

> Photorealistic premium fashion e-commerce photograph, soft even studio light, full-frame camera, 50 mm lens, true-to-life skin and fabric texture, no text, no logos, no watermark.

---

## Stage 1 · products (no input image)

### 1. `bag-original.jpg`: the Hilal handbag, a plain phone photo

> A plain, slightly amateur smartphone photo of a fictional tan (cognac) leather half-moon top-handle handbag, standing upright on a light grey table against a light grey wall at home. The bag has a straight top edge and a rounded half-moon body; a curved front flap with cream contrast stitching along its edge; a small rectangular gold turn-lock clasp in the centre of the flap; dark brown painted edges; and one rounded top handle fixed with two small leather tabs and gold rings. Fine natural leather grain. Flat on-camera flash, a hard shadow behind the bag, a white wall socket with a cable on the right, slightly cool white balance. The whole bag in frame, a little left of centre, filling about 40% of the frame. No text or logo on the bag. *(product style line)*

### 2. `earrings-original.jpg`: the Damla earrings, a plain phone photo

> A plain, slightly amateur smartphone photo of a pair of fictional gold earrings lying on a light grey table: each is a thick, rounded, polished gold huggie hoop with a small gold loop at the bottom holding one freshwater pearl drop, slightly irregular in shape, with a soft pink sheen. Flat on-camera flash, hard little shadows, slightly cool white balance, a bit of table texture. Both earrings fully in frame, near the centre, filling about 30% of the frame. *(product style line)*

### 3. `serum-original.jpg`: the Gül serum, a plain phone photo

> A plain, slightly amateur smartphone photo of a fictional skincare serum bottle standing on a light grey bathroom shelf against a light grey tiled wall: a frosted blush-pink glass bottle with rounded shoulders, a ridged gold collar, an ivory rubber dropper bulb, and a cream label band with a thin gold line at its top and bottom and a small embossed rose emblem in a circle. No text on the label. Flat on-camera flash, a hard shadow, slightly cool white balance. The whole bottle in frame, filling about 40% of the frame height. *(product style line)*

### 4–6. Cut-outs: `bag-cutout.png`, `earrings-cutout.png`, `serum-cutout.png`

**Input:** image 1 = the matching original (`bag-original.jpg` for the bag, and so on).

> Edit image 1. Cut out the product exactly as it is and place it on a fully transparent background, front view, centred, filling about 80% of the frame. Same shape, colour, material, stitching and hardware; even soft light; no shadow, no surface, no props. Transparent PNG, 1024 × 1024.

---

## Stage 2 · product scenes (12 per product)

For each product make the 12 files below. **Input:** image 1 = that product's original (for example `bag-original.jpg`). If your tool keeps the product better from the cut-out, attach the cut-out as image 1 instead.

Name the files `<product>-<scene>.jpg`, for example `bag-studio-1.jpg`, `earrings-luxury-2.jpg`, `serum-seasonal-3.jpg`.

Each prompt = *(preservation line)* + the scene text below + *(product style line)*. For the **earrings**, add: "Shoot it as a close-up macro: the earrings fill the centre of the frame and the props appear large and partly cropped."

| Scene | File suffix | Scene text |
|---|---|---|
| Studio · Ivory set | `studio-1` | Place it on an elegant ivory seamless studio set, soft diffused window light from the upper left, a soft natural contact shadow, warm neutral tones, nothing else in the frame. |
| Studio · Travertine plinth | `studio-2` | Place it on top of a round travertine stone plinth in front of a warm beige wall, soft daylight from the left, a soft shadow falling right, minimal and calm. |
| Studio · Light and shadow | `studio-3` | Place it on a low beige stone block in front of a warm sand-coloured wall, with crisp palm-leaf shadows falling across the wall from the upper right, warm late-morning sun. |
| Lifestyle · Marble café | `lifestyle-1` | Place it naturally on a white marble café table on a Mediterranean terrace: a whitewashed wall with a blue wooden shutter on the left, the sea and a distant island softly out of focus behind, an espresso cup on a saucer and a small olive sprig on the table, bright natural daylight. |
| Lifestyle · Aegean terrace | `lifestyle-2` | Place it on a sunlit limestone ledge of a seaside terrace in the Aegean: calm blue sea and a pale sky behind, a branch of magenta bougainvillea in the upper left corner, warm sun from the left casting a soft long shadow. |
| Lifestyle · Home console | `lifestyle-3` | Place it on a walnut wooden console in a calm, warm living room: a stack of linen-covered books and a ceramic vase with dried pampas stems on the left, soft window light on a warm beige wall, a framed abstract print softly out of focus behind. |
| Luxury Campaign · Night stage | `luxury-1` | Place it on a glossy black cylindrical pedestal on a dark navy stage, a single soft spotlight from above, a subtle violet rim glow behind it, a faint mirror reflection on the pedestal top, a premium fashion advertising mood. |
| Luxury Campaign · Silk drape | `luxury-2` | Place it on deep plum silk fabric draped in soft, flowing folds that fill the frame, with satin highlights and a soft key light from the upper left, a rich, sensual luxury campaign mood. |
| Luxury Campaign · Sculptural blocks | `luxury-3` | Place it on a large sand-coloured stone block among sculptural geometric shapes (a smaller block on the left and a stone sphere on the right) in front of a terracotta wall with an arched opening to a pale sky, hard midday sun and crisp graphic shadows. |
| Seasonal · New Year | `seasonal-1` | Place it on a dark walnut surface in a deep green New Year setting: warm golden bokeh lights behind, pine branches, gold glass ornaments and a few red berries in the foreground corners, cosy warm light. |
| Seasonal · Valentine's Day | `seasonal-2` | Place it on a soft pink surface for Valentine's Day: deep red roses and scattered rose petals around it, a pink satin ribbon curving through the foreground, soft pink background with gentle bokeh, soft romantic light. |
| Seasonal · Summer | `seasonal-3` | Place it on a white plaster ledge in front of a bright Aegean-blue wall for a summer campaign: fresh lemons with leaves on the left and a lemon slice in the right foreground, hard summer sun with crisp shadows. |

---

## Stage 1 · try-on base images (no input image)

### 7. `model-ada-before.jpg`: Ada, everyday clothes

> Full-length e-commerce studio photo of a fictional woman in her late twenties with light olive skin and dark brown hair in a sleek low bun, standing straight and facing the camera, arms relaxed at her sides, calm natural expression. She wears a fitted oatmeal ribbed knit top with short sleeves, high-waisted camel wide-leg trousers and nude pointed heels. Plain warm light-grey seamless studio backdrop, soft floor shadow. Her whole body is in frame from head to shoes, with some space above her head. Portrait 2:3. *(fashion style line)*

### 8. `model-nil-before.jpg`: Nil, everyday clothes

**Input (optional):** image 1 = `model-ada-before.jpg`, as a reference for backdrop, light, clothes and framing only.

> Full-length e-commerce studio photo of a different fictional woman in her early thirties with deep brown skin, long dark wavy hair worn loose, and a curvy build (Turkish size 44–46), standing straight and facing the camera, arms relaxed at her sides, warm natural expression. She wears the same outfit as in image 1: a fitted oatmeal ribbed knit top with short sleeves, high-waisted camel wide-leg trousers and nude pointed heels. Same backdrop, light and camera framing as image 1, but do not copy the person. Whole body in frame. Portrait 2:3. *(fashion style line)*

### 9. `model-mira-before.jpg`: Mira, everyday clothes

**Input (optional):** image 1 = `model-ada-before.jpg`, as in item 8.

> Full-length e-commerce studio photo of a different fictional woman in her mid twenties with warm medium skin, an auburn chin-length bob with a side part, and a petite, slim build, standing straight and facing the camera, arms relaxed at her sides, friendly natural expression. She wears the same outfit as in image 1. Same backdrop, light and camera framing as image 1, but do not copy the person. Whole body in frame. Portrait 2:3. *(fashion style line)*

### 10–13. Garments (ghost mannequin)

> Ghost-mannequin product photo of {garment}, with no person and no visible mannequin, the inside of the back neckline just visible, front view, centred, on a plain very light grey seamless background with a soft floor shadow. Portrait 2:3. *(fashion style line)*

| File | {garment} |
|---|---|
| `garment-blazer.jpg` | an ecru linen double-breasted blazer with a relaxed fit, peak lapels, four brown horn buttons, two flap pockets and long sleeves |
| `garment-dress.jpg` | a terracotta linen midi shirt dress with short sleeves, a small shirt collar, a button placket, a self-tie belt knotted on the left of the waist, and a softly flared skirt |
| `garment-jacket.jpg` | a chocolate-brown suede cropped jacket, waist length, with a wide spread collar, an open front with three small gold buttons on the left edge, and long sleeves with a cuff band |
| `garment-coord.jpg` | a blue-and-white vertical-stripe cotton poplin co-ord: an oversized button-down shirt with the sleeves rolled to the forearm, and matching wide-leg trousers, shown together |

---

## Stage 2 · try-on results (12)

| File | Image 1 (edit target) | Image 2 (garment) |
|---|---|---|
| `tryon-ada-blazer.jpg` · `tryon-ada-dress.jpg` · `tryon-ada-jacket.jpg` · `tryon-ada-coord.jpg` | `model-ada-before.jpg` | the matching `garment-….jpg` |
| `tryon-nil-blazer.jpg` · `tryon-nil-dress.jpg` · `tryon-nil-jacket.jpg` · `tryon-nil-coord.jpg` | `model-nil-before.jpg` | the matching `garment-….jpg` |
| `tryon-mira-blazer.jpg` · `tryon-mira-dress.jpg` · `tryon-mira-jacket.jpg` · `tryon-mira-coord.jpg` | `model-mira-before.jpg` | the matching `garment-….jpg` |

> Edit image 1. Dress the woman in the exact garment shown in image 2, fitted naturally to her body, with the same colour, fabric, cut, collar, buttons and details. {how to wear it} Keep everything else in image 1 unchanged: her face and identity, hair, skin tone, body shape, pose, hands, shoes, camera angle, framing, backdrop and light. Photorealistic drape, folds and shadows. Do not add accessories that are not in image 2.

**{how to wear it}**
- **Blazer** and **jacket:** "Wear it over her existing oatmeal knit top and camel trousers."
- **Dress:** "Replace her top and trousers with the dress; her lower legs show below the hem. Swap her shoes for simple tan flat sandals."
- **Co-ord:** "Replace her top and trousers with the shirt and trousers from image 2. Swap her shoes for white leather loafers."

---

## Check before sending

- **Product scenes:** flick between `<product>-original` and each scene. Shape, colour, stitching, clasp and handle must match exactly. If the product drifts, generate the image again; never keep a different product.
- **Crops:** the whole product sits inside the central half of the square.
- **Try-on pairs:** the face, hair, body, pose and framing match the model's `before` photo; only the clothes change.
- **Garments:** each garment in a try-on matches its catalogue photo.
- **All images:** no text, logos, extra people or distorted hands.

After the photos are in, I also re-render the two social preview images (`og-image.png`, `og-image-tr.png`) from them.
