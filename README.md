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

# Checking whether the backend still answers

This client talks to Clubhouse's *private* mobile API using the request headers
of the March 2021 iOS build (app build 304). That API is not public and is not
versioned for third parties, so it can start rejecting this client at any time
without the app itself changing.

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
