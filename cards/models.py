from django.db import models
from django.utils.translation import gettext_lazy as _
from .constants import BASE_CARD_IMAGE


class CardModel(models.Model):
    ''' Class describes card in game, and contains enums related to card '''

    class CardTypes(models.IntegerChoices):
        SPEARMAN = 0, _('Spearman')
        INFANTRYMAN = 1, _('Infantryman')
        CAVALRYMAN = 2, _('Cavalryman')
        MISSLEMAN = 3, _('Missleman')

    class CardRarities(models.IntegerChoices):
        COMMON = 0, _('Common')
        UNCOMMON = 1, _('Uncommon')
        ELITE = 2, _('Elite')
        EPIC = 3, _('Epic')
        MYTHIC = 4, _('Mythic')

    class CardKinds(models.IntegerChoices):
        UNIT = 0, _('Unit')

    name = models.CharField(max_length=50, null=False)
    category = models.IntegerField(choices=CardTypes.choices, null=False)
    rarity = models.IntegerField(choices=CardRarities.choices, null=False)
    attack = models.PositiveIntegerField(null=False)
    hp = models.PositiveIntegerField(null=False)
    image = models.CharField(
        max_length=150, null=False, default=BASE_CARD_IMAGE
    )
    defaultInCollection = models.BooleanField(null=False, default=False)
    defaultInDeck = models.BooleanField(null=False, default=False)
    kind = models.IntegerField(
        choices=CardKinds.choices, null=False, default=CardKinds.UNIT)

    def __str__(self):
        return self.name
