from tornado import (ioloop, web)
import hashlib
import string
import random
import os
import json

def wrap_template(template):
    class TemplateHandler(web.RequestHandler):
        def get(self):
            self.render(template)
    return TemplateHandler


db = open('data.jsonl', 'a')


class SubmitHandler(web.RequestHandler):
    def post(self):
        data = json.loads(self.get_argument('data'))
        url = self.get_argument('url')
        question = json.loads(self.get_argument('question'))
        code = self.get_argument('code')

        db.write(json.dumps({
            'data': data,
            'url': url,
            'question': question,
            'code': code
        }) + '\n')
        db.flush()
        self.write('OK')


handlers = [
    (r"/", wrap_template('index.html')),
    (r"/submit", SubmitHandler),
    (r"/(.*\.js)", web.StaticFileHandler, {"path": "./"}),
    (r"/(.*\.css)", web.StaticFileHandler, {"path": "./"}),
    (r"/(.*\.html)", web.StaticFileHandler, {"path": "./"}),
]

settings = {
    "autoreload": True,
    "debug": True,
    "template_path": "./",
}

if __name__ == "__main__":
    # start main application.
    application = web.Application(handlers, **settings)
    port = int(os.environ.get("PORT", 8080))
    application.listen(port, address="0.0.0.0")
    print('localhost:8080')
    ioloop.IOLoop.current().start()
