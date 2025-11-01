from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from .models import TipoResiduo, PontoColeta, Cooperativa

# ---------- Ponto de Coleta ----------
@admin.register(PontoColeta)
class PontoColetaAdmin(GISModelAdmin):
    list_display = ('nome', 'endereco', 'telefone', 'cooperativa')
    search_fields = ('nome', 'endereco')
    list_filter = ('cooperativa',)
    
    fieldsets = (
        ('Informações principais', {'fields': ('nome', 'cooperativa', 'telefone')}),
        ('Localização', {'fields': ('geom',)}),
    )

    default_lon = -47.9292
    default_lat = -15.7801
    default_zoom = 4

# ---------- Cooperativa ----------
@admin.register(Cooperativa)
class CooperativaAdmin(GISModelAdmin):
    list_display = ('nome', 'responsavel', 'telefone', 'email', 'status_cadastro')
    list_filter = ('status_cadastro',)
    search_fields = ('nome', 'responsavel')

    fieldsets = (
        ('Informações principais', {'fields': ('nome', 'responsavel', 'telefone', 'email')}),
        ('Status', {'fields': ('status_cadastro',)}),
        ('Localização', {'fields': ('geom',)}),
    )

    default_lon = -47.9292
    default_lat = -15.7801
    default_zoom = 4

# ---------- Tipo de Resíduo ----------
@admin.register(TipoResiduo)
class TipoResiduoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'descricao')
    search_fields = ('nome',)
