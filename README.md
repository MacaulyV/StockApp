![Descrição banner](https://github.com/user-attachments/assets/402eeff6-592e-424f-ba67-7536cc3c4ead)

# 📦 StockApp – Controle Simples de Estoque

> ## 🎥 Vídeo da Apresentação
>
> [🔗 Link do vídeo](https://youtu.be/UJEqNrj6RZA)
>
> **Obs:** O vídeo acabou ficando com cerca de **10 minutos**.<br>
> Peço desculpas pela duração — mesmo sendo um app simples, tem vários detalhes importantes, então acabei me estendendo um pouco na explicação e o tempo voou.
>
> **Recomendo assistir em 1.5x**, que fica numa velocidade ótima (melhor que 1x ou 2x).

---

## 🚀 **O que é o StockApp?**

Um app rápido e leve pra **cadastrar, buscar, editar e excluir** produtos do seu estoque.

Funciona **offline**, é só abrir e usar.

---

### ✨ **Principais Features:**

- 📦 Cadastro completo de produtos: nome, descrição, lote, quantidade, validade, imagem, código de barras e estado de origem.
- 🔎 Busca e filtros inteligentes (produtos vencidos e a vencer em destaque).
- 🤳 Scanner de código de barras via câmera (ou manual, se preferir).
- 📷 Upload e captura de foto do produto.
- 🧑‍💻 Time responsável com perfil, GitHub e LinkedIn.
- 🔒 Dados persistidos localmente (AsyncStorage).

---

### 📲 **Demonstração Visual**

> Exemplo das telas principais:
> 
- **Splash Screen (**Tela de Carregamento)
- **Listagem de Estoque** (com status visual de vencido/a vencer)
- **Detalhes do Produto** (modal com fundo blur)
- **Formulário de Cadastro/Edição** (scanner, picker de datas, validação ao vivo)
- **Equipe** (cards dos devs e links sociais)

---

### 🤳 **Como usar?**

1. **Abrir o app** – Não precisa login, é só abrir.
2. **Adicionar Produto** – Clique no “+”, preencha os campos, escaneie o código, salve.
3. **filtrar** – Use o filtro para verificar quais produtos vencerão ou vão vencer ainda.
4. **Editar/Remover** – Achou algo errado? Edite ou delete arrastando.
5. **Veja detalhes** – Clique no produto pra mais informações.

---

### 🛡️ **E se eu perder tudo?**

O app salva tudo no seu aparelho (offline), mas **não sincroniza com a nuvem**.

Se desinstalar, perde os dados.

---

### ⚡ **Recursos e Tecnologias**

- **React Native** & **Expo SDK**
- **TypeScript** pra segurança e legibilidade
- **expo-linear-gradient**, **expo-blur** (efeitos visuais top)
- **AsyncStorage** (persistência local)
- **expo-camera**, **expo-image-picker** (scanner e fotos)
- **react-native-element-dropdown** (dropdown UF)
- **date-fns** (datas fáceis de manipular)
- **expo-router** (navegação moderna por arquivos)

---

### 💾 **Estrutura dos Dados**

- **Produto:**
    - id, nome, descrição, data de fabricação, validade, lote, quantidade, código de barras, imagem, estado
- **CRUD:**
    - `getProducts` / `addProduct` / `updateProduct` / `deleteProduct`

---

### 👥 **Equipe**

| Nome | RM | GitHub | LinkedIn |
| --- | --- | --- | --- |
| Daniel Bezerra da Silva Melo | 553792 | [daniel151296](https://github.com/Daniel151296) | [daniel357](https://www.linkedin.com/in/daniel357/) |
| José Alexandre Farias | 553973 | [ycastiel](https://github.com/ycastiel) | [alexandre-de-farias-61a90a308](https://www.linkedin.com/in/alexandre-de-farias-61a90a308/) |
| Macauly Vivaldo da Silva | 553350 | [MacaulyV](https://github.com/MacaulyV) | [macauly-vivaldo-da-silva-1a1514277](https://www.linkedin.com/in/macauly-vivaldo-da-silva-1a1514277/) |

---

## ⚙️ **Quer rodar no seu PC ou celular?**

```bash
1️⃣ Clone o repositório
git clone https://github.com/<seurepo>/StockApp.git
cd StockApp

2️⃣ Instale as dependências
npm install

3️⃣ Instale o Expo CLI (se ainda não tiver)
npm install -g expo-cli

4️⃣ Rode o projeto
npx expo start

```

Depois só escanear o QR com o app Expo Go ou rodar no emulador.

---

**Curtiu? ⭐**
