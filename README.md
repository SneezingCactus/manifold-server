![Manifold Server banner](https://github.com/SneezingCactus/manifold-server/assets/46355725/57f20767-4796-4bf5-9cef-b4ce098215fb)

An open-source implementation of the Bonk.io multiplayer servers, made to allow greater customization of the backend, whether it be by changing the server's restrictions (max players beyond 8, different username rules, prohibited host actions) or adding entire new features (multiple hosts, virtual players for map testing and mod debugging, server-side player team management).

(to be clear, the features latter mentioned aren't in the base Manifold server and are just given as examples of what can be done)

## Features

- Unlimited player limit
- Customizable server restrictions (username rules, ratelimits, host actions)
- Persistent ban list (players banned in one session remain banned in every session after it, unless unbanned)
- Map and game settings persist as long as the server stays up (this is useful for map making because if your client crashes or you suffer an internet outage, as long as your server stays up, you can just join back and no progress will be lost)

## Planned features

- Manifold Client (bonk.io client mod to access Manifold servers with ease)
- Support for ping packets
- Add missing types for game settings and player info

## "Would be nice to have" features that may or may not be added

- Chat log

---

## Setting up

1. Make sure [Node.js](https://nodejs.org/en) 20 or later is installed on your computer.
2. 
