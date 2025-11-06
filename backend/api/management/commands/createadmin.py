import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Cria um superusuário (se não existir) de forma não interativa.'

    def handle(self, *args, **options):
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        if not username or not email or not password:
            self.stdout.write(self.style.ERROR(
                'Por favor, defina as variáveis de ambiente: '
                'DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, e '
                'DJANGO_SUPERUSER_PASSWORD'
            ))
            return

        if not User.objects.filter(username=username).exists():
            self.stdout.write(self.style.SUCCESS(f'Criando superusuário: {username}'))
            User.objects.create_superuser(username=username, email=email, password=password)
        else:
            self.stdout.write(self.style.WARNING(f'Superusuário {username} já existe. Pulando.'))