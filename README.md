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
src/scripts/inscricao.js    — lógica do formulário (planilha + Meta Pixel + redirecionamento)
src/components/BaseHead.astro — <head> comum: SEO, Open Graph, Meta Pixel
src/styles/global.css       — Tailwind + base
public/                     — imagens servidas na raiz do site
```

## Formulário de inscrição (não quebrar ao redesenhar)

A lógica fica em `src/scripts/inscricao.js`, separada do layout. O design pode mudar à vontade,
desde que a página continue tendo estes IDs:

| ID | Elemento | |
|---|---|---|
| `field-name` | campo de nome | obrigatório |
| `field-email` | campo de e-mail | obrigatório |
| `field-phone` | campo de WhatsApp (recebe máscara automática) | obrigatório |
| `btn-submit` | botão que envia | obrigatório |
| `form-error` | elemento onde aparece o erro | opcional |
| `btn-scroll-form` | botão que rola até o formulário | opcional |

E a página precisa importar o script (já está no fim de `index.astro`):

```astro
<script>
  import "../scripts/inscricao.js";
</script>
```

Ao clicar em enviar, o script valida os campos, manda `name`, `email` e `phone` (`+55 (11) 90000-0000`)
para a planilha do Google, dispara o evento `Lead` no Meta Pixel e redireciona para `/obrigado`.

Configurações no topo de `inscricao.js`:

- `SHEETS_URL`: Web App do Google Apps Script que grava na planilha
- `LIVE_LABEL`: nome do evento no Pixel (troque a cada live)
- `REDIRECT_URL`: página depois da inscrição

O Meta Pixel é carregado em `src/components/BaseHead.astro`, que toda página deve usar no `<head>`.

## Onde mexer no modelo atual

| O quê | Onde |
|---|---|
| Título, data, horário, edição | `src/pages/index.astro` |
| "Para quem é" e "Você vai aprender" | arrays `publico` e `aprendizados` no topo de `index.astro` |
| Convidadas (nome, cargo, foto) | array `convidadas` em `index.astro` |
| Cor da marca (rosa) | bloco `:root` no fim de `index.astro` (`--brand*`) |
| Link do grupo do WhatsApp | `WHATSAPP_GROUP` em `obrigado.astro` |
| Imagem de compartilhamento (OG) | `src/components/BaseHead.astro` |

## Imagens que ainda faltam em `public/`

A versão no ar usa quatro imagens que ainda não estão neste repositório. Baixe do site no ar
e salve em `public/` com exatamente estes nomes:

- `logo-nova-era-rosa.png`: https://anovaeradorastreamento.com.br/logo-nova-era-rosa.png
- `helvia-eleto.jpg`: https://anovaeradorastreamento.com.br/helvia-eleto.jpg
- `franscielli-barbosa.jpg`: https://anovaeradorastreamento.com.br/franscielli-barbosa.jpg
- `og-image-live-30-09.png`: https://anovaeradorastreamento.com.br/og-image-live-30-09.png

Enquanto as fotos das convidadas não existirem, aparecem as iniciais no lugar.

## Deploy na Vercel

O domínio `anovaeradorastreamento.com.br` está no projeto Vercel `workshop-landing`.
Com este repositório conectado ao projeto, o deploy é automático:

- push na `main`: publica em produção no domínio
- push em outra branch ou pull request: gera uma URL de preview para testar antes

A configuração de build está em `vercel.json` (`npx astro build` → `dist/`).

Este repositório contém só a landing e a `/obrigado`. O deploy que está no ar hoje também publica
outras páginas antigas (`/area-aluno`, `/login`, `/central-nexxhub`, `/vendas` etc.), que deixam de
existir no primeiro deploy feito a partir daqui.

## Observação conhecida

A `/obrigado` usa as variáveis `--brand*`, mas elas só estão definidas em `index.astro`.
Por isso os detalhes em rosa dessa página não aparecem (igual ao site no ar hoje). Para
corrigir, copie o bloco `<style is:inline>` com o `:root` de `index.astro` para `obrigado.astro`.
