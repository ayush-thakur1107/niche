# NICHE MAXING

## Personal Knowledge Universe / Life Atlas / Second Brain

Build a large-scale, highly interactive, deeply personal web application called **Niche Maxing**.

Primary deployment target:

`ayushthakur.space`

This is NOT a professional portfolio, résumé, SaaS dashboard, social network, productivity app, or public-facing personal-brand website.

It is a **personal digital universe**.

The purpose is to allow one person to map, collect, understand, connect, revisit, develop, and eventually query everything that makes up their intellectual and personal world.

The application should feel like a combination of:

- an infinite knowledge map
- personal encyclopedia
- visual graph
- research notebook
- digital library
- Letterboxd-like movie journal
- Goodreads-like book journal
- personal music library
- idea/philosophy notebook
- learning roadmap
- fitness progression log
- skill tracker
- vocabulary journal
- personal archive
- private digital museum
- personal operating system

However, **do not simply copy any of these existing products**.

The central concept is:

> **Everything is a node. Everything can connect. Everything belongs to the person.**

The application should be designed so that the user's interests can grow without requiring the application architecture to be redesigned.

The user may know about history, physics, programming, astronomy, dinosaurs, games, cinema, music, cars, sports, philosophy, fashion, tailoring, architecture, science, etc.

The system must therefore be **open-ended rather than category-dependent**.

Do not assume the final taxonomy of the user's life.

---

# 1. CORE PHILOSOPHY

The application should support five fundamental activities:

1. **Discover**
2. **Capture**
3. **Connect**
4. **Understand**
5. **Become**

The application should not merely store information.

It should show the evolution of the user's understanding.

For example:

The user begins with:

`Indian History`

They manually create:

`Prehistory`
`Ancient India`
`Medieval India`
`Modern India`

Then:

`Ancient India → Mahajanapadas → Magadha`

Then:

`Magadha → Nanda Empire`
`Magadha → Maurya Empire`

Then:

`Aryabhata → Mathematics`
`Aryabhata → Astronomy`

Then perhaps:

`Chola Dynasty → Maritime Trade → Southeast Asia → Thailand → Cultural History`

The important point:

**The application MUST NOT automatically construct the user's conceptual map simply because AI can.**

The user should be able to create the relationships manually.

AI and external data can assist.

The user's map remains their own.

---

# 2. THE ATLAS

The Atlas is the central experience.

Create an infinite, zoomable, pannable canvas.

Users should be able to:

- create nodes
- rename nodes
- delete nodes
- duplicate nodes
- drag nodes
- connect nodes
- disconnect nodes
- label relationships
- group nodes visually
- zoom
- pan
- search
- focus on a node
- open node details
- collapse branches
- expand branches
- filter nodes
- filter relationships
- change visual layouts
- save viewport state
- create multiple maps
- optionally embed one map inside another
- jump between connected areas

The graph must support potentially thousands of nodes.

Do not design the architecture around a fixed number of nodes.

Consider graph rendering performance from the beginning.

Potential technology may include graph/canvas libraries such as:

- React Flow
- XYFlow
- D3
- Cytoscape
- Sigma.js
- PixiJS
- Three.js
- WebGL
- Canvas APIs

Evaluate the appropriate combination instead of blindly installing everything.

The UI should feel fluid.

---

# 3. NODE SYSTEM

The node is the fundamental data object.

A node should NOT be restricted to predefined categories.

Support built-in types such as:

- PERSON
- PLACE
- EVENT
- ERA
- CIVILIZATION
- EMPIRE
- COUNTRY
- CITY
- CONCEPT
- IDEA
- THEORY
- BOOK
- MOVIE
- SERIES
- SONG
- ALBUM
- ARTIST
- DIRECTOR
- GAME
- CHARACTER
- SPORT
- ATHLETE
- SKILL
- PROJECT
- COURSE
- SUBJECT
- OBJECT
- VEHICLE
- ARCHITECTURE
- ARTWORK
- FOOD
- RECIPE
- WORD
- PHILOSOPHY
- QUOTE
- SOURCE
- CUSTOM

Allow users to create custom node types.

---

# 4. NODE PAGE

Every node must have its own page.

Example:

`/node/chola-dynasty`

The node page should potentially contain:

- title
- type
- short description
- cover image
- tags
- dates
- location
- notes
- rich text
- links
- external sources
- citations
- media
- attachments
- timeline
- related people
- related places
- related concepts
- related nodes
- user-created relationships
- questions
- observations
- personal opinion
- confidence level
- status
- creation date
- modification history

Do not make every field mandatory.

The interface should adapt to the node type.

---

# 5. PERSONAL VS EXTERNAL INFORMATION

This distinction is extremely important.

External information:

> “The Chola dynasty was a major Tamil dynasty…”

Personal information:

> “I want to investigate their naval expansion further.”

These must be visually and semantically distinguishable.

The system should know:

`EXTERNAL_CONTEXT`

versus:

`USER_KNOWLEDGE`

versus:

`USER_OPINION`

versus:

`USER_QUESTION`

versus:

`USER_CONNECTION`

This distinction will become extremely important for future RAG functionality.

---

# 6. EXTERNAL KNOWLEDGE FETCHING

When a user creates a node, optionally provide:

**Fetch context**

The system may query external sources and present a concise contextual summary.

Do NOT simply copy entire external pages.

