# Wassit-Freelancer-DZ

**Plateforme MERN (MongoDB, Express, React, Node.js) pour la gestion des freelances en Algérie**  
Développée avec **TypeScript** sur le frontend comme le backend.

---

## 📁 Structure du projet


---

## 🚀 Stack technique

- **Frontend** : React, TypeScript, TailwindCSS (ou autre lib CSS)
- **Backend** : Node.js, Express, TypeScript
- **Base de données** : MongoDB
- **API** : RESTful (accessible via `/api/v1`)
- **Authentification** : JWT
- **Gestion d'état** : (à préciser selon ton stack, ex: Redux, Context API...)

---

## 🛠️ Installation & Démarrage

### Prérequis

- Node.js >= 18
- MongoDB
- npm ou yarn

### 🔧 Configuration

Créer deux fichiers `.env` : un dans `backend/` et un dans `frontend/`.

#### Exemple `.env` pour le backend :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/wassit
JWT_SECRET=your_jwt_secret
````
📦 Installation
# Installer les dépendances backend
````
cd backend
npm install
````
# Installer les dépendances frontend
````
cd ../frontend
npm install
````
▶️ Lancer le projet
Backend :
````
cd backend
npm run dev
````
Frontend :
````
cd frontend
npm run dev
`````
📚 API
L'API est disponible sur :
http://localhost:PORT/api/v1
