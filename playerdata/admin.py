from django.contrib import admin
from .models import PlayerData


class PlayerDataAdmin(admin.ModelAdmin):
    def get_form(self, request, obj=None, **kwargs):
        ''' Override to enable set blank avatar, deck, collection fields in
        admin site '''
        form = super(PlayerDataAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['avatar'].required = False
        form.base_fields['deck'].required = False
        form.base_fields['collection'].required = False
        return form


admin.site.register(PlayerData, PlayerDataAdmin)
# admin.site.register(PlayerData)