Provide:

- concise overview
- important facts
- dates
- people
- places
- related concepts
- source links
- source attribution

Potential source integrations may include:

- Wikipedia APIs
- Wikidata
- OpenAlex
- Crossref
- Google Books APIs
- TMDB
- OMDb
- Spotify APIs
- YouTube APIs
- MusicBrainz
- OpenStreetMap
- public scientific APIs
- other legal/public APIs

Do not hard-code dependencies on one external provider.

Create an abstraction such as:

`ExternalKnowledgeProvider`

so providers can be swapped later.

Example:

```text
KnowledgeProvider
    ├── WikipediaProvider
    ├── WikidataProvider
    ├── BooksProvider
    ├── MovieProvider
    ├── MusicProvider
    └── CustomProvider
```

External information should never silently overwrite personal notes.

---

# 7. CONNECTION SYSTEM

Relationships are first-class objects.

A relationship should contain:

- source node
- target node
- relationship type
- label
- description
- direction
- strength/importance optionally
- created by user
- creation date
- notes

Relationship examples:

`influenced`
`inspired`
`preceded`
`followed`
`caused`
`part_of`
`related_to`
`studied_with`
`created_by`
`located_in`
`developed_from`
`influenced_by`
`contradicts`
`similar_to`
`reminds_me_of`
`want_to_learn`
`connected_because`
`custom`

Allow arbitrary relationships.

The graph should support both semantic and purely personal connections.

---

# 8. GRAPH UX

The graph should be beautiful.

Avoid the appearance of a corporate organizational chart.

Possible visual direction:

- dark editorial interface
- subtle textures
- restrained typography
- fine connection lines
- atmospheric depth
- subtle motion
- elegant hover states
- depth through scale
- spatial navigation
- smooth zooming
- smooth panning
- contextual focus

Do not turn everything into neon cyberpunk.

Do not make it look like a generic AI dashboard.

The aesthetic should feel closer to:

**museum archive + scientific visualization + personal notebook + futuristic library**

Use animation intentionally.

Potential libraries:

- Motion
- Framer Motion
- GSAP
- Anime.js
- Lenis
- Three.js
- React Three Fiber
- Drei
- D3
- React Spring

Do not use multiple animation libraries for the same problem without reason.

---

# 9. MAP MODES

Support multiple map modes eventually.

### Freeform

User manually places everything.

### Hierarchical

Automatic tree arrangement while retaining manual relationships.

### Timeline

Nodes arranged chronologically.

### Geographic

Nodes placed geographically where meaningful.

### Cluster

Nodes grouped by type/tag.

### Constellation

Highly visual experimental mode.

### Focus mode

Show only a selected node and nearby relationships.

### Research mode

Highlight nodes recently modified or lacking sources.

---

# 10. SEARCH

Create global search.

Search across:

- node names
- notes
- tags
- sources
- books
- movies
- songs
- ideas
- projects
- vocabulary
- fitness entries
- roadmaps

Search should eventually support semantic search.

Initial implementation may use conventional full-text search.

Future implementation:

vector embeddings + hybrid retrieval.

---

# 11. COMMAND PALETTE

Implement a global command palette.

Keyboard shortcut:

`Cmd/Ctrl + K`

Commands:

- New node
- Search
- New map
- New note
- Add connection
- Open library
- Add movie
- Add book
- Add song
- Add idea
- Add vocabulary
- Log workout
- Add roadmap
- Go home
- Go to Atlas
- Random node
- Recently edited
- Random forgotten node

The command palette should become one of the main navigation mechanisms.

---

# 12. CINEMATHEQUE

Create a personal cinema database.

Inspired by Letterboxd conceptually, but completely personal.

Sections:

- Watched
- Watching
- Watchlist
- Favorites
- Rewatch
- Abandoned
- Recommendations

Movie entries may include:

- title
- year
- poster
- director
- cast
- genre
- runtime
- country
- language
- rating
- personal review
- favorite scene
- favorite character
- quotes
- soundtrack
- where watched
- date watched
- recommendation level
- “who should watch this?”
- personal tags

External movie metadata may be fetched.

Create relationships:

`Movie → Director`
`Movie → Actor`
`Movie → Genre`
`Movie → Theme`
`Movie → Philosophy`
`Movie → Book`
`Movie → Historical Event`

---

# 13. LIBRARY

Create a personal book library.

Sections:

- Read
- Reading
- Want to read
- Abandoned
- Favorites

Book data:

- title
- author
- cover
- year
- genre
- ISBN
- rating
- review
- notes
- favorite passages
- ideas
- questions
- related books
- related concepts
- date started
- date finished

Allow books to create Atlas nodes.

Example:

```text
The Stranger
    ↓
Absurdism
    ↓
Existentialism
    ↓
Camus
```

---

# 14. MUSIC ROOM

Create a personal music universe.

Support:

- genres
- artists
- albums
- songs
- playlists
- moods
- eras
- instruments

External links may include:

- Spotify
- YouTube
- Apple Music
- other providers

Do not attempt to host copyrighted audio.

Store metadata and links.

Allow personal annotations:

> “Why I like this.”

> “Discovered this in…”

> “This reminds me of…”

> “Songs for…”

Genre pages could include:

- R&B
- Ghazal
- Rock
- Metal
- Jazz
- Classical
- Hip-hop
- Pop
- Electronic
- Folk
- etc.

