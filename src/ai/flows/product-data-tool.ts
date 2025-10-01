'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing product descriptions and suggesting improvements.
 *
 * The flow uses an LLM to provide suggestions for improving clarity and removing redundant terms from product descriptions.
 * This helps ensure product descriptions are concise and effective.
 *
 * @fileOverview A product description AI agent.
 *
 * - analyzeProductDescription - A function that handles the product description analysis process.
 * - AnalyzeProductDescriptionInput - The input type for the analyzeProductDescription function.
 * - AnalyzeProductDescriptionOutput - The return type for the analyzeProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProductDescriptionInputSchema = z.object({
  description: z
    .string()
    .describe('The product description to analyze and improve.'),
});
export type AnalyzeProductDescriptionInput = z.infer<
  typeof AnalyzeProductDescriptionInputSchema
>;

const AnalyzeProductDescriptionOutputSchema = z.object({
  improvedDescription: z
    .string()
    .describe(
      'The improved product description with enhanced clarity and conciseness.'
    ),
});
export type AnalyzeProductDescriptionOutput = z.infer<
  typeof AnalyzeProductDescriptionOutputSchema
>;

export async function analyzeProductDescription(
  input: AnalyzeProductDescriptionInput
): Promise<AnalyzeProductDescriptionOutput> {
  return analyzeProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProductDescriptionPrompt',
  input: {schema: AnalyzeProductDescriptionInputSchema},
  output: {schema: AnalyzeProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in writing effective product descriptions.  Your goal is to improve the clarity and conciseness of a provided product description.

  Analyze the following product description and provide an improved version, removing any redundant terms and enhancing overall clarity. Return only the improved description.

  Original Description: {{{description}}}`,
});

const analyzeProductDescriptionFlow = ai.defineFlow(
  {
    name: 'analyzeProductDescriptionFlow',
    inputSchema: AnalyzeProductDescriptionInputSchema,
    outputSchema: AnalyzeProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
