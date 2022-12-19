bind = "0.0.0.0:8000"
wsgi_app = "config.wsgi:application"
loglevel = "info"
accesslog = errorlog = "/tmp/gunicorn_logs.log"
capture_output = True
pidfile = "/tmp/gunicorn.pid"
reuse_port = True
keepalive = 120
workers = 2
threads = 5
daemon = True
