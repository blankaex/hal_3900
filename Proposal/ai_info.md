Summarized from:
https://medium.com/@BhashkarKunal/conversational-ai-chatbot-using-deep-learning-how-bi-directional-lstm-machine-reading-38dc5cf5a5a3

What are the tasks it needs to do?

 - understand the question (Natural Language Understanding) is done by dialogflow
 - use the generated "intent" info from dialogflow to find the 
 - creating the answer (Natural Language Generator) can be done using LSTM -> but it does need to know info to respond with


Overall:

Retrieval Based Conversational AI:
 - locates the best response from a database of pre-defined responses (in this case would be sections of course content)
 - a "matching" problem between what the user says and the possible responses
 - you can use a neural net to generate a "topic" word and then use this topic word to aid retrieval later
 
Generative Based AI:
 - no predefined repository
 - "translate" from an input to an output

Using both in combination:
 - by itself RNN tends to produce meaningless/trivial responses, it needs to know some content.
 - combining both: we obtain a candidate reply by information retrieval from a large database.
 - the candidate reply and the question are fed into an utterance generator.
 - this helps to add substance to the reply.
 - we can get feedback from the user's response to say if it was a relevant reply or not (ie. did you retireve the right info?)
 

What are the tasks it needs to do?

 - understand the question (Natural Language Understanding) is done by dialogflow
 - use the generated "intent" info from dialogflow to find relevant information in the course data
 - creating the answer (Natural Language Generator) can be done using LSTM -> but it does need to know info to respond with
       - does dialogflow allow you to do this?


What we need to know:

 - how we will use dialogflow
 - how we will incorporate the course data into the answers (thinking the combined approach described above)
 - how does data need to be represented?
 - how to train vs. how to use the trained model

