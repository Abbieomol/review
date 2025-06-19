from rest_framework import viewsets
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

from django.contrib.auth.views import LoginView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    lookup_field = 'id' 

@method_decorator(csrf_exempt, name='dispatch')
class CsrfExemptLoginView(LoginView):
    pass


@login_required
def dashboard(request):
    return HttpResponse("Welcome to the App Review Backend")