# Vehicle & Parking Registry

A [Chickadee Bandit](http://chickadeebandit.com) app.

Register household vehicles and parking spots/permits. Leadership manages spot assignments and can flag non-compliant vehicles — flags can cross-post directly into Violation Tracking.

## Features

- Members register their own vehicles (make, model, color, plate, permit number)
- Board/leadership view of the full registry with status filters (active, flagged, expired)
- Parking spot grid — assigned, visitor, and unassigned spots with vehicle assignments
- Leadership can flag a vehicle and optionally issue a matching violation in Violation Tracking, with a deep link back to it
- Activity log per vehicle (registered, edited, flagged, resolved)

## Install

In your hub, go to **Apps → Install from URL** and paste:

```
https://github.com/firebirdsystems/chickadeebandit-vehicle-parking-registry/releases/latest/download/bundle.json
```

## Development

See the [app-template](https://github.com/firebirdsystems/chickadeebandit-app-template) for build instructions and the full manifest field reference.
