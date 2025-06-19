from .models import Review
from rest_framework import serializers

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'app_name': {'required': True, 'allow_blank': False},
            'reviewer': {'required': True, 'allow_blank': False},
            'rating': {'required': True, 'min_value': 1, 'max_value': 5},
            'comment': {'required': False, 'allow_blank': True},
            # 'image': {'required': False, 'allow_null': True}
        }   