export type ListeningPath = {
  slug: string;
  title: string;
  description: string;
  catalogs: string[];
  cover: string;
};

export const listeningPaths: ListeningPath[] = [
  {
    slug: "jamaica-nova-york",
    title: "Jamaica → Nova York",
    description: "Da raiz jamaicana à arquitetura verbal do hip-hop.",
    catalogs: ["002", "007", "008"],
    cover: "007",
  },
  {
    slug: "jazz-bridge",
    title: "Jazz Bridge",
    description: "Quando a batida encontra a linguagem do jazz.",
    catalogs: ["013", "014", "015", "016", "017", "018"],
    cover: "014",
  },
  {
    slug: "brasil-global",
    title: "Brasil Global",
    description: "O Brasil entrando e saindo da coleção por rotas internacionais.",
    catalogs: ["001", "019", "020", "021"],
    cover: "019",
  },
  {
    slug: "de-kingston-ao-bronx",
    title: "De Kingston ao Bronx",
    description: "Do reggae jamaicano ao hip-hop, via Shinehead.",
    catalogs: ["002", "003", "004", "005", "006", "007"],
    cover: "007",
  },
  {
    slug: "a-era-de-ouro",
    title: "A Era de Ouro",
    description: "O auge do golden age do hip-hop.",
    catalogs: ["008", "009", "010", "011", "012"],
    cover: "010",
  },
  {
    slug: "noite-de-jazz",
    title: "Noite de Jazz",
    description: "Um set completo, do hard bop ao blues.",
    catalogs: ["013", "014", "015", "016", "017", "018"],
    cover: "016",
  },
  {
    slug: "raizes-brasileiras",
    title: "Raízes Brasileiras",
    description: "O Brasil entrando e saindo da coleção.",
    catalogs: ["001", "019", "020", "021", "022", "023", "024"],
    cover: "020",
  },
  {
    slug: "raizes-eternas",
    title: "Raízes Eternas",
    description: "Os 10 discos que ancoraram gerações — antes do hit, antes da rádio, antes do reconhecimento.",
    catalogs: ["025", "026", "027", "028", "029", "030", "031", "032", "033", "034"],
    cover: "025",
  },
  {
    slug: "raizes-do-reggae",
    title: "Raízes do Reggae",
    description: "Da Jamaica ao mundo — roots, ska, rocksteady e a família que sustentou o legado.",
    catalogs: ["002", "003", "004", "005", "006", "007", "035", "036", "037", "038", "039"],
    cover: "002",
  },
];
