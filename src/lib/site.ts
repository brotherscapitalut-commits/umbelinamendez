export const SITE = {
  name: "Umbelina Mendez",
  brand: "Umbelina Mendez — Bióloga Esteta",
  title: "Umbelina Mendez | Bióloga Esteta - Método Reviva & Conexão Materna em Brasília",
  tagline: "Acompanhamento Estético Estratégico & Recuperação Pós-Parto em Brasília",
  description:
    "Constância, ciência e cuidado personalizado para potencializar sua evolução corporal e facial. Especialista no Método Reviva™, Conexão Materna (Pós-Parto) e pós-operatório avançado na Asa Norte, Brasília - DF.",
  city: "Brasília",
  region: "DF",
  country: "BR",
  address: "SEPN 513, Edifício Bittar I, Sala 110 — Asa Norte, Brasília - DF, 70768-900",
  addressStreet: "SEPN 513, Edifício Bittar I, Sala 110 – Asa Norte",
  email: "contato@umbelinamendez.com.br",
  whatsapp: "5561981567985",
  whatsappDisplay: "(61) 98156-7985",
  instagram: "https://www.instagram.com/umbelina_mendez",
  instagramHandle: "@umbelina_mendez",
  facebook: "",
  hours: "Segunda a Sexta • 08:00 às 18:00 | Sábado • 08:00 às 13:00",
  sessionDuration: "60 minutos (+ 20min de higienização e intervalo)",
  url: "https://www.umbelinamendez.com.br",
  mapsQuery: "SEPN 513 Edifício Bittar I Asa Norte Brasília DF",
  mapsEmbed:
    "https://www.google.com/maps?q=SQN+513+Bloco+A+Edificio+Bittar+1+Brasilia+DF&output=embed",
};

// IDs de tracking (podem ser configurados via variáveis de ambiente)
export const TRACKING = {
  ga4: (import.meta as any).env?.VITE_GA4_ID ?? "",
  metaPixel: (import.meta as any).env?.VITE_META_PIXEL_ID ?? "",
  gtm: (import.meta as any).env?.VITE_GTM_ID ?? "",
};

export type ServicePlan = {
  name: string;
  badge?: string;
  price?: number;
  priceFormatted?: string;
  paymentInfo?: string;
  description: string;
  features: string[];
};

export type ServiceFAQ = { q: string; a: string };

export type Service = {
  slug: string;
  title: string;
  short: string;
  desc: string;
  long: string[];
  bullets: string[];
  indications: string[];
  plans?: ServicePlan[];
  technologies?: string[];
  faqs: ServiceFAQ[];
};

