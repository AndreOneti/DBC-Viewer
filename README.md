# DBC Viewer

Visualizador de arquivos CAN Database (.dbc) para análise de mensagens e sinais em redes Controller Area Network.

## Funcionalidades

- **Upload de arquivos .dbc** - Carregue arquivos de banco de dados CAN com interface drag-and-drop
- **Visualizacao de mensagens** - Navegue por todas as mensagens CAN com ID, DLC e remetente
- **Detalhes de sinais** - Expanda cada mensagem para ver sinais com start bit, bit length, byte order, value type, factor, offset, min, max, unit e receivers
- **Busca** - Filtre mensagens e sinais por nome ou ID
- **Comentarios** - Visualize comentarios de mensagens e sinais (somente leitura)
- **Valores de bits (VAL_)** - Exiba as variacoes de valores descritivas dos sinais (somente leitura)
- **Metadados do arquivo** - Exiba versao, DB Name e nos (nodes) do arquivo DBC

## Formato DBC Suportado

O parser suporta as seguintes secoes do formato DBC:

| Secao | Descricao |
|-------|-----------|
| `VERSION` | Versao do arquivo DBC |
| `BU_` | Lista de nos (nodes) da rede CAN |
| `BO_` | Definicao de mensagens (ID, nome, DLC, sender) |
| `SG_` | Definicao de sinais (start bit, length, byte order, factor, offset, range, unit, receivers) |
| `CM_ BO_` | Comentarios de mensagens |
| `CM_ SG_` | Comentarios de sinais |
| `VAL_` | Descricoes de valores de bits |
| `BA_ "GenMsgCycleTime"` | Atributo de ciclo de tempo da mensagem |

## Stack

- **React 18** com TypeScript
- **Vite** - Build e dev server
- **Tailwind CSS** - Estilizacao
- **Lucide React** - Icones

## Estrutura do Projeto

```
src/
  components/
    DBCViewer.tsx    - Componente principal, gerencia estado e layout
    FileUpload.tsx   - Upload de arquivos .dbc
    MessageView.tsx  - Exibicao de mensagens e sinais (expansivel)
  utils/
    dbcParser.ts    - Parser do formato DBC
  App.tsx           - Ponto de entrada da aplicacao
```

## Uso

1. Abra a aplicacao no navegador
2. Clique na area de upload para selecionar um arquivo `.dbc`
3. Navegue pelas mensagens expandindo cada uma para ver os sinais
4. Use a barra de busca para filtrar por nome de mensagem, ID ou nome de sinal
5. Clique em "Carregar outro arquivo" para reiniciar
