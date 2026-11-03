const CONFIG = {

  // Nome do sistema (ao lado do logo e na aba do navegador)
  sistema: "Forno",

  // Nome da pizzaria da demonstração (topo e comanda impressa)
  pizzaria: "Pizzaria Bella Massa",

  // Seu contato, exibido no topo. "" = não aparece.
  contato: "",

  // Tamanhos (a ordem precisa bater com a ordem dos preços do cardápio)
  tamanhos: ["Broto", "Média", "Grande"],

  // Cardápio: [ "Nome", "Descrição", [preço 1º tamanho, 2º, 3º] ]
  // Item sem tamanho (bebida): acrescente 1 no final.
  menu: [
    ["Margherita",         "Molho, muçarela, tomate e manjericão",          [39, 52, 65]],
    ["Calabresa",          "Calabresa fatiada e cebola roxa",               [41, 55, 68]],
    ["Portuguesa",         "Presunto, ovos, cebola e azeitona",             [44, 58, 72]],
    ["Quatro Queijos",     "Muçarela, provolone, gorgonzola e parmesão",    [48, 63, 78]],
    ["Frango c/ Catupiry", "Frango desfiado e catupiry cremoso",            [44, 58, 72]],
    ["Pepperoni",          "Pepperoni e muçarela",                          [49, 64, 79]],
    ["Refrigerante 2L",    "Cola, guaraná ou limão",                        [12, 12, 12], 1],
  ],

  // Estoque: [ "Item", "unidade", quantidade atual, quantidade mínima ]
  estoque: [
    ["Massa de pizza",   "kg", 38, 20],
    ["Muçarela",         "kg", 14, 15],
    ["Molho de tomate",  "L",  22, 10],
    ["Calabresa",        "kg",  6,  5],
    ["Pepperoni",        "kg",  3,  4],
    ["Tomate",           "kg",  9,  6],
    ["Catupiry",         "kg",  5,  3],
    ["Refrigerante 2L",  "un", 28, 24],
    ["Caixas de pizza",  "un", 140, 100],
  ],

  // Equipe: [ "Nome", "Função", "Horário", em turno (1 ou 0), "hora de entrada" ]
  equipe: [
    ["Giovanni", "Pizzaiolo", "17h às 23h", 1, "17:52"],
    ["Marta",    "Cozinha",   "17h às 23h", 1, "17:58"],
    ["Rafaela",  "Atendente", "18h às 23h", 1, "18:03"],
    ["Paulo",    "Caixa",     "18h às 23h", 1, "18:01"],
    ["Lucas",    "Motoboy",   "18h às 23h", 1, "18:10"],
    ["Rafael",   "Motoboy",   "18h às 23h", 0, ""],
    ["Diego",    "Motoboy",   "19h às 23h", 0, ""],
    ["Sônia",    "Auxiliar",  "17h às 22h", 0, ""],
  ],

  // Motoboys disponíveis na aba Entregas
  motoboys: ["Lucas", "Rafael", "Diego"],
};