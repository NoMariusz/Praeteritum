from django.db import models
from django.contrib.auth.models import User
from cards.models import CardModel


class PlayerData(models.Model):
    """ Model to store user additional data needed to game """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    money = models.IntegerField(null=False, default=0)
    avatar = models.CharField(max_length=150, null=True)
    deck = models.ManyToManyField(CardModel, related_name='deck_cards')
    collection = models.ManyToManyField(
        CardModel, related_name='collection_cards')

    def __str__(self):
        return '%s data' % self.user
