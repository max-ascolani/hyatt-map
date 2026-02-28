# Map Enhancements — Future Features

Ideas for enhancing the interactive competition map beyond the core MVP.

---

## From Initial Brainstorm

### 1. Operating Hours & Time Slider
- Add open/close times for each business in the dataset
- **Time slider UI** — drag to a time range (e.g., 6–9pm) and the map filters to only show businesses open during that window
- Useful for the pitch: "At 8pm on a Tuesday, here's what's available within 2 miles of the Hyatt" — visually shows how few options there are at off-peak hours
- Could highlight that most cafes/coworking close by 5pm, reinforcing the all-day cafe gap

### 2. Business Links & Social Media
- Add to each marker popup: website URL, Instagram, Google Maps link
- Allows stakeholders to click through and verify during the pitch
- Shows the "brand quality" of competitors at a glance

### 3. Ratings & Google Reviews Link
- Display star rating prominently on each marker popup (already partially in the data)
- Direct link to the Google Reviews page for each business
- Could add review count (e.g., "4.7 — 1,395 reviews") to show popularity/demand
- Sort the list view by rating to show quality landscape

---

## Additional Ideas

### 4. Price Tier Filtering
- Tag each competitor with a price tier: $ / $$ / $$$ / $$$$ or monthly cost range
- Filter by price on the map — show only competitors in the $200+/mo range to highlight the premium landscape
- Reinforces the pitch: "Here's what $300–500/mo gets you at each of these places vs. what the Hyatt members club could offer"

### 5. Heatmap / Density Overlay
- Toggle a heatmap layer showing concentration of competitors by category
- Makes gaps visually obvious — the area immediately around the Hyatt would show as "cold" for cafes, spas, coworking
- More impactful than individual dots for a high-level pitch slide

### 6. Demographic Data Overlay
- Layer in census/demographic data for the surrounding zip codes: median income, age distribution, population density
- Shows the target demo (25–40, high income) lives right around the Hyatt
- Sources: Census Bureau ACS data (free), or Esri demographic data

### 7. "What If" Members Club Comparison
- A toggle that shows hypothetical Hyatt members club markers on the map — all the amenities they'd offer in one location
- Side-by-side comparison: "To get gym + pool + workspace + dining + bar today, you'd need to go to 5 different places. With the members club, it's all here."
- Could draw lines from the Hyatt to each competitor it replaces, showing consolidation

### 8. Traffic / Drive Time by Time of Day
- Show actual drive times from residential areas to the Hyatt at different times of day (morning commute, evening, weekend)
- Reinforces accessibility: "Most of our target demo can get here in under 10 minutes"
- Source: OpenRouteService or Google Directions API

### 9. Photo Gallery per Competitor
- Add 1–3 photos for each competitor pulled from Google or Yelp
- Lets stakeholders see the vibe/quality of each competitor without leaving the map
- Especially useful for showing that public pickleball courts are bare concrete vs. what a members club could look like

### 10. Membership Cost Comparison Table
- Expandable panel comparing membership costs across all clubs in the area:
  - Big Canyon CC: $150K–$200K initiation
  - Balboa Bay Club: $15K–$50K initiation
  - Newport Beach CC: invitation only
  - Equinox: $250/mo
  - thehouse: waitlisted, cost+10% pricing
  - **Hyatt Members Club: $XXX/mo (proposed)**
- Positions the Hyatt members club pricing in context

### 11. Seasonal / Event Calendar Layer
- Show recurring events at competitor venues (summer concerts, golf tournaments, wine tastings)
- Highlights that the Hyatt amphitheatre is already an events asset
- Could show gaps in the local events calendar that the members club could fill

### 12. Walk Score / Bike Score Display
- Show walkability and bikeability scores for the Hyatt location
- Pull from walkscore.com API (free tier available)
- Relevant for the 25–40 demo who may bike or walk from nearby residential areas

