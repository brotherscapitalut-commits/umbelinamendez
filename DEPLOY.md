# 🚀 Guia de Deploy — Umbelina Mendez Site

Este arquivo explica como subir alterações do código local para o site real (via GitHub → Vercel).

---

## ✅ Pré-requisito: Abrir o PowerShell na pasta certa

1. Abra o **PowerShell** (ou o terminal do VS Code)
2. Navegue até a pasta do projeto:

```powershell
cd "D:\Notebook\PEDRO\ProjetoProgramas\Belinha\umbelina-glow-site-main"
```

---

## 🔁 Fluxo completo após fazer alterações

Execute os comandos abaixo **na ordem**, um por vez:

### 1. Verificar o que mudou
```powershell
git status
```
> Mostra os arquivos que foram alterados. Confirme que as mudanças são as esperadas.

---

### 2. Adicionar todos os arquivos alterados
```powershell
git add -A
```
> Prepara **todas** as alterações para o commit.

---

### 3. Criar o commit com uma mensagem descritiva
```powershell
git commit -m "feat: descricao do que foi alterado"
```
> Substitua a mensagem entre aspas por algo que descreva o que você fez.  
> **Exemplos de mensagens:**
> - `"feat: novo texto na home"`
> - `"fix: correcao do botao de agendamento"`
> - `"feat: atualiza horarios da agenda"`
> - `"style: ajuste de cores no cabecalho"`

---

### 4. Enviar para o GitHub (e deploy automático no Vercel)
```powershell
git push origin main
```
> Após isso, o **Vercel detecta o push automaticamente** e faz o deploy em ~1-2 minutos.

---

## ⚡ Versão rápida (tudo em uma linha)

Se quiser fazer tudo de uma vez só, copie e cole isso no PowerShell:

```powershell
git add -A; git commit -m "feat: atualizacao do site"; git push origin main
```

> ⚠️ Lembre de trocar `"feat: atualizacao do site"` por uma mensagem que descreva sua alteração.

---

## 🌐 Como acompanhar o deploy

Após o `git push`, acesse:

👉 **https://vercel.com/dashboard**

Procure pelo projeto **umbelinamendez** e veja o status.  
Quando aparecer ✅ **Ready**, o site real já está atualizado.

---

## 🛠️ Comandos úteis extras

| Comando | Para que serve |
|---|---|
| `git status` | Ver o que mudou |
| `git log --oneline -5` | Ver os 5 últimos commits enviados |
| `git diff` | Ver exatamente o que foi alterado linha a linha |
| `npm run dev` | Rodar o site localmente para testar antes de subir |
| `npm run build` | Gerar o build de produção (feito automaticamente pelo Vercel) |

---

## 🔧 Testar localmente antes de subir

Se quiser **testar no navegador** antes de fazer o push:

```powershell
npm run dev
```

Abre o site em `http://localhost:5174` — teste tudo, depois faça o push quando estiver pronto.

---

## ❓ Problemas comuns

**Erro: `'git' is not recognized`**  
→ Git não está instalado. Baixe em: https://git-scm.com/download/win

**Erro: `remote: Permission denied`**  
→ Você precisa estar autenticado no GitHub. Execute:
```powershell
git config --global user.email "seu@email.com"
git config --global user.name "Seu Nome"
```

**Erro: `Updates were rejected`**  
→ O repositório remoto tem mudanças que você não tem. Execute primeiro:
```powershell
git pull origin main
```
Depois repita o `git add`, `git commit` e `git push`.
