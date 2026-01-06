const db = require("./src/database/db.js");

const carros = [
  {
    marca: "Chevrolet",
    modelo: "Kadett GL",
    ano: 1995,
    preco: 9000,
    precoAntigo: 11500,
    emOferta: true,
    badge: "OFERTA",
    secao: "ofertas",
    prioridade: 1,
    imagem: "assets/kadett1.webp",
    descricao: "O clássico Kadett GL, perfeito para colecionadores e entusiastas.",
    descricaoCurta: "Kadett GL 1995 em ótimo estado",
    km: 125000,
    combustivel: "Gasolina",
    finalPlaca: "7",
    cambio: "Manual",
    cor: "Vermelho",
    cidade: "São Paulo",
    aceitaTroca: "Não",
    imagens: [
      "assets/kadett1.webp",
      "assets/kadett2.webp",
      "assets/kadett3.webp"
    ]
  },

  {
    marca: "Volkswagen",
    modelo: "Fusca 1300",
    ano: 1978,
    preco: 22000,
    precoAntigo: null,
    emOferta: false,
    badge: "RARIDADE",
    secao: "classicos",
    prioridade: 1,
    imagem: "assets/fusca1.webp",
    descricao: "Fusca 1300 restaurado, ideal para colecionadores.",
    descricaoCurta: "Fusca 78 clássico",
    km: 98000,
    combustivel: "Gasolina",
    finalPlaca: "3",
    cambio: "Manual",
    cor: "Azul",
    cidade: "Rio de Janeiro",
    aceitaTroca: "Sim",
    imagens: [
      "assets/fusca1.webp",
      "assets/fusca2.webp",
      "assets/fusca3.webp"
    ]
  },

  {
    marca: "Chevrolet",
    modelo: "Chevette SL",
    ano: 1985,
    preco: 18900,
    precoAntigo: 21500,
    emOferta: true,
    badge: "OFERTA",
    secao: "ofertas",
    prioridade: 2,
    imagem: "assets/chevette1.webp",
    descricao: "Chevette SL clássico em excelente estado de conservação.",
    descricaoCurta: "Chevette SL 85",
    km: 140000,
    combustivel: "Gasolina",
    finalPlaca: "9",
    cambio: "Manual",
    cor: "Branco",
    cidade: "Belo Horizonte",
    aceitaTroca: "Não",
    imagens: [
      "assets/chevette1.webp",
      "assets/chevette2.webp",
      "assets/chevette3.webp"
    ]
  },

  {
    marca: "Volkswagen",
    modelo: "Gol Quadrado 1.8 AP",
    ano: 1994,
    preco: 15000,
    precoAntigo: null,
    emOferta: false,
    badge: "CLÁSSICO",
    secao: "classicos",
    prioridade: 2,
    imagem: "assets/gol1.webp",
    descricao: "Gol Quadrado com motor 1.8 AP, ótimo para quem gosta de clássicos.",
    descricaoCurta: "Gol 94 Quadrado",
    km: 110000,
    combustivel: "Gasolina",
    finalPlaca: "4",
    cambio: "Manual",
    cor: "Verde",
    cidade: "Curitiba",
    aceitaTroca: "Sim",
    imagens: [
      "assets/gol1.webp",
      "assets/gol2.webp",
      "assets/gol3.webp"
    ]
  },

  {
    marca: "Volkswagen",
    modelo: "Brasília 1600",
    ano: 1979,
    preco: 15900,
    precoAntigo: null,
    emOferta: false,
    badge: "RARIDADE",
    secao: "classicos",
    prioridade: 3,
    imagem: "assets/brasilia1.webp",
    descricao: "Brasília 1600 em bom estado, clássico brasileiro.",
    descricaoCurta: "Brasília 79",
    km: 125000,
    combustivel: "Gasolina",
    finalPlaca: "8",
    cambio: "Manual",
    cor: "Amarela",
    cidade: "Porto Alegre",
    aceitaTroca: "Não",
    imagens: [
      "assets/brasilia1.webp",
      "assets/brasilia2.webp",
      "assets/brasilia3.webp"
    ]
  },

  {
    marca: "Volkswagen",
    modelo: "T-Cross 1.0 TSI",
    ano: 2023,
    preco: 99900,
    precoAntigo: 109900,
    emOferta: true,
    badge: "NOVO",
    secao: "modernos",
    prioridade: 1,
    imagem: "assets/t-cros1.webp",
    descricao: "SUV moderno T-Cross 1.0 TSI, perfeito para o dia a dia.",
    descricaoCurta: "T-Cross 23",
    km: 5000,
    combustivel: "Flex",
    finalPlaca: "1",
    cambio: "Automático",
    cor: "Prata",
    cidade: "São Paulo",
    aceitaTroca: "Sim",
    imagens: [
      "assets/t-cros1.webp",
      "assets/t-cros2.webp",
      "assets/t-cros3.webp"
    ]
  },

  {
    marca: "Chevrolet",
    modelo: "Opala Comodoro 4.1",
    ano: 1980,
    preco: 45000,
    precoAntigo: null,
    emOferta: false,
    badge: "RARIDADE",
    secao: "classicos",
    prioridade: 1,
    imagem: "assets/opala1.webp",
    descricao: "Opala Comodoro 4.1, clássico icônico brasileiro.",
    descricaoCurta: "Opala 80 Comodoro",
    km: 170000,
    combustivel: "Gasolina",
    finalPlaca: "6",
    cambio: "Manual",
    cor: "Marrom",
    cidade: "Belo Horizonte",
    aceitaTroca: "Não",
    imagens: [
      "assets/opala1.webp",
      "assets/opala2.webp",
      "assets/opala3.webp"
    ]
  },

  {
    marca: "Volkswagen",
    modelo: "Santana 2.0 MI",
    ano: 1998,
    preco: 26900,
    precoAntigo: 29900,
    emOferta: true,
    badge: "OFERTA",
    secao: "ofertas",
    prioridade: 3,
    imagem: "assets/santana1.webp",
    descricao: "Santana 2.0 MI, carro robusto e confiável.",
    descricaoCurta: "Santana 98",
    km: 135000,
    combustivel: "Gasolina",
    finalPlaca: "2",
    cambio: "Manual",
    cor: "Prata",
    cidade: "Curitiba",
    aceitaTroca: "Sim",
    imagens: [
      "assets/santana1.webp",
      "assets/santana2.webp",
      "assets/santana3.webp"
    ]
  },

  {
    marca: "Volkswagen",
    modelo: "Saveiro Quadrada 1.8 AP",
    ano: 1992,
    preco: 28900,
    precoAntigo: null,
    emOferta: false,
    badge: "CLÁSSICO",
    secao: "classicos",
    prioridade: 2,
    imagem: "assets/saveiro1.webp",
    descricao: "Saveiro Quadrada 1.8 AP, utilitária clássica.",
    descricaoCurta: "Saveiro 92",
    km: 145000,
    combustivel: "Gasolina",
    finalPlaca: "5",
    cambio: "Manual",
    cor: "Branca",
    cidade: "São Paulo",
    aceitaTroca: "Não",
    imagens: [
      "assets/saveiro1.webp",
      "assets/saveiro2.webp",
      "assets/saveiro3.webp"
    ]
  }
];

const query = `
  INSERT INTO carros (
    marca,
    modelo,
    ano,
    preco,
    precoAntigo,
    emOferta,
    badge,
    secao,
    prioridade,
    imagem,
    descricao,
    descricaoCurta,
    km,
    combustivel,
    finalPlaca,
    cambio,
    cor,
    cidade,
    aceitaTroca,
    imagens
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

carros.forEach((carro) => {
  const imagensJSON = JSON.stringify(carro.imagens);

  db.run(
    query,
    [
      carro.marca,
      carro.modelo,
      carro.ano,
      carro.preco,
      carro.precoAntigo,
      carro.emOferta ? 1 : 0,
      carro.badge,
      carro.secao,
      carro.prioridade,
      carro.imagem,
      carro.descricao,
      carro.descricaoCurta,
      carro.km,
      carro.combustivel,
      carro.finalPlaca,
      carro.cambio,
      carro.cor,
      carro.cidade,
      carro.aceitaTroca,
      imagensJSON
    ],
    function (err) {
      if (err) {
        console.error("Erro ao inserir carro:", carro.modelo, err.message);
      } else {
        console.log(`Carro inserido: ${carro.modelo} (ID ${this.lastID})`);
      }
    }
  );
});
