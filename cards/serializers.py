from rest_framework import serializers
from .models import CardModel


class CardSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=50)
    category = serializers.ChoiceField(choices=CardModel.CardTypes.choices)
    rarity = serializers.ChoiceField(choices=CardModel.CardRarities.choices)
    attack = serializers.IntegerField()
    hp = serializers.IntegerField()
    image = serializers.CharField(max_length=150)
    effect = serializers.ChoiceField(choices=CardModel.CardEffects.choices)
