# Shopier proposal: photo prompts

> **Purpose:** photo-realistic images for the Shopier proposal page (`site/proposals/shopier/`).
>
> **Status (2026-11-20):** Part A (11 images) delivered and published. Part B (try-on) is on hold: the try-on stays illustrated. If it is picked up again, make the 9 try-on results in a dedicated try-on tool (FASHN or Kling) rather than a general image model, which tends to change the face or the garment. Real photos from the internet won't work: no source has the same garments on several people with matching product shots, and the try-on research datasets (VITON-HD, Dress Code) are non-commercial only.

**26 images in total, and only 9 of them need input images.** The page builds the rest itself:

- **Product scenes are not generated one by one.** Each product needs one phone photo. I cut the product out of it on the Mac. The page then places that cut-out on 8 empty backgrounds that all three products share, and adds a matching shadow and colour grade. So the product in every scene is the same pixels as in the phone photo, and nothing has to be checked for product drift.
- **Try-on** uses 3 models and 3 garments, so 9 try-on results.

| Part | What | Count | Input images |
|---|---|---|---|
| A · Product Studio | 3 phone photos + 8 empty backgrounds | 11 | none |
| B · Try-On | 3 models + 3 garments + 9 try-on results | 15 | 2 per try-on |

**Part A alone makes the opening, the Product Studio, the Campaign Studio and the flow section photographic.** Part B replaces the try-on illustrations. If time is short, send Part A first.

## How to send them

1. Make each image with the prompt below and save it under the file name given. PNG, JPG or WebP all work.
2. Put them in one folder (or a zip) and send it over.
3. I cut out the products (`tools/proposals/cutout.swift`), convert everything to WebP, place the product on each background, and check every combination on the page.

**Rules for every image**
- Fictional products, brands and people only. No likeness to real or famous people, no real brand designs.
- No text, logos or watermarks anywhere, including on the product.

---

## Part A · Product Studio (11 images, no input images)

### Phone photos (3)

Portrait **1024 × 1536**. These are the "before" images, and the product is cut out of them, so:
- the whole product is in frame, with clear space on every side
- nothing touches, overlaps or stands in front of the product
- the background is clearly a different colour from the product
- soft daylight from a window on the left, no flash

#### `bag-original.jpg`

> A casual, unstyled smartphone photo taken at home of a fictional handmade handbag standing upright on a plain white table, against a light grey wall. The bag is cognac tan leather with a half-moon shape: a straight top edge and a rounded body; a curved front flap with cream contrast stitching along its edge; a small rectangular gold turn-lock clasp in the centre of the flap; dark brown painted edges; one rounded top handle fixed with two small leather tabs and gold rings; fine natural leather grain. Photographed straight from the front at the height of the bag's middle, looking very slightly down. The whole bag and handle are in frame, centred, filling about 55% of the frame height, with clear space around it and nothing touching it. Soft daylight from a window on the left, no flash, a slightly everyday feel, the background a little out of focus. Sharp focus on the bag. Portrait 2:3, photorealistic, no text, no logo on the bag, no watermark.

#### `earrings-original.jpg`

> A casual, unstyled smartphone photo taken at home of a pair of fictional gold earrings hanging from a small, simple brass T-bar earring stand on a dark walnut dresser top, against a light grey wall. The stand has a round flat base, a thin vertical rod and a horizontal bar on top. Each earring is a thick, rounded, polished gold hoop with a small gold loop at the bottom holding one freshwater pearl drop, slightly irregular in shape with a soft pink sheen, and hangs from the bar on a thin gold ear wire, one earring on each side of the rod. Photographed straight from the front at the height of the bar, looking very slightly down. The whole stand is in frame, centred, filling about 55% of the frame height, with clear space around it and nothing touching it. Soft daylight from a window on the left, no flash, the background a little out of focus. Sharp focus on the earrings. Portrait 2:3, photorealistic, no text, no logo, no watermark.

#### `serum-original.jpg`

> A casual, unstyled smartphone photo taken at home of a fictional skincare serum bottle standing on a plain white bathroom shelf, against a light grey tiled wall. The bottle is frosted blush-pink glass with rounded shoulders, a ridged gold collar and an ivory rubber dropper bulb, and has a cream label band with a thin gold line at its top and bottom and a small embossed rose emblem in a circle. No words on the label. Photographed straight from the front at the height of the label, looking very slightly down. The whole bottle is in frame, centred, filling about 55% of the frame height, with clear space around it and nothing touching it. Soft daylight from a window on the left, no flash, the background a little out of focus. Sharp focus on the bottle. Portrait 2:3, photorealistic, no text, no logo, no watermark.

