
import { useNavigate } from 'react-router-dom';
import { Role } from '@/types/game';
import { 
  Scale, 
  Heart, 
  Church, 
  Code, 
  Languages, 
  Radio, 
  Briefcase, 
  GraduationCap 
} from 'lucide-react';

const roles: { name: Role; icon: typeof Scale; color: string }[] = [
  { name: 'Droit', icon: Scale, color: 'from-blue-500 to-blue-600' },
  { name: 'Nurs', icon: Heart, color: 'from-pink-500 to-pink-600' },
  { name: 'Théologie', icon: Church, color: 'from-purple-500 to-purple-600' },
  { name: 'Informatique', icon: Code, color: 'from-green-500 to-green-600' },
  { name: 'Langue Anglaise', icon: Languages, color: 'from-yellow-500 to-yellow-600' },
  { name: 'Communication', icon: Radio, color: 'from-orange-500 to-orange-600' },
  { name: 'Gestion', icon: Briefcase, color: 'from-indigo-500 to-indigo-600' },
  { name: 'Professeur', icon: GraduationCap, color: 'from-red-500 to-red-600' },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: Role) => {
    navigate(`/player/${encodeURIComponent(role)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-600 to-pink-500 flex flex-col items-center justify-center p-8">
      {/* Game Logo */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Brain Flash
        </h1>
        <p className="text-xl text-white/90 font-medium">
          4 Images, 1 Mot - 8 Joueurs en Temps Réel
        </p>
      </div>

      {/* Role Selection Grid */}
      <div className="max-w-6xl w-full">
        <h2 className="text-2xl font-semibold text-white text-center mb-8">
          Choisissez Votre Rôle
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.name}
                onClick={() => handleRoleSelect(role.name)}
                className="group relative bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                
                <div className="flex flex-col items-center space-y-4">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground text-center">
                    {role.name}
                  </h3>
                </div>

                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-muted group-hover:bg-success transition-colors duration-300" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-16 text-center text-white/80">
        <p className="text-sm">
          En attente de 8 joueurs pour commencer la partie
        </p>
      </div>
    </div>
  );
}