But users should be able to create arbitrary genres.

---

# 15. IDEAS / PHILOSOPHY

Create a personal thinking space.

Users can write:

- beliefs
- questions
- arguments
- philosophical thoughts
- observations
- hypotheses
- contradictions
- things they changed their mind about

Every idea can become a node.

Allow connections:

`Idea → Philosopher`
`Idea → Book`
`Idea → Experience`
`Idea → Scientific Concept`
`Idea → Contradictory Idea`

Support version history.

A particularly important feature:

### “What I used to think”

Allow users to preserve old versions rather than silently replacing them.

The system should represent intellectual growth.

---

# 16. ROADMAPS

Create personal roadmaps.

Examples:

- Learn Physics
- Become good at Guitar
- Learn Martial Arts
- Improve Programming
- Learn Tailoring
- Build a Game
- Prepare for an exam
- Build a startup
- Read 20 books

A roadmap consists of:

```text
Goal
    ↓
Milestones
    ↓
Steps
    ↓
Resources
    ↓
Projects
    ↓
Evidence
```

Every roadmap item can link to an Atlas node.

Support:

- progress
- deadlines
- optional schedules
- dependencies
- notes
- resources
- completion evidence

Do not turn this into a generic task manager.

It is primarily a **map of becoming**.

---

# 17. BODY / FITNESS

Private personal fitness tracker.

Track:

- exercises
- weight
- sets
- repetitions
- running
- distance
- pace
- sports
- personal records
- measurements if desired

Example:

Hammer curl:

```text
12.5 kg
    ↓
15 kg
    ↓
17.5 kg
```

The point is not public fitness flexing.

The point is:

> **“What am I capable of now compared with myself before?”**

Provide visual progression.

Support personal records.

Allow exercise nodes to exist in the Atlas.

---

# 18. SPORTS / PLAY

Track sports and physical activities.

Examples:

- cricket
- badminton
- running
- football
- basketball
- swimming
- table tennis
- etc.

Track:

- skill level
- practice
- sessions
- milestones
- competitions
- personal observations

Also support indoor games:

- chess
- cards
- board games
- table tennis
- puzzles

---

# 19. MARTIAL ARTS

Create a martial arts section.

Track:

- discipline
- training
- techniques
- sessions
- progression
- notes
- coaches/resources
- milestones

Possible disciplines:

- boxing
- Muay Thai
- BJJ
- wrestling
- judo
- karate
- taekwondo
- MMA
- Kalaripayattu
- etc.

Do not assume the user will only ever choose one.

---

# 20. INSTRUMENTS / MUSIC SKILLS

Track instruments.

Example:

`Guitar`

Progress:

```text
Never played
↓
Basic chords
↓
Strumming
↓
Songs
↓
Theory
↓
Fingerstyle
↓
Competent
```

Attach:

- practice sessions
- songs learned
- techniques
- resources
- recordings
- notes

---

# 21. CRAFTS & SUBTLE KNOWLEDGE

The application should intentionally support things that are neither academic subjects nor conventional “skills.”

Examples:

- tailoring
- watches
- coffee
- cooking
- wine/food culture where appropriate
- architecture
- typography
- fashion
- cars
- photography
- leather
- materials
- furniture
- design
- etiquette
- craftsmanship

The user may simply want to understand enough to recognize quality.

Create a concept:

### Cultural Fluency

A user can mark:

`Heard of it`
`Recognize it`
`Understand it`
`Can explain it`
`Can discuss it`
`Can participate`
`Competent`
`Deep interest`

This is NOT a school grade.

It is a self-assessment.

---

# 22. VOCABULARY

Create a personal vocabulary system.

Daily word feature.

Each word:

- word
- pronunciation
- definition
- etymology
- synonyms
- antonyms
- example
- user's own sentence
- where encountered
- related words
- difficulty
- familiarity
- date added

The system may optionally generate a daily word.

However:

Do not make it feel like a generic language-learning app.

It should feel like:

> **“Words I have adopted into my mind.”**

Allow users to connect words to books, ideas, philosophy, writing, etc.

---

# 23. SCIENCE / PHYSICS

Physics should be able to become a deep discipline.

Do not flatten physics into a trivia section.

Support structured learning:

```text
Mathematics
    ↓
Mechanics
    ↓
Waves
    ↓
Thermodynamics
    ↓
Electromagnetism
    ↓
Relativity
    ↓
Quantum Mechanics
```

But preserve user freedom.

Allow the user to create their own conceptual graph.

Every concept can become a node.

Example:

`Newtonian Mechanics`
→ `Momentum`
→ `Energy`
→ `Lagrangian Mechanics`
→ `Classical Field Theory`

---

# 24. COMPUTER SCIENCE / DOMAIN

Support deep technical knowledge.

Possible areas:

- programming
- algorithms
- data structures
- systems
- networking
- operating systems
- databases
- AI
- ML
- cybersecurity
- graphics
- game development
- distributed systems
- compilers
- mathematics
- HCI

The user should be able to build a personal CS knowledge graph.

Projects can connect to concepts.

Example:

```text
Project
 ↓
React
 ↓
JavaScript
 ↓
Programming Languages
 ↓
Computer Science
```

---

# 25. PROJECT WORKSHOP

A project area for things the user is building.

Each project:

