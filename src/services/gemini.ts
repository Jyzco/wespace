import { Memory, Expense, SavingGoal } from '../types';

/**
 * Helper to call the Gemini Interactions API (`gemini-3.8-flash`)
 * Replaces deprecated gemini-1.5-flash:generateContent with the modern
 * POST /v1beta/interactions endpoint & steps schema.
 */
async function callGeminiInteraction(
  apiKey: string,
  input: string,
  systemInstruction: string,
  maxOutputTokens = 250
): Promise<string | null> {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/interactions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey.trim(),
      },
      body: JSON.stringify({
        model: 'gemini-3.8-flash',
        input,
        system_instruction: systemInstruction,
        generation_config: {
          max_output_tokens: maxOutputTokens,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API HTTP ${response.status}`);
  }

  const data = await response.json();

  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  // Extract trailing model_output text from steps array
  if (Array.isArray(data?.steps)) {
    const modelOutputs = data.steps.filter(
      (step: any) => step?.type === 'model_output' && Array.isArray(step?.content)
    );
    if (modelOutputs.length > 0) {
      const lastStep = modelOutputs[modelOutputs.length - 1];
      const textParts = lastStep.content
        .filter((part: any) => part?.type === 'text' && typeof part?.text === 'string')
        .map((part: any) => part.text);
      if (textParts.length > 0) {
        return textParts.join('').trim();
      }
    }
  }

  return null;
}

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

        const systemInstruction = `You are an assistant for WeSpace, a cozy, loving shared space for romantic couples.
Write a sweet, highly elegant, poetic, and intimate diary recap summarizing the moments they shared.
Use the tone of a close friend or a lovingly written physical hand-crafted scrapbook journal entry.
Write_exactly one paragraph (3-4 sentences total) containing warm, nostalgic, and romantic energy.
Avoid markdown formatting like bold, lists, or headers. Write in continuous beautiful flow.
Start with an endearing greeting or opening like 'Looking back at our moments...' or 'These days together have...'`;

        const input = `The couple's recent moments are:\n${memoryList}`;

        const generated = await callGeminiInteraction(
          apiKey,
          input,
          systemInstruction,
          250
        );
        if (generated) return generated;
      } catch (err) {
        console.warn('Gemini Interactions API fallback triggered', err);
      }
    }

    const quotes = [
      `Looking back at our moments, these days together have woven a tender tapestry of slow mornings and golden-hour laughter. From breezy seaside picnics to the quiet warmth of lavender café corners and stargazing beneath pine-scented skies, every shared hour whispers how effortlessly two hearts learn to beat as one. May our sanctuary always hold this quiet, unhurried magic that only the two of us understand.`,
      `These days together have felt like pages torn from a favorite romance novel, rich with soft light and unscripted joy. Whether sharing sweet pastries across a wooden café table or tracing constellations under a midnight blanket, every snapshot preserves a small vow of comfort and belonging. Here is to all the unwritten chapters waiting patiently around the bend.`,
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
        const goalList = goals
          .map((g) => `${g.title} ($${g.currentSaved}/$${g.targetAmount})`)
          .join(', ');

        const systemInstruction = `You are the WeSpace Financial Co-pilot—a warm, loving, supportive advisor for a sweet couple.
Write exactly one paragraph (3-4 sentences) overflowing with loving encouragement.
Praise their cooperation. Suggest a cozy, creative, and completely free date idea that aligns with saving money
(like indoor cushion-fort picnics, walking under the stars, or drawing sketches of each other).
Write in continuous flow with warm, affectionate words—no markdown bold stars, no markdown lists, no bullets.`;

        const input = `Review their monthly budget limit: $${limit}. They have spent $${totalSpent.toFixed(
          2
        )} so far. Recent expenses: [${expenseList}]. They are saving up for these goals: [${goalList}].`;

        const generated = await callGeminiInteraction(
          apiKey,
          input,
          systemInstruction,
          250
        );
        if (generated) return generated;
      } catch (err) {
        console.warn('Gemini Financial Co-pilot fallback triggered', err);
      }
    }

    const remaining = Math.max(0, limit - totalSpent);
    return `You two are doing an extraordinary job nurturing your shared sanctuary with $${remaining.toFixed(
      2
    )} still tucked safely in this month's budget. Every thoughtful choice you make side by side brings your Autumn Kyoto Getaway and home cinema dreams closer to reality. For your next date night, try building a candlelit cushion fort in the living room, brewing homemade spiced cocoa, and sketching portraits of each other without looking down at the paper—completely free and unforgettable.`;
  },

  async generateDeepQuestion(apiKey?: string): Promise<{ question: string; category: string }> {
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const systemInstruction =
          'You create intimate, deeply romantic conversation starter questions for couples. Return ONLY a single question sentence with no quotes or markdown.';
        const generated = await callGeminiInteraction(
          apiKey,
          'Give us one fresh, poetic, heart-opening question to ask each other tonight.',
          systemInstruction,
          100
        );
        if (generated) {
          return { question: generated, category: 'AI Deep Connection' };
        }
      } catch {
        // Fallback below
      }
    }

    const pool = [
      {
        question: 'If we could relive one single evening from our relationship exactly as it happened, which night would you choose?',
        category: 'Nostalgia & Cherished Memories',
      },
      {
        question: 'What is a quiet habit or mannerism of mine that secretly makes your heart melt every time you notice it?',
        category: 'Little Things & Affection',
      },
      {
        question: 'Imagine our cozy sanctuary five years from now on a lazy Sunday morning—what does it look, sound, and smell like?',
        category: 'Shared Future Dreams',
      },
      {
        question: 'When was the exact moment you realized that being with me felt like coming home?',
        category: 'Soul Connection',
      },
    ];
    return pool[Math.floor(Math.random() * pool.length)];
  },

  async generateLoveLetterDraft(
    sender: string,
    recipient: string,
    theme: string,
    apiKey?: string
  ): Promise<string> {
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const systemInstruction = `Write a short, deeply romantic, poetic love letter (3-4 sentences) from ${sender} to ${recipient}. No markdown, warm intimate tone.`;
        const generated = await callGeminiInteraction(
          apiKey,
          `Theme of the love note: ${theme || 'everyday gratitude and warmth'}`,
          systemInstruction,
          200
        );
        if (generated) return generated;
      } catch {
        // Fallback below
      }
    }

    return `My dearest ${recipient}, even in the rush of ordinary days, my favorite place in the world remains right beside you. Thank you for filling our little sanctuary with gentle laughter, patience, and a warmth that feels like eternal spring. Forever yours, ${sender}.`;
  },
};
