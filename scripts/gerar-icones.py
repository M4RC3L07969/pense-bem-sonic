"""Gera o ícone, o favicon e as imagens de abertura do app em assets/.

O desenho é original: o aparelho com um "?" no visor, as 4 teclas coloridas e as faixas
de velocidade. Precisa do Pillow (pip install pillow).

Uso: python3 scripts/gerar-icones.py . assets
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont
raiz = sys.argv[1]
FONTE = raiz + '/node_modules/@expo-google-fonts/russo-one/400Regular/RussoOne_400Regular.ttf'
AZUL, ESCURO, FUNDO, AMARELO = '#1740C8', '#0A2178', '#081446', '#FFD21F'
LCD, SEG = '#C8D5B0', '#17240F'
CORES = ['#C8221E', '#FFC400', '#0F6FD6', '#0B7D37']

def faixas(d, x, y, escala, cor=AMARELO):
    for i, larg in enumerate([0.56, 0.42, 0.28]):
        w, h = larg * escala, 0.08 * escala
        yy = y + i * 0.14 * escala
        inclinacao = h * 0.6
        d.polygon([(x - w + inclinacao, yy), (x + inclinacao, yy), (x, yy + h), (x - w, yy + h)], fill=cor)

def aparelho(tamanho, fundo=True, margem=0.0, monocromo=False):
    S = 4
    N = tamanho * S
    img = Image.new('RGBA', (N, N), FUNDO if fundo else (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    m = int(N * margem)
    a = N - 2 * m
    cor = lambda c: 'white' if monocromo else c
    if not monocromo:
        d.rounded_rectangle([m + a * 0.12, m + a * 0.1, m + a * 0.88, m + a * 0.9], radius=a * 0.12, fill=AZUL, outline=ESCURO, width=int(a * 0.025))
    faixas(d, m + a * 0.8, m + a * 0.17, a * 0.35, cor(AMARELO))
    lx0, ly0, lx1, ly1 = m + a * 0.2, m + a * 0.36, m + a * 0.8, m + a * 0.6
    if not monocromo:
        d.rounded_rectangle([lx0, ly0, lx1, ly1], radius=a * 0.04, fill=LCD, outline=ESCURO, width=int(a * 0.015))
    fonte = ImageFont.truetype(FONTE, int(a * 0.17))
    d.text(((lx0 + lx1) / 2, (ly0 + ly1) / 2), '?', font=fonte, fill=cor(SEG) if not monocromo else 'white', anchor='mm')
    r = a * 0.06
    for i, c in enumerate(CORES):
        cx = m + a * (0.29 + i * 0.14)
        cy = m + a * 0.75
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=cor(c), outline=None if monocromo else 'white', width=int(a * 0.012))
    return img.resize((tamanho, tamanho), Image.LANCZOS)

saida = sys.argv[2]
os.makedirs(saida, exist_ok=True)
aparelho(1024).save(saida + '/icon.png')
aparelho(48).save(saida + '/favicon.png')
Image.new('RGBA', (1024, 1024), FUNDO).save(saida + '/android-icon-background.png')
aparelho(1024, fundo=False, margem=0.17).save(saida + '/android-icon-foreground.png')
aparelho(1024, fundo=False, margem=0.17, monocromo=True).save(saida + '/android-icon-monochrome.png')
aparelho(1024, fundo=False, margem=0.05).save(saida + '/splash-icon.png')
