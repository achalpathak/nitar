from django.contrib.auth.models import AnonymousUser
from django.utils.deprecation import MiddlewareMixin

try:
    from threading import local
except ImportError:
    from django.utils._threading_local import local

_thread_locals = local()


def set_current_user(user_phone):
    setattr(_thread_locals, "user", user_phone)


class GetCurrentUserMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if not request.user.is_authenticated:
            # set_current_user(user_phone=request.user.phone)
            setattr(_thread_locals, "user", "xyz")
