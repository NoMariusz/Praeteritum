from django.contrib import admin
from .models import CardModel, CollectionCardsModel, DeckCardsModel

admin.site.register(CardModel)
admin.site.register(CollectionCardsModel)
admin.site.register(DeckCardsModel)
