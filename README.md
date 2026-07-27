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

# Current status: sign-in is blocked

Tested against the live API in 2026. The app itself is fine - it installs,
launches, renders, and every screen works. Sign-in does not, and the reason is
on Clubhouse's side rather than in this code.

Submitting a phone number returns:

```
login did not pass token validation!
```

Clubhouse's own support documentation describes this error as the device being
unsupported or running an unsupported operating system. The number is accepted
as valid - the request gets far enough to be judged on where it came from. In
other words sign-in is gated on the client proving it is a genuine app on a
supported mobile OS, which a desktop Electron client is not and cannot pretend
to be by editing request headers.

What was ruled out along the way, in order:

1. **Is the API alive?** Yes. `check_for_update` answers in ~200ms.
2. **Is the 2021 build rejected?** It was flagged for a mandatory upgrade.
   Raising the build headers to 23.09.01 / 2446 cleared that - the API now
   reports `has_update: false`. See `app/profile.mjs`.
3. **Was the number malformed?** Yes, and that was a real bug in this client -
   it sent whatever was typed. Fixed; see `app/phone.mjs`. That changed the
   error from "your phone number is incorrect" to the one above.
4. **Is it the device check?** Yes, and that is where it stops.

Anything that got past this would mean defeating a device attestation check,
not fixing a bug in this repo. The rest of the app is in good shape if the
situation ever changes, and everything up to the auth call is verified working
against a mock backend.

# The app identity this client presents

This client talks to Clubhouse's *private* mobile API, and identifies itself as
an iOS build via `CH-AppVersion` / `CH-AppBuild` headers. Those headers live in
one place, `app/profile.mjs`.

The project originally sent build 304 (0.1.28, March 2021). Asked about that
build, the API replies:

```json
{"success":true,"has_update":true,"is_mandatory":true,
 "app_version":"23.09.01 (2446)","app_build":2446}
```

i.e. it flags build 304 as needing a *mandatory* upgrade. `app/profile.mjs`
therefore now sends build 2446 (23.09.01) - the newest build the API itself
reports as current. Only the four identity fields were changed; the Agora and
PubNub keys are deliberately left alone, since there is no evidence about what
the current app uses and guessing would break what still works.

Note that `check_for_update` is unauthenticated, so a clean answer there does
not prove the auth endpoints accept this build. Editing `app/profile.mjs` is
the place to try other values.

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