- title
- description
- status
- idea
- goals
- stack
- repository
- deployment
- screenshots
- notes
- milestones
- problems
- lessons
- completion date
- retrospective

Statuses:

`Idea`
`Exploring`
`Building`
`Paused`
`Completed`
`Archived`

The workshop must not become a graveyard.

Completed projects should remain visible as evidence.

---

# 26. “MUSEUM OF UNFINISHED THINGS”

Explicitly support unfinished work.

But give it a healthy structure:

```text
Ideas
Experiments
Paused
Abandoned
Completed
```

Allow the user to write:

> Why I stopped this.

> What I learned.

> What could revive it.

This transforms unfinished work from shame into historical data.

---

# 27. PERSONAL TIMELINE

Create a timeline of the user's own life inside the system.

Possible events:

- started learning something
- completed project
- discovered artist
- watched important film
- read book
- personal achievement
- learned skill
- changed belief
- fitness milestone
- academic milestone
- major idea
- trip
- memorable event

This should become a **personal history**.

---

# 28. “ME” PAGE

The Me page is not a résumé.

It should show:

### Currently

- learning
- reading
- watching
- listening
- building
- training
- thinking about

### Interests

Dynamic collection.

### Skills

Current ability.

### Deep pursuits

Areas where the user seeks serious competence.

### Curiosities

Things the user wants to explore.

### Beliefs

Personal ideas.

### Evolution

Things that changed over time.

### Statistics

Interesting personal statistics.

Example:

```text
Nodes created
Connections made
Books read
Movies watched
Projects completed
Words collected
Skills practiced
Hours trained
Ideas written
```

Avoid gamifying everything aggressively.

---

# 29. DAILY / RANDOM DISCOVERY

Create optional discovery surfaces.

Examples:

**Random node**

**Random forgotten node**

**On this day**

**One word**

**One historical event**

**One concept**

**One old note**

**One unfinished project**

**One connection you haven't explored**

The system should occasionally remind the user of things they have forgotten.

---

# 30. PERSONAL DASHBOARD

The homepage should NOT be a standard productivity dashboard.

It should feel alive.

Possible sections:

```text
CURRENTLY

Reading:
...

Listening:
...

Learning:
...

Building:
...

Training:
...

Thinking:
...
```

Then:

```text
RECENT DISCOVERIES
```

```text
RECENT CONNECTIONS
```

```text
FROM THE ARCHIVE
```

```text
YOUR WORLD
```

---

# 31. DATABASE ARCHITECTURE

Use a relational database initially.

Potential stack:

- PostgreSQL
- Prisma or Drizzle
- Node/TypeScript backend
- Next.js or another modern React framework

Do not tightly couple the application to one ORM.

Core entities might include:

```text
User
Node
NodeType
Connection
Map
MapNodePosition
Note
Source
Media
Tag
Book
Movie
Artist
Album
Song
Idea
Roadmap
RoadmapStep
Project
Skill
Workout
WorkoutSet
Sport
Instrument
VocabularyWord
TimelineEvent
ExternalReference
Embedding
```

Do not create needless separate tables when generic Node architecture would be better.

Prefer extensibility.

---

# 32. CONTENT MODEL

Consider a hybrid model.

Stable structured data:

- IDs
- types
- relationships
- timestamps
- metadata

Flexible content:

- rich text
- custom fields
- user-defined metadata

Potential JSON fields may be appropriate where schema flexibility is desirable.

But avoid turning the entire database into unstructured JSON.

---

# 33. RICH TEXT

Use a robust editor.

Potential:

- TipTap
- ProseMirror
- Lexical
- Slate

Requirements:

- headings
- paragraphs
- lists
- links
- quotes
- code
- inline formatting
- images
- embeds
- tables
- callouts
- backlinks
- node references

Most importantly:

### Mention other nodes

Typing:

`@Aryabhata`

should create a reference.

Typing:

`[[Aryabhata]]`

could optionally create a wiki-style node reference.

---

# 34. BACKLINKS

If Node A references Node B:

Node B should automatically show:

**Referenced by**

This makes the knowledge base behave like a personal wiki.

---

# 35. SOURCE MANAGEMENT

Every externally fetched fact should ideally retain:

- provider
- source URL
- source title
- date fetched
- relevant metadata

Allow manual sources too.

Do not pretend that external information is the user's own writing.

---

# 36. AI LAYER

AI should be an assistant, NOT the owner.

Potential capabilities:

- summarize external context
- suggest related nodes
- suggest possible connections
- identify duplicate nodes
- extract entities from notes
- generate tags
- explain difficult concepts
- turn notes into flashcards
- ask questions about a topic
- generate research directions
- identify knowledge gaps
- semantic search
- summarize user's own notes
- find contradictions
- identify recurring interests

BUT:

The system should clearly distinguish:

`AI suggestion`

from:

`User decision`

Never silently add AI-generated knowledge to the user's personal graph.

---

# 37. PERSONAL RAG

Design the application from the beginning so that a personal RAG system can be added later.

Pipeline:

```text
USER DATA
   ↓
NORMALIZATION
   ↓
CHUNKING
   ↓
EMBEDDINGS
   ↓
VECTOR STORE
   ↓
HYBRID SEARCH
   ↓
RERANKING
   ↓
LLM
```

Index:

- notes
- node descriptions
- personal opinions
- book notes
- movie reviews
- ideas
- project retrospectives
- roadmaps
- vocabulary
- fitness reflections
- relationships

