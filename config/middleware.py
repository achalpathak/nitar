from django.contrib.auth.models import AnonymousUser
from django.utils.deprecation import MiddlewareMixin
import traceback
from django.http import JsonResponse
import datetime

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


class Error500ResponseLogger(MiddlewareMixin):
    def process_exception(self, request, exception):
        print("<//{}ERROR{}//>".format("=" * 20, "=" * 20))
        print("TIME => ", datetime.datetime.now())
        print("URL => ", request.path)
        print("USER => ", request.user)
        print("DATA[GET] => ", request.GET)
        print("DATA[POST] => ", request.POST, request.content_params)
        print("ERROR TRACE => ", traceback.format_exc())
        print("<//{}====={}//>".format("=" * 20, "=" * 20))

        return JsonResponse({"message": "Server Error. Contact Admin."}, status=500)
