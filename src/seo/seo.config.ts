export type RouteSeo = {
    title: string;
    description: string;
    h1?: string;
    type?: "website" | "article" | "service";
    image?: string;
};

export const seoConfig: Record<string, RouteSeo> = {
    "/": {
          title: "Bióloga Esteta em Brasília: Pós-Op e Pós-Parto | Umbelina",
          description: "CRBio, 20+ anos de experiência. Método Reviva™, Conexão Materna e drenagem pós-cirúrgica com protocolo biológico na Asa Norte, Brasília. Agende sua avaliação.",
          type: "website",
    },
    "/tratamentos": {
          title: "Tratamentos com Base Biológica em Brasília | Umbelina Mendez",
          description: "Método Reviva™, Reviva Face™, Conexão Materna, drenagem, laserterapia e pós-operatório com avaliação biológica na Asa Norte, Brasília. Conheça todos.",
          type: "website",
    },
    "/agendamento": {
          title: "Agende sua Avaliação com Bióloga Esteta | Brasília",
          description: "Avaliação biológica individualizada na Asa Norte, Brasília. Pós-operatório, pós-parto, drenagem linfática e laserterapia com a Dra. Umbelina Mendez.",
          type: "website",
    },
    "/faq": {
          title: "Perguntas Frequentes: Pós-Operatório e Pós-Parto | Brasília",
          description: "Quando iniciar a drenagem, quantas sessões fazer, como funciona o atendimento domiciliar. Respostas diretas da bióloga esteta CRBio em Brasília - DF.",
          type: "website",
    },
    "/blog": {
          title: "Blog de Recuperação Pós-Cirúrgica e Pós-Parto | Brasília",
          description: "Artigos com base científica sobre pós-operatório, puerpério e drenagem linfática, escritos pela bióloga esteta Umbelina Mendez na Asa Norte, Brasília.",
          type: "website",
    },
    "/servicos/pos-operatorio": {
          title: "Drenagem Pós-Operatória em Brasília: Reduz Fibrose e Inchaço",
          description: "Protocolo pós-cirúrgico com drenagem linfática manual, laserterapia e liberação miofascial. Início em até 72h, atendimento clínico ou domiciliar em Brasília.",
          type: "service",
    },
    "/servicos/drenagem-linfatica": {
          title: "Drenagem Linfática em Brasília: Bióloga Esteta CRBio",
          description: "Drenagem linfática manual para pós-operatório, pós-parto, lipedema e retenção crônica. Protocolo individualizado na Asa Norte, Brasília. Agende sua sessão.",
          type: "service",
    },
    "/servicos/conexao-materna": {
          title: "Conexão Materna: Recuperação Pós-Parto em Brasília",
          description: "Protocolo pós-parto e pós-cesárea com laserterapia na cicatriz, ILIB sistêmico e drenagem humanizada, iniciado ainda na maternidade. Atendimento em Brasília.",
          type: "service",
    },
    "/servicos/laserterapia-ilib": {
          title: "Laserterapia e ILIB em Brasília: Cicatrização e Imunidade",
          description: "Laser regenerativo para cicatrizes de cesárea e cirurgia, com ILIB sistêmico para oxigenação e imunidade. Protocolo científico na Asa Norte, Brasília.",
          type: "service",
    },
    "/servicos/beauty-tech-day": {
          title: "Beauty Tech Day em Brasília: Criolipólise e Laser Facial",
          description: "Criolipólise de placas sem sucção, Lavier facial e depilação a laser em dia único, com horário reservado. Condições exclusivas na Asa Norte, Brasília.",
          type: "service",
    },
    "/servicos/flacidez": {
          title: "Tratamento de Flacidez Corporal em Brasília | Bióloga Esteta",
          description: "Flacidez tissular e muscular tratada com protocolo progressivo e tecnologia combinada. Resultados a partir da 4ª semana. Avaliação na Asa Norte, Brasília.",
          type: "service",
    },
    "/servicos/metodo-reviva": {
          title: "Método Reviva™ em Brasília: Protocolo Corporal Exclusivo",
          description: "Acompanhamento corporal contínuo com drenagem de precisão, radiofrequência, criofrequência e ultrassom. Método exclusivo da Dra. Umbelina Mendez em Brasília.",
          type: "service",
    },
    "/servicos/reviva-face": {
          title: "Reviva Face™: Rejuvenescimento Facial em 60 Dias | Brasília",
          description: "Protocolo facial de 60 dias com diagnóstico Dermoscan, microagulhamento e laser regenerativo. Colágeno ativado por bióloga esteta na Asa Norte, Brasília.",
          type: "service",
    },

    // Blog posts will be loaded dynamically from Supabase
};
