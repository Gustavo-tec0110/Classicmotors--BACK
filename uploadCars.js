const db = require("./src/database/db.js");

const carros = [
  {
    marca: "Chevrolet",
    modelo: "Kadett GL",
    ano: 1995,
    preco: 9000,
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
    imagem: "assets/Brasilia1.webp",
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
      "assets/Brasilia1.webp",
      "assets/Brasilia2.webp"
    ]
  },
  {
    marca: "Volkswagen",
    modelo: "T-Cross 1.0 TSI",
    ano: 2023,
    preco: 99900,
    imagem: "assets/t-cros.webp",
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
      "assets/t-cros.webp",
      "assets/t-cros2.webp"
    ]
  },
  {
    marca: "Chevrolet",
    modelo: "Opala Comodoro 4.1",
    ano: 1980,
    preco: 45000,
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
      "assets/opala2.webp"
    ]
  },
  {
    marca: "Volkswagen",
    modelo: "Santana 2.0 MI",
    ano: 1998,
    preco: 26900,
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
      "assets/santana2.webp"
    ]
  },
  {
    marca: "Volkswagen",
    modelo: "Saveiro Quadrada 1.8 AP",
    ano: 1992,
    preco: 28900,
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
      "assets/saveiro2.webp"
    ]
  }
];

// Inserção no banco, agora com todos os campos
carros.forEach(carro => {
  const query = `
    INSERT INTO carros 
    (marca, modelo, ano, preco, imagem, descricao, descricaoCurta, km, combustivel, finalPlaca, cambio, cor, cidade, aceitaTroca, imagens)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Convertendo array de imagens para string JSON antes de salvar
  const imagensJSON = JSON.stringify(carro.imagens);

  db.run(
    query,
    [
      carro.marca,
      carro.modelo,
      carro.ano,
      carro.preco,
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
    function(err) {
      if (err) {
        console.error("Erro ao inserir carro:", carro, err.message);
      } else {
        console.log(`Carro inserido com ID ${this.lastID}: ${carro.marca} ${carro.modelo}`);
      }
    }
  );
});
