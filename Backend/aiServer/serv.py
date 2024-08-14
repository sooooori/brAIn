from fastapi import FastAPI, Request
from pydantic import BaseModel
from openai import OpenAI
import json
from typing_extensions import override
from openai import AssistantEventHandler
import time
import unicodedata

ASSISTANT_ID = 'asst_Yn2CqHG87aRY7V7JSsRwneUJ'
client = OpenAI(api_key='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')

class EventHandler(AssistantEventHandler):
    def __init__(self):
        super().__init__()
        self.generated_text = ""
        self.buffer = ""

    @override
    def on_text_created(self, text) -> None:
        new_text = text.value
        if not self.generated_text.endswith(new_text):
            self.buffer += new_text
            self._process_buffer()

    @override
    def on_text_delta(self, delta, snapshot):
        new_text = delta.value
        if not self.generated_text.endswith(new_text):
            self.buffer += new_text
            self._process_buffer()

    def _process_buffer(self):
        while self.buffer:
            char, rest = self._split_first_char(self.buffer)
            if char and (not self.generated_text or char != self.generated_text[-1]):
                self.generated_text += char
            self.buffer = rest

    def _split_first_char(self, text):
        char = text[0]
        for i in range(1, len(text)):
            if unicodedata.category(text[i])[0] != 'M':
                return text[:i], text[i:]
        return text, ''

    def on_tool_call_created(self, tool_call):
        pass

    def on_tool_call_delta(self, delta, snapshot):
        pass

    def get_generated_text(self):
        return self.generated_text

def make_assistant(subject):
    assistant = client.beta.assistants.create(
        name="회의 참가자",
        instructions= f"우리가 브레인 스토밍중인 주제는 {subject}입니다. 우리는 라운드로빈 방식으로 돌아가며 아이디어를 내고 있습니다",
        model="gpt-4o-mini",
    )
    print(json.dumps(json.loads(assistant.model_dump_json()), indent=2))
    ASSISTANT_ID = assistant.id
    print(f"[생성한 Assistants ID]\n{ASSISTANT_ID}")
    return ASSISTANT_ID

def wait_on_run(run, thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.5)
    return run

def show_json(obj):
    print(json.dumps(json.loads(obj.model_dump_json()), indent=2))
    
def convert_json(obj):
    return json.loads(obj.model_dump_json())

def clean_summary_text(text):
    cleaned_text = text.replace("의회의록", "").strip()
    return cleaned_text

app = FastAPI()

class SubjectRequest(BaseModel):
    subject: str

class PostItRequest(BaseModel):
    postIt: str
    threadId: str

class CommentRequest(BaseModel):
    postIt: str
    comment: str
    threadId: str

class ThreadRequest(BaseModel):
    threadId: str
    assistantId: str

class PersonaRequest(BaseModel):
    threadId: str
    assistantId: str
    idea: str

class SwotRequest(BaseModel):
    threadId: str
    assistantId: str
    idea: str
    details: list = []

@app.post('/thread/start')
async def make_thread(request: SubjectRequest):
    subject = request.subject
    assistant_id = make_assistant(subject)
    thread = client.beta.threads.create()
    response = {
        "assistantId": assistant_id,
        "threadId" : thread.id
    }
    return response

@app.post('/postIt/add')
async def add_postit(request: PostItRequest):
    prompt = '다른 user의 아이디어입니다.' + request.postIt
    client.beta.threads.messages.create(
        thread_id=request.threadId,
        role="user",
        content= prompt
    )
    return "success"

@app.post('/comment/add')
async def add_comment(request: CommentRequest):
    prompt = request.postIt + '에 대한 다른 user의 추가 코멘트입니다.' + request.comment
    client.beta.threads.messages.create(
        thread_id=request.threadId,
        role="user",
        content= prompt
    )
    return "success"

