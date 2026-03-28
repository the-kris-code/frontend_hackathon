# frontend_hackathon# Assistente Virtual Docente 

Uma plataforma educacional inteligente projetada exclusivamente para **professores da rede pública de ensino básico**. 

O objetivo central deste projeto é combater a sobrecarga de trabalho e a exaustiva "dupla jornada" docente, automatizando a criação de materiais didáticos, planos de aula e atividades complementares, permitindo que o professor foque no que realmente importa: **o ensino e o aluno**.

---

## O Problema que Resolvemos
Professores da rede pública frequentemente gastam horas do seu tempo livre (finais de semana e noites) planejando aulas, redigindo exercícios e alinhando conteúdos às exigências da BNCC (Base Nacional Comum Curricular). Nossa ferramenta atua como um "co-piloto" educacional, reduzindo drasticamente esse tempo de planejamento por meio de Inteligência Artificial generativa.

---

##  Principais Funcionalidades

### 🏫 Gestão Escolar (CRUD Completo)
Um painel administrativo intuitivo para organizar a rotina do professor:
* **Períodos:** Cadastro e gestão de bimestres/semestres.
* **Matérias:** Organização por áreas de conhecimento.
* **Turmas:** Controle de turmas associadas aos anos escolares.
* **Aulas:** Planejamento de calendário e vínculo com matérias e turmas.

###  Inteligência Artificial (Agente Chronos)
Integração profunda com IA para geração de conteúdo educacional:
* **Gerador de Plano de Aula:** Criação automática de planos contendo Objetivo, Metodologia, Recursos Didáticos e Avaliação, apenas informando o tema e a habilidade BNCC.
* **Chat Contextualizado:** Um chat interativo onde o professor pode dialogar com a IA para construir o conteúdo da aula passo a passo. O histórico de chats é salvo e vinculado a cada aula específica.
* **Gerador de Atividades Complementares:** Criação de listas de exercícios (com gabarito para o professor e instruções para os alunos) baseadas nos temas discutidos nas aulas.

###  Integração 100% BNCC
* Filtros dinâmicos e inteligentes que cruzam **Matérias** e **Anos Escolares** para entregar ao professor exatamente os códigos e descrições das Habilidades da BNCC necessárias para o seu planejamento.

### Exportação e Praticidade
* Renderização de respostas da IA em **Markdown** rico (títulos, listas, negritos e blocos de citação).
* Exportação de atividades e planos de aula diretamente para **PDF** (layout limpo e pronto para impressão).
* Opções de cópia rápida para a área de transferência.

---

## Tecnologias Utilizadas

### Front-end
* **React.js:** Biblioteca principal para construção da interface.
* **Styled-Components:** Estilização componentizada, garantindo um design moderno e responsivo.
* **React-Markdown:** Renderização do conteúdo gerado pela IA.
* **Axios:** Comunicação HTTP com o back-end.
* **Html2Pdf.js:** Geração de arquivos PDF direto no lado do cliente.
* **SweetAlert2:** Feedbacks visuais e alertas elegantes para o usuário.

### Back-end & Integrações (Conceitual)
* **Node.js / Express:** API RESTful.
* **Prisma ORM:** Modelagem de banco de dados e relacionamentos.
* **PostgreSQL:** Banco de dados relacional.
* **Zod:** Validação de dados de entrada.
* **JWT (JSON Web Token):** Autenticação e segurança das rotas (`Bearer Token`).

---

## Acesso ao projeto
https://frontend-hackathon-4phr.onrender.com