export const SERVICES: Service[] = [
  {
    slug: "metodo-reviva",
    title: "Método Reviva™ (Corporal)",
    short: "Acompanhamento corporal contínuo & alta tecnologia",
    desc: "Acompanhamento corporal estratégico contínuo que combina drenagem manual de alta precisão com tecnologias integradas (Radiofrequência, Criofrequência, Ultrassom de Alta Potência, Crioterapia, Massagem Modeladora e Eletroterapia).",
    long: [
      "O Método Reviva™ Corporal foi desenvolvido pela Dra. Umbelina Mendez unindo mais de 20 anos de fundamentação biológica e prática clínica. Mais do que uma sessão isolada, trata-se de um planejamento estratégico para contorno, textura da pele e redução de retenção líquida profunda.",
      "Através da avaliação clínica e termográfica, personalizamos o protocolo combinando drenagem linfática manual com tecnologias de ponta para potencializar a quebra de adiposidades, estímulo de neocolagênese e melhora imediata do tônus tecidual.",
      "Ideal para mulheres que buscam resultados duradouros com base na ciência, sem dor e com máximo conforto em ambiente clínico na Asa Norte ou domiciliar no DF.",
    ],
    bullets: [
      "Drenagem Linfática Manual Estratégica & Massagem Modeladora",
      "Associação de Radiofrequência e Criofrequência",
      "Ultrassom Focalizado de Alta Potência e Crioterapia",
      "Ativação metabólica com Eletroterapia",
      "Avaliação e acompanhamento termográfico contínuo",
    ],
    indications: [
      "Flacidez tissular e muscular",
      "Gordura localizada e celulite de todos os graus",
      "Retenção crônica e inchaço corporal",
      "Remodelamento e definição do contorno corporal",
      "Necessidade de acompanhamento contínuo",
    ],
    plans: [
      {
        name: "Reviva™ Essencial",
        badge: "1 sessão / semana",
        description: "Ideal para manutenção e constância corporal com drenagem estratégica e tecnologia direcionada.",
        features: ["1 sessão semanal (60 min)", "Drenagem manual + Tecnologia", "Avaliação corporal inicial", "Termografia de controle"],
      },
      {
        name: "Reviva™ Intensivo",
        badge: "2 sessões / semana (Mais Procurado)",
        description: "Acompanhamento contínuo para resultados mais acelerados e estratégicos no contorno corporal.",
        features: ["2 sessões semanais completas", "Radiofrequência + Ultrassom", "Associação multitecnológica", "Acompanhamento quinzenal de evolução"],
      },
      {
        name: "Reviva™ Premium",
        badge: "Acompanhamento Integral",
        description: "Experiência ampliada com protocolos multitecnológicos personalizados e benefícios exclusivos.",
        features: ["Acompanhamento intensivo", "Criofrequência + Crioterapia inclusas", "Plano personalizado contínuo", "Atendimento prioritário na agenda"],
      },
    ],
    technologies: ["Drenagem Corporal", "Radiofrequência", "Criofrequência", "Ultrassom Alta Potência", "Crioterapia", "Massagem Modeladora", "Eletroterapia"],
    faqs: [
      {
        q: "Qual a diferença do Método Reviva™ para uma drenagem comum?",
        a: "A drenagem comum atua apenas na circulação linfática superficial. O Método Reviva™ integra manobras manuais biológicas especializadas com aparelhos de alta tecnologia (Radiofrequência, Criofrequência e Ultrassom), tratando retenção, flacidez e contorno de forma simultânea.",
      },
      {
        q: "Quantas sessões são recomendadas no Método Reviva™?",
        a: "Recomendamos os planos Essencial (1 sessão/sem), Intensivo (2 sessões/sem) ou Premium, definidos na avaliação inicial conforme seu objetivo corporal.",
      },
      {
        q: "O procedimento causa dor ou hematomas?",
        a: "Não. Todos os protocolos do Método Reviva™ são confortáveis, relaxantes e não causam hematomas ou dor.",
      },
    ],
  },
  {
    slug: "reviva-face",
    title: "Reviva Face™ (Rejuvenescimento Facial 60 Dias)",
    short: "Programa intensivo de rejuvenescimento celular e colágeno",
    desc: "Programa de 60 dias de rejuvenescimento facial com diagnóstico computadorizado via Dermoscan, indução percutânea de colágeno, microagulhamento, fotobiomodulação a laser, criofrequência e radiofrequência.",
    long: [
      "O Reviva Face™ é um programa completo estruturado em 60 dias para regenerar a derme, uniformizar o tom e suavizar linhas de expressão e flacidez com fundamentação na biologia tecidual.",
      "Iniciamos com um mapeamento minucioso com tecnologia Dermoscan, identificando as camadas dérmicas, manchas profundas e níveis de hidratação. A partir desse diagnóstico, aplicamos microagulhamento estéril de precisão, fotobiomodulação por laser terapêutico e ativos biomiméticos.",
      "Os resultados são progressivos: estímulo sustentado de colágeno tipo I e III, textura acetinada e viço radiante natural sem aspecto artificial.",
    ],
    bullets: [
      "Diagnóstico facial computadorizado com Dermoscan",
      "Microagulhamento com indução sustentada de colágeno",
      "Limpeza de pele profunda com extração biológica suave",
      "Drenagem linfática facial e desintoxicação tecidual",
      "Criofrequência e Radiofrequência para firmeza dérmica",
      "Protocolos regenerativos com laserterapia biofotônica",
    ],
    indications: [
      "Linhas finas, rugas e perda de firmeza facial",
      "Poros dilatados e cicatrizes de acne",
      "Melasma, manchas solares e fotoenvelhecimento",
      "Pele desvitalizada e sem luminosidade natural",
    ],
    plans: [
      {
        name: "Reviva Face™ 60 Dias",
        badge: "Programa Completo",
        description: "Ciclo completo de rejuvenescimento celular com Dermoscan e sessões combinadas.",
        features: [
          "Mapeamento com Dermoscan Facial",
          "Microagulhamento estéril de precisão",
          "Fotobiomodulação a Laser regenerativo",
          "Limpeza de pele profunda e drenagem",
          "Acompanhamento em 60 dias",
        ],
      },
    ],
    technologies: ["Dermoscan", "Microagulhamento Fotobiomodulado", "Laserterapia", "Criofrequência Facial", "Radiofrequência Multipolar"],
    faqs: [
      {
        q: "Como funciona o programa de 60 dias Reviva Face™?",
        a: "O programa é composto por sessões estruturadas a cada 15 a 21 dias com acompanhamento Home Care estratégico. O pico de produção de colágeno ocorre justamente entre a 4ª e a 8ª semana.",
      },
      {
        q: "O que é o diagnóstico com Dermoscan?",
        a: "É uma avaliação por imagem que analisa a saúde das camadas profundas da pele, nível de oleosidade, profundidade de manchas e firmeza tecidual.",
      },
      {
        q: "Posso trabalhar no dia seguinte ao microagulhamento?",
        a: "Sim. A vermelhidão inicial diminui rapidamente nas primeiras 12 a 24 horas graças à aplicação imediata do laser regenerativo pós-procedimento.",
      },
    ],
  },
  {
    slug: "conexao-materna",
    title: "Conexão Materna (Recuperação Pós-Parto)",
    short: "Recuperação acolhedora pós-parto normal e cesárea",
    desc: "Recuperação pós-parto hospitalar e domiciliar no DF com Laserterapia terapêutica para cicatriz/lacerações, protocolo ILIB, Taping Linfático Terapêutico e drenagem suave.",
    long: [
      "O puerpério é um dos momentos mais transformadores e sensíveis na vida de uma mulher. O programa Conexão Materna foi criado para oferecer suporte técnico de excelência e acolhimento humano na sua recuperação.",
      "Atuamos desde a maternidade ou primeiras semanas em domicílio com Laserterapia de baixa potência para acelerar a cicatrização da cesárea ou lacerações do parto normal, Laserterapia ILIB para modular o estresse e inflamação sistêmica, e Taping compressivo seguro.",
      "Cada atendimento respeita rigorosamente a rotina da mãe e do bebê, com pausas para amamentação e ambiente de absoluto afeto e segurança.",
    ],
    bullets: [
      "Atendimento hospitalar e domiciliar em todo o DF",
      "Laserterapia de baixa intensidade na cicatriz/laceração",
      "Protocolo ILIB (Laser Sistêmico) para imunidade e bem-estar",
      "Taping Linfático Terapêutico para redução de edema e suporte abdominal",
      "Drenagem Linfática Puerperal suave e alívio de tensões posturais",
    ],
    indications: [
      "Puérperas recentes de parto cesárea ou normal",
      "Inchaço intenso nas pernas, pés e abdômen pós-parto",
      "Sensibilidade, dor ou retardo cicatricial cirúrgico",
      "Cansaço extremo, sobrecarga muscular e puerpério emocional",
    ],
    plans: [
      {
        name: "Atendimento Hospitalar",
        badge: "Maternidade",
        price: 280,
        priceFormatted: "R$ 280,00",
        paymentInfo: "À vista ou Pix",
        description: "Sessão na maternidade com Laserterapia na cicatriz, ILIB e Taping para conforto imediato.",
        features: ["Visita hospitalar no DF", "Laserterapia na cicatriz/laceração", "ILIB relaxante e modulador", "Aplicação de Taping Linfático", "Orientações iniciais"],
      },
      {
        name: "Programa Essencial Materno",
        badge: "4 Atendimentos",
        price: 1052,
        priceFormatted: "R$ 1.052,00 à vista Pix (ou R$ 1.120 em até 3x)",
        paymentInfo: "R$ 1.052 Pix / até 3x sem juros",
        description: "Acompanhamento domiciliar nas primeiras 4 semanas com drenagem, laser e taping.",
        features: ["4 atendimentos em domicílio", "Laser cicatricial em todas as sessões", "Protocolo ILIB integrativo", "Drenagem pós-parto suave", "Aplicação de Taping Linfático"],
      },
      {
        name: "Programa Recuperação Completa",
        badge: "8 Atendimentos",
        price: 1920,
        priceFormatted: "R$ 1.920,00 à vista Pix (ou R$ 2.240 em até 3x)",
        paymentInfo: "R$ 1.920 Pix / até 3x sem juros",
        description: "Acompanhamento contínuo dos primeiros 60 dias para restauração plena do corpo e tecidos.",
        features: ["8 atendimentos completos", "Cuidados contínuos com a cicatriz", "Recuperação postural e abdominal", "Suporte prioritário via WhatsApp"],
      },
    ],
    technologies: ["Laserterapia Vermelha/Infravermelha", "Protocolo ILIB", "Taping Linfático Kinesio"],
    faqs: [
      {
        q: "Quando posso iniciar os atendimentos do Conexão Materna?",
        a: "O protocolo hospitalar pode ser iniciado ainda na maternidade (primeiras 24-48h). Em domicílio, atendemos desde os primeiros dias após a alta com manobras seguras e autorização médica.",
      },
      {
        q: "O que é o Protocolo ILIB?",
        a: "É a irradiação intravascular do sangue a laser por via não invasiva (na artéria radial do punho). Estimula ação antioxidante, melhora a oxigenação tecidual, reduz a dor e auxilia no equilíbrio emocional e na imunidade.",
      },
      {
        q: "A sessão pode ser interrompida se meu bebê precisar mamar?",
        a: "Com certeza. O atendimento é totalmente humanizado e adaptado ao ritmo do bebê e da família.",
      },
    ],
  },
  {
    slug: "beauty-tech-day",
    title: "Beauty Tech Day",
    short: "Imersão tecnológica: Criolipólise de Placas, Lavier & Laser",
    desc: "Evento exclusivo com horários agendados dedicado às tecnologias da clínica: Criolipólise de Placas 360° sem sucção, Lavier para estímulo de colágeno e Depilação a Laser definitiva.",
    long: [
      "O Beauty Tech Day é um evento premium realizado periodicamente na nossa clínica na Asa Norte, reunindo as tecnologias estéticas mais consagradas do mundo com condições imperdíveis.",
      "Inclui sessões de Criolipólise de Placas (sem sucção, confortável e homogênea), tecnologia Lavier e Depilação a Laser definitiva de alta eficácia.",
      "As vagas são estritamente limitadas por data para garantir atendimento individualizado com 60 minutos dedicados para cada paciente.",
    ],
    bullets: [
      "Criolipólise em Placas 360° sem sucção (conforto máximo)",
      "Tecnologia Lavier de estímulo de colágeno",
      "Depilação a Laser definitiva indolor e rápida",
      "Atendimento individualizado e avaliação personalizada",
      "Horários agendados com reserva antecipada via Pix",
    ],
    indications: [
      "Gordura localizada em abdômen, flancos, culote, braços e costas",
      "Remodelamento corporal rápido com tecnologia não invasiva",
      "Flacidez dérmica e perda de sustentação tecidual",
      "Eliminação definitiva de pelos indesejados",
    ],
    plans: [
      {
        name: "Criolipólise 1 Placa",
        badge: "Plano Individual",
        price: 150,
        priceFormatted: "R$ 150,00",
        description: "1 placa plana de congelamento sem sucção para gordura localizada.",
        features: ["Aplicação de 1 placa plana", "Sem sucção ou hematomas", "Avaliação prévia"],
      },
      {
        name: "Criolipólise 2 Placas",
        badge: "Mais Pedido",
        price: 230,
        priceFormatted: "R$ 230,00",
        description: "2 placas de congelamento simultâneo para abdômen ou flancos.",
        features: ["Aplicação de 2 placas", "Tratamento de flancos ou abdômen duplo", "Resultados homogêneos"],
      },
      {
        name: "Criolipólise 4 Placas",
        badge: "Tratamento Completo",
        price: 349,
        priceFormatted: "R$ 349,00",
        description: "4 placas para contorno global de abdômen superior, inferior e flancos.",
        features: ["Aplicação de 4 placas simultâneas", "Redução ampla de medidas", "Melhor custo-benefício"],
      },
      {
        name: "Tecnologia Lavier",
        badge: "Colágeno & Firmeza",
        price: 199,
        priceFormatted: "R$ 199,00",
        description: "Sessão intensiva para firmeza e melhora da textura dérmica.",
        features: ["Sessão facial ou corporal", "Estímulo imediato de colágeno", "Sem tempo de recuperação"],
      },
      {
        name: "Depilação a Laser",
        badge: "Definitiva",
        price: 39.99,
        priceFormatted: "A partir de R$ 39,99",
        description: "Sessão rápida, confortável e definitiva por área.",
        features: ["Laser diodo de alta tecnologia", "Mais praticidade no dia a dia", "Conforto térmico"],
      },
    ],
    technologies: ["Criolipólise em Placas 360°", "Lavier", "Laser Diodo de Alta Frequência"],
    faqs: [
      {
        q: "Como garantir minha vaga no Beauty Tech Day?",
        a: "As reservas são feitas antecipadamente pelo site mediante confirmação de Pix para bloqueio exclusivo do horário na agenda.",
      },
      {
        q: "A criolipólise em placas dói?",
        a: "Não. Diferente da criolipólise convencional de sucção, a placa apenas resfria a área de forma plana e confortável, sem risco de queimaduras ou dor.",
      },
    ],
  },
  {
    slug: "pos-operatorio",
    title: "Pós-Operatório Cirúrgico Especializado",
    short: "Prevenção de fibroses, seromas e recuperação segura",
    desc: "Protocolo de alta precisão para cirurgias plásticas em Brasília (Lipo LAD/HD, Abdominoplastia, Mamoplastia, Blefaroplastia e Face). Drenagem manual, ultrassom, radiofrequência e laser alinhados ao seu cirurgião.",
    long: [
      "O pós-operatório cirúrgico define o sucesso estético e funcional da sua cirurgia plástica. Como Bióloga Esteta com mais de 20 anos de experiência clínica, conduzo cada caso com rigor biológico e precisão técnica.",
      "Nosso protocolo atua ativamente na prevenção de fibroses precoces e tardias, drenagem de seromas, manejo de hematomas e aceleração da cicatrização. Levamos equipamentos hospitalares e portáteis para atendimento em domicílio ou na clínica na Asa Norte.",
      "Mantemos contato direto com o cirurgião responsável, garantindo evolução documentada e segurança absoluta em todas as etapas.",
    ],
    bullets: [
      "Drenagem Linfática Reversa Especializada",
      "Prevenção e tratamento avançado de fibroses e aderências",
      "Ultrassom de alta resolução e Radiofrequência controlada",
      "Laserterapia para regeneração e desinflamação",
      "Curativos técnicos e Taping pós-cirúrgico",
    ],
    indications: [
      "Lipoaspiração, Lipo HD / LAD, Vibrolipo",
      "Abdominoplastia e Mini-abdominoplastia",
      "Mamoplastia de aumento, redutora e mastopexia",
      "Lifting facial, rinoplastia e blefaroplastia",
      "Cirurgias ginecológicas e reparadoras",
    ],
    technologies: ["Ultrassom Terapêutico", "Radiofrequência Médica", "Laserterapia de Baixa Potência", "Taping Compressivo"],
    faqs: [
      {
        q: "Em quanto tempo após a cirurgia devo começar?",
        a: "Geralmente entre 24 e 72 horas após o procedimento, sempre com liberação do cirurgião plástico. Quanto mais precoce a drenagem técnica, menor a chance de fibrose.",
      },
      {
        q: "O atendimento pode ser feito na minha casa em Brasília?",
        a: "Sim, realizamos atendimento domiciliar em todo o Distrito Federal com maca profissional e aparelhos esterilizados.",
      },
    ],
  },
  {
    slug: "laserterapia-ilib",
    title: "Laserterapia & Protocolo ILIB",
    short: "Fotobiomodulação celular, imunidade e cicatrização",
    desc: "Aplicação de laser terapêutico de baixa intensidade e irradiação intravascular não invasiva (ILIB) para aceleração de cicatrização, alívio de dores crônicas e equilíbrio celular.",
    long: [
      "A Laserterapia utiliza comprimentos de onda específicos (vermelho e infravermelho) para ativar as mitocôndrias celulares, aumentando a produção de ATP e reduzindo substâncias pró-inflamatórias.",
      "O protocolo ILIB potencializa a circulação, promove relaxamento profundo e reforça o sistema imune. É um tratamento integrativo excelente para pré e pós-operatório, recuperação pós-parto e dores musculares.",
    ],
    bullets: [
      "Estímulo biofotônico de cicatrização celular",
      "Ação anti-inflamatória e analgésica natural",
      "Protocolo ILIB para equilíbrio sistêmico e imunidade",
      "Tratamento de cicatrizes, queloides e lesões",
    ],
    indications: [
      "Cicatrizes cirúrgicas e feridas de difícil cicatrização",
      "Inflamações e edemas pós-operatórios",
      "Fadiga e suporte de imunidade",
    ],
    faqs: [
      {
        q: "A aplicação do laser é segura?",
        a: "Totalmente segura, indolor e não invasiva, realizada com parâmetros científicos precisos para cada objetivo.",
      },    {
            q: "Quantas sessões de laserterapia são necessárias?",
            a: "Depende do objetivo: para cicatrizes cirúrgicas recentes, geralmente de 4 a 8 sessões; para suporte de imunidade e recuperação pós-parto, o protocolo ILIB costuma ser feito em 4 sessões semanais consecutivas.",
  },
  {
            q: "Laserterapia e ILIB podem ser feitos junto com outros tratamentos?",
            a: "Sim. Por serem terapias regenerativas de baixo estímulo, associamos com frequência à drenagem linfática, ao pós-operatório e ao Conexão Materna, potencializando cicatrização e bem-estar sem sobrecarregar o tecido.",
  },
      ],
  },
{
      slug: "drenagem-linfatica",
    title: "Drenagem Linfática Especializada",
    short: "Desintoxicação profunda e redução de retenção líquida",
    desc: "Drenagem linfática manual baseada na fisiologia humana para desobstrução das vias linfáticas, desintoxicação e eliminação imediata da retenção de líquidos.",
    long: [
      "A drenagem linfática realizada com conhecimento biológico estimula a linfa com a pressão e o ritmo corretos para direcionar toxinas e fluidos acumulados aos gânglios de eliminação.",
      "Proporciona alívio imediato de pernas pesadas, redução de inchaço corporal e bem-estar geral.",
    ],
    bullets: [
      "Manobras manuais suaves e precisas",
      "Redução instantânea de inchaço e peso nas pernas",
      "Estímulo da circulação e desintoxicação",
      "Ambiente relaxante com aromaterapia",
    ],
    indications: [
      "Retenção de líquidos e inchaço crônico",
      "Sensação de pernas pesadas e cansaço",
      "Suporte à dieta e rotina de exercícios",
    ],
    faqs: [
      {
        q: "Quantas vezes por semana posso realizar a drenagem?",
        a: "Geralmente 1 a 2 vezes por semana para manutenção, ou mais frequente em períodos específicos de retenção.",
      },
      {
                q: "Drenagem linfática emagrece ou reduz medidas?",
                a: "Não. A drenagem elimina líquido retido, não gordura, então não é um método de emagrecimento. O resultado é redução imediata de inchaço e sensação de leveza, o que pode refletir em centímetros de forma temporária.",
      },
      {
                q: "A drenagem linfática dói?",
                a: "Não. É uma técnica de manobras suaves e leves, muito diferente de uma massagem modeladora. Sente-se apenas relaxamento e, ao final, alívio da sensação de peso.",
      },
    ],
  },
  {
    slug: "flacidez",
    title: "Tratamento para Flacidez Tissular & Muscular",
    short: "Firmeza avançada para pele e musculatura corporal",
    desc: "Associação de Radiofrequência multipolar, ultrassom e correntes eletroterápicas para reestruturar as fibras elásticas de colágeno e tonificar a musculatura profunda.",
    long: [
      "A perda de firmeza corporal pode envolver a derme (flacidez tissular) e o tônus dos músculos (flacidez muscular). Nosso protocolo atua em ambas as frentes de forma sinérgica.",
      "Estimulamos a contração imediata do colágeno existente e induzimos nova síntese dérmica ao longo de semanas com conforto e segurança.",
    ],
    bullets: [
      "Radiofrequência multipolar para síntese de colágeno",
      "Eletroestimulação de tônus muscular",
      "Melhora expressiva da textura e elasticidade da pele",
      "Acompanhamento termográfico de evolução",
    ],
    indications: [
      "Flacidez abdominal pós-parto ou pós-emagrecimento",
      "Flacidez em braços, glúteos e coxas",
      "Envelhecimento cronológico da pele",
    ],
    faqs: [
      {
                q: "Em quanto tempo vejo os resultados na firmeza?",
                a: "A melhora da textura é notada desde as primeiras sessões, e a síntese profunda de colágeno se consolida entre a 4ª e a 8ª semana.",
      },
      {
                q: "Quantas sessões são necessárias para tratar a flacidez?",
                a: "O protocolo costuma ser planejado em ciclos de 8 a 12 sessões, com frequência semanal, associando radiofrequência, ultrassom e eletroestimulação conforme o grau de flacidez tissular e muscular identificado na avaliação.",
      },
      {
                q: "Existe diferença entre flacidez de pele e flacidez muscular?",
                a: "Sim. A flacidez tissular envolve a perda de elasticidade da derme (colágeno e elastina), enquanto a flacidez muscular é a perda de tônus da musculatura profunda. Nosso protocolo trata as duas frentes de forma simultânea e direcionada.",
      },
          ]
  },
];

