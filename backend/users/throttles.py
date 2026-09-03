from rest_framework.throttling import UserRateThrottle

from rest_framework import exceptions

from rest_framework.exceptions import Throttled


class PasswordChangeThrottle(UserRateThrottle):
    scope = "password_change"


    def throttle_failure(self):

        raise exceptions.Throttled(
            detail="短時間に試行しすぎています。しばらくしてから再度お試しください。",
            # wait=self.wait(),
        )




class AccountDeleteThrottle(UserRateThrottle):
    scope = "account_delete"    # settings.pyに、account_delete": "3/hour"を設定。

    def throttle_failure(self):
        raise Throttled(
            detail="短時間に試行しすぎています。しばらくしてから再度お試しください。"
        )
