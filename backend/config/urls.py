from django.contrib import admin
from django.urls import path, include # Certifique-se de que 'include' está importado

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # Qualquer URL que comece com /api/ será enviada para o nosso app.
]