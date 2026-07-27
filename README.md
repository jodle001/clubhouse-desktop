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
npm run dist:linux # AppImage, .deb and .rpm into dist/
```

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

If sign-in fails, `npm run doctor` reports whether the API still accepts this
client's identity.

## Verbose logging

Off by default. Turned on, it echoes the renderer's console to your terminal
and logs every API call — method, endpoint, and result. Auth tokens are
replaced with `<redacted>`, but your phone number will appear, so take care
with screenshots.

```sh
npm start -- --verbose        # build and run
CLUBHOUSE_VERBOSE=1 npm run dev
```

`npm run dev` needs the environment variable rather than the flag: its CLI
parses its own arguments and rejects unknown ones.

## Licence

MIT — see `license`. Copyright is retained by the original author for the
original work.