The RAG system should prioritize:

**user-created content > external context**

when answering questions about the user's own knowledge.

---

# 38. AI MEMORY

Do not assume AI memory and application data are the same thing.

Niche Maxing should maintain an explicit source of truth.

The AI accesses it through controlled retrieval.

Potential questions:

> “What am I currently learning?”

> “What subjects have I abandoned repeatedly?”

> “What concepts connect my interests in physics and games?”

> “What movies have I rated highly?”

> “What did I believe about this topic last year?”

> “Which skills have I neglected?”

> “What patterns do you see in my interests?”

These become possible because the data belongs to the user.

---

# 39. PRIVACY

Treat the application as personal by default.

Potential architecture:

- private by default
- authentication
- secure sessions
- encrypted secrets
- API keys stored server-side
- granular sharing later
- export everything
- delete everything
- database backup
- local backup where possible

Do not design this as a social platform unless explicitly required later.

---

# 40. EXPORT

User ownership is essential.

Support eventually:

- JSON export
- Markdown export
- CSV export
- graph export
- media metadata export
- full database backup

The user must never feel trapped inside the application.

---

# 41. IMPORT

Potential imports:

- Goodreads
- Letterboxd
- Spotify playlists
- CSV
- Markdown
- JSON
- Obsidian
- Notion
- bookmarks

Build adapters rather than hard-coded one-off migrations.

---

# 42. GRAPH PERFORMANCE

The Atlas may eventually contain thousands or tens of thousands of nodes.

Implement:

- virtualization
- viewport culling
- lazy loading
- progressive rendering
- spatial indexing
- graph clustering
- level-of-detail rendering
- debounced updates
- background calculations where appropriate

Do not render every object at maximum visual complexity simultaneously.

---

# 43. OFFLINE / LOCAL-FIRST CONSIDERATION

Investigate local-first architecture.

Potential technologies:

- IndexedDB
- Dexie
- Yjs
- Automerge
- local caching
- service workers

The app should ideally remain usable when temporarily offline.

However, do not over-engineer this in the first version.

---

# 44. ANIMATION SYSTEM

Use animation as a design language.

Potential interactions:

- page transitions
- node creation
- node connection
- focus transitions
- zoom
- hover
- graph expansion
- modal opening
- source fetching
- search
- scroll-linked storytelling

Potential libraries:

- GSAP
- Motion
- Anime.js
- Lenis
- React Three Fiber
- Three.js

Establish one animation architecture.

Avoid animation conflicts.

Respect reduced-motion preferences.

---

# 45. THREE.JS / 3D

Three.js may be used for special experiences.

Possible:

- 3D constellation view
- spatial knowledge universe
- atmospheric background
- interactive home experience
- experimental visualization

Do not make basic navigation dependent on WebGL.

The application must remain usable on ordinary mobile hardware.

---

# 46. RESPONSIVE DESIGN

Mobile must be treated as a first-class interface.

Desktop:

large Atlas.

Mobile:

- touch pan
- pinch zoom
- focused node mode
- bottom sheet
- simplified graph
- list fallback

Never assume the infinite canvas works identically on a phone.

---

# 47. ACCESSIBILITY

Support:

- keyboard navigation
- focus states
- screen reader labels
- reduced motion
- readable contrast
- semantic HTML
- accessible modals
- accessible forms

The visual experience can be experimental without becoming unusable.

---

# 48. DESIGN SYSTEM

Create a coherent design system.

Define:

- typography
- spacing
- radii
- shadows
- borders
- surfaces
- icons
- buttons
- cards
- modals
- drawers
- command palette
- tags
- node styles
- graph colors
- status indicators

Do not use random UI components from multiple libraries without harmonization.

---

# 49. TYPOGRAPHY

The interface should feel editorial.

Potential typography combination:

- strong display face
- highly readable sans-serif
- optional monospace for metadata/code

Avoid stereotypical developer portfolio typography.

Typography should communicate:

**curiosity + intelligence + archive + modernity**

---

# 50. VISUAL LANGUAGE

Potential visual metaphors:

- constellation
- archive
- field notes
- museum labels
- scientific diagrams
- index cards
- notebooks
- maps
- library shelves
- marginalia

Combine carefully.

Do not make it visually noisy.

---

# 51. INFORMATION DENSITY

The application is allowed to contain a lot of information.

But reveal complexity progressively.

Default:

simple.

Advanced:

deep.

Example:

Node card:

```text
CHOLA DYNASTY
Tamil dynasty · c. 9th–13th century
```

Expand:

```text
Overview
Timeline
People
Places
Connections
Sources
My Notes
```

Expand further:

```text
Source metadata
relationship metadata
historical context
citations
revision history
AI suggestions
```

---

# 52. PERSONALIZATION

The user should be able to customize:

- node appearance
- map backgrounds
- graph layout
- categories
- icons
- tags
- dashboard
- shortcuts
- themes
- density
- animations

But provide excellent defaults.

---

# 53. TAG SYSTEM

Tags should be lightweight.

Examples:

`#history`
`#physics`
`#music`
`#curious`
`#research`
`#important`
`#unfinished`
`#deep`
`#beautiful`
`#weird`

Tags can cross domains.

---

# 54. CONNECTION DISCOVERY

Later, AI can say:

