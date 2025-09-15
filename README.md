# A Better PTV

This is a personal project to make myself an all-in-one PTV app with less cluttered UI and a focus on saving time with alerts and smart rerouting to avoid delays.

## Status

WORK IN PROGRESS

This is an attempt to create something with a new, more modern tech stack - the [T3 Stack](https://create.t3.gg/)

- [Next.js](https://nextjs.org)
- [Clerk](https://clerk.com)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Major Challenges
- Integration of [PTV API V3](https://www.vic.gov.au/public-transport-timetable-api)
- Integration of [Google Maps API](https://mapsplatform.google.com/lp/maps-apis)

## Ideas

[x] [MVP] Basic Backend using routed with tRPC and Prisma ORM, use Mock Data<br>
[ ] [MVP] Basic Frontend using Next, Tailwind, and Prisma (Working on a cleaner UI)<br>
[x] [Feature] Extend functionalities to match the PTV + TramTracker using [PTV API V3](https://www.vic.gov.au/public-transport-timetable-api)<br>
[ ] [Feature] Implement Google Maps for a better search experience and a trip planner system.<br>
[ ] [Feature] Personalisation: Frequent routes based on (sorted) number of searches, custom alerts for delays on favorite/frequent routes, advise to leave earlier or later based on disruption.<br>
[ ] [Feature] Data Analytics: Highlight peak times for certain stops or lines.<br>
[ ] [Feature] Smart Rerouting: If there is a delay for one of the departures at any stop in the route, reroute if needed.<br>
[ ] [Feature] Nerd things: Add "pro-tips" and "fun facts" like how to stand on trams, fastest exits from certain stations, etc.<br>