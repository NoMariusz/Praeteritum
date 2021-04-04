from typing import Optional
from django.contrib.auth.models import User
from ..models import MatchInformation


class DbInformationManager:
    """ utilities to match managing all stuff related to MachInformation
    in Database """

    @staticmethod
    def make_match_information(players: list) -> int:
        """ create match information
        :players: list - players in match
        :return: int - id of created MatchInformation """
        match_db_info = MatchInformation()
        match_db_info.save()
        match_db_info.players.add(*players)
        match_db_info.save()
        return match_db_info.id

    @staticmethod
    def set_match_ended(winner: Optional[User], match_id: int) -> bool:
        """ modify MatchInformation in db to set match ended and set winner
        :param winner: Optional[User] - player who win game
        :param match_id: int - id of match to set ended """
        db_match_infos = MatchInformation.objects.filter(id=match_id)
        if not db_match_infos.exists():
            return False
        db_match_info = db_match_infos[0]
        db_match_info.status = MatchInformation.Statuses.ENDED
        db_match_info.winner = winner
        db_match_info.save()
        return True