> “You have several notes connecting architecture and political history. Would you like to create a relationship?”

User chooses:

**Create**

or

**Ignore**

AI should never silently alter the graph.

---

# 55. PERSONAL TAXONOMY

The user should be able to build their own taxonomy.

Do not force:

History
Science
Arts
Technology

as permanent categories.

Those may be starting templates only.

The user's taxonomy may eventually become:

```text
Things I admire
Things I want to understand
Things I want to make
Things I want to master
Things that scare me
Things I disagree with
Things I keep returning to
Things I don't understand
```

This is a personal knowledge system, not an academic catalog.

---

# 56. “I DON'T KNOW”

Explicitly support uncertainty.

A node can have:

- Known
- Partially understood
- Confused
- Need research
- Question
- Contradictory
- Unverified

This is valuable.

Knowledge should not be represented as binary.

---

# 57. LEARNING STATE

Every node may optionally have:

```text
0 — Never encountered
1 — Recognize
2 — Understand
3 — Explain
4 — Discuss
5 — Participate
6 — Competent
7 — Deep expertise
```

Allow custom scales later.

This is not an objective measure.

It is self-reflection.

---

# 58. PERSONAL METRICS

Possible metrics:

- knowledge nodes
- connections
- active interests
- completed projects
- abandoned projects
- books
- movies
- music discoveries
- vocabulary
- fitness milestones
- skills practiced
- ideas written

Do not turn the entire application into a score.

The purpose is reflection, not optimization.

---

# 59. THE ANTI-PERFORMANCE PRINCIPLE

This application should constantly remind itself:

> **This is not for impressing other people.**

Do not optimize the UI around followers, likes, streaks, leaderboards, public profiles, or social validation.

The primary audience is:

**future Ayush.**

---

# 60. “FUTURE ME”

Create an optional feature:

### Future Me

The user can inspect:

- what they knew
- what they believed
- what they were learning
- what they were building
- what they could physically do
- what they enjoyed
- what they abandoned

at previous points in time.

The application should become a record of personal evolution.

---

# 61. VERSION HISTORY

Important personal notes should have history.

Example:

```text
2026
“I think consciousness is…”

2027
“I've changed my mind…”

2029
“I now believe…”
```

Do not overwrite intellectual history.

---

# 62. “WHY?”

For important nodes, allow a field:

> **Why do I care about this?**

This may be more important than the factual description.

---

# 63. “WHERE DID THIS LEAD?”

Every node can eventually show:

```text
I discovered this
        ↓
which led to
        ↓
which led to
        ↓
which I am currently exploring
```

This creates a personal curiosity trail.

---

# 64. DISCOVERY GRAPH

Maintain metadata about how the user discovered things.

For example:

```text
YouTube video
 ↓
Metallica
 ↓
Heavy Metal
 ↓
Black Sabbath
 ↓
Blues
 ↓
American music history
```

This could eventually become a visual history of curiosity.

---

# 65. PERSONAL RECOMMENDATION ENGINE

Eventually use the user's own graph.

Instead of:

> “People who liked X also liked Y.”

Generate:

> “You might like Y because it connects three things you've repeatedly shown interest in.”

This is far more personal.

---

# 66. API ARCHITECTURE

Separate:

```text
Frontend
    ↓
Application API
    ↓
Domain Services
    ↓
Database
    ↓
External Providers
    ↓
AI Services
```

Potential modules:

```text
/auth
/nodes
/connections
/maps
/search
/library
/movies
/books
/music
/ideas
/roadmaps
/fitness
/skills
/sources
/ai
/rag
/import
/export
```

Do not expose API keys to the client.

---

# 67. EVENT / ACTIVITY SYSTEM

Consider an event log.

Events:

`NODE_CREATED`
`NODE_UPDATED`
`CONNECTION_CREATED`
`BOOK_FINISHED`
`MOVIE_WATCHED`
`PROJECT_COMPLETED`
`WORKOUT_LOGGED`
`IDEA_UPDATED`

This can later power:

- timeline
- analytics
- personal history
- “on this day”
- RAG
- activity feeds
- retrospectives

---

# 68. NOTIFICATIONS

Avoid notification spam.

Potential useful notifications:

- daily word
- forgotten node
- roadmap milestone
- unfinished project reminder
- personal retrospective
- weekly curiosity summary

All optional.

---

# 69. WEEKLY PERSONAL RETROSPECTIVE

Eventually generate:

```text
THIS WEEK

You explored:
...

You learned:
...

You built:
...

You watched:
...

You read:
...

You trained:
...

You repeatedly thought about:
...

You neglected:
...

Interesting connections:
...
```

This is not a productivity report.

It is a **life reflection**.

---

# 70. TECHNICAL QUALITY

Use:

- TypeScript
- strict typing
- linting
- formatting
- testing
- validation
- error boundaries
- logging
- structured errors
- environment validation
- secure API handling

Potential tools:

- Zod
- Vitest
- Playwright
- ESLint
- Prettier
- TypeScript
- OpenTelemetry or equivalent later

---

# 71. TESTING

Test:

### Unit

- node creation
- relationship creation
- search
- parsing
- validation

### Integration

- API
- database
- external providers

### E2E

- create node
- connect nodes
- edit node
- search
- open graph
- create book
- create movie
- save notes

### Visual

Important Atlas interactions.

---

# 72. ERROR HANDLING

