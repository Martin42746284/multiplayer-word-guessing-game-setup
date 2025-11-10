
export default function PublicDisplay() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Affichage Public
          </h1>
          <p className="text-muted-foreground">
            Écran central pour tous les joueurs
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Interface d'affichage public à implémenter
          </p>
        </div>
      </div>
    </div>
  );
}