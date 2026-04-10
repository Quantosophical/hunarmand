export const translationMockDb: Record<string, string> = {
  "hello": "Aadab / Salaam",
  "beautiful work": "Khoobsurat kaam",
  "how long will this take to make?": "Isay bananay mein kitna waqt lagega?",
  "can you make it in blue?": "Kya aap isay neelay rang mein bana sakte hain?",
  "thank you": "Shukriya",
  "yes": "Haan",
  "no": "Nahi",
  "it will take 2 weeks": "Isme do hafte lagenge",
  "i will ship it tomorrow": "Main isay kal bhej dunga"
};

export function performSemanticTranslation(text: string): string {
  const lowerQuery = text.toLowerCase().trim();
  for (const key of Object.keys(translationMockDb)) {
    if (lowerQuery.includes(key)) {
      return translationMockDb[key];
    }
  }
  return `[Translated]: ${text}`;
}
