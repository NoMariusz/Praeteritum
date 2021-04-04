from django.contrib import admin
from .models import MatchInformation


class MatchAdmin(admin.ModelAdmin):
    def get_form(self, request, obj=None, **kwargs):
        """ Override to enable set none winner in admin
        site """
        form = super(MatchAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['winner'].required = False
        return form


admin.site.register(MatchInformation, MatchAdmin)
