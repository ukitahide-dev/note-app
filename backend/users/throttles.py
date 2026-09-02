from rest_framework.throttling import UserRateThrottle

from rest_framework import exceptions


class PasswordChangeThrottle(UserRateThrottle):
    scope = "password_change"


    def throttle_failure(self):

        raise exceptions.Throttled(
            detail="短時間に試行しすぎています。しばらくしてから再度お試しください。",
            # wait=self.wait(),
        )
