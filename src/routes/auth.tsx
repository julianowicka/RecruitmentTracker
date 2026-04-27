import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LoginForm, RegisterForm } from '../components/auth/AuthForms';

const authSearchSchema = z.object({
  mode: z.enum(['login', 'register']).optional().catch('login'),
});

export const Route = createFileRoute('/auth')({
  component: AuthPage,
  validateSearch: authSearchSchema,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = Route.useNavigate();
  const activeMode = mode ?? 'login';

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Recruitment Tracker</h1>

      <Tabs
        value={activeMode}
        onValueChange={(nextMode) => {
          navigate({
            search: { mode: nextMode as 'login' | 'register' },
          });
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Logowanie</TabsTrigger>
          <TabsTrigger value="register">Załóż konto</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm />
        </TabsContent>

        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Załóż konto albo zaloguj się, jeśli masz już dostęp.</p>
      </div>
    </div>
  );
}
