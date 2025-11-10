
import { useParams } from 'react-router-dom';

export default function PlayerScreen() {
  const { role } = useParams();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Écran Joueur
          </h1>
          <p className="text-muted-foreground">
            Rôle sélectionné: <span className="font-semibold text-primary">{role}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Interface de jeu à implémenter
          </p>
        </div>
      </div>
    </div>
  );
}