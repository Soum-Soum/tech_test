# Situations mobile

Petite application Expo/React Native pour consulter, rechercher et créer des situations personnelles ou professionnelles.

## Installation

```bash
npm install
```

## Lancement

Le backend FastAPI doit être démarré sur le port `12345`, puis lancez Expo :

```bash
npx expo start
```

## Backend

L'API est attendue sur `http://localhost:12345`.

Selon la plateforme utilisée, l'adresse à joindre depuis le téléphone peut être différente :

- Simulateur iOS : `http://localhost:12345`
- Émulateur Android : `http://10.0.2.2:12345`
- Appareil physique : `http://<IP_LOCALE_DU_PC>:12345`

L'URL par défaut est définie dans `src/api/situations.ts`.
