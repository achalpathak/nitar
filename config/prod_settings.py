import os
from .settings import BASE_DIR

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.environ.get("MYSQL_DATABASE", "mysql-db"),
        "USER": os.environ.get("MYSQL_USER", "mysql-user"),
        "PASSWORD": os.environ.get("MYSQL_PASSWORD", "mysql-password"),
        "HOST": os.environ.get("MYSQL_DATABASE_HOST", "mysqldb"),
        "PORT": os.environ.get("MYSQL_DATABASE_PORT", 3306),
    }
}

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "frontend", "dist")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "static"

STATICFILES_DIRS = [os.path.join(BASE_DIR, "frontend", "dist", "assets")]


CSRF_TRUSTED_ORIGINS = [os.environ["SERVER_DOMAIN"]]
