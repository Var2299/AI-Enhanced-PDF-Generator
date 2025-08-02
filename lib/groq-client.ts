import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});
export async function enhanceDescription(description: string, position: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a technical documentation specialist. Perform IN-PLACE ENHANCEMENT of the candidate's description. Preserve ALL technical terms, tools, and responsibilities while improving flow and professionalism. Maintain original length. DO NOT INCLUDE THE JOB TITLE. Begin directly with responsibilities. Output ONLY the revised text without any introductory phrases or role labels."
        },
        {
          role: "user",
          content: `Role: ${position || 'Technical Role'}\nRaw Description: ${description}`
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 250,
      frequency_penalty: 0.4
    });
    
    // Post-processing to remove any accidental position mentions
    let result = completion.choices[0]?.message?.content || description;
    const positionPrefix = `${position}: `;
    if (result.startsWith(positionPrefix)) {
      result = result.substring(positionPrefix.length);
    }
    return result;
  } catch (error) {
    console.error('Error enhancing description:', error);
    return description;
  }
}
export async function generateProfessionalSummary(name: string, position: string, description: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an executive resume writer. Create a professional summary EXCLUSIVELY in this format:\n\n[Sentence 1: Core expertise and achievements]\n[Sentence 2: Unique value proposition and differentiation]\n\nDirectly output the 2-sentence summary without any titles, prefixes, or markdown. Never use phrases like 'Here is' or 'Summary:'."
        },
        {
          role: "user",
          content: `Candidate: ${name}\nTarget Position: ${position}\nExperience Highlights: ${description}`
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.9,
      max_tokens: 120,
      presence_penalty: 0.6
    });
    
    // Post-processing to ensure clean output
    const summary = completion.choices[0]?.message?.content || '';
    return summary.replace(/^(Here is|Summary:|[\d]. |[-*] )/i, '').trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    return '';
  }
}
export async function suggestSkills(position: string, description: string): Promise<string[]> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a career advisor. Based on the position and description, suggest 5-8 relevant professional skills. Return only the skills as a comma-separated list without any additional text."
        },
        {
          role: "user",
          content: `Position: ${position || 'Professional'}\nDescription: ${description}`
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.6,
      max_tokens: 100,
    });

    const skillsText = completion.choices[0]?.message?.content || '';
    return skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  } catch (error) {
    console.error('Error suggesting skills:', error);
    return [];
  }
}