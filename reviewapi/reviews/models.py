from django.db import models
from rest_framework import serializers

class Review(models.Model):
    app_name = models.CharField(max_length=100)
    reviewer = models.CharField(max_length=100)
    rating = models.IntegerField()
    comment = models.TextField()
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.app_name} by {self.reviewer}"