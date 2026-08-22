from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from notes.models import Note



class Command(BaseCommand):

    help = "Delete notes that have been in the trash for more than 7 days."

    def handle(self, *args, **options):

        # expiration_time = timezone.now() - timedelta(days=7)
        expiration_time = timezone.now() - timedelta(seconds=10)


        expired_notes = Note.objects.filter(
            is_deleted=True,
            deleted_at__lte=expiration_time,
        )

        deleted_count = expired_notes.count()

        expired_notes.delete()   # DBから完全削除

        self.stdout.write(
            self.style.SUCCESS(
                f"{deleted_count} expired notes deleted."
            )
        )
