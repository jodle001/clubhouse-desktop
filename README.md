# This application may not be resold or republished under someone else's name and credits may not be removed from the application. 

# clubhouse-desktop

This is an unofficial desktop client for the currently trending ClubHouse.

# Any bans on the accounts is possible so use it at your own risk!

Developed Using Electron JS + Vue JS + AgoraSDK.

For downloading the Mac/Linux/Windows compiled version go to releases section.
https://github.com/callmearta/clubhouse-desktop/releases

I know source code is a mess, but since it's been developed in a hurry ( about 30-40hrs ) to get it working and also since it was my first time using Electron, Vue, and Agora, i put my time into adding new features and improving stability instead of a clean code. So if you think it's a mess, feel free to make it clean and do a pull request.
Also i'm using a really old version of Agora web SDK and that's because new version of Agora won't work because of the limitation they put on the user agents for clubhouse ( at least i think so ).


# Screenshot

![Screenshot](https://github.com/callmearta/clubhouse-desktop/blob/main/Screen%20Shot%202021-03-14%20at%2018.01.56.png?raw=true)


# How to run source code locally
1. Clone the project
2. Go to root folder of project and run `npm install`
3. Run `npm start` to run the project

The app builds and launches on current Node versions (verified on Node 22) and
on current Linux distributions, despite Electron 10 being old.

## Fedora

Everything the app needs at runtime ships inside Electron, so a plain
`npm install && npm start` works. You only need extra packages to build
installers:

```sh
sudo dnf install nodejs npm            # to run from source
sudo dnf install rpm-build             # only if you want to build the .rpm
```

If the window fails to start with a sandbox error, your kernel has
unprivileged user namespaces disabled. Either re-enable them
(`sudo sysctl -w kernel.unprivileged_userns_clone=1`) or start with
`npm start -- --no-sandbox`.

# Status of sign-in

Tested against the live API in 2026. Getting a phone number accepted took four
distinct fixes, in this order:

1. **Is the API alive?** Yes - `check_for_update` answers in ~200ms.
2. **Is the 2021 build rejected?** It was flagged for a *mandatory* upgrade.
3. **Was the number malformed?** Yes, and that was a real bug here - the client
   sent whatever was typed, guarded only by a length check. See `app/phone.mjs`.
4. **Is the client itself rejected?** It was, while identifying as an iPhone:

   ```
   login did not pass token validation!
   ```

   Clubhouse's support docs describe that as an unsupported device or OS. Apple's
   DeviceCheck / App Attest is iOS-only, so a request claiming to be an iPhone
   can be asked for a hardware-signed token no desktop can produce.

Clubdeck, a desktop client that does still sign in, sidesteps that by
identifying as **Android**. This client now does the same - see
`app/profile.mjs` for the values and how they were recovered and verified.

Two caveats worth knowing. Clubhouse allows one session per account, so signing
in here will end a session elsewhere and vice versa. And an unofficial client
always carries some risk to the account, as the notice at the top of this file
says.

# The app identity this client presents

This client talks to Clubhouse's *private* mobile API and identifies itself
through `User-Agent`, `CH-AppVersion`, `CH-AppBuild` and `CH-DeviceId`. Those
live in one place, `app/profile.mjs`:

| header | value |
| --- | --- |
| `User-Agent` | `clubhouse/android` |
| `CH-AppVersion` | `0.1.8` |
| `CH-AppBuild` | `2576` |
| `CH-DeviceId` | a UUID generated once and persisted |

The project originally claimed to be the March 2021 iOS build (0.1.28 / 304).
Every iOS identity tried, including the newest one the API itself reports as
current, was refused at sign-in with `login did not pass token validation`.
Presenting as Android is what Clubdeck does, and it is the only identity seen
to get past that.

`CH-DeviceId` matters too: with no value in the profile, the API client mints a
fresh UUID on *every request*, so one session looks like dozens of different
devices. It is now generated once per install and reused.

The Agora and PubNub credentials are unchanged from the original a304 profile,
and were confirmed byte-identical to the ones Clubdeck sends - so only the
identity headers ever needed to change.

Note that `check_for_update` is unauthenticated, so a clean answer there proves
nothing about the auth endpoints. `app/profile.mjs` is the place to try other
values.

# Checking whether the backend still answers

That API is not public and is not versioned for third parties, so it can start
rejecting this client at any time without the app itself changing.

To check where you stand before debugging anything else:

```sh
npm run doctor
```

It reports your Node/Electron versions and what the API returns for this app
build, and distinguishes a real API rejection from a corporate proxy blocking
the host.

# How to build source code
I've used electron-packager myself for bundling the app and building releases. You can do so using electron-packager too. I hope you do not build versions with minor changes and credit yourself for it!

`electron-builder` is also configured, which is the easier route on Linux:

```sh
npm run dist:linux      # builds AppImage + .deb + .rpm into dist/
```

Then on Fedora: `sudo dnf install ./dist/clubhouse-*.x86_64.rpm`
