# clubhouse-desktop

An unofficial desktop client for Clubhouse, for Linux, macOS and Windows.

Originally created by [Arta Mo](https://callmearta.ir)
([callmearta/clubhouse-desktop](https://github.com/callmearta/clubhouse-desktop));
rewritten and maintained here. Credit to the original author is retained
deliberately — please keep it if you fork this in turn.

> **Use at your own risk.** This talks to Clubhouse's private API. Unofficial
> clients can get accounts restricted. Clubhouse also allows one session per
> account, so signing in here will sign you out elsewhere.

## Running it

```sh
npm install
npm run dev        # hot-reloading development build
npm start          # build, then run
```

`npm install` downloads Electron's ~220 MB binary as a post-install step, and
that download is easy to block — a proxy, a firewall, or `ignore-scripts` will
all leave you with an install npm reports as successful but that fails later
with a bare *"Error: Electron uninstall"*.

`npm run dev` and `npm start` check for the binary first and finish the download
if it is missing, so this should self-repair. If it genuinely cannot reach
GitHub, try a mirror:

```sh
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
(cd node_modules/electron && node install.js)
```

Fedora needs nothing beyond `nodejs`/`npm`; everything else ships inside
Electron. `sudo dnf install rpm-build` is only required to build an `.rpm`.

```sh
npm test           # unit + component tests
npm run lint
npm run doctor     # check the API accepts this client's identity
npm run probe      # ask the live API which endpoints still exist
npm run dist:linux # AppImage, .deb and .rpm into dist/
```

Reverse-engineering tools, used to build against the current API rather than
the retired 2021 one. All read-only — they inspect a downloaded APK or your own
signed-in session and send nothing on your behalf:

```sh
npm run endpoints -- <clubhouse.apk>          # list every endpoint in the app
npm run decompile -- <clubhouse.apk> <name>   # read one endpoint's exact request shape
npm run probe:features                        # shape the DM/wave/notification/discovery responses
npm run probe:poll     -- --channel <id>      # the room-poll contract
npm run probe:settings -- --channel <id>      # the room-settings verbs
```

`docs/api-endpoints.md` is the result: the whole current surface, grouped by
feature, with what this client implements and what the server blocks.

## How it is put together

```
src/
├── main/       Electron main process. Owns the API client, tokens and settings.
├── preload/    The only bridge to the renderer: one explicit contextBridge API.
├── renderer/   Vue 3 + Vite. Pure UI - no Node, no network, never sees a token.
│   ├── audio/  AudioEngine port: Null | Agora | Fake adapters
│   └── room/   RoomEvents port: Null | PubNub | Fake adapters
└── shared/     Pure, dependency-free logic. Where the tests concentrate.
```

Two decisions shape everything else:

**The renderer is sandboxed.** `contextIsolation` is on and `nodeIntegration`
is off. Every request goes over IPC to the main process, which attaches
credentials. A compromised page cannot read the filesystem or steal the token.

**Audio is a port, not a dependency.** Clubhouse hosts its rooms on Agora —
`join_channel` returns an Agora token for an Agora channel under Clubhouse's own
App ID, so the transport is not ours to pick. But *whether an SDK is loaded at
all* is. The default adapter does nothing, successfully: the app browses rooms,
profiles and events perfectly well without any audio SDK present. Turn audio on
in Settings to lazy-load `agora-rtc-sdk-ng`. Tests use a fake adapter, which is
why room flows are testable at all.

## Signing in

Sign-in took four fixes to get working, recorded here so nobody repeats them:

1. **Identify as Android.** iOS identities are refused with `login did not pass
   token validation` — Apple's DeviceCheck is iOS-only, and no desktop can
   produce a hardware-signed token. See `src/shared/profile.js`.
2. **Send a stable `CH-DeviceId`.** Left alone, the old client minted a fresh
   UUID per request, so one session looked like dozens of devices.
3. **Normalise the phone number to E.164.** Pick your country; type the number
   however you normally write it.
4. **Accept 6-digit codes.** Clubhouse sends six; the old client silently
   required exactly four and did nothing otherwise.
5. **Do not use Node's global `fetch`.** It is undici, which follows the Fetch
   standard and so sends `sec-fetch-mode: cors` - a browser header no native app
   sends. Clubhouse answered `success: true` and then dispatched neither the SMS
   nor the voice call. `src/main/transport.js` uses `node:https` instead, which
   sends only what it is given.

If sign-in fails, `npm run doctor` reports whether the API still accepts this
client's identity.

### When no code arrives

Clubhouse can answer `success: true, is_blocked: false, error_message: null`
and still send nothing. No field reports it, so the only way to tell is that no
text turns up. That is what a request which does not look like the app it claims
to be gets you - see point 5 above for the one that caused it here.

If it happens again, the identity is the next thing to vary:

```sh
CLUBHOUSE_IDENTITY=clubdeck-ua npm start -- --verbose   # build in the User-Agent
CLUBHOUSE_IDENTITY=android npm start -- --verbose       # a later Android build
```

The sets live in `src/shared/profile.js`. "Call me instead" on the code screen
uses a different delivery path (`/call_phone_number_auth`), so it is worth
trying — if the call arrives when the text does not, the account and the
request are fine and only SMS delivery is being dropped.

The claimed app version matters beyond sign-in. `npm run doctor` prints the
build the server currently wants — 2026-08 it is `1026421` (23.08.31), carried
by the `android-current` identity — and

```sh
CLUBHOUSE_IDENTITY=android-current npm start -- --verbose
```

claims it. Verified end to end: sign-in survives the swap, and the feed, rooms,
chat and history all work on the current build exactly as on 2576. The server
flags 2576 as a *mandatory* update (`is_mandatory: true`), so `android-current`
is the safer place to be — it is opt-in only because 2576 is the build known to
deliver a fresh sign-in code, and that path is untested on the newer one.

**A newer build is not a key to everything, though.** Some features are
refused no matter which build is claimed — see **Known limitations** below for
what is blocked and why.

Requesting codes repeatedly makes this worse, not better; Clubhouse throttles
by number. Leave twenty minutes between rounds of testing.

## Known limitations

Three features are built into the UI but the server refuses them, and no change
this client can make gets past the refusal. Each was confirmed by sending the
*exact* request the official app sends (its endpoints and request shapes were
read straight out of the Android app — see `docs/api-endpoints.md`) and still
being refused. They degrade gracefully: the control stays, and it explains
plainly why it did not work rather than failing silently.

- **Sending reactions.** `send_channel_reaction` answers `Feature flag is not
  enabled` under every identity we can claim (2021 Android, current Android,
  current iOS). It is **not** an account restriction — the same account reacts
  fine from the official iOS app. The likely reason is that Clubhouse only
  accepts reactions from a genuine, hardware-attested app (Apple App Attest /
  Play Integrity), which a desktop client cannot forge. *Receiving* reactions —
  other people's emoji and GIFs — works fully.

- **Starting a new DM.** `create_conversation` answers *"please upgrade your
  app… new chat changes"* — a version cutoff that blocks older clients from
  opening a brand-new conversation. *Reading* existing Chats threads and
  *replying* to them both work; only creating a new one is blocked. (This one
  is worth a retest under the `android-current` identity — it was only ever hit
  on the 2021 build.)

- **Sending a wave.** `send_wave` takes exactly the body the app sends
  (`{ to_user_profile_id, source }`, read from the app), yet answers an empty
  `400` under every identity and every `source` value. The wave vocabulary is
  all live presence (`online_user_id`, `WHOS_ONLINE`, `initiate_wave`), so
  waving needs Clubhouse's real-time "who's online" heartbeat, which this
  client does not maintain. Building that (over the PubNub link the room
  already uses) is possible but was left out of scope. *Receiving* waves works.

The one thing that would turn any of these from "likely" to "certain" is
capturing what the official phone app actually sends on the wire. That is out
of scope here, so these are documented as known blocks rather than left as open
threads.

## Verbose logging

Off by default. Turned on, it echoes the renderer's console to your terminal
and logs every API call — method, endpoint, and result. Auth tokens, your
phone number and verification codes are replaced with `<redacted>`, however
deeply a response nests them, so the output is safe to paste into an issue.

```sh
npm start -- --verbose        # build and run
CLUBHOUSE_VERBOSE=1 npm run dev
```

`npm run dev` needs the environment variable rather than the flag: its CLI
parses its own arguments and rejects unknown ones.

## The 2021 API is partly gone

> The complete, current API surface — every endpoint and request shape, read
> straight out of the official Android app — lives in
> [`docs/api-endpoints.md`](docs/api-endpoints.md). That is the source of truth;
> the table below is the original 2021-era investigation, kept for the reasoning.

Clubhouse retired the "hallway" this app was built around, and every public
description of its API predates that. Several endpoints now answer a plain-text
`404 Not found` - not an error the app can interpret, but a path that is not
routed at all.

| endpoint | state |
| --- | --- |
| `/me`, `/join_channel`, sign-in | fine |
| `/get_channels` | gone, replaced by `/get_feed_v3` |
| `/get_online_friends` | gone, no known replacement |
| `/get_events` | gone, no known replacement |
| `/get_notifications` | gone — replaced by `POST /get_activities` (the activity feed) |
| `/get_following`, `/get_followers` | gone, no known replacement |
| `/get_profile`, `/search_users` | fine |
| `GET /get_suggested_follows_all` | alive - people to follow, paginated |
| `POST /get_suggested_follows_friends_only` | alive, wants parameters |
| `POST /block`, `POST /unblock` | alive - `{ user_id }` |
| `/audience_reply` | alive - raising a hand |
| `POST /become_speaker` | alive - `{ channel }`, take the stage |
| `/accept_speaker_invite` | gone, replaced by `/become_speaker` |
| stepping down (8 names tried) | all gone; see below |
| `POST /uninvite_speaker` | alive - `{ channel, user_id }` |
| `POST /get_channel` | alive - one room's state, `{ channel }` |
| discovery/explore/search-channels (14 names tried) | all gone — but `POST /get_discovery_feed` exists (collections of houses, not live rooms) |
| `POST /get_blocked_users` | alive |
| `POST /send_channel_message` | alive - `{ channel, message }` |
| `GET /get_channel_messages` | alive - chat history, `?channel=`, paginated by `cursor` |
| `GET /get_chat_messages` | exists, but rejects everything tried |
| `POST /send_channel_reaction` | routed, but refused — see Known limitations (receiving works) |
| `POST /like_channel_message`, `/unlike_channel_message` | alive - `{ channel, message_id }` |
| `POST /get_conversations` | alive - the Chats feed, `{ conversations, next_cursor }` |
| `POST /get_conversation` | alive - one thread with its segments, `{ conversation_id }` |
| `POST /create_conversation` | version-gated: "please upgrade your app" |
| `POST /invite_speaker`, `/uninvite_speaker` | alive - `{ channel, user_id }` |
| `POST /mute_speaker`, `/make_moderator` | alive - `{ channel, user_id }` |
| `POST /create_channel` | alive - needs `privacy` (open/social/closed), not just the old flags |
| `POST /send_wave` | routed, but refused — needs live presence, see Known limitations |
| `POST /get_channel_user_poll` | alive - `{ channel }` |
| `POST /create_channel_user_poll` | alive, wants parameters |

Two conclusions from the 2026-08 probe worth stating plainly. There is no
public room directory: every discovery, explore, trending and search-channels
name answers a plain-text 404, so `/get_feed_v3` - rooms from people you follow
and houses you are in - is the only room list this API serves, and the home
screen is honest about that. And no self-service way off the stage was found;
the one live verb in that family is `/uninvite_speaker`, which a moderator aims
at somebody else. Whether it accepts your own user id - a moderator "uninviting"
themselves - is untested, deliberately: that experiment takes you off a real
stage, so it wants a willing tester rather than a probe.

The home screen reads rooms out of the feed: `/get_feed_v3` answers
`{ items, available_topics }`, and each item wraps one live room in a `channel`
object carrying the fields `/get_channels` used to return. Other item kinds turn
up in that list, so anything without a `channel` is skipped.

Room chat arrives over PubNub as a `new_channel_message` action, carrying the
author inline, and history comes from `/get_channel_messages?channel=` (newest
first, so it is sorted before display). Note the near-miss: `/get_chat_messages`
also exists but rejects every shape tried with an empty `error_message`, while
`/get_channel_messages` names what it wants - and pairs with
`/send_channel_message`. An endpoint that says what is missing is worth more
than one that only says no.

Going on stage takes three steps, not one. `/become_speaker` is the Clubhouse
half. The second is Agora's, because the client runs in `live` mode where
everybody starts as `audience` and an audience member cannot publish - without
`setClientRole("host")` the microphone button would work and nobody would hear
anything. The third is the credential: Clubhouse issues an Agora token *per
role*, and `/become_speaker` hands the publisher one back in its response. Keep
the listener token from `join_channel` and unmuting fails with Agora's
`INVALID_OPERATION: Can't publish stream, haven't joined yet!`, which names
neither the token nor the role. The room keeps all three in step, in both
directions - being removed from stage mutes and drops back to audience.

`/become_speaker` also answers `should_join_muted`, and the microphone button
reports what it was refused rather than rejecting silently: unhandled, a
refusal and a dead button look exactly the same.

`/me` is not a profile. It answers with a stub - `user_id`, `name`, `username`,
`photo_url`, `share_url` - so your own profile goes through `/get_profile` like
everybody else's. Read straight from `/me` it renders a name above zero
followers, zero following, no bio and no houses, which looks like an empty
account rather than a thin response. What `/me` is for is the two id lists
(`following_ids`, `blocked_ids`), which appear nowhere else.

PubNub carries more than chat. `invite_speaker` is how a moderator offers you
the stage, and `channel_message_like_count_update` is somebody liking a message.
Both were being dropped before anything listened for them, which is why the
adapter logs every action nothing handles - that log is how each one here was
found.

The screens built on retired endpoints have been removed rather than left to
report a 404: notifications, the followers and following lists, and events. The
follower counts remain on a profile as plain text, since `/get_profile` still
returns them - there is just no way to list the people any more.

`npm run probe` asks the live API what it still serves, using your signed-in
session and the app's own headers, so a result there means the same thing inside
the app:

```sh
npm run probe                          # the candidate list
npm run probe -- get_hallway           # try specific names
npm run probe -- --shape get_feed_v3   # print a response's structure
```

`--shape` prints types and nesting rather than values, hiding anything that
looks like a token, phone number or email, so its output is safe to share.

## Licence

MIT — see `license`. Copyright is retained by the original author for the
original work.
