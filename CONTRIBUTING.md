# Contribuindo com o TerdamDog Archive

## Changelog obrigatório

Toda tarefa que resultar em commit deve atualizar o `CHANGELOG.md` como último passo antes do commit e do push.

O fluxo esperado é:

1. Concluir e validar a mudança.
2. Adicionar uma nova entrada no topo do `CHANGELOG.md`, logo depois da introdução e do primeiro separador.
3. Usar a data local no formato `AAAA-MM-DD`.
4. Explicar em linguagem humana o que mudou e por que a mudança existe.
5. Listar brevemente os arquivos afetados.
6. Incluir o `CHANGELOG.md` no mesmo commit da mudança.
7. Só então executar o commit e o push.

Formato:

```md
## AAAA-MM-DD — Título curto e descritivo

**Commit:** este commit

**O que mudou:** Explicação humana em uma a três frases.

**Por quê:** Contexto ou motivação da mudança.

**Arquivos afetados:** `caminho/arquivo.ts`, `outro/arquivo.tsx`

---
```

### Sobre o hash do próprio commit

Uma entrada incluída dentro do próprio commit não pode registrar antecipadamente seu hash final: alterar o arquivo para inserir o hash produziria um novo hash. Por isso, entradas novas usam `este commit`. Entradas reconstruídas retroativamente podem e devem registrar o hash curto real.

Não é utilizado um hook `post-commit`, porque ele modificaria o `CHANGELOG.md` depois que o commit já terminou e deixaria o repositório imediatamente sujo. A atualização antes do commit mantém código e documentação na mesma unidade histórica.
