# Shopier proposal: photo prompts

> **Purpose:** photo-realistic images for the Shopier proposal page (`site/proposals/shopier/`).
>
> **Status (2026-11-20):** Part A (11 images) delivered and published. Part B (try-on, 8 images) delivered and published.

**19 images in total, and only the 4 try-on results need input images.** The page builds the rest itself:

- **Product scenes are not generated one by one.** Each product needs one phone photo. I cut the product out of it on the Mac. The page then places that cut-out on 8 empty backgrounds that all three products share, and adds a matching shadow and colour grade. So the product in every scene is the same pixels as in the phone photo, and nothing has to be checked for product drift.
- **Try-on** uses 2 models and 2 garments, so only 4 try-on results.

| Part | What | Count | Input images |
|---|---|---|---|
| A · Product Studio | 3 phone photos + 8 empty backgrounds | 11 | none |
| B · Try-On | 2 models + 2 garments + 4 try-on results | 8 | 2 per try-on |

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

## Part B · Try-On (8 images)

Two models and two garments, so 4 try-on results.

**Make the 4 try-on results in a dedicated try-on tool**, not a general image model, which tends to change the face or the garment.
- [FASHN](https://fashn.ai): its 10 free credits cover the 4 try-ons with room for retries.
- Kling's **AI Virtual Try-On**, under AI Images, also works.

The models and garments are ordinary text-prompt images, so make those in your usual tool.

All 8 images: portrait **1024 × 1536** (2:3).

| Step | Files | How |
|---|---|---|
| 1 | `model-ada-before.jpg`, `model-nil-before.jpg` | Text prompt, no input image |
| 2 | `garment-blazer.jpg`, `garment-dress.jpg` | Text prompt, no input image |
| 3 | `tryon-ada-blazer.jpg`, `tryon-ada-dress.jpg`, `tryon-nil-blazer.jpg`, `tryon-nil-dress.jpg` | Try-on tool: one model photo + one garment photo |

### Step 1 · Models (2)

Try-on tools work best with the whole body visible, facing the camera, arms a little away from the body and fitted clothes. These prompts ask for exactly that.

#### `model-ada-before.jpg`

> Full-length e-commerce studio photo of a fictional woman in her late twenties with light olive skin and dark brown hair in a sleek low bun, standing straight and facing the camera, arms relaxed and held slightly away from her body, hands visible, a calm natural expression. She wears a fitted plain white crew-neck T-shirt with short sleeves, slim-fit high-waisted camel trousers and simple nude flat shoes. Plain warm light-grey seamless studio backdrop, soft even light, a soft floor shadow. Her whole body is in frame from head to shoes, centred, with some space above her head and below her feet. Portrait 2:3. Photorealistic premium fashion e-commerce photograph, full-frame camera, 50 mm lens, true-to-life skin and fabric texture, no text, no logos, no watermark.

#### `model-nil-before.jpg`

**Input (optional):** image 1 = `model-ada-before.jpg`, for the backdrop, light, clothes and framing only.

> Full-length e-commerce studio photo of a different fictional woman in her early thirties with deep brown skin, long dark wavy hair worn loose behind her shoulders, and a curvy build (Turkish size 44–46), standing straight and facing the camera, arms relaxed and held slightly away from her body, hands visible, a warm natural expression. She wears a fitted plain white crew-neck T-shirt with short sleeves, slim-fit high-waisted camel trousers and simple nude flat shoes. Plain warm light-grey seamless studio backdrop, soft even light, a soft floor shadow. Same backdrop, light and framing as image 1, but do not copy the person. Her whole body is in frame from head to shoes, centred, with some space above her head and below her feet. Portrait 2:3. Photorealistic premium fashion e-commerce photograph, full-frame camera, 50 mm lens, true-to-life skin and fabric texture, no text, no logos, no watermark.

### Step 2 · Garments (2)

Try-on tools need the whole garment, flat and unobstructed, front view, on a plain background.

#### `garment-blazer.jpg`

> Ghost-mannequin product photo of an ecru linen double-breasted blazer with a relaxed fit, peak lapels, four brown horn buttons, two flap pockets and long sleeves. The whole garment is visible, front view, buttoned, centred, with no person, no visible mannequin, no hanger and nothing else in frame, the inside of the back neckline just visible. Plain very light grey seamless background, soft even light, a soft shadow. Portrait 2:3. Photorealistic premium fashion e-commerce photograph, true-to-life linen texture, no text, no logos, no labels, no watermark.

#### `garment-dress.jpg`

> Ghost-mannequin product photo of a terracotta linen midi shirt dress with short sleeves, a small shirt collar, a button placket, a self-tie belt knotted at the waist and a softly flared skirt. The whole dress is visible from collar to hem, front view, centred, with no person, no visible mannequin, no hanger and nothing else in frame, the inside of the back neckline just visible. Plain very light grey seamless background, soft even light, a soft shadow. Portrait 2:3. Photorealistic premium fashion e-commerce photograph, true-to-life linen texture, no text, no logos, no labels, no watermark.

### Step 3 · Try-on results (4)

| File | Model photo | Garment photo | Category, if the tool asks |
|---|---|---|---|
| `tryon-ada-blazer.jpg` | `model-ada-before.jpg` | `garment-blazer.jpg` | Top |
| `tryon-ada-dress.jpg` | `model-ada-before.jpg` | `garment-dress.jpg` | One-piece / dress |
| `tryon-nil-blazer.jpg` | `model-nil-before.jpg` | `garment-blazer.jpg` | Top |
| `tryon-nil-dress.jpg` | `model-nil-before.jpg` | `garment-dress.jpg` | One-piece / dress |

**In FASHN:** open Virtual Try-On, upload the model photo as the model and the garment photo as the garment, choose the category from the table if it asks, pick the highest quality, then generate and download. No text prompt is needed.

**In Kling:** go to AI Images, then AI Virtual Try-On. Upload your own model photo instead of a built-in model, and use "Upload Single Garment" for the garment.

**Keep a result only if** the face, hair, body, pose and backdrop match the model photo and the garment matches its catalogue photo (colour, buttons, collar, belt). Otherwise run it again.

**No try-on tool?** In a general image editor, attach image 1 = the model photo and image 2 = the garment photo, then use:

> Edit image 1. Dress the woman in the exact garment shown in image 2, fitted naturally to her body, with the same colour, fabric, collar, buttons and details. For the blazer, wear it over her white T-shirt and camel trousers. For the dress, replace her T-shirt and trousers with it. Keep everything else in image 1 unchanged: her face and identity, hair, skin tone, body shape, pose, hands, shoes, camera angle, framing, backdrop and light. Photorealistic drape, folds and shadows. Do not add accessories.

---

## Check before sending

- **Phone photos:** the whole product is in frame, sharp and not touching anything, and it matches the description (handle, clasp, stand, label).
- **Backgrounds:** no product and no props in the middle of the frame, and the surface is visible about three quarters of the way down.
- **Try-on pairs:** face, hair, body, pose and framing match the model's "before" photo; only the clothes change, and each garment matches its catalogue photo.
- **All images:** no text, logos, extra people or distorted hands.

After the photos are in, I also re-render the two social preview images (`og-image.png`, `og-image-tr.png`) from them.
