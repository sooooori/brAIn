from flask import Flask, request, jsonify
from openai import OpenAI
import json
from typing_extensions import override
from openai import AssistantEventHandler
import time
import unicodedata

ASSITANT_ID = 'asst_Yn2CqHG87aRY7V7JSsRwneUJ'
client = OpenAI(api_key='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')

class EventHandler(AssistantEventHandler):
    def __init__(self):
        super().__init__()
        self.generated_text = ""
        self.buffer = ""
    
    @override
    def on_text_created(self, text) -> None:
        self.buffer += text.value
        self._process_buffer()
    
    @override
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

def make_assitant(subject):
    assistant = client.beta.assistants.create(
        name="회의 참가자",
        instructions= f"우리가 브레인 스토밍중인 주제는 {subject}입니다. 우리는 라운드로빈 방식으로 돌아가며 아이디어를 내고 있습니다",
        model="gpt-4o-mini",
    )
    # 생성된 챗봇의 정보를 JSON 형태로 출력합니다.
    print(json.dumps(json.loads(assistant.model_dump_json()), indent=2))
    ASSISTANT_ID = assistant.id
    print(f"[생성한 Assistants ID]\n{ASSISTANT_ID}")
    return ASSISTANT_ID

def wait_on_run(run, thread):
    # 주어진 실행(run)이 완료될 때까지 대기합니다.
    # status 가 "queued" 또는 "in_progress" 인 경우에는 계속 polling 하며 대기합니다.
    while run.status == "queued" or run.status == "in_progress":
        # run.status 를 업데이트합니다.
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        # API 요청 사이에 잠깐의 대기 시간을 두어 서버 부하를 줄입니다.
        time.sleep(0.5)
    return run

def show_json(obj):
    # obj의 모델을 JSON 형태로 변환한 후 출력합니다.
    print(json.dumps(json.loads(obj.model_dump_json()), indent=2))
    
def convert_json(obj):
    return json.loads(obj.model_dump_json())

def clean_summary_text(text):
    # Remove any instances of '의회의록' or similar unwanted phrases
    cleaned_text = text.replace("의회의록", "").strip()
    # Additional cleaning logic can be added here if needed
    return cleaned_text

app = Flask(__name__)

@app.route('/thread/start', methods=['POST'])
def make_thread():
    params = request.get_json()
    subject = params['subject']
    assitant_id = make_assitant(subject)
    thread = client.beta.threads.create()
    response = {
        "assistantId": assitant_id,
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
    return "suceess"

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
    return "suceess"

@app.route('/postIt/make', methods=['POST'])
def round_robin_make_idea():
    params = request.get_json()
    thread_id = params['threadId']
    assistant_id = params['assistantId']
    event_handler = EventHandler()

    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content= "너는 브레인 스토밍 회의에 참가한 사람이야.\
            주제에 관련한 아이디어를 하나만 추가로 내줘.\
            당신 또한 자신의 아이디어를 한 두문장으로만 나타내야해.\
            다른 사람의 아이디어에 코멘트를 달 필요는 없어.\
            다른 user의 아이디어와 겹치지 않게 부탁해.\
            답변은 다른 user의 답변 맥락에 맞게 대답해줘.\
            답변은 핵심만 담아 한 문장으로 표현해줘.\
            최대한 평범하게 사람이 대화하는것 처럼 대답해줘."
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
        content= f"지금까지 우리와 네가 낸 의견들을 정리하여 회의록으로 보여주세요.\
        주제를 잊어선 안됩니다. 일부 의견만 언급해서는 안됩니다.\
        나왔던 의견들을 회의록 형식으로 정리하여야 합니다.\
        '패스'라고 말한 의견은 제외해주세요.\
        각 아이디어에 대한의견 정리와 향후 조치에 대한 내용만을 필요로 합니다.\
        그외 회의록 작성자, 날짜 등의 부가내용은 필요하지 않습니다.\
        단 요약이라는 점을 명심하고 길이를 조절하세요.\
        요약에 해당하는 내용만 보여주고 이외 내용은 포함하지 말아주세요.\
        향후 조치에 대한 내용이 끝나면 더 이상의 불필요한 내용은 포함시키지 않아야 합니다.",
    )
    with client.beta.threads.runs.stream(
        thread_id=thread_id,
        assistant_id=assistant_id,
        event_handler=event_handler,
    ) as stream:
        stream.until_done()


    summary_text = event_handler.get_generated_text()
    cleaned_summary = clean_summary_text(summary_text)
    return cleaned_summary

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
        페르소나의 형식에 맞춰서 너가 전부 작성해주세요\
        페르소나에 해당하는 내용만 보여주고 이외 내용은 포함하지 말아주세요."
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
    details = params.get('details', [])
    
    prompt = f"우리는 지금까지 나온 아이디어중에 {idea}라는 내용이 있습니다. 세부 내용으로는"
    
    # 세부 내용 추가
    if details:
        for item in details:
            if isinstance(item, dict) and 'detail' in item:
                prompt += f", {item['detail']}"
            else:
                prompt += ", [Invalid detail]"
    else:
        prompt += " [No details provided]"

    prompt += "들이 나왔습니다. 이러한 아이디어에 SWOT분석을 만들어주시겠습니까?\
        세부 내용에 대해 대답하는 것이 아닌 아이디어에 대한 세부내용까지 고려하여 SWOT분석을 만들어주세요\
        SWOT분석만 만들면 됩니다. 다른 산출물을 만들 필요는 없습니다.\
        형식에 맞춰서 너가 전부 작성해주세요\
        SWOT 분석한 내용만 보여주고 이외 내용은 포함하지 말아주세요."
    
    event_handler = EventHandler()
    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=prompt
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
    app.run(host='0.0.0.0', port=5000, debug=False)
