import json
from flask import Flask, request, jsonify
from openai import OpenAI
from openai import AssistantEventHandler
import time
import unicodedata

ASSISTANT_ID = 'asst_0I7SoatXnsvE47YRSKMJnc22'
client = OpenAI(api_key='sk-proj-8JiLVZK2dojt4n6785OAT3BlbkFJ0hSiaAEqWjms3ACsQuTT')

class EventHandler(AssistantEventHandler):
    def __init__(self):
        super().__init__()
        self.generated_text = ""
        self.buffer = ""
    
    def on_text_created(self, text) -> None:
        self.buffer += text.value
        self._process_buffer()
    
    def on_text_delta(self, delta, snapshot):
        self.buffer += delta.value
        self._process_buffer()

    def _process_buffer(self):
        while self.buffer:
            char, rest = self._split_first_char(self.buffer)
            if char:
                self.generated_text += char
                self.buffer = rest
            else:
                break

    def _split_first_char(self, text):
        for i in range(1, len(text) + 1):
            if unicodedata.category(text[i-1])[0] != 'M':  # M는 결합 문자를 의미
                return text[:i], text[i:]
        return '', text

    def on_tool_call_created(self, tool_call):
        pass

    def on_tool_call_delta(self, delta, snapshot):
        pass

    def get_generated_text(self):
        return self.generated_text[1:]

def make_assistant(subject):
    assistant = client.beta.assistants.create(
        name="회의 참가자",
        instructions= f"우리가 브레인 스토밍중인 주제는 {subject}입니다. 우리는 라운드로빈 방식으로 돌아가며 아이디어를 내고 있습니다",
        model="gpt-3.5-turbo-16k",
    )
    print(f"[생성한 Assistants ID]\n{assistant.id}")
    return assistant.id

def wait_on_run(run, thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.5)
    return run

def convert_json(obj):
    return json.loads(obj.model_dump_json())

app = Flask(__name__)

@app.route('/thread/start', methods=['POST'])
def make_thread():
    params = request.get_json()
    subject = params['subject']
    assistant_id = make_assistant(subject)
    thread = client.beta.threads.create()
    response = {
        "assistantId": assistant_id,
        "threadId" : thread.id
    }
    return jsonify(response)

@app.route('/postIt/add', methods=['POST'])
def add_postit():
    params = request.get_json()
    post_it = params['postIt']
    thread_id = params['threadId']
    prompt = '다른 user의 아이디어입니다.' + post_it
    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content= prompt
    )
    return "success"

@app.route('/comment/add', methods=['POST'])
def add_comment():
    params = request.get_json()
    post_it=params['postIt']
    comment = params['comment']
    thread_id = params['threadId']
    prompt = post_it+'에 대한 다른 user의 추가 코멘트입니다.' + comment
    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content= prompt
    )
    return "success"

@app.route('/postIt/make', methods=['POST'])
def round_robin_make_idea():
    params = request.get_json()
    thread_id = params['threadId']
    assistant_id = params['assistantId']
    event_handler = EventHandler()

    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content= "너는 브레인 스토밍 회의에 참가한 사람입니다.\
            주제에 관련한 아이디어를 하나만 추가로 내주세요.\
            당신 또한 자신의 아이디어를 한두문장으로만 나타내야합니다.\
            다른 사람의 아이디어에 코멘트를 달 필요는 없습니다.\
            다른 user의 아이디어와 겹치지 않게 부탁합니다.\
            최대한 평범하게 사람이 대화하는것 처럼 답해주세요"
    )

    with client.beta.threads.runs.stream(
        thread_id=thread_id,
        assistant_id=assistant_id,
        event_handler=event_handler,
    ) as stream:
        stream.until_done()
    
    return event_handler.get_generated_text()

@app.route('/summary/make', methods=['POST'])
def summary_ideas():
    params = request.get_json()
    thread_id = params['threadId']
    assistant_id = params['assistantId']
    event_handler = EventHandler()
    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content= f"지금까지 우리와 네가 낸 의견들을 정리하여 회의록으로 정리해주세요.\
        주제를 잊어선 안됩니다. 일부 의견만 언급해서는 안됩니다.\
        나왔던 의견들을 회의록 형식으로 정리하여야 합니다.\
        '패스'라고 말한 의견은 제외해주세요.\
        너가 낸 의견도 넣어서 정리해주세요. 반드시요. 꼭.\
        주제, 아이디어, 의견 정리, 향후 조치에 대해 정리해야 합니다.",
    )
    with client.beta.threads.runs.stream(
        thread_id=thread_id,
        assistant_id=assistant_id,
        event_handler=event_handler,
    ) as stream:
        stream.until_done()
    return event_handler.get_generated_text()

@app.route('/persona/make', methods=['POST'])
def persona_make():
    params = request.get_json()
    thread_id = params['threadId']
    assistant_id = params['assistantId']
    idea = params['idea']
    prompt = f"우리는 지금까지 나온 아이디어중에 {idea}라는 내용이 있습니다.\
        이러한 아이디어에 대한 사용자 페르소나를 만들어주겠습니까?\
        세부 내용에 대해 대답하는 것이 아닌 아이디어에 대한 세부내용까지 고려하여 페르소나를 만들어주세요\
        페르소나만 만들면 됩니다. 다른 산출물을 만들 필요는 없습니다.\
        나이, 직업, 관심사, 특징 및 행동을 정리하고\
        이로 인해 나올 수 있는 제품 및 방향성을 제공해주세요.\
        페르소나의 형식에 맞춰서 너가 전부 작성해주세요"
    event_handler = EventHandler()
    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content= prompt
    )
    with client.beta.threads.runs.stream(
        thread_id=thread_id,
        assistant_id=assistant_id,
        event_handler=event_handler,
    ) as stream:
        stream.until_done()
    return event_handler.get_generated_text()

@app.route('/swot/make', methods=['POST'])
def swot_make():
    params = request.get_json()
    thread_id = params['threadId']
    assistant_id = params['assistantId']
    idea = params['idea']
    details = params['details']
    prompt = f"우리는 지금까지 나온 아이디어중에 {idea}라는 내용이 있습니다. 세부 내용으로는"
    for item in details:
        prompt += f", {item['detail']}"
    prompt += "들이 나왔습니다. 이러한 아이디어에 SWOT분석을 만들어주시겠습니까?\
        세부 내용에 대해 대답하는 것이 아닌 아이디어에 대한 세부내용까지 고려하여 SWOT분석을 만들어주세요\
        SWOT분석만 만들면 됩니다. 다른 산출물을 만들 필요는 없습니다.\
        형식에 맞춰서 너가 전부 작성해주세요"
    event_handler = EventHandler()
    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content= prompt
    )
    with client.beta.threads.runs.stream(
        thread_id=thread_id,
        assistant_id=assistant_id,
        event_handler=event_handler,
    ) as stream:
        stream.until_done()
    return event_handler.get_generated_text()

@app.route('/user')
def user():
    return 'Hello, User!'

if __name__ == '__main__':
    app.run(debug=True)
