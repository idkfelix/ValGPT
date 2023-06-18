import { Configuration, OpenAIApi } from "openai";

export async function getCompletion(messages: any[], key:string): Promise<any> {
  const configuration = new Configuration({apiKey: key})
  const openai = new OpenAIApi(configuration)

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });
    return completion.data.choices[0].message?.content ?? '';
  } catch (error:any) {
    console.error('Error:', error.response?.data ?? error.message);
    throw error;
  }
}

