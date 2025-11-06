from django.contrib.gis.db import models

class TipoResiduo(models.Model): # Categoria de itens que podem ser descartados.
    nome = models.CharField(max_length=100, unique=True, help_text="Nome do tipo de resíduo, ex: 'Pilhas'")
    descricao = models.TextField(blank=True, help_text="Breve descrição sobre o descarte correto deste item")
    eh_reciclavel = models.BooleanField(default=True, help_text="Marque se esse item é comumente reciclável")

    class Meta:
        verbose_name = "Tipo de Resíduo"
        verbose_name_plural = "Tipos de Resíduos"

    def __str__(self):
        return self.nome

class PontoColeta(models.Model): # Locais físicos onde os resíduos podem ser descartados.
    nome = models.CharField(max_length=255, help_text= "Nome do local, ex: 'Ecoponto do Jorge'")
    endereco = models.CharField(max_length=255, help_text = "Endereço completo do ecoponto")
    telefone = models.CharField(max_length=20, blank=True, help_text="Telefone de contato (opcional).")
    email = models.EmailField(max_length=254, blank=True, help_text="E-mail de contato (opcional).")
    horario_funcionamento = models.CharField(max_length=255, blank=True, help_text="Horários de funcionamento, ex: 'Seg-Sex 08:00-18:00'")

    # Relação de Muitos-para-Muitos: Im ponto pode aceitar vários tipos de resíduos e um tipo de resíduo pode ser aceito em vários pontos.
    tipos_residuos_aceitos = models.ManyToManyField(TipoResiduo)

    # Armazena latidude e longitude
    localizacao = models.PointField()

    class Meta:
        verbose_name = "Ponto de Coleta"
        verbose_name_plural = "Pontos de Coleta"

    def __str__(self):
        return self.nome

class Cooperativa(models.Model): # Cooperativa de reciclagem que pode se cadastrar.
    nome = models.CharField(max_length=255)
    responsavel = models.CharField(max_length=255, blank=True)
    endereco = models.CharField(max_length=255, blank=True)
    horario_funcionamento = models.CharField(max_length=255, blank=True)
    tipos_residuos_aceitos = models.ManyToManyField(TipoResiduo)
    email = models.EmailField(max_length=254, unique=True, blank=False)
    telefone = models.CharField(max_length=20)

    #Status de controle para os cadastros. Mostra se foi revisado e aprovado pela administração.
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('APROVADO', 'Aprovado'),
        ('REJEITADO', 'Rejeitado'),
    ]
    status_cadastro = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDENTE')

    localizacao = models.PointField(blank=True, null=True, help_text="Localização da sede da cooperativa.")

    class Meta:
        verbose_name = "Cooperativa"
        verbose_name_plural = "Cooperativas"

    def __str__(self):
        return self.nome