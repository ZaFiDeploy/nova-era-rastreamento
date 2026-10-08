# A Nova Era do Rastreamento — landing page

Landing da live **"Sua Central Vale Quanto?"** (8ª edição, 30/09), publicada em
https://anovaeradorastreamento.com.br.

Feita em [Astro](https://astro.build), com estilos inline em cada página e Tailwind CSS v4
(`src/styles/global.css`) para a base.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera a pasta dist/
```

## Estrutura

```
src/pages/index.astro       — landing (formulário de inscrição)
src/pages/obrigado.astro    — página pós-inscrição (link do grupo do WhatsApp)
src/components/BaseHead.astro — <head> comum: SEO, Open Graph, Meta Pixel
src/styles/global.css       — Tailwind + base
public/                     — imagens servidas na raiz do site
```

## Onde mexer em cada coisa

| O quê | Onde |
|---|---|
| Título, data, horário, edição | `src/pages/index.astro` (topo da página) |
| "Para quem é" e "Você vai aprender" | arrays `publico` e `aprendizados` no frontmatter de `index.astro` |
| Convidadas (nome, cargo, foto) | array `convidadas` em `index.astro` |
| Cor da marca (rosa) | bloco `:root` no fim de `index.astro` (`--brand*`) |
| Destino do formulário | `SHEETS_URL` no script de `index.astro` (Google Apps Script → planilha) |
| Nome do evento no Pixel | `LIVE_LABEL` no script de `index.astro` |
| Link do grupo do WhatsApp | `WHATSAPP_GROUP` em `obrigado.astro` |
| Meta Pixel, imagem de compartilhamento | `src/components/BaseHead.astro` |

O formulário envia `name`, `email` e `phone` para a planilha, dispara o evento `Lead` no Meta Pixel
e redireciona para `/obrigado`.

## Imagens que ainda faltam em `public/`

A versão no ar usa quatro imagens que ainda não estão neste repositório. Baixe do site no ar
e salve em `public/` com exatamente estes nomes:

- `logo-nova-era-rosa.png` — https://anovaeradorastreamento.com.br/logo-nova-era-rosa.png
- `helvia-eleto.jpg` — https://anovaeradorastreamento.com.br/helvia-eleto.jpg
- `franscielli-barbosa.jpg` — https://anovaeradorastreamento.com.br/franscielli-barbosa.jpg
- `og-image-live-30-09.png` — https://anovaeradorastreamento.com.br/og-image-live-30-09.png

Enquanto as fotos das convidadas não existirem, aparecem as iniciais no lugar.

## Deploy

O domínio está no projeto Vercel `workshop-landing` (time zafideploy's projects).
A configuração de build está em `vercel.json` (`npx astro build` → `dist/`).

Atenção: o deploy atual do domínio foi feito a partir de outro projeto (o repositório `syntro`),
que também publica outras páginas (`/area-aluno`, `/login`, `/central-nexxhub`, `/vendas` etc.). Este repositório contém só a
landing e a `/obrigado`. Combine com o dono do projeto antes de fazer um deploy de produção daqui
naquele projeto, porque as outras páginas sairiam do ar.

## Observação conhecida

A `/obrigado` usa as variáveis `--brand*`, mas elas só estão definidas em `index.astro`.
Por isso os detalhes em rosa dessa página não aparecem (igual ao site no ar hoje). Para
corrigir, copie o bloco `<style is:inline>` com o `:root` de `index.astro` para `obrigado.astro`.
