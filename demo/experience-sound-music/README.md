# Experience Sound & Music — concept demo

Design mockup shown alongside proposal ESM-260830. Covers scope items W-01
to W-04 (the booking page and its enquiry flow) and demonstrates A-01/A-03
(the agent) with a scripted conversation.

```
site.html    the source — edit this one; also what gets published as an Artifact
index.html   generated: the same page wrapped in a standalone document
build.sh     regenerates index.html from site.html
```

## This is a mockup, and it says so

A page carrying a real company's name must not be able to pass as their
actual site. Three things keep that true, and none of them should be removed:

- the pink **concept demo** ribbon pinned to the top of every screen
- every price, photo and review visibly marked as a placeholder — the gallery
  frames are dashed and labelled, the review cards say *sample copy, not a
  real review*, and the footer contact details are obvious dummies
- the enquiry form and the WhatsApp button send nothing. Submitting renders
  what the owner *would* receive, then says so.

The agent conversation is **scripted, not live** — it shows the shape of the
exchange the proposal describes, not a connected system.

## Rebuilding

```sh
./build.sh
```

`site.html` is headless on purpose — no `<!doctype>`, `<html>`, `<head>` or
`<body>` — because the Artifact renderer supplies that skeleton. `build.sh`
wraps it back up for hosting or opening from disk.

## Design notes

Deliberately *not* YardScale's identity — this is the client's brand, so it
gets its own: after-dark aubergine ground, brass as the primary, a magenta
stage gel used sparingly, Anton for display (sound-system flyer vernacular)
over Manrope and DM Mono. Single visual world, no theme stamps; every colour
is painted explicitly.

## Before showing it

- Swap the placeholder services copy for their real packages and coverage.
- The agent script quotes a "six-piece" and a "Reception package" — invented
  for the demo. Use their real package names, or the client will correct you.
- Confirm which parishes they cover; the demo assumes St Ann as an example.
