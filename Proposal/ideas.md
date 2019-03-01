# Tech Stack 
dialog flow looks pretty good for the NLP 
python backend to interact withour NLP library
vue frontend to provide a nice user interface to interact with the bot and to let the bot throw 
dialogs / live render relevant animations. 

# Problem Space
students want to ask questions about course content, assignments, labs etc and have to wait for a staff to respond.
students may ask repeat questions that take time to answer, could be handled by a bot.
students may want more conversational style where they can clarify their questions quickly.
students may have different learning styles and benefit from individualised learning.
lecturers and tutors want to know what their students need help with, to improve learning outcomes.


# Ideas 
Have the bot listen in on conversations where a tutor is present to learn off the interaction. 
>> We need a source of data (course FAQ's? stack overflow? google images?)

Will the bot post answers on the course forum, or answer questions in a chat dialogue? Or both?

Can be an assistant to a tutor rather then a replacement  
    - Will remind people of deadlines  
    - Do basic math evalualations  
    - remember links to assignments  
        - hey bot when's the next assignment due?  
        - 5 weeks! it's a big assignment though so you want to start early  
    - stack overflow integration / can parse language docs?  
        - bot max size of a python integeer  
        - python doesn't have a max size, it will dynamically allocate memory  
    - how does X work  
        - Here's a userful diagram  
    - suggest further reading/questions to practice.  


A good feature is being able to throw an assignment at it and it can handle questions via the spec (most questions tutors get are of this form)
but in addition if any question stumps the bot it can email a tutor that maybe the spec is vauge.

If the bot is unsure it could try:
     - ask "do you want to post in forum?" and generate a forum post, allow student to modify before posting.
     - compile FAQs for the lecturer to answer, system can ingest these and learn from responses.
     - generate a report for course staff showing what students are asking most, usage statistics would be helpful for future improvements.
 
I really think we should push the diagram angle / google image searching. explaining a 
complex topic via images is almost always better.

Also maybe we can have a feature where a student can make their message a spoiler so other people in the group 
have to click on it to see it?

Integrated quizes the bot can ask (and/or flashcards!)
	- yo bot, can you quiz me on pointers
    - sure, what will `int x = 0; printf("%d",&x)` print?

Possible integrations: piazza, moodle, webcms3.  

# Existing Bots

DuoLingo - has chatbots to help students practice their speaking skills in foreign language
EdTech Foundry - has chatbots to assist students with administrative questions, course work expectations, suggests academic articles or 
further reading. Aims to give students quicker answers and not wait for course admin.
Thirdspace Learning - math tutoring, aims to track student progress and optimize teaching from this. Tried to identify if student is understanding
or not, or spot if tutor misses important step/information.
Thinkster - tried to learn student's workflow/thought processes in math problems, find problem areas.

Some common themes here are helping with both admin and coursework, trying to identify where students need help and their learning style, making 
adaptive and interactive.

lots of others described here https://emerj.com/ai-sector-overviews/artificial-intelligence-tutor-current-possibilities-smart-virtual-learning/?fbclid=IwAR3kvts4N0sTmZav3kcJX-jNt2kQ7gTq6c0-D5eGJeA-0xmyKfEnN6fj2uM




