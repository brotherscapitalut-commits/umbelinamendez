import { SITE } from "@/lib/site";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readingMinutes: number;
  keywords: string[];
  content: { heading?: string; paragraphs: string[] }[];
};

export const BLOG_AUTHOR = {
  name: SITE.name,
  url: SITE.url,
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "pos-operatorio-brasilia-guia-completo",
    title: "Pós-operatório em Brasília: guia completo para uma recuperação segura",
    description:
      "Como funciona o pós-operatório de cirurgia plástica em Brasília: quando começar, quantas sessões, drenagem linfática, radiofrequência e cuidados domiciliares.",
    excerpt:
      "Um passo a passo prático — do dia da alta às últimas sessões — para você entender o que esperar de um pós-operatório bem conduzido no Distrito Federal.",
    category: "Pós-operatório",
    date: "2025-09-12",
    readingMinutes: 7,
    keywords: [
      "pós-operatório Brasília",
      "drenagem linfática pós cirurgia",
      "recuperação abdominoplastia",
      "lipoaspiração pós-operatório DF",
    ],
    content: [
      {
        paragraphs: [
          "O pós-operatório é a fase que define, em grande parte, o resultado final da sua cirurgia plástica. Em Brasília, onde o clima seco e a rotina agitada tornam o descanso ainda mais desafiador, ter um protocolo profissional bem estruturado faz toda a diferença.",
          "Neste guia, reuni em linguagem simples o que costumo explicar às minhas pacientes na primeira conversa — de quando iniciar as sessões ao que evitar nas primeiras semanas.",
        ],
      },
      {
        heading: "Quando começar o pós-operatório",
        paragraphs: [
          "Na maioria dos casos, iniciamos entre 24h e 72h após a cirurgia, sempre com liberação do cirurgião. Começar cedo — com técnica adequada — reduz o edema, previne fibroses e acelera a reabsorção de hematomas.",
          "Em cirurgias como abdominoplastia, lipoaspiração e lipo HD, a drenagem manual precoce evita aderências e melhora o contorno.",
        ],
      },
      {
        heading: "Quantas sessões são necessárias",
        paragraphs: [
          "A média fica entre 10 e 20 sessões, distribuídas nas primeiras 6 a 8 semanas. Cirurgias combinadas (abdômen + mama, por exemplo) costumam pedir protocolos mais longos.",
          "Nas primeiras duas semanas, a frequência é maior (3 a 5 vezes por semana). Depois, espaçamos conforme a evolução clínica.",
        ],
      },
      {
        heading: "Tecnologias que fazem diferença",
        paragraphs: [
          "Além da drenagem linfática manual, uso ultrassom, radiofrequência e laserterapia para acelerar a cicatrização e prevenir fibroses. Cada tecnologia entra na fase certa do protocolo — não adianta antecipar radiofrequência se o tecido ainda está muito edemaciado.",
          "O taping (bandagem terapêutica) também é um aliado forte entre as sessões: mantém o estímulo linfático e dá suporte ao tecido.",
        ],
      },
      {
        heading: "Atendimento domiciliar no DF",
        paragraphs: [
          "Nas primeiras semanas, sair de casa é desconfortável e arriscado. Por isso atendo em domicílio em todo o Distrito Federal, com estrutura profissional completa: maca, aparelhos, materiais estéreis e produtos específicos para pós-cirúrgico.",
          "Você só precisa de um espaço tranquilo e uma tomada — o resto vai comigo.",
        ],
      },
      {
        heading: "Sinais de alerta",
        paragraphs: [
          "Vermelhidão intensa, febre, secreção com odor ou dor desproporcional exigem contato imediato com o cirurgião. Um bom protocolo estético trabalha lado a lado com a equipe médica — nunca a substitui.",
        ],
      },
    ],
  },
  {
    slug: "drenagem-linfatica-brasilia-como-funciona",
    title: "Drenagem linfática em Brasília: como funciona e para quem é indicada",
    description:
      "Entenda a drenagem linfática manual em Brasília: benefícios reais, indicações, frequência ideal e diferenças para massagem modeladora.",
    excerpt:
      "A drenagem linfática é uma das técnicas mais pedidas — e uma das mais mal compreendidas. Aqui está o que ela faz de verdade e para quem funciona.",
    category: "Drenagem Linfática",
    date: "2025-10-03",
    readingMinutes: 5,
    keywords: [
      "drenagem linfática Brasília",
      "drenagem manual DF",
      "retenção de líquidos",
      "pernas inchadas",
    ],
    content: [
      {
        paragraphs: [
          "A drenagem linfática manual é uma técnica leve e ritmada que estimula o sistema linfático a eliminar líquidos e toxinas retidos entre as células. Diferente da massagem modeladora, ela não deforma tecido nem provoca dor — o toque é sutil e a sensação é de leveza imediata.",
        ],
      },
      {
        heading: "Para quem é indicada",
        paragraphs: [
          "Gestantes, puérperas, pós-operatório, pessoas com pernas pesadas, retenção pré-menstrual, celulite e quem faz dietas de reeducação alimentar são as principais indicações.",
          "Também é excelente como suporte a tratamentos estéticos — potencializa criolipólise, radiofrequência e microagulhamento corporal.",
        ],
      },
      {
        heading: "Frequência ideal",
        paragraphs: [
          "Para objetivos estéticos, 1 a 2 sessões por semana costumam manter o resultado. Em quadros clínicos (retenção intensa, pós-cirúrgico), a frequência sobe para 3 a 5 vezes por semana no início.",
        ],
      },
      {
        heading: "O que esperar da primeira sessão",
        paragraphs: [
          "Fazemos uma avaliação rápida, definimos o objetivo e a sessão dura cerca de uma hora. É comum ir ao banheiro logo depois — sinal de que o sistema linfático respondeu bem.",
        ],
      },
    ],
  },
  {
    slug: "pos-parto-cuidados-puerperio-brasilia",
    title: "Pós-parto em Brasília: cuidados no puerpério que fazem diferença",
    description:
      "Drenagem pós-parto, cuidados com a cicatriz de cesárea e recuperação da puérpera em Brasília: o que priorizar nos primeiros 40 dias.",
    excerpt:
      "O puerpério é intenso — física e emocionalmente. Reuni os cuidados que mais transformam a recuperação das mulheres que atendo em domicílio no DF.",
    category: "Pós-parto",
    date: "2025-11-05",
    readingMinutes: 6,
    keywords: [
      "pós-parto Brasília",
      "drenagem pós parto",
      "cicatriz de cesárea",
      "puerpério DF",
    ],
    content: [
      {
        paragraphs: [
          "Os primeiros 40 dias após o parto — o puerpério — são um período de transformação profunda. O corpo elimina líquidos, o útero volta ao tamanho normal, a amamentação se estabelece e a mãe reaprende a rotina. É muita coisa ao mesmo tempo.",
          "Um cuidado especializado nessa fase acelera a recuperação e alivia a sobrecarga.",
        ],
      },
      {
        heading: "Drenagem pós-parto normal e cesárea",
        paragraphs: [
          "Depois do parto normal, podemos iniciar a drenagem em poucos dias, respeitando o conforto materno. Na cesárea, aguardamos a liberação médica (geralmente 15 a 30 dias) e adaptamos a técnica ao redor da cicatriz.",
          "A drenagem reduz o inchaço típico do puerpério, melhora o retorno venoso e alivia a sensação de peso nas pernas.",
        ],
      },
      {
        heading: "Cuidados com a cicatriz de cesárea",
        paragraphs: [
          "A cicatriz da cesárea merece atenção: laserterapia, manobras específicas e orientação de hidratação evitam aderências e queloides. Bem cuidada, ela se torna quase imperceptível ao longo dos meses.",
        ],
      },
      {
        heading: "Escuta e acolhimento",
        paragraphs: [
          "Nem tudo é técnica. Muitas vezes, a sessão é o único momento do dia em que a mãe respira. Trabalho com escuta ativa e respeito absoluto ao ritmo do bebê — se precisar amamentar no meio, paramos.",
        ],
      },
      {
        heading: "Atendimento domiciliar",
        paragraphs: [
          "Sair de casa com um recém-nascido é logístico demais. Por isso todo o atendimento pós-parto acontece na sua casa, em qualquer região do DF, no horário que funciona para você e o bebê.",
        ],
      },
    ],
  },
  {
    slug: "drenagem-pos-operatorio-diferencas",
    title: "Drenagem estética x drenagem pós-operatória: qual é a diferença?",
    description:
      "Drenagem linfática estética e drenagem pós-operatória parecem iguais, mas usam técnicas diferentes. Entenda quando cada uma é indicada em Brasília.",
    excerpt:
      "Duas técnicas com o mesmo nome — e objetivos bem diferentes. Saber qual você precisa evita frustração e potencializa o resultado.",
    category: "Pós-operatório",
    date: "2025-12-01",
    readingMinutes: 4,
    keywords: [
      "drenagem pós operatória Brasília",
      "drenagem estética",
      "fibrose pós cirurgia",
      "recuperação plástica DF",
    ],
    content: [
      {
        paragraphs: [
          "As duas partem do mesmo princípio — estimular o sistema linfático —, mas a drenagem pós-operatória exige treinamento específico, conhecimento de anatomia cirúrgica e manejo cuidadoso do tecido em cicatrização.",
        ],
      },
      {
        heading: "Drenagem estética",
        paragraphs: [
          "Voltada para retenção de líquidos, celulite, pernas pesadas e bem-estar. As manobras são rítmicas, o ritmo é constante e a sessão termina com sensação de leveza.",
        ],
      },
      {
        heading: "Drenagem pós-operatória",
        paragraphs: [
          "Aqui o objetivo é reduzir edema, prevenir fibroses, aderências e seromas. As manobras se adaptam ao tipo de cirurgia, ao tempo de recuperação e à condição da cicatriz.",
          "Além disso, combinamos ultrassom, radiofrequência (a partir do momento certo), laserterapia e taping — um arsenal que a drenagem estética não usa.",
        ],
      },
      {
        heading: "Como escolher",
        paragraphs: [
          "Se você fez ou vai fazer cirurgia, procure sempre uma profissional especializada em pós-operatório. Uma drenagem estética comum, feita cedo demais ou com técnica errada, pode piorar edemas e fibroses.",
        ],
      },
    ],
  },
];

export function findPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function postUrl(slug: string) {
  return `${SITE.url.replace(/\/$/, "")}/blog/${slug}`;
}

export function formatDatePtBr(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
