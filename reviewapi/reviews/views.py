from rest_framework import viewsets
from rest_framework import generics
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

from django.contrib.auth.views import LoginView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from .models import Review
from .serializers import ReviewSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.views import TokenObtainPairView

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    lookup_field = 'id'

class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh_token = response.data.get("refresh")
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,  # ✅ Set to False for local dev (True in production)
            samesite="Strict",
            max_age=14 * 24 * 60 * 60,  # 2 weeks
        )
        del response.data["refresh"]
        return response

@method_decorator(csrf_exempt, name='dispatch')
class CsrfExemptLoginView(LoginView):
    pass


@login_required
def dashboard(request):
    return HttpResponse("Welcome to the App Review Backend")