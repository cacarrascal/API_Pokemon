// Utilidades de formato para mostrar datos de la PokeAPI.

// Primera letra en mayúscula.
export const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

// Número del Pokémon con ceros a la izquierda: 25 -> "#0025".
export const formatId = (id) => `#${String(id).padStart(4, '0')}`;

// La API entrega el peso en hectogramos -> kilogramos.
export const formatWeight = (weight) => `${(weight / 10).toFixed(1)} kg`;

// La API entrega la altura en decímetros -> metros.
export const formatHeight = (height) => `${(height / 10).toFixed(1)} m`;

// Nombre legible de una estadística base.
export const statLabels = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};
