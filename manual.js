// =====================================================================
//  MANUAL / AJUDA  (edite este arquivo para mudar os textos da ajuda)
//  Regras: mantenha as aspas "..." e as vírgulas. Cada texto de lista fica
//  entre colchetes [ ]. Escreva só o que o sistema realmente faz.
// =====================================================================
const REAL = !!(CONFIG.supabase && CONFIG.supabase.url && CONFIG.supabase.anonKey);

const MANUAL = {

  // Aba "Suporte"
  suporte: {
    whatsapp: "",                                  // Ex.: "(17) 99999-9999"
    horario: "Atendimento de segunda a sexta, das 9h às 18h",
    email: "",
  },

  // Aba "Comece aqui"
  comece: [
    "Confira o cardápio e os preços com o responsável pelo sistema.",
    "Abra a aba Novo pedido e faça um pedido de teste.",
    "Vá até a Cozinha e avance o pedido até Concluir pedido.",
    "Veja o resultado nas abas Financeiro e Painel.",
    "Em caso de dúvida, use este botão de Ajuda ou fale com o suporte.",
  ],

  // Aba "Comece aqui", seção "O que o sistema não faz". Seja honesto aqui.
  limites: [
    REAL ? "Os pedidos, o estoque, a equipe e as despesas ficam salvos na conta da sua pizzaria." : "Esta é uma versão de demonstração: os dados não ficam salvos ao recarregar a página.",
    "Não recebe pedidos do iFood automaticamente. Pedidos de aplicativos são digitados em Novo pedido.",
    "Não emite nota fiscal e não substitui a contabilidade.",
    "O registro de turno da aba Equipe não substitui um sistema de ponto homologado.",
  ],

  // Aba "Esta tela": uma explicação para cada aba do sistema
  telas: {
    cozinha: {
      texto: "Mostra todos os pedidos em andamento, divididos em quatro etapas: Recebido, No preparo, No forno e Pronto.",
      passos: [
        "Quando um pedido entra, ele aparece em Recebido.",
        "Clique no botão do cartão para avançar para a próxima etapa.",
        "Em Pronto, clique em Concluir pedido. Se for entrega, ele segue para a aba Entregas.",
      ],
      dicas: [
        "O tempo em vermelho indica pedido com mais de 20 minutos.",
        "Observações do cliente aparecem em amarelo dentro do cartão.",
        "Para cancelar ou corrigir um pedido, use Cancelar pedido no cartão. Ele fica disponível até o pedido ficar Pronto.",
        ...(REAL ? [] : ["O botão Simular pedido novo existe só na demonstração."]),
      ],
    },
    pedido: {
      texto: "Use para registrar um pedido do balcão, do telefone ou do WhatsApp.",
      passos: [
        "Escolha o tamanho no topo da tela.",
        "Toque nos sabores para adicioná-los. Use + e − para ajustar a quantidade.",
        "Informe o cliente, a origem e a forma de pagamento. Escreva observações, se houver.",
        "Clique em Enviar para a cozinha. Para ver a comanda, use Enviar e ver comanda.",
      ],
      dicas: [
        "A comanda é impressa pelo navegador: escolha a impressora na janela que abrir.",
      ],
    },
    entregas: {
      texto: "Acompanha os pedidos de entrega depois que ficam prontos na cozinha.",
      passos: [
        "Pedidos de entrega concluídos na cozinha aparecem em Aguardando motoboy.",
        "Clique em Despachar: o sistema escolhe um motoboy livre.",
        "Quando o cliente receber, clique em Entregue.",
      ],
      dicas: [
        "Esta versão não recebe pedidos do iFood automaticamente.",
      ],
    },
    estoque: {
      texto: "Controla a quantidade dos ingredientes e outros itens da loja.",
      passos: [
        "Use + quando chegar mercadoria e − para dar baixa.",
        "Itens abaixo do mínimo ficam com a barra vermelha.",
        "A Lista de compras sugere quanto repor.",
      ],
      dicas: [
        "O estoque não baixa sozinho quando você faz um pedido. Nesta versão, a baixa é manual.",
      ],
    },
    equipe: {
      texto: "Mostra quem está em turno agora e a escala da semana.",
      passos: [
        "Clique em Bater ponto quando a pessoa começar o turno e em Registrar saída ao terminar.",
        "A escala da semana mostra a folga de cada pessoa.",
      ],
      dicas: [
        "Este registro é um controle interno de presença. Ele não substitui um sistema de ponto homologado, caso a sua empresa precise de um.",
      ],
    },
    financeiro: {
      texto: "Resume o caixa do dia: entradas, saídas e saldo.",
      passos: [
        "As entradas somam os pedidos enviados, separados por forma de pagamento.",
        "Para lançar uma despesa, escolha a categoria, digite o valor e clique em Lançar.",
        "O saldo mostra as entradas menos as saídas.",
      ],
      dicas: [
        "Este painel não emite nota fiscal nem substitui a contabilidade.",
      ],
    },
    painel: {
      texto: "Resume o dia: vendas, número de pedidos, ticket médio, horários de pico e sabores mais pedidos.",
      passos: [
        "Vendas hoje e Pedidos somam o que foi enviado.",
        "Ticket médio é o valor médio de cada pedido.",
        "O gráfico mostra em quais horários entram mais pedidos.",
      ],
      dicas: [
        REAL ? "Os números do painel são calculados com os pedidos de hoje." : "Parte dos números do painel (horários e sabores) é de exemplo nesta demonstração.",
      ],
    },
  },

  // Aba "Dúvidas": [ "Pergunta", "Resposta" ]
  faq: [
    ["Como cancelo ou corrijo um pedido?", "Na Cozinha, clique em Cancelar pedido, no cartão, e confirme. Para corrigir, cancele e registre o pedido certo em Novo pedido. O cancelamento fica disponível até o pedido ficar Pronto."],
    ["O que significa o tempo em vermelho?", "Que o pedido está há mais de 20 minutos na loja e precisa de atenção."],
    ["Como imprimo a comanda?", "Em Novo pedido, clique em Enviar e ver comanda e depois em Imprimir. Escolha a impressora na janela do navegador."],
    ["Os dados ficam salvos?", REAL ? "Sim. Tudo fica salvo na conta da sua pizzaria e pode ser acessado de outros aparelhos com o mesmo login." : "Nesta versão de demonstração, não: ao recarregar a página, tudo volta ao início."],
    ["O sistema recebe pedidos do iFood?", "Ainda não. Pedidos de aplicativos precisam ser digitados em Novo pedido."],
    ["O sistema emite nota fiscal?", "Não. Procure o seu contador para a emissão fiscal."],
    ["O registro da equipe vale como ponto legal?", "Não. É apenas um controle interno de presença."],
    ...(REAL ? [["Esqueci minha senha. O que faço?", "Na tela de Entrar, clique em Esqueci minha senha, digite o e-mail e siga o link que enviarmos."]] : []),
    ["Com quem falo se algo der errado?", "Abra a aba Suporte, neste painel de ajuda."],
  ],

  // Aba "Vídeos": [ "Título", "link do vídeo" ]. Link vazio aparece como "em breve".
  videos: [
    ["Visão geral do sistema", ""],
    ["Fazendo o primeiro pedido", ""],
    ["Cozinha e entregas", ""],
    ["Estoque e financeiro", ""],
  ],
};