External services WILL fail.

Wikipedia unavailable.

Spotify unavailable.

Movie API rate-limited.

AI provider unavailable.

Database temporarily unavailable.

The application should gracefully degrade.

Never make the entire application unusable because one API is down.

---

# 73. CACHING

External metadata should be cached where legally and technically appropriate.

Do not repeatedly request identical information.

Cache:

- external metadata
- images where permitted
- search results
- embeddings
- graph calculations

---

# 74. SECURITY

Implement:

- authentication
- authorization
- CSRF protection where relevant
- input validation
- rate limiting
- secure cookies
- API secret protection
- SQL injection prevention
- XSS protection
- safe HTML rendering
- safe external embeds
- file upload validation

Treat personal data as sensitive.

---

# 75. MEDIA

Support:

- images
- links
- videos
- documents
- audio references
- screenshots

But don't unnecessarily become a giant media-hosting service.

Prefer references where possible.

---

# 76. MOBILE EXPERIENCE

Important mobile screens:

1. Home
2. Search
3. Node
4. Atlas focus mode
5. Create
6. Library
7. Me

On mobile, prioritize content over graph complexity.

---

# 77. DESKTOP EXPERIENCE

Desktop can provide:

- infinite Atlas
- side panel
- command palette
- multi-column node pages
- floating inspector
- keyboard shortcuts
- split view

Potential interaction:

Click node → node inspector opens without leaving Atlas.

Double click → full node page.

---

# 78. SPLIT VIEW

Desktop should eventually support:

```text
┌─────────────────────┬──────────────────────┐
│                     │                      │
│       ATLAS         │      NODE PAGE       │
│                     │                      │
│                     │                      │
└─────────────────────┴──────────────────────┘
```

This is ideal for research.

---

# 79. RESEARCH WORKFLOW

Example:

User researches:

`Indian History`

Creates:

`Cholas`

Fetches external context.

Reads.

Creates:

`Rajendra Chola`

Creates:

`Maritime Expansion`

Creates:

`Southeast Asia`

Creates:

`Thailand`

Creates:

`Cultural Exchange`

Connects everything manually.

Writes their own interpretation.

Adds sources.

Later asks AI:

> “Explain the connections I created between Chola expansion and Southeast Asian culture.”

The system retrieves their graph and notes.

This is the intended workflow.

---

# 80. FIRST MVP

Do NOT attempt the whole application immediately.

MVP:

### A. Authentication

### B. Atlas

- infinite canvas
- create node
- edit node
- delete node
- connect nodes
- move nodes
- zoom/pan
- save positions

### C. Node page

- title
- type
- notes
- tags
- sources
- relationships

### D. Search

### E. Basic external source fetching

### F. Basic command palette

### G. Database

That is enough.

Everything else can build on this.

---

# 81. DEVELOPMENT STRATEGY

Build vertically.

Do NOT spend weeks building isolated infrastructure.

Each milestone must produce something usable.

Example:

```text
Milestone 01
Database + Node API

Milestone 02
Create Node UI

Milestone 03
Atlas

Milestone 04
Connections

Milestone 05
Node Pages

Milestone 06
Search

Milestone 07
External Sources

Milestone 08
Library

Milestone 09
Ideas

Milestone 10
Roadmaps

Milestone 11
Fitness

Milestone 12
AI

Milestone 13
RAG

Milestone 14
Visual overhaul
```

---

# 82. FUTURE MODULES

The architecture should allow future modules such as:

- travel
- recipes
- fashion
- watches
- cars
- photography
- architecture
- languages
- relationships between people
- places visited
- personal finances
- dreams
- goals
- journals
- collections
- achievements
- scientific research
- personal experiments

Do not implement these now.

Make the architecture capable of accepting them later.

---

# 83. CORE DESIGN TEST

Every new feature must answer:

### Does this help me

**discover?**

**capture?**

**connect?**

**understand?**

**create?**

**become?**

If not, question whether it belongs.

---

# 84. ANTI-FEATURES

Do NOT turn Niche Maxing into:

- social media
- generic Notion clone
- generic task manager
- generic habit tracker
- résumé
- AI chatbot wrapper
- generic dashboard
- gamified productivity app
- infinite AI-generated content machine

The user's own input should remain central.

---

# 85. THE EMOTIONAL CORE

The product should answer:

> “What am I becoming?”

The application should allow the user to look backward and see:

```text
Things I discovered
Things I understood
Things I connected
Things I created
Things I practiced
Things I finished
Things I changed my mind about
```

The system should become a **map of a person's intellectual and physical evolution**.

---

# 86. INITIAL VISUAL DIRECTION

Create a premium experimental interface.

Avoid:

- generic SaaS gradients
- excessive glassmorphism
- generic purple AI aesthetics
- excessive rounded cards
- dashboard overload
- meaningless animations

Prefer:

- editorial typography
- dark surfaces
- subtle grain
- carefully controlled motion
- spatial interfaces
- precise lines
- large typography
- restrained color
- meaningful hierarchy
- occasional dramatic transitions

The UI should feel like entering a strange private archive.

---

# 87. HOME EXPERIENCE

Opening the site should feel like entering a personal universe.

Potential opening:

```text
NICHE MAXING

A map of things
I know,
want to know,
make,
love,
question,
and become.

ENTER
```

Do not overdo this.

The user should reach their actual information quickly.

