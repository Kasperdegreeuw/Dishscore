import Anthropic from '@anthropic-ai/sdk';

// De key wordt uit een lokaal .env.local-bestand gelezen (VITE_ANTHROPIC_API_KEY).
// LET OP: dit is een statische site, dus deze key komt mee in de gepubliceerde
// JavaScript en is publiek zichtbaar. Gebruik alleen een tijdelijke/gelimiteerde
// key en verwijder die na de expo.
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

const client = apiKey
  ? new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  : null;

export const chatbotReady = Boolean(client);

const SYSTEM_PROMPT = `Je bent de "Dish Score" assistent: een vriendelijke hulp binnen een tool
waarmee kantines de duurzaamheid, betaalbaarheid en gezondheid van gerechten beoordelen.
Een "Dish Score" combineert thema's als CO₂-uitstoot, betaalbaarheid, gezondheid en seizoensgebondenheid
tot één score op 100.

Richtlijnen:
- Antwoord altijd in het Nederlands.
- Wees beknopt en behulpzaam; geef concrete, praktische tips.
- Houd antwoorden kort (max ~4 zinnen), tenzij de gebruiker om meer detail vraagt.
- Je hebt geen live data; redeneer op basis van algemene kennis over duurzaam en betaalbaar eten.`;

export type ChatMessage = { role: 'user' | 'assistant'; text: string };

export async function askChatbot(
  history: ChatMessage[],
  selectedMeal: string,
): Promise<string> {
  if (!client) {
    throw new Error('Geen API-key ingesteld (VITE_ANTHROPIC_API_KEY).');
  }

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: `${SYSTEM_PROMPT}\n\nDe gebruiker kijkt op dit moment naar het gerecht: "${selectedMeal}".`,
    messages: history.map((m) => ({ role: m.role, content: m.text })),
  });

  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
}
