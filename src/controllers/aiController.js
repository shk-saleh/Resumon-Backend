import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// Generate Descripiton for user
export const genDescription = async (title) => {
  try {
    const prompt = `You have to generate a professional Resume level descripiton using this job title ${title}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 500
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (err) {
    console.error('Descripiton generation failed:', err);
    throw new Error('Descripiton generation failed');
  }
};