export type ServiceSlug = (typeof SERVICES)[number]["slug"];

// FAQs gerais (página /faq e seção da Home)
export const GENERAL_FAQS: ServiceFAQ[] = [
  {
    q: "Onde fica localizada a clínica em Brasília?",
    a: "Nosso consultório fica na SEPN 513, Edifício Bittar I, Sala 110 — Asa Norte, Brasília - DF, 70768-900. Também realizamos atendimentos domiciliares e hospitalares com estrutura completa em todo o Distrito Federal.",
  },
  {
    q: "Como funciona a avaliação com a Dra. Umbelina?",
    a: "A avaliação é o primeiro passo para entendermos seu histórico, objetivo e características biológicas. Avaliamos a pele, o tônus tecidual e o estágio pós-cirúrgico/pós-parto para montar um plano personalizado.",
  },
  {
    q: "Como é o atendimento domiciliar?",
    a: "Levamos todos os equipamentos esterilizados, maca profissional, cosméticos e toalhas até sua residência. Você só precisa disponibilizar um espaço tranquilo para seu momento de cuidado.",
  },
  {
    q: "Quais são as formas de pagamento aceitas?",
    a: "Aceitamos Pix (com condições especiais), cartões de crédito (com parcelamento em até 10x), débito e transferência bancária.",
  },
  {
    q: "Quem é a profissional que realiza os procedimentos?",
    a: "Todos os procedimentos e acompanhamentos são conduzidos diretamente pela Dra. Umbelina Mendez, Bióloga por formação (CRBio) e Esteticista com mais de 20 anos de experiência na área de saúde e estética avançada.",
  },
  {
        q: "O que diferencia a Umbelina Mendez de outras clínicas de estética em Brasília?",
        a: "A formação em Biologia (CRBio) permite um diagnóstico baseado em fisiologia real do corpo, não apenas em protocolos padronizados. Os atendimentos são sempre conduzidos pessoalmente pela Dra. Umbelina, com métodos próprios como o Método Reviva™ e o Conexão Materna, avaliação termográfica e mais de 20 anos de prática clínica na Asa Norte, Brasília.",
  },
  {
        q: "O que é o Método Reviva™?",
        a: "É o protocolo corporal exclusivo desenvolvido pela Dra. Umbelina Mendez, que combina drenagem linfática manual de precisão com tecnologias associadas (radiofrequência, criofrequência, ultrassom e eletroterapia) em um acompanhamento contínuo, planejado a partir de avaliação clínica e termográfica.",
  },
  {
        q: "Quais regiões de Brasília e do DF são atendidas?",
        a: "O consultório fica na Asa Norte (SEPN 513, Edifício Bittar I). Além do atendimento clínico, oferecemos visitas domiciliares e hospitalares em todo o Distrito Federal, incluindo Asa Sul, Lago Norte, Lago Sul, Sudoeste, Noroeste, Águas Claras e demais regiões administrativas.",
  },
  {
        q: "Em quanto tempo após o parto ou a cirurgia posso agendar uma avaliação?",
        a: "É possível agendar a avaliação ainda durante a gestação ou no pré-operatório, para planejar o protocolo com antecedência. Após o parto ou a cirurgia, o atendimento pode começar em poucas horas (protocolo hospitalar) ou nos primeiros dias, sempre com liberação médica.",
  },
  {
        q: "Como faço para agendar uma sessão ou avaliação?",
        a: "O agendamento é feito diretamente pelo WhatsApp ou pela página de agendamento do site, informando o procedimento de interesse. A equipe confirma o horário e envia todas as orientações de preparo.",
  },
];

// ==== Tracking + WhatsApp Helpers ====

export type LeadSource =
  | "hero_whatsapp"
  | "hero_agendar"
  | "servico_page"
  | "cta_contato"
  | "fab_whatsapp"
  | "blog_wa"
  | "beauty_tech_day_cta"
  | "promo_card_whatsapp"
  | "pix_confirmation"
  | "form_lead"
  | "promo_bar"
  | "form_agendamento";

export function waLink(message: string, source?: LeadSource, service?: string) {
  const url = new URL(`https://wa.me/${SITE.whatsapp}`);
  let text = message.trim();
  if (source || service) {
    const meta: string[] = [];
    if (source) meta.push(`origem: ${source}`);
    if (service) meta.push(`serviço: ${service}`);
    text += `\n\n[ref: ${meta.join(" | ")}]`;
  }
  url.searchParams.set("text", text);
  return url.toString();
}
