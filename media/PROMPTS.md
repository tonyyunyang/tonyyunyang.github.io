# Seedance video prompts — one per publication

Videos land here as `media/<slug>.mp4`. The gallery card and the paper page's
Video sheet pick them up automatically.

## Settings (all five)

- **Aspect ratio 16:9**, duration **8–10s**, highest resolution offered (2K).
- Each prompt follows Seedance's official formula — Subject → Action →
  Environment → Camera → Style → Constraints — in the recommended 60–100
  word range, with a single primary camera move.
- Colors are the site's accents, so the videos sit natively in the design:
  yellow `#FFFF02`, blue `#0000FF`, orange `#FF6100`, red `#FF484C`,
  green `#00AF3F`.
- No on-screen text is requested anywhere (video models garble type, and the
  cards already carry the titles).
- For a clean loop, trim the output so the first and last seconds match
  (`ffmpeg -i in.mp4 -ss 1 -to 9 -an media/<slug>.mp4`).

---

## 01 · twinrouterbench.mp4 (blue)

> A minimalist railway switching yard seen as thin white lines on a solid
> cobalt blue background. Small white square parcels glide steadily along a
> main track, reach glowing switch points, and divert smoothly onto three
> parallel lanes of different thickness — one wide, one medium, one narrow.
> One parcel cascades down from the wide lane to the narrow lane. Slow lateral
> tracking shot, left to right. Flat 2D motion-graphics style, Swiss graphic
> design, even studio lighting, crisp geometry, precise mechanical motion.
> Avoid text, avoid jitter, avoid temporal flicker, avoid camera shake.

*Metaphor: step-level routing of LLM calls to the cheapest sufficient model,
with the downgrade-and-cascade protocol.*

## 02 · mera.mp4 (orange)

> Three concentric white wireframe rings orbiting a small solid white core,
> centered on a solid vivid orange background. Small geometric modules —
> squares, triangles, hexagons — dock onto the rings one by one; each docking
> makes a ring reconfigure and rotate to a new arrangement, and a soft white
> pulse travels from ring to ring. Slow orbit shot around the structure.
> Flat minimal 3D style with matte surfaces, even studio lighting, calm
> deliberate motion. Avoid text, avoid jitter, avoid flicker, avoid motion
> blur.

*Metaphor: SkillBook, router, and adapter co-evolving in cycles.*

## 03 · emotion-vr.mp4 (yellow)

> An extreme close-up of a stylized human eye drawn in clean black line art,
> centered inside a circular lens frame on a solid bright yellow background.
> The iris dilates gently, the gaze darts between three points, and a thin
> black polyline traces the gaze path, leaving small dots at each fixation;
> the eyebrow line lifts slightly at the end. Slow push-in. Flat 2D vector
> animation style, minimal Swiss design, even lighting, smooth precise
> motion. Avoid text, avoid photorealistic skin, avoid jitter, avoid flicker.

*Metaphor: high-frame-rate periocular capture, gaze scanpaths,
micro-expressions.*

## 04 · reverse-imaging.mp4 (red)

> A white line-art cross-section of a human heart centered on a solid warm
> red background, beating in a slow steady rhythm. A vertical scan band
> sweeps across it once, and the heart separates into three stacked
> translucent layer maps drifting slightly apart — each with a different
> line texture — then the layers realign and fuse back into one clean
> silhouette. Fixed camera. Flat 2D medical-diagram style, minimal design,
> even lighting, calm clinical motion. Avoid text, avoid gore, avoid
> photorealism, avoid jitter, avoid flicker.

*Metaphor: inferring spin-property maps (PD, T1, T2) from one observed image,
then reassembling appearance from physics.*

## 05 · pruning-nnunet.mp4 (green)

> A dense U-shaped lattice of fine white filaments on a solid green
> background, shaped like a deep letter U with thick ends and a narrow
> bottom. Most filaments in the bottom of the U gently dissolve and fade
> away while the strands near both upper ends stay bright and intact,
> leaving a crisp skeletal structure; a single white pulse then travels
> down one arm and up the other. Slow pull-out. Flat minimal
> motion-graphics style, even studio lighting, smooth deliberate motion.
> Avoid text, avoid jitter, avoid flicker, avoid chaotic movement.

*Metaphor: 80% of nnU-Net weights pruned from the bottleneck while critical
encoder/decoder ends survive; the network still works.*
