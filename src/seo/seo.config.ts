export type RouteSeo = {
    title: string;
    description: string;
    h1?: string;
    type?: "website" | "article" | "service";
    image?: string;
};

export const seoConfig: Record<string, RouteSeo> = {
    "/": {
          title: "Bióloga Esteta: Estética e Pós-Op | Umbelina Mendez",
          description: "Dra. Umbelina Mendez, Bióloga Esteta (CRBio). Drenagem Linfática, Pós-Operatório e Método Reviva™ na Asa Norte, Brasília. Agende sua avaliação clínica.",
          type: "website",
    },
    "/tratamentos": {
          title: "Tratamentos com Base Biológica em Brasília | Umbelina",
          description: "Protocolos: Método Reviva™, Conexão Materna, drenagem linfática e recuperação pós-cirúrgica na Asa Norte, DF. Conheça nossos tratamentos.",
          type: "website",
    },
    "/agendamento": {
          title: "Agendar Avaliação com Bióloga Esteta na Asa Norte, DF",
          description: "Agende sua consulta estética ou pós-operatório em Brasília. Avaliação individualizada para drenagem e estética avançada. Atendimento clínico e domiciliar.",
          type: "website",
    },
    "/atendimento-domiciliar": {
          title: "Atendimento Domiciliar de Estética no DF | Dra. Umbelina",
          description: "Drenagem linfática pós-operatório, pós-parto e Método Reviva™ no conforto do seu lar no Distrito Federal (Asa Sul, Asa Norte, Lago Sul, Noroeste).",
          type: "website",
    },
    "/faq": {
          title: "Dúvidas Frequentes: Estética e Pós-Op em Brasília",
          description: "Tire suas dúvidas sobre drenagem linfática, recuperação plástica, domicílio e tecnologias estéticas (Radiofrequência). Respostas da Dra. Umbelina Mendez.",
          type: "website",
    },
    "/blog": {
          title: "Blog: Estética e Recuperação Pós-Cirúrgica | Brasília",
          description: "Artigos e respostas reais sobre pós-operatório (lipo, abdominoplastia), puerpério e estética avançada. Por Dra. Umbelina Mendez.",
          type: "website",
    },
    "/servicos/pos-operatorio": {
          title: "Drenagem Pós-Operatório em Brasília (Asa Norte e Casa)",
          description: "Recuperação cirúrgica em Brasília (Lipo LAD, Abdominoplastia). Drenagem reversa, ultrassom e laser para prevenção de fibroses. Agende agora.",
          type: "service",
    },
    "/servicos/drenagem-linfatica": {
          title: "Drenagem Linfática Manual Especializada em Brasília DF",
          description: "Drenagem linfática para retenção, lipedema e inchaço. Protocolo biológico da Dra. Umbelina Mendez na Asa Norte e domiciliar no DF.",
          type: "service",
    },
    "/servicos/conexao-materna": {
          title: "Conexão Materna: Recuperação Pós-Parto em Domicílio DF",
          description: "Pós-parto no hospital ou em domicílio (Brasília). Laserterapia na cicatriz, ILIB de imunidade e drenagem linfática para mamães.",
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
