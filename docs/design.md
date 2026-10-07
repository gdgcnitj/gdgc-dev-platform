# Website design

Use a clear Google design language for the club home page.
Use Google Sans, white surfaces, flat shapes, and the supplied brand colors.
Keep each section easy to read.

The [supplied brand guide](design/brand-guidelines.md) records the reference images.
The [content guide](homepage-content.md) explains how to update events and photos.

## Design references

- [Google I/O](https://io.google/2026/): heading hierarchy, event cards, and simple actions.
- [Google Sans](https://design.google/library/google-sans-flex-font): the Google type family.
- [GDG Guelph](https://www.gdgguelph.com/): clear community information and section order.
- [GDG IIIT Kalyani](https://gdg-website-blue.vercel.app/): small graphic details and club personality.

These are design references.
The implementation uses original artwork and this club's content.

## Page order

| Section | Purpose | Design |
| --- | --- | --- |
| Hero | Introduce the club and its purpose | White field with a faint grid, large sans-serif heading, two actions, animated flat artwork |
| Department strip | Divide the hero from the sections | Tilted dark band with the eight department names scrolling slowly |
| Our events | Show upcoming and past events | Blue grid field, compact announcement state, featured confirmed events, and a photo archive |
| Departments and leads | Show all eight departments and their leads | Yellow grid field with a slanted top edge. Portrait first, then name, domain, and short description |
| Gallery | Show life in the community | Green grid field with a slanted top edge. Two wide photos and three smaller photos on desktop |
| Common questions | Answer questions about taking part | Light gray field before the footer with native disclosure controls |
| Footer | Give visitors a next step and key links | Plain dark panel with the invitation, club identity, social channels, and grouped links |

## Sections and dividers

Give each section one field color: blue, yellow, green, light gray, then `#222222`.
Draw a faint white grid on each field.
Put headings, cards, and body text on white surfaces.
White text on brand blue or green only passes contrast at large sizes.
On yellow, use `#222222` text.
Divide fields with the tilted department strip and slanted top edges.

Use one events section.
Do not add a second event archive under "Wall of Fame".
Do not add "Behind the Pixels".

## Color

Use the six colors in the supplied brand guide.
Use the four accent colors for artwork and category markers.
Use pale versions of these colors for image placeholders.
Use `#222222` for primary text.
Use `#5F6368` for secondary text.
Use `#1967D2` for buttons and links that require readable text on white.
This darker blue is a UI color. It does not replace the brand blue.

Do not use color alone to identify a department or an event category.
Show its name beside the icon or color marker.

## Type

Use Google Sans for the home page and shared navigation.
The local Latin font file is in `app/fonts/google-sans/`.
Keep its source note and license with the file.
The existing fonts remain available to the other app pages.

Use responsive headings.
The hero reaches `88px` on a wide screen.
Section headings reach `52px`.
Use normal tracking for body text and controls.
Use tighter tracking for large headings.
The supplied board gives reference sizes. It is not the mobile type scale.

## Section rules

### Hero

Use a short purpose statement.
Keep "Join the community" and "Explore events" visible.
Use the original flat SVG when no community photo is available.
Each tile has one small loop: the code brackets breathe, the asterisk turns, the green tiles rotate, and the arrow nudges.
Keep the heading readable immediately.
Keep the green tile cells square so each quarter circle rotates inside its cell.
Do not generate realistic faces or student portraits.

## Motion

Section headings rise and cards scale in as they scroll into view.
Browsers with scroll-driven animations use CSS `animation-timeline: view()`.
Other browsers use the reveal fallback in `components/home/home-motion.tsx`.
Portraits only fade, so names and domains stay still.
Turn off all nonessential motion when the visitor prefers reduced motion.

### Events

Show confirmed upcoming events before "Past events".
If no confirmed upcoming event exists, show a compact announcement strip.
Add a date, venue, and registration link only after they are confirmed.
Use photo placeholders until the club supplies images.
Keep the existing archive titles: HackMOL, WinterFest, and Orientation.
Their dates, photos, and recaps still require club content.
Hide absent descriptions and recap links.
Do not use a draft event description as a record of what happened.

### Departments and leads

Give all eight leads the same card layout.
Use four columns on wide screens and two columns on smaller screens.
Use one column below `380px`.
Do not put leads in an automatic carousel.
Use line icons for departments and initials until portraits are available.
Keep each portrait beside its name in the reading order.
Show the domain and a short description below the name.

### Gallery

Show community photos and brief captions.
Keep the gallery separate from event registration and event recaps.
Use two wide photos above three smaller photos on desktop.
Use one wide photo above a two-column grid on phones.
Do not number the captions.

### Questions, footer, and navigation

Link to the chapter's existing community channels.
Keep common questions in a separate section immediately before the footer.
Use answers that give clear next steps.
Confirm membership rules before adding them to the answers.
The footer uses the layout structure from `~/git/layr/landing/components/layout/footer.tsx`.
Keep the Google type and colors used by this site.
Place the join invitation above the club identity and grouped navigation links.
Use the existing Instagram channel for contact until a joining route is confirmed.
Use a mobile menu with a clear open and close control.
Close the menu when a visitor selects a link or presses Escape.
Use native disclosure controls for the common questions. Open one answer at a time.

## Validation

Run `npm run check` and `npm run build`.
Check the page on desktop and mobile screens.
Check heading order, keyboard focus, anchors, the mobile menu, and image slots.
Check that the page does not scroll horizontally.
Keep visible focus states and reduced-motion support.
