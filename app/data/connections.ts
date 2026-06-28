
export type Connection = {
  source: string;
  target: string | null;
  reason: string;
  description?: string;
  type?: "referencia" | "referencia-cruzada" | "virada" | "familia-marley";
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
  {
    source: "026",
    target: "025",
    reason: "Raízes em Diálogo",
    description: "Se Caymmi e Seu Violão apresentou uma das raízes da música brasileira, Um Interpreta o Outro mostra que nenhuma raiz cresce sozinha — dois mestres celebrando a obra um do outro.",
    type: "referencia",
  },
  {
    source: "027",
    target: "025",
    reason: "Da Bahia a São Paulo",
    description: "A coleção percorreu o litoral da Bahia com Dorival Caymmi. Agora desembarca nas ruas de São Paulo com Adoniran Barbosa — duas raízes igualmente brasileiras, igualmente verdadeiras.",
    type: "referencia",
  },
  {
    source: "028",
    target: "025",
    reason: "Mar, Cidade e Morro",
    description: "Caymmi trouxe o mar. Adoniran trouxe a cidade. Cartola trouxe o morro — três geografias essenciais da identidade musical brasileira, reunidas na sequência de Referências.",
    type: "referencia",
  },
  {
    source: "029",
    target: "025",
    reason: "Da Paisagem à Linguagem",
    description: "Caymmi trouxe o mar. Adoniran trouxe a cidade. Cartola trouxe o morro. Moreira da Silva trouxe a pausa — a invenção do samba-de-breque, um ancestral estrutural da narrativa falada que décadas depois o rap tornaria protagonista.",
    type: "referencia",
  },
  {
    source: "030",
    target: "025",
    reason: "Da Linguagem à Arquitetura",
    description: "A sequência de Referências apresentou lugares, vozes e linguagens. O Fundo de Quintal apresenta uma nova arquitetura para o samba — o nascimento do pagode através do tan-tan, do repique de mão e do banjo.",
    type: "referencia",
  },
  {
    source: "029",
    target: "008",
    reason: "Ancestral da Narrativa Falada",
    description: "Muito antes de Eric B. & Rakim redefinirem o flow narrativo do hip-hop, Moreira da Silva já interrompia o samba para contar histórias direto ao ouvinte.",
    type: "referencia-cruzada",
  },
  {
    source: "035",
    target: "002",
    reason: "O Reencontro com a Jamaica",
    description: "A coleção percorreu as muitas vozes do samba brasileiro. Agora ela reencontra a Jamaica — fechando o círculo aberto pelo bloco de reggae nos discos #002 a #007, e revelando que Jimmy Cliff ajudaria décadas depois a originar o samba-reggae ao lado de Olodum e Ara Ketu.",
    type: "virada",
  },
  {
    source: "034",
    target: "032",
    reason: "Da Validação à Popularização",
    description: "Beth Carvalho validou o pagode diante da indústria. Zeca Pagodinho o tornou parte do cotidiano de qualquer brasileiro — sem nunca abandonar a raiz que vinha desde Cartola e Adoniran.",
    type: "referencia",
  },
  {
    source: "033",
    target: "025",
    reason: "Caymmi Revisitado",
    description: "Clara Nunes gravou 'O Que É Que a Baiana Tem', composição original de Dorival Caymmi — fechando um círculo que a sequência de Referências havia aberto.",
    type: "referencia",
  },
  {
    source: "033",
    target: "032",
    reason: "De Quem Abriu Caminho a Quem Devolveu a Memória",
    description: "Beth Carvalho abriu caminho para novas gerações. Clara Nunes devolveu à música brasileira sua memória ancestral — orixás, ancestralidade e cultura popular cantados com a mesma naturalidade de uma canção de amor.",
    type: "referencia",
  },
  {
    source: "032",
    target: "030",
    reason: "Da Invenção à Validação",
    description: "O Fundo de Quintal mudou a arquitetura do samba. Beth Carvalho, madrinha do grupo, foi quem acreditou que aquele novo som merecia chegar mais longe — e gravou seu próprio disco em homenagem ao gênero que ajudou a apadrinhar.",
    type: "referencia",
  },
  {
    source: "031",
    target: "027",
    reason: "Do Compositor ao Intérprete",
    description: "Adoniran escreveu sobre a vida simples de São Paulo. O Demônios da Garoa deu a essas histórias um coro — e um Brasil inteiro passou a cantar junto. Sem essa parceria, talvez Adoniran nunca tivesse saído das rodas de samba do Bixiga para a memória nacional.",
    type: "referencia",
  },
  {
    source: "035",
    target: "036",
    reason: "Da Bahia à Família Marley",
    description: "Jimmy Cliff fechou o círculo entre o samba-reggae brasileiro e suas raízes jamaicanas. Rita Marley abre a próxima sequência da coleção: a família que sustentou, por dentro, o maior nome do reggae mundial.",
    type: "virada",
  },
  {
    source: "036",
    target: "002",
    reason: "A Coautoria Invisível do Reggae",
    description: "A coleção já celebrou o reggae através de Junior Byles, Toots, Alpha Blondy e Jimmy Cliff. Rita Marley lembra que essas histórias sempre tiveram vozes femininas sustentando a revolução por dentro — muitas vezes sem ocupar o centro do palco.",
    type: "referencia-cruzada",
  },
  {
    source: "037",
    target: "036",
    reason: "Os Fundadores Originais",
    description: "Rita Marley mostrou que o reggae nunca foi construído por uma única voz. Early Music volta ainda mais no tempo, aos três jovens que construíram juntos a base de tudo: Bob Marley, Peter Tosh e Bunny Wailer.",
    type: "familia-marley",
  },
]