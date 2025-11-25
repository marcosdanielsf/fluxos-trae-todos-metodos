# 🔧 Troubleshooting - Assembly Line

## ❌ Erro: "Module not found: Can't resolve '@/lib/utils'"

Este é o erro mais comum ao executar pela primeira vez. Aqui estão **3 soluções** testadas:

---

## ✅ Solução 1: Usar o Script Automático (MAIS FÁCIL)

### No Terminal do Mac:

```bash
# Navegue até o diretório do projeto
cd ~/Documents/fluxos-trae-todos-metodos

# Execute o script de correção
./fix-build.sh
```

Se der erro de permissão:
```bash
chmod +x fix-build.sh
./fix-build.sh
```

---

## ✅ Solução 2: Limpeza Manual (PASSO A PASSO)

### No Terminal do Mac:

```bash
# 1. Vá para a pasta da aplicação
cd ~/Documents/fluxos-trae-todos-metodos/assembly-line

# 2. Limpe o cache do Next.js
rm -rf .next

# 3. Remova node_modules e package-lock.json
rm -rf node_modules package-lock.json

# 4. Limpe o cache do npm
npm cache clean --force

# 5. Reinstale as dependências
npm install

# 6. Execute novamente
npm run dev
```

---

## ✅ Solução 3: Verificar Instalação do Node.js

### Verifique a versão do Node.js:

```bash
node --version
```

**Versão mínima requerida:** `v18.0.0` ou superior

### Se a versão for menor, atualize:

1. Visite: https://nodejs.org/
2. Baixe e instale a versão LTS (recomendada)
3. Feche e reabra o Terminal
4. Verifique novamente: `node --version`

---

## 🔍 Outros Problemas Comuns

### Erro: "Port 3000 is already in use"

**Solução:** Use outra porta

```bash
npm run dev -- -p 3001
```

Depois acesse: `http://localhost:3001`

---

### Erro: "command not found: npm"

**Solução:** Instale o Node.js

1. Visite: https://nodejs.org/
2. Baixe e instale a versão LTS
3. Reinicie o Terminal
4. Teste: `npm --version`

---

### Erro: "permission denied"

**Solução:** Use sudo (com cuidado)

```bash
sudo npm install
```

OU mude as permissões da pasta:

```bash
sudo chown -R $(whoami) ~/Documents/fluxos-trae-todos-metodos
```

---

### Aplicação carrega mas está em branco

**Solução:** Limpe o cache do navegador

1. Pressione `Cmd + Shift + R` (Chrome/Edge)
2. OU `Cmd + Option + E` (Safari)
3. Recarregue a página

---

### Erro: "Cannot find module 'framer-motion'"

**Solução:** Reinstale as dependências

```bash
cd ~/Documents/fluxos-trae-todos-metodos/assembly-line
npm install
```

---

## 📋 Checklist de Verificação

Antes de pedir ajuda, verifique:

- [ ] Node.js versão >= 18.0.0
- [ ] npm está instalado e funcionando
- [ ] Você está na pasta correta (`assembly-line`)
- [ ] O arquivo `lib/utils.ts` existe
- [ ] O arquivo `tsconfig.json` existe
- [ ] O arquivo `package.json` existe
- [ ] Executou `npm install` completamente
- [ ] Não há erros durante `npm install`

### Como verificar:

```bash
# Verifique o Node.js
node --version

# Verifique o npm
npm --version

# Verifique se está na pasta certa
pwd
# Deve mostrar: .../fluxos-trae-todos-metodos/assembly-line

# Verifique se os arquivos existem
ls -la lib/utils.ts
ls -la tsconfig.json
ls -la package.json
```

---

## 🆘 Ainda com Problemas?

Se nenhuma solução funcionou, **copie e cole TODOS os comandos abaixo** no Terminal:

```bash
# Apagar tudo e começar do zero
cd ~/Documents
rm -rf fluxos-trae-todos-metodos

# Clonar repositório novamente
git clone https://github.com/marcosdanielsf/fluxos-trae-todos-metodos.git

# Entrar no diretório
cd fluxos-trae-todos-metodos

# Mudar para o branch correto
git checkout claude/assembly-line-ai-marketing-app-011CUfAseJNqesSc8CNVpeRD

# Entrar na aplicação
cd assembly-line

# Instalar dependências
npm install

# Executar
npm run dev
```

---

## 📸 Envie Evidências

Se ainda assim não funcionar, me envie:

1. **Versão do Node.js:**
   ```bash
   node --version
   ```

2. **Resultado do npm install:**
   ```bash
   npm install 2>&1 | tee install-log.txt
   cat install-log.txt
   ```

3. **Conteúdo do tsconfig.json:**
   ```bash
   cat tsconfig.json
   ```

4. **Estrutura de pastas:**
   ```bash
   ls -la
   ls -la lib/
   ```

---

## ✅ Como Saber se Funcionou?

Quando tudo estiver correto, você verá:

```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
- Environments: .env

✓ Starting...
✓ Ready in 2.3s
```

E ao acessar `http://localhost:3000` verá a **tela de login azul/roxa**.

---

**Última atualização:** 31/10/2025