### 13. Member Catchment Area
- Overlay residential areas / neighborhoods within the target radius
- Highlight high-value neighborhoods: Corona del Mar, Newport Coast, Eastbluff, Harbor View, Big Canyon
- Estimate potential member pool size based on household count and income filters

### 14. Before / After Comparison Mode
- Split-screen or toggle: "Newport Beach Today" vs. "Newport Beach with Hyatt Members Club"
- Today view shows the gaps. Members club view fills them in.
- Very effective for a pitch deck presentation

### 15. Export & Share
- Export current map state as a high-res PNG or PDF for pitch deck slides
- Shareable URL with current filter state preserved (e.g., `?categories=gyms,spas&radius=2mi`)
- Useful for sending to stakeholders who weren't in the room

---

## Tier 3 — Conceptual Categories (from 2026-02-27 research)

These are harder to map as traditional competitor pins but would strengthen the pitch narrative. They could be implemented as narrative overlays, info panels, or special map modes rather than standard marker categories.

### 16. Curated Events & Cultural Programming
- Map venues that host events relevant to the 25-40 demo: cooking classes, speaker series, wine dinners, networking mixers, art exhibitions, live music
- Shows that the events landscape is fragmented — a members club could centralize all of it
- Known venues: CUCINA enoteca (pasta workshops, wine pairings), Ripkytchen (cooking classes), Roy's (five-course wine dinners), various Eventbrite one-offs
- Pitch angle: "Today, our target demo pieces together experiences from 10 different venues and Eventbrite pages. The members club becomes their single events calendar."

### 17. Social Fitness / Run Clubs / Group Athletics
- Map meetup points and routes for the social fitness communities that dominate the 25-40 demo
- Newport Run Club (100s of members, Wednesday evenings at the pier), Social Hour Run Club (250+ members), Girls Walk Club, Cal Coast Track Club, Newport Coast Triathlon Team (80+ members), Pulse Newport (beach bootcamps)
- Pitch angle: "These free communities are the social glue for the 25-40 demo. A members club that hosts its own run club, cycling group, and beach bootcamps — with post-workout pool, bar, and brunch — replaces all of them with something better."
- The Hyatt's 26-acre property + Back Bay trails make it a natural launchpad

### 18. Kids Programming / Family Amenities
- Relevant for the upper end of the 25-40 demo (32-40) who are starting families
- Soho House offers child memberships; London clubs offer creche/child-minding
- Current NB options: My Gym Newport Beach, YMCA childcare, City of Newport Beach youth programs, Newport Dunes family activities
- Pitch angle: "A members club that offers supervised kids' hours unlocks the family segment — parents work out, swim, or dine while kids are cared for on-site."
- Low cost: designate a supervised kids' area or partner with My Gym for members-only programming

### 19. Concierge & Lifestyle Services
- No local competitor — this is a pure gap
- Elite clubs (Quintessentially, Zero Bond, Casa Cipriani) offer 24/7 lifestyle concierge: travel planning, restaurant reservations, event access, personal shopping, gifting
- Hyatt already has hotel concierge infrastructure that could be extended to members
- Pitch angle: "The value isn't just what's inside the building — it's the convenience layer that simplifies their entire life."

### 20. Creative Studios (Podcast / Content Creation / Photo-Video)
- The 25-40 demo includes a significant entrepreneur/creator cohort
- NeueHouse offers a recording studio; modern coworking increasingly includes podcast booths
- Only local competitor: Rogue Collective (Costa Mesa border) with podcast + photo/video studio
- Pitch angle: "A soundproofed podcast room and small photo studio require minimal space but signal that this club understands the modern professional."

### 21. Private Screening Room / Cinema
- Standard at nearly every top-tier members club: Soho House, NeueHouse, Spring Place, San Vicente (50-seat screening room), Zero Bond
- No private screening room exists in Newport Beach — only public cinemas (THE LOT, Edwards)
- Pitch angle: "Convert one existing meeting room into a members-only screening room for film nights, watch parties, and private events."
- Very feasible: Hyatt has 26,000+ sq ft of event/meeting space
