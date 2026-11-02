// Live session backend: one Netlify Function, data kept in Netlify Blobs.
// Each response is its own key, so 100 students answering at once never overwrite each other.
import { getStore } from "@netlify/blobs";

const ID = /^[a-z0-9-]{1,40}$/;
const CLIENT = /^[a-z0-9]{8,40}$/i;
const TEAMS = new Set(["", "left", "middle", "right"]);

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const readState = async (store) =>
  (await store.get("state", { type: "json" })) || { active: null, reveal: false };

async function readActivity(store, act) {
  const { blobs } = await store.list({ prefix: `resp/${act}/` });
  const items = await Promise.all(
    blobs.map(async ({ key }) => {
      const v = await store.get(key, { type: "json" });
      return v ? { key, ...v } : null;
    })
  );
  return items.filter(Boolean);
}

export default async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.replace(/^\/api\/?/, "").replace(/\/$/, "");
  const store = getStore({ name: "live-session", consistency: "strong" });
  const adminKey = process.env.ADMIN_KEY;
  const isAdmin = () => !!adminKey && req.headers.get("x-admin-key") === adminKey;
  const needAdmin = () =>
    adminKey
      ? json({ error: "Wrong presenter key." }, 401)
      : json({ error: "ADMIN_KEY is not set on this Netlify site yet." }, 500);

  try {
    // Everyone: what is live right now?
    // Cached at Netlify's edge for 2 seconds, so 100 phones checking in cost about one function call every 2 seconds.
    if (route === "state" && req.method === "GET")
      return new Response(JSON.stringify(await readState(store)), {
        headers: {
          "content-type": "application/json",
          "cache-control": "public, max-age=0, must-revalidate",
          "netlify-cdn-cache-control": "public, max-age=2, stale-while-revalidate=2",
        },
      });

    // Presenter: open, close or reveal an activity
    if (route === "state" && req.method === "POST") {
      if (!isAdmin()) return needAdmin();
      const b = await req.json();
      const s = {
        active: typeof b.active === "string" && ID.test(b.active) ? b.active : null,
        reveal: !!b.reveal,
        at: Date.now(),
      };
      await store.setJSON("state", s);
      return json(s);
    }

    // Presenter: check the key
    if (route === "check" && req.method === "GET") return isAdmin() ? json({ ok: true }) : needAdmin();

    // Student: send a response
    if (route === "respond" && req.method === "POST") {
      const b = await req.json();
      const act = String(b.activity || "");
      const cid = String(b.clientId || "");
      const team = String(b.team || "").toLowerCase();
      const value = String(b.value || "").replace(/\s+/g, " ").trim().slice(0, 120);
      const kind = b.kind === "text" ? "text" : "choice";
      const max = Math.min(Math.max(parseInt(b.max, 10) || 1, 1), 10);
      if (!ID.test(act) || !CLIENT.test(cid) || !TEAMS.has(team) || !value)
        return json({ error: "That response could not be read." }, 400);

      const s = await readState(store);
      if (s.active !== act) return json({ error: "This activity has closed." }, 409);
      if (kind === "choice" && s.reveal) return json({ error: "Answers are locked." }, 409);

      let key = `resp/${act}/${cid}`;
      if (kind === "text") {
        const { blobs } = await store.list({ prefix: `${key}~` });
        if (blobs.length >= max) return json({ error: "You’ve sent the maximum for this one." }, 429);
        key = `${key}~${Date.now()}`;
      }
      await store.setJSON(key, { value, team, t: Date.now() });
      return json({ ok: true });
    }

    // Presenter: live results for one or more activities
    if (route === "results" && req.method === "GET") {
      if (!isAdmin()) return needAdmin();
      const acts = (url.searchParams.get("activities") || "").split(",").filter((a) => ID.test(a)).slice(0, 20);
      const out = {};
      await Promise.all(acts.map(async (a) => (out[a] = await readActivity(store, a))));
      return json(out);
    }

    // Presenter: hide one response (moderation)
    if (route === "hide" && req.method === "POST") {
      if (!isAdmin()) return needAdmin();
      const { key } = await req.json();
      if (typeof key !== "string" || !key.startsWith("resp/")) return json({ error: "Bad key." }, 400);
      await store.delete(key);
      return json({ ok: true });
    }

    // Presenter: clear all responses for an activity
    if (route === "reset" && req.method === "POST") {
      if (!isAdmin()) return needAdmin();
      const { activity } = await req.json();
      if (!ID.test(String(activity || ""))) return json({ error: "Bad activity." }, 400);
      const { blobs } = await store.list({ prefix: `resp/${activity}/` });
      await Promise.all(blobs.map(({ key }) => store.delete(key)));
      return json({ ok: true, removed: blobs.length });
    }

    return json({ error: "Not found." }, 404);
  } catch (e) {
    console.error(e);
    return json({ error: "Server problem. Try again in a moment." }, 500);
  }
};

export const config = { path: "/api/*" };
