import AvatarCustomizer from "../components/avatar/AvatarCustomizer";

export default function AvatarTestPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-950">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Entorno de Pruebas: Creador de Avatar
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Espacio seguro de desarrollo para cosméticos y personalización.
        </p>
      </div>
      
      <AvatarCustomizer />
    </main>
  );
}