# PokeFinder App 🔍

Mini aplicación móvil de búsqueda de Pokémon desarrollada con **React Native + Expo**, que
consume la [PokeAPI](https://pokeapi.co/) en tiempo real.

> Parcial – React Native con Expo · Carlos Carrascal

---

## 🚀 Cómo ejecutar

```bash
cd PokeFinderApp
npm install
npx expo start
```

Luego:

- Escanea el QR con la app **Expo Go** (Android / iOS), **o**
- Presiona `a` para abrir en un emulador Android, `w` para abrir en el navegador.

> La PokeAPI **no requiere API Key**.

---

## ✅ Requerimientos cubiertos

| Requerimiento | Estado |
|---|---|
| Campo de texto (`TextInput`) para buscar | ✔️ |
| Búsqueda solo con **mínimo 3 caracteres** | ✔️ |
| **Debounce** para evitar peticiones innecesarias | ✔️ (500 ms) |
| Consumo dinámico de la PokeAPI con `fetch` | ✔️ |
| Resultados en **`FlatList`** | ✔️ |
| Mostrar nombre, imagen, tipo(s) y número (ID) | ✔️ |
| **Indicador de carga** (`ActivityIndicator`) | ✔️ |
| Mensaje **"No se encontraron Pokémon"** | ✔️ |
| Manejo de errores de red / API | ✔️ |
| Botón **Limpiar** | ✔️ |
| **Navegación** a pantalla de detalle | ✔️ |
| Detalle: nombre, imagen, ID, tipos, peso, altura | ✔️ |
| Extras: habilidades y **estadísticas base** | ✔️ |
| `useState` / `useEffect` | ✔️ |
| Diseño con `StyleSheet` (estilo Pokédex) | ✔️ |
| Código modular y componentes reutilizables | ✔️ |

---

## 🧠 Detalles técnicos

- **Estados manejados** (`useState`): texto de búsqueda, carga, resultados, error y "búsqueda realizada".
- **`useEffect`**: dispara la búsqueda cuando cambia el texto (ya "debounced") y consulta el detalle al abrir la pantalla.
- **Debounce**: hook propio `useDebounce` que espera 500 ms sin escritura antes de consultar.
- **Cancelación de peticiones**: se usa `AbortController` para descartar respuestas obsoletas
  (evita "race conditions" cuando el usuario sigue escribiendo).
- **Búsqueda por coincidencia**: se descarga una sola vez el índice completo de nombres
  (`/pokemon?limit=100000`) y se filtra localmente; luego se consulta el detalle de las
  primeras coincidencias. Así "pika" devuelve Pikachu y todas sus variantes.

---

## 📁 Estructura del proyecto

```
PokeFinderApp/
├── App.js                      # Raíz: NavigationContainer + Stack (Search → Detail)
└── src/
    ├── api/
    │   └── pokeApi.js          # fetch a la PokeAPI (índice, detalle, búsqueda)
    ├── components/
    │   ├── SearchBar.js        # TextInput + botón limpiar
    │   ├── PokemonCard.js      # Tarjeta de resultado (imagen, nombre, ID, tipos)
    │   ├── TypeBadge.js        # Insignia de color por tipo
    │   ├── StatBar.js          # Barra de estadística base
    │   ├── Loader.js           # Indicador de carga
    │   └── Message.js          # Mensajes de estado (vacío / error / ayuda)
    ├── hooks/
    │   └── useDebounce.js      # Hook de debounce
    ├── screens/
    │   ├── SearchScreen.js     # Pantalla principal de búsqueda
    │   └── DetailScreen.js     # Pantalla de detalle del Pokémon
    ├── theme/
    │   └── colors.js           # Paleta y colores por tipo
    └── utils/
        └── format.js           # Formato de ID, peso, altura, etc.
```

---

## 🌐 API utilizada

- **PokeAPI** – `https://pokeapi.co/api/v2/pokemon/{nombre-o-id}`
- Ejemplo: `https://pokeapi.co/api/v2/pokemon/pikachu`
