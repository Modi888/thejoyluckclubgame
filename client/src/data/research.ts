export interface ResearchSource {
  id: string;
  title: string;
  author: string;
  year: string;
  takeaway: string;
  connection: string;
}

// Placeholder entries — Eddie to replace with real sources for the assignment.
export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    id: 'intergenerational_comm',
    title: '[Placeholder] Intergenerational Communication in Chinese American Families',
    author: 'Placeholder, A.',
    year: '20XX',
    takeaway:
      'Communication between immigrant parents and their U.S.-raised children is often shaped by indirectness, nonverbal cues, and culturally different assumptions about how care is expressed.',
    connection:
      'This shapes how the mother NPC in the game expresses love through food, worry, and questions rather than explicit affection.',
  },
  {
    id: 'immigrant_pressure',
    title: '[Placeholder] Parental Expectations and Academic Pressure in Immigrant Families',
    author: 'Placeholder, B.',
    year: '20XX',
    takeaway:
      'Children of immigrants often carry the weight of their parents\' sacrifices as an implicit expectation around achievement and stability.',
    connection:
      'This drives the "pressure and expectations" theme and the pool of trigger events around school, future, and comparison.',
  },
  {
    id: 'indirect_expression',
    title: '[Placeholder] Indirect Expression of Emotion in East Asian Families',
    author: 'Placeholder, C.',
    year: '20XX',
    takeaway:
      'Affection, concern, and disappointment in East Asian family contexts are frequently expressed through subtext — food offered, questions repeated, silences held — rather than through direct statements.',
    connection:
      'This informs the prompt engineering that restricts the mother character from giving speech-like or therapeutic replies.',
  },
];
