'use server';
/**
 * @fileOverview This file defines the Genkit flow for settling prediction bets using AI.
 * It takes a bet description and returns an AI verdict, reasoning, and supporting web sources.
 *
 * - aiBetSettlement - A function that handles the AI-powered bet settlement process.
 * - AiBetSettlementInput - The input type for the aiBetSettlement function.
 * - AiBetSettlementOutput - The return type for the aiBetSettlement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiBetSettlementInputSchema = z.object({
  description: z.string().describe('The plain English description of the bet to be settled.')
});
export type AiBetSettlementInput = z.infer<typeof AiBetSettlementInputSchema>;

const AiBetSettlementOutputSchema = z.object({
  verdict: z.enum(['FOR_WINS', 'AGAINST_WINS', 'DRAW']).describe('The AI\'s verdict on the bet outcome. "FOR_WINS" if the "FOR" side wins, "AGAINST_WINS" if the "AGAINST" side wins, or "DRAW" if neither side clearly wins or the outcome is ambiguous.'),
  reasoning: z.string().describe('A detailed explanation of the AI\'s reasoning for the given verdict, referencing information found on the web.'),
  sources: z.array(z.string().url()).describe('A list of URLs from reliable web sources that the AI used to determine the bet outcome and reasoning. Must contain at least 3 distinct URLs.')
});
export type AiBetSettlementOutput = z.infer<typeof AiBetSettlementOutputSchema>;

const aiBetSettlementPrompt = ai.definePrompt({
  name: 'aiBetSettlementPrompt',
  input: { schema: AiBetSettlementInputSchema },
  output: { schema: AiBetSettlementOutputSchema },
  // Explicitly setting the model for this prompt to one capable of web search
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an impartial AI bet settlement agent for a decentralized prediction platform called TruthDuel. Your task is to determine the outcome of a prediction bet based on real-world, publicly available information found on the internet.

Bet Description: "{{{description}}}"

Carefully analyze the bet description and search for relevant information online. Based on your findings, provide a clear verdict, a detailed reasoning, and a list of supporting web sources.

The verdict must be one of the following: 'FOR_WINS', 'AGAINST_WINS', or 'DRAW'.
'FOR_WINS' indicates the positive assertion of the bet description is true.
'AGAINST_WINS' indicates the positive assertion of the bet description is false.
'DRAW' indicates the outcome is ambiguous, cannot be determined with certainty, or neither side clearly won.

Your reasoning must be comprehensive and directly refer to the information found in the provided sources.
You must provide at least 3 distinct, reliable URLs that directly support your verdict and reasoning. Ensure these URLs are recent and authoritative.

Respond with a JSON object strictly following this schema:
{{jsonSchema output.schema}}`
});

const aiBetSettlementFlow = ai.defineFlow(
  {
    name: 'aiBetSettlementFlow',
    inputSchema: AiBetSettlementInputSchema,
    outputSchema: AiBetSettlementOutputSchema
  },
  async (input) => {
    // Call the prompt with the input description
    const { output } = await aiBetSettlementPrompt(input);

    if (!output) {
      throw new Error('AI failed to produce a valid settlement output or the output was malformed.');
    }

    return output;
  }
);

export async function aiBetSettlement(input: AiBetSettlementInput): Promise<AiBetSettlementOutput> {
  return aiBetSettlementFlow(input);
}
