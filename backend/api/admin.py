from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from .models import TipoResiduo, PontoColeta, Cooperativa


# --- Configuração para o Mapa ---
@admin.register(PontoColeta)
class PontoColetaAdmin(GISModelAdmin):

    list_display = ('nome', 'endereco', 'telefone')

    # --- Configurações do Mapa ---
    default_lon = -47.9292  # Centro do Brasil (Brasília)
    default_lat = -15.7801
    default_zoom = 4

@admin.register(Cooperativa)
class CooperativaAdmin(GISModelAdmin):
    list_display = ('nome', 'responsavel', 'telefone', 'email', 'status_cadastro')
    list_filter = ('status_cadastro',)

    default_lon = -47.9292
    default_lat = -15.7801
    default_zoom = 4


# --- Registro Simples ---
admin.site.register(TipoResiduo)