### Empty backgrounds (8)

Square **1024 × 1024**. **No product in the picture.** A product is placed on each one later, so every background follows the same rules (they are already in each prompt):
- the camera sits at table height, looking very slightly down
- the spot where the product will stand is in the centre, about three quarters of the way down the frame
- the centre column is completely empty: no props there, and nothing that gives away scale
- the main light comes from the left

| File | Style · background |
|---|---|
| `bg-studio-1.jpg` | Studio · Ivory set |
| `bg-studio-2.jpg` | Studio · Travertine plinth |
| `bg-lifestyle-1.jpg` | Lifestyle · Marble café |
| `bg-lifestyle-2.jpg` | Lifestyle · Aegean terrace |
| `bg-luxury-1.jpg` | Luxury Campaign · Night stage |
| `bg-luxury-2.jpg` | Luxury Campaign · Silk drape |
| `bg-seasonal-1.jpg` | Seasonal · New Year |
| `bg-seasonal-2.jpg` | Seasonal · Valentine's Day |

#### `bg-studio-1.jpg`

> An empty product photography set with no product in it: a seamless warm ivory paper backdrop curving smoothly from the floor up into the wall, with no visible horizon line. Soft, large diffused light from the upper left, gently falling off towards the right, calm and minimal. The camera is at table height, looking very slightly down, 50 mm lens. The spot where a product will stand is the centre of the frame, about three quarters of the way down, and the middle half of the frame is completely empty. Square 1:1, photorealistic high-end commercial photography, no objects, no people, no text, no logos, no watermark.

#### `bg-studio-2.jpg`

> An empty product photography set with no product in it: the flat top of a wide, round travertine stone plinth fills the lower part of the frame, its front edge running across the bottom fifth, in front of a warm beige plaster wall. Soft daylight from the left, with a soft palm-leaf shadow pattern on the wall in the upper right, away from the centre. The camera is at table height, looking very slightly down, 50 mm lens. The centre of the plinth top, where a product will stand, is in the middle of the frame about three quarters of the way down, and the middle half of the frame is completely empty. Square 1:1, photorealistic high-end commercial photography, no objects, no people, no text, no logos, no watermark.

#### `bg-lifestyle-1.jpg`

> An empty lifestyle product photo background with no product in it: a white marble café table top across the lower part of the frame, on a sunny Mediterranean café terrace. A whitewashed wall with a blue wooden shutter at the far left edge, warm café light and soft green plants blurred in the background, bright morning daylight from the left. Nothing on the table. The camera is at table height, looking very slightly down, 50 mm lens, with a shallow depth of field so the background is soft. The spot where a product will stand is the centre of the frame, about three quarters of the way down, and the middle half of the frame is completely empty. Square 1:1, photorealistic, no people, no text, no logos, no watermark.

#### `bg-lifestyle-2.jpg`

> An empty lifestyle product photo background with no product in it: a sunlit whitewashed limestone ledge across the lower part of the frame, with the calm blue Aegean sea and a pale sky behind it, softly out of focus. A branch of magenta bougainvillea comes in from the top left corner only. Warm afternoon sun from the left. Nothing on the ledge. The camera is at table height, looking very slightly down, 50 mm lens. The spot where a product will stand is the centre of the frame, about three quarters of the way down, and the middle half of the frame is completely empty. Square 1:1, photorealistic, no people, no text, no logos, no watermark.

#### `bg-luxury-1.jpg`

> An empty luxury advertising set with no product in it: the glossy black top of a wide, low cylindrical pedestal fills the lower part of the frame, on a dark navy stage. A single soft spotlight from above and slightly left lights the centre of the pedestal top, a subtle violet rim glow on the dark backdrop behind, deep shadows towards the edges. The camera is at pedestal height, looking very slightly down, 50 mm lens. The centre of the pedestal top, where a product will stand, is in the middle of the frame about three quarters of the way down, and the middle half of the frame is completely empty. Square 1:1, photorealistic premium fashion advertising photography, no objects, no people, no text, no logos, no watermark.

