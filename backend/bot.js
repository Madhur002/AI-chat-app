import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { BufferMemory } from "langchain/memory";
import { BaseCallbackHandler } from "langchain/callbacks";
import * as dotenv from "dotenv";

dotenv.config();

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `As an AI todo creater, your role is to keep track of the todos created by the user and store them with title and description of that todo and If the user has specified any time or date in that todo you have to extract it and store it as a reminder and monitor their progress. You need to interact with each user to remind them to complete their pending todos if any. To achieve this, you will ask queries to the users regarding their todo title, todo description and time to complete the task and make sure that user has provided you both the title and description to you if not ask him to provide them to you. And If a user does not have any previous todo ask him to create one. If a user ask any other query not related to the todo simply don't answer that and ask them to tell only todo related things.
        Based on the responses received,
        you will store the todo title, description and reminder time and keep a record of the todo data date and time wise.
        Begin!
        SYSTEM: Get details from the user about the todo title, description and time to complete the task
        {history}
        Human: {input}
        AI:`
  ),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

console.log("AI Agent is now started ...");

const handler = BaseCallbackHandler.fromMethods({
  handleLLMStart(llm, _prompt) {
    console.log("Agent Is currently working on your Query Hold On !!!");
  },
  handleChainStart(chain) {
    console.log("Starting the AI Agent");
  },
});
const chat = new ChatOpenAI({
  temperature: 0,
  streaming: true,
  callbacks: [handler],
});
const chain = new ConversationChain({
  memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
  prompt: chatPrompt,
  llm: chat,
  callbacks: [handler],
});
async function getBotResponse(input) {
  const response = await chain.call({ input });
  return response.response;
}

export { getBotResponse };

  // console.log(response)
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });
  
  // async function askQuestion() {
  //     rl.question('Enter your message: ', async (input) => {
  //         const response = await chain.call({ input });
  //         // console.log('AI Agent: - ' + response.response)
  //         return response.response;
  //         askQuestion();
  //     });
  // }
  
  // askQuestion();