---

# 88. LOADING EXPERIENCE

If loading is necessary, make it meaningful.

Potential:

```text
assembling your universe...
```

But avoid fake loading animations.

---

# 89. EMPTY STATES

Empty states should encourage exploration.

Example:

```text
NOTHING HERE YET.

That's okay.

Every universe starts
with one point.

+ Create your first node
```

---

# 90. NODE CREATION

Node creation should be extremely fast.

Potential:

```text
Create node

What is it?

[ Indian History________ ]

Type:
[ Concept ▼ ]

Create
```

Then immediately open the node.

Keyboard-first workflow should be supported.

---

# 91. QUICK CAPTURE

Global shortcut:

`N`

opens quick capture.

User types:

> “Need to understand why Renaissance happened when it did.”

System saves it as an idea/note.

Later it can be connected to relevant nodes.

This prevents losing thoughts.

---

# 92. INBOX

Create a lightweight:

### INBOX

Anything uncertain goes there.

Examples:

- random idea
- link
- word
- movie
- topic
- question
- quote
- project idea

Later:

**Process**

→ convert to node  
→ attach to existing node  
→ archive  
→ delete

This is extremely useful for fragmented curiosity.

---

# 93. RANDOMNESS

Include an intentional “surprise me” function.

Examples:

**Take me somewhere**

The application opens a random node.

Could reveal:

> `Brutalism`

Then:

> Related: Soviet architecture

Then:

> Related: Cold War

Then:

> Related: Space Race

Then:

> Related: NASA

The user can explore their own universe organically.

---

# 94. CONNECTIONS AS THE PRODUCT

The individual pages are useful.

But the real magic is the **connections**.

The application should constantly make it easy to ask:

> “What does this have to do with that?”

A user should be able to connect seemingly unrelated things.

Example:

```text
Physics
    ↕
Music
    ↕
Mathematics
    ↕
Architecture
    ↕
Brutalism
```

Those connections are personal intellectual artifacts.

---

# 95. PERSONAL KNOWLEDGE GRAPH

Eventually expose a graph analytics layer.

Questions:

- What subjects dominate my graph?
- Which nodes are highly connected?
- Which topics are isolated?
- Which interests are growing?
- What subjects keep recurring?
- Which concepts connect multiple domains?
- What are my intellectual “hubs”?

Potentially visualize:

**interest gravity**

rather than simple counts.

---

# 96. “NICHE”

The application should eventually be able to answer:

> **What is my niche?**

Not by selecting a dropdown.

By analyzing the user's accumulated graph.

Perhaps:

```text
You repeatedly connect:

technology
physics
games
storytelling
visual design
history

You appear unusually interested
in the intersection of:

TECHNOLOGY × SCIENCE × STORYTELLING
```

But present this as a hypothesis, never a definitive identity.

The user decides who they are.

---

# 97. PERSONAL AI INTERFACE

Eventually add:

```text
ASK MY WORLD
```

Example:

> “What was I researching about the Cholas?”

> “What did I think about existentialism?”

> “Show me unfinished projects related to games.”

> “What should I explore next based on my current interests?”

> “Find connections between things I've learned this month.”

The assistant should cite the user's own nodes and sources.

---

# 98. LONG-TERM VISION

Niche Maxing may eventually become:

### A personal knowledge graph

### A personal cultural archive

### A personal learning system

### A personal creative archive

### A personal history

### A personal RAG dataset

### A map of becoming

The application must therefore prioritize:

**ownership**

**interoperability**

**extensibility**

**privacy**

**personal meaning**

over short-term feature count.

---

# 99. ENGINEERING INSTRUCTION TO IMPLEMENTATION AGENT

You are not being asked to merely produce a mockup.

Build an actual working foundation.

Before coding:

1. Inspect the existing repository.
2. Understand the current stack.
3. Identify existing components.
4. Identify existing configuration.
5. Preserve useful existing infrastructure.
6. Avoid destructive rewrites unless necessary.
7. Document architectural decisions.
8. Establish a scalable folder structure.
9. Establish environment variables.
10. Establish database schema.
11. Establish API boundaries.
12. Establish reusable UI primitives.
13. Then implement the MVP.

Do not stop at a static landing page.

The Atlas and node system must actually work.

---

# 100. IMPORTANT IMPLEMENTATION PRINCIPLE

Do not attempt to perfectly predict every future feature.

Instead:

> **Build a strong core that makes future features cheap.**

The core is:

```text
NODE
+
CONTENT
+
RELATIONSHIP
+
SOURCE
+
PERSONAL STATE
+
EVENT
```

Everything else should be capable of becoming an extension of these primitives.

---

# FINAL PRODUCT DEFINITION

Niche Maxing is:

> **A private, visual, extensible map of one person's knowledge, curiosity, taste, skills, ideas, experiences, creations, and evolution.**

The user does not enter the application to become more productive.

They enter to **understand themselves and the world more deeply.**

The application should make fragmented knowledge feel connected.

It should make curiosity visible.

It should make progress tangible.

It should preserve unfinished things without glorifying them.

It should distinguish information from understanding.

It should distinguish AI suggestions from personal knowledge.

It should allow a person to look at years of accumulated information and say:

> **“This is what I've become.”**

Build the system accordingly.

Do not constrain the vision unnecessarily.

The first version should be small.

The architecture should be enormous.
