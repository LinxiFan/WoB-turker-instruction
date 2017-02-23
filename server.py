from tornado import (ioloop, web)
import hashlib
import string
import random
import os
import json

level1_json = 'data/level1.jsonl'


def wrap_template(template):
    class TemplateHandler(web.RequestHandler):
        def get(self):
            self.render(template)
    return TemplateHandler


def update_level1db(dat):
    with open(level1_json, 'a') as f:
        print(dat, file=f)
    print(dat)


class SubmitHandler(web.RequestHandler):
    def post(self):
        data = json.loads(self.get_argument('data'))
        url = self.get_argument('url')
        question = json.loads(self.get_argument('question'))
        code = self.get_argument('code')
        semantic = self.get_argument('semantic')

        recv = json.dumps({
            'data': data,
            'url': url,
            'question': question,
            'code': code,
            'semantic': semantic
        })
        update_level1db(recv)
        self.write('OK')


handlers = [
    (r"/", wrap_template('index.html')),
    (r"/submit", SubmitHandler),
    (r"/(.*\.js)", web.StaticFileHandler, {"path": "./"}),
    (r"/(.*\.css)", web.StaticFileHandler, {"path": "./"}),
    (r"/(.*\.html)", web.StaticFileHandler, {"path": "./"}),
    (r"/(.*\.jsonl)", web.StaticFileHandler, {"path": "./"}),
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