#### `bg-luxury-2.jpg`

> An empty luxury advertising set with no product in it: deep plum silk draped in soft, flowing folds behind and at both sides, falling onto a surface covered in the same silk, which lies smooth and nearly flat in the centre of the lower part of the frame. Satin highlights, a soft key light from the upper left, a rich and sensual luxury mood. The camera is at table height, looking very slightly down, 50 mm lens. The flat silk where a product will stand is in the centre of the frame, about three quarters of the way down, and the middle half of the frame is clear of folds that rise up. Square 1:1, photorealistic premium advertising photography, no objects, no people, no text, no logos, no watermark.

#### `bg-seasonal-1.jpg`

> An empty New Year product photo background with no product in it: a dark walnut wood surface across the lower part of the frame, a deep green background with warm golden bokeh lights. Blurred pine branches and a few gold glass ornaments only at the far left and right edges, partly cropped and out of focus. Cosy warm light from the left. The camera is at table height, looking very slightly down, 50 mm lens. The spot where a product will stand is the centre of the frame, about three quarters of the way down, and the middle half of the frame is completely empty. Square 1:1, photorealistic festive commercial photography, no people, no text, no logos, no watermark.

#### `bg-seasonal-2.jpg`

> An empty Valentine's Day product photo background with no product in it: a soft blush-pink surface across the lower part of the frame, a slightly deeper pink backdrop with gentle bokeh. A few deep red roses and scattered rose petals only at the far left and right edges and in the two front corners, partly cropped and out of focus. Soft romantic light from the left. The camera is at table height, looking very slightly down, 50 mm lens. The spot where a product will stand is the centre of the frame, about three quarters of the way down, and the middle half of the frame is completely empty. Square 1:1, photorealistic commercial photography, no people, no text, no logos, no watermark.

---

## Part B · Try-On (15 images)

People and garments: portrait **1024 × 1536**.

### Models (3, no input image)

#### `model-ada-before.jpg`

> Full-length e-commerce studio photo of a fictional woman in her late twenties with light olive skin and dark brown hair in a sleek low bun, standing straight and facing the camera, arms relaxed at her sides, a calm natural expression. She wears a fitted oatmeal ribbed knit top with short sleeves, high-waisted camel wide-leg trousers and nude pointed heels. Plain warm light-grey seamless studio backdrop, a soft floor shadow. Her whole body is in frame from head to shoes, with some space above her head. Portrait 2:3. Photorealistic premium fashion e-commerce photograph, soft even studio light, full-frame camera, 50 mm lens, true-to-life skin and fabric texture, no text, no logos, no watermark.

#### `model-nil-before.jpg`

**Input (optional):** image 1 = `model-ada-before.jpg`, for the backdrop, light, clothes and framing only.

> Full-length e-commerce studio photo of a different fictional woman in her early thirties with deep brown skin, long dark wavy hair worn loose and a curvy build (Turkish size 44–46), standing straight and facing the camera, arms relaxed at her sides, a warm natural expression. She wears a fitted oatmeal ribbed knit top with short sleeves, high-waisted camel wide-leg trousers and nude pointed heels. Plain warm light-grey seamless studio backdrop, a soft floor shadow. Same backdrop, light and framing as image 1, but do not copy the person. Her whole body is in frame from head to shoes. Portrait 2:3. Photorealistic premium fashion e-commerce photograph, soft even studio light, full-frame camera, 50 mm lens, true-to-life skin and fabric texture, no text, no logos, no watermark.

#### `model-mira-before.jpg`

**Input (optional):** image 1 = `model-ada-before.jpg`, as for Nil.

> Full-length e-commerce studio photo of a different fictional woman in her mid twenties with warm medium skin, an auburn chin-length bob with a side part and a petite, slim build, standing straight and facing the camera, arms relaxed at her sides, a friendly natural expression. She wears a fitted oatmeal ribbed knit top with short sleeves, high-waisted camel wide-leg trousers and nude pointed heels. Plain warm light-grey seamless studio backdrop, a soft floor shadow. Same backdrop, light and framing as image 1, but do not copy the person. Her whole body is in frame from head to shoes. Portrait 2:3. Photorealistic premium fashion e-commerce photograph, soft even studio light, full-frame camera, 50 mm lens, true-to-life skin and fabric texture, no text, no logos, no watermark.

