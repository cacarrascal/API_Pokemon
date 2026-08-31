// Paleta de colores de la app (inspirada en una Pokédex)
export const colors = {
  primary: '#DC0A2D', // Rojo Pokédex
  primaryDark: '#B00821',
  background: '#F2F4F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textLight: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
  danger: '#DC2626',
  accent: '#FFCB05', // Amarillo Pokémon
  shadow: '#000000',
};

// Colores oficiales por tipo de Pokémon
export const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

// Traducción de tipos al español (solo para mostrar)
export const typeLabelsEs = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};

export const getTypeColor = (type) => typeColors[type] || colors.textLight;
export const getTypeLabel = (type) => typeLabelsEs[type] || type;
