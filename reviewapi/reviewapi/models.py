from django.db import models
from rest_framework import serializers

class Review(models.Model):
    id = models.BigAutoField(primary_key=True)
    app_name = models.CharField(max_length=100)
    reviewer = models.CharField(max_length=100)
    review_text = models.TextField()
    rating = models.IntegerField(default=0)
    image = models.ImageField(upload_to='review_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.app_name} by {self.reviewer}"

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'app_name', 'review_text', 'rating', 'image', 'created_at']
        read_only_fields = ['created_at']   