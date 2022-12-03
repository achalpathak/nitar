from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


class InitiatePayments(APIView):
    def get(self, request):
        return Response({"message": "Payment Successfull."})
        # return Response({"message": "Payment Failed."},status=status.HTTP_400_BAD_REQUEST)
