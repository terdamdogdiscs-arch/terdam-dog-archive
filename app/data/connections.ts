
export type Connection = {
  source: string;
  target: string | null;
  reason: string;
  description?: string;
  type?: "referencia";
  influencedArtists?: string[];
};

export const connections: Connection[] = [
  {
    source: "001",
    target: "002",
    reason: "Raiz Jamaicana",
  },

  {
    source: "002",
    target: "004",
    reason: "Roots Reggae",
  },

  {
    source: "004",
    target: "007",
    reason: "Dancehall Evolution",
  },

  {
    source: "007",
    target: "008",
    reason: "Hip-Hop Bridge",
  },

  {
    source: "008",
    target: "010",
    reason: "Golden Era",
  },

  {
    source: "010",
    target: "013",
    reason: "Jazz Rap",
  },

  {
    source: "013",
    target: "014",
    reason: "Back To Source",
  },

  {
    source: "014",
    target: "019",
    reason: "Brazilian Connection",
  },

  {
    source: "019",
    target: "020",
    reason: "Brasil Global",
    description: "Sergio Mendes levou o Brasil ao mundo via Los Angeles. Jorge Ben prova que não precisava de tradutor.",
  },
  {
    source: "020",
    target: "021",
    reason: "Reinvenção Brasileira",
    description: "Tropical abriu as portas do mercado internacional. Benjor mostra o Brasil que já chegou — e que muda de nome sem perder a identidade.",
  },
  {
    source: "021",
    target: "022",
    reason: "Da Reinvenção ao Esoterismo",
    description: "Benjor mostrou Jorge Ben mudando de nome para acompanhar o tempo. A Tábua de Esmeralda mostra esse mesmo artista, quinze anos antes, mudando de direção quando ninguém esperava.",
  },
  {
    source: "022",
    target: "023",
    reason: "Da Alquimia à Simplicidade",
    description: "A Tábua de Esmeralda foi Jorge Ben olhando para dentro, construindo um universo esotérico. Bem-Vinda Amizade é o retorno — simples, solar, generoso. O groove continua, mas o peso espiritual dá lugar à leveza.",
  },
  {
    source: "023",
    target: "024",
    reason: "Da Celebração à Retrospectiva",
    description: "Bem-Vinda Amizade mostrou Jorge Ben confortável com a própria linguagem. 10 Anos Depois mostra o momento em que ele decidiu reescrever essa linguagem com as próprias mãos.",
  },
  {
    source: "025",
    target: null,
    reason: "Raiz da Música Brasileira",
    description: "Caymmi influenciou João Gilberto, Tom Jobim, Jorge Ben, Gilberto Gil e Caetano Veloso — cada um encontrando, à sua maneira, o silêncio, o balanço e a economia já presentes nessa obra.",
    type: "referencia",
    influencedArtists: ["João Gilberto", "Tom Jobim", "Jorge Ben", "Gilberto Gil", "Caetano Veloso"],
  },
]