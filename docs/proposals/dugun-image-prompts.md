# Düğün.com proposal: photo prompts

> **Purpose:** optional photo-realistic replacements for the illustrations on the Düğün.com proposal page.
>
> **Status:** 15 of 16 images are in use (delivered 2026-11-19).
> `venue-original.jpg` shows a different venue and is not used. Item 17 below is the replacement still needed.

The page currently uses illustrations drawn in code. These 16 images would replace them with photo-realistic examples.

**How to use these prompts:**
- Make the images in two stages, in order:
  - **Stage 1** images need no input image.
  - **Stage 2** images are edits: attach the input images listed for each one, in the order given.
  - Keeping one set of base images is what makes before/after pairs and the venue styles line up.
- Save each image with the exact file name below in `site/proposals/dugun/assets/photos/`. JPG, PNG or WebP all work.
- Tell me when they are there and I will wire them into the page. The illustrations stay as the fallback.

**Sizes:**
- People and catalogue: **1024 × 1536** (portrait, 2:3).
- Venue: **1536 × 1024** (landscape, 3:2).

**Rules for every image:**
- Fictional people only, with no likeness to real or famous people.
- No text, logos or watermarks.
- The page will label these as "example images, generated in advance with an image model". It will not present them as live output.

**Shared style line.** Paste it at the end of every people and catalogue prompt:

> Photorealistic fashion editorial photograph, soft natural window light from the left, warm ivory and blush palette, full-frame camera, 50 mm lens at f/4, true-to-life skin and fabric texture, no text, no logos, no watermark.

---

## Stage 1 · base images (no input image)

### 1. `model-a-before.jpg`: the bride-to-be, everyday clothes

> Full-length studio portrait of a fictional Turkish woman in her late twenties, standing straight and facing the camera, arms relaxed at her sides, calm natural expression. Dark brown hair in a sleek low bun with a centre parting. She wears a fitted oatmeal ribbed knit top with short sleeves, high-waisted camel wide-leg trousers and nude pointed heels. Behind her is a softly lit cream plaster wall with a tall arched recess, a pale stone floor, and a ceramic vase with olive branches on the right. Her whole body is in frame from head to shoes, with some space above her head. *(shared style line)*

### 2. `model-b-before.jpg`: the groom-to-be, everyday clothes

**Input (optional):** image 1 = `model-a-before.jpg`, used only as a reference for the background, light and framing.

> Full-length studio portrait of a fictional Turkish man in his early thirties, standing straight and facing the camera, arms relaxed at his sides, friendly natural expression, short dark hair with a side part, clean-shaven. He wears a crisp white button-down shirt with sleeves rolled to the elbow, navy chinos and brown leather loafers. Use the same background, light and camera framing as image 1 (cream plaster wall with an arched recess, pale stone floor, vase of olive branches on the right), but do not copy the person. His whole body is in frame from head to shoes. *(shared style line)*

### 3. `cat-aurora.jpg`: catalogue, A-line tulle gown

> Product photograph for a bridal boutique catalogue: an A-line wedding gown on an ivory dress form, with no person. V-neck bodice in fine floral lace with thin straps, a slim champagne satin belt, and a full layered tulle skirt pooling on the floor with tiny scattered sparkles. Soft blush-pink boutique wall with white panel mouldings, light wooden floor, gentle daylight. The whole gown is centred in the frame. *(shared style line)*

### 4. `cat-selin.jpg`: catalogue, satin mermaid gown

> Product photograph for a bridal boutique catalogue: a mermaid wedding gown on an ivory dress form, with no person. Off-the-shoulder sweetheart neckline with short folded sleeves, in smooth heavy ivory-champagne satin. It fits closely through the hips and flares at the knee into a soft train with deep satin folds and highlights. Soft blush-pink boutique wall with white panel mouldings, light wooden floor, gentle daylight. The whole gown is centred in the frame. *(shared style line)*

