# Fonte: Bíblia Ave Maria (JSON)

- **Origem**: https://github.com/fidalgobr/bibliaAveMariaJSON (arquivo `bibliaAveMaria.json`)
- **Baixado em**: 2026-07-07
- **Conteúdo**: texto bíblico completo do cânone católico (73 livros, 46 AT + 27 NT, 35.450 versículos). Estrutura: `{ antigoTestamento: [...], novoTestamento: [...] }`, cada livro com `nome` e `capitulos[]`, cada capítulo com `capitulo` e `versiculos[]`, cada versículo com `versiculo` e `texto`.
- **Limitação confirmada**: o arquivo **não contém** notas de rodapé nem introduções aos livros. Existem apenas marcadores `*` soltos dentro do campo `texto` (~11% dos versículos), sem o conteúdo da nota correspondente em nenhum lugar do arquivo. O importador (`AveMariaJsonImporter`) remove esses marcadores do texto exibido — ver decisão em `MEMORY`/plano do projeto.
- **Licença**: não declarada no repositório fonte. Texto da tradução é protegido (Editora Ave Maria). Uso restrito a ambiente pessoal/privado (`versions.is_public = false`) até a migração para uma tradução de domínio público (ex.: Pereira de Figueiredo) ou obtenção de licença oficial.
- **Reprodutibilidade**: o JSON é versionado neste repositório (não baixado em runtime) para que o import seja reproduzível offline e não dependa da disponibilidade/estabilidade do repositório de origem.
