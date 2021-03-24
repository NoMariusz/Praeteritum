from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User


class MatchInformation(models.Model):
    """ Database information about match """

    class Statuses(models.IntegerChoices):
        RUNNING = 1, _('Running')
        ENDED = 2, _('Ended')

    players = models.ManyToManyField(User, related_name="players")
    winner = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    status = models.IntegerField(
        choices=Statuses.choices, null=True, default=Statuses.RUNNING)