### 5. `cat-lina.jpg`: catalogue, bohemian lace gown

> Product photograph for a bridal boutique catalogue: a bohemian lace wedding gown on an ivory dress form, with no person. Deep V neckline, sheer long bell sleeves in floral lace with scalloped cuffs, a delicate belt of tiny fabric flowers at the waist, and a flowing chiffon skirt with lace appliqués that fade toward the hem. A thin vine of small white flowers is draped over the neck of the form. Soft blush-pink boutique wall with white panel mouldings, light wooden floor, gentle daylight. The whole gown is centred in the frame. *(shared style line)*

### 6. `cat-kenan.jpg`: catalogue, black tuxedo

> Product photograph for a menswear boutique catalogue: a black tuxedo on a headless male mannequin. Single-button jacket with black satin peak lapels, white dress shirt, black silk bow tie, white folded pocket square and a small white rose boutonnière. Black trousers with a satin side stripe, and black patent shoes at the base. Soft blush-pink boutique wall with white panel mouldings, light wooden floor, gentle daylight. The whole outfit is centred in the frame. *(shared style line)*

### 7. `cat-deniz.jpg`: catalogue, sand linen suit

> Product photograph for a menswear boutique catalogue: a sand-beige linen two-button suit on a headless male mannequin. Notch lapels with natural linen texture and soft creases, a white shirt, a sage-green knitted tie, an ivory pocket square and a small eucalyptus boutonnière. Matching trousers, and tan leather shoes at the base. Soft blush-pink boutique wall with white panel mouldings, light wooden floor, gentle daylight. The whole outfit is centred in the frame. *(shared style line)*

### 8. `venue-original.jpg`: the empty venue (1536 × 1024)

> Wide interior photograph of an empty, fictional historic mansion ballroom in İstanbul. Shot from the entrance at eye level, in a symmetrical one-point perspective. Tall arched windows run along both side walls. A pair of glazed arched garden doors sits in the centre of the far wall, with greenery outside. White walls with classical wainscoting and pilasters, a white coffered ceiling with two unlit brass-and-crystal chandeliers on the centre line, and a warm light-oak plank floor. Completely empty: no furniture, no decoration, no people. Soft overcast daylight. Architectural photography, 24 mm lens, straight verticals, no text, no watermark.

---

## Stage 2 · edits (attach the input images)

### 9–11. Try-on results, Model A

| File | Image 1 (edit target) | Image 2 (garment reference) |
|---|---|---|
| `tryon-a-aurora.jpg` | `model-a-before.jpg` | `cat-aurora.jpg` |
| `tryon-a-selin.jpg` | `model-a-before.jpg` | `cat-selin.jpg` |
| `tryon-a-lina.jpg` | `model-a-before.jpg` | `cat-lina.jpg` |

> Edit image 1. Dress the woman in the exact wedding gown shown on the dress form in image 2, fitted naturally to her body, with the same neckline, sleeves, lace, fabric, belt and skirt shape. Keep everything else in image 1 unchanged: her face and identity, hair, skin tone, body shape, pose, hands, camera angle, framing, background and lighting. The gown may cover her shoes. Photorealistic fabric drape, folds and shadows. Do not add a veil, jewellery or other accessories that are not in image 2.

For `tryon-a-lina.jpg`, add this line:

> Also place the thin vine of small white flowers from image 2 in her hair.

### 12–13. Try-on results, Model B

| File | Image 1 (edit target) | Image 2 (outfit reference) |
|---|---|---|
| `tryon-b-kenan.jpg` | `model-b-before.jpg` | `cat-kenan.jpg` |
| `tryon-b-deniz.jpg` | `model-b-before.jpg` | `cat-deniz.jpg` |

