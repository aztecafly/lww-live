# Learning Without Walls · Live session app

A live audience app for the 90-minute talk. Students join on their phones, and the presenter screen shows the results live. It matches the interactive slides in the deck.

- **Student page:** `https://<your-site>.netlify.app/` (put this URL in the QR codes on the slides)
- **Presenter screen:** `https://<your-site>.netlify.app/present.html` (do not share)

## What's inside

| Activity | Slide | Type |
|---|---|---|
| Warm-up word cloud | “How did you learn something new this week?” | Up to 3 short answers each, shown as a word cloud |
| Poll: certificates | “Have you ever earned a certificate outside your degree?” | Multiple choice, live bars |
| Myth or Fact 1–8 | Energy break | Team quiz (Left / Middle / Right) with answer reveal and team scores. Use it instead of Kahoot, or as a backup |
| Hall vote | “Should the university tell you?” | Yes / No / It depends, live bars |
| Design your 2035 self | Pair design | Idea board feed (up to 3 posts per phone) |
| Exit ticket | Exit ticket | One sentence each, shown as a feed |

Edit the wording of any question in `public/activities.js`.

## Deploy to Netlify (one time, about 10 minutes)

The app has a small backend (a Netlify Function with Netlify Blobs storage), so **the drag-and-drop "Netlify Drop" upload will not work**. Use one of these instead.

### Option A: GitHub (easiest to update later)
1. Create a new GitHub repository and upload everything in this folder.
2. In Netlify: **Add new site → Import an existing project → GitHub** and pick the repository. The build settings are read from `netlify.toml`, so leave them as they are and click **Deploy**.
3. Set the presenter key: **Site configuration → Environment variables → Add a variable**. Key: `ADMIN_KEY`. Value: a password only you know.
4. Go to **Deploys → Trigger deploy → Deploy site** so the key takes effect.

### Option B: Netlify CLI
```
npm install -g netlify-cli
cd learning-without-walls-live
netlify login
netlify init                         # create a new site
netlify env:set ADMIN_KEY "your-secret-password"
netlify deploy --build --prod
```

Optional: rename the site (Site configuration → Change site name) to something short, such as `lww-utm.netlify.app`, so it's easy to type.

## On the night

1. Open `/present.html` on the laptop connected to the projector and enter your `ADMIN_KEY`.
2. With nothing open, the screen shows a big **join QR code**. Leave it up as students arrive.
3. Click an activity in the left panel. It appears on every phone within a few seconds.
4. Use **Reveal answer** on Myth or Fact questions. Phones show whether students were right, and the screen shows team scores.
5. Click **×** on any idea or exit-ticket card to hide it from the screen (moderation).
6. **Clear responses** wipes the current activity, which is useful after a rehearsal.
7. **Hide controls** (bottom left) gives a clean full screen for the audience. You can switch back to the slides at any time; the app keeps running.

## Tips
- **Rehearse** with a few phones the day before, then **Clear responses** on each activity.
- **QR codes for the slides:** open the presenter screen, right-click the big QR code and save it as an image, then drop it into the `[QR code]` boxes in the deck.
- **Wi-Fi:** each phone checks in every 3–4 seconds. Those checks are cached at Netlify's edge, so the backend runs only about once every 2 seconds however many phones join. Still, test the hall Wi-Fi and have a show-of-hands backup.
- **Netlify usage:** one 90-minute session is light, but check your plan's function and Blobs limits under **Usage** in Netlify after the rehearsal.
- **Students never need to log in.** Each phone gets an anonymous ID, and a student keeps their answers if they refresh the page.
