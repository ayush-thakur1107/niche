import { NodeItem, ConnectionItem, NodeContent, SourceItem, InboxItem, TimelineEvent } from './types';

export interface DatabaseSchema {
  nodes: NodeItem[];
  contents: NodeContent[];
  connections: ConnectionItem[];
  positions: Record<string, { x: number; y: number; pinned?: boolean; color?: string }>;
  sources: SourceItem[];
  inbox: InboxItem[];
  events: TimelineEvent[];
}

export function getSeedDatabase(): DatabaseSchema {
  const now = new Date().toISOString();

  const nodes: NodeItem[] = [
    {
      id: 'node-chola',
      slug: 'chola-dynasty',
      title: 'Chola Dynasty',
      type: 'EMPIRE',
      summary: 'Major Tamil thalassocracy dominating maritime trade and cultural influence across the Indian Ocean from the 9th to 13th century CE.',
      coverImage: 'https://images.unsplash.com/photo-1599818817637-29d91f26f224?w=800&auto=format&fit=crop&q=80',
      status: 'active_research',
      uncertaintyLevel: 'partially_understood',
      learningState: 3,
      whyCare: 'Fascinated by how their naval armada projected power and cultural trade across the Indian Ocean to Malacca, Sumatra, and Angkor.',
      curiosityTrail: 'Indian History → Ancient India → Maritime Trade → Cholas',
      tags: ['history', 'india', 'maritime', 'tamil', 'thalassocracy'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-rajendra',
      slug: 'rajendra-chola',
      title: 'Rajendra Chola I',
      type: 'PERSON',
      summary: 'Emperor who expanded the Chola kingdom northward to the Ganges and launched the trans-oceanic raid on Srivijaya in 1025 CE.',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      uncertaintyLevel: 'known',
      learningState: 4,
      whyCare: 'One of the few Indian rulers who commanded a massive blue-water navy overseas.',
      tags: ['history', 'military', 'ruler', 'chola'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-maritime',
      slug: 'maritime-expansion',
      title: 'Indian Ocean Maritime Expansion',
      type: 'CONCEPT',
      summary: 'The monsoon-driven navigation networks connecting the Coromandel coast, the Strait of Malacca, and Southeast Asian ports.',
      uncertaintyLevel: 'partially_understood',
      learningState: 3,
      whyCare: 'Shows how trade and cultural synthesis operated centuries before European arrival.',
      tags: ['trade', 'ocean', 'geography', 'asia'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-aryabhata',
      slug: 'aryabhata',
      title: 'Aryabhata',
      type: 'PERSON',
      summary: 'Pioneering mathematician-astronomer of the classical age of Indian mathematics and astronomy (476–550 CE).',
      coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
      uncertaintyLevel: 'known',
      learningState: 4,
      whyCare: 'Discovered that the Earth rotates on its axis and computed pi to 3.1416 in the 5th century.',
      tags: ['astronomy', 'mathematics', 'ancient-india', 'gupta'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-math',
      slug: 'mathematics',
      title: 'Mathematics',
      type: 'CONCEPT',
      summary: 'The formal language of pattern, deduction, calculus, geometry, and structures underlying physical reality.',
      uncertaintyLevel: 'known',
      learningState: 5,
      whyCare: 'The purest foundation of human intellectual discovery.',
      tags: ['science', 'logic', 'formal-system'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-astronomy',
      slug: 'astronomy',
      title: 'Astronomy & Celestial Navigation',
      type: 'CONCEPT',
      summary: 'Study of planetary motions, celestial coordinates, and their historical application in open-ocean navigation.',
      uncertaintyLevel: 'partially_understood',
      learningState: 3,
      whyCare: 'How ancient navigators read the stars to cross open seas without magnetic compasses.',
      tags: ['stars', 'navigation', 'physics'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-stranger',
      slug: 'the-stranger',
      title: 'The Stranger',
      type: 'BOOK',
      summary: '1942 philosophical novella by Albert Camus examining the detached Meursault and the arbitrary absurdity of human trials.',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
      uncertaintyLevel: 'known',
      learningState: 5,
      whyCare: 'Struck me deeply when I first read the sun-glare scene on the beach in Algiers.',
      tags: ['literature', 'camus', 'fiction', 'existentialism'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-sisyphus',
      slug: 'the-myth-of-sisyphus',
      title: 'The Myth of Sisyphus',
      type: 'BOOK',
      summary: '1942 philosophical essay by Albert Camus introducing the Absurd and the necessity of revolt without appeal.',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
      uncertaintyLevel: 'known',
      learningState: 5,
      whyCare: 'The definitive philosophical manifesto: creating meaning through unyielding defiance.',
      tags: ['philosophy', 'camus', 'absurdism', 'book', 'essay'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-meditations',
      slug: 'meditations',
      title: 'Meditations',
      type: 'BOOK',
      summary: 'Private personal reflections of Roman Emperor Marcus Aurelius on Stoic duty, transient existence, and self-command.',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
      uncertaintyLevel: 'known',
      learningState: 5,
      whyCare: 'Written by the most powerful ruler of his era purely to admonish himself against vanity.',
      tags: ['stoicism', 'philosophy', 'ancient-rome', 'book', 'journal'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-ficciones',
      slug: 'ficciones',
      title: 'Ficciones',
      type: 'BOOK',
      summary: 'Jorge Luis Borges’s labyrinthine tales exploring infinite libraries, conceptual encyclopedias, and forking paths of time.',
      coverImage: 'https://images.unsplash.com/photo-1507842229450-798835824c94?w=800&auto=format&fit=crop&q=80',
      uncertaintyLevel: 'known',
      learningState: 6,
      whyCare: 'The Library of Babel and Tlön, Uqbar, Orbis Tertius are the ultimate spiritual ancestors of Niche Maxing.',
      tags: ['literature', 'borges', 'labyrinths', 'book', 'short-stories'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-camus',
      slug: 'albert-camus',
      title: 'Albert Camus',
      type: 'PERSON',
      summary: 'French-Algerian philosopher and Nobel laureate who formulated the philosophy of the Absurd and heroic revolt.',
      coverImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
      uncertaintyLevel: 'known',
      learningState: 5,
      whyCare: 'His refusal of intellectual despair and insistence on passionate lucidity resonates with me.',
      tags: ['philosophy', 'author', 'algiers'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-absurdism',
      slug: 'absurdism',
      title: 'Absurdism',
      type: 'PHILOSOPHY',
      summary: 'The irreconcilable tension between the human drive to find inherent purpose and the cold indifference of the cosmos.',
      uncertaintyLevel: 'known',
      learningState: 5,
      whyCare: 'Teaches that one must imagine Sisyphus happy—creating our own meaning through defiance.',
      tags: ['philosophy', 'meaning', 'existential'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-tailoring',
      slug: 'bespoke-tailoring',
      title: 'Bespoke Tailoring & Posture Balance',
      type: 'CRAFT',
      summary: 'The subtle craft of cutting wool cloth, pad-stitching floating canvas chests, and balancing garments to human posture.',
      coverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
      culturalFluency: 'understand',
      uncertaintyLevel: 'partially_understood',
      learningState: 3,
      whyCare: 'Appreciating the invisible architecture of handmade garments and drape.',
      tags: ['craft', 'clothing', 'sartorial', 'fabrics'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-brutalism',
      slug: 'brutalism',
      title: 'Brutalist Architecture',
      type: 'ARCHITECTURE',
      summary: 'Architectural aesthetic celebrating unadorned concrete (béton brut), geometric gravity, and uncompromised civic permanence.',
      coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
      culturalFluency: 'discuss',
      uncertaintyLevel: 'known',
      learningState: 4,
      whyCare: 'The uncompromising sculptural presence and tactile honesty of raw cast surfaces.',
      tags: ['architecture', 'concrete', 'modernism', 'monumental'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-hammer-curls',
      slug: 'hammer-curls',
      title: 'Hammer Curls Progression',
      type: 'SPORT',
      summary: 'Neutral-grip dumbbell curls targeting the brachialis and brachioradialis for forearm thickness.',
      uncertaintyLevel: 'known',
      learningState: 5,
      whyCare: 'Progression from 12.5 kg to 17.5 kg strict sets without body swing.',
      tags: ['fitness', 'lifting', 'strength', 'progression'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-muay-thai',
      slug: 'muay-thai',
      title: 'Muay Thai (Art of Eight Limbs)',
      type: 'SPORT',
      summary: 'Thai combat discipline combining heavy teep kicks, switch kicks, horizontal elbow slices, and plum clinches.',
      coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      uncertaintyLevel: 'known',
      learningState: 4,
      whyCare: 'Forces complete physical presence and teaches composure under pressure.',
      tags: ['martial-arts', 'striking', 'discipline'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-palimpsest',
      slug: 'palimpsest',
      title: 'Palimpsest',
      type: 'WORD',
      summary: 'Noun: A parchment or surface where earlier text has been scraped off to make room for new writing, but faint traces remain.',
      uncertaintyLevel: 'known',
      learningState: 6,
      whyCare: 'The perfect metaphor for human memory and the layered growth of mind.',
      tags: ['vocabulary', 'memory', 'metaphor', 'parchment'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-bladerunner',
      slug: 'blade-runner-2049',
      title: 'Blade Runner 2049',
      type: 'MOVIE',
      summary: 'Denis Villeneuve’s neo-noir sci-fi masterpiece exploring artificial consciousness, manufactured memories, and existential sacrifice.',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      uncertaintyLevel: 'known',
      learningState: 5,
      whyCare: 'Roger Deakins’s brutalist amber cinematography and K’s realization that he does not need to be the chosen one to make a moral choice.',
      tags: ['cinema', 'movie', 'sci-fi', 'villeneuve', 'noir'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'node-stalker',
      slug: 'stalker',
      title: 'Stalker (1979)',
      type: 'MOVIE',
      summary: 'Andrei Tarkovsky’s metaphysical pilgrimage through the hazardous landscape of the Zone towards the Room of Desires.',
      coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      uncertaintyLevel: 'known',
      learningState: 5,
      whyCare: 'The long, slow tracking shots through sepia industrial decay and the quiet realization of what human beings actually desire.',
      tags: ['cinema', 'movie', 'tarkovsky', 'soviet', 'metaphysics'],
      createdAt: now,
      updatedAt: now
    }
  ];

  const positions: Record<string, { x: number; y: number }> = {
    'node-chola': { x: -300, y: -150 },
    'node-rajendra': { x: -100, y: -260 },
    'node-maritime': { x: -80, y: -60 },
    'node-aryabhata': { x: -450, y: 120 },
    'node-math': { x: -220, y: 220 },
    'node-astronomy': { x: 100, y: 50 },
    'node-stranger': { x: 380, y: -180 },
    'node-camus': { x: 520, y: -60 },
    'node-absurdism': { x: 320, y: 20 },
    'node-tailoring': { x: -320, y: 400 },
    'node-brutalism': { x: 150, y: 320 },
    'node-hammer-curls': { x: -50, y: 420 },
    'node-muay-thai': { x: 420, y: 360 },
    'node-palimpsest': { x: 500, y: -300 },
    'node-bladerunner': { x: 260, y: -360 },
    'node-stalker': { x: 100, y: -450 },
    'node-sisyphus': { x: 420, y: -260 },
    'node-meditations': { x: 580, y: -200 },
    'node-ficciones': { x: 380, y: -450 }
  };

  const connections: ConnectionItem[] = [
    {
      id: 'conn-1',
      sourceNodeId: 'node-chola',
      targetNodeId: 'node-rajendra',
      relationshipType: 'caused',
      label: 'ruled by',
      description: 'Rajendra I elevated Chola naval power to its historical zenith.',
      direction: 'directed',
      strength: 5,
      createdAt: now
    },
    {
      id: 'conn-2',
      sourceNodeId: 'node-chola',
      targetNodeId: 'node-maritime',
      relationshipType: 'developed_from',
      label: 'projected across',
      description: 'Built overseas trading ports and diplomatic ties with Srivijaya and Song China.',
      direction: 'directed',
      strength: 4,
      createdAt: now
    },
    {
      id: 'conn-3',
      sourceNodeId: 'node-maritime',
      targetNodeId: 'node-astronomy',
      relationshipType: 'related_to',
      label: 'relied on',
      description: 'Navigating the Bay of Bengal and Andaman Sea required stellar declination knowledge.',
      direction: 'directed',
      strength: 4,
      createdAt: now
    },
    {
      id: 'conn-4',
      sourceNodeId: 'node-aryabhata',
      targetNodeId: 'node-math',
      relationshipType: 'developed_from',
      label: 'formulated',
      description: 'Aryabhatiya introduced astronomical sine tables and algebra.',
      direction: 'directed',
      strength: 5,
      createdAt: now
    },
    {
      id: 'conn-5',
      sourceNodeId: 'node-aryabhata',
      targetNodeId: 'node-astronomy',
      relationshipType: 'inspired',
      label: 'revolutionized',
      description: 'First to posit that planetary days are caused by the Earth rotating on its own axis.',
      direction: 'directed',
      strength: 5,
      createdAt: now
    },
    {
      id: 'conn-6',
      sourceNodeId: 'node-stranger',
      targetNodeId: 'node-camus',
      relationshipType: 'created_by',
      label: 'written by',
      description: 'Camus drafted the manuscript while in Paris and Oran.',
      direction: 'directed',
      strength: 5,
      createdAt: now
    },
    {
      id: 'conn-7',
      sourceNodeId: 'node-stranger',
      targetNodeId: 'node-absurdism',
      relationshipType: 'inspired',
      label: 'embodies',
      description: 'Meursault lives without false consolation in an indifferent universe.',
      direction: 'directed',
      strength: 5,
      createdAt: now
    },
    {
      id: 'conn-8',
      sourceNodeId: 'node-camus',
      targetNodeId: 'node-absurdism',
      relationshipType: 'caused',
      label: 'articulated',
      description: 'The Myth of Sisyphus formalized the philosophical stance of the Absurd.',
      direction: 'directed',
      strength: 5,
      createdAt: now
    },
    {
      id: 'conn-9',
      sourceNodeId: 'node-math',
      targetNodeId: 'node-astronomy',
      relationshipType: 'related_to',
      label: 'mathematical model of',
      description: 'Celestial orbits are geometric equations.',
      direction: 'undirected',
      strength: 4,
      createdAt: now
    },
    {
      id: 'conn-10',
      sourceNodeId: 'node-brutalism',
      targetNodeId: 'node-absurdism',
      relationshipType: 'connected_because',
      label: 'aesthetic affinity',
      description: 'Both reject decorative illusions; concrete reveals its true structural gravity.',
      direction: 'undirected',
      strength: 3,
      createdAt: now
    }
  ];

  const contents: NodeContent[] = [
    {
      id: 'cnt-chola-user',
      nodeId: 'node-chola',
      sectionType: 'USER_KNOWLEDGE',
      contentMarkdown: `### The Thanjavur Inscriptions & Naval Fleet
The Cholas developed an administrative machinery unmatched in medieval South Asia. Local governance was distributed through autonomous village councils (*Sabhas* and *Urs*), while the central crown controlled royal taxation, naval shipyards on the Kaveri delta, and standing regiments (*Velaikkarar*).

Their grandest architectural feat—the **Brihadisvara Temple**—features an 80-tonne monolithic granite cupola hoisted onto a 60-meter sanctum tower without mortar.`,
      version: 1,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'cnt-chola-op',
      nodeId: 'node-chola',
      sectionType: 'USER_OPINION',
      contentMarkdown: `Western historiography often treats trans-oceanic naval power as a purely post-Renaissance European phenomenon. The Chola naval campaign across 2,000 miles of stormy ocean in 1025 CE proves otherwise.`,
      version: 1,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'cnt-chola-q',
      nodeId: 'node-chola',
      sectionType: 'USER_QUESTION',
      contentMarkdown: `1. Exactly what timber and hull-fastening techniques were used in Chola sea vessels? Were they sewn planks or iron-riveted?
2. How did monsoon reversal wind windows (*Kachchan* and *Vaadai*) dictate military departure dates?`,
      version: 1,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'cnt-chola-ext',
      nodeId: 'node-chola',
      sectionType: 'EXTERNAL_CONTEXT',
      contentMarkdown: `The Chola dynasty was a Tamil thalassocracy of southern India, among the longest-ruling dynasties in world history. The earliest datable references to the Chola are in inscriptions from the 3rd century BCE left by Ashoka. Under Rajaraja I and his successors Rajendra I, Rajadhiraja I, Rajendra II, Virarajendra, and Kulothunga I, the dynasty became a military, economic and cultural power in South Asia and Southeast Asia.`,
      version: 1,
      createdAt: now,
      updatedAt: now
    }
  ];

  const inbox = [
    {
      id: 'inbox-1',
      content: 'Look into how Tamil merchants established the Manigramam and Ayyavole merchant guilds across Java.',
      category: 'research',
      status: 'pending' as const,
      createdAt: now
    },
    {
      id: 'inbox-2',
      content: 'Why does Le Corbusier’s Chandigarh feel so resonant when seen at dusk?',
      category: 'thought',
      status: 'pending' as const,
      createdAt: now
    }
  ];

  const events = [
    {
      id: 'ev-1',
      eventType: 'NODE_CREATED',
      entityType: 'NODE',
      entityId: 'node-chola',
      title: 'Discovered node: Chola Dynasty',
      description: 'Added new EMPIRE to universe.',
      createdAt: now
    },
    {
      id: 'ev-2',
      eventType: 'CONNECTION_CREATED',
      entityType: 'CONNECTION',
      entityId: 'conn-1',
      title: 'Connected: Chola Dynasty → Rajendra Chola I',
      description: 'Relationship: ruled by',
      createdAt: now
    },
    {
      id: 'ev-3',
      eventType: 'LEARNING_PROGRESSED',
      entityType: 'NODE',
      entityId: 'node-absurdism',
      title: 'Competence advanced in Absurdism',
      description: 'Learning state reached Level 5 (Can participate in deep debate).',
      createdAt: now
    }
  ];

  return {
    nodes,
    contents,
    connections,
    positions,
    sources: [
      {
        id: 'src-1',
        nodeId: 'node-chola',
        provider: 'Wikipedia',
        title: 'Chola dynasty - Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Chola_dynasty',
        summary: 'Overview of Tamil dynasty ruling southern India and maritime territories.',
        fetchedAt: now
      }
    ],
    inbox,
    events
  };
}