> Edit image 1. Dress the man in the exact outfit shown on the mannequin in image 2: the jacket, trousers, shirt, bow tie or tie, pocket square, boutonnière and shoes, tailored naturally to his body. Keep everything else in image 1 unchanged: his face and identity, hair, skin tone, body shape, pose, hands, camera angle, framing, background and lighting. Photorealistic fabric texture, folds and shadows.

### 14–16. Venue concepts

**Input:** image 1 = `venue-original.jpg` (edit target) for all three.

Start each prompt with this preservation line:

> Edit image 1 and keep the architecture exactly as it is: walls, arched windows, garden doors, ceiling, chandeliers, floor, camera position and perspective must not change. Only add furniture, decoration and lighting.

Then add the style for each file:

**`venue-classic.jpg`: Classic Luxury, evening**

> Style it as a classic luxury wedding reception in the evening:
> - round tables with floor-length white tablecloths and gold chiavari chairs with ivory cushions
> - tall gold candelabra centrepieces topped with spheres of white roses and hydrangeas with trailing greenery
> - gold charger plates, crystal glasses and candles on every table
> - a white aisle runner scattered with petals, and a lush arch of white flowers framing the garden doors
> - sheer white drapes beside the windows
> - the chandeliers switched on, warm romantic candlelight, and a dusk sky outside the windows

**`venue-minimal.jpg`: Modern Minimal, daylight**

> Style it as a modern minimal wedding dinner in bright natural daylight:
> - two long light-oak tables running toward the garden doors, with white linen runners and simple white modern chairs
> - low white ceramic vases with a few white orchid and anthurium stems, and slim white taper candles
> - a large thin brass circle arch in front of the garden doors, with an asymmetric arrangement of white flowers and pampas grass
> - soft neutral tones and sunlight falling through the side windows; the chandeliers off

**`venue-boho.jpg`: Bohemian Garden, golden hour**

> Style it as a bohemian garden wedding at golden hour:
> - two long dark wooden farm tables without cloths, cross-back wooden chairs and eucalyptus garland runners
> - wildflower bunches in amber glass bottles in terracotta, dusty rose and cream, and candles in amber glass
> - warm festoon string lights strung across the hall from wall to wall
> - a round wooden arch in front of the garden doors with pampas grass, dried palm leaves and terracotta roses
> - a kilim rug and two lanterns under the arch, and warm sunset light outside the windows

---

## 17. `venue-empty.jpg`: the empty hall that matches the concepts (still needed)

The delivered `venue-original.jpg` shows a different place, a decorated seaside terrace. So the venue slider can't yet show "original vs concept". Make the empty hall by removing everything from the cleanest concept photo:

**Input:** image 1 = `venue-minimal.jpg` (edit target).

> Edit image 1. Remove all furniture and decoration: the tables, chairs, table runners, vases, flowers, candles, plates, the brass circle arch and its flowers, and the pampas grass. Leave the hall completely empty. Keep the architecture exactly as it is: walls, mouldings, pilasters, arched windows, garden doors, coffered ceiling, both chandeliers (switched off), the wooden floor, camera position, lens and perspective. Fill the floor where furniture stood with matching wooden planks. Soft, even overcast daylight. Photorealistic, no people, no text, no watermark.

**Check:** flick between it and `venue-classic.jpg`, `venue-minimal.jpg` and `venue-boho.jpg`. Windows, doors, chandeliers and floor lines should stay put.

Save it as `site/proposals/dugun/assets/photos/venue-empty.jpg` and tell me. I'll convert it and turn "Original vs concept" back on (`VENUE_EMPTY_PHOTO` in `proposal.js`).

## Check before saving

- **Try-on pairs:** the face, hair, pose and framing match `model-…-before.jpg`. Only the clothes changed. If the face drifts, generate again.
- **Venue concepts:** flick between `venue-original.jpg` and each concept. Windows, doors, chandeliers and floor lines should stay in the same place.
- **Catalogue:** each garment matches its description, because the try-on results copy it.
- **All images:** no text, logos, extra people or distorted hands.
