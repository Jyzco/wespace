import { Memory, Expense, SavingGoal } from '../types';

export const geminiService = {
  async generateScrapbookDigest(
    memories: Memory[],
    apiKey?: string
  ): Promise<string> {
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const memoryList = memories
          .map(
            (m, i) =>
              `${i + 1}. Title: "${m.title}" | Caption: "${m.caption}" | Shared by: "${m.author}"`
          )
          .join('\n');

        const prompt = `You are an assistant for WeSpace, a cozy, loving shared space for romantic couples.
Write a sweet, highly elegant, poetic, and intimate diary recap summarizing the following moments they shared.
Use the tone of a close friend or a lovingly written physical hand-crafted scrapbook journal entry.
Write exactly one paragraph (3-4 sentences total) containing warm, nostalgic, and romantic energy.
Avoid markdown formatting like bold, lists, or headers. Write in continuous beautiful flow.
Start with an endearing greeting or opening like 'Looking back at our moments...' or 'These days together have...'
The couple's recent moments are:
${memoryList}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 250,
              },
            }),
          }
        );

        const data = await response.json();
        const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generated) return generated.trim();
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local digest', err);
      }
    }

    // Offline poetic fallback
    const quotes = [
      `These days together have woven a tender tapestry of slow mornings and sweet laughter. From breezy seaside strolls to the quiet aroma of lavender café afternoons, every shared hour whispers how effortlessly two hearts learn to beat as one. May your scrapbook continue to hold the quiet magic that only the two of you understand.`,
      `Looking back at our moments, it is the small, unscripted glances that remain golden in memory. Whether sipping warm drinks together or whispering dreams under open skies, every photograph is a quiet vow of comfort and belonging. Here is to all the unwritten adventures waiting just around the bend.`,
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  },

  async generateFinancialAdvice(
    limit: number,
    totalSpent: number,
    expenses: Expense[],
    goals: SavingGoal[],
    apiKey?: string
  ): Promise<string> {
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const expenseList = expenses
          .slice(0, 5)
          .map((e) => `${e.title}: $${e.amount} (by ${e.paidBy})`)
          .join(', ');
        const goalList = goals.map((g) => `${g.title} ($${g.currentSaved}/$${g.targetAmount})`).join(', ');

        const prompt = `You are the WeSpace Financial Co-pilot—a warm, loving, supportive advisor for a sweet couple.
Review their monthly budget limit: $${limit}.
They have spent $${totalSpent.toFixed(2)} so far. Recent expenses: [${expenseList}].
They are saving up for these goals: [${goalList}].
Write exactly one paragraph (3-4 sentences) overflowing with loving encouragement.
Praise their cooperation. Suggest a cozy, creative, and completely free date idea that aligns with saving money
(like indoor cushion-fort picnics, walking under the stars, or drawing sketches of each other).
Write in continuous flow with warm, affectionate words—no markdown bold stars, no markdown lists, no bullets.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 250,
              },
            }),
          }
        );

        const data = await response.json();
        const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generated) return generated.trim();
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local advisor', err);
      }
    }

    // Offline co-pilot fallback
    const remaining = Math.max(0, limit - totalSpent);
    return `You two are doing an extraordinary job navigating your sanctuary finances together with $${remaining.toFixed(2)} remaining this month. Every mindful choice you make today brings your shared dreams, like that unforgettable dream trip, closer into reach. For your next date, try building a candlelit cushion fort in the living room, brewing homemade hot cocoa, and reading funny childhood memories to one another without spending a dime.`;
  },
};
