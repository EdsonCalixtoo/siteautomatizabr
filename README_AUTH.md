# 🔐 Autenticação com Supabase - Guia Prático

## ✅ O que foi criado

### Arquivos novos:
1. **`src/lib/supabase.ts`** - Configuração do cliente Supabase
2. **`src/contexts/AuthContext.tsx`** - Contexto de autenticação com hooks
3. **`src/pages/Login.tsx`** - Página de login/cadastro
4. **`src/components/AuthButton.tsx`** - Botão de autenticação no header
5. **`src/components/ProtectedRoute.tsx`** - Componente para proteger rotas
6. **`.env.local.example`** - Exemplo de configuração de variáveis

### Arquivos atualizados:
- **`src/App.tsx`** - Adicionado AuthProvider e ProtectedRoute
- **`src/components/layout/Header.tsx`** - Integrado AuthButton
- **`package.json`** - Instalado @supabase/supabase-js

## 🚀 Como usar

### 1. Configurar o Supabase (NECESSÁRIO)

#### Criar um projeto no Supabase:
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados (nome, senha, etc)
4. Aguarde o projeto ser criado

#### Obter as credenciais:
1. No dashboard, vá para **Settings** > **API**
2. Copie:
   - **URL**: `https://seu-projeto.supabase.co`
   - **Anon Key**: A chave pública

#### Criar arquivo `.env.local`:
```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 2. Usar a Autenticação no Código

#### Hook `useAuth()` - para usar em componentes:
```tsx
import { useAuth } from "@/contexts/AuthContext";

function MeuComponente() {
  const { user, loading, signIn, signOut, signUp, resetPassword } = useAuth();

  // user: objeto do usuário logado (null se deslogado)
  // loading: boolean indicando se está carregando
  // signIn: função para fazer login
  // signOut: função para fazer logout
  // signUp: função para criar nova conta
  // resetPassword: função para resetar senha

  if (loading) return <p>Carregando...</p>;

  if (!user) {
    return <button onClick={() => navigate("/login")}>Login</button>;
  }

  return (
    <div>
      <p>Bem-vindo {user.email}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

#### ProtectedRoute - para proteger páginas:
```tsx
// Já implementado em App.tsx:
<Route
  path="/minha-conta"
  element={
    <ProtectedRoute>
      <CustomerArea />
    </ProtectedRoute>
  }
/>
```

### 3. Páginas e Rotas

| Rota | Descrição | Requer Login? |
|------|-----------|---------------|
| `/login` | Página de login/cadastro | ❌ Não |
| `/minha-conta` | Perfil do usuário | ✅ Sim |
| `/admin/dashboard` | Dashboard administrativo | ✅ Sim |

### 4. AuthButton - Botão no Header

O botão já está integrado no header (`src/components/AuthButton.tsx`):
- **Deslogado**: Mostra botão "Login"
- **Logado**: Mostra menu com opções de Perfil, Dashboard e Logout

## 📚 Exemplos de Uso

### Fazer login:
```tsx
const { signIn } = useAuth();

try {
  const { error } = await signIn("email@example.com", "senha123");
  if (error) {
    console.error("Erro ao fazer login:", error.message);
  }
} catch (err) {
  console.error("Erro:", err);
}
```

### Criar conta:
```tsx
const { signUp } = useAuth();

try {
  const { error } = await signUp("novo@example.com", "senha123");
  if (error) {
    console.error("Erro ao criar conta:", error.message);
  } else {
    console.log("Confira seu email para confirmar a conta!");
  }
} catch (err) {
  console.error("Erro:", err);
}
```

### Fazer logout:
```tsx
const { signOut } = useAuth();

try {
  const { error } = await signOut();
  if (error) {
    console.error("Erro ao fazer logout:", error.message);
  } else {
    navigate("/");
  }
} catch (err) {
  console.error("Erro:", err);
}
```

### Resetar senha:
```tsx
const { resetPassword } = useAuth();

try {
  const { error } = await resetPassword("email@example.com");
  if (error) {
    console.error("Erro ao resetar senha:", error.message);
  } else {
    console.log("Email de reset enviado!");
  }
} catch (err) {
  console.error("Erro:", err);
}
```

## 🔒 Segurança

1. **Chave Anônima**: A chave no `.env.local` é a chave pública (anónima)
2. **Nunca compartilhe**: Não compartilhe sua chave secreta ou credenciais
3. **Row Level Security (RLS)**: Configure RLS no Supabase para proteger dados
4. **Validação**: O Supabase valida automaticamente emails e senhas

## 🐛 Troubleshooting

### "Erro: credenciais não configuradas"
- Verifique se o arquivo `.env.local` existe
- Confirme que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão preenchidos
- Reinicie o servidor (`npm run dev`)

### "Erro ao fazer login"
- Verifique se o email está correto
- Confirme que a conta foi criada primeiro
- Verifique se o email foi confirmado (check no seu email)

### "Erro 401 Unauthorized"
- A chave anônima pode estar inválida
- Copie novamente a chave do dashboard do Supabase

## 📖 Documentação Oficial

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript SDK](https://supabase.com/docs/reference/javascript)
- [React Auth Examples](https://supabase.com/docs/guides/auth/social-login)

## ✨ Próximas Etapas Recomendadas

1. **Tabela de Usuários**: Criar tabela `public.users` no Supabase
2. **Perfil do Usuário**: Adicionar foto, nome, etc
3. **Recuperação de Senha**: Configurar email de reset
4. **2FA (Two-Factor Authentication)**: Adicionar segurança extra
5. **OAuth**: Integrar login com Google, GitHub, etc

---

**Última atualização**: 9 de fevereiro de 2026
**Versão do Supabase SDK**: ^2.x
