export interface ResearchSource {
  id: string;
  title: string;
  author: string;
  year: string;
  takeaway: string;
  connection: string;
}

export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    id: 'williams_2024_love',
    title:
      'Parental expressions of love in Chinese American immigrant families: Implications for children’s attachment security',
    author:
      'Williams, A. I., Liu, C., Zhou, Q., Wu, J., Meng, L., Deng, X. F., & Chen, S. H.',
    year: '2024 (Developmental Science, 27(6), e13549)',
    takeaway:
      'In a study of 110 Chinese American immigrant parent–child dyads, three culturally-rooted styles emerged for how parents express love: training (guan / chiao shun — instructive care), relational affection (qin — the affirmation of the bond itself), and validation (acknowledging the child’s emotions and views). Lower-income and less-acculturated parents leaned on training and relational affection; higher-income, more-acculturated parents leaned on validation.',
    connection:
      'The mother NPC’s voice is built mostly out of training and relational affection. She communicates love by telling the daughter to eat, to sleep, to be careful — and by feeding her at all. The system prompt explicitly bans therapeutic and direct affirming language so the model cannot drift into the validation register that would be culturally out of frame for this character.',
  },
  {
    id: 'fuligni_pedersen_2002_obligation',
    title: 'Family obligation and the transition to young adulthood',
    author: 'Fuligni, A. J., & Pedersen, S.',
    year: '2002 (Developmental Psychology, 38(5), 856–868)',
    takeaway:
      'Adolescents from immigrant families carry a stronger and longer-lasting sense of obligation to support, assist, and respect their families than peers from non-immigrant homes — and that sense of obligation grows rather than fades across the transition into young adulthood, linked to both academic motivation and psychological well-being.',
    connection:
      'This is the engine behind the game’s pressure mechanic. The trigger events (grades, comparison to a cousin, the future) aren’t just dinner-table small talk — they are the surface of a much heavier debt the daughter has been carrying since childhood. The mother’s worry-stat in the state machine reflects that the same exchange feels like care to the parent and like weight to the child.',
  },
  {
    id: 'saw_okazaki_2010_suppression',
    title: 'Family emotion socialization and affective distress in Asian American and White American college students',
    author: 'Saw, A., & Okazaki, S.',
    year: '2010 (Asian American Journal of Psychology, 1(2), 81–92)',
    takeaway:
      'Asian American college students were far more likely than White American peers to recall being socialized in their families to suppress emotion, and to receive affection “instrumentally” — through financial support, food, and encouragement rather than verbal warmth. For Asian Americans, growing up in a suppression-valuing family was associated with greater current emotional distress.',
    connection:
      'This is the single biggest constraint on the dialogue prompt: the mother shows love through food, repeated questions, and small practical gestures — never “I love you,” never therapeutic vocabulary. It’s also why the soft-failure endings can feel quietly sad even when no one raises their voice: the cost of suppression is the distance the conversation can’t close.',
  },
];
