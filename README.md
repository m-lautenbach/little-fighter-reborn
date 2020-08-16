# Little Fighter Reborn

Hosted here: https://mlautenbach.com/

This is a reimplementation of Little Fighter 2 (http://www.lf2.net/) using original assets and datafiles (converted and manually revised).

I'm in no way connected to the creators Marti Wong and Starsky Wong and if you know a way to contact them, please let me know. The mail addresses on the website seem dead.

Original LF2 assets in this repository are presumably still in their copyright, so use and redistribute at your own risk.

# Getting started

Check package.json for commands (`yarn dev` starts a dev server).

There are two servers, one on cloudfront for content delivery and one on heroku for WebRTC connection negotiation. The clients send updates directly to each other without a server (well, they might use ICE, see WebRTC docs).

If you run `yarn dev`, it will still use the heroku server, but the heroku server changes very infrequently (as it only establishes connections).

All state is in one JSON structure, globally available, is updated through mutation and can also be inspected from the browser console (just type `state`, but beware that it's constantly mutated).

The frame rate is about 60fps, but most animations run at around 30fps.

No js game dev framework is used.

There is a tool to convert original data files (after conversion from binary to string with another tool) to json, but the json files in `src` are also heavily modified to be more self-explanatory.
