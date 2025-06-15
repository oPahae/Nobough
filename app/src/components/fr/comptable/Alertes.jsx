import {
    AlertCircle, DollarSign, Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function ({ budget, dettes }) {
    const [alertes, setAlertes] = useState([]);
    const [recommandations, setRecommandations] = useState([]);
    const [modelInitialized, setModelInitialized] = useState(true);

    const normaliser = (valeur, min, max) => {
        return (valeur - min) / (max - min);
    };

    const analyserDettesAvecIA = async (budget, dettes) => {
        const dettesNonPayees = dettes.filter(dette => dette.status === "nonpaye");
        
        if (dettesNonPayees.length === 0) return [];
        
        const features = dettesNonPayees.map(dette => {
            const deadline = new Date(dette.deadline);
            const aujourdhui = new Date();
            const joursRestants = Math.max(0, Math.floor((deadline - aujourdhui) / (1000 * 60 * 60 * 24)));
            
            const dateCreation = new Date(dette.created_At);
            const anciennete = Math.floor((aujourdhui - dateCreation) / (1000 * 60 * 60 * 24));
            
            const ratioBudget = dette.montant / Math.max(budget.reel, 1);
            
            return {
                id: dette.id,
                joursRestants,
                anciennete, 
                ratioBudget,
                montant: dette.montant,
                label: dette.label
            };
        });

        try {
            const maxJoursRestants = Math.max(...features.map(f => f.joursRestants), 30);
            const maxAnciennete = Math.max(...features.map(f => f.anciennete), 365);
            
            // tenseurs d'entrée
            const inputData = features.map(f => [
                normaliser(Math.max(30 - f.joursRestants, 0), 0, 30), // urgence
                normaliser(f.anciennete, 0, maxAnciennete), // anciennete
                f.montant <= budget.reel ? 1.0 : 0.0, // payable ?
                normaliser(f.ratioBudget, 0, 3)  // % de budget ?
            ]);
            
            ///////////////////////////////////////////////////////////
            
            const xs = tf.tensor2d(inputData); // -> tenseur
            const model = tf.sequential(); // créer réseau
            
            model.add(tf.layers.dense({
                inputShape: [4],
                units: 8,
                activation: 'relu', // garder les valeurs >= 0
                kernelInitializer: 'varianceScaling'
            }));
            
            model.add(tf.layers.dense({
                units: 4,
                activation: 'relu',
                kernelInitializer: 'varianceScaling'
            }));
            
            model.add(tf.layers.dense({
                units: 1,
                activation: 'sigmoid', // 0 <= score <= 1
                kernelInitializer: 'varianceScaling'
            }));
            
            model.compile({
                optimizer: tf.train.adam(0.01),
                loss: 'meanSquaredError'
            });
            
            ///////////////////////////////////////////////////////////
            
            const weights = [
                tf.tensor2d([[0.6], [0.3], [0.9], [0]], [4, 1]),
                tf.tensor1d([0.5]),
            ];
            
            model.layers[model.layers.length-1].setWeights(weights);
            
            const predictions = model.predict(xs);
            const scoresArray = await predictions.array();
            
            xs.dispose();
            predictions.dispose();
            model.dispose();
            
            const dettesAvecScore = features.map((f, i) => ({
                ...f,
                score: scoresArray[i][0] * 100
            }));
            
            return dettesAvecScore.sort((a, b) => b.score - a.score);
            
        } catch (err) {
            return features.map(f => {
                const scoreUrgence = Math.max(30 - f.joursRestants, 0) * 3;
                const scoreAnciennete = Math.min(f.anciennete, 365) / 10;
                const scoreBudget = f.montant <= budget.reel ? 30 : -10;
                
                const scoreTotal = scoreUrgence + scoreAnciennete + scoreBudget;
                
                return {
                    ...f,
                    score: scoreTotal
                };
            }).sort((a, b) => b.score - a.score);
        }
    };

    useEffect(() => {
        const chargerModelEtAnalyser = async () => {
            const nouvellesAlertes = [];

            if (budget.reel < 1000) {
                nouvellesAlertes.push({
                    type: 'danger',
                    message: 'Budget réel risque de devenir négatif! Attention aux dépenses supplémentaires.',
                    icon: <DollarSign className="w-5 h-5 mt-0.5 flex-shrink-0" />
                });
            }

            try {
                const recommandationsIA = await analyserDettesAvecIA(budget, dettes);
                setRecommandations(recommandationsIA);
                setModelInitialized(true);

                if (recommandationsIA.length > 0) {
                    const dettePrioritaire = recommandationsIA[0];
                    if (dettePrioritaire.montant <= budget.reel) {
                        nouvellesAlertes.push({
                            type: 'info',
                            message: `Recommandation IA: Remboursez en priorité "${dettePrioritaire.label}" (${dettePrioritaire.montant} DH)`,
                            icon: <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        });
                    }
                    
                    recommandationsIA.forEach(dette => {
                        if (dette.joursRestants <= 7 && dette.joursRestants > 0) {
                            nouvellesAlertes.push({
                                type: 'warning',
                                message: `Deadline proche: "${dette.label}" doit être payée dans ${dette.joursRestants} jours`,
                                icon: <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            });
                        } else if (dette.joursRestants === 0) {
                            nouvellesAlertes.push({
                                type: 'danger',
                                message: `Date limite aujourd'hui pour "${dette.label}" (${dette.montant} DH)`,
                                icon: <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            });
                        }
                    });
                }
            } catch (error) {
                console.error("Erreur lors de l'analyse IA:", error);
                nouvellesAlertes.push({
                    type: 'danger',
                    message: "Erreur de chargement du modèle d'IA. Utilisation du mode de secours.",
                    icon: <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                });
            }

            setAlertes(nouvellesAlertes);
        };

        chargerModelEtAnalyser();
    }, [budget, dettes]);

    return (
        <div className="space-y-4">
            {/* Section des alertes */}
            {alertes.length > 0 && (
                <div className="container mx-auto mt-4">
                    <h2 className="text-lg font-semibold mb-2">Alertes</h2>
                    {alertes.map((alerte, index) => (
                        <div key={index} 
                            className={`p-3 mb-2 rounded-md flex items-start gap-2 
                                ${alerte.type === 'danger' ? 'bg-red-100 text-red-700' : 
                                  alerte.type === 'warning' ? 'bg-amber-100 text-amber-700' : 
                                  'bg-blue-100 text-blue-700'}`}>
                            {alerte.icon}
                            <p>{alerte.message}</p>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Section des recommandations IA */}
            {recommandations.length > 0 ? (
                <div className="container mx-auto mt-2">
                    <div className="flex items-center mb-2">
                        <h2 className="text-lg font-semibold">Recommandations de remboursement (IA)</h2>
                        {modelInitialized && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Modèle TensorFlow actif
                            </span>
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dette</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score IA</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recommandations.map((dette) => (
                                    <tr key={dette.id} className={dette.montant <= budget.reel ? "bg-green-50" : ""}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dette.label}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dette.montant} DH</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {dette.joursRestants === 0 ? 
                                                <span className="text-red-600 font-medium">Aujourd'hui</span> : 
                                                `${dette.joursRestants} jours`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-2 text-sm font-medium text-gray-900">
                                                    {dette.score.toFixed(1)}
                                                </div>
                                                <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                                    <div className={`h-2 rounded-full ${
                                                        dette.score > 75 ? "bg-red-500" : 
                                                        dette.score > 50 ? "bg-amber-500" : 
                                                        dette.score > 25 ? "bg-blue-500" :
                                                        "bg-gray-500"}`}
                                                        style={{ width: `${Math.min(dette.score, 100)}%` }}>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto mt-2 p-4 bg-gray-50 rounded-lg text-center">
                    {modelInitialized ? 
                        <p>Aucune dette à rembourser pour le moment.</p> : 
                        <p>Chargement du modèle d'IA pour l'analyse des dettes...</p>
                    }
                </div>
            )}
        </div>
    );
}