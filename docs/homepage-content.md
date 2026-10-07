# Home-page content

Edit `lib/content/home.ts` to update the home page.
The page uses static content. It does not read events or leads from the database.

## Photos

1. Put the image in `public/images/`.
2. Use a short file name, such as `hackmol-2026.webp`.
3. Set the content item's `image` value to `/images/hackmol-2026.webp`.
4. Check the crop on desktop and mobile screens.

Use WebP, JPEG, or PNG files.
Use real club photos for events, portraits, and the gallery.
Keep important subjects near the center of the image.
The current frames use a center crop.

If `image` is absent, the frame shows a placeholder.
The frame keeps its shape when a photo is added.
For the hero, set `communityPhoto` to an image path.
If it is absent, the hero shows the flat SVG artwork.

## Events

Add confirmed upcoming events to `upcomingEvents`.
Add past events to `pastEvents`.
Give each event a unique `id`.

| Field | Content |
| --- | --- |
| `id` | Unique short name |
| `title` | Event name |
| `category` | Event type, such as Workshop or Hackathon |
| `description` | Confirmed description or recap; optional |
| `color` | `blue`, `green`, `yellow`, or `red` |
| `date` | Confirmed date as readable text; optional |
| `venue` | Confirmed location; optional |
| `image` | Local image path; optional |
| `href` | Confirmed event or registration page; optional |

The page shows a compact announcement strip when `upcomingEvents` is empty.
Confirmed upcoming events use a featured layout before the archive.
It shows no event-details link when `href` is absent.
The archive names come from the old home page.
Add descriptions when the club supplies recaps.
Do not invent dates, venues, or event results.

## Departments and leads

The current list comes from the project owner's role table.

| Department | Lead |
| --- | --- |
| Web Development | Mukal |
| Creatives | Vanshish |
| Mobile Development | Rishi |
| UI | Kaushik |
| Women in Tech | Rydham |
| AI | Kartik Sirohi |
| Competitive Programming | Kavish |
| DevOps | Shushobit |

Update `lead`, `initials`, and `image` when the roster changes.
Use the confirmed spelling of each name.
The `icon` field uses an icon from the existing `lucide-react` package.
Keep all leads visible in the grid.

## Gallery

Add items to `galleryMoments`.
Each item needs a unique `id` and a short `caption`.
Set `image` when its photo is ready.
The first two items use the wide frames on desktop.
The next three items use the smaller frames.
On phones, the first item uses the wide frame. The other items use two columns.
Keep five selected items on the home page.
The current captions name photo categories. Replace them when real photos are available.
Use captions that describe the actual photo.

## Common questions

Edit `commonQuestions` to update the questions and answers.
Use a short question and a clear answer.
The current answers give next steps for joining, eligibility, departments, events, and projects.
Membership rules still require confirmation from the club.
Do not promise eligibility, fees, or recruitment dates without confirmation.

## Community links

Update `socialLinks` when the club confirms a new channel URL.
The events, questions, and footer use these channels.
The hero and navigation link to the joining invitation in the footer.
Check each destination before you publish the change.

## Check a content change

Run `npm run check` and `npm run build`.
Open `http://localhost:3000` with `npm run dev`.
Check text wrapping, image crops, and links at desktop and phone widths.