### Garments (3, no input image)

#### `garment-blazer.jpg`

> Ghost-mannequin product photo of an ecru linen double-breasted blazer with a relaxed fit, peak lapels, four brown horn buttons, two flap pockets and long sleeves. No person and no visible mannequin, the inside of the back neckline just visible, front view, centred, on a plain very light grey seamless background with a soft floor shadow. Portrait 2:3. Photorealistic premium fashion e-commerce photograph, soft even studio light, true-to-life fabric texture, no text, no logos, no watermark.

#### `garment-dress.jpg`

> Ghost-mannequin product photo of a terracotta linen midi shirt dress with short sleeves, a small shirt collar, a button placket, a self-tie belt knotted on the left of the waist and a softly flared skirt. No person and no visible mannequin, the inside of the back neckline just visible, front view, centred, on a plain very light grey seamless background with a soft floor shadow. Portrait 2:3. Photorealistic premium fashion e-commerce photograph, soft even studio light, true-to-life fabric texture, no text, no logos, no watermark.

#### `garment-jacket.jpg`

> Ghost-mannequin product photo of a chocolate-brown suede cropped jacket, waist length, with a wide spread collar, an open front with three small gold buttons on the left edge and long sleeves with a cuff band. No person and no visible mannequin, the inside of the back neckline just visible, front view, centred, on a plain very light grey seamless background with a soft floor shadow. Portrait 2:3. Photorealistic premium fashion e-commerce photograph, soft even studio light, true-to-life fabric texture, no text, no logos, no watermark.

### Try-on results (9 edits)

Each result is an edit of a model photo. Attach **image 1 = the model** and **image 2 = the garment**, then use the prompt for that garment. The same three prompts work for all three models.

| Garment | Ada | Nil | Mira |
|---|---|---|---|
| Blazer | `tryon-ada-blazer.jpg` | `tryon-nil-blazer.jpg` | `tryon-mira-blazer.jpg` |
| Dress | `tryon-ada-dress.jpg` | `tryon-nil-dress.jpg` | `tryon-mira-dress.jpg` |
| Jacket | `tryon-ada-jacket.jpg` | `tryon-nil-jacket.jpg` | `tryon-mira-jacket.jpg` |

Image 1 = `model-<name>-before.jpg`, image 2 = `garment-<garment>.jpg`.

#### Blazer prompt

> Edit image 1. Dress the woman in the exact blazer shown in image 2, worn open over her existing oatmeal knit top and camel trousers, fitted naturally to her body, with the same colour, linen texture, lapels, horn buttons and pockets. Keep everything else in image 1 unchanged: her face and identity, hair, skin tone, body shape, pose, hands, shoes, camera angle, framing, backdrop and light. Photorealistic drape, folds and shadows. Do not add accessories.

#### Dress prompt

> Edit image 1. Dress the woman in the exact shirt dress shown in image 2, replacing her top and trousers, fitted naturally to her body, with the same terracotta colour, linen texture, collar, buttons and tie belt; her lower legs show below the hem. Swap her shoes for simple tan flat sandals. Keep everything else in image 1 unchanged: her face and identity, hair, skin tone, body shape, pose, hands, camera angle, framing, backdrop and light. Photorealistic drape, folds and shadows. Do not add accessories.

#### Jacket prompt

> Edit image 1. Dress the woman in the exact cropped suede jacket shown in image 2, worn open over her existing oatmeal knit top and camel trousers, fitted naturally to her body, with the same chocolate-brown suede, collar, gold buttons and cuffs. Keep everything else in image 1 unchanged: her face and identity, hair, skin tone, body shape, pose, hands, shoes, camera angle, framing, backdrop and light. Photorealistic drape, folds and shadows. Do not add accessories.

---

## Check before sending

- **Phone photos:** the whole product is in frame, sharp and not touching anything, and it matches the description (handle, clasp, stand, label).
- **Backgrounds:** no product and no props in the middle of the frame, and the surface is visible about three quarters of the way down.
- **Try-on pairs:** face, hair, body, pose and framing match the model's "before" photo; only the clothes change, and each garment matches its catalogue photo.
- **All images:** no text, logos, extra people or distorted hands.

After the photos are in, I also re-render the two social preview images (`og-image.png`, `og-image-tr.png`) from them.
