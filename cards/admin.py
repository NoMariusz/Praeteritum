from django.contrib import admin
from .models import CardModel


class CardAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'kind', 'category', 'rarity', 'attack', 'hp', 'card_strength',
        'defaultInCollection', 'defaultInDeck')
    list_filter = (
        'kind', 'category', 'rarity', 'defaultInCollection', 'defaultInDeck')

    def get_form(self, request, obj=None, **kwargs):
        ''' Override to enable set blank image and effect card fields in admin
        site '''
        form = super(CardAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['image'].required = False
        return form


admin.site.register(CardModel, CardAdmin)
