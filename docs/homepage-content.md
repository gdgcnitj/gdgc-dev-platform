# Home-page content

Edit `lib/content/home.ts` for community content and `lib/content/events/` for events.
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

Events now live in `lib/content/events/`, with one file per event.
See [the event content guide](event-content.md) for the schema, carousel, editable
sections, workshop example, registration settings, and publication checks.

Set `homepage.featured: true` to put an event in the homepage spotlight, including
a completed event. Optional `featuredUntil` expires the placement. Event status
controls upcoming and completed lists independently of featuring. The homepage
shows up to three upcoming and three recent unfeatured events; `/events` lists
all published events with search and a type filter.

Each card always links to its local event page. A dedicated external event site
can be shown as a separate link. Dates, descriptions, photos, problem statements,
and winners are maintained once in the event file and reused across pages.
Do not invent missing historical dates, venues, resources, or results.

## Faculty coordinators

Edit `facultyCoordinators` in `lib/content/home.ts`.
The current names, titles, emails, and profile links come from the
[CSE faculty directory](https://departments.nitj.ac.in/dept/cse/Faculty).
The directory lists Dr. Gopendra Vikram Singh as "Dr Gopendra". His publications on that profile use the full name.

The section states the department once. Each card shows the name, academic title, and email.
The name links to the person's faculty profile.
Store portraits in `public/images/faculty/` as square JPEGs.
Do not add a phone number, home address, or date of birth from the directory.

## Departments and leads

The current list comes from the project owner's role table.

| Department | Lead |
| --- | --- |
| Web Development | Anup |
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
The card always shows LinkedIn and Instagram; an unset link shows a gray placeholder.
The portfolio icon appears only when `website` is set.
The current links come from the leads' form responses. Kartik's links were supplied separately.
Use the profile URL, not a bare username, and drop tracking parameters.
Leave a portfolio unset when the response is not a real address, such as "soon".
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
