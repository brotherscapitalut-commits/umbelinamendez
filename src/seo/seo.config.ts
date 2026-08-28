export type RouteSeo = {
  title: string;
  description: string;
  h1?: string;
  type?: "website" | "article" | "service";
  image?: string;
};

export const seoConfig: Record<string, RouteSeo> = {
  "/": {
    title: "Pós-Operatório e Drenagem Linfática em Brasília | Umbelina Mendez",
    description: "Bióloga esteta na Asa Norte, Brasília. Drenagem linfática, pós-operatório de cirurgia plástica e recuperação pós-parto com protocolo individualizado. Agende.",
    type: "website",
  },
  "/tratamentos": {
    title: "Tratamentos Estéticos em Brasília — Asa Norte | Umbelina Mendez",
    description: "Pós-operatório, pós-parto, drenagem linfática, laserterapia e tecnologias corporais na Asa Norte, Brasília. Veja todos os protocolos e agende.",
    type: "website",
  },
  "/agendamento": {
    title: "Agendar Avaliação em Brasília — Asa Norte | Umbelina Mendez",
    description: "Agende sua avaliação com bióloga esteta na Asa Norte, Brasília. Pós-operatório, pós-parto, drenagem linfática e laserterapia. Horários disponíveis.",
    type: "website",
  },
  "/faq": {
    title: "Dúvidas Frequentes sobre Pós-Operatório e Drenagem | Brasília",
    description: "Quando começar a drenagem após a cirurgia, quantas sessões são necessárias, o que esperar do pós-parto. Respostas de bióloga esteta em Brasília.",
    type: "website",
  },
  "/blog": {
    title: "Blog — Pós-Operatório, Pós-Parto e Drenagem | Brasília",
    description: "Conteúdo sobre recuperação de cirurgia plástica, cuidados no puerpério e drenagem linfática, escrito por bióloga esteta na Asa Norte, Brasília.",
    type: "website",
  },
  "/servicos/pos-operatorio": {
    title: "Pós-Operatório de Cirurgia Plástica em Brasília — Asa Norte",
    description: "Recuperação pós-cirúrgica com drenagem linfática, laserterapia e liberação de fibrose. Bióloga esteta na Asa Norte, Brasília. Agende sua avaliação.",
    type: "service",
  },
  "/servicos/drenagem-linfatica": {
    title: "Drenagem Linfática em Brasília: Reduz Inchaço e Fibrose",
    description: "Drenagem linfática especializada na Asa Norte: pós-operatório, pós-parto, lipedema e retenção. Protocolo individualizado por bióloga esteta. Agende.",
    type: "service",
  },
  "/servicos/conexao-materna": {
    title: "Recuperação Pós-Parto em Brasília | Conexão Materna",
    description: "Cuidado pós-parto e pós-cesárea na Asa Norte: laserterapia na cicatriz, ILIB sistêmico e drenagem humanizada em 4 sessões. Atendimento em Brasília.",
    type: "service",
  },
  "/servicos/laserterapia-ilib": {
    title: "Laserterapia e ILIB em Brasília — Cicatriz e Recuperação",
    description: "Laserterapia para cicatriz de cesárea e cirurgia, com protocolo ILIB sistêmico. Bióloga esteta na Asa Norte, Brasília. Agende sua avaliação.",
    type: "service",
  },
  "/servicos/beauty-tech-day": {
    title: "Criolipólise de Placas e Laser em Brasília | Beauty Tech Day",
    description: "Criolipólise de placas, tecnologia Lavier facial e depilação a laser em dia único na Asa Norte, Brasília. Condições especiais. Veja as vagas.",
    type: "service",
  },
  "/servicos/flacidez": {
    title: "Tratamento para Flacidez Corporal em Brasília — Asa Norte",
    description: "Flacidez tissular e muscular tratada com tecnologia e protocolo progressivo. Avaliação por bióloga esteta na Asa Norte, Brasília. Agende.",
    type: "service",
  },
  "/servicos/metodo-reviva": {
    title: "Método Reviva™: Tratamento Corporal Progressivo em Brasília",
    description: "Protocolo corporal em etapas, com avaliação biológica e acompanhamento contínuo. Bióloga esteta na Asa Norte, Brasília. Conheça o Método Reviva™.",
    type: "service",
  },
  "/servicos/reviva-face": {
    title: "Reviva Face™: Rejuvenescimento Facial em 60 Dias | Brasília",
    description: "Protocolo facial de 60 dias com avaliação biológica e tecnologias combinadas. Bióloga esteta na Asa Norte, Brasília. Agende sua avaliação.",
    type: "service",
  },
  
  // Blog posts
  "/blog/pos-operatorio-brasilia-guia-completo": {
    title: "Como é o pós-operatório em Brasília? | Umbelina Mendez, DF",
    description: "O pós-operatório define o resultado da sua cirurgia plástica. Em Brasília, ter um protocolo estruturado faz toda a diferença para uma recuperação segura.",
    type: "article",
    h1: "Pós-operatório em Brasília: guia completo para uma recuperação segura"
  },
  "/blog/drenagem-linfatica-brasilia-como-funciona": {
    title: "Como funciona a drenagem linfática em Brasília? | Umbelina",
    description: "A drenagem linfática manual estimula o sistema a eliminar líquidos retidos. Diferente da massagem modeladora, ela não deforma tecido nem provoca dor.",
    type: "article",
    h1: "Drenagem linfática em Brasília: como funciona e para quem é indicada"
  },
  "/blog/pos-parto-cuidados-puerperio-brasilia": {
    title: "Quais os cuidados no puerpério e pós-parto em Brasília? | UM",
    description: "Os primeiros 40 dias após o parto são de transformação profunda. Um cuidado especializado no puerpério acelera a recuperação e alivia a sobrecarga física.",
    type: "article",
    h1: "Pós-parto em Brasília: cuidados no puerpério que fazem diferença"
  },
  "/blog/drenagem-pos-operatorio-diferencas": {
    title: "Drenagem estética x pós-operatória: qual a diferença? | UM",
    description: "Apesar de usarem o mesmo princípio para estimular o sistema linfático, a drenagem pós-operatória exige manejo cuidadoso do tecido em fase de cicatrização.",
    type: "article",
    h1: "Drenagem estética x drenagem pós-operatória: qual é a diferença?"
  }
};