@app.post('/postIt/make')
async def round_robin_make_idea(request: ThreadRequest):
    event_handler = EventHandler()

    message = client.beta.threads.messages.create(
        thread_id=request.threadId,
        role="user",
        content="너는 브레인 스토밍 회의에 참가한 사람이야. 주제에 관련한 아이디어를 하나만 추가로 내줘. 당신 또한 자신의 아이디어를 한 두문장으로만 나타내야해. 다른 사람의 아이디어에 코멘트를 달 필요는 없어. 다른 아이디어들과 겹치지 않게 부탁해. 이미 나온 내용이랑 너무 비슷하지 않았으면 좋겠어. 최대한 다른 내용을 작성해줘. 답변은 다른 user의 답변 맥락에 맞게 대답해줘. 답변은 핵심만 담아 한 문장으로 표현해줘. 최대한 평범하게 사람이 대화하는것 처럼 대답해줘."
    )

    with client.beta.threads.runs.stream(
        thread_id=request.threadId,
        assistant_id=request.assistantId,
        event_handler=event_handler,
    ) as stream:
        stream.until_done()
    
    return event_handler.get_generated_text()

@app.post('/summary/make')
async def summary_ideas(request: ThreadRequest):
    event_handler = EventHandler()
    message = client.beta.threads.messages.create(
        thread_id=request.threadId,
        role="user",
        content= "지금까지 우리와 네가 낸 의견들을 정리하여 회의록으로 보여주세요. 주제를 잊어선 안됩니다. 일부 의견만 언급해서는 안됩니다. 나왔던 의견들을 회의록 형식으로 정리하여야 합니다. 각 아이디어에 대한의견 정리와 향후 조치에 대한 내용만을 필요로 합니다. 그외 회의록 작성자, 날짜 등의 부가내용은 필요하지 않습니다. 단 요약이라는 점을 명심하고 길이를 조절하세요. 요약에 해당하는 내용만 보여주고 이외 내용은 포함하지 말아주세요. 향후 조치에 대한 내용이 끝나면 더 이상의 불필요한 내용은 포함시키지 않아야 합니다.",
    )
    with client.beta.threads.runs.stream(
        thread_id=request.threadId,
        assistant_id=request.assistantId,
        event_handler=event_handler,
    ) as stream:
        stream.until_done()

    summary_text = event_handler.get_generated_text()
    cleaned_summary = clean_summary_text(summary_text)
    return cleaned_summary

@app.post('/persona/make')
async def persona_make(request: PersonaRequest):
    prompt = f"우리는 지금까지 나온 아이디어중에 {request.idea}라는 내용이 있습니다. 이러한 아이디어에 대한 사용자 페르소나를 만들어주겠습니까? 페르소나만 만들면 됩니다. 다른 산출물을 만들 필요는 없습니다. 나이, 직업, 관심사, 특징 및 행동을 정리하고 이로 인해 나올 수 있는 제품 및 방향성을 제공해주세요. 페르소나의 형식에 맞춰서 너가 전부 작성해주세요. 페르소나에 해당하는 내용만 보여주고 이외 내용은 포함하지 말아주세요."
    
    event_handler = EventHandler()
    message = client.beta.threads.messages.create(
        thread_id=request.threadId,
        role="user",
        content=prompt
    )
    
    with client.beta.threads.runs.stream(
        thread_id=request.threadId,
        assistant_id=request.assistantId,
        event_handler=event_handler,
    ) as stream:
        stream.until_done()
    
    return event_handler.get_generated_text()

@app.post('/swot/make')
async def swot_make(request: SwotRequest):
    prompt = f"우리는 지금까지 나온 아이디어중에 {request.idea}라는 내용이 있습니다. 세부 내용으로는"
    
    if request.details:
        for item in request.details:
            if isinstance(item, dict) and 'detail' in item:
                prompt += f", {item['detail']}"
            else:
                prompt += ", [Invalid detail]"
    else:
        prompt += " [No details provided]"

    prompt += "들이 나왔습니다. 이러한 아이디어에 SWOT분석을 만들어주시겠습니까? 세부 내용에 대해 대답하는 것이 아닌 아이디어에 대한 세부내용까지 고려하여 SWOT분석을 만들어주세요. SWOT분석만 만들면 됩니다. 다른 산출물을 만들 필요는 없습니다. 형식에 맞춰서 너가 전부 작성해주세요. SWOT 분석한 내용만 보여주고 이외 내용은 포함하지 말아주세요."
    
    event_handler = EventHandler()
    message = client.beta.threads.messages.create(
        thread_id=request.threadId,
        role="user",
        content=prompt
    )
    
    with client.beta.threads.runs.stream(
        thread_id=request.threadId,
        assistant_id=request.assistantId,
        event_handler=event_handler,
    ) as stream:
        stream.until_done()
    
    return event_handler.get_generated_text()

@app.get('/user')
async def user():
    return 'Hello, User!'

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5000)
