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

Decorative illustrations live in `public/images/illustrations/`.
They are transparent WebP files used by the empty events state, the
questions section, the alumni hero, and the 404 page.
Keep the same file names when you replace one.

## Events

Add confirmed upcoming events to `upcomingEvents`.
Add past events to `pastEvents`.
Give each event a unique `id`.

| Field | Content |
| --- | --- |
| `id` | Unique short name |
| `title` | Event name |
| `category` | Event type, such as Workshop or Hackathon; optional |
| `description` | Confirmed description or recap; optional |
| `color` | `blue`, `green`, `yellow`, or `red` |
| `date` | Confirmed date as readable text; optional |
| `venue` | Confirmed location; optional |
| `image` | Local image path; optional |
| `illustration` | Transparent artwork shown without a frame until `image` is set; optional |

The page shows a compact announcement strip when `upcomingEvents` is empty.
Confirmed upcoming events use a featured layout before the archive.
Event cards have no outbound links; each event has a page at `/events/<id>`.
Upcoming cards link to that page. Set `registration: true` to show the sign-up form there.
On a narrow screen the form follows the title, and the cover sits below the form.
Set `time` and `venue` when confirmed; the page shows "To be announced" until then.
The form fields and checks live in `lib/content/registration.ts`.
`registerForEvent` in `app/events/actions.ts` validates sign-ups but does not store them yet.
Outside development it refuses sign-ups, so connect storage before release.
The past-event details come from [hackmol.com](https://hackmol.com/) and the chapter's [GDG community page](https://gdg.community.dev/gdg-on-campus-dr-b-r-ambedkar-national-institute-of-technology-jalandhar-india/).
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
| DevSecOps | Sushobhit |

Update `lead`, `initials`, and `image` when the roster changes.
Store portraits in `public/images/leads/` as 800 × 640 JPEGs.
Crop to the head and shoulders, with the face about 40% from the top.
Add a lead's profiles to `links` with the `linkedin`, `instagram`, and `website` keys.
The card always shows all three icons; an unset link shows a gray placeholder.
Use links that the lead confirms.
Use the confirmed spelling of each name.
The `icon` field uses an icon from the existing `lucide-react` package.
Keep all leads visible in the grid.

## Alumni

Edit `alumni` in `lib/content/alumni.ts`.
The alumni page groups people by `batch`, the graduation year, with the newest batch first.
A new batch gets its own section when you add its first person.
Store portraits in `public/images/alumni/<batch>/`.

| Field | Content |
| --- | --- |
| `department` | Department `id` from `departments`; sets the icon and color |
| `role` | Role shown on the card; defaults to the department title |
| `session` | Session the role was held, such as `2024–25` |
| `nowAt` | Current company or program, shown as "@ Microsoft"; optional |
| `note` | Short line from the alumni; optional |
| `links` | Same `linkedin`, `instagram`, and `website` keys as leads |

Add `nowAt` only when the person confirms it.
A card without a role or department shows "Role coming soon".
Entries with `pending: true` are placeholder cards; search skips them.
Replace a placeholder with the person's details and remove `pending`.
The search box matches names, roles, departments, companies, and batch years.
When current leads graduate, add them to `alumni` with their batch and department.

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
