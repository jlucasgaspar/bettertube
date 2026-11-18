# Overview
BetterTube é uma "Chrome extension for an enhanced YouTube experience in desktop"

vai ser uma extensão do chrome chamada BetterTube. Vai ser muito customizavel que vai ter as seguintes features/opções:

- salvar videos para aparecer na tela inicial em vez da tela inicial padrão do youtube
  - Vai ter um botão em cada video perto do botão "curtir" que vai fazer isso
  - Aqui eu gostaria que a tela inicial do youtube aparecesse 2 sessões em vez do que aparece por padrão do youtube: queria que aparecesse os videos salvos pelo botão de salvar do BetterTube e outra sessão embaixo com os videos salvos em "Assistir mais tarde" do Yotube. Mas tem como a gnt como extensão ter acesso aos videos salvos em "Assistir mais tarde"?
- Bloquear ads (ou se não der, deixar o video mudo na hora do ad, e apertar "pular anúncio" sempre que aparecer a opção de pular anúncio)
- Ele vai ter internacionalização, então pode ser em inglês, português, espanhol, frances, italiano, alemão
- Opção de bloquear shorts
- Opção de bloquear recomendados (e colocar os videos salvos da tela inicial nos recomendados)
- Não precisamos salvar nada em banco de dados nem autenticar usuário por enquanto, ou seja, vamos salvar todas as opções do usuário no navegador
- Opção de tema claro e escuro pro usuário (vai iniciar na cor padrão do tema do chrome)

tecnologias a serem usadas:

- react (se der)
- impeccable skill
- pnpm
- prettier
- typescript
- Quero saber as opções de componentes que da pra gente usar (shadcn? sei lá... mas quem vai mandar na UI é o impeccable skill)
- typechecker, linter e formatação
- Se possível usar mdx em vez de markdown md
- Colocar comandos antes do commit para garantir que o Claude não esta comitando nada errado
- fazer com loop engineering (ver isso antes)

# Passo a passo

## Planejamento
1. Gerar arquivos specs.md com os milestones de cada etapa da extensão do chrome. As etapas podem ser separads da maneira que o claude preferir
- Colocar progress tracker nesse arquivo specs com os milestones
2. Criar um arquivo AGENTS.md (e gerar um symlink pro claude.md) dizendo que tem que olhar sempre o specs.md e sempre atualizar o progress tracker (tem que confirmar comigo sempre que for botar algo como done no progress tracker)
3. Pedir pro claude ler o `Overview` e dar idéias de features que podemos implementar e colocar no specs.md
4. Criar um README legal explicando o projeto (em inglês) pq vai ficar público